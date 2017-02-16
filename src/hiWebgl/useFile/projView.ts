namespace Amy{
    let vs:string =
        "attribute vec4 a_Position;" +
        "attribute vec4 a_Color;" +
        "uniform mat4 u_MvpMatrix;" +
        "varying vec4 v_Color;" +
        "void main(){" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        "v_Color = a_Color;" +
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
    if(!program)console.log("program error");
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    let n:number = initVertexs();
    initMatrixAndDraw();

    function initMatrixAndDraw(){
        let u_MvpMatrix:WebGLUniformLocation = gl.getUniformLocation(program,"u_MvpMatrix");
        if(!u_MvpMatrix)console.log("mvp matrix error");

        let projMatrix:Matrix4 = new Matrix4();
        let viewMatrix:Matrix4 = new Matrix4();
        let modelMatrix:Matrix4 = new Matrix4();
        let mvpMatrix:Matrix4 = new Matrix4();

        modelMatrix.setTranslate(0.75, 0, 0);
        viewMatrix.setLookAt(0, 0, 10, 0, 0, 0, 0, 1, 0);
        projMatrix.setPerspective(30,canvas.offsetWidth/canvas.offsetHeight,1,100);
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0,n);

        modelMatrix.setTranslate(-0.75,0,0);
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.elements);
        gl.drawArrays(gl.TRIANGLES,0,n);
    }


    function initVertexs(){

        let verticesColors:Float32Array = new Float32Array([
            // Vertex coordinates and color
            0.0,  1.0,  4.0,  0.4,  1.0,  0.4, // The back green one
            -0.5, -1.0,  4.0,  0.4,  1.0,  0.4,
            0.5, -1.0,  4.0,  1.0,  0.4,  0.4,

            0.0,  1.0,  2.0,  1.0,  1.0,  0.4, // The middle yellow one
            -0.5, -1.0, 2.0,  1.0,  1.0,  0.4,
            0.5, -1.0,  2.0,  1.0,  0.4,  0.4,

            0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one
            -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
            0.5, -1.0,   0.0,  1.0,  0.4,  0.4,
        ]);
        let n:number = 9;
        let buffer:WebGLBuffer = gl.createBuffer();
        if(!buffer)console.log("buffer error");
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);

        let size:number = verticesColors.BYTES_PER_ELEMENT;
        let a_Position:number = gl.getAttribLocation(program,"a_Position");
        if(a_Position < 0)console.log("position error");
        gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,size*6,0);
        gl.enableVertexAttribArray(a_Position);

        let a_Color:number = gl.getAttribLocation(program,"a_Color");
        if(a_Color < 0)console.log("color error");
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,size*6,size*3);
        gl.enableVertexAttribArray(a_Color);

        return n;
    }


}