namespace Amy {
    let vs:string =
        "attribute vec4 a_position;" +
        "attribute vec2 a_texCoord;" +
        "varying vec2 v_texCoord;" +
        "void main(){" +
        "gl_Position = a_position;" +
        "v_texCoord = a_texCoord;" +
        "}";
    let fs:string =
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "uniform sampler2D u_sampler1;" +
        "uniform sampler2D u_sampler2;" +
        "varying vec2 v_texCoord;" +
        "void main(){" +
        "vec4 color1 = texture2D(u_sampler1,v_texCoord);" +
        "vec4 color2 = texture2D(u_sampler2,v_texCoord);" +
        "gl_FragColor = color1 * color2;" +
        "}";

    let canvas:HTMLElement = document.getElementById("webgl");
    let director:Director = new Director();
    let gl:WebGLRenderingContext = director.getWebglContext(canvas);
    let program:WebGLProgram = director.initShader(vs,fs);
    if(!program)console.log("program error");
    gl.useProgram(program);
    let n = initVertexs();
    gl.clearColor(0.0,0.0,0.0,1.0);
    initTexture();

    function initTexture(){
        let texture1:WebGLTexture = gl.createTexture();
        let texture2:WebGLTexture = gl.createTexture();

        let u_sampler1:WebGLUniformLocation = gl.getUniformLocation(program,"u_sampler1");
        let u_sampler2:WebGLUniformLocation = gl.getUniformLocation(program,"u_sampler2");

        let img1 = new Image();
        let img2 = new Image();

        img1.onload = ()=>{
            drawByImg(img1,texture1,u_sampler1,0);
        };
        img2.onload = ()=>{
            drawByImg(img2,texture2,u_sampler2,1);
        };
        img1.src = "2.jpg";
        img2.src = "12.jpg";
    }
    let isLoadTex1:boolean = false;
    let isLoadTex2:boolean = false;
    function drawByImg(img:HTMLImageElement,texture:WebGLTexture,sampler:WebGLUniformLocation,texUnit:number){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
        if(texUnit == 0){
            gl.activeTexture(gl.TEXTURE0);
            isLoadTex1 = true;
        }else if(texUnit == 1){
            gl.activeTexture(gl.TEXTURE1);
            isLoadTex2 = true;
        }
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.uniform1i(sampler,texUnit);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(isLoadTex1 && isLoadTex2){
            gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
        }

    }
    function initVertexs(){
        let verticesTexCoords:Float32Array = new Float32Array([
            // Vertex coordinate, Texture coordinate
            -0.5,  0.5,   0.0, 1.0,
            -0.5, -0.5,   0.0, 0.0,
            0.5,  0.5,   1.0, 1.0,
            0.5, -0.5,   1.0, 0.0,
        ]);
        let n:number = 4;
        let buffer:WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,verticesTexCoords,gl.STATIC_DRAW);
        let size:number = verticesTexCoords.BYTES_PER_ELEMENT;
        let a_position:number = gl.getAttribLocation(program,"a_position");
        gl.vertexAttribPointer(a_position,2,gl.FLOAT,false,size*4,0);
        gl.enableVertexAttribArray(a_position);

        let a_texCoord:number = gl.getAttribLocation(program,"a_texCoord");
        gl.vertexAttribPointer(a_texCoord,2,gl.FLOAT,false,size*4,size*2);
        gl.enableVertexAttribArray(a_texCoord);
        return n;
    }
}
