var VSHANDER = 'attribute vec4 a_Position;' +
    'attribute float a_PointSize;' +
    'void main(){ ' +
    'gl_Position = a_Position;' +
    'gl_PointSize = a_PointSize;' +
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
    var a_Position = gl.getAttribLocation(gl.program,"a_Position");   //获取attribute的存储位置
    var a_PointSize = gl.getAttribLocation(gl.program,"a_PointSize");
    if(a_Position < 0){
        console.log("a_Position变量不存在");
        return;
    }
    gl.vertexAttrib3f(a_Position,0.5,0.0,0.0);    //设置a_Position的值，设置3个精度，同样有1f，2f的同名函数
    gl.vertexAttrib1f(a_PointSize,150.0);
    gl.clearColor(0.0,0.0,0.0,1.0);    //设置背景颜色
    gl.clear(gl.COLOR_BUFFER_BIT);     //清除画布
    gl.drawArrays(gl.POINTS,0,1);
}
main();
