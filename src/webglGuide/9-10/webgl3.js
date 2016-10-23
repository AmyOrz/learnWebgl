/**
 * 鼠标选中立方体
 */
var VSHADER =
    "attribute vec4 a_Position;" +
    "attribute vec4 a_Color;" +
    "uniform mat4 u_MvpMatrix;" +
    "uniform bool u_Clicked;" +
    "varying vec4 v_Color;" +
    "void main(){" +
    "gl_Position = u_MvpMatrix * a_Position;" +
    "if(u_Clicked){" +
    " v_Color = vec4(1.0,0.0,0.0,1.0);" +
    "}else{" +
    " v_Color = a_Color;" +
    "}" +
    "}";

var FSHADER =
    "#ifdef GL_ES\n" +
    "precision mediump float;\n" +
    "#endif\n" +
    "varying vec4 v_Color;" +
    "void main(){" +
    "gl_FragColor = v_Color;" +
    "}";
var g_MvpMatrix = new Matrix4();
var ANGLE_STEP = 20.0; // Rotation angle (degrees/second)
var last = Date.now();

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER, FSHADER)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Set the vertex information
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Set the clear color and enable the depth test
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of uniform variables
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_Clicked = gl.getUniformLocation(gl.program,"u_Clicked");
    if (!u_MvpMatrix || !u_Clicked) {
        console.log('Failed to get the storage location of uniform variable');
        return;
    }
    var ViewProjMatrix = new Matrix4();
    ViewProjMatrix.setPerspective(30.0,1,1.0,100.0);
    ViewProjMatrix.lookAt(2.0,2.0,11.0,0.0,0.0,0.0,0.0,1.0,0.0);

    gl.uniform1i(u_Clicked,0); //初始化clicked = false

    var currentAngle = 0.0;
    canvas.addEventListener("mousedown",function (e) {
        var x = e.clientX, y = e.clientY;
        var rect = canvas.getBoundingClientRect();
        if(rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom){
            var canvasX = x - rect.left,canvasY = rect.bottom - y;
            var picked = check(gl,n,canvasX,canvasY,currentAngle,u_Clicked,ViewProjMatrix,u_MvpMatrix);
            if(picked)alert("you click the rect")
        }
    },false);
    var tick = function () {
        currentAngle = animate(currentAngle);
        draw(gl,n,ViewProjMatrix,u_MvpMatrix,currentAngle);
        requestAnimationFrame(tick,canvas);
    };
    tick();
}
function draw(gl,n,ViewProjMatrix,u_MvpMatrix,arrAngle) {
    g_MvpMatrix.set(ViewProjMatrix);
    g_MvpMatrix.rotate(arrAngle,1.0,0.0,0.0);
    g_MvpMatrix.rotate(arrAngle,0.0,1.0,0.0);
    g_MvpMatrix.rotate(arrAngle,0.0,0.0,1.0);

    gl.uniformMatrix4fv(u_MvpMatrix,false,g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}
function check(gl,n,x,y,currentAngle,u_Clicked,ViewProjMatrix,u_MvpMatrix) {
    var picked = false;
    gl.uniform1i(u_Clicked,1);
    draw(gl,n,ViewProjMatrix,u_MvpMatrix,currentAngle);
    var pixels = new Uint8Array(4);
    gl.readPixels(x,y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixels);   //获取鼠标位置点的颜色
    if(pixels[0] == 255){   //是否为红
        picked = true;
    }
    gl.uniform1i(u_Clicked,0);
    draw(gl,n,ViewProjMatrix,u_MvpMatrix,currentAngle);

    return picked;
}
function animate(angle) {
    var now = Date.now();
    var speed = now - last;
    last = now;
    var newAngle = angle + (ANGLE_STEP * speed)/1000.0;
    return newAngle%360;
}
function initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
    ]);

    var colors = new Float32Array([   // Colors
        0.2, 0.58, 0.82,   0.2, 0.58, 0.82,   0.2,  0.58, 0.82,  0.2,  0.58, 0.82, // v0-v1-v2-v3 front
        0.5,  0.41, 0.69,  0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
        0.0,  0.32, 0.61,  0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v0-v5-v6-v1 up
        0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v1-v6-v7-v2 left
        0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v7-v4-v3-v2 down
        0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    // Write vertex information to buffer object
    if (!initArrayBuffer(gl, vertices, gl.FLOAT, 3, 'a_Position')) return -1; // Coordinate Information
    if (!initArrayBuffer(gl, colors, gl.FLOAT, 3, 'a_Color')) return -1;      // Color Information
    // Create a buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);

    return indices.length;
}
function initArrayBuffer(gl,array,type,num,attribute) {
    var buffer = gl.createBuffer();
    if(!buffer)alert("buffer err");

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);

    var a_attribute = gl.getAttribLocation(gl.program,attribute);
    if(a_attribute < 0)alert("position err");

    gl.vertexAttribPointer(a_attribute,num,type,false,0,0);
    gl.enableVertexAttribArray(a_attribute);
    return true;
}
