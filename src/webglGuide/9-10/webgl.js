/**
 * 机器动画
 */
var VSHADER =
    "attribute vec4 a_Position;" +
    "attribute vec4 a_Normal;" +
    "uniform mat4 u_MvpMatrix;" +
    "uniform mat4 u_NormalMatrix;" +
    "varying vec4 v_Color;" +
    "void main(){" +
    "gl_Position = u_MvpMatrix * a_Position;" +
    "vec3 lightDirection = normalize(vec3(0.9,0.5,0.7));" +
    "vec4 color = vec4(0.0,1.0,1.0,1.0);" +
    "vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);" +
    "float nDotl = max(dot(normal,lightDirection),0.0);" +
    "v_Color = vec4(nDotl * color.rgb + vec3(0.1),color.a);" +
    "}";
var FSHADER =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

var modelMatrix = new Matrix4(),
    normalMatrix = new Matrix4(),
    mvpMatrix = new Matrix4();
var matrixStack = [];
function main(){
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of uniform variables
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_MvpMatrix || !u_NormalMatrix) {
        console.log('Failed to get the storage location');
        return;
    }
    var viewMartex = new Matrix4();
    viewMartex.setPerspective(50.0,canvas.width/canvas.height,1.0,100.0);
    viewMartex.lookAt(20.0,10.0,30.0,0,0,0,0,1,0);
    document.onkeydown = function (e) {
        keyDown(e,gl,n,viewMartex,u_MvpMatrix,u_NormalMatrix);
    }

    draw(gl,n,viewMartex,u_MvpMatrix,u_NormalMatrix);
}
main();

var ANGLE_STEP = 3.0;
var g_arm1Angle = 90.0;   // The rotation angle of arm1 (degrees)
var g_joint1Angle = 45.0; // The rotation angle of joint1 (degrees)
var g_joint2Angle = 0.0;  // The rotation angle of joint2 (degrees)
var g_joint3Angle = 0.0;  // The rotation angle of joint3 (degrees)

function keyDown(e,gl,n,viewMartex,u_MvpMatrix,u_NormalMatrix) {
    switch (e.keyCode) {
        case 40: // Up arrow key -> the positive rotation of joint1 around the z-axis
            if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
            break;
        case 38: // Down arrow key -> the negative rotation of joint1 around the z-axis
            if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
            break;
        case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        case 90: // 'ｚ'key -> the positive rotation of joint2
            g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
            break;
        case 88: // 'x'key -> the negative rotation of joint2
            g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
            break;
        case 86: // 'v'key -> the positive rotation of joint3
            if (g_joint3Angle < 60.0)  g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
            break;
        case 67: // 'c'key -> the nagative rotation of joint3
            if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
            break;
        default: return; // Skip drawing at no effective action
    }
    // Draw the robot arm
    draw(gl, n, viewMartex, u_MvpMatrix, u_NormalMatrix);
}
function pushStack(m) {
    var ma = new Matrix4(m);
    matrixStack.push(ma);
}
function popStack() {
    return matrixStack.pop();
}
function draw(gl,n,viewMartex, u_MvpMatrix, u_NormalMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var baseHeight = 2.0;
    modelMatrix.setTranslate(0.0,-12.0,0.0);
    drawBox(gl,n,10.0,baseHeight,10.0,viewMartex,u_MvpMatrix,u_NormalMatrix);

    var arm1Len = 10.0;
    modelMatrix.translate(0.0,baseHeight,0.0);
    modelMatrix.rotate(g_arm1Angle,0.0,1.0,0.0);
    drawBox(gl,n,5.0,arm1Len,5.0,viewMartex,u_MvpMatrix,u_NormalMatrix);

    var arm2Len = 10.0;
    modelMatrix.translate(0.0,arm1Len,0.0);
    modelMatrix.rotate(g_joint1Angle,1.0,0.0,0.0);
    drawBox(gl,n,4.0,arm2Len,4.0,viewMartex,u_MvpMatrix,u_NormalMatrix);

    var palmLength = 2.0;
    modelMatrix.translate(0.0, arm2Len, 0.0);       // Move to palm
    modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    drawBox(gl, n, 2.0, palmLength, 6.0, viewMartex, u_MvpMatrix, u_NormalMatrix);  // Draw

    // Move to the center of the tip of the palm
    modelMatrix.translate(0.0, palmLength, 0.0);

    // Draw finger1
    pushStack(modelMatrix);
    modelMatrix.translate(0.0, 0.0, 3.0);
    modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0);  // Rotate around the x-axis
    drawBox(gl, n, 1.0, 3.0, 1.0, viewMartex, u_MvpMatrix, u_NormalMatrix);
    modelMatrix = popStack();

    // Draw finger2
    modelMatrix.translate(0.0, 0.0, -3.0);
    modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0);  // Rotate around the x-axis
    drawBox(gl, n, 1.0, 3.0, 1.0, viewMartex, u_MvpMatrix, u_NormalMatrix);
}
function drawBox(gl,n,width,height,depth,viewMatrix,u_MvpMatrix,u_NormalMatrix) {
    pushStack(modelMatrix);
    modelMatrix.scale(width,height,depth);
    mvpMatrix.set(viewMatrix);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);   //逆向   让modelMatrix成为逆倒置矩阵
    normalMatrix.transpose();                 //倒置

    gl.uniformMatrix4fv(u_NormalMatrix,false,normalMatrix.elements);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
    modelMatrix = popStack();
}
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
    ]);

// Normal
    var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
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

// Write the vertex property to buffers (coordinates and normals)
    if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;

// Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    return true;
}
