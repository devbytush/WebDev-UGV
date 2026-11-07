/* eslint-disable */
import { BOTS } from '../data/vehicles';
import { specRows } from '../lib/specs';
import THREE from '../lib/threeLegacy';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const activeModelCleanups=new Set();
const MAX_OUTLINE_INDICES=60000;
const cadBaseColor=compact=>compact&&document.documentElement.getAttribute('data-theme')==='light'?0x0f8060:0x72aa92;

export function disposeBotModel(){
  activeModelCleanups.forEach(cleanup=>cleanup());
  activeModelCleanups.clear();
}

function showBotModel(container,botName,{compact=false}={}){
  const modelFile=`/${botName.toLowerCase()}.glb`;
  container.dataset.modelState='loading';
  container.innerHTML=`<div class="model-status" role="status">Loading ${botName} CAD model…</div>`;

  let renderer,controls,frame,resizeObserver,themeObserver,disposed=false,model,rotationPivot,grid,cleanup;

  const sourceMaterials=new Set();
  const modelMaterials=new Set();
  const scene=new THREE.Scene();
  if(!compact)scene.background=new THREE.Color(0x07121f);
  const camera=new THREE.PerspectiveCamera(35,1,.1,100);
  const cameraHeight=botName==='Valkyrie'?(compact ? 2.5 : 3.2):(compact ? 0.65 : 1.1);
  camera.position.set(0,cameraHeight,compact ? 4.8 : 4.6);
  camera.lookAt(0,0,0);
  scene.add(new THREE.AmbientLight(0xffffff,.8));
  const key=new THREE.DirectionalLight(0xffffff,2);
  key.position.set(3,5,4);
  scene.add(key);
  const fill=new THREE.DirectionalLight(0xffffff,.6);
  fill.position.set(-4,2,-3);
  scene.add(fill);
  if(!compact){
    grid=new THREE.GridHelper(14,28,0x34d399,0x263442);
    grid.position.y=-1.2;
    scene.add(grid);
  }
  const outlines=[];
  const outlineMaterial=new THREE.LineBasicMaterial({color:0x6ee7b7,transparent:true,opacity:.8,depthWrite:false});

  cleanup=()=>{
    if(disposed)return;
    disposed=true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    themeObserver?.disconnect();
    controls?.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    if(model)model.traverse(node=>{
      if(node.isMesh){
        node.geometry.dispose();
        const materials=Array.isArray(node.material)?node.material:[node.material];
        materials.forEach(material=>material.dispose());
      }
    });
    sourceMaterials.forEach(material=>material.dispose());
    outlines.forEach(outline=>outline.geometry.dispose());
    outlineMaterial.dispose();
    if(grid){
      grid.geometry.dispose();
      const gridMaterials=Array.isArray(grid.material)?grid.material:[grid.material];
      gridMaterials.forEach(material=>material.dispose());
    }
    activeModelCleanups.delete(cleanup);
  };
  activeModelCleanups.add(cleanup);
  themeObserver=new MutationObserver(()=>{
    modelMaterials.forEach(material=>material.color?.setHex(cadBaseColor(compact)));
    outlineMaterial.color.setHex(compact&&document.documentElement.getAttribute('data-theme')==='light'?0x0f8060:0x6ee7b7);
  });
  themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

  try{
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setClearColor(0x07121f,compact?0:1);
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=.85;
    renderer.domElement.setAttribute('aria-label',`Interactive 3D model of ${botName}`);
    container.appendChild(renderer.domElement);
    controls=new OrbitControls(camera,renderer.domElement);
    controls.enableDamping=true;
    controls.dampingFactor=.06;
    controls.enablePan=false;
    controls.autoRotate=true;
    controls.autoRotateSpeed=.8;
    controls.minDistance=2;
    controls.maxDistance=20;

    const resize=()=>{
      const width=container.clientWidth,height=container.clientHeight;
      if(!width||!height)return;
      renderer.setSize(width,height,false);
      camera.aspect=width/height;
      camera.updateProjectionMatrix();
    };
    resizeObserver=new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    renderer.render(scene,camera);

    const loader=new GLTFLoader();
    loader.load(modelFile,gltf=>{
      model=gltf.scene;
      if(disposed){
        model.traverse(node=>{
          if(node.isMesh){
            node.geometry.dispose();
            const materials=Array.isArray(node.material)?node.material:[node.material];
            materials.forEach(material=>material.dispose());
          }
        });
        return;
      }
      resize();
      const bounds=new THREE.Box3().setFromObject(model);
      const size=bounds.getSize(new THREE.Vector3());
      const center=bounds.getCenter(new THREE.Vector3());
      const largestDimension=Math.max(size.x,size.y,size.z);
      if(!largestDimension){
        container.dataset.modelState='error';
        container.innerHTML=`<div class="model-status" role="alert">${botName}’s CAD model has no visible geometry.</div>`;
        cleanup();
        return;
      }
      const framingScale=botName==='Valkyrie'?1.3:botName==='Ashwini'?(compact?0.6:0.9):1;
      const scale=2.4/largestDimension*framingScale;
      model.scale.setScalar(scale);
      model.position.copy(center).multiplyScalar(-scale);
      if(botName==='Valkyrie'){
        model.rotation.x=-Math.PI/2;
        const orientedBounds=new THREE.Box3().setFromObject(model);
        model.position.y-=orientedBounds.min.y;
      }
      if(grid)grid.position.y=botName==='Valkyrie' ? -.015 : (bounds.min.y-center.y)*scale-.015;
      rotationPivot=new THREE.Group();
      rotationPivot.add(model);
      scene.add(rotationPivot);
      const meshNodes=[];
      model.traverse(node=>{if(node.isMesh)meshNodes.push(node)});
      let meshIndex=0;
      const prepareBatch=()=>{
        if(disposed)return;
        const batchStart=performance.now();
        try{
          while(meshIndex<meshNodes.length&&(meshIndex===0||performance.now()-batchStart<5)){
            const node=meshNodes[meshIndex++];
            const materials=Array.isArray(node.material)?node.material:[node.material];
            const shadedMaterials=materials.map(material=>{
              sourceMaterials.add(material);
              const shaded=material.clone();
              shaded.vertexColors=false;
              if(shaded.color){shaded.color.setHex(cadBaseColor(compact));modelMaterials.add(shaded)}
              if('map' in shaded)shaded.map=null;
              if(shaded.emissive)shaded.emissive.set(0x000000);
              if('metalness' in shaded)shaded.metalness=.75;
              if('roughness' in shaded)shaded.roughness=.3;
              shaded.needsUpdate=true;
              return shaded;
            });
            node.material=Array.isArray(node.material)?shadedMaterials:shadedMaterials[0];
            const position=node.geometry.getAttribute('position');
            const geometryIndexCount=node.geometry.index?.count||position?.count||0;
            if(geometryIndexCount<=MAX_OUTLINE_INDICES){
              const outline=new THREE.LineSegments(new THREE.EdgesGeometry(node.geometry,15),outlineMaterial);
              outline.scale.setScalar(1.001);
              node.add(outline);
              outlines.push(outline);
            }
          }
        }catch(error){
          console.error(`Could not prepare ${botName} 3D model.`,error);
          container.dataset.modelState='error';
          const status=container.querySelector('.model-status');
          if(status){status.setAttribute('role','alert');status.textContent=`Could not prepare ${botName}’s 3D model.`}
          cleanup();
          return;
        }
        if(meshIndex<meshNodes.length){
          frame=requestAnimationFrame(prepareBatch);
          return;
        }
        container.dataset.modelState='loaded';
        container.dataset.modelLabel=`${botName} · 3D CAD model`;
        container.querySelector('.model-status')?.remove();
        const hint=document.createElement('span');
        hint.className='model-hint';
        hint.textContent='Drag to rotate · scroll to zoom';
        hint.setAttribute('aria-hidden','true');
        container.appendChild(hint);
        let lastRender=0;
        const draw=now=>{
          if(disposed)return;
          const elapsed=lastRender?now-lastRender:1000/60;
          lastRender=now;
          if(rotationPivot)rotationPivot.rotation.y+=.003*(elapsed/(1000/60));
          controls?.update(elapsed/1000);
          renderer.render(scene,camera);
          frame=requestAnimationFrame(draw);
        };
        draw();
      };
      prepareBatch();
    },event=>{
      if(disposed)return;
      const status=container.querySelector('.model-status');
      if(status&&event.total>0){
        const percent=Math.round(event.loaded/event.total*100);
        status.textContent=`Loading ${botName} CAD model… ${percent}%`;
      }
    },()=>{
      if(disposed)return;
      container.dataset.modelState='error';
      container.querySelector('.model-status')?.remove();
      const status=document.createElement('div');
      status.className='model-status';
      status.setAttribute('role','alert');
      status.textContent=`Could not load ${botName}’s model. Add the exported file at public/${modelFile.slice(1)}.`;
      container.appendChild(status);
    });
  }catch(error){
    cleanup();
    container.dataset.modelState='error';
    container.innerHTML='<div class="model-status" role="alert">3D preview could not be started in this browser.</div>';
    console.error(`Could not initialize ${botName} 3D preview.`,error);
  }
  return cleanup;
}

export function showBot(i){
  const b=BOTS[i],n=BOTS.length;
  disposeBotModel();
  document.getElementById('bot-k').textContent=`Vehicle ${String(i+1).padStart(2,'0')} · ${b.platform}`;
  document.getElementById('bot-t').textContent=b.n;
  const hero=document.getElementById('bot-hero');
  hero.dataset.bot=b.n;
  showBotModel(hero,b.n);
document.getElementById('bot-d').textContent=b.d;
  document.getElementById('bot-s').innerHTML=specRows(b.s);
  document.getElementById('bot-sw').innerHTML=BOTS.map((x,j)=>`<a href="#/bot/${j+1}" class="${j===i?'active':''}">0${j+1} ${x.n}</a>`).join('');
  document.getElementById('bot-prev').href='#/bot/'+(((i+n-1)%n)+1);
  document.getElementById('bot-next').href='#/bot/'+(((i+1)%n)+1);
}
export default function fleet() {
  if (window.__eng_fleet) return;
  window.__eng_fleet = 1;
(function(){
const N=BOTS.length,STEP=34,R=130,PITCH=72,PER=N*STEP;
const drum=document.getElementById('drum'),cyl=document.getElementById('drumCyl'),side=document.getElementById('rollSide'),info=document.getElementById('rInfo');
const wrap=a=>((a+PER/2)%PER+PER)%PER-PER/2;
cyl.style.transform='translateZ('+(-R)+'px)';
cyl.innerHTML=BOTS.map((b,i)=>`<a class="drum-row" href="#/bot/${i+1}" data-i="${i}" draggable="false"><span class="n">0${i+1}</span><span class="v">${b.n}</span><span class="y">${b.platform}</span><span class="d">${b.focus}</span><span class="a">↗</span></a>`).join('');
const rows=[...cyl.children];
let pos=2.4,target=0,sel=-1,raf=0,drag=null,suppress=false,started=false,lock=0,engaged=false;
const mod=k=>((k%N)+N)%N;
const near=i=>{let d=mod(i-mod(Math.round(target)));if(d>N/2)d-=N;return d};
const fleetQuotes=[
  'Build it, test it, break it, learn from it, build it better.',
  'A robot is only as good as the team that keeps asking why.',
  'Measure twice. Machine once. Test until it works everywhere.',
  'Every sensor tells a story; engineering is learning how to listen.',
  'The best route is the one your robot can safely find for itself.',
  'Small improvements in the workshop become big moments in the field.',
  'Good robotics is where curious minds meet careful hands.',
  'From first sketch to first drive: progress is built one iteration at a time.'
];
let lastFleetQuote=-1;
function fill(i){const b=BOTS[i];info.innerHTML=String(i+1).padStart(2,'0')+' / '+String(N).padStart(2,'0')+'<span class="rhint"> · drag, click or ↑↓ to roll</span>';
 side.innerHTML=`<div class="rs-photo"><img class="rs-image" src="${b.image}" alt="${b.n}" loading="lazy" decoding="async"></div><div class="rs-body"><h3>${b.n}</h3><div class="specs">${specRows(b.s.slice(0,3))}</div><a class="btn p" href="#/bot/${i+1}">Open ${b.n} profile ↗</a></div>`;
 const quoteIndex=(()=>{let next;do{next=Math.floor(Math.random()*fleetQuotes.length)}while(next===lastFleetQuote);lastFleetQuote=next;return next})();
 const quote=document.getElementById('fleetQuote');quote.querySelector('p').textContent=fleetQuotes[quoteIndex];quote.querySelector('cite').textContent='FIELD NOTE '+String(quoteIndex+1).padStart(2,'0');
}
function render(){
 rows.forEach((el,i)=>{const a=wrap((pos-i)*STEP);
  if(Math.abs(a)>80){el.style.visibility='hidden';el.classList.remove('on');return}
  el.style.visibility='visible';
  el.style.transform='rotateX('+a.toFixed(2)+'deg) translateZ('+R+'px)';
  const c=Math.cos(a*Math.PI/180);el.style.opacity=(.15+.85*c*c*c).toFixed(3);
  el.classList.toggle('on',Math.abs(a)<STEP/2)});
 const k=mod(Math.round(pos));if(k!==sel){sel=k;fill(k)}}
let lt=0;function tick(now){const dt=lt?Math.min(.05,(now-lt)/1000):.016;lt=now;pos+=(target-pos)*(1-Math.exp(-dt*9));if(Math.abs(target-pos)<.001)pos=target;render();raf=(pos!==target||drag)?requestAnimationFrame(tick):(lt=0,0)}
function kick(){if(started&&!raf)raf=requestAnimationFrame(tick)}
function go(t){target=Math.round(t);kick()}
render();
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){started=true;o.disconnect();kick()}},{threshold:.3}).observe(drum);
document.getElementById('rUp').onclick=()=>go(Math.round(target)-1);
document.getElementById('rDn').onclick=()=>go(Math.round(target)+1);
// wheel only rolls the drum once you have engaged with it, so it never traps normal page scrolling
drum.addEventListener('wheel',e=>{if(!engaged||!e.deltaY)return;e.preventDefault();const now=performance.now();if(now-lock<170)return;lock=now;go(Math.round(target)+Math.sign(e.deltaY))},{passive:false});
drum.addEventListener('focus',()=>engaged=true);drum.addEventListener('blur',()=>engaged=false);
drum.addEventListener('pointerleave',()=>{if(document.activeElement!==drum)engaged=false});
drum.addEventListener('keydown',e=>{const t=Math.round(target);if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(t+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(t-1)}else if(e.key==='Enter'){location.hash='#/bot/'+(sel+1)}});
rows.forEach((r,i)=>r.addEventListener('focus',()=>{if(r.matches(':focus-visible'))go(Math.round(target)+near(i))}));
drum.addEventListener('dragstart',e=>e.preventDefault());
drum.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button)return;engaged=true;drag={y:e.clientY,p:target,moved:false};started=true;kick();drum.classList.add('grab')});
addEventListener('pointermove',e=>{if(!drag)return;const dy=e.clientY-drag.y;if(Math.abs(dy)>4)drag.moved=true;target=drag.p-dy/PITCH;kick()});
addEventListener('pointerup',()=>{if(!drag)return;suppress=drag.moved;drag=null;drum.classList.remove('grab');go(target);setTimeout(()=>suppress=false,0)});
cyl.addEventListener('click',e=>{const r=e.target.closest('.drum-row');if(!r)return;if(suppress){e.preventDefault();return}const d=near(+r.dataset.i);if(d!==0){e.preventDefault();go(Math.round(target)+d)}});
})();
}
