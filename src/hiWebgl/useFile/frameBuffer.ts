namespace Amy{
    import Plane = THREE.Plane;
    let vs:string =
        "attribute vec4 a_Position;" +
        "attribute vec2 a_TexCoord;" +
        "uniform mat4 u_MvpMatrix;" +
        "varying vec2 v_TexCoord;" +
        "void main(){" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        "v_TexCoord = a_TexCoord;" +
        "}";
    let fs:string =
        '#ifdef GL_ES\n' +
        'precision mediump float;\n' +
        '#endif\n' +
        'uniform sampler2D sampler;' +
        'varying vec2 v_TexCoord;' +
        'void main(){' +
        'gl_FragColor = texture2D(sampler,v_TexCoord);' +
        '}';

    let canvas:HTMLElement = document.getElementById("webgl");
    let director:Director = new Director();
    let gl:WebGLRenderingContext = director.getWebglContext(canvas);
    let program:WebGLProgram = director.initShader(vs,fs);
    if(!program)console.log("program is error");

    let cube:Object = initCubeParam();
    let plane:Object = initPlaneParam();
    if(!cube || !plane)console.log("cube or plane error");

    let texture:WebGLTexture = director.initTextureBuffer({
        sampler:gl.getUniformLocation(program,"sampler"),
        src:"12.jpg"
    });
    if(!texture)console.log("texture is error");

    let fbo:


    function initCubeParam():Object{
        let obj:Object = {};
        obj.vertexBuffer = director.initArrayBuffer({
            data:CubeData.vertices,
            type:gl.FLOAT,
            size:3
        });

        obj.texCoordBuffer = director.initArrayBuffer({
            data:CubeData.texCoords,
            type:gl.FLOAT,
            size:2
        });
        obj.vertexBuffer = director.initElementArrayBuffer({
            data:CubeData.indices,
            type:gl.UNSIGNED_BYTE,
        });
        obj.numIndices = CubeData.indices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        return obj;
    }
    function initPlaneParam():Object{
        let obj:Object = {};
        obj.vertexBuffer = director.initArrayBuffer({
            data:PlaneData.vertices,
            type:gl.FLOAT,
            size:3
        });

        obj.texCoordBuffer = director.initArrayBuffer({
            data:PlaneData.texCoords,
            type:gl.FLOAT,
            size:2
        });
        obj.vertexBuffer = director.initElementArrayBuffer({
            data:PlaneData.indices,
            type:gl.UNSIGNED_BYTE,
        });
        obj.numIndices = PlaneData.indices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        return obj;
    }
}
