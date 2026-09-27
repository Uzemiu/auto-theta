// Read-only candidate model extracted from the independently replayed 3-35/3-36 work.
// NO optics, observation/collapse, worldlines, ghosts, ICE, or conflicting pushes.
// A stack is one rigid body with a stable bit mask of its original BOX/PRISM IDs.
// Input: node stack-cargo-readonly.cjs RECORD [JSON_CONFIG | @CONFIG_FILE]
// Config: observation_event (zero-based), timeline_index; defaults to initial/0.
// replay/prefix: WASDX string. milestones: input numbers; output has no full trace.
// allow_groups: arrays of entity IDs, e.g. [[76,79],[77,78]]; each resulting stack
// must be a subset of one allowed group. Unlisted singletons may stay separate.
// same_type_only: reject mixed BOX/PRISM stacks. max_stack: optional size cap.
// Search target: {groups:[{ids:[76,79],at:[5,6],cargo:false}, ...],
//   players:[[4,6]], free_players:[[4,6]], player_count:2, cargo_count:1,
//   stack_sizes:[2,2,1,1]}. Omitted target fields impose no condition.
// find_boxing:true is also supported. max_states defaults to 100000.
// min_players/max_players (default 1/2), allow_partial_death:false, fixed_objects,
// forbidden_object_cells, gates:[{at:[x,y],buttons:[[x,y]]}] are optional.
// JS API: createModel(record,cfg), replay(model,path,...), search(model,...).
// model.next(state, actionIndex), model.start, model.describe(state), model.serial.
// JS search also accepts accept(state,model) and prune(state,model) callbacks.
// Verified: 3-36 initial->175, including 58/86/99/100, and actual event29->37
// (time100->175) agree on players, entity groups, and cargo with the main record.
'use strict';
const fs = require('fs');
const xy = p => p.slice(0, 2).join(',');
const popcount = n => { let k = 0; for (; n; n &= n - 1) k++; return k; };

