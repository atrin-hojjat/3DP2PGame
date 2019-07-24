
// if ( !WEBGL.isWebGLAvailable() ) {
// 	var warning = WEBGL.getWebGLErrorMessage();
// 	document.getElementById( 'container' ).appendChild( warning );
// }

var host = window.location.origin;

var obstacles = [], materials = new Map();
var map = [];
var width, height;
var camera, scene, renderer;
var plane;
var lights = [];

var pxval = 5 ;

function render() {
	renderer.render( scene, camera );
}

function update() {

}

function loadMaterial() {
	var JSMatLoader = new THREE.MaterialLoader();
	map.materials.forEach(function(element) {
		materials.set(element.name, JSMatLoader.parse(element.mat));
	});
}

function loadObstacles() {
	map.obstacles.forEach(function(element) {
		let obs;
		let geom = new THREE.BoxBufferGeometry(element.width, element.height, element.depth);
		obs = new THREE.Mesh(geom, materials[element.material]);
		obs.position.x = element.x;
		obs.position.y = element.y;
		obs.position.z = element.z;

		scene.add(obs);
		obstacles.push(obs);
	});
}

function setCamera() {
	camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
	scene.add(camera);

	camera.position.x = 0;
	camera.position.y = 1;
	camera.position.z = -2;
	camera.lookAt(new THREE.Vector3(0, 1, 1));

}

function setLights() {
	var amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add(amblight);
	lights.push(amblight);

	var spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.position.set(0, 1000, 0);
	spotLight.angle = Math.PI / 3;
	spotLight.penumbra = 0.05;
	// spotLight.decay = 2;
	// spotLight.distance = 200;
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 2000;
	scene.add(spotLight);
	lights.push(spotLight);

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

function onKeydown() {

}

function onKeyup() {

}

function setPlane() {
	console.log("" + map.plane);
	let geometry = new THREE.PlaneBufferGeometry(map.plane.x, map.plane.y);
	geometry.rotateX(-Math.PI / 2);
	plane = new THREE.Mesh(geometry, materials[map.plane.mat]);
	scene.add(plane);
}

function setScene() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);
}

function setRenderer() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.setAnimationLoop( () => {
		update();
		render();
	});

	document.getElementById('stage').appendChild(renderer.domElement);
}

function generateScene() {
	setScene();
	setCamera();
	setPlane();
	setLights();

	loadMaterial();
	loadObstacles();

	setRenderer();
}


function loadMap() {
	console.log("Downloading Map");
	$.getJSON(host + '/map/001').done(function(data) {
		map = data;
		console.log("Reading map");
		generateScene();
	}).fail(function( jqxhr, textStatus, error ) {
				 let err = textStatus + ', ' + error;
				 alert( "Failed to Load the Map: " + err);
			 });
}

var init = function() {
	console.log("Starting");
	width = window.innerWidth, height = window.innerHeight;

	loadMap();

	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener("keydown", onKeydown);
	document.addEventListener("keyup", onKeyup);

};


$( document ).ready(function() { init();  });
