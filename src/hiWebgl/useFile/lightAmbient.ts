namespace Amy{
    let vs:string =
        "attribute vec4 a_Position;" +
        "attribute vec4 a_Normal;" +
        "attribute vec4 a_Color;" +
        "uniform mat4 u_MvpMatrix;" +
        "uniform mat4 u_NormalMatrix;" +
        "uniform vec3 u_Diffuse;" +
        "uniform vec3 u_LightDirection;" +
        "uniform vec3 u_Ambient;" +
        "varying vec4 v_Color;" +
        "void main(){" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        "vec3 normal = normalize(vec3(u_NormalMatrix * a_normal));" +
        "float nDotL = max(dot(u_LightDirection,normal),0.0);" +
        "vec3 diffuse = u_Diffuse * a_Color.rgb * nDotL;" +
        "vec3 ambient = u_Ambient * a_Color.rgb;" +
        "v_Color = vec4(diffuse + ambient,a_Color.a);" +
        "}";
    let fs:string =
        '#ifdef GL_ES\n' +
        'precision mediump float;\n' +
        '#endif\n' +
        "varying vec4 v_Color;" +
        "void main(){" +
        "gl_FragColor = v_Color;" +
        "}";

    let canvas:HTMLElement = document.getElementById("webgl");
    let director:Director = new Director();
    let gl:WebGLRenderingContext = director.getWebglContext(canvas);
    let program:WebGLProgram = director.initShader(vs,fs);
    if(!program)console.log("program is error");
    gl.useProgram(program);
    let n:number = initVertexs();
    console.log(n);
    setColorAndDepth();
    initUniformAndMatrix();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);

    function initUniformAndMatrix(){
        let u_MvpMatrix:WebGLUniformLocation = gl.getUniformLocation(program,"u_MvpMatrix");
        let u_Diffuse:WebGLUniformLocation = gl.getUniformLocation(program,"u_Diffuse");
        let u_LightDirection:WebGLUniformLocation = gl.getUniformLocation(program,"u_LightDirection");
        let u_Ambient:WebGLUniformLocation = gl.getUniformLocation(program,"u_Ambient");
        let u_NormalMatrix:WebGLUniformLocation = gl.getUniformLocation(program,"u_NormalMatrix");

        let modelMatrix:Matrix4 = new Matrix4();
        let normalMatrix:Matrix4 = new Matrix4();
        let mvpMatrix:Matrix4 = new Matrix4();

        modelMatrix.setTranslate(3.0,0.0,0.0);
        modelMatrix.rotate(30,0,0,1);
        mvpMatrix.setPerspective(45,1,1,100);
        mvpMatrix.lookAt(4,3,10,0,0,0,0,1,0);
        mvpMatrix.multiply(modelMatrix);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();

        let lightDirection = new Vector3([4.5,3.0,4.0]);
        lightDirection.normalize();

        gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.elements);
        gl.uniform3f(u_Diffuse,1.0,0.0,0.0);
        gl.uniform3fv(u_LightDirection,lightDirection.elements);
        gl.uniform3f(u_Ambient,0.2,0.2,0.2);
        gl.uniformMatrix4fv(u_NormalMatrix,false,normalMatrix.elements);

    }
    function setColorAndDepth(){
        gl.clearColor(0,0,0,1);
        gl.enable(gl.DEPTH_TEST);
    }
    function initVertexs(){
        if(!initArrayBuffer("a_Position",CubeData.vertices,3))console.log("array buffer error");
        if(!initArrayBuffer("a_Color",CubeData.color,3))console.log("array buffer error");
        if(!initArrayBuffer("a_Normal",CubeData.normals,3))console.log("array buffer error");
        gl.bindBuffer(gl.ARRAY_BUFFER,null);

        let indexBuffer:WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,CubeData.indices,gl.STATIC_DRAW);

        return CubeData.indices.length;
    }
    function initArrayBuffer(attribute:string,data:Float32Array,size:number){
        let a_attribute:number = gl.getAttribLocation(program,attribute);
        let buffer:WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_attribute,size,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(a_attribute);
        return true;
    }
}