function createModel(record, cfg = {}) {
  const o = cfg.observation_event === undefined ? record.initial : record.events[cfg.observation_event]?.observation;
  const t = o?.level?.timelines[cfg.timeline_index || 0];
  if (!t || o.level.world) throw Error('Need an ordinary level observation');
  const ents = t.entities.filter(e => e.active);
  if (t.tiles.some(e => !['SOLID', 'SPIKE'].includes(e.type)) ||
      ents.some(e => !['SOLID','GOAL','PLAYER','BOX','KEY','LOCK','PRISM','BUTTON','BUTTONGATE','COLLECTION'].includes(e.type)) ||
      ents.some(e => e.type === 'PLAYER' && e.properties.ghost))
    throw Error('Unsupported terrain/entity/ghost: optics and DARK are not modeled');
  const objects = ents.filter(e => ['BOX','PRISM'].includes(e.type));
  if (objects.length > 30) throw Error('At most 30 original objects supported');
  const items = ents.filter(e => e.type === 'KEY'), locks = ents.filter(e => e.type === 'LOCK');
  if (items.length > 30 || locks.length > 30) throw Error('Too many item/lock bits');
  const idBit = new Map(objects.map((e,i) => [e.id, 1 << i]));
  const maskFor = ids => ids.reduce((m,id) => {
    if (!idBit.has(id)) throw Error('Unknown object ID ' + id);
    return m | idBit.get(id);
  }, 0);
  const allow = cfg.allow_groups?.map(maskFor);
  function allowed(mask) {
    if (cfg.max_stack && popcount(mask) > cfg.max_stack) return false;
    if (allow && popcount(mask) > 1 && !allow.some(a => (mask & a) === mask)) return false;
    if (cfg.same_type_only && new Set(objects.filter((e,i) => mask & (1 << i)).map(e => e.type)).size > 1) return false;
    return true;
  }
  const dirs = [[0,1],[-1,0],[0,-1],[1,0]];
  const mv = (p,d) => [(p[0]+dirs[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+dirs[d][1]+t.size[1]+1)%(t.size[1]+1)];
  const walls = new Set(ents.filter(e => e.blockable && !['BOX','PRISM','LOCK','BUTTONGATE'].includes(e.type)).map(e => xy(e.pos)));
  const safe = new Set([...t.tiles.filter(e => e.type === 'SOLID'), ...ents.filter(e => e.floor)].map(e => xy(e.pos)));
  const floor = new Set([...t.tiles, ...ents.filter(e => e.floor)].map(e => xy(e.pos)));
  const gates = new Map((cfg.gates || []).map(g => [xy(g.at), g.buttons.map(xy)]));
  for (const e of ents.filter(e => e.type === 'BUTTONGATE')) if (!gates.has(xy(e.pos))) throw Error('Explicit gate mapping required at ' + xy(e.pos));
  const start = {p:[], b:[], m:[], c:0, l:0};
  // Actual records retain contained object entities; combine them by their observed cell.
  for (let i=0; i<objects.length; i++) {
    const e=objects[i]; let j=start.b.findIndex(b => xy(b) === xy(e.pos));
    if (j<0) { j=start.b.length; start.b.push(e.pos.slice()); start.m.push(0); }
    start.m[j] |= 1 << i;
  }
  if (start.m.some(m => !allowed(m))) throw Error('Initial stacks violate configured groups');
  for (const e of ents.filter(e => e.type === 'PLAYER')) {
    const v=e.properties; let container=-1;
    if (v.contained) {
      const bit=idBit.get(v.container); container=start.m.findIndex(m => bit && (m & bit));
      if (container<0) throw Error('Active player has an unknown container');
    }
    start.p.push([...e.pos,v.face,v.split || 0,container,v.key || 0]);
  }
  const serial = s => s.p.map(p => [p[0],p[1],p[3] ? p[2] : 0,p[3],p[4]<0 ? 0 : s.m[p[4]],p[5]].join(',')).sort().join(';') + '|' + s.b.map((b,i) => s.m[i]+':'+xy(b)).sort().join(';') + '|' + s.c + '|' + s.l;
  const open = (s,z) => !gates.has(xy(z)) || gates.get(xy(z)).some(b => s.b.some(q => xy(q)===b) || s.p.some(p => xy(p)===b)) ||
    (cfg.hold_occupied_gates !== false && (s.b.some(b => xy(b)===xy(z)) || s.p.some(p => xy(p)===xy(z))));
  function next(s,a) {
    if (!Number.isInteger(a) || a<0 || a>4) throw Error('Action must be WASDX/index 0..4');
    const bi=z=>s.b.findIndex(b=>xy(b)===xy(z));
    let plans=new Map(),np=[],c=s.c,l=s.l,bad=false;
    const li=z=>locks.findIndex((e,i)=>!(l&(1<<i))&&xy(e.pos)===xy(z));
    const blocked=z=>walls.has(xy(z))||!open(s,z);
    function chain(i,d) {
      const out=[];
      while(i>=0) {
        if(out.includes(i)) return null;
        out.push(i);const z=mv(s.b[i],d);
        if(blocked(z)||!floor.has(xy(z))||(li(z)>=0&&!s.p.some(p=>p[4]===i&&p[5]>0))) return null;
        i=bi(z);
      }
      return out;
    }
    function can(v,d) {const z=mv(v,d);if(blocked(z)||(li(z)>=0&&!v[5]))return false;const i=bi(z);return i<0||!!chain(i,d);}
    function land(v,d,face,fork) {
      let key=v[5];const z=mv(v,d),i=bi(z);
      if(i>=0) {const ch=chain(i,d);if(!ch){bad=true;return;}for(const j of ch){if(plans.has(j)&&plans.get(j)!==d)bad=true;plans.set(j,d);}}
      const lock=li(z);if(lock>=0){if(cfg.keep_locks_closed){bad=true;return;}l|=1<<lock;key--;}
      for(let j=0;j<items.length;j++)if(!(c&(1<<j))&&xy(items[j].pos)===xy(z)){c|=1<<j;if(items[j].details.isFork)fork++;else key++;}
      if(!safe.has(xy(z))){if(cfg.allow_partial_death===false)bad=true;return;}
      np.push([...z,face,fork,-1,key]);
    }
    for(const v of s.p) {
      if(v[4]>=0){if(a===4&&v[3]>0)return null;np.push([v[0],v[1],a===4?v[2]:a,v[3],v[4],v[5]]);continue;}
      if(a===4) {
        if(!v[3]){np.push(v.slice());continue;}
        const targets=new Set();let attempted=false;
        for(const off of [1,3]){let d=(v[2]+off)%4;if(!can(v,d))d=v[2];if(can(v,d)){const z=mv(v,d),lock=locks.findIndex((e,i)=>!(s.l&(1<<i))&&xy(e.pos)===xy(z));if(lock>=0){if(targets.has(lock))return null;targets.add(lock);}attempted=true;land(v,d,v[2],v[3]-1);}}
        if(!attempted)np.push([v[0],v[1],v[2],v[3]-1,-1,v[5]]);
      } else {
        let moved=false;for(let k=0;k<4;k++){const d=(a+k)%4;if(!can(v,d))continue;land(v,d,d,v[3]);moved=true;break;}if(!moved)np.push(v.slice());
      }
    }
    if(bad)return null;
    const nb=s.b.map((v,i)=>plans.has(i)?mv(v,plans.get(i)):v.slice());
    // Resolve old container positions/capture before remapping body indices.
    for(const p of np) {
      if(p[4]>=0){p[0]=nb[p[4]][0];p[1]=nb[p[4]][1];if(plans.has(p[4])){const lock=li(p);if(lock>=0){if(p[5]<=0||cfg.keep_locks_closed)return null;p[5]--;l|=1<<lock;}for(let j=0;j<items.length;j++)if(!(c&(1<<j))&&xy(items[j].pos)===xy(p)){c|=1<<j;if(items[j].details.isFork)p[3]++;else p[5]++;}}}
      else {const i=nb.findIndex(b=>xy(b)===xy(p));if(i>=0)p[4]=i;}
    }
    const b=[],m=[],remap=[];
    for(let i=0;i<nb.length;i++){let j=b.findIndex(z=>xy(z)===xy(nb[i]));if(j<0){j=b.length;b.push(nb[i]);m.push(0);}m[j]|=s.m[i];remap[i]=j;}
    if(m.some(mask=>!allowed(mask)))return null;
    const merged=[];
    for(const v of np){if(v[4]>=0)v[4]=remap[v[4]];const p=merged.find(p=>xy(p)===xy(v)&&p[4]===v[4]);if(p){p[3]=Math.max(p[3],v[3]);p[5]=Math.max(p[5],v[5]);}else merged.push(v);}
    return {p:merged,b,m,c,l};
  }
  function describe(s) {
    return {players:s.p.map(p=>({at:p.slice(0,2),fork:p[3],key:p[5],cargo:p[4]<0?null:objects.filter((e,i)=>s.m[p[4]]&(1<<i)).map(e=>e.id)})),
      groups:s.b.map((at,j)=>({at,mask:s.m[j],ids:objects.filter((e,i)=>s.m[j]&(1<<i)).map(e=>e.id),types:objects.filter((e,i)=>s.m[j]&(1<<i)).map(e=>e.type)}))};
  }
  function matches(s,target=cfg.target || {}) {
    if(cfg.find_boxing&&!s.p.some(p=>p[4]>=0))return false;
    if(target.player_count!==undefined&&s.p.length!==target.player_count)return false;
    if(target.cargo_count!==undefined&&s.p.filter(p=>p[4]>=0).length!==target.cargo_count)return false;
    if(target.stack_sizes&&JSON.stringify(s.m.map(popcount).sort((a,b)=>a-b))!==JSON.stringify([...target.stack_sizes].sort((a,b)=>a-b)))return false;
    if((target.players||[]).some(g=>!s.p.some(p=>xy(p)===xy(g))))return false;
    if((target.free_players||[]).some(g=>!s.p.some(p=>p[4]<0&&xy(p)===xy(g))))return false;
    return (target.groups||[]).every(g=>s.m.some((m,i)=>m===maskFor(g.ids)&&(!g.at||xy(s.b[i])===xy(g.at))&&(g.cargo===undefined||s.p.some(p=>p[4]===i)===g.cargo)));
  }
  return {start,next,serial,describe,matches,objects,maskFor,cfg};
}

function replay(model,path,options={}) {
  let s=options.start||model.start;const milestones=[];
  for(let i=0;i<path.length;i++) {
    s=model.next(s,'WASDX'.indexOf(path[i]));
    if(!s)return {valid:false,failed_step:i+1,action:path[i],milestones};
    if((options.milestones||[]).includes(i+1))milestones.push({step:i+1,...model.describe(s)});
  }
  return {valid:true,steps:path.length,state:s,final:model.describe(s),milestones};
}
function search(model,options={}) {
  const cfg={...model.cfg,...options},start=options.start||model.start;
  if(!cfg.target&&!cfg.find_boxing&&!cfg.accept)throw Error('Search needs target/find_boxing/accept');
  const accept=cfg.accept||((s)=>(!cfg.find_boxing||s.p.some(p=>p[4]>=0))&&model.matches(s,cfg.target));
  const q=[[start,-1,-1]],seen=new Set([model.serial(start)]),limit=cfg.max_states||100000;
  const forbidden=new Set((cfg.forbidden_object_cells||[]).map(xy));
  let end=-1,processed=0;
  for(let i=0;i<q.length&&i<limit;i++) {
    processed++;const s=q[i][0];if(accept(s,model)){end=i;break;}
    for(let a=0;a<5;a++) {
      const n=model.next(s,a);if(!n||n.p.length<(cfg.min_players??1)||n.p.length>(cfg.max_players??2)||n.b.some(b=>forbidden.has(xy(b)))||
        (cfg.fixed_objects&&n.b.some((b,j)=>{const k=start.m.indexOf(n.m[j]);return k<0||xy(b)!==xy(start.b[k]);}))||(cfg.prune&&cfg.prune(n,model)))continue;
      const key=model.serial(n);if(seen.has(key))continue;seen.add(key);q.push([n,i,a]);
    }
  }
  let route=null,result=null;
  if(end>=0){route='';for(let i=end;q[i][1]>=0;i=q[i][1])route='WASDX'[q[i][2]]+route;result=replay(model,route,{start,milestones:cfg.milestones});}
  return {found:end>=0,route,steps:route?.length,processed,seen:seen.size,queue_exhausted:end<0&&processed===q.length,truncated:end<0&&processed<q.length,
    ...(result?{final:result.final,milestones:result.milestones}:{})};
}
module.exports={createModel,replay,search};
if(require.main===module) {
  try {
    const record=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,''));
    const arg=process.argv[3]||'{}',cfg=JSON.parse(arg.startsWith('@')?fs.readFileSync(arg.slice(1),'utf8').replace(/^\uFEFF/,''):arg);
    const model=createModel(record,cfg);let start=model.start;
    if(cfg.prefix){const r=replay(model,cfg.prefix);if(!r.valid)throw Error('Invalid prefix step '+r.failed_step);start=r.state;}
    let result=cfg.replay!==undefined?replay(model,cfg.replay,{start,milestones:cfg.milestones}):search(model,{...cfg,start});
    delete result.state;
    console.log(JSON.stringify({model:'stack-cargo-readonly-hypothesis',optics_simulated:false,...result}));
    if(result.valid===false)process.exitCode=1;
  } catch(e) {console.error(e.message);process.exitCode=1;}
}
