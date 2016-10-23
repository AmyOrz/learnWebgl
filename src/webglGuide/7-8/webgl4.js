/**
 *绘制三维空间三角形 键盘控制正射投影
 */
var VSHANDER =
    "attribute vec4 a_Position;" +
    "attribute vec4 a_Color;" +
    "uniform mat4 u_MvpMartex;" +   //矩阵
    "varying vec4 v_Color;" +
    "void main(){" +
    "gl_Position = u_MvpMartex * a_Position;" +
    "v_Color = a_Color;" +
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
    if(!u_MvpMartex)alert("mvpMartex error");
    var MvpMartex = new Matrix4();

    MvpMartex.setPerspective(30,canvas.width/canvas.height,1,100);
    MvpMartex.lookAt(5,5,15,0,0,0,0,1,0);

    gl.uniformMatrix4fv(u_MvpMartex,false,MvpMartex.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);

    MvpMartex.translate(0.0,-2.0,1.0);
    gl.uniformMatrix4fv(u_MvpMartex,false,MvpMartex.elements);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}
main();
function initVertexBuffer(gl) {
    var verticesColor = new Float32Array([
        1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
        1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
        1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
        1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
    ]);
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ]);

    var buffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();
    if(!buffer || !indexBuffer )alert("buffer error");

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,verticesColor,gl.STATIC_DRAW);

    var fsize = verticesColor.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program,"a_Position");
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,fsize*6,0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program,"a_Color");
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,fsize*6,fsize*3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
    return indices.length;
}
