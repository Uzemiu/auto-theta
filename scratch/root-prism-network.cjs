const fs=require('fs');
const record=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,''));
const o=record.initial,t=o.level.timelines[0],key=p=>p.join(',');
const dirs=[[0,1],[-1,0],[0,-1],[1,0]],walls=new Set(t.entities.filter(e=>e.active&&e.blockable&&e.type==='SOLID').map(e=>key(e.pos)));
const goals=o.level.goals, fixed=goals.map(key), safe=[];
for(let x=1;x<t.size[0];x++)for(let y=1;y<t.size[1];y++)if(!walls.has(key([x,y])))safe.push([x,y]);
// Hypothesis only: an adjacent opaque obstacle disables a direction; a nonempty
// ray ending at a wall needs a player. Prism redirects to the three forward/side
// directions; revisiting a directed prism state is permitted. Not game code.
function satisfies(prisms,players,goal){
 const ps=new Set(prisms.map(key)),people=new Set(players.map(key)),queue=[[goal,-1]],seen=new Set();
 while(queue.length){const [at,back]=queue.pop(),k=key(at)+':'+back;if(seen.has(k))continue;seen.add(k);
  for(let d=0;d<4;d++){if(d===back)continue;let p=at.slice(),distance=0;
   for(let cap=0;cap<40;cap++){
    p=[p[0]+dirs[d][0],p[1]+dirs[d][1]];const s=key(p);
    if(walls.has(s)){if(distance>0)return false;break;}
    if(p[0]<0||p[1]<0||p[0]>t.size[0]||p[1]>t.size[1])return false;
    distance++;
    if(people.has(s))break;
    if(ps.has(s)){queue.push([p,(d+2)%4]);break;}
   }
  }
 }return true;
}
const mov=safe.filter(p=>!fixed.includes(key(p)));let checks=0,found=[];
if(process.argv[3]==='single-se'){
 const goal=[7,1];
 outerSingle:for(let i=0;i<mov.length;i++)for(let j=i+1;j<mov.length;j++){
  const pr=[...goals,mov[i],mov[j]],prs=new Set(pr.map(key));
  for(const p of safe){if(prs.has(key(p)))continue;checks++;
   if(satisfies(pr,[p],goal)){found.push({prisms:[mov[i],mov[j]],player:p});if(found.length>=20)break outerSingle;}
  }
 }
 console.log(JSON.stringify({hypothesis:'single-goal-ray-network-no-motion',goal,checks,found}));process.exit();
}
outer:for(let i=0;i<mov.length;i++)for(let j=i+1;j<mov.length;j++){
 const pr=[...goals,mov[i],mov[j]],prs=new Set(pr.map(key)),pl=safe.filter(p=>!prs.has(key(p)));
 for(let a=0;a<pl.length;a++)for(let b=a+1;b<pl.length;b++){
  if((pl[a][0]+pl[a][1])%2!==(pl[b][0]+pl[b][1])%2)continue;
  checks++;
  if(goals.every(g=>satisfies(pr,[pl[a],pl[b]],g))){found.push({prisms:[mov[i],mov[j]],players:[pl[a],pl[b]]});if(found.length>=12)break outer;}
 }
}
console.log(JSON.stringify({hypothesis:'unverified-ray-network-no-motion',checks,found}));
