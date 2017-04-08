import Director = Amy.Director;
import CubeData = Amy.CubeData;
import Matrix4 = Amy.Matrix4;
var vs =
    "attribute vec4 a_Position;" +
    "attribute vec2 a_TexCoord;" +
    "uniform mat4 u_MvpMatrix;" +
    "varying vec2 v_TexCoord;" +
    "void main(){" +
    "   gl_Position = u_MvpMatrix * a_Position;" +
    "   v_TexCoord = a_TexCoord;" +
    "}";
var fs =
    "precision mediump float;" +
    "uniform sampler2D u_Sampler;" +
    "varying vec2 v_TexCoord;" +
    "void main(){" +
    "   gl_FragColor =texture2D(u_Sampler,v_TexCoord);" +
    "}";

var canvas = document.getElementById("webgl");
var director:Director = new Director();
var gl = director.getWebglContext(canvas);
var program = director.initShader(vs,fs);
if(!program)console.log("program is err");
gl.useProgram(program);

var n:number = initVertices();
gl.clearColor(0,0,0,1);
gl.enable(gl.DEPTH_TEST);

var uMvpMatrix:WebGLUniformLocation = gl.getUniformLocation(program,"u_MvpMatrix");
var mvpMatrix:Matrix4 = new Matrix4();
mvpMatrix.setPerspective(45,canvas.offsetWidth/canvas.offsetHeight,1,100);
mvpMatrix.lookAt(3,3,4,0,0,0,0,1,0);

var currentAngle = [0.0,0.0];
initEventHandler();
initTexture();

var tick = ()=>{
    draw();
    requestAnimationFrame(tick);
};
tick();

function draw(){
    mvpMatrix.rotate(currentAngle[0],1,0,0);
    mvpMatrix.rotate(currentAngle[1],0,1,0);

    gl.uniformMatrix4fv(uMvpMatrix,false,mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);

}

function initTexture(){
    var img = new Image();
    img.onload = ()=>{
        var texture = gl.createTexture();
        var uSampler = gl.getUniformLocation(program,"u_Sampler");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,texture);

        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);

        gl.uniform1i(uSampler,0);
    };
    img.src = "12.jpg";
}

function initEventHandler(){
    var dragging = false;
    var lastX = -1,lastY = -1;

    canvas.onmousedown = (ev)=>{
        var x = ev.clientX,y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
        if(_theMouseInCanvas(rect,x,y)){
            dragging = true;
            lastX = x;
            lastY = y;
        }
    };

    canvas.onmouseup = function () {
        dragging = false;
        currentAngle = [0.0,0.0];
    };

    canvas.onmousemove = function (ev) {
        var x = ev.clientX,y = ev.clientY;
        if(dragging){
            var factor = 100/canvas.offsetHeight;
            var dx = factor * (x-lastX);
            var dy = factor * (y-lastY);
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy,90),-90);
            currentAngle[1] = currentAngle[1] + dx;
        }
        lastX = x;
        lastY = y;
    }
}

function _theMouseInCanvas(rect:any,x:number,y:number){
    return rect.left < x && x < rect.right && rect.top < y && y < rect.bottom;
}

function initVertices():number{
    var position = gl.getAttribLocation(program,"a_Position");
    var texCoord = gl.getAttribLocation(program,"a_TexCoord");
    if(!_initBuffer(position,3,gl.FLOAT,CubeData.vertices))return -1;
    if(!_initBuffer(texCoord,2,gl.FLOAT,CubeData.texCoords))return -1;

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,CubeData.indices,gl.STATIC_DRAW);

    return CubeData.indices.length;
}
function _initBuffer(attribute:number,size:number,type:any,data:Float32Array){
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);

    gl.vertexAttribPointer(attribute,size,type,false,0,0);
    gl.enableVertexAttribArray(attribute);
    return true;
}

