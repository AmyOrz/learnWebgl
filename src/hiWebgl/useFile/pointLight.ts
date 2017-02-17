namespace Amy{
    let vs:string =
        "attribute vec4 a_Position;" +
        "attribute vec4 a_Normal;" +
        "uniform mat4 u_MvpMatrix;" +
        "uniform mat4 u_NormalMatrix;" +
        "uniform mat4 u_ModelMatrix;" +
        "varying vec4 v_Color;" +
        "varying vec3 v_Normal;" +
        "varying vec3 v_Position;" +
        "void main(){" +
        "vec4 color = vec4(1.0,1.0,1.0,1.0);" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        "v_Position = vec3(u_ModelMatrix * a_Position);" +
        "v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));" +
        "v_Color = color;" +
        "}";
    let fs:string =
        '#ifdef GL_ES\n' +
        'precision mediump float;\n' +
        '#endif\n' +
        'uniform vec3 u_Diffuse;' +
        'uniform vec3 u_Ambient;' +
        'uniform vec3 u_LightPosition;' +
        'varying vec3 v_Normal;' +
        'varying vec3 v_Position;' +
        'varying vec4 v_Color;' +
        'void main(){' +
        'vec3 normal = normalize(v_Normal);' +
        //向量相减，方向由顶点指向光源,每个定点的light direction 都不一样，所以需要计算不同的nDotL
        'vec3 lightDirection = normalize(u_LightPosition - v_Position);' +
        'float nDotL = max(dot(lightDirection,normal),0.0);' +
        'vec3 diffuse = u_Diffuse * v_Color.rgb * nDotL;' +
        'vec3 ambient = u_Ambient * v_Color.rgb;' +
        'gl_FragColor = vec4(diffuse + ambient,v_Color.a);' +
        '}';

    let canvas:HTMLElement = document.getElementById("webgl");
    let director:Director = new Director();
    let gl:WebGLRenderingContext = director.getWebglContext(canvas);
    let program:WebGLProgram = director.initShader(vs,fs);
    if(!program)console.log("program error");
    let n:number = initVertexs();
    setColorAndDepth();
    


    function setColorAndDepth(){
        gl.clearColor(0,0,0,1);
        gl.enable(gl.DEPTH_TEST);
    }
    function initVertexs(){
        let SPHERE_DIV = 36;

        let i:number, ai:number, si:number, ci:number;
        let j:number, aj:number, sj:number, cj:number;
        let p1:number, p2:number;

        let positions:number[] = [];
        let indices:number[] = [];

        // Generate coordinates
        for (j = 0; j <= SPHERE_DIV; j++) {
            aj = j * Math.PI / SPHERE_DIV;
            sj = Math.sin(aj);
            cj = Math.cos(aj);
            for (i = 0; i <= SPHERE_DIV; i++) {
                ai = i * 2 * Math.PI / SPHERE_DIV;
                si = Math.sin(ai);
                ci = Math.cos(ai);

                positions.push(si * sj);  // X
                positions.push(cj);       // Y
                positions.push(ci * sj);  // Z
            }
        }

        // Generate indices
        for (j = 0; j < SPHERE_DIV; j++) {
            for (i = 0; i < SPHERE_DIV; i++) {
                p1 = j * (SPHERE_DIV+1) + i;
                p2 = p1 + (SPHERE_DIV+1);

                indices.push(p1);
                indices.push(p2);
                indices.push(p1 + 1);

                indices.push(p1 + 1);
                indices.push(p2);
                indices.push(p2 + 1);
            }
        }
        initArrayBuffer("a_Position",new Float32Array(positions),3);
        initArrayBuffer("a_Normal",new Float32Array(positions),3);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        let indexBuffer:WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Int16Array(indices),gl.STATIC_DRAW);
        return indices.length;
    }
    function initArrayBuffer(attribute:string,data:Float32Array,size:number){
        let a_attribute:number = gl.getAttribLocation(program,attribute);
        let buffer:WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);

        gl.vertexAttribPointer(a_attribute,size,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(a_attribute);
    }
}
