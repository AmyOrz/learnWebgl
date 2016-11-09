var WebGLDebugUtils = function () {
    function log(msg) {
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
    }
    var glValidEnumContexts = {
        // Generic setters and getters
        'enable': { 0: true },
        'disable': { 0: true },
        'getParameter': { 0: true },
        // Rendering
        'drawArrays': { 0: true },
        'drawElements': { 0: true, 2: true },
        // Shaders
        'createShader': { 0: true },
        'getShaderParameter': { 1: true },
        'getProgramParameter': { 1: true },
        // Vertex attributes
        'getVertexAttrib': { 1: true },
        'vertexAttribPointer': { 2: true },
        // Textures
        'bindTexture': { 0: true },
        'activeTexture': { 0: true },
        'getTexParameter': { 0: true, 1: true },
        'texParameterf': { 0: true, 1: true },
        'texParameteri': { 0: true, 1: true, 2: true },
        'texImage2D': { 0: true, 2: true, 6: true, 7: true },
        'texSubImage2D': { 0: true, 6: true, 7: true },
        'copyTexImage2D': { 0: true, 2: true },
        'copyTexSubImage2D': { 0: true },
        'generateMipmap': { 0: true },
        // Buffer objects
        'bindBuffer': { 0: true },
        'bufferData': { 0: true, 2: true },
        'bufferSubData': { 0: true },
        'getBufferParameter': { 0: true, 1: true },
        // Renderbuffers and framebuffers
        'pixelStorei': { 0: true, 1: true },
        'readPixels': { 4: true, 5: true },
        'bindRenderbuffer': { 0: true },
        'bindFramebuffer': { 0: true },
        'checkFramebufferStatus': { 0: true },
        'framebufferRenderbuffer': { 0: true, 1: true, 2: true },
        'framebufferTexture2D': { 0: true, 1: true, 2: true },
        'getFramebufferAttachmentParameter': { 0: true, 1: true, 2: true },
        'getRenderbufferParameter': { 0: true, 1: true },
        'renderbufferStorage': { 0: true, 1: true },
        // Frame buffer operations (clear, blend, depth test, stencil)
        'clear': { 0: true },
        'depthFunc': { 0: true },
        'blendFunc': { 0: true, 1: true },
        'blendFuncSeparate': { 0: true, 1: true, 2: true, 3: true },
        'blendEquation': { 0: true },
        'blendEquationSeparate': { 0: true, 1: true },
        'stencilFunc': { 0: true },
        'stencilFuncSeparate': { 0: true, 1: true },
        'stencilMaskSeparate': { 0: true },
        'stencilOp': { 0: true, 1: true, 2: true },
        'stencilOpSeparate': { 0: true, 1: true, 2: true, 3: true },
        // Culling
        'cullFace': { 0: true },
        'frontFace': { 0: true }
    };
    var glEnums = null;
    function init(ctx) {
        if (glEnums == null) {
            glEnums = {};
            for (var propertyName in ctx) {
                if (typeof ctx[propertyName] == 'number') {
                    glEnums[ctx[propertyName]] = propertyName;
                }
            }
        }
    }
    function checkInit() {
        if (glEnums == null) {
            throw 'WebGLDebugUtils.init(ctx) not called';
        }
    }
    function mightBeEnum(value) {
        checkInit();
        return (glEnums[value] !== undefined);
    }
    function glEnumToString(value) {
        checkInit();
        var name = glEnums[value];
        return (name !== undefined) ? name :
            ("*UNKNOWN WebGL ENUM (0x" + value.toString(16) + ")");
    }
    function glFunctionArgToString(functionName, argumentIndex, value) {
        var funcInfo = glValidEnumContexts[functionName];
        if (funcInfo !== undefined) {
            if (funcInfo[argumentIndex]) {
                return glEnumToString(value);
            }
        }
        return value;
    }
    function makeDebugContext(ctx, opt_onErrorFunc) {
        init(ctx);
        opt_onErrorFunc = opt_onErrorFunc || function (err, functionName, args) {
            // apparently we can't do args.join(",");
            var argStr = "";
            for (var ii = 0; ii < args.length; ++ii) {
                argStr += ((ii == 0) ? '' : ', ') +
                    glFunctionArgToString(functionName, ii, args[ii]);
            }
            log("WebGL error " + glEnumToString(err) + " in " + functionName +
                "(" + argStr + ")");
        };
        // Holds booleans for each GL error so after we get the error ourselves
        // we can still return it to the client app.
        var glErrorShadow = {};
        // Makes a function that calls a WebGL function and then calls getError.
        function makeErrorWrapper(ctx, functionName) {
            return function () {
                var result = ctx[functionName].apply(ctx, arguments);
                var err = ctx.getError();
                if (err != 0) {
                    glErrorShadow[err] = true;
                    opt_onErrorFunc(err, functionName, arguments);
                }
                return result;
            };
        }
        // Make a an object that has a copy of every property of the WebGL context
        // but wraps all functions.
        var wrapper = {
            getError: null
        };
        for (var propertyName in ctx) {
            if (typeof ctx[propertyName] == 'function') {
                wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
            }
            else {
                wrapper[propertyName] = ctx[propertyName];
            }
        }
        // Override the getError function with one that returns our saved results.
        wrapper.getError = function () {
            for (var err in glErrorShadow) {
                if (glErrorShadow[err]) {
                    glErrorShadow[err] = false;
                    return err;
                }
            }
            return ctx.NO_ERROR;
        };
        return wrapper;
    }
    function resetToInitialState(ctx) {
        var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
        var tmp = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
        for (var ii = 0; ii < numAttribs; ++ii) {
            ctx.disableVertexAttribArray(ii);
            ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
            ctx.vertexAttrib1f(ii, 0);
        }
        ctx.deleteBuffer(tmp);
        var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
        for (var ii = 0; ii < numTextureUnits; ++ii) {
            ctx.activeTexture(ctx.TEXTURE0 + ii);
            ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
        }
        ctx.activeTexture(ctx.TEXTURE0);
        ctx.useProgram(null);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
        ctx.disable(ctx.BLEND);
        ctx.disable(ctx.CULL_FACE);
        ctx.disable(ctx.DEPTH_TEST);
        ctx.disable(ctx.DITHER);
        ctx.disable(ctx.SCISSOR_TEST);
        ctx.blendColor(0, 0, 0, 0);
        ctx.blendEquation(ctx.FUNC_ADD);
        ctx.blendFunc(ctx.ONE, ctx.ZERO);
        ctx.clearColor(0, 0, 0, 0);
        ctx.clearDepth(1);
        ctx.clearStencil(-1);
        ctx.colorMask(true, true, true, true);
        ctx.cullFace(ctx.BACK);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(true);
        ctx.depthRange(0, 1);
        ctx.frontFace(ctx.CCW);
        ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
        ctx.lineWidth(1);
        ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
        ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        // TODO: Delete this IF.
        if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
            ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
        }
        ctx.polygonOffset(0, 0);
        ctx.sampleCoverage(1, false);
        ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
        ctx.stencilMask(0xFFFFFFFF);
        ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
        ctx.viewport(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);
        // TODO: This should NOT be needed but Firefox fails with 'hint'
        while (ctx.getError())
            ;
    }
    var wrapper_ = {};
    function makeLostContextSimulatingContext(ctx) {
        var contextId_ = 1;
        var contextLost_ = false;
        var resourceId_ = 0;
        var resourceDb_ = [];
        var onLost_ = undefined;
        var onRestored_ = undefined;
        var nextOnRestored_ = undefined;
        // Holds booleans for each GL error so can simulate errors.
        var glErrorShadow_ = {};
        function isWebGLObject(obj) {
            //return false;
            return (obj instanceof WebGLBuffer ||
                obj instanceof WebGLFramebuffer ||
                obj instanceof WebGLProgram ||
                obj instanceof WebGLRenderbuffer ||
                obj instanceof WebGLShader ||
                obj instanceof WebGLTexture);
        }
        function checkResources(args) {
            for (var ii = 0; ii < args.length; ++ii) {
                var arg = args[ii];
                if (isWebGLObject(arg)) {
                    return arg.__webglDebugContextLostId__ == contextId_;
                }
            }
            return true;
        }
        function clearErrors() {
            var k = Object.keys(glErrorShadow_);
            for (var ii = 0; ii < k.length; ++ii) {
            }
        }
        // Makes a function that simulates WebGL when out of context.
        function makeLostContextWrapper(ctx, functionName) {
            var f = ctx[functionName];
            return function () {
                // Only call the functions if the context is not lost.
                if (!contextLost_) {
                    if (!checkResources(arguments)) {
                        glErrorShadow_[ctx.INVALID_OPERATION] = true;
                        return;
                    }
                    var result = f.apply(ctx, arguments);
                    return result;
                }
            };
        }
        for (var propertyName in ctx) {
            if (typeof ctx[propertyName] == 'function') {
                wrapper_[propertyName] = makeLostContextWrapper(ctx, propertyName);
            }
            else {
                wrapper_[propertyName] = ctx[propertyName];
            }
        }
        function makeWebGLContextEvent(statusMessage) {
            return { statusMessage: statusMessage };
        }
        function freeResources() {
            for (var ii = 0; ii < resourceDb_.length; ++ii) {
                var resource = resourceDb_[ii];
                if (resource instanceof WebGLBuffer) {
                    ctx.deleteBuffer(resource);
                } /*else if (asset instanceof WebctxFramebuffer) {
                  ctx.deleteFramebuffer(asset);
                } else if (asset instanceof WebctxProgram) {
                  ctx.deleteProgram(asset);
                } else if (asset instanceof WebctxRenderbuffer) {
                  ctx.deleteRenderbuffer(asset);
                } else if (asset instanceof WebctxShader) {
                  ctx.deleteShader(asset);
                } else if (asset instanceof WebctxTexture) {
                  ctx.deleteTexture(asset);
                }*/
            }
        }
        wrapper_.loseContext = function () {
            if (!contextLost_) {
                contextLost_ = true;
                ++contextId_;
                while (ctx.getError())
                    ;
                clearErrors();
                glErrorShadow_[ctx.CONTEXT_LOST_WEBGL] = true;
                setTimeout(function () {
                    if (onLost_) {
                        onLost_(makeWebGLContextEvent("context lost"));
                    }
                }, 0);
            }
        };
        wrapper_.restoreContext = function () {
            if (contextLost_) {
                if (onRestored_) {
                    setTimeout(function () {
                        freeResources();
                        resetToInitialState(ctx);
                        contextLost_ = false;
                        if (onRestored_) {
                            var callback = onRestored_;
                            onRestored_ = nextOnRestored_;
                            nextOnRestored_ = undefined;
                            callback(makeWebGLContextEvent("context restored"));
                        }
                    }, 0);
                }
                else {
                    throw "You can not restore the context without a listener";
                }
            }
        };
        // Wrap a few functions specially.
        wrapper_.getError = function () {
            if (!contextLost_) {
                var err;
                while (err = ctx.getError()) {
                    glErrorShadow_[err] = true;
                }
            }
            for (var err in glErrorShadow_) {
                if (glErrorShadow_[err]) {
                    delete glErrorShadow_[err];
                    return err;
                }
            }
            return ctx.NO_ERROR;
        };
        var creationFunctions = [
            "createBuffer",
            "createFramebuffer",
            "createProgram",
            "createRenderbuffer",
            "createShader",
            "createTexture"
        ];
        for (var ii = 0; ii < creationFunctions.length; ++ii) {
            var functionName = creationFunctions[ii];
            wrapper_[functionName] = function (f) {
                return function () {
                    if (contextLost_) {
                        return null;
                    }
                    var obj = f.apply(ctx, arguments);
                    obj.__webglDebugContextLostId__ = contextId_;
                    resourceDb_.push(obj);
                    return obj;
                };
            }(ctx[functionName]);
        }
        var functionsThatShouldReturnNull = [
            "getActiveAttrib",
            "getActiveUniform",
            "getBufferParameter",
            "getContextAttributes",
            "getAttachedShaders",
            "getFramebufferAttachmentParameter",
            "getParameter",
            "getProgramParameter",
            "getProgramInfoLog",
            "getRenderbufferParameter",
            "getShaderParameter",
            "getShaderInfoLog",
            "getShaderSource",
            "getTexParameter",
            "getUniform",
            "getUniformLocation",
            "getVertexAttrib"
        ];
        for (var ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
            var functionName = functionsThatShouldReturnNull[ii];
            wrapper_[functionName] = function (f) {
                return function () {
                    if (contextLost_) {
                        return null;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrapper_[functionName]);
        }
        var isFunctions = [
            "isBuffer",
            "isEnabled",
            "isFramebuffer",
            "isProgram",
            "isRenderbuffer",
            "isShader",
            "isTexture"
        ];
        for (var ii = 0; ii < isFunctions.length; ++ii) {
            var functionName = isFunctions[ii];
            wrapper_[functionName] = function (f) {
                return function () {
                    if (contextLost_) {
                        return false;
                    }
                    return f.apply(ctx, arguments);
                };
            }(wrapper_[functionName]);
        }
        wrapper_.checkFramebufferStatus = function (f) {
            return function () {
                if (contextLost_) {
                    return ctx.FRAMEBUFFER_UNSUPPORTED;
                }
                return f.apply(ctx, arguments);
            };
        }(wrapper_.checkFramebufferStatus);
        wrapper_.getAttribLocation = function (f) {
            return function () {
                if (contextLost_) {
                    return -1;
                }
                return f.apply(ctx, arguments);
            };
        }(wrapper_.getAttribLocation);
        wrapper_.getVertexAttribOffset = function (f) {
            return function () {
                if (contextLost_) {
                    return 0;
                }
                return f.apply(ctx, arguments);
            };
        }(wrapper_.getVertexAttribOffset);
        wrapper_.isContextLost = function () {
            return contextLost_;
        };
        function wrapEvent(listener) {
            if (typeof (listener) == "function") {
                return listener;
            }
            else {
                return function (info) {
                    listener.handleEvent(info);
                };
            }
        }
        wrapper_.registerOnContextLostListener = function (listener) {
            onLost_ = wrapEvent(listener);
        };
        wrapper_.registerOnContextRestoredListener = function (listener) {
            if (contextLost_) {
                nextOnRestored_ = wrapEvent(listener);
            }
            else {
                onRestored_ = wrapEvent(listener);
            }
        };
        return wrapper_;
    }
    return {
        'mightBeEnum': mightBeEnum,
        'glEnumToString': glEnumToString,
        'glFunctionArgToString': glFunctionArgToString,
        'makeDebugContext': makeDebugContext,
        'resetToInitialState': resetToInitialState
    };
}();
/**
 * 浏览器兼容
 */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function (window) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })(window);
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (function (window) {
        return window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
            window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
            window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
            window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
            window.clearTimeout;
    })(window);
}
var WebGLUtils = (function () {
    function WebGLUtils() {
        this.GET_A_WEBGL_BROWSER = 'This page requires a browser that supports WebGL.<br/>' +
            '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';
        this.OTHER_PROBLEM = "It doesn't appear your computer can support WebGL.<br/>" +
            '<a href="http://get.webgl.org">Click here for more information.</a>';
    }
    WebGLUtils.prototype.makeFailHTML = function (msg) {
        return '' +
            '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + msg + '</div>';
    };
    WebGLUtils.prototype.setupWebGL = function (canvas, opt_attribs, opt_onError) {
        var handleCreateonError = function (msg, window) {
            var container = document.getElementsByTagName("body")[0];
            if (container) {
/*                var str = window.WebGLRenderingContext == void 0?
                    this.OTHER_PROBLEM :
                    this.GET_A_WEBGL_BROWSER;*/
                    var str = this.OTHER_PROBLEM;
                if (msg) {
                    str += "<br/><br/>Status: " + msg;
                }
                container.innerHTML =
                '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + str + '</div>';
            }
        };
        opt_onError = opt_onError || handleCreateonError;
        if (canvas.addEventListener) {
            canvas.addEventListener("webglcontextcreationerror", function (event) {
                opt_onError(event.statusMessage);
            }, false);
        }
        var context = this.create3DContext(canvas, opt_attribs);
        if (!context) {
            opt_onError("");
        }
        else {
            opt_onError("");
        }
        return context;
    };
    //获取WebGLRenderingContext对象
    WebGLUtils.prototype.create3DContext = function (canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        var context = null;
        for (var i = 0; i < names.length; ++i) {
            try {
                context = canvas.getContext(names[i], opt_attribs);
            }
            catch (e) { }
            if (context) {
                break;
            }
        }
        return context;
    };
    return WebGLUtils;
})();
///<reference path = "webgl-utils.threejs"/>
///<reference path = "webgl-debug.threejs"/>
function initShaders(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);
    if (!program) {
        return false;
    }
    gl.userProgram(program);
    gl.program = program;
    return true;
}
function createProgram(gl, vshader, fshader) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, fshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        return null;
    }
    var program = gl.createProgram();
    if (!program) {
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log("Faild to link program:" + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}
function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (shader == null) {
        console.log("unable to create shader");
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log("Faild to compile shader:" + error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
function getWebGLContext(canvas, opt) {
    var web = new WebGLUtils();
    var gl = web.setupWebGL(canvas);
    if (!gl)
        return null;
    if (arguments.length < 2 || opt) {
        gl = WebGLDebugUtils.makeDebugContext(gl);
    }
    return gl;
}
