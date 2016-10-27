namespace Amy {
    let VSHADER_SOURCE:string =
        "attribute vec4 a_Position;" +
        "attribute vec2 a_TexCoord;" +
        "varying vec2 v_TexCoord;" +
        "void main(){" +
        "gl_Position = a_Position;" +
        "v_TexCoord = a_TexCoord;" +
        "}";
    let FSHADER_SOURCE:string =
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "uniform sampler2D u_Sampler0;" +
        "uniform sampler2D u_Sampler1;" +
        "varying vec2 v_TexCoord;" +
        "void main(){" +
        "vec4 color0 = texture2D(u_Sampler0,v_TexCoord);" +
        "vec4 color1 = texture2D(u_Sampler1,v_TexCoord);" +
        "gl_FragColor = color0 * color1;" +
        "}";
    let director = new Director(document.getElementById("webgl"));
    let gl:any = director.initWebgl();
    if(!director.initShader(VSHADER_SOURCE,FSHADER_SOURCE))alert("the shader err");
    let n:number = initVertexBuffer();
    if(n < 0)console.log("initVertex error;");
    gl.clearColor(1,0,0,1);
    initTexture();

    function initTexture():void{
        let texture0 = gl.createTexture();
        let texture1 = gl.createTexture();
        if(!texture0 || !texture1)console.log("texture err");

        let u_Sampler0 = gl.getUniformLocation(gl.program,"u_Sampler0");
        let u_Sampler1 = gl.getUniformLocation(gl.program,"u_Sampler1");
        if(!u_Sampler0 || !u_Sampler1)console.log("sampler create err");

        let img0 = new Image();
        let img1 = new Image();

        img0.onload = ()=>{
            loadTexture(texture0,u_Sampler0,img0,0);
        };
        img1.onload = ()=>{
            loadTexture(texture1,u_Sampler1,img1,1);
        };

        img0.src = './src/webglGuide/resources/sky.jpg';
        img1.src = './src/webglGuide/resources/circle.gif';
    }
    let texUnit0:boolean = false;
    let texUnit1:boolean = false;
    function loadTexture(texture:any,sampler:any,img:any,unit:number):void{
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
        if(unit == 0){
            gl.activeTexture(gl.TEXTURE0);
            texUnit0 = true;
        }else{
            gl.activeTexture(gl.TEXTURE1);
            texUnit1 = true;
        }
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.uniform1i(sampler,unit);
        if(texUnit0 && texUnit1){
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
        }
    }
    function initVertexBuffer():number{
        let vertices:Float32Array = new Float32Array([
            -0.5,  0.5,   0.0, 1.0,
            -0.5, -0.5,   0.0, 0.0,
            0.5,  0.5,   1.0, 1.0,
            0.5, -0.5,   1.0, 0.0,
        ]);
        let vertexBuffer:any = gl.createBuffer();
        if(!vertexBuffer){
            console.log("buffer err");
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

        let FSIZE:number = vertexBuffer.BYTES_PER_ELEMENT;
        let a_Position = gl.getAttribLocation(gl.program,"a_Position");
        let a_TexCoord = gl.getAttribLocation(gl.program,"a_TexCoord");
        if(a_Position<0 || a_TexCoord < 0){
            console.log("aPosition error");
            return -1;
        }

        gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0);
        gl.enableVertexAttribArray(a_Position);

        gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
        gl.enableVertexAttribArray(a_TexCoord);
        return 4;
    }
}
