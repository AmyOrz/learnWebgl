namespace Amy{
    let VSHADER:string =
        "attribute vec4 a_Position;" +
        "attribute vec4 a_color;" +
        "uniform mat4 u_mvpMatrix;" +
        "varying vec4 v_color;" +
        "void main(){" +
        "gl_Position = u_mvpMatrix * a_Position;" +
        "v_color = a_color;" +
        "}";
    let FSHADER:string =
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "varying vec4 v_color;" +
        "void main(){" +
        "gl_FragColor = v_color;" +
        "}";
    let director:Director = new Director();
    let canvas = document.getElementById("webgl");
    let gl = director.getWebglContext(canvas);
    if(!director.initShader(VSHADER,FSHADER))alert("shader err");
    gl.clearColor(0,0,0,1);
    let n:number = initVertices();
    initMatrix();
    function initVertices() {
        let verticesColors: Float32Array = new Float32Array([
            0.0, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
            -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
            0.5, -1.0, -4.0, 1.0, 0.4, 0.4,

            0.0, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
            -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
            0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

            0.0, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
            -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
            0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
        ]);
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

        let fsize: number = verticesColors.BYTES_PER_ELEMENT;

        let a_Position = gl.getAttribLocation(gl.program, "a_Position");
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, fsize * 6, 0);
        gl.enableVertexAttribArray(a_Position);

        let a_color = gl.getAttribLocation(gl.program, "a_color");
        gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, fsize * 6, fsize * 3);
        gl.enableVertexAttribArray(a_color);

        return 9;
    };

    function initMatrix():void{
        let u_mvpMatrix = gl.getUniformLocation(gl.program,"u_mvpMatrix");
        let modelMatrix:Matrix4 = new Matrix4();
        let viewMatrix:Matrix4 = new Matrix4();
        let projMatrix:Matrix4 = new Matrix4();
        let mvpMatrix:Matrix4 = new Matrix4();

        modelMatrix.setTranslate(-0.75,0,0);
        viewMatrix.setLookAt(0,0,5,0,0,-100,0,1,0);
        projMatrix.setPerspective(30,canvas.offsetWidth/canvas.offsetHeight,1,100);
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0,n);

        modelMatrix.setTranslate(0.75,0,0);
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);
        gl.drawArrays(gl.TRIANGLES,0,n);
    }
}