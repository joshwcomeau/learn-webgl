const THREE = require('three');

// Scene, camera and renderer setup
const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


// Add stuff to scene
const geometry = new THREE.SphereGeometry(2, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  emissive: 0x0,
  shininess: 30,
});
// material.shading = THREE.FlatShading;


const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 1, 1).normalize();
scene.add(light);

camera.position.z = 5;


// REnder scene
function render() {
  window.requestAnimationFrame(render);

  renderer.render(scene, camera);

  cube.rotation.x += 0.01;
  cube.rotation.z += 0.01;
}

render();
