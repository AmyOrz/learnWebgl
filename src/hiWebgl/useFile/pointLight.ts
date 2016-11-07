let VSHADER:string =
    "attribute vec4 a_Position;" +
    "attribute vec4 a_Color;" +
    "attribute vec4 a_Normal;" +
    "uniform mat4 u_MvpMatrix;" +
    "uniform mat4 u_ModelMatrix;" +
    "uniform mat4 u_NormalMatrix;" +
    "varying vec4 v_Color;" +
    "varying vec3 v_Normal;" +
    "varying vec3 v_Position;" +
    "void main(){" +
    "gl_Position = u_MvpMatrix * a_Position;" +
    "v_Position = vec3(u_ModelMatrix * a_Position);" +
    "v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));" +
    "v_Color = a_Color;" +
    "}";
let FSHADER:string =
    "#ifdef GL_ES\n" +
    "precision mediump float;\n" +
    "#endif\n " +
    "uniform vec3 u_LightColor;" +
    "uniform vec3 u_LightPosition;" +
    "uniform vec3 u_AmbientLight;" +
    "varying vec4 v_Color;" +
    "varying vec3 v_Normal;" +
    "varying vec3 v_Position;" +
    "void main(){" +
    "vec3 lightDir = normalize(u_LightPosition - v_Position);" +
    "vec3 normal = normalize(v_Normal);" +
    "float nDot = max(dot(lightDir,normal),0.0);" +
    "vec3 diffuse = u_LightColor * v_Color.rgb * nDot;" +
    "vec3 ambient = u_AmbientLight * v_Color.rgb;" +
    "gl_FragColor = vec4(diffuse + ambient,v_Color.a);" +
    "}";
let canvas:HTMLElement = document.getElementById("webgl");
