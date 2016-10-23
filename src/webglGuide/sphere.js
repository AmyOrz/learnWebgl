var VSHADER =
    "attribute vec3 a_Position;" +
    "attribute vec2 texCoord;" +
    "uniform mat4 MvpMatrix;" +
    "uniform mat4 ModelMatrix;" +
    "varying vec2 v_texCoord;" +
    "void main(){" +
    "gl_Position = ModelMatrix * MvpMatrix * vec4(a_Position,1.0);" +
    "v_texCoord = texCoord;" +
    "}";
var FSHADER =
    "precision mediump float;" +
    "uniform sampler2D texture;" +
    "varying vec2 v_texCoord;" +
    "void main(){" +
    "gl_FragColor = texture2D(texture,v_texCoord);" +
    // "gl_FragColor = vec4(0.0,1.0,0.0,1.0);" +
    "}";

function main() {
    var canvas = document.getElementById("webgl");
    var gl = canvas.getContext("experimental-webgl");
    if (!gl)alert("gl err");

    var program = gl.createProgram();
    var vs = gl.createShader(gl.VERTEX_SHADER);
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs)alert("shader err");
    //指定着色器
    gl.shaderSource(vs, VSHADER);
    gl.shaderSource(fs, FSHADER);
    //编译着色器
    gl.compileShader(vs);
    gl.compileShader(fs);
    //为程序分配着色器
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    //连接顶点和片元着色器
    gl.linkProgram(program);
    gl.useProgram(program);
    if(!gl.getShaderParameter(fs,gl.COMPILE_STATUS) || !gl.getShaderParameter(vs,gl.COMPILE_STATUS)){
        alert("shader err");
    }
    gl.clearColor(1.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);

    var a_Position = gl.getAttribLocation(program, "a_Position");
    var texCoord = gl.getAttribLocation(program,"textCoord");
    if(a_Position<0 || !texCoord){
        alert("attribute err")
    }

    //第一个参数n是循环次数，也就是绘制球体的精细程度
    //后面的参数是数组引用
    count=(function(n,po,tex){
        var i,j,k,f=function(a,b){
            var a=Math.PI*a/n,b=2*Math.PI*b/n,l=Math.sin(a);
            return [Math.sin(b)*l,Math.cos(a),Math.cos(b)*l];
        }; //f是球体方程的函数
        for(i=1;i<=n;i++)for(j=1;j<=n;j++){ //二重循环遍历球体方程的两参数
            //这里我就不用索引了，直接把每个四边形需要的6个顶点都用上
            k=[].concat(f(i,j),f(i-1,j),f(i,j-1),f(i,j-1),f(i-1,j),f(i-1,j-1));
            //po是顶点坐标数组，从参数传入指针的
            po.push.apply(po,k);
            tex.push(
                j/n,n-i/n, j/n,n-(i-1)/n, (j-1)/n,n-i/n,
                (j-1)/n,n-i/n, j/n,n-(i-1)/n, (j-1)/n,n-(i-1)/n
            );
            //单位球体的顶点法向量就是球心在原点上时的顶点坐标
        };
        return n*n*6; //返回顶点个数，绘制的时候要用到
    })(36,po_dat=[],tex_dat=[]);

    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(po_dat),gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(tex_dat),gl.STATIC_DRAW);
    gl.vertexAttribPointer(texCoord,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(texCoord);

    var MvpMatrix = gl.getUniformLocation(program,"MvpMatrix");
    var ModelMatrix = gl.getUniformLocation(program,"ModelMatrix");
    var texture = gl.getUniformLocation(program,"texture");

    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(45,1,1,100);
    mvpMatrix.lookAt(0,0,10,0,0,0,0,1,0);
    gl.uniformMatrix4fv(ModelMatrix,false,[
        1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,-2,1

    ]);
    gl.uniformMatrix4fv(MvpMatrix,false,mvpMatrix.elements);

    var img = new Image();
    img.src = "./2.jpg";
    img.onload = function () {
        var tex = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,tex);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(texture,0);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1)
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0,count);
    }
}