/**
 * 光线阴影，从光源开始，沿着Z轴负方向看去，Z越大表示越前，其会产生阴影，Z越小，表示在里面，无阴影
 */
var SHADOW_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program for generating a shadow map
var SHADOW_FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'void main() {\n' +
    //FragCoord  片元坐标 .z表示深度值(0为近裁剪面，1为远裁剪面)
    //这个着色器视点位于光源时每个片元Z值存储在阴影贴图中，传给shadowMap
    '  gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);\n' + // 把每个片元的Z值写入帧缓冲区纹理贴图
    '}\n';

//顶点着色器，根据光照绘制阴影
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_MvpMatrixFromLight;\n' +
    'varying vec4 v_PositionFromLight;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment shader program for regular drawing
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_ShadowMap;\n' +  //阴影纹理
    'varying vec4 v_PositionFromLight;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    //阴影坐标(片元在光源坐标下的Z值)
    '  vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;\n' +
    '  vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n' +  //根据xy坐标获取深度Z值
    '  float depth = rgbaDepth.r;\n' + // Retrieve the z-value from R
    //阴影贴图与depth比较(shadowCoord.z沿着Z负轴方向，所有Z比depth大的在前面，表示会产生阴影)
    '  float visibility = (shadowCoord.z > depth + 0.005) ? 0.5 : 1.0;\n' +
    '  gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);\n' +
    '}\n';

var OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
var LIGHT_X = 0, LIGHT_Y = 7, LIGHT_Z = 2; // Position of the light source

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders for generating a shadow map
    var shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
    shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
    shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');
    if (shadowProgram.a_Position < 0 || !shadowProgram.u_MvpMatrix) {
        console.log('Failed to get the storage location of attribute or uniform variable from shadowProgram');
        return;
    }

    // Initialize shaders for regular drawing
    var normalProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    normalProgram.a_Position = gl.getAttribLocation(normalProgram, 'a_Position');
    normalProgram.a_Color = gl.getAttribLocation(normalProgram, 'a_Color');
    normalProgram.u_MvpMatrix = gl.getUniformLocation(normalProgram, 'u_MvpMatrix');
    normalProgram.u_MvpMatrixFromLight = gl.getUniformLocation(normalProgram, 'u_MvpMatrixFromLight');
    normalProgram.u_ShadowMap = gl.getUniformLocation(normalProgram, 'u_ShadowMap');
    if (normalProgram.a_Position < 0 || normalProgram.a_Color < 0 || !normalProgram.u_MvpMatrix || !normalProgram.u_MvpMatrixFromLight || !normalProgram.u_ShadowMap) {
        console.log('Failed to get the storage location of attribute or uniform variable from normalProgram');
        return;
    }

    // Set the vertex information
    var triangle = initVertexBuffersForTriangle(gl);
    var plane = initVertexBuffersForPlane(gl);
    if (!triangle || !plane) {
        console.log('Failed to set the vertex information');
        return;
    }


}
function initVertexBuffersForTriangle(gl){
    var vertices = new Float32Array([
       -0.8,3.5,0.0,0.8,3.5,0.0,0.0,3.5,1.8
    ]);
}