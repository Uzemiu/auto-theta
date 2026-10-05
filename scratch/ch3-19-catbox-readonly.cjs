const fs=require('fs'),vm=require('vm');
const cfg={observation_event:45,gates:[{at:[3,6],buttons:[[8,1]]},{at:[4,6],buttons:[[9,1]]}],hold_occupied_gates:true,allow_partial_death:false,...JSON.parse(process.argv[2]||'{}')};
if(cfg.observation_event===null)delete cfg.observation_event;
const context={require,process:{argv:['node','model','artifacts/slot1-playthrough/3-19.json',JSON.stringify(cfg)]}};
let source=fs.readFileSync('scratch/root-cargo-gates.cjs','utf8').split('if(cfg.replay)')[0];
if(cfg.find_overlap)source=source.replace('if(new Set(nb.map(xy)).size!==nb.length)return null;', 'if(new Set(nb.map(xy)).size!==nb.length)return {p:np,b:nb,c,l,overlap:true,before:s,input:a};');
vm.runInNewContext(source+';globalThis.model={start,next,serial};',context);
const {next,serial}=context.model;
let start=context.model.start;
if(cfg.prefix)for(const a of cfg.prefix){start=next(start,'WASDX'.indexOf(a));if(!start)throw Error('prefix invalid');}
if(cfg.replay){for(const a of cfg.replay){start=next(start,'WASDX'.indexOf(a));console.log(a,JSON.stringify(start));if(!start)break;}process.exit();}
const banned=new Set(cfg.banned||['7,5','9,7']);
function valid(s){return s&&s.p.length===2&&(cfg.allow_cargo||s.p.every(p=>p[4]<0))&&s.b.every(b=>(cfg.allow_right||b[0]<10)&&!banned.has(b.join(',')))&&(!cfg.freeze||cfg.freeze.every(pos=>s.b.some(b=>b.join(',')===pos))); }
function goal(s){if(cfg.find_overlap)return !!s.overlap;if(cfg.key_cargo)return s.p.some(p=>p[4]>=0&&p[5]>0);if(cfg.trap)return ['6,4','7,4','8,3','9,4'].every(pos=>s.b.some(b=>b.join(',')===pos))&&s.p.some(p=>p[0]===8&&p[1]===4);return s.b.every(b=>!(b[0]===9&&b[1]>=3));}
const q=[[start,-1,'']],seen=new Set([serial(start)]);let end=-1,i=0;
for(;i<q.length&&i<(cfg.limit||60000);i++){
 const s=q[i][0];if(goal(s)){end=i;break;}
 for(let a=0;a<4;a++){const n=next(s,a);if(!valid(n))continue;const k=serial(n);if(seen.has(k))continue;seen.add(k);q.push([n,i,'WASD'[a]]);}
}
let route='',trace=[];if(end>=0){for(let j=end;q[j][1]>=0;j=q[j][1]){route=q[j][2]+route;trace.unshift(q[j][0]);}}
console.log(JSON.stringify({cfg,start,processed:i,seen:seen.size,pending:q.length-i,found:end>=0,route,trace}));
