
// if ( !WEBGL.isWebGLAvailable() ) {
// 	var warning = WEBGL.getWebGLErrorMessage();
// 	document.getElementById( 'container' ).appendChild( warning );
// }

var host = window.location.origin;

var obstacles = [], materials = new Map();
var camera, scene, renderer;
var plane;

var pxval = 5 ;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

$( document ).ready(function() {
	console.log("Starting");
	scene = new THREE.Scene();
	var width = window.innerWidth, height = window.innerHeight;
	// camera = new THREE.PerspectiveCamera(75, window.innerWidth /
		// window.innerHeight, 0.1, 1000);
	var camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
	scene.add(camera);

	var amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( amblight );

	// var spotLight = new THREE.SpotLight(0xffffff, 1);
	// spotLight.position.set(15, 40, 35);
	// spotLight.angle = Math.PI / 4;
	// spotLight.penumbra = 0.05;
	// spotLight.decay = 2;
	// spotLight.distance = 200;
	// spotLight.castShadow = true;
	// spotLight.shadow.mapSize.width = 1024;
	// spotLight.shadow.mapSize.height = 1024;
	// spotLight.shadow.camera.near = 10;
	// spotLight.shadow.camera.far = 200;
	// scene.add(spotLight);

	scene.background = new THREE.Color(0xf0f0f0);

	camera.position.x = 0;
	camera.position.y = 1;
	camera.position.z = -2;
	camera.lookAt(new THREE.Vector3(0, 1, 1));

	{
		var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
		geometry.rotateX(-Math.PI / 2);
		plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color: 0xB39436}));
		scene.add( plane );
	}

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('stage').appendChild(renderer.domElement);
	window.addEventListener( 'resize', onWindowResize, false );
	renderer.render( scene, camera );

	console.log("Downloading Map");
	// $.ajax({
	// 	dataType: "json",
	// 	url: host + '/map/001',
	// 	success: function(data) {
	// 		console.log("Reading map");
	// 		alert(data.obstacles.length);
	// 		data.obstacles.forEach(function(element) {
	// 			var obs;
	// 			if(element.type == 1) obs = new THREE.Mesh(geometry, material1);
	// 			else obs = new THREE.Mesh(goemetry, material2);
	// 			obs.position.x = element["x"];
	// 			obs.position.y = element["y"];
	// 			obs.position.z = element["z"];
	//
	// 			scene.add(obs);
	// 			obstacles.push(obs);
	//
	// 			console.log("obstacle Added");
	// 		});
	// 	}
	// });
	// $.get(host + '/map/001', function(data) {
	// 	console.log("Reading map");
	// 	alert(data.obstacles.length);
	// 	data.obstacles.forEach(function(element) {
	// 		var obs;
	// 		if(element.type == 1) obs = new THREE.Mesh(geometry, material1);
	// 		else obs = new THREE.Mesh(goemetry, material2);
	// 		obs.position.x = element["x"];
	// 		obs.position.y = element["y"];
	// 		obs.position.z = element["z"];
	//
	// 		scene.add(obs);
	// 		obstacles.push(obs);
	//
	// 		console.log("obstacle Added");
	// 	});
	// }, 'json');
	$.getJSON(host + '/map/001').done(function(data) {
		console.log("Reading map");
		var JSMatLoader = new THREE.MaterialLoader();
		data.materials.forEach(function(element) {
			materials.set(element.name, JSMatLoader.parse(element.mat));
		});
		data.obstacles.forEach(function(element) {
			var obs;
			var geom = new THREE.BoxBufferGeometry(element.width, element.height, element.depth);
			obs = new THREE.Mesh(geom, materials[element.material]);
			obs.position.x = element.x;
			obs.position.y = element.y;
			obs.position.z = element.z;

			scene.add(obs);
			obstacles.push(obs);
		});
		renderer.render(scene, camera);
	}).fail(function( jqxhr, textStatus, error ) {
				  var err = textStatus + ', ' + error;
				 alert( "Failed to Load the Map: " + err);
			 });


	document.addEventListener("keydown", function(event) {
		var mv = pxval / 2;
		switch(event.key) {
			case "w":
				camera.position.z += mv;
				break;
			case "s":
				camera.position.z -= mv;
				break;
			case "d":
				camera.position.x += mv;
				break;
			case "a":
				camera.position.x -= mv;
				break;
			default:

		}
		console.log("Position : [" + camera.position.x + ", " + camera.position.y + ", " + camera.position.z + "]" );
		renderer.render( scene, camera );

	});

});
