namespace Amy {
    export class Game{
        constructor(private _canvas:any) {}
        private _gl:any;
        private _program:any;

        public start(vs:string, fs:string):void {
            this._initWebgl();
            this._enable(this._gl.DEPTH_TEST);
            if(!this._initShader(vs, fs))alert("shader error");
            this._gl.useProgram(this._program);
            this._initMatrix();
            this._setMatrix();
            let n = this._initVertex(36);
            this._setColor(0.0, 1.0, 1.0, 1.0);
            this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
            this._gl.drawElements(this._gl.TRIANGLES, n, this._gl.UNSIGNED_SHORT, 0);
        }
        private _initWebgl():void {
            this._gl = this._getWebgl();
            this._gl.viewportWidth = this._canvas.width;
            this._gl.viewportHeight = this._canvas.height;
        }

        private _initVertex(total:number):number{
            var i, ai, si, ci;
            var j, aj, sj, cj;
            var p1, p2,radius = 1.5;

            var positions = [];
            var indices = [];

            // Generate coordinates
            for (j = 0; j <= total; j++) {
                aj = j * Math.PI / total;
                sj = Math.sin(aj);
                cj = Math.cos(aj);
                for (i = 0; i <= total; i++) {
                    ai = i  * Math.PI / total;
                    si = Math.sin(ai);
                    ci = Math.cos(ai);

                    positions.push(radius*si * sj);  // X
                    positions.push(radius*cj);       // Y
                    positions.push(radius*ci * sj);  // Z
                    if(j != total && i != total){
                        p1 = j * (total+1) +i;
                        p2 = p1 + (total+1);

                        indices.push(p1);
                        indices.push(p2);
                        indices.push(p1 + 1);

                        indices.push(p1 + 1);
                        indices.push(p2);
                        indices.push(p2 + 1);
                    }
                }
            }

            if (!this._initArrayBuffer("a_Position",new Float32Array(positions), this._gl.FLOAT, 3)) return -1;
            if (!this._initArrayBuffer("a_Normal",new Float32Array(positions), this._gl.FLOAT, 3))  return -1;

            // Unbind the buffer object
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

            // Write the indices to the buffer object
            var indexBuffer = this._gl.createBuffer();
            if (!indexBuffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this._gl.STATIC_DRAW);

            return indices.length;
        }
        private _initArrayBuffer(attribute:any,data:any,type:number,num:number):boolean{
            var buffer = this._gl.createBuffer();
            if (!buffer) {
                console.log('Failed to create the buffer object');
                return false;
            }
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
            let a_attribute = this._gl.getAttribLocation(this._program, attribute);
            if (a_attribute < 0) {
                console.log('Failed to get the storage location of ' + attribute);
                return false;
            }
            this._gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
            // Enable the assignment of the buffer object to the attribute variable
            this._gl.enableVertexAttribArray(a_attribute);

            return true;
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
        private _initMatrix():void {

            this._program.UModelMatrix = this._gl.getUniformLocation(this._program, "u_ModelMatrix");
            this._program.UMvpMatrix = this._gl.getUniformLocation(this._program, "u_MvpMatrix");
            this._program.UNormalMatrix = this._gl.getUniformLocation(this._program, "u_NormalMatrix");
            this._program.ULightColor = this._gl.getUniformLocation(this._program, "u_LightColor");
            this._program.ULightPosition = this._gl.getUniformLocation(this._program, "u_LightPosition");
            this._program.UAmbientLight = this._gl.getUniformLocation(this._program, "u_AmbientLight");

            if(this._program.APosition<0 || this._program.ANormal<0 || !this._program.UModelMatrix ||
                !this._program.UMvpMatrix || !this._program.UNormalMatrix || !this._program.ULightColor
                || !this._program.ULightPosition || !this._program.UAmbientLight){
                alert("attribute is error");
            }
        }

        private _setMatrix():void {
            let modelMatrix = new Matrix4();
            let normalMatrix = new Matrix4();
            let mvpMatrix = new Matrix4();

            this._gl.uniform3f(this._program.ULightColor, 0.8, 0.8, 0.8);
            this._gl.uniform3f(this._program.ULightPosition, 5.8, 8.8, 7.8);
            this._gl.uniform3f(this._program.UAmbientLight, 0.2, 0.2, 0.2);

            modelMatrix.setRotate(90, 0, 1, 0);
            mvpMatrix.setPerspective(45, this._canvas.width / this._canvas.height, 1, 100);
            mvpMatrix.lookAt(0, 0, 6, 0, 0, 0, 0, 1, 0);
            mvpMatrix.multiply(modelMatrix);
            normalMatrix = modelMatrix.invert().transpose();

            this._gl.uniformMatrix4fv(this._program.UModelMatrix, false, modelMatrix.values);
            this._gl.uniformMatrix4fv(this._program.UMvpMatrix, false, mvpMatrix.values);
            this._gl.uniformMatrix4fv(this._program.UNormalMatrix, false, normalMatrix.values);

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
