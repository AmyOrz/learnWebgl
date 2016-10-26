var Amy;
(function (Amy) {
    var Director = (function () {
        function Director(_canvas) {
            this._canvas = _canvas;
        }
        Director.prototype.initWebgl = function () {
            this._getWebgl();
            this._gl.viewportWidth = this._canvas.width;
            this._gl.viewportHeight = this._canvas.height;
            return this._gl;
        };
        Director.prototype.initShader = function (vs, fs) {
            var program = this._gl.createProgram();
            var vshader = this._loadShader(this._gl.VERTEX_SHADER, vs);
            var fshader = this._loadShader(this._gl.FRAGMENT_SHADER, fs);
            if (!vshader || !fshader) {
                return;
            }
            this._gl.attachShader(program, vshader);
            this._gl.attachShader(program, fshader);
            this._gl.linkProgram(program);
            var linked = this._gl.getProgramParameter(program, this._gl.LINK_STATUS);
            if (!linked) {
                var err = this._gl.getProgramInfoLog(program);
                console.log("faild to link _program:" + err);
                this._gl.deleteProgram(program);
                this._gl.deleteShader(vshader);
                this._gl.deleteShader(vshader);
                return;
            }
            this._gl.program = program;
            return true;
        };
        Director.prototype._enable = function (type) {
            this._gl.enable(type);
        };
        Director.prototype._setColor = function (R, G, B, A) {
            this._gl.clearColor(R, G, B, A);
        };
        Director.prototype._getWebgl = function () {
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var item = names_1[_i];
                try {
                    this._gl = this._canvas.getContext(item);
                }
                catch (e) {
                }
                if (this._gl) {
                    break;
                }
            }
        };
        Director.prototype._loadShader = function (type, value) {
            var shader = this._gl.createShader(type);
            if (shader == null) {
                console.log("unable to create shader");
                return;
            }
            this._gl.shaderSource(shader, value);
            this._gl.compileShader(shader);
            var compiled = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS);
            if (!compiled) {
                var error = this._gl.getShaderInfoLog(shader);
                console.log("faild to compile shader:" + error);
                this._gl.deleteShader(shader);
                return;
            }
            return shader;
        };
        return Director;
    }());
    Amy.Director = Director;
})(Amy || (Amy = {}));
var Amy;
(function (Amy) {
    var VSHADER_SOURCE = 'attribute vec4 a_Position;\n' +
        'uniform mat4 u_ModelMatrix;\n' +
        'void main() {\n' +
        '  gl_Position = u_ModelMatrix * a_Position;\n' +
        '}\n';
    var FSHADER_SOURCE = 'void main() {\n' +
        '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
        '}\n';
    var director = new Amy.Director(document.getElementById("webgl"));
    var gl = director.initWebgl();
    if (!director.initShader(VSHADER_SOURCE, FSHADER_SOURCE))
        alert("the shader err");
    var n = initVertexBuffer();
    var modelMatrix = new Amy.Matrix4;
    var Angle = 60.0;
    var tx = 0.5;
    modelMatrix.setRotate(Angle, 0, 0, 1);
    modelMatrix.translate(tx, 0, 0);
    var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    gl.uniform4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    function initVertexBuffer() {
        var vertices = new Float32Array([
            0, 0.3, -0.3, -0.3, 0.3, -0.3
        ]);
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        var a_Position = gl.getAttribLocation(gl.program, "a_Position");
        if (a_Position < 0) {
            console.log("aPosition error");
            return -1;
        }
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        return 3;
    }
})(Amy || (Amy = {}));
//# sourceMappingURL=hiWebGl.js.map