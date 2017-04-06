import Director = Amy.Director;
import CubeData = Amy.CubeData;
import Matrix4 = Amy.Matrix4;
var vs =
    "attribute vec4 a_Position;" +
    "attribute vec4 a_Color;" +
    "uniform mat4 u_MvpMatrix;" +
    "varying vec4 v_Color;" +
    "void main(){" +
    "   gl_Position = u_MvpMatrix * a_Position;" +
    "   v_Color = a_Color;" +
    "}";
var fs =
    "precision mediump float;" +
    "varying vec4 v_Color;" +
    "void main(){" +
    "   gl_FragColor = v_Color;" +
    "}";

var canvas:HTMLElement = document.getElementById("webgl");
var director:Director = new Director();

var gl:WebGLRenderingContext = director.getWebglContext(canvas);
var program:WebGLProgram = director.initShader(vs,fs);
if(!program)console.log("program is error");
gl.useProgram(program);

var n = initVertices();

gl.clearColor(0,0,0,1);

var mvpMatrix = gl.getUniformLocation(program,"u_MvpMatrix");
var mvp = new Matrix4();

mvp.setPerspective(30, 1, 1, 100);
mvp.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
mvp.rotate(50,0,1,0);

gl.uniformMatrix4fv(mvpMatrix,false,mvp.elements);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);

function initVertices(){
    var position = gl.getAttribLocation(program,"a_Position");
    var color = gl.getAttribLocation(program,"a_Color");

    if(!initBuffer(position,3,gl.FLOAT,CubeData.vertices))return;
    if(!initBuffer(color,3,gl.FLOAT,CubeData.color))return;

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,CubeData.indices,gl.STATIC_DRAW);

    return CubeData.indices.length;
}
function initBuffer(attribute:number,size:number,type:any,data:Float32Array){
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);

    gl.vertexAttribPointer(attribute,size,type,false,0,0);
    gl.enableVertexAttribArray(attribute);

    return true;
}

