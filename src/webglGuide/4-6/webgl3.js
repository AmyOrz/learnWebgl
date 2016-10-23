/**
 *多顶点不同颜色和尺寸  //vertexAttribPointer只可以设置2个值
 */
var VSHANDER =
    'attribute vec4 a_Position;' +
    'attribute vec4 a_PointSize;' +
    'attribute vec4 a_Color;' +
    'varying vec4 v_Color;' +
    'void main(){ ' +
    'gl_Position = a_Position;' +
    'gl_PointSize = 30.0;' +
    'v_Color = a_Color;' +  //矩阵和矢量相乘
    '}';
var FSHANDER =
    'precision mediump float;' +
    'varying vec4 v_Color;' +
    'void main(){'+
    'gl_FragColor = v_Color;' +  //设置颜色
    '}';
function main(){
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    if(!gl){
        alert("error");
    }
    if(!initShaders(gl,VSHANDER,FSHANDER)){
        alert("着色其器错误");
    }
    var n = initVertexBuffer(gl);
    if(n < 0){
        console.log("initVertexBuffer 渲染失败");
        return;
    }
    gl.clearColor(0.0,0.0,0.0,1.0);    //设置背景颜色
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}
main();

function initVertexBuffer(gl){
    var vertices = new Float32Array([
        0.0,0.5,1.0,0.0,1.0,
        -0.5,-0.5,5.0,12.0,0.0,
        0.5,-0.5,0.8,0.0,1.0
    ]);
    var n = 3;
    var buffer = gl.createBuffer();
    if(!buffer){
        console.log("buffer渲染失败")
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    var fsize = vertices.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program,"a_Position");
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,fsize*5,0);
    gl.enableVertexAttribArray(a_Position);


    var a_Color = gl.getAttribLocation(gl.program,"a_Color");
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,fsize*5,fsize*2);
    gl.enableVertexAttribArray(a_Color);
    return n;
}
