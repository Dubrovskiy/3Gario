


var playerObject;
var playerRadius = 50;
var movementSpeed = 500;
var playerRotationSpeed = 0.7;

var scene,camera,clock;

var keyboard = new THREEx.KeyboardState();

var renderer, container;

var World = {};
var worldSize = 10000;

// Creating the worl
createWorld(worldSize);
initWorld (World.size);

// Lighting
//initLight(0,1000,0);
//initLight(1000,0,1000);



// Helper axis
var axes = new THREE.AxisHelper(10);
scene.add(axes);


// Initialising the observer probe
initPlayer();
camera.lookAt( playerObject.position);


animate();

var COLOR_BLUE = 0x0000FF;
var COLOR_RED =  0xFF0000;



// Creating the world, skybox and necessary renderers configuration.
function createWorld(worldSize) {

    World.size = worldSize;
    World.gridSize = 100;
    World.grid = World.size/World.gridSize;


    var SkyBox = {};
    SkyBox.images = ["img/BK.jpg","img/DN.jpg","img/FR.jpg","img/RT.jpg","img/LF.jpg","img/UP.jpg"];
    SkyBox.geometry = new THREE.CubeGeometry(worldSize,worldSize,worldSize);

    SkyBox.sides = [];
    for (var i = 0; i < 6; i++)
        SkyBox.sides.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(SkyBox.images[i]),
            side: THREE.BackSide
        }));

        SkyBox.material = new THREE.MeshFaceMaterial(SkyBox.sides);
        SkyBox.mesh = new THREE.Mesh(SkyBox.geometry, SkyBox.material);
        World.skyBox = SkyBox ;


}


function initWorld(){

    clock = new THREE.Clock();
    scene = new THREE.Scene();


    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45;
    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    var NEAR = 0.1;
    var FAR = World.size * 2;

    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,100,300);
    camera.lookAt(scene.position);


    renderer = Detector.webgl ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById( 'ThreeJS' );
    container.appendChild( renderer.domElement );


    //scene.fog = new THREE.FogExp2(0x000000, 0.00012);
    scene.add(World.skyBox.mesh);

}


function initPlayer(){

    var geometry = new THREE.SphereGeometry( 32, 32, 32 );
    var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
    playerObject = new THREE.Mesh( geometry, material );
    playerObject.position.set(0,40,0);
    scene.add(playerObject);


    var spriteMaterial = new THREE.SpriteMaterial({
            map: new THREE.ImageUtils.loadTexture( 'img/glow.png' ),
            useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center,
            color: 0x0000ff, transparent: false, blending: THREE.AdditiveBlending
        });
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(200, 200, 1.0);
    playerObject.add(sprite); // this centers the glow at the mesh
}


function animate(){

    requestAnimationFrame( animate );
    render();
    update();
}


function initLight(posX,posY,posZ) {
    var light = new THREE.PointLight(0xffffff);
    light.position.set(posX,posY,posZ);
    scene.add(light);

}


function update(){

// Movement updates
    processMovement();

    var relativeCameraOffset = new THREE.Vector3(0,200,800);
    var cameraOffset = relativeCameraOffset.applyMatrix4( playerObject.matrixWorld );
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;

    camera.lookAt(playerObject.position);


}


function render(){
    renderer.render( scene, camera );
}

//Process the movement changes based on players input
function processMovement() {
    var delta = clock.getDelta(); // seconds.
    var moveDistance = movementSpeed * delta; // 200 pixels per second
    var rotateAngle = Math.PI / playerRotationSpeed * delta;   // pi/2 radians (90 degrees) per second

// WASD
    if ( keyboard.pressed("W") ) playerObject.translateZ( -moveDistance );
    if ( keyboard.pressed("S") ) playerObject.translateZ(  moveDistance );
    if ( keyboard.pressed("A") ) playerObject.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    if ( keyboard.pressed("D") ) playerObject.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);

// Jumps and down
    if ( keyboard.pressed("space")) playerObject.translateY( +playerRadius );
    if ( keyboard.pressed("X")) playerObject.translateY( -playerRadius );
}

