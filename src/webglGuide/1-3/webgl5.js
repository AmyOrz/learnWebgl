/**
 *平移三角形
 */
var VSHANDER = 'attribute vec4 a_Position;' +
    'uniform vec4 u_Translation;' +
    'void main(){ ' +
    'gl_Position = a_Position+u_Translation;' +
    '}';
var FSHANDER = 'void main(){\n'
    +'gl_FragColor = vec4(1.0,1.0,0.0,1.0);\n' +  //设置颜色
    '}\n';
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
    var u_Translation = gl.getUniformLocation(gl.program,"u_Translation");
    gl.uniform4f(u_Translation,0.4,0.4,0.0,0.0); //不能使用2f,因为最后一位只能是1.0，之前a_Position已经是1.0了，所以这里是0.0
    gl.clearColor(0.0,0.0,0.0,1.0);    //设置背景颜色
    gl.clear(gl.COLOR_BUFFER_BIT);     //清除画布
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);      //绘制三角带
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);      //绘制三角扇
    gl.drawArrays(gl.TRIANGLES,0,n);      //画n个顶点
}
main();

function initVertexBuffer(gl){
    var vertices = new Float32Array([
       0.5,0.5,-0.5,0.5,-0.5,-0.5
    ]);
    var n = 3;
    var buffer = gl.createBuffer();
    if(!buffer){
        console.log("buffer渲染失败")
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program,"a_Position");
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}