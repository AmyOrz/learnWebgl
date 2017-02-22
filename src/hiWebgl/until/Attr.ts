namespace Amy{
    export class Attr {
        private _program:any = {};
        constructor(private gl:WebGLRenderingContext,private program:WebGLProgram,private attrs:string[],private uniforms:string[]){
            let attrLen:number = this.attrs.length;
            let uniformLen:number = this.uniforms.length;

            for(let i = 0;i<attrLen;i++){
                this.put(this.attrs[i],this.gl.getAttribLocation(this.program,this.attrs[i]));
            }
            for(let i = 0;i<uniformLen;i++){
                this.put(this.uniforms[i],this.gl.getUniformLocation(this.program,this.uniforms[i]));
            }
        }

        public put(name:string,attr:number|WebGLUniformLocation):void{
            if(attr == void 0){
                console.log("the argument 2 is error");
                return;
            }
            let oldAttr:number|WebGLUniformLocation = this._program[name];
            if(oldAttr)
                return;
            this._program[name] = attr;
        }
        public getAttr(name:string):number{
            let oldAttr:number = this._program[name];
            if(!oldAttr)
                return null;

            return oldAttr;
        }
        public getUniform(name:string):WebGLUniformLocation{
            let oldAttr:WebGLUniformLocation = this._program[name];
            if(!oldAttr)
                return null;

            return oldAttr;
        }
    }
}
