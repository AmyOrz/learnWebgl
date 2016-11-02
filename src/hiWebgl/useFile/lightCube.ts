namespace Amy{
    let VSHADER:string =
        "attribute vec4 a_Position;" +
        "attribute vec4 a_Color;" +
        "attribute vec4 a_Normal;" +
        "uniform mat4 u_MvpMatrix;" +
        "uniform mat4 u_NormalMatrix;" +
        "uniform mat4 u_LightDirection;" +
        "varying vec4 v_Color;" +
        "void main(){" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        "vec4 normal = u_NormalMatrix * a_Normal;" +
        "vec4 nDotl = max(dot(u_LightDirection,normalize(normal.xyz)));" +
        "v_Color = vec4(a_Color.xyz * nDotl,a_Color.a);" +
        "}";
    let FSHADER:string =
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "varying vec4 v_Color;" +
        "void main(){" +
        "gl_FragColor = v_Color;" +
        "}";
}