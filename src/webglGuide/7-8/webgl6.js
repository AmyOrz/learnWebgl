// PointLightedCube_perFragment.js (c) 2012 matsuda and kanda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    //  'attribute vec4 a_Color;\n' + // Defined constant in main()
    'attribute vec4 a_Normal;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_ViewMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
    'varying vec4 v_Color;\n' +
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'void main() {\n' +
    '  vec4 color = vec4(1.0, 1.0, 1.0, 1.0);\n' + // Sphere color
    '  gl_Position =  u_ModelMatrix * u_MvpMatrix * u_ViewMatrix * a_Position;\n' +
    // Calculate the vertex position in the world coordinate
    '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
    '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '  v_Color = color;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    // Normalize the normal because it is interpolated and not 1.0 in length any more
    '  vec3 normal = normalize(v_Normal);\n' +
    // Calculate the light direction and make it 1.0 in length
    '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
    // The dot product of the light direction and the normal
    '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
    // Calculate the final color from diffuse reflection and ambient reflection
    '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
    '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
    '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
    '}\n';
var eyeX = 0,eyeY = 0,eyeZ = 6,
    atX = 0, atY = 0, atZ = 0;

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
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    //
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }
    // Set the clear color and enable the depth test
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of uniform variables
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight) {
        console.log('Failed to get the storage location');
        return;
    }
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_LightPosition, 5.0, 8.0, 7.0);
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

    var modelMatrix = new Matrix4();  // Model matrix
    var viewMatrix = new Matrix4();  // Model matrix
    var mvpMatrix = new Matrix4();    // Model view projection matrix
    var normalMatrix = new Matrix4(); // Transformation matrix for normals

    modelMatrix.setRotate(40, 0, 1, 0); // Rotate around the y-axis
    mvpMatrix.setPerspective(60, canvas.width/canvas.height, 1, 1000);
    viewMatrix.setLookAt(0,0,2,0,0,0,0,1,0);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    window.onkeydown = function(ev){ keydown(ev, gl, n, u_ViewMatrix,viewMatrix); };

    // viewMatrix.setLookAt(eyeX, eyeY,eyeZ, atX, atY, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}
function keydown(e,gl,n,uViewMatrix,viewMatrix){
    if (e.keyCode == 81) { //q
        atX += 0.1;
    }
    if (e.keyCode == 87) { //w
        // Page Down
        eyeZ += 0.1;
    }
    if (e.keyCode == 69) { //e
        // Left cursor key
        atX -= 0.1;
    }
    if (e.keyCode == 65) { //a
        // Right cursor key
        eyeX -= 0.1;
    }
    if (e.keyCode == 83) { //s
        // Up cursor key
        eyeZ -= 0.1;
    }
    if (e.keyCode == 68) { //d
        // Down cursor key
        eyeX += 0.1;
    }
    console.log(e.keyCode)
    viewMatrix.setLookAt(eyeX, eyeY,eyeZ, atX, atY, 0, 0, 1, 0);

    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}
function initVertexBuffers(gl) { // Create a sphere
    var SPHERE_DIV = 36;

    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2,radius = 1.5;

    var positions = [];
    var indices = [];

    // Generate coordinates
    for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
            ai = i  * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            positions.push(radius*si * sj);  // X
            positions.push(radius*cj);       // Y
            positions.push(radius*ci * sj);  // Z
            if(j != SPHERE_DIV && i != SPHERE_DIV){
                p1 = j * (SPHERE_DIV+1) +i;
                p2 = p1 + (SPHERE_DIV+1);

                indices.push(p1);
                indices.push(p2);
                indices.push(p1 + 1);

                indices.push(p1 + 1);
                indices.push(p2);
                indices.push(p2 + 1);
            }
        }
    }

    // Write the vertex property to buffers (coordinates and normals)
    // Same data can be used for vertex and normal
    // In order to make it intelligible, another buffer is prepared separately
    if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3))  return -1;

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

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