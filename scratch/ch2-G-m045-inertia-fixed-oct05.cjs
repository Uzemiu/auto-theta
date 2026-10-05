// Fixed six logged boundary paths only. No graph rerun or game/save calls.
const fs=require('fs'),assert=require('assert'),{createModel}=require('./ch2-G-m045-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const paths=['WDWDASSAWWWWDWADW','WDWDASSAWWWWDWADD','WDWDASSAWWWWDWADSWW','WDWDASSAWWWWDWADSWD','WDWDASSAWWWWDDAWADW','WDWDASSAWWWWDDAWADD'];
const results=paths.map(path=>{
 const m=createModel(j.events[79].observation);let s=m.start,y=6,rightFace=2,pre,preRight105;
 for(let i=0;i<path.length;i++){
  const a=path[i];preRight105={at:[14,y],face:m.A[rightFace]};let dy='WD'.includes(a)?1:-1;if(y+dy<4||y+dy>10)dy=-dy;y+=dy;rightFace=dy>0?0:2;
  pre=s;const r=m.next(s,m.A.indexOf(a),{find_probe:true,strictCross:true});
  if(i<path.length-1){assert(r&&!r.probe&&!r.conflict,'earlier unknown at '+path+'/'+(i+1));assert(r.p.length>=3);s=r;continue;}
  assert.equal(r.probe,'different-inertial-BOX-requests');assert.equal(r.box,118);assert.equal(r.tick,5);assert.equal(r.state.p.length,2);
  return {path,length:path.length,input:a,earlierAccepted:true,pre:m.describe(pre),preRight105,kind:r.probe,unknownMicrotick:r.tick,box:r.box,requests:r.requests,micro:m.describe(r.state),proposed:r.proposedPlayers,right105:{at:[14,y],face:m.A[rightFace]},allPreviousRightSafe:true};
 }
});
if(require.main===module)console.log(JSON.stringify(results.map(r=>({path:r.path,length:r.length,input:r.input,earlierAccepted:r.earlierAccepted,prePlayers:r.pre.players.map(p=>({...p,face:'WASD'[p.face]})),preRight105:r.preRight105,kind:r.kind,unknownMicrotick:r.unknownMicrotick,box:r.box,requests:r.requests,leftAtBoundary:r.micro.players,right105:r.right105})),null,2));
module.exports={results};
