var gl;
var shaderProgramHandle;

const M_PI = 3.14159;

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

function initGL(canvas) {
    gl = canvas.getContext("webgl2");

    if (!gl) {
        console.log("Your browser does not support WebGL 2.0");
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

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;

    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }

        k = k.nextSibling;
    }
    
    var shaderHandle;
    
    if (shaderScript.type == "x-shader/x-vertex") {
        shaderHandle = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (shaderScript.type == "x-shader/x-fragment") {
        shaderHandle = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
        return null;
    }

    gl.shaderSource(shaderHandle, str);
    gl.compileShader(shaderHandle);
    
    if (!gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shaderHandle));
        return null;
    }

    return shaderHandle;
}

function initShaders() {
    var vertexShaderHandle = getShader(gl, "shader-vs");
    var fragmentShaderHandle = getShader(gl, "shader-fs");
    
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

    tick();
}

//////////////////////////////////////////////////////////////////////////////
// Quad functions
//////////////////////////////////////////////////////////////////////////////

const quadVertices = [
    0, 0, 0,
    canvas.width, 0, 0,
    canvas.width, canvas.height, 0,
    0, canvas.height, 0 
];

const quadIndices = [
  0,  1,  2,      0,  2,  3,
];

var quadVertexPositionBuffer;
var quadVertexIndexBuffer;

function drawQuad() {
    //console.log(posBuf);
    gl.bindBuffer( gl.ARRAY_BUFFER, posBuf );
    gl.vertexAttribPointer( vpos_attrib_location,
                            posBuf.itemSize, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vpos_attrib_location);

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