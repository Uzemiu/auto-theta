"""Generate machine-local stdio configurations from the current interpreter and checkout."""
import argparse
import json
from pathlib import Path
import re
import sys


def configure(root: Path, python: Path, write_codex: bool = False) -> None:
    root, python = root.resolve(), python.resolve()
    if not (root / 'theta.py').is_file() or not python.is_file():
        raise ValueError('Expected a checkout containing theta.py and a Python executable')
    config_path = root / '.codex' / 'config.toml'
    if write_codex and config_path.exists():
        # Do not rewrite unrelated Codex settings using a lossy TOML round trip.
        old = config_path.read_text(encoding='utf-8-sig')
        sections = re.findall(r'^\s*\[([^\]\r\n]+)\]\s*(?:#.*)?$', old, re.M)
        prefix = old.split('[', 1)[0]
        if not sections or any(s not in ('mcp_servers.theta_game', 'mcp_servers.theta_game.env') for s in sections) or any(
                line.strip() and not line.lstrip().startswith('#') for line in prefix.splitlines()):
            raise ValueError('Existing .codex/config.toml has other settings. Run without -ConfigureCodex and merge .runtime/codex-mcp.toml manually.')
    runtime = root / '.runtime'
    runtime.mkdir(exist_ok=True)
    (runtime / 'temp').mkdir(exist_ok=True)
    args = [str(root / 'theta.py'), '--config', str(root / 'theta.local.json'), 'mcp']
    env = {'PYTHONIOENCODING': 'utf-8', 'PYTHONUTF8': '1',
           'TEMP': str(runtime / 'temp'), 'TMP': str(runtime / 'temp')}
    server = {'command': str(python), 'args': args, 'env': env}
    (runtime / 'mcp.json').write_text(json.dumps({'mcpServers': {'theta_game': server}}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    quote = lambda value: json.dumps(value, ensure_ascii=False)
    toml = '\n'.join([
        '# Generated locally by install.ps1; rerun after moving the checkout or Python.',
        '[mcp_servers.theta_game]', f'command = {quote(str(python))}',
        'args = [' + ', '.join(quote(arg) for arg in args) + ']',
        f'cwd = {quote(str(root))}', 'startup_timeout_sec = 10', 'tool_timeout_sec = 60',
        'enabled = true', '', '[mcp_servers.theta_game.env]',
        *(f'{key} = {quote(value)}' for key, value in env.items()), '',
    ])
    (runtime / 'codex-mcp.toml').write_text(toml, encoding='utf-8')
    (runtime / 'python-path.txt').write_text(str(python) + '\n', encoding='utf-8')
    if write_codex:
        config_path.parent.mkdir(exist_ok=True)
        if config_path.exists():
            # Keep the first configuration as a local backup; never publish it.
            backup = runtime / 'codex-config.before-install.toml'
            if not backup.exists():
                backup.write_bytes(config_path.read_bytes())
        config_path.write_text(toml, encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write-codex', action='store_true')
    options = parser.parse_args()
    try:
        configure(Path(__file__).resolve().parents[1], Path(sys.executable), options.write_codex)
    except (OSError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        raise SystemExit(1)
    print('Generated .runtime/mcp.json and .runtime/codex-mcp.toml (local paths; no token).')
