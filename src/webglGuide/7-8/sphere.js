var VSHADER =
    "attribute vec4 a_Position;" +
    "attribute vec4 a_Normal;" +
    "uniform mat4 u_MvpMatrix;" +
    "uniform mat4 u_ModelMatrix;" +
    "uniform mat4 u_NormalMatrix;" +
    "varying vec4 v_Color;" +
    "varying vec3 v_Normal;" +
    "varying vec3 v_Position;" +
    "void main(){" +
    "vec4 color = vec4(1.0,0.0,0.0,1.0);" +
    "gl_Position = u_MvpMatrix * a_Position;" +
    //顶点的模型矩阵后的位置
    "v_Position = vec3(u_ModelMatrix * a_Position);" +
    "v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));" +
    "v_Color = color;" +
    "}";
var FSHADER =
    "#ifdef GL_ES\n" +
    "precision mediump float;\n" +
    "#endif\n" +
    "uniform vec3 u_LightColor;" +
    "uniform vec3 u_LightPosition;" +
    "uniform vec3 u_AmbientLight;" +
    "varying vec3 v_Normal;" +
    "varying vec4 v_Color;" +
    "varying vec3 v_Position;" +
    "void main(){" +
    "vec3 normal = normalize(v_Normal);" +
    //点光源线性渐变（光位置-顶点位置）
    "vec3 lightDirec = normalize(u_LightPosition - v_Position);" +
    "float nDotl = max(dot(lightDirec,normal),0.0);" +
    //漫反射
    "vec3 diffuse = u_LightColor * v_Color.rgb * nDotl;" +
    "vec3 ambient = u_AmbientLight * v_Color.rgb;" +
    "gl_FragColor = vec4(diffuse + ambient,v_Color.a);" +
    "}";
function main(){
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);

    var program = gl.createProgram();
    var vs = gl.createShader(gl.VERTEX_SHADER);
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs,VSHADER);
    gl.shaderSource(fs,FSHADER);
    //编译着色器
    gl.compileShader(vs);
    gl.compileShader(fs);
    //绑定着色器到程序
    gl.attachShader(program,vs);
    gl.attachShader(program,fs);
    //链接着色器
    gl.linkProgram(program);
    gl.useProgram(program);

    if(!gl.getShaderParameter(vs,gl.COMPILE_STATUS || !gl.getShaderParameter(fs,gl.COMPILE_STATUS))){
        var error = gl.getShaderInfoLog(vs);
        var error2 = gl.getShaderInfoLog(fs);
        alert("shader err "+error +","+error2);
        return;
    }
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
        var error = gl.getProgramInfoLog(program);
        alert("program err "+error);
        return;
    }

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);
    var n = initSphereVertex(gl,36,program);
    if(n<0){
        alert("initVertex err");
    }

    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    var u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    var u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
    var u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    var u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
    if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight) {
        console.log('Failed to get the storage location');
        return;
    }

    gl.uniform3f(u_LightColor,0.8,0.8,0.8);
    gl.uniform3f(u_LightPosition,5.0,8.0,7.0);
    gl.uniform3f(u_AmbientLight,0.2,0.2,0.2);   //环境反射

    var modelMatrix = new Matrix4();  // Model matrix
    var mvpMatrix = new Matrix4();    // Model view projection matrix
    var normalMatrix = new Matrix4(); // Transformation matrix for normals

    modelMatrix.setRotate(90,0,1,0);
    mvpMatrix.setPerspective(45,canvas.width/canvas.height,1,100);
    mvpMatrix.lookAt(0,0,6,0,0,0,0,1,0);
    mvpMatrix.multiply(modelMatrix);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix,false,normalMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_SHORT,0);
}
main();
function initSphereVertex(gl,vertex,program) {
    var i,ai,si,ci;
    var j,aj,sj,cj;
    var p1,p2;
    var positions = [];
    var indices = [];

    for(j = 0;j<=vertex;j++){
        aj = j*Math.PI / vertex;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for(i = 0;i<=vertex;i++){
            ai = i*2*Math.PI/vertex;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            positions.push(si*sj);
            positions.push(cj);
            positions.push(ci*sj);

            if(j != vertex && i != vertex){
                p1 = j * (vertex+1) +i;
                p2 = p1 + (vertex+1);

                indices.push(p1);
                indices.push(p2);
                indices.push(p1 + 1);

                indices.push(p1 + 1);
                indices.push(p2);
                indices.push(p2 + 1);

            }
        }
    }
    console.log(indices)
    if(!initArrayBuffer(gl,"a_Position",new Float32Array(positions),gl.FLOAT,3,program))return;
    if(!initArrayBuffer(gl,"a_Normal",new Float32Array(positions),gl.FLOAT,3,program))return;

    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    return indices.length;
}
function initArrayBuffer(gl,attribute,data,type,num,program){
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);

    var variable = gl.getAttribLocation(program,attribute);
    gl.vertexAttribPointer(variable,num,type,false,0,0);
    gl.enableVertexAttribArray(variable);
    return true;
}