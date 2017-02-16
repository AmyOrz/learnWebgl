namespace Amy{
    let vshader:string =
        "attribute vec4 a_Position;" +
        "void main(){" +
        "gl_Position = a_Position;" +
        "gl_PointSize = 10.0;" +
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

    let a_Position:number = gl.getAttribLocation(program,"a_Position");
    let u_FragColor:WebGLUniformLocation = gl.getUniformLocation(program,"u_FragColor");

    gl.useProgram(program);
    let pointArr:number[][] = [];
    let colorArr:number[][] = [];
    canvas.onmousedown = (ev)=>{
        let rect = ev.target.getBoundingClientRect();
        let x = ev.clientX;
        let y = ev.clientY;
        x = ((x - rect.left) - rect.width/2)/(rect.width/2);
        y = (rect.height/2 - (y - rect.top))/(rect.height/2);

        pointArr.push([x,y]);
        if(x <= 0 && y >= 0)colorArr.push([1.0,0.0,0.0,1.0]);
        else if(x >= 0 && y >= 0)colorArr.push([0.0,1.0,0.0,1.0]);
        else if(x <= 0 && y <= 0)colorArr.push([0.0,0.0,1.0,1.0]);
        else colorArr.push([1.0,1.0,1.0,1.0]);

        gl.clear(gl.COLOR_BUFFER_BIT);
        for(let i = 0,len = pointArr.length;i<len;i++) {
            let point:number[] = pointArr[i];
            let color:number[] = colorArr[i];
            gl.vertexAttrib3f(a_Position, point[0], point[1], 0.0);
            gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    };
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
