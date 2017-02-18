namespace Amy {
    type arrayBuffer = {
        size:number;
        type:number;
        data:any;
    }
    type elementArrayBuffer = {
        type:number;
        data:any;
    }
    type textureBuffer = {
        sampler:WebGLUniformLocation;
        src:string;

    }
    export class Director {
        private _gl: any;
        private attr:any = {};
        public getWebglContext(_canvas:any):WebGLRenderingContext {
            this._getWebgl(_canvas);
            this._gl.viewportWidth = _canvas.width;
            this._gl.viewportHeight = _canvas.height;
            return this._gl;
        }

        public initShader(vs: string, fs: string): WebGLProgram {
            let program:WebGLProgram = this._gl.createProgram();
            let vshader:WebGLShader = this._loadShader(this._gl.VERTEX_SHADER, vs);
            let fshader:WebGLShader = this._loadShader(this._gl.FRAGMENT_SHADER, fs);
            if (!vshader || !fshader) {
                return;
            }
            //连接着色器
            this._gl.attachShader(program, vshader);
            this._gl.attachShader(program, fshader);
            this._gl.linkProgram(program);
            let linked = this._gl.getProgramParameter(program, this._gl.LINK_STATUS);
            if (!linked) {
                let err = this._gl.getProgramInfoLog(program);
                console.log("faild to link _program:" + err);
                this._gl.deleteProgram(program);
                this._gl.deleteShader(vshader);
                this._gl.deleteShader(vshader);
                return;
            }
            return program;
        }
        public initArrayBuffer(param:arrayBuffer):WebGLBuffer{
            let buffer:WebGLBuffer = this._gl.createBuffer();
            if(!buffer)console.log("buffer create error");
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER,buffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER,param.data,this._gl.STATIC_DRAW);
            buffer.pointNumber = param.size;
            buffer.pointType = param.type;
            return buffer;
        }
        public initElementArrayBuffer(param:elementArrayBuffer):WebGLBuffer{
            let buffer:WebGLBuffer = this._gl.createBuffer();
            if(!buffer)console.log("buffer create error");
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER,buffer);
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER,param.data,this._gl.STATIC_DRAW);
            buffer.pointType = param.type;
            return buffer;
        }
        public initTextureBuffer(param:textureBuffer):WebGLTexture{
            let texBuffer:WebGLTexture = this._gl.createTexture();
            if(!texBuffer)console.log("texture buffer error");
            let img:HTMLImageElement = new Image();
            img.onload = ()=>{
                this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL,1);
                this._gl.activeTexture(this._gl.TEXTURE0);
                this._gl.bindTexture(this._gl.TEXTURE_2D,texBuffer);
                this._gl.texParameteri(this._gl.TEXTURE_2D,this._gl.TEXTURE_MIN_FILTER,this._gl.LINEAR);
                this._gl.texImage2D(this._gl.TEXTURE_2D,0,this._gl.RGBA,this._gl.RGBA,this._gl.UNSIGNED_BYTE,img);
                this._gl.uniform1i(param.sampler,0);
                this._gl.bindTexture(this._gl.TEXTURE_2D,null);
            };
            img.src = param.src;

            return texBuffer;
        }
        public initFrameBuffer(offsetWidth:number,offsetHeight:number):WebGLFramebuffer{
            let frameBuffer:WebGLFramebuffer = this._gl.createFramebuffer();
            let texture:WebGLTexture = this._gl.createTexture();
            let depth:WebGLRenderbuffer = this._gl.createRenderbuffer();

            if (!frameBuffer || !texture || !depth) {
                console.log('Failed to create frame buffer object');
                return;
            }
            this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
            this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, offsetWidth,offsetHeight, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);
            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
            frameBuffer.texture = texture;

            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER,frameBuffer);
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER,this._gl.COLOR_ATTACHMENT0,this._gl.TEXTURE_2D,texture,0);
            this._gl.bindRenderbuffer(this._gl.RENDERBUFFER,depth);
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER,this._gl.DEPTH_COMPONENT16,offsetWidth,offsetHeight);
            this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER,this._gl.DEPTH_ATTACHMENT,this._gl.RENDERBUFFER,depth);
            let e:any = this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER);

            if (this._gl.FRAMEBUFFER_COMPLETE !== e) {
                console.log('Frame buffer object is incomplete: ' + e.toString());
                return;
            }

            // Unbind the buffer object
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);

            return frameBuffer;
        }
        public getAttr():any{
            return this.attr;
        }
        public setAttributeInPogram(program:WebGLProgram,attributes:string[]){
            for(let i = 0,len = attributes.length;i<len;i++){
                this.attr[attributes[i]] = this._gl.getAttribLocation(program,attributes[i]);
            }
        }
        public setUniformInPogram(program:WebGLProgram,uniforms:string[]){
            for(let i = 0,len = uniforms.length;i<len;i++){
                this.attr[uniforms[i]] = this._gl.getAttribLocation(program,uniforms[i]);
            }
        }
        private _setColor(R: number, G: number, B: number, A: number): void {
            this._gl.clearColor(R, G, B, A);
        }

        private _getWebgl(_canvas:any): any {
            let names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            for (let item of names) {
                try {
                    this._gl = _canvas.getContext(item);
                } catch (e) {
                }
                if (this._gl) {
                    break;
                }
            }
        }

        private _loadShader(type: number, value: string): WebGLShader {
            let shader: WebGLShader = this._gl.createShader(type);
            if (shader == null) {
                console.log("unable to create shader");
                return;
            }
            this._gl.shaderSource(shader, value);   //着色器赋值
            this._gl.compileShader(shader);        //编译着色器

            let compiled = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS);
            if (!compiled) {
                let error = this._gl.getShaderInfoLog(shader);
                console.log("faild to compile shader:" + error);
                this._gl.deleteShader(shader);
                return;
            }
            return shader;
        }
    }
}