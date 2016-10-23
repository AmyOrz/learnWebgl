/**
 *三角形动画
 */
var VSHANDER = 'attribute vec4 a_Position;' +
    'uniform mat4 u_xformMatrix;' +  //4*4阶矩阵
    'void main(){ ' +
    'gl_Position = u_xformMatrix*a_Position;' +  //矩阵和矢量相乘
    '}';
var FSHANDER = 'void main(){\n'
    +'gl_FragColor = vec4(1.0,1.0,0.0,1.0);\n' +  //设置颜色
    '}\n';

var Angle = 45.0;
var last = Date.now();
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

    var modelMatrix = new Matrix4();
    var currentAngle = 0.0;

    var u_xformMatrix = gl.getUniformLocation(gl.program,"u_xformMatrix");
    var tick = function(){
        currentAngle = animate(currentAngle);

        draw(gl,n,currentAngle,modelMatrix,u_xformMatrix);
        requestAnimationFrame(tick);
    }
    tick();
}
main();

function initVertexBuffer(gl){
    var vertices = new Float32Array([
        0.0,0.5,-0.5,-0.5,0.5,-0.5
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
function animate(currentAngle){
    var now = Date.now();
    var elapsed = now - last;
    last = now;
    var newAngle = currentAngle + (Angle*elapsed)/1000.0;
    return newAngle%=360;   //用360取余数
}

function draw(gl,n,angle,model,u_model){
    model.setRotate(angle,0,0,1);
    model.translate(0.3,0,0);
    gl.uniformMatrix4fv(u_model,false,model.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}