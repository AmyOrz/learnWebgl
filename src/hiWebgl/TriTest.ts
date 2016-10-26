namespace Amy {
    let VSHADER_SOURCE:string =
        'attribute vec4 a_Position;\n' +
        'uniform mat4 u_ModelMatrix;\n' +
        'void main() {\n' +
        '  gl_Position = u_ModelMatrix * a_Position;\n' +
        '}\n';
    let FSHADER_SOURCE:string =
        'void main() {\n' +
        '  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' +
        '}\n';

    let director = new Director(document.getElementById("webgl"));
    let gl:any = director.initWebgl();
    if(!director.initShader(VSHADER_SOURCE,FSHADER_SOURCE))alert("the shader err");
    let n:number = initVertexBuffer();
    let modelMatrix = new Matrix4();
    let Angle:number = 30.0;
    let tx:number = 0.5;
    modelMatrix.setRotate(Angle,0,0,1);
    modelMatrix.translate(tx,0,0);
    let u_ModelMatrix = gl.getUniformLocation(gl.program,"u_ModelMatrix");
    if(!u_ModelMatrix)
        console.log("model matrix err");
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,n);

    function initVertexBuffer():number{
        let vertices:Float32Array = new Float32Array([
            0, 0.3,   -0.3, -0.3,   0.3, -0.3
        ]);
        let vertexBuffer:any = gl.createBuffer();
        if(!vertexBuffer){
            console.log("buffer err");
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        let a_Position = gl.getAttribLocation(gl.program,"a_Position");
        if(a_Position<0){
            console.log("aPosition error");
            return -1;
        }
        gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(a_Position);

        return 3;
    }
}
