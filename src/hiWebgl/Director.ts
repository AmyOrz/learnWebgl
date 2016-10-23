namespace Amy {
    export class Director{
        constructor(private _canvas:any) {}
        private _gl:any;
        private _program:any;

        private _initWebgl():void{
            this._gl = this._getWebgl();
            this._gl.viewportWidth = this._canvas.width;
            this._gl.viewportHeight = this._canvas.height;
        }
        private _initShader(vs:string, fs:string):boolean {
            this._program = this._gl.createProgram();
            let vshader:any = this._loadShader(this._gl.VERTEX_SHADER, vs);
            let fshader:any = this._loadShader(this._gl.FRAGMENT_SHADER, fs);
            if (!vshader || !fshader) {
                return;
            }
            //连接着色器
            this._gl.attachShader(this._program, vshader);
            this._gl.attachShader(this._program, fshader);
            this._gl.linkProgram(this._program);
            let linked = this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS);
            if (!linked) {
                let err = this._gl.getProgramInfoLog(this._program);
                console.log("faild to link _program:" + err);
                this._gl.deleteProgram(this._program);
                this._gl.deleteShader(vshader);
                this._gl.deleteShader(vshader);
                return;
            }
            return true;
        }
        private _enable(type:number):void {
            this._gl.enable(type);
        }

        private _setColor(R:number, G:number, B:number, A:number):void{
            this._gl.clearColor(R, G, B, A);
        }

        private _getWebgl():any {
            let names:string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            let content:any;
            for (let item of names) {
                try {
                    content = this._canvas.getContext(item);
                } catch (e) {
                }
                if (content) {
                    break;
                }
            }
            return content;
        }

        private _loadShader(type:number, value:string):any {
            let shader:WebGLShader = this._gl.createShader(type);
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
