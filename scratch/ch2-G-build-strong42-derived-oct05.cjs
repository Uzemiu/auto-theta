// Copy only this helper's public model runner; no game/canonical operations.
const fs=require('fs');
let code=fs.readFileSync('scratch/ch2-G-strong38-second-forces-oct05.cjs','utf8');
code=code.replace("require('./ch2-G-m132-blocked-source-model-oct05.cjs')","require('./ch2-G-m133-wallstopped-a-moving-w-model-oct05.cjs')");
code=code.replace("let m=createModel(o),engine='m132-conservative';","let m=createModel(o),engine='m133-a-wall-w-cross-finite';");
code=code.replace("const raw38='DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW',parentIndex=2266949;","const fixed=require('./ch2-G-strong-parent2400844-probe-oct05.cjs'),raw38=fixed.sequence,parentIndex=fixed.parentIndex;");
code=code.replace('const deployed=m.replay(raw38);','const deployed={valid:true,states:fixed.final.leaves};');
code=code.replaceAll('raw38','raw42').replaceAll('ch2-G-strong38-second-forces-oct05.v8','ch2-G-strong42-second-forces-oct05.v8');
code=code.replace('await runTo(200000);','await runTo(20000);');
code=code.replace('raw strong38 children physically verified actual98; continuations MODEL','MODEL parent2400844 raw42 children from exact fixed probe; not yet actual102');
code=code.replace('Strong38 fixed source mismatch','New42 fixed MODEL source mismatch');
code=code.replace('// Derived continuations of the two concrete strong38 leaves. Public M132','// MODEL continuations of parent2400844 two leaves; conditional until actual102. Finite M133');
fs.writeFileSync('scratch/ch2-G-strong42-second-forces-oct05.cjs',code);
console.log('PRIVATE_NEW42_RUNNER_WRITTEN_FROM_FIXED_PROBE_ONLY');
