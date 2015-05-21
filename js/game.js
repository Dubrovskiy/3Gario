// Player settings
var playerColor = 0x7cd200;
var VIEW_ANGLE = 90;
var movementSpeed = 2000;
var playerRadius = 50;
var playerRotationSpeed = 0.7;

var playerObject;

var distConstant = 100;
// Enemy
var enemySize = 50;

// Game settings
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var NEAR = 0.1;
var FAR = 999999;


// Scene
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState()
var clock;


// Gameboard
var mapSize = 10000;
var mapMinPosition = 0-(mapSize/2)
var mapMaxPosition = (mapSize/2)
var worldSize = mapSize*10;
var floorSizeX = mapSize;
var floorSizey = mapSize;
var boardPatternRep = mapSize/distConstant;
var floorGeometry = new THREE.PlaneGeometry(floorSizeX, floorSizey, 10, 10);


// Colors
var COLOR_GREEN = 0x7cd200;
var COLOR_RED = 0xff0000;



// TOP VIEW
var cameraPosX = 0;
var cameraPosY = 200; // Height
var cameraPosZ = 800; // Behind dist


var enemyObjects = [];





function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
   

// Player Camera

    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,100,300); // x Z z axis
    camera.lookAt(playerObject.position);

// RENDERER
    if ( Detector.webgl )renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
        renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById( 'Agar3D' );
    container.appendChild(renderer.domElement);
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });



// Lights
    initLight(0,1000,0);
    initLight(mapMinPosition/2,1000,mapMinPosition/2);
    initLight(mapMaxPosition/2,1000,mapMinPosition/2);
    initLight(mapMaxPosition/2,1000,mapMaxPosition/2);
    initLight(mapMinPosition/2,1000,mapMaxPosition/2);

// Floor
    initFloorGrid();


// Player
initPlayer(0,0);


// Enemies
//    initEnemyObject(500,0,-1000);// Size, x, y

// Sky Box
    initSkyBox();
// Stats window
    initStatsContainer();





// Enemy



}






function animate(){
    requestAnimationFrame( animate );
    render();
    update();
}






function update(){

// Movement updates
    processMovement();


// Console updates
    logConsole();

    var relativeCameraOffset = new THREE.Vector3(cameraPosX,cameraPosY,cameraPosZ);
    var cameraOffset = relativeCameraOffset.applyMatrix4( playerObject.matrixWorld );
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;

    camera.lookAt(playerObject.position);

    stats.update();

}


function hasPlayerCollided() {
    var playerPosX = playerObject.position.x;
    var playerPosZ = playerObject.position.z;
    var enemyObject = enemyObjects[0];
    var  enemyObjectPosX = enemyObject.position.x;
    var  enemyObjectPosY = enemyObject.position.z;

    var enemySize = 500;
    var enemyR = enemySize/4;
    var minPX = enemyObject.position.x - enemyR;
    var maxPX = enemyObject.position.x + enemyR;
    var minPZ = enemyObject.position.z - enemyR;
    var maxPZ = enemyObject.position.z + enemyR;

    if (playerPosX > minPX && playerPosX < maxPX) {
        if (playerPosZ > minPZ && playerPosZ < maxPZ) {
            return true;
        }
    }

    return false;
}








//// Sub Functions
//function allocPrey(preyType, numToAlloc) {
//    var geom = new THREE.SphereGeometry(0.5,12,12);
//    var mat = new THREE.MeshLambertMaterial( { color: COLOR_RED } );
//
//    for (i = 0; i < numToAlloc;i++) {
//        var enemyObject = new THREE.Mesh( geom,mat);
//
//        enemyObject.position.set(positionX,size,positionY);
//        scene.add(enemyObject);
//        enemyObjects.push(enemyObject);
//    }
//
//    console.log("")
//
//
//
//}




// Process the movement changes based on players input
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




function initLight(posX,posY,posZ) {
    var light = new THREE.PointLight(0xffffff);
    light.position.set(posX,posY,posZ);
    scene.add(light);

}


// Console display
function logConsole() {
    var pposx = Math.floor(playerObject.position.x);
    var pposz = Math.floor(playerObject.position.z);
    logPlayerPos("Position (X,Y): (" +  pposx + ","+ pposz + ")"
        + " (" +  Math.floor(pposx/100) + ","+ Math.floor(pposz/100) + ")" );
    logPlayerSpeed("Speed : " + movementSpeed/distConstant + " m/s");
    logGeneral("gen","Player collided : " + hasPlayerCollided());
}

function logPlayerPos(message){
    var c = document.getElementById("ppos");
    c.innerHTML = "<p>" + message +"</p>";
}

function logPlayerSpeed(message){
    var c = document.getElementById("pspd");
    c.innerHTML = "<p>" + message +"</p>";
}

function logGeneral(div,message){
    var c = document.getElementById(div);
    c.innerHTML = "<p>" + message +"</p>";
}


function writeMessage(message){
    var c = document.getElementById("console");
    c.innerHTML = "<p>" + message +"</p>";
}

// Render function
function render() {
    renderer.render(scene,camera);
}


// Initialises the stats container.
function initStatsContainer() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '10px';
    stats.domElement.style.zIndex = 600;
    container.appendChild( stats.domElement );
}


function initSkyBox() {
    var imagePrefix = "";
    var directions  = ["img/BK.jpg","img/DN.jpg","img/FR.jpg","img/RT.jpg","img/LF.jpg","img/UP.jpg"];
    var imageSuffix = "";
    var skyGeometry = new THREE.CubeGeometry( worldSize,worldSize, worldSize);
    var urls = [];
    for (var i = 0; i < 6; i++)urls.push( imagePrefix + directions[i] + imageSuffix );
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add( skyBox );
}

function initEnemyObject(size,positionX,positionY) {
    var geometry = new THREE.SphereGeometry(size,12,12);
    var material = new THREE.MeshLambertMaterial( { color: COLOR_RED } );

    var enemyObject = new THREE.Mesh( geometry,material);
    enemyObject.position.set(positionX,size,positionY);
    scene.add(enemyObject);
    enemyObjects.push(enemyObject);
}

function initPlayer(positionX,positionY){
    var geometry = new THREE.SphereGeometry(playerRadius,12,12);
    var material = new THREE.MeshLambertMaterial({color: playerColor});
    playerObject = new THREE.Mesh( geometry,material);
    playerObject.position.set(positionX,playerRadius,positionY);
    scene.add(playerObject);

}

function initFloorGrid(){

    var floorTexture = THREE.ImageUtils.loadTexture('img/tile.png' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(boardPatternRep, boardPatternRep);
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

}







