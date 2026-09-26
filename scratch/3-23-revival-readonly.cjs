// Read-only 3-23 candidate model, based solely on observed terrain and M068/M078.
// This models the three prisms confined to column 1, permanent DARK removal,
// and only the living branch of a safe ghost observation. It is not a general
// optical/worldline solver and cannot itself prove game completion.
const fs = require('fs');
const vm = require('vm');
let code = fs.readFileSync('scratch/3-23-dynamic-readonly.cjs', 'utf8');
function replace(from, to) {
  if (!code.includes(from)) throw new Error('Base model changed: ' + from);
  code = code.replace(from, to);
}
replace('const serial=s=>', 'const serial=s=>(s.d??511)+"|"+(s.revived?1:0)+"|"+');
replace('let plan=new Map(),np=[],c=s.c,bad=false;',
  'let plan=new Map(),np=[],c=s.c,bad=false; const dk=[...dark];let mask=s.d??511;const remains=z=>{const i=dk.indexOf(xy(z));return i>=0&&!!(mask&(1<<i));};');
replace('!dark.has(xy(z))', '!remains(z)');
replace('if(dark.has(xy(z)))', 'if(remains(z))');
replace('const merged=[];', `let revived=false;
 if(b.some(z=>xy(z)==='1,9')){
  for(let i=0;i<dk.length;i++){
   const [xx,yy]=dk[i].split(',').map(Number);
   const lit=b.some(z=>z[0]===1&&z[1]===yy&&Array.from({length:xx-1},(_,j)=>[j+2,yy]).every(q=>!walls.has(xy(q))));
   if(lit){mask&=~(1<<i);for(const p of np)if(p[4]&&xy(p)===dk[i]){if(safe.has(dk[i])){p[4]=0;revived=true;}else p.dead=true;}}
  }
 }
 np=np.filter(p=>!p.dead);
 const merged=[];`);
replace('return {p:merged,b,c,wait:', 'return {p:merged,b,c,d:mask,revived,wait:');
replace('const success=s=>', 'const success=s=>s.revived&&');
vm.runInNewContext(code, {
  require,
  process: {
    argv: ['node', 'model', process.argv[2] || 'artifacts/slot1-playthrough/3-23.json', process.argv[3] || '{"max_states":60000}'],
    exit: process.exit.bind(process)
  },
  console: {log(text) {
    const result = JSON.parse(text);
    result.model = '3-23-column-prisms-permanent-dark-safe-revival-hypothesis';
    console.log(JSON.stringify(result));
  }}
});
