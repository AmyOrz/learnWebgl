/**
 *绘制三维空间三角形  效果如z-index
 */
var VSHANDER =
    "attribute vec4 a_Position;" +
    "attribute vec4 a_Color;" +
    "uniform mat4 u_Martex;" +   //视图矩阵 从
    "varying vec4 v_Color;" +
    "void main(){" +
    "gl_Position = u_Martex * a_Position;" +
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

    gl.clearColor(0.0,0.0,1.0,1.0);
    var u_Martex = gl.getUniformLocation(gl.program,"u_Martex");
    if(!u_Martex)alert("error");

    var viewMaxtex = new Matrix4();
    viewMaxtex.setLookAt(0.2,0.25,0.25,0,0,0,0,1,0).rotate(-20,0,0,1);   //直接使用rotate进行旋转
    gl.uniformMatrix4fv(u_Martex,false,viewMaxtex.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}
main();
function initVertexBuffer(gl) {
    var verticesColor = new Float32Array([
        0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
        -0.5, -0.5,  -0.4,  0.8,  1.0,  0.4,
        0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

        0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
        -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
        0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

        0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one
        -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
        0.5, -0.5,   0.0,  0.4,  0.4,  0.4,
    ]);

    var n = 9;
    var buffer = gl.createBuffer();
    if(!buffer)alert("buffer error");

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,verticesColor,gl.STATIC_DRAW);

    var fsize = verticesColor.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program,"a_Position");
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,fsize*6,0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program,"a_Color");
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,fsize*6,fsize*3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    return n;
}