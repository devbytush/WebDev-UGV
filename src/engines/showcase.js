/* eslint-disable */
import THREE from '../lib/threeLegacy';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { cl, CALM, sst, glideState } from '../lib/motion';
import { PR } from '../data/showcase';
import { specRows } from '../lib/specs';

export default function showcase() {
  if (window.__eng_showcase) return;
  window.__eng_showcase = 1;
const gl=document.getElementById('gl'),R=new THREE.WebGLRenderer({canvas:gl,alpha:true,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.25));
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(38,1,.1,100);C.position.set(5.2,3.4,6);C.lookAt(0,.9,0);
const pmrem=new THREE.PMREMGenerator(R),environment=pmrem.fromScene(new RoomEnvironment(),.04);
S.environment=environment.texture;
pmrem.dispose();
S.add(new THREE.AmbientLight(0xffffff,.45));const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(4,6,3);S.add(dl);
const sweep=new THREE.PointLight(0xd5deea,0,6);S.add(sweep);
const grid=new THREE.GridHelper(14,28,0x34d399,0x2b323d);
grid.material.transparent=true;
grid.material.opacity=.36;
grid.material.depthWrite=false;
S.add(grid);
const M1=new THREE.MeshStandardMaterial({color:0x1f493f,roughness:.26,metalness:.88,envMapIntensity:1.35}),M2=new THREE.MeshStandardMaterial({color:0xa7cec0,roughness:.2,metalness:.92,envMapIntensity:1.5}),M3=new THREE.MeshStandardMaterial({color:0x457f6b,roughness:.24,metalness:.82,envMapIntensity:1.35});
function add(g,geo,x,y,z,m,rx,rz){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(rx)o.rotation.x=rx;if(rz)o.rotation.z=rz;g.add(o)}
const bx=(g,w,h,d,x,y,z,m=M1)=>add(g,new THREE.BoxGeometry(w,h,d),x,y,z,m);
const wh=(g,r,w,x,y,z)=>add(g,new THREE.CylinderGeometry(r,r,w,28),x,y,z,M1,Math.PI/2);
function rover(four){const g=new THREE.Group();bx(g,2.3,.5,1.5,0,.75,0);bx(g,1.9,.1,1.2,0,1.05,0,M2);bx(g,.9,.45,.8,-.3,1.3,0,M3);bx(g,.08,1.3,.08,-.75,1.75,0,M2);add(g,new THREE.CylinderGeometry(.24,.24,.2,24),-.75,2.45,0,M2);bx(g,.18,.14,.5,.9,1.28,0,M3);
if(four){[[-.8,.8],[-.8,-.8],[.8,.8],[.8,-.8]].forEach(([x,z])=>wh(g,.42,.3,x,.42,z*1.05));bx(g,.1,.9,.1,.9,1.6,0,M2)}else{wh(g,.42,.3,.5,.42,.9);wh(g,.42,.3,.5,.42,-.9);wh(g,.2,.2,-.95,.2,0)}return g}
function drone(){const g=new THREE.Group();g.position.y=.6;bx(g,.9,.22,.9,0,1,0,M3);bx(g,3,.06,.14,0,1,0,M2);bx(g,.14,.06,3,0,1,0,M2);[[1.4,0],[-1.4,0],[0,1.4],[0,-1.4]].forEach(([x,z])=>{add(g,new THREE.CylinderGeometry(.5,.5,.03,28),x,1.1,z,M3)});return g}
const MD=[rover(false),rover(true),drone()];MD.forEach(m=>{m.position.x=-1.4;S.add(m)});
function loadProjectModel(file,index,name){
new GLTFLoader().load(file,gltf=>{
const fallback=MD[index],pivot=new THREE.Group(),model=gltf.scene,bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3()),largest=Math.max(size.x,size.y,size.z);
if(!largest){console.error(`${name} project model has no visible geometry.`);return}
const scale=3*(index===2?1.35:1)/(index===2?largest:size.y||largest);
model.scale.setScalar(scale);
if(index===2){
model.position.copy(center).multiplyScalar(-scale);
model.rotation.x=-Math.PI/2;
const orientedBounds=new THREE.Box3().setFromObject(model);
model.position.y-=orientedBounds.min.y;
}else{
model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
}
model.traverse(node=>{if(!node.isMesh)return;
const partSize=new THREE.Box3().setFromObject(node).getSize(new THREE.Vector3());
const relativeSize=Math.max(partSize.x,partSize.y,partSize.z)/largest;
const shade=relativeSize>.35 ? .92 : relativeSize>.14 ? 1 : 1.06;
const partColor=relativeSize>.35 ? 0x1f493f : relativeSize>.14 ? 0x457f6b : 0xa7cec0;
const materials=Array.isArray(node.material)?node.material:[node.material];
const shadedMaterials=materials.map(material=>{const shaded=material.clone();shaded.vertexColors=false;if(shaded.color)shaded.color.set(partColor).multiplyScalar(shade);if('map' in shaded)shaded.map=null;if('metalness' in shaded)shaded.metalness=.88;if('roughness' in shaded)shaded.roughness=.24;if('envMapIntensity' in shaded)shaded.envMapIntensity=1.4;if(shaded.emissive)shaded.emissive.set(0x000000);return shaded});
node.material=Array.isArray(node.material)?shadedMaterials:shadedMaterials[0];
});
pivot.add(model);pivot.position.copy(fallback.position);pivot.visible=fallback.visible;S.add(pivot);fallback.visible=false;S.remove(fallback);MD[index]=pivot;
},undefined,error=>console.error(`Could not load ${name} model in the Projects showcase.`,error));
}
loadProjectModel('/ashwini.glb',0,'Ashwini');
loadProjectModel('/avni.glb',1,'Avni');
loadProjectModel('/valkyrie.glb',2,'Valkyrie');
function rz(){const k=document.querySelector('#show .stick'),w=k.clientWidth||innerWidth,h=k.clientHeight||innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.position.set(w<800?7:5.2,w<800?4.4:3.4,w<800?8:6);C.lookAt(0,w<800?-.8:.9,0);MD.forEach(m=>{m.position.x=w<800?0:-1.4});C.updateProjectionMatrix()}rz();addEventListener('resize',rz);
const stk=document.querySelector('#show .stick'),sh=document.getElementById('show'),pn=document.getElementById('pn'),rb=[...document.querySelectorAll('#rail b')];let cur=-1,pp=0,targetP=0;
let drag=null,yawOffset=0;
gl.style.cursor='grab';
gl.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={x:event.clientX};gl.setPointerCapture(event.pointerId);gl.style.cursor='grabbing'});
gl.addEventListener('pointermove',event=>{if(!drag)return;yawOffset+=(event.clientX-drag.x)*.01;drag.x=event.clientX});
function endDrag(){drag=null;gl.style.cursor='grab'}
gl.addEventListener('pointerup',endDrag);
gl.addEventListener('pointercancel',endDrag);
gl.addEventListener('lostpointercapture',endDrag);
function setP(i){cur=i;const p=PR[i];document.getElementById('lab').textContent=`Drag horizontally to rotate · scroll to advance · ${i+1} / 3 projects · ${p.t}`;pk.textContent=p.k;pt.textContent=p.t;pd.textContent=p.d;ps.innerHTML=specRows(p.s);MD.forEach((m,j)=>m.visible=j===i)}
let lt=0,ee=0,le=-1,held=0,visible=false,raf=0;
function loop(t){if(!visible){raf=0;return}const dt=Math.min(.05,Math.max(.001,(t-lt)/1000||.016));lt=t;
const r=sh.getBoundingClientRect();const p=cl((84-r.top)/(r.height-stk.offsetHeight),0,.9999);
// while the page is being flown past by a nav link / skip button, hold still; then snap (no catch-up spin)
if(glideState.on){if(!held)targetP=pp;held=1}else{targetP=p;held=0}pp+=(targetP-pp)*(CALM?1:1-Math.exp(-dt*14));const i=Math.floor(pp*3),l=pp*3-i;if(i!==cur)setP(i);
// the stage only fades/rises in once the landing screen has been scrolled past
const rvl=CALM?1:cl((innerHeight*.9-r.top)/(innerHeight*.45),0,1);ee+=(rvl-ee)*(CALM?1:1-Math.exp(-dt*10));if(Math.abs(rvl-ee)<.0008)ee=rvl;
const e=sst(ee);if(e!==le){le=e;if(e>=1){stk.style.opacity='';stk.style.transform=''}else{stk.style.opacity=e.toFixed(3);stk.style.transform=`translate3d(0,${((1-e)*44).toFixed(1)}px,0) scale(${(.97+.03*e).toFixed(4)})`}}
// first and last project hold full strength at the ends of the runway; only the hand-offs fade
const o=sst(cl(Math.min(i===0?1:l/.22,i===2?1:(1-l)/.22),0,1));pn.style.opacity=o;MD[i].scale.setScalar(Math.max(.001,o));pn.style.transform=`translateY(calc(-50% + ${(1-o)*26}px))`;rb.forEach((b,j)=>b.style.setProperty('--f',(j<i?100:j===i?l*100:0)+'%'));
MD[i].rotation.y=pp*Math.PI*5+t*.00012+yawOffset;MD[i].position.y=.06*Math.sin(t*.001);sweep.intensity=(i===0||i===1) ? .65 : 0;sweep.position.set(Math.cos(t*.0007)*2.4,2+Math.sin(t*.0008)*.35,Math.sin(t*.0007)*2.4);if(i===0||i===1){MD[i].rotation.x=.018*Math.sin(t*.0008);MD[i].rotation.z=.025*Math.sin(t*.0011)}else{MD[i].rotation.x=0;MD[i].rotation.z=0}if(r.bottom>0&&r.top<innerHeight)R.render(S,C);raf=requestAnimationFrame(loop)}
const visibilityObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(loop)},{rootMargin:'100px 0px'});
visibilityObserver.observe(sh);
}
