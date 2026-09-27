// Read-only bounded planner adapter. Loads the observation-based ordinary model; no game I/O.
const fs=require('fs');let src=fs.readFileSync('scratch/root-cargo-gates.cjs','utf8');
src=src.replace('const start={','let start={');
src=src.replace('if(cfg.replay){',`if(cfg.prefix){for(const a of cfg.prefix){start=next(start,'WASDX'.indexOf(a));if(!start)throw Error('Prefix invalid');}}
if(cfg.replay){`);
src=src.replace('const success=s=>','const success=s=>cfg.capture? s.p.some(p=>p[4]>=0&&xy(p)===xy(cfg.capture)):');
src=src.replace('if(!n||n.p.length<','if(!n || (cfg.fixed_boxes && cfg.fixed_boxes.some(b=>!n.b.some(z=>xy(z)===xy(b)))) || n.p.length<');
src=src.replace('if(!n ||', 'if(!n || (cfg.freeze_until_capture && !n.p.some(p=>p[4]>=0) && n.b.some((b,i)=>xy(b)!==xy(start.b[i]))) ||');
src=src.replace('actions,trace}));','actions,last:trace.at(-1)}));');
eval(src);
