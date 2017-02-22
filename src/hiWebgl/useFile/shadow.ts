namespace Amy{
    type shapeBuffer = {
        vertexBuffer:WebGLBuffer;
        indicesBuffer:WebGLBuffer;
        colorBuffer:WebGLBuffer;
        numIndices:number;
    };
    let shadowVs:string =
        "attribute vec4 aPosition;" +
        "uniform mat4 uMvpMatrix;" +
        "void main(){" +
        "gl_Position = uMvpMatrix * aPosition;" +
        "}";
    let shadowFs:string =
        '#ifdef GL_ES\n' +
        'precision mediump float;\n' +
        '#endif\n' +
        'void main() {\n' +
        '  gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);\n' + // Write the z-value in R
        '}\n';
    let vs:string =
        "attribute vec4 aPosition;" +
        "attribute vec4 aColor;" +
        "uniform mat4 uMvpMatrix;" +
        "uniform mat4 uMvpMatrixFromLight;" +
        "varying vec4 vPositionFromLight;" +
        "varying vec4 vColor;" +
        "void main(){" +
        "gl_Position = uMvpMatrix * aPosition;" +
        "vPositionFromLight = uMvpMatrixFromLight * aPosition;" +
        "vColor = aColor;" +
        "}";
    let fs:string =
        '#ifdef GL_ES\n' +
        'precision mediump float;\n' +
        '#endif\n' +
        'uniform sampler2D uShadowMap;' +
        'varying vec4 vPositionFromLight;' +
        'varying vec4 vColor;' +
        'void main(){' +
        'vec3 shadowCoord = (vPositionFromLight.xyz/vPositionFromLight.w)/2.0+0.5;' +
        'vec4 rgbDepth = texture2D(uShadowMap,shadowCoord.xy);' +
        'float depth = rgbDepth.r;' +
        'float visibility = (shadowCoord.z>depth+0.005)?0.7:1.0;' +
        'gl_FragColor = vec4(vColor.rgb * visibility,vColor.a);' +
        '}';

    let  OFFSCREEN_WIDTH:number = 2048, OFFSCREEN_HEIGHT:number = 2048;
    let LIGHT_X:number = 0, LIGHT_Y:number = 11, LIGHT_Z:number = 2; // Position of the light source
    let last:number = Date.now();
    let Angle:number = 40;

    let canvas:HTMLElement = document.getElementById("webgl");
    let director:Director = new Director();
    let gl:WebGLRenderingContext = director.getWebglContext(canvas);

    let shadowProgram:WebGLProgram = director.initShader(shadowVs,shadowFs);
    let shadowAttr:Attr = new Attr(gl,shadowProgram,["aPosition"],["uMvpMatrix"]);

    let normalProgram:WebGLProgram = director.initShader(vs,fs);
    let normalAttr:Attr = new Attr(gl,normalProgram,["aPosition","aColor"],["uMvpMatrix","uMvpMatrixFromLight","uShadowMap"]);

    let triangle:shapeBuffer = initPixelVertex(TriangleData);
    let plane:shapeBuffer = initPixelVertex(PlaneData);
    let fbo:WebGLFramebuffer = director.initFrameBuffer(OFFSCREEN_WIDTH,OFFSCREEN_HEIGHT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,fbo.texture);
    basicSetting();

    let vpMatrix:Matrix4 = new Matrix4();
    let vpMatrixFromLight:Matrix4 = new Matrix4();
    setVpMatrix();

    let currentAngle:number = 0.0;
    let mvpMatrixTriangle:Matrix4 = new Matrix4();
    let mvpMatrixPlane:Matrix4 = new Matrix4();

    let modelMatrix:Matrix4 = new Matrix4();
    let mvpMatrix:Matrix4 = new Matrix4();

    let tick = ()=>{
        currentAngle = animate(currentAngle);
        gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
        gl.viewport(0,0,OFFSCREEN_WIDTH,OFFSCREEN_HEIGHT);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.useProgram(shadowProgram);

        drawTriangle(currentAngle,shadowAttr,triangle,vpMatrixFromLight);
        mvpMatrixTriangle.set(mvpMatrix);

        drawPlane(shadowAttr,plane,vpMatrixFromLight);
        mvpMatrixPlane.set(mvpMatrix);

        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.viewport(0,0,canvas.offsetWidth,canvas.offsetHeight);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.useProgram(normalProgram);

        gl.uniform1i(normalAttr.getUniform("uShadowMap"),0);

        gl.uniformMatrix4fv(normalAttr.getUniform("uMvpMatrixFromLight"),false,mvpMatrixTriangle.elements);
        drawTriangle(currentAngle,normalAttr,triangle,vpMatrix);

        gl.uniformMatrix4fv(normalAttr.getUniform("uMvpMatrixFromLight"),false,mvpMatrixPlane.elements);
        drawPlane(normalAttr,plane,vpMatrix);

        requestAnimationFrame(tick);
    };
    tick();

    function drawTriangle(angle:number,attr:Attr,triangle:shapeBuffer,VpMatrix:Matrix4):void{
        modelMatrix.setRotate(angle,0,1,0);
        draw(attr,triangle,VpMatrix);
    }

    function drawPlane(attr:Attr,plane:shapeBuffer,VpMatrix:Matrix4):void{
        modelMatrix.setRotate(90,1,0,0);
        modelMatrix.scale(3,3,3);
        draw(attr,plane,VpMatrix);
    }

    function draw(attr:Attr,shape:shapeBuffer,VpMatrix:Matrix4){
        initAttributeVariable(attr.getAttr("aPosition"),shape.vertexBuffer);

        if (attr.getAttr("aColor") != void 0)
            initAttributeVariable(attr.getAttr("aColor"),shape.colorBuffer);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,shape.indicesBuffer);
        mvpMatrix.set(VpMatrix);
        mvpMatrix.multiply(modelMatrix);
        gl.uniformMatrix4fv(attr.getUniform("uMvpMatrix"),false,mvpMatrix.elements);
        gl.drawElements(gl.TRIANGLES,shape.numIndices,gl.UNSIGNED_BYTE,0);
    }
    function initAttributeVariable(attribute:number,buffer:WebGLBuffer){
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.vertexAttribPointer(attribute,buffer.pointNumber,buffer.pointType,false,0,0);
        gl.enableVertexAttribArray(attribute);
    }

    function animate(angle:number):number{
        let now:number = Date.now();
        let elapse:number = now - last;
        last = now;
        let newAngle:number = angle + (Angle * elapse)/1000.0;
        return newAngle %= 360.0;
    }
    function setVpMatrix() {
        vpMatrix.setPerspective(45, canvas.offsetWidth / canvas.offsetHeight, 1, 100);
        vpMatrix.lookAt(0.0, 7.0, 9.0, 0, 0, 0, 0, 1, 0);
        vpMatrixFromLight.setPerspective(70.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1, 100);
        vpMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0, 0, 0, 0, 1, 0);

    }
    function basicSetting(){

        gl.clearColor(0,0,0,1);
        gl.enable(gl.DEPTH_TEST);
    }
    function initPixelVertex(data:any):shapeBuffer{

        let obj:shapeBuffer = {
            vertexBuffer:director.initArrayBuffer({
                size:3,
                data:data.vertices,
                type:gl.FLOAT
            }),
            colorBuffer:director.initArrayBuffer({
                size:3,
                data:data.color,
                type:gl.FLOAT
            }),
            indicesBuffer:director.initElementArrayBuffer({
                data:data.indices,
                type:gl.UNSIGNED_BYTE
            }),
            numIndices:data.indices.length
        };
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        return obj;
    }

}