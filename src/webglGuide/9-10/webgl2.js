/**
 * 鼠标旋转立方体
 */
var VSHADER =
    "attribute vec4 a_Position;" +
    "attribute vec2 a_TexCoord;" +
    "uniform mat4 u_MvpMatrix;" +
    "varying vec2 v_TexCoord;" +
    "void main(){" +
    "gl_Position = u_MvpMatrix * a_Position;" +
    "v_TexCoord = a_TexCoord;" +
    "}";

var FSHADER =
    "#ifdef GL_ES\n" +
    "precision mediump float;\n" +
    "#endif\n" +
    "uniform sampler2D u_Sampler;" +   //取样器
    "varying vec2 v_TexCoord;" +
    "void main(){" +
    "gl_FragColor = texture2D(u_Sampler,v_TexCoord);" +
    "}";
var g_MvpMatrix = new Matrix4();
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
    if (!u_MvpMatrix) {
        console.log('Failed to get the storage location of uniform variable');
        return;
    }
    var ViewProjMatrix = new Matrix4();
    ViewProjMatrix.setPerspective(50,1,1.0,100.0);
    ViewProjMatrix.lookAt(3.0,3.0,5.0,0.0,0.0,0.0,0.0,1.0,0.0);

    var currentAngle = [0.0,0.0];
    initEventHandlers(canvas,currentAngle);

    if(!initTextures(gl)){alert("text error")}
    var tick = function () {
        draw(gl,n,ViewProjMatrix,u_MvpMatrix,currentAngle);
        requestAnimationFrame(tick,canvas);
    };
    tick();
}
function initEventHandlers(canvas,arrAngle){
    var dragging = false;
    var lastX = -1,
        lastY = -1;

    canvas.addEventListener("mousedown",function (e) {
        lastX = e.clientX;
        lastY = e.clientY;

        dragging = true;
    },false);

    canvas.addEventListener("mouseup",function (e) {
        dragging = false;
    },false);
    canvas.addEventListener("mousemove",function (e) {
        var x = e.clientX;
        var y = e.clientY;

        if(dragging){
            var factor = 100/canvas.height;
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            arrAngle[0] = arrAngle[0]+dy;
            arrAngle[1] = arrAngle[1]+dx;
        }
        lastX = x;
        lastY = y;
    },false);
}
function draw(gl,n,ViewProjMatrix,u_MvpMatrix,arrAngle) {
    g_MvpMatrix.set(ViewProjMatrix);
    g_MvpMatrix.rotate(arrAngle[0],1.0,0.0,0.0);
    g_MvpMatrix.rotate(arrAngle[1],0.0,1.0,0.0);

    gl.uniformMatrix4fv(u_MvpMatrix,false,g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}
function initVertexBuffers(gl) {
    var vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
    ]);

    var texCoords = new Float32Array([   // Texture coordinates
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
        0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
        1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
    ]);

    //顶点坐标
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    // Create a buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        return -1;
    }

    // Write vertex information to buffer object
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1; // Vertex coordinates
    if (!initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_TexCoord')) return -1;// Texture coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);

    return indices.length;
}
function initArrayBuffer(gl,array,num,type,attribute) {
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
function initTextures(gl){
    var texture = gl.createTexture();  //创建纹理对象
    if(!texture)alert("texture err");

    var u_Sampler = gl.getUniformLocation(gl.program,"u_Sampler");   //取样器
    if(!u_Sampler)alert("sampler err");

    var img = new Image();
    img.onload = function () {
      loadImg(gl,texture,u_Sampler,img);
    };
    img.src = "./4.jpg";
    return true;
}
function loadImg(gl,texture,u_Sampler,img) {
    //绕Y旋转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D,texture);
    //比例缩小纹理单元（min）
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    //设置图片到纹理单元
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);

    gl.uniform1i(u_Sampler,0);
}