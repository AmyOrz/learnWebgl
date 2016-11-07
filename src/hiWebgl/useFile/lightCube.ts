namespace Amy{
    let VSHADER:string =
        "attribute vec4 a_Position;" +
        "attribute vec4 a_Color;" +
        "attribute vec4 a_Normal;" +
        "uniform mat4 u_MvpMatrix;" +
        "uniform mat4 u_NormalMatrix;" +
        "uniform vec3 u_LightDirection;" +
        "varying vec4 v_Color;" +
        "void main(){" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        "vec4 normal = u_NormalMatrix * a_Normal;" +
        "float nDot = max(dot(u_LightDirection,normalize(normal.xyz)),0.0);" +
        "v_Color = vec4(a_Color.xyz * nDot,a_Color.a);" +
        "}";

    let FSHADER:string =
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "varying vec4 v_Color;" +
        "void main(){" +
        "gl_FragColor = v_Color;" +
        "}";
    let canvas:HTMLElement = document.getElementById("webgl");
    let director:Director = new Director();
    let gl:WebGLRenderingContext = director.getWebglContext(canvas);
    let program:WebGLProgram = director.initShader(VSHADER,FSHADER);
    if(!program)alert("shader err");
    let n:number = _initVertices();
    if(n<0)alert("vertices err");

    let u_MvpMatrix:WebGLUniformLocation = gl.getUniformLocation(program,"u_MvpMatrix");
    let u_NormalMatrix:WebGLUniformLocation = gl.getUniformLocation(program,"u_NormalMatrix");
    let u_LightDirection:WebGLUniformLocation = gl.getUniformLocation(program,"u_LightDirection");
    let vpMatrix:Matrix4 = new Matrix4();
    vpMatrix.setPerspective(45,canvas.offsetWidth/canvas.offsetHeight,1,100);
    vpMatrix.lookAt(3,3,7,0,0,0,0,1,0);

    let LightDirection:Vector3 = new Vector3([0.5,3.0,4.0]);
    LightDirection.normalize();
    gl.uniform3fv(u_LightDirection,LightDirection.elements);

    let currentAngle:number = 0.0;
    let modelMatrix:Matrix4 = new Matrix4();
    let mvpMatrix:Matrix4 = new Matrix4();
    let normalMatrix:Matrix4 = new Matrix4();

    _initWebglSetting();
    let tick = ()=>{
        currentAngle = _animate(currentAngle);
    //    console.log(currentAngle)
        modelMatrix.setRotate(currentAngle,0,1,0);
        mvpMatrix.set(vpMatrix).multiply(modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.elements);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix,false,normalMatrix.elements);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
        requestAnimationFrame(tick);
    };
    tick();
    let lastTime:number = Date.now();
    function _animate(currentAngle:number):number{
        let nowTime:number = Date.now();
        let elapsed:number = (nowTime - lastTime)||0;
        lastTime = nowTime;
        let newAngle:number = currentAngle + (30 * elapsed)/1000.0;
        return newAngle %= 360;
    }
    function _initWebglSetting(){
        gl.useProgram(program);
        gl.clearColor(0,0,0,1);
        gl.enable(gl.DEPTH_TEST);
    }

    function _initVertices():number{
        var vertices = new Float32Array([
            1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
            1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
            1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
            -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
            -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
            1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
        ]);

        // Colors
        var colors = new Float32Array([
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
        ]);

        // Normal
        var normals = new Float32Array([
            0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
            0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
            -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
            0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
            0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
        ]);

        // Indices of the vertices
        var indices = new Uint8Array([
            0, 1, 2,   0, 2, 3,    // front
            4, 5, 6,   4, 6, 7,    // right
            8, 9,10,   8,10,11,    // up
            12,13,14,  12,14,15,    // left
            16,17,18,  16,18,19,    // down
            20,21,22,  20,22,23     // back
        ]);
        if(!_initArrayBuffer("a_Position",vertices,3,gl.FLOAT))alert("init arr err");
        if(!_initArrayBuffer("a_Normal",normals,3,gl.FLOAT))alert("init arr err");
        if(!_initArrayBuffer("a_Color",colors,3,gl.FLOAT))alert("init arr err");

        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        let indexBuffer:WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
        return indices.length;
    }
    function _initArrayBuffer(attribute:string,vertices:Uint8Array|Float32Array,pointNum:number,pointType:number):boolean{
        let buffer:WebGLBuffer = gl.createBuffer();
        if(!buffer)alert("buffer err");

        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        let a_Attribute:number = gl.getAttribLocation(program,attribute);
        if(a_Attribute<0)alert("attribute err");
        gl.vertexAttribPointer(a_Attribute,pointNum,pointType,false,0,0);
        gl.enableVertexAttribArray(a_Attribute);
        return true;
    }
}