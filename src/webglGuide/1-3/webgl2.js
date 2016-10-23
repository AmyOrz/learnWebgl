/**
 * 渲染顶点位置和颜色
 */
var VSHANDER = 'attribute vec4 a_Position;' +
    'attribute float a_PointSize;' +
    'void main(){ ' +
    'gl_Position = a_Position;' +
    'gl_PointSize = a_PointSize;' +
    '}';
var FSHANDER = 'precision mediump float;' +
    'uniform vec4 u_FragColor;' +
    'void main(){'+
    'gl_FragColor = u_FragColor;' +  //设置颜色
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
    var a_Position = gl.getAttribLocation(gl.program,"a_Position");   //获取attribute的存储位置
    var a_PointSize = gl.getAttribLocation(gl.program,"a_PointSize");
    var fragColor = gl.getUniformLocation(gl.program,"u_FragColor");
    if(a_Position < 0){
        console.log("a_Position变量不存在");
        return;
    }
    canvas.onmousedown = function(e){
        click(e);
    }
    var pointArr = [];
    function click(e){
        var x = e.clientX;
        var y= e.clientY;
        var point = {};
        var rect = canvas.getBoundingClientRect();
        point.x = ((x-rect.left) - canvas.height/2)/(canvas.height/2);  //获取鼠标位置
        point.y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
        pointArr.push(point);

        gl.clearColor(0.0,0.0,0.0,1.0);    //设置背景颜色
        gl.clear(gl.COLOR_BUFFER_BIT);     //清除画布
        for(var i = 0,len = pointArr.length;i<len;i++){
            gl.vertexAttrib2f(a_Position,pointArr[i].x,pointArr[i].y);
            switch(i%3){
                case 0:gl.uniform4f(fragColor,1.0,0.0,0.0,1.0);break;
                case 1:gl.uniform4f(fragColor,0.0,1.0,0.0,1.0);break;
                case 2:gl.uniform4f(fragColor,0.0,0.0,1.0,1.0);break;
            }
            gl.drawArrays(gl.POINTS,0,1);
        }
    }
    gl.vertexAttrib1f(a_PointSize,25.0);
    gl.clearColor(0.0,0.0,0.0,1.0);    //设置背景颜色
    gl.clear(gl.COLOR_BUFFER_BIT);     //清除画布
}
main();
