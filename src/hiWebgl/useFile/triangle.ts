namespace Amy{
    let vshader:string =
        "attribute vec4 a_Position;" +
        "uniform mat4 modelMatrix;" +
        "void main(){" +
        "gl_Position =  modelMatrix * a_Position;" +
        "}";
    let fshader:string =
        "precision mediump float;" +
        "uniform vec4 u_FragColor;" +
        "void main(){" +
        "gl_FragColor = u_FragColor;" +
        "}";
    let canvas:HTMLElement = document.getElementById("webgl");
    let director:Director = new Director();
    let gl:WebGLRenderingContext = director.getWebglContext(canvas);
    let program:WebGLProgram = director.initShader(vshader,fshader);

    let u_FragColor:WebGLUniformLocation = gl.getUniformLocation(program,"u_FragColor");
    let modelMatrix:WebGLUniformLocation = gl.getUniformLocation(program,"modelMatrix");
    gl.useProgram(program);
    gl.uniform4f(u_FragColor,1.0,0.0,0.0,1.0);

    let model:Matrix4 = new Matrix4();
    model.setTranslate(0.8,0.0,0.0);
    model.rotate(30,0,0,1);

    gl.uniformMatrix4fv(modelMatrix,false,model.elements);

    let n = initVertexBuffer();
    if(n < 0)console.log("buffer is error");

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,n);

    function initVertexBuffer(){
        let vertexs:Float32Array = new Float32Array([
            -0.5,-0.5,-0.5,0.5,0.5  ,-0.5,0.5,0.5
        ]);
        let n = 4;
        let vertexBuffer:WebGLBuffer = gl.createBuffer();
        if(vertexBuffer == void 0)return -1;
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertexs,gl.STATIC_DRAW);

        let a_Position:number = gl.getAttribLocation(program,"a_Position");
        gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(a_Position);
        return n;
    }
}
