import './stylesheets/index.css';

import {HelloWorld} from './HelloWorld'
import {THREE} from 'three'

var Physijs = require('physijs-browserify')(THREE);
 
Physijs.scripts.worker = '/lib/physijs_worker.js';
Physijs.scripts.ammo = '/lib/ammo.js';
  

var scene =  new Physijs.Scene({ fixedTimeStep: 1 / 120 });
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth - 10, window.innerHeight / 0.9 - 200 );
document.getElementById('renderer').appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );

var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var materialred = Physijs.createMaterial(new THREE.MeshBasicMaterial( { color: 0xff0000 } ), 0.4, 0.4);
var materialblue = Physijs.createMaterial(new THREE.MeshBasicMaterial( { color: 0x0000ff } ), 0.4, 0.4);

var cube = new THREE.Mesh( geometry, material );
var box = new Physijs.BoxMesh(geometry, materialred);
var box2 = new Physijs.BoxMesh(geometry, materialblue);

scene.add( cube );
scene.add( box );
scene.add( box2 );

box.position.set(5, 5, 0);
box.__dirtyPosition = true;
box.setDamping(0.15, 1);
box2.position.set(2, -3, 0);
box2.__dirtyPosition = true;

camera.position.z = 10;
scene.setGravity(new THREE.Vector3( 0, 0, 0 ));


function render() {
  requestAnimationFrame( render );
  //moveCam();
  moveBox();
  scene.simulate();
  renderer.render( scene, camera );
}

var destination = camera.position.x + 10;
var yDestination = camera.position.x + 10;
var absDest = destination;
function moveCam() {
  if ( camera.position.x < -absDest + 0.5 ) {
    destination = absDest;
  }
  if ( camera.position.x > absDest - 0.5 ) {
    destination = -absDest;
  }
  if ( camera.position.y < -absDest + 0.5 ) {
    yDestination = absDest;
  }
  if ( camera.position.y > absDest - 0.5 ) {
    yDestination = -absDest;
  }

  camera.position.x = camera.position.x + (destination - camera.position.x) * 0.02;
  camera.position.y = camera.position.y + (yDestination - camera.position.y) * 0.02;
}

var keyVector = { x: 0, y: 0 };
var speed = 0.1;

function moveBox() {
  box.applyCentralForce(new THREE.Vector3(keyVector.x, keyVector.y, 0));
  keyVector = { x: 0, y: 0 };
}
window.addEventListener('keydown', function(ev) {
  if (ev.keyCode == 38) {
    keyVector.y = 1;
  }
  if (ev.keyCode == 37) {
    keyVector.x = -1;
  }
  if (ev.keyCode == 39) {
    keyVector.x = 1;
  }
  if (ev.keyCode == 40) {
    keyVector.y = -1;
  }
});


render();
