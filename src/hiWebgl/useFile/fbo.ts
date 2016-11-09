namespace Amy {
    type VertexObject = {
        vertexBuffer:WebGLBuffer;
        texCoordBuffer:WebGLBuffer;
        indexBuffer:WebGLBuffer;
        numIndices:number;
    }
    let VSHADER: string =
        "attribute vec4 a_Position;" +
        "attribute vec2 a_TexCoord;" +
        "uniform mat4 u_MvpMatrix;" +
        "varying vec2 v_TexCoord;" +
        "void main(){" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        "v_TexCoord = a_TexCoord;" +
        "}";
    let FSHADER: string =
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "uniform sampler2D u_Sampler;" +
        "varying vec2 v_TexCoord;" +
        "void main(){" +
        "gl_FragColor = texture2D(u_Sampler,v_TexCoord);" +
        "}";
    let canvas: HTMLElement = document.getElementById("webgl");
    let director: Director = new Director();
    let gl: WebGLRenderingContext = director.getWebglContext(canvas);
    let program: WebGLProgram = director.initShader(VSHADER, FSHADER);
    let last:number = Date.now();
    let g_ModelMatrix:Matrix4 = new Matrix4();
    let g_MvpMatrix:Matrix4 = new Matrix4();
    if (!program)alert("shader err");

    let a_Position:number = gl.getAttribLocation(program,"a_Position");
    let a_TexCoord:number = gl.getAttribLocation(program,"a_TexCoord");
    let u_MvpMatrix:WebGLUniformLocation = gl.getUniformLocation(program,"u_MvpMatrix");
    if(a_Position<0 || a_TexCoord<0 || !u_MvpMatrix)alert("attrib err");
    let cube:VertexObject = initObjectVertex(CubeData);
    let plane:VertexObject = initObjectVertex(PlaneData);
    let texture:WebGLTexture = initTexture();
    let fbo:WebGLFramebuffer = initFrameBuffer();
    console.log(plane)
    initWebglParam();
    let VpMatrix:Matrix4 = new Matrix4();
    VpMatrix.setPerspective(45,canvas.offsetWidth/canvas.offsetHeight,1,100);
    VpMatrix.lookAt(0,0,7,0,0,0,0,1,0);
    let VpFboMatrix:Matrix4 = new Matrix4();
    VpFboMatrix.setPerspective(45,1,1,100);
    VpFboMatrix.lookAt(0,2,7,0,0,0,0,1,0);
    let currentAngle:number = 0.0;
    let tick = ()=>{
        currentAngle = animate(currentAngle);
        draw(currentAngle);
        // window.requestAnimationFrame(tick);
    };
    tick();

    function draw(angle:number):void{
        gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
        gl.viewport(0,0,1024,1024);
        gl.clearColor(1,1,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        drawTextureCube(angle,cube,texture);

        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.viewport(0,0,canvas.offsetWidth,canvas.offsetHeight);
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        drawTexturePlane(angle,plane,fbo.texture);
    }
    function drawTexturePlane(angle:number,obj:VertexObject,texture:WebGLTexture){
        g_ModelMatrix.setTranslate(0,0,1);
        g_ModelMatrix.rotate(20,1,0,0);
        g_ModelMatrix.rotate(angle,0,1,0);

        g_MvpMatrix.set(VpFboMatrix);
        g_MvpMatrix.multiply(g_ModelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix,false,g_MvpMatrix.elements);

        drawTextureObject(obj,texture);
    }
    function drawTextureCube(angle:number,obj:VertexObject,texture:WebGLTexture){
        g_ModelMatrix.setRotate(20,1,0,0);
        g_ModelMatrix.rotate(angle,0,1,0);
        g_MvpMatrix.set(VpMatrix);
        g_MvpMatrix.multiply(g_ModelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix,false,g_MvpMatrix.elements);

        drawTextureObject(obj,texture);
    }
    function drawTextureObject(obj:VertexObject,texture:WebGLTexture){
        initAttributeVariable(a_Position,obj.vertexBuffer);
        initAttributeVariable(a_TexCoord,obj.texCoordBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,obj.indexBuffer);
        gl.drawElements(gl.TRIANGLES,obj.numIndices,obj.indexBuffer.pointType,0);
    }
    function initAttributeVariable(attribute:number,arrBuffer:WebGLBuffer){
        gl.bindBuffer(gl.ARRAY_BUFFER,arrBuffer);
        gl.vertexAttribPointer(attribute,arrBuffer.pointNumber,arrBuffer.pointType,false,0,0);
        gl.enableVertexAttribArray(attribute);
    }
    function animate(angle:number):number{
        let now:number = Date.now();
        let temp:number = now - last;
        last = now;
        let newAngle = angle + (30 * temp)/1000.0;
        return newAngle%=360;
    }
    function initWebglParam() {
        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(program);
    }
    function initFrameBuffer():WebGLFramebuffer{
        let frameBuffer:WebGLFramebuffer,
            texture:WebGLTexture,
            depthBuffer:WebGLRenderbuffer;

        let err = ():any=>{
            if(frameBuffer)gl.deleteFramebuffer(frameBuffer);
            if(texture)gl.deleteTexture(texture);
            if(depthBuffer)gl.deleteRenderbuffer(depthBuffer);
            return null;
        };
        frameBuffer = gl.createFramebuffer();
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1024,1024,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINES);

        frameBuffer.texture = texture;
        gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);

        depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER,depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,1024,1024);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthBuffer);
        let e:any = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if(e !== gl.FRAMEBUFFER_COMPLETE){
            alert("frame err");
            return err();
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.bindTexture(gl.TEXTURE_2D,null);
        gl.bindRenderbuffer(gl.RENDERBUFFER,null);
        return frameBuffer;
    }
    function initTexture():WebGLTexture{
        let texture:WebGLTexture = gl.createTexture();
        let u_Sampler:WebGLUniformLocation = gl.getUniformLocation(program,"u_Sampler");
        if(!u_Sampler)alert("sampler err");

        let img:HTMLImageElement = new Image();
        img.onload = ()=>{
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
            gl.bindTexture(gl.TEXTURE_2D,texture);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINES);
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
            gl.uniform1i(u_Sampler,0);

            gl.bindTexture(gl.TEXTURE_2D,null);
        };
        img.src = "./parasol.jpg";
        return texture;
    }
    function initObjectVertex(Object:any):VertexObject{
        let obj:VertexObject = {
            vertexBuffer:initArrayBuffer(Object.vertices, 3, gl.FLOAT),
            texCoordBuffer:initArrayBuffer(Object.texCoords, 2, gl.FLOAT),
            indexBuffer:initElementArrayBuffer(Object.indices, gl.UNSIGNED_BYTE),
            numIndices:Object.indices.length
        };
        return obj;
    }
    function initArrayBuffer(arr:Float32Array,num:number,type:number):WebGLBuffer{
        let buffer:WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,arr,gl.STATIC_DRAW);

        buffer.pointNumber = num;
        buffer.pointType = type;
        return buffer;
    }
    function initElementArrayBuffer(arr:Float32Array,type:number):WebGLBuffer{
        let buffer:WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,arr,gl.STATIC_DRAW);
        buffer.pointType = type;
        return buffer;
    }
}
