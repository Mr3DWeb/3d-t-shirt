import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222831)
const canvas = document.querySelector('#webgl');

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
camera.position.set(0,0,5);

const renderer = new THREE.WebGLRenderer({
  canvas:canvas,
  antialias:true,
  alpha:true
});
renderer.setSize(window.innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera,canvas);
controls.enableDamping = true;


window.addEventListener('resize',() => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
})

//--------------------------- JS ------------------------------

//----------------------------Three js-------------------------
//Lighting
const ambLight = new THREE.AmbientLight('#ffffff',0.8);
scene.add(ambLight);

const dirLight = new THREE.DirectionalLight('#ffffff',1);
dirLight.position.set(2,2,2);
scene.add(dirLight);

//GltfLoader
const gltfLoader = new GLTFLoader();

let tShrit;
let mixer,action;
gltfLoader.load("model/t-shirt.glb",(gltf)=>{
  tShrit = gltf.scene;

  //Scale manegment
  const tShritScale = 3;
  tShrit.scale.set(tShritScale,tShritScale,tShritScale);
  //Center 
  const box = new THREE.Box3().setFromObject(tShrit);
  const center = new THREE.Vector3();
  box.getCenter(center);
  tShrit.position.sub(center);

  //animation
   mixer = new THREE.AnimationMixer(tShrit);
  const clip = gltf.animations[1];
  action = mixer.clipAction(clip);

  //Acsess To Material
  const shirtMat = tShrit.children[0].children[1].material;
  const humanMat = tShrit.children[0].children[0].material;

  shirtMat.color.setHex(0xFF0000);
  humanMat.color.setHex(0x00ADB5);
  
  //Add to scene % log
  scene.add(tShrit);
  console.log(gltf)
})

//Handel Animation
const btnAnimation = document.querySelector("#animation");
const btnState = {
  isRunning :false,
  toggle(){
    this.isRunning = !this.isRunning;
    btnAnimation.textContent = (this.isRunning) ? "Stop Animation" : "Run Animation";
    this.isRunning ? action.reset().play() : action.fadeOut(1)
  }
}
btnAnimation.addEventListener('click',()=>{btnState.toggle()});
//-------------------------------------------------------------
const clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const delta = clock.getDelta();


  if(mixer){
    mixer.update(delta);
  }

  controls.update();
  renderer.render(scene,camera);
}
animate()
