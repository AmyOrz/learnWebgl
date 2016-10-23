/// <reference path="./wd.d.ts" />
/// <reference path="./Game.ts" />
namespace Amy {
    let VSHADER:string =
        "attribute vec4 a_Position;" +
        "attribute vec4 a_Normal;" +
        "uniform mat4 u_MvpMatrix;" +
        "uniform mat4 u_ModelMatrix;" +
        "uniform mat4 u_NormalMatrix;" +
        "varying vec4 v_Color;" +
        "varying vec3 v_Normal;" +
        "varying vec3 v_Position;" +
        "void main(){" +
        "vec4 color = vec4(1.0,0.0,0.0,1.0);" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        //顶点的模型矩阵后的位置
        "v_Position = vec3(u_ModelMatrix * a_Position);" +
        "v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));" +
        "v_Color = color;" +
        "}";
    let FSHADER:string =
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "uniform vec3 u_LightColor;" +
        "uniform vec3 u_LightPosition;" +
        "uniform vec3 u_AmbientLight;" +
        "varying vec3 v_Normal;" +
        "varying vec4 v_Color;" +
        "varying vec3 v_Position;" +
        "void main(){" +
        "vec3 normal = normalize(v_Normal);" +
        //点光源线性渐变（光位置-顶点位置）
        "vec3 lightDirec = normalize(u_LightPosition - v_Position);" +
        "float nDotl = max(dot(lightDirec,normal),0.0);" +
        //漫反射
        "vec3 diffuse = u_LightColor * v_Color.rgb * nDotl;" +
        "vec3 ambient = u_AmbientLight * v_Color.rgb;" +
        "gl_FragColor = vec4(diffuse + ambient,v_Color.a);" +
        "}";
    let game = new Game(document.getElementById("webgl"));
    game.start(VSHADER, FSHADER);

}
