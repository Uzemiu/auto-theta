"""Portable installer checks using local fixtures; never modify the installed game."""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('configure_mcp', ROOT / 'tools/configure-mcp.py')
configure_mcp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(configure_mcp)


class PortableInstallTests(unittest.TestCase):
    def setUp(self):
        base = ROOT / '.runtime' / 'install-tests'
        base.mkdir(parents=True, exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(prefix='portable ', dir=base)
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / '中文 project'
        self.root.mkdir()
        shutil.copyfile(ROOT / 'theta.py', self.root / 'theta.py')

    def test_generated_mcp_starts_from_unrelated_working_directory(self):
        configure_mcp.configure(self.root, Path(sys.executable), True)
        server = json.loads((self.root / '.runtime/mcp.json').read_text(encoding='utf-8'))['mcpServers']['theta_game']
        request = {'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25'}}
        run = subprocess.run([server['command'], *server['args']], cwd=ROOT,
                             env={**os.environ, **server['env']}, input=json.dumps(request) + '\n',
                             capture_output=True, encoding='utf-8', timeout=10)
        self.assertEqual(run.returncode, 0, run.stderr)
        self.assertIn('serverInfo', json.loads(run.stdout)['result'])
        toml = (self.root / '.runtime/codex-mcp.toml').read_text(encoding='utf-8')
        if sys.version_info >= (3, 11):
            import tomllib
            entry = tomllib.loads(toml)['mcp_servers']['theta_game']
            self.assertEqual(entry['args'], server['args'])
            self.assertEqual(entry['env'], server['env'])
        self.assertEqual((self.root / '.codex/config.toml').read_text(encoding='utf-8'), toml)

    def test_regeneration_after_move_preserves_other_codex_settings(self):
        configure_mcp.configure(self.root, Path(sys.executable), True)
        moved = self.root.with_name('moved project')
        self.root.rename(moved)
        configure_mcp.configure(moved, Path(sys.executable), True)
        generated = (moved / '.runtime/mcp.json').read_text(encoding='utf-8')
        self.assertIn(str(moved).replace('\\', '\\\\'), generated)
        unrelated = '[model_providers.custom]\nname = "keep"\n'
        config = moved / '.codex/config.toml'
        config.write_text(unrelated, encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'other settings'):
            configure_mcp.configure(moved, Path(sys.executable), True)
        self.assertEqual(config.read_text(encoding='utf-8'), unrelated)
        configure_mcp.configure(moved, Path(sys.executable))
        self.assertEqual(config.read_text(encoding='utf-8'), unrelated)

    @unittest.skipUnless(os.name == 'nt', 'PowerShell installer is Windows-only')
    def test_configure_only_installer_and_cli_in_relocated_checkout(self):
        (self.root / 'tools').mkdir()
        for name in ('install-common.ps1', 'configure-mcp.py', 'run-cli.ps1'):
            shutil.copyfile(ROOT / 'tools' / name, self.root / 'tools' / name)
        shutil.copyfile(ROOT / 'install.ps1', self.root / 'install.ps1')
        shutil.copyfile(ROOT / 'theta.cmd', self.root / 'theta.cmd')
        run = subprocess.run(['powershell.exe', '-NoProfile', '-ExecutionPolicy', 'Bypass',
                              '-File', str(self.root / 'install.ps1'), '-ConfigureOnly',
                              '-ConfigureCodex', '-Python', sys.executable],
                             cwd=ROOT, capture_output=True, timeout=20)
        self.assertEqual(run.returncode, 0, run.stderr)
        self.assertTrue((self.root / '.runtime/mcp.json').is_file())
        self.assertFalse((self.root / 'theta.local.json').exists())
        self.assertFalse((self.root / '.deps').exists())
        run = subprocess.run(['cmd.exe', '/c', str(self.root / 'theta.cmd'), 'observe', '--help'],
                             cwd=ROOT, capture_output=True, timeout=20)
        self.assertEqual(run.returncode, 0, run.stderr)
        self.assertIn(b'--full', run.stdout)

    @unittest.skipUnless(os.name == 'nt', 'Steam registry and PowerShell installer are Windows-only')
    def test_steam_secondary_libraries_and_invalid_paths(self):
        steam = self.root / 'Steam'
        library = self.root / 'Other Library'
        game = library / 'steamapps/common/Game Name'
        managed = game / 'Theta and Paralldox on Worldlines_Data/Managed'
        managed.mkdir(parents=True)
        (game / 'Theta and Paralldox on Worldlines.exe').touch()
        (managed / 'Assembly-CSharp.dll').touch()
        (steam / 'steamapps').mkdir(parents=True)
        vdf = steam / 'steamapps/libraryfolders.vdf'
        path = str(library).replace('\\', '\\\\')
        manifest = library / 'steamapps/appmanifest_3219580.acf'
        manifest.write_text('"AppState" { "appid" "3219580" "installdir" "Game Name" }', encoding='utf-8')
        script = self.root / 'discover.ps1'
        script.write_text('param($Helper, $SteamRoot)\n$ErrorActionPreference="Stop"\n'
                          '. $Helper\nResolve-ThetaGamePath -SteamPath $SteamRoot\n', encoding='utf-8')
        def run():
            env = os.environ.copy()
            env.pop('THETA_GAME_PATH', None)
            return subprocess.run(['powershell.exe', '-NoProfile', '-File', str(script),
                                   str(ROOT / 'tools/install-common.ps1'), str(steam)],
                                  env=env, capture_output=True, timeout=15)
        for contents in ('"libraryfolders" { "1" { "path" "' + path + '" } }',
                         '"LibraryFolders" { "1" "' + path + '" }'):
            vdf.write_text(contents, encoding='utf-8')
            result = run()
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn(b'Game Name', result.stdout)
        manifest.write_text('"installdir" "..\\..\\outside"', encoding='utf-8')
        self.assertNotEqual(run().returncode, 0)


if __name__ == '__main__':
    unittest.main()
