namespace Amy {
    let VSHADER:string =
        'attribute vec4 a_Position;' +
        'attribute vec4 a_PointSize;' +
        'attribute vec4 a_Color;' +
        'varying vec4 v_Color;' +
        'void main(){ ' +
        'gl_Position = a_Position;' +
        'gl_PointSize = 30.0;' +
        'v_Color = a_Color;' +  //矩阵和矢量相乘
        '}';
    let FSHADER:string =
        'precision mediump float;' +
        'varying vec4 v_Color;' +
        'void main(){'+
        'gl_FragColor = v_Color;' +  //设置颜色
        '}';
    let game = new Director(document.getElementById("webgl"));

}
