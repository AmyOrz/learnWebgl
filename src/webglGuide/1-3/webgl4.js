/**
 * 绘制三角形
 * 不需要gl_pointSize属性
 */
var VSHANDER = "attribute vec4 a_Position;" +
    "void main(){" +
    "gl_Position = a_Position;" +
    "}";
var FSHANDER = "precision mediump float;" +
    "uniform vec4 u_FragColor;" +
    "void main(){" +
    "gl_FragColor = u_FragColor;" +
    "}";

function main() {
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    if(!gl)
        alert("你的浏览器不支持");

    if(!initShaders(gl,VSHANDER,FSHANDER)){
        alert("initShaders 渲染失败");
    }

    var n = initVertexBuffer(gl);
    if(n<0){
        alert("initVertexBuffer渲染失败");
        return;
    }
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);
}
function initVertexBuffer(gl){
    var vertices = new Float32Array([
        -0.5,0.5,0,-0.5,1,-0.5,0.5,0.5
    ]);
    var n = 4;
    var buffer = gl.createBuffer();
    if(!buffer){
        alert("缓冲区渲染失败");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program,"a_Position");
    var u_FragColor = gl.getUniformLocation(gl.program,"u_FragColor");
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.uniform4f(u_FragColor,1.0,1.0,0.0,1.0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}
main();
