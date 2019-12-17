var gl;
var shaderProgramHandle;

const M_PI = 3.14159;
const city_size = 40;

var cubeXYZ;

var viewportWidth;
var viewportHeight;

var objectIndex = 1;
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var controlDown = false;

var camPos = new Array(3);            						// camera position in cartesian coordinates
var cameraTheta, cameraPhi;               		// camera DIRECTION in spherical coordinates
var camDir = new Array(3);									// camera DIRECTION in cartesian coordinates
var upVector = [0.0, 1.0, 0.0];

var modelViewUniformLocation = -1;
var projUniformLocation = -1;
var timeUniformLocation = -1;
var vcolor_attrib = -1;

var vpos_attrib_location = -1;

var projectionMatrix = glMatrix.mat4.create();
var modelViewMatrix = glMatrix.mat4.create();

function convertSphericalToCartesian() {
	eyePoint[0] = cameraAngles[2] * Math.sin( cameraAngles[0] ) * Math.sin( cameraAngles[1] );
	eyePoint[1] = cameraAngles[2] * -Math.cos( cameraAngles[1] );
	eyePoint[2] = cameraAngles[2] * -Math.cos( cameraAngles[0] ) * Math.sin( cameraAngles[1] );
}

function recomputeOrientation() {
	var rho = Math.sqrt(Math.pow(camPos[0], 2) + Math.pow(camPos[1], 2) + Math.pow(camPos[2], 2));

	var x = rho * Math.sin(cameraPhi) * Math.cos(cameraTheta);
	var z = rho * Math.sin(cameraPhi) * Math.sin(cameraTheta);
	var y = rho * Math.cos(cameraPhi);
	
	var dirVector = [x, y, z];

	var magnitude = Math.sqrt(x*x + y*y + z*z);
	var normalDirVector = [dirVector[0] / magnitude,
				  dirVector[1] / magnitude,
				  dirVector[2] / magnitude];
	camDir = normalDirVector;
}


function keyDownHandler(event) {
    if (event.keyCode == 87) { // W
        camPos[0] += camDir[0];
		camPos[1] += camDir[1];
		camPos[2] += camDir[2];
        return;
    }
    if (event.keyCode == 83) { // S
        camPos[0] -= camDir[0];
		camPos[1] -= camDir[1];
		camPos[2] -= camDir[2];
        return;
    }
    if (event.keyCode == 68) { // D
        return;
    }
    if (event.keyCode == 65) { // A
        return;
    }
    
}

function mouseDownHandler(event) {
    mouseDown = true;
}

function mouseUpHandler(event) {
    mouseDown = false;
}

function mouseMoveHandler(event) {
    if( mouseDown ) {
		cameraTheta += (event.clientX - lastMouseX) * 0.005;
		cameraPhi -= ((lastMouseY - event.clientY) * 0.005);

		if (cameraPhi >= M_PI - 0.1) {
			cameraPhi = M_PI - 0.1;
		}
		else if (cameraPhi < 0.1) {
			cameraPhi = 0.1;
		}


		recomputeOrientation();     // update camera (x,y,z) based on (theta,phi)
    }
    
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function initGL(canvas) {
    gl = canvas.getContext("webgl2");

    if (!gl) {
        console.log("Your browser does not support WebGL");
    }
    else {
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        viewportWidth = canvas.width;
        viewportHeight = canvas.height;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
    }

    document.onkeydown = keyDownHandler;
    canvas.onmousedown = mouseDownHandler;
    document.onmouseup = mouseUpHandler;
    document.onmousemove = mouseMoveHandler;
}

function getShader(gl, src_text, type) {
    var shaderHandle;
    
    if (type == "vertex") {
        shaderHandle = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (type == "fragment") {
        shaderHandle = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
        return null;
    }

    gl.shaderSource(shaderHandle, src_text);
    gl.compileShader(shaderHandle);
    
    if (!gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shaderHandle));
        return null;
    }

    return shaderHandle;
}

function initShaders() {
    var vertexShaderHandle = getShader(gl, color_shader_vert, "vertex");
    var fragmentShaderHandle = getShader(gl, color_shader_frag, "fragment");
    
    shaderProgramHandle = gl.createProgram();

    gl.attachShader(shaderProgramHandle, vertexShaderHandle);
    gl.attachShader(shaderProgramHandle, fragmentShaderHandle);
    gl.linkProgram(shaderProgramHandle);

    if (!gl.getProgramParameter(shaderProgramHandle, gl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    modelViewUniformLocation = gl.getUniformLocation(shaderProgramHandle, "modelViewMatrix");
    projUniformLocation = gl.getUniformLocation(shaderProgramHandle, "projMatrix");
    timeUniformLocation = gl.getUniformLocation(shaderProgramHandle, "time");
    vpos_attrib_location = gl.getAttribLocation(shaderProgramHandle, "vPosition");
    vcolor_attrib = gl.getAttribLocation(shaderProgramHandle, "vColor");
}

function initBuffers() {
    
}

function drawScene() {
    gl.useProgram(shaderProgramHandle);

    gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    glMatrix.mat4.perspective( projectionMatrix, 0.785398, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0 );
    var lookAtPoint = [camPos[0] + camDir[0], camPos[1] + camDir[1], camPos[2] + camDir[2]];
    glMatrix.mat4.lookAt( modelViewMatrix, camPos, lookAtPoint, upVector );

    gl.uniformMatrix4fv(projUniformLocation,
                        false, projectionMatrix );
    gl.uniformMatrix4fv(modelViewUniformLocation,
                        false, modelViewMatrix );
    drawCity();
}

function tick() {
    drawScene();
    requestAnimationFrame( tick );
}

function webGLStart() {
    var canvas = document.getElementById("webGLCanvas");

    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete
    
    initGL( canvas );
    
    initShaders();
    initBuffers();

    cubeVertexPositionBuffer = [];
    cubeVertexIndexBuffer = [];
    cubeColorBuffer = [];

    cubeXYZ = [];
    for (var x = -city_size; x <= city_size; x++) {
        for (var y = -city_size; y <= city_size; y++) {
            if (Math.abs(x) % 2 == 0 &&
                Math.abs(y) % 2 == 0 &&
                Math.random() < 0.4) {
                    var height = Math.random() * 5 + 1;
                    var cube = buildCube(height, x, y);
                    
                    cubeVertexPositionBuffer.push(cube[0]);
                    cubeVertexIndexBuffer.push(cube[1]);
                    cubeColorBuffer.push(cube[2]);
            }
        }
    }

    camPos[0] = 60;
	camPos[1] = 40;
	camPos[2] = 30;
	cameraTheta = 3.6578;
	cameraPhi = 2.087;
	recomputeOrientation();
    
    tick();
}



function drawCity() {
	for (var i = 0; i < cubeVertexIndexBuffer.length; i++) {
        drawCube(cubeVertexPositionBuffer[i],
                 cubeVertexIndexBuffer[i],
                 cubeColorBuffer[i]);
    }
}

//////////////////////////////////////////////////////////////////////////////
// Cube functions
//////////////////////////////////////////////////////////////////////////////
var cubeBuilt = false;

function getCubePositions(size, x, z) {
    return [
        // Front face
        x, -1.0,  z + 1.0,
        x + 1.0, -1.0,  z + 1.0,
        x + 1.0,  size,  z + 1.0,
        x,  size,  z + 1.0,
        
        // Back face
        x, -1.0, z,
        x,  size, z,
        x + 1.0,  size, z,
        x + 1.0, -1.0, z,
        
        // Top face
        x,  size, z,
        x,  size,  z + 1.0,
        x + 1.0,  size,  z + 1.0,
        x + 1.0,  size, z,
        
        // Bottom face
        x, -1.0, z,
        x + 1.0, -1.0, z,
        x + 1.0, -1.0,  z + 1.0,
        x, -1.0,  z + 1.0,
        
        // Right face
        x + 1.0, -1.0, z,
        x + 1.0,  size, z,
        x + 1.0,  size,  z + 1.0,
        x + 1.0, -1.0,  z + 1.0,
        
        // Left face
        x, -1.0, z,
        x, -1.0,  z + 1.0,
        x,  size,  z + 1.0,
        x,  size, z,
    ];
} 

  const cubeIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

 function getFaceColors() {
    var color = [Math.random(), Math.random(), Math.random(), 1.0];
    return [
        color, color, color, color, color, color,
    ];
 } 

var cubeColorBuffer;
var cubeVertexPositionBuffer;
var cubeVertexIndexBuffer;

function drawCube(posBuf, indexBuf, colorBuffer) {
    //console.log(posBuf);
    gl.bindBuffer( gl.ARRAY_BUFFER, posBuf );
    gl.vertexAttribPointer( vpos_attrib_location,
                            posBuf.itemSize, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vpos_attrib_location);

    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
    gl.vertexAttribPointer( vcolor_attrib,
                            colorBuffer.itemSize, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vcolor_attrib);

    /* bind color buffer as well */
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuf );
    gl.drawElements( gl.TRIANGLES, indexBuf.numItems, gl.UNSIGNED_SHORT, 0 );
}

function buildCube(size, x, z) {
    var cubePositions = getCubePositions(size, x, z);

    var posBuf = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, posBuf );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(cubePositions), gl.STATIC_DRAW );
    posBuf.itemSize = 3;
    posBuf.numItems = 8;
    
    var indexBuf = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuf );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW );
    indexBuf.itemSize = 1;
    indexBuf.numItems = 36;

    var faceColors = getFaceColors();
    var colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
    
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
      }

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    colorBuffer.itemSize = 4;
    colorBuffer.numItems = colors.length;

    return [posBuf, indexBuf, colorBuffer];
}