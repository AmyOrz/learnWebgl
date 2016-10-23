/**
 *漫反射+环境反射
 */
var VSHANDER =
    "attribute vec4 a_Position;" +
    "attribute vec4 a_Color;" +
    "attribute vec4 a_Normal;" +   //法向量
    "uniform mat4 u_MvpMartex;" +   //矩阵 = 模型*投影*视图
    "uniform vec3 u_LightColor;" +
    "uniform vec3 u_LightDirection;" +
    "uniform vec3 u_AmbientLight;" +
    "varying vec4 v_Color;" +
    "void main(){" +
    "gl_Position = u_MvpMartex * a_Position;" +
    "vec3 normal = normalize(a_Normal.xyz);" +
    "float nDotl = max(dot(u_LightDirection,normal),0.0);" +  //点极
    "vec3 diffuse = u_LightColor * a_Color.rgb * nDotl;" +
    "vec3 ambient = u_AmbientLight*a_Color.rgb;" +
    "v_Color = vec4(diffuse+ambient,a_Color.a);" +
    "}";
var FSHANDER =
    "#ifdef GL_ES\n" +   //预处理器，定义的宏GL_ES。
    "precision mediump float;\n" +     //精度
    "#endif\n" +
    "varying vec4 v_Color;" +
    "void main(){" +
    "gl_FragColor = v_Color;" +
    "}";
function main() {
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    if(!gl)alert("gl error");

    if(!initShaders(gl,VSHANDER,FSHANDER)){
        alert("initShader error");
    }
    var n = initVertexBuffer(gl);
    if(n<0){alert("initVertex error")}

    gl.clearColor(0,0,0,1);
    gl.enable(gl.DEPTH_TEST);

    var u_MvpMartex = gl.getUniformLocation(gl.program,"u_MvpMartex");
    var u_LightColor = gl.getUniformLocation(gl.program,"u_LightColor");
    var u_LightDirection = gl.getUniformLocation(gl.program,"u_LightDirection");
    var u_AmbientLight = gl.getUniformLocation(gl.program,"u_AmbientLight");
    if(!u_MvpMartex || !u_LightColor || !u_LightDirection)alert("mvpMartex error");
    var MvpMartex = new Matrix4();
    gl.uniform3f(u_LightColor,1.0,1.0,7.0);
    gl.uniform3f(u_AmbientLight,0.2,0.2,0.2);
    var lightDirection = new Vector3([-5,3.0,4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection,lightDirection.elements);

    MvpMartex.setPerspective(30,canvas.width/canvas.height,1,100);
    MvpMartex.lookAt(-5,-5,-10,0,0,0,0,1,0);

    gl.uniformMatrix4fv(u_MvpMartex,false,MvpMartex.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}
main();
function initVertexBuffer(gl) {
    var vertices = new Float32Array([   // Coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
    ]);


    var colors = new Float32Array([    // Colors
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 1, 0,   1, 1, 0,   1, 1, 0,  1, 1, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);


    var normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
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
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    if(!setBuffer(gl,"a_Position",vertices,3,gl.FLOAT))alert("error1");
    if(!setBuffer(gl,"a_Color",colors,3,gl.FLOAT))alert("error2");
    if(!setBuffer(gl,"a_Normal",normals,3,gl.FLOAT))alert("error3");

    var buffer = gl.createBuffer();
    if(!buffer)alert("buf error");
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
    return indices.length;
}
function setBuffer(gl,attribute,data,num,type) {
    var buffer = gl.createBuffer();
    if(!buffer)alert("buffer error");

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);

    var attribute = gl.getAttribLocation(gl.program,attribute);
    gl.vertexAttribPointer(attribute,num,type,false,0,0);
    gl.enableVertexAttribArray(attribute);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    return true;
}