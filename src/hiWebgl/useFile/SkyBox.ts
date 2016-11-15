namespace Amy{
    export class SkyBox{
        constructor(private _director:Director,private _canvas:HTMLElement){};

        private _gl:WebGLRenderingContext;
        private _program:WebGLProgram;
        public initComponent(){
            this._initWebgl();
            this._initProgram();
            let n:number = this._initVertices();
        }
        private _initVertices(){
            this._initBufferData("a_Position",PlaneData.vertices,3,this._gl.FLOAT);
            this._initBufferData("a_TexCoord",PlaneData.texCoords,2,this._gl.FLOAT);
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER,null);
            return 4;
        }
        private _initBufferData(attribute:string,attribArray:Float32Array|Uint8Array,pointNum:number,pointType:number){
            let buffer = this._gl.createBuffer();
            if(!buffer)alert("buffer err");
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER,buffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER,attribArray,this._gl.STATIC_DRAW);
            let a_Attribute = this._gl.getAttribLocation(this._program,attribute);
            if(a_Attribute<0)alert("attribute err");
            this._gl.vertexAttribPointer(a_Attribute,pointNum,pointType,false,0,0);
            this._gl.enableVertexAttribArray(a_Attribute);

        }
        private _initWebgl(){
            this._gl = this._director.getWebglContext(this._canvas);
            this._gl.enable(this._gl.DEPTH_TEST);
            this._gl.clearColor(0,0,0,1);
            this._gl.enable(this._gl.CULL_FACE);
            this._gl.cullFace(this._gl.FRONT);
        }
        private _initProgram(){
            let VSHADER:string = this._getVShader();
            let FSHADER:string = this._getFShader();
            this._program = this._director.initShader(VSHADER,FSHADER);
            if(!this._program)alert("shader err");
            this._gl.useProgram(this._program);
        }
        private _getVShader():string{
            return "attribute vec4 a_Position;" +
                "attribute vec2 a_TexCoord;" +
                "uniform mat4 u_MvpMatrix;" +
                "varying vec2 v_TexCoord;" +
                "void main(){" +
                "gl_Position = u_MvpMatrix * a_Position;" +
                "v_TexCoord = a_TexCoord;" +
                "}";
        }
        private _getFShader():string {
            return "#ifdef GL_ES\n" +
                "precision mediump float;\n" +
                "#endif\n" +
                "uniform sampler2D u_Sampler;" +
                "varying vec2 v_TexCoord;" +
                "void main(){" +
                "gl_FragColor = texture2D(u_Sampler,v_TexCoord);" +
                "}";
        }
    }
    let skyBox = new SkyBox(new Director(),document.getElementById("webgl"))
    skyBox.initComponent();
}
