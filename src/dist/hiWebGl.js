var Amy;
(function (Amy) {
    var Vector3 = (function () {
        function Vector3(opt_src) {
            var v = new Float32Array(3);
            if (opt_src && typeof opt_src === 'object') {
                v[0] = opt_src[0];
                v[1] = opt_src[1];
                v[2] = opt_src[2];
            }
            this.elements = v;
        }
        Vector3.prototype.normalize = function () {
            var v = this.elements;
            var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
            if (g) {
                if (g == 1)
                    return this;
            }
            else {
                v[0] = 0;
                v[1] = 0;
                v[2] = 0;
                return this;
            }
            g = 1 / g;
            v[0] = c * g;
            v[1] = d * g;
            v[2] = e * g;
            return this;
        };
        return Vector3;
    }());
    Amy.Vector3 = Vector3;
})(Amy || (Amy = {}));
var Amy;
(function (Amy) {
    var Vector4 = (function () {
        function Vector4(opt_src) {
            var v = new Float32Array(4);
            if (opt_src && typeof opt_src === 'object') {
                v[0] = opt_src[0];
                v[1] = opt_src[1];
                v[2] = opt_src[2];
                v[3] = opt_src[3];
            }
            this.elements = v;
        }
        return Vector4;
    }());
    Amy.Vector4 = Vector4;
})(Amy || (Amy = {}));
var Amy;
(function (Amy) {
    var Matrix4 = (function () {
        function Matrix4(opt_src) {
            var i, s, d;
            if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
                s = opt_src.elements;
                d = new Float32Array(16);
                for (i = 0; i < 16; ++i) {
                    d[i] = s[i];
                }
                this.elements = d;
            }
            else {
                this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            }
        }
        ;
        Matrix4.prototype.setIdentity = function () {
            var e = this.elements;
            e[0] = 1;
            e[4] = 0;
            e[8] = 0;
            e[12] = 0;
            e[1] = 0;
            e[5] = 1;
            e[9] = 0;
            e[13] = 0;
            e[2] = 0;
            e[6] = 0;
            e[10] = 1;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
            return this;
        };
        Matrix4.prototype.set = function (src) {
            var i, s, d;
            s = src.elements;
            d = this.elements;
            if (s === d) {
                return;
            }
            for (i = 0; i < 16; ++i) {
                d[i] = s[i];
            }
            return this;
        };
        Matrix4.prototype.concat = function (other) {
            var i, e, a, b, ai0, ai1, ai2, ai3;
            e = this.elements;
            a = this.elements;
            b = other.elements;
            if (e === b) {
                b = new Float32Array(16);
                for (i = 0; i < 16; ++i) {
                    b[i] = e[i];
                }
            }
            for (i = 0; i < 4; i++) {
                ai0 = a[i];
                ai1 = a[i + 4];
                ai2 = a[i + 8];
                ai3 = a[i + 12];
                e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
                e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
                e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
                e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
            }
            return this;
        };
        Matrix4.prototype.multiply = function (other) {
            var i, e, a, b, ai0, ai1, ai2, ai3;
            e = this.elements;
            a = this.elements;
            b = other.elements;
            if (e === b) {
                b = new Float32Array(16);
                for (i = 0; i < 16; ++i) {
                    b[i] = e[i];
                }
            }
            for (i = 0; i < 4; i++) {
                ai0 = a[i];
                ai1 = a[i + 4];
                ai2 = a[i + 8];
                ai3 = a[i + 12];
                e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
                e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
                e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
                e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
            }
            return this;
        };
        Matrix4.prototype.multiplyVector3 = function (pos) {
            var e = this.elements;
            var p = pos.elements;
            var v = new Amy.Vector3();
            var result = v.elements;
            result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[11];
            result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[12];
            result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13];
            return v;
        };
        Matrix4.prototype.multiplyVector4 = function (pos) {
            var e = this.elements;
            var p = pos.elements;
            var v = new Amy.Vector4();
            var result = v.elements;
            result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
            result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
            result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
            result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
            return v;
        };
        Matrix4.prototype.transpose = function () {
            var e, t;
            e = this.elements;
            t = e[1];
            e[1] = e[4];
            e[4] = t;
            t = e[2];
            e[2] = e[8];
            e[8] = t;
            t = e[3];
            e[3] = e[12];
            e[12] = t;
            t = e[6];
            e[6] = e[9];
            e[9] = t;
            t = e[7];
            e[7] = e[13];
            e[13] = t;
            t = e[11];
            e[11] = e[14];
            e[14] = t;
            return this;
        };
        Matrix4.prototype.setInverseOf = function (other) {
            var i, s, d, inv, det;
            s = other.elements;
            d = this.elements;
            inv = new Float32Array(16);
            inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
                + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
            inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
                - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
            inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
                + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
            inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
                - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
            inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
                - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
            inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
                + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
            inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
                - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
            inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
                + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
            inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
                + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
            inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
                - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
            inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
                + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
            inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
                - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
            inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
                - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
            inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
                + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
            inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
                - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
            inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
                + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
            det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
            if (det === 0) {
                return this;
            }
            det = 1 / det;
            for (i = 0; i < 16; i++) {
                d[i] = inv[i] * det;
            }
            return this;
        };
        Matrix4.prototype.invert = function () {
            return this.setInverseOf(this);
        };
        Matrix4.prototype.setOrtho = function (left, right, bottom, top, near, far) {
            var e, rw, rh, rd;
            if (left === right || bottom === top || near === far) {
                throw 'null frustum';
            }
            rw = 1 / (right - left);
            rh = 1 / (top - bottom);
            rd = 1 / (far - near);
            e = this.elements;
            e[0] = 2 * rw;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;
            e[4] = 0;
            e[5] = 2 * rh;
            e[6] = 0;
            e[7] = 0;
            e[8] = 0;
            e[9] = 0;
            e[10] = -2 * rd;
            e[11] = 0;
            e[12] = -(right + left) * rw;
            e[13] = -(top + bottom) * rh;
            e[14] = -(far + near) * rd;
            e[15] = 1;
            return this;
        };
        Matrix4.prototype.ortho = function (left, right, bottom, top, near, far) {
            return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
        };
        Matrix4.prototype.setFrustum = function (left, right, bottom, top, near, far) {
            var e, rw, rh, rd;
            if (left === right || top === bottom || near === far) {
                throw 'null frustum';
            }
            if (near <= 0) {
                throw 'near <= 0';
            }
            if (far <= 0) {
                throw 'far <= 0';
            }
            rw = 1 / (right - left);
            rh = 1 / (top - bottom);
            rd = 1 / (far - near);
            e = this.elements;
            e[0] = 2 * near * rw;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;
            e[4] = 0;
            e[5] = 2 * near * rh;
            e[6] = 0;
            e[7] = 0;
            e[8] = (right + left) * rw;
            e[9] = (top + bottom) * rh;
            e[10] = -(far + near) * rd;
            e[11] = -1;
            e[12] = 0;
            e[13] = 0;
            e[14] = -2 * near * far * rd;
            e[15] = 0;
            return this;
        };
        Matrix4.prototype.frustum = function (left, right, bottom, top, near, far) {
            return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far));
        };
        Matrix4.prototype.setPerspective = function (fovy, aspect, near, far) {
            var e, rd, s, ct;
            if (near === far || aspect === 0) {
                throw 'null frustum';
            }
            if (near <= 0) {
                throw 'near <= 0';
            }
            if (far <= 0) {
                throw 'far <= 0';
            }
            fovy = Math.PI * fovy / 180 / 2;
            s = Math.sin(fovy);
            if (s === 0) {
                throw 'null frustum';
            }
            rd = 1 / (far - near);
            ct = Math.cos(fovy) / s;
            e = this.elements;
            e[0] = ct / aspect;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;
            e[4] = 0;
            e[5] = ct;
            e[6] = 0;
            e[7] = 0;
            e[8] = 0;
            e[9] = 0;
            e[10] = -(far + near) * rd;
            e[11] = -1;
            e[12] = 0;
            e[13] = 0;
            e[14] = -2 * near * far * rd;
            e[15] = 0;
            return this;
        };
        Matrix4.prototype.perspective = function (fovy, aspect, near, far) {
            return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
        };
        Matrix4.prototype.setScale = function (x, y, z) {
            var e = this.elements;
            e[0] = x;
            e[4] = 0;
            e[8] = 0;
            e[12] = 0;
            e[1] = 0;
            e[5] = y;
            e[9] = 0;
            e[13] = 0;
            e[2] = 0;
            e[6] = 0;
            e[10] = z;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
            return this;
        };
        Matrix4.prototype.scale = function (x, y, z) {
            var e = this.elements;
            e[0] *= x;
            e[4] *= y;
            e[8] *= z;
            e[1] *= x;
            e[5] *= y;
            e[9] *= z;
            e[2] *= x;
            e[6] *= y;
            e[10] *= z;
            e[3] *= x;
            e[7] *= y;
            e[11] *= z;
            return this;
        };
        Matrix4.prototype.setTranslate = function (x, y, z) {
            var e = this.elements;
            e[0] = 1;
            e[4] = 0;
            e[8] = 0;
            e[12] = x;
            e[1] = 0;
            e[5] = 1;
            e[9] = 0;
            e[13] = y;
            e[2] = 0;
            e[6] = 0;
            e[10] = 1;
            e[14] = z;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
            return this;
        };
        Matrix4.prototype.translate = function (x, y, z) {
            var e = this.elements;
            e[12] += e[0] * x + e[4] * y + e[8] * z;
            e[13] += e[1] * x + e[5] * y + e[9] * z;
            e[14] += e[2] * x + e[6] * y + e[10] * z;
            e[15] += e[3] * x + e[7] * y + e[11] * z;
            return this;
        };
        Matrix4.prototype.setRotate = function (angle, x, y, z) {
            var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;
            angle = Math.PI * angle / 180;
            e = this.elements;
            s = Math.sin(angle);
            c = Math.cos(angle);
            if (0 !== x && 0 === y && 0 === z) {
                if (x < 0) {
                    s = -s;
                }
                e[0] = 1;
                e[4] = 0;
                e[8] = 0;
                e[12] = 0;
                e[1] = 0;
                e[5] = c;
                e[9] = -s;
                e[13] = 0;
                e[2] = 0;
                e[6] = s;
                e[10] = c;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else if (0 === x && 0 !== y && 0 === z) {
                if (y < 0) {
                    s = -s;
                }
                e[0] = c;
                e[4] = 0;
                e[8] = s;
                e[12] = 0;
                e[1] = 0;
                e[5] = 1;
                e[9] = 0;
                e[13] = 0;
                e[2] = -s;
                e[6] = 0;
                e[10] = c;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else if (0 === x && 0 === y && 0 !== z) {
                if (z < 0) {
                    s = -s;
                }
                e[0] = c;
                e[4] = -s;
                e[8] = 0;
                e[12] = 0;
                e[1] = s;
                e[5] = c;
                e[9] = 0;
                e[13] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 1;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else {
                len = Math.sqrt(x * x + y * y + z * z);
                if (len !== 1) {
                    rlen = 1 / len;
                    x *= rlen;
                    y *= rlen;
                    z *= rlen;
                }
                nc = 1 - c;
                xy = x * y;
                yz = y * z;
                zx = z * x;
                xs = x * s;
                ys = y * s;
                zs = z * s;
                e[0] = x * x * nc + c;
                e[1] = xy * nc + zs;
                e[2] = zx * nc - ys;
                e[3] = 0;
                e[4] = xy * nc - zs;
                e[5] = y * y * nc + c;
                e[6] = yz * nc + xs;
                e[7] = 0;
                e[8] = zx * nc + ys;
                e[9] = yz * nc - xs;
                e[10] = z * z * nc + c;
                e[11] = 0;
                e[12] = 0;
                e[13] = 0;
                e[14] = 0;
                e[15] = 1;
            }
            return this;
        };
        Matrix4.prototype.rotate = function (angle, x, y, z) {
            return this.concat(new Matrix4().setRotate(angle, x, y, z));
        };
        Matrix4.prototype.setLookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
            var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
            fx = centerX - eyeX;
            fy = centerY - eyeY;
            fz = centerZ - eyeZ;
            rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
            fx *= rlf;
            fy *= rlf;
            fz *= rlf;
            sx = fy * upZ - fz * upY;
            sy = fz * upX - fx * upZ;
            sz = fx * upY - fy * upX;
            rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
            sx *= rls;
            sy *= rls;
            sz *= rls;
            ux = sy * fz - sz * fy;
            uy = sz * fx - sx * fz;
            uz = sx * fy - sy * fx;
            e = this.elements;
            e[0] = sx;
            e[1] = ux;
            e[2] = -fx;
            e[3] = 0;
            e[4] = sy;
            e[5] = uy;
            e[6] = -fy;
            e[7] = 0;
            e[8] = sz;
            e[9] = uz;
            e[10] = -fz;
            e[11] = 0;
            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;
            return this.translate(-eyeX, -eyeY, -eyeZ);
        };
        Matrix4.prototype.lookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
            return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
        };
        Matrix4.prototype.dropShadow = function (plane, light) {
            var mat = new Matrix4();
            var e = mat.elements;
            var dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];
            e[0] = dot - light[0] * plane[0];
            e[1] = -light[1] * plane[0];
            e[2] = -light[2] * plane[0];
            e[3] = -light[3] * plane[0];
            e[4] = -light[0] * plane[1];
            e[5] = dot - light[1] * plane[1];
            e[6] = -light[2] * plane[1];
            e[7] = -light[3] * plane[1];
            e[8] = -light[0] * plane[2];
            e[9] = -light[1] * plane[2];
            e[10] = dot - light[2] * plane[2];
            e[11] = -light[3] * plane[2];
            e[12] = -light[0] * plane[3];
            e[13] = -light[1] * plane[3];
            e[14] = -light[2] * plane[3];
            e[15] = dot - light[3] * plane[3];
            return this.concat(mat);
        };
        Matrix4.prototype.dropShadowDirectionally = function (normX, normY, normZ, planeX, planeY, planeZ, lightX, lightY, lightZ) {
            var a = planeX * normX + planeY * normY + planeZ * normZ;
            return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
        };
        return Matrix4;
    }());
    Amy.Matrix4 = Matrix4;
})(Amy || (Amy = {}));
var Amy;
(function (Amy) {
    var Director = (function () {
        function Director() {
        }
        Director.prototype.getWebglContext = function (_canvas) {
            this._getWebgl(_canvas);
            this._gl.viewportWidth = _canvas.width;
            this._gl.viewportHeight = _canvas.height;
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
            return program;
        };
        Director.prototype.initArrayBuffer = function (param) {
            var buffer = this._gl.createBuffer();
            if (!buffer)
                console.log("buffer create error");
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, param.data, this._gl.STATIC_DRAW);
            buffer.pointNumber = param.size;
            buffer.pointType = param.type;
            return buffer;
        };
        Director.prototype.initElementArrayBuffer = function (param) {
            var buffer = this._gl.createBuffer();
            if (!buffer)
                console.log("buffer create error");
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, buffer);
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, param.data, this._gl.STATIC_DRAW);
            buffer.pointType = param.type;
            return buffer;
        };
        Director.prototype.initTextureBuffer = function (param) {
            var _this = this;
            var texBuffer = this._gl.createTexture();
            if (!texBuffer)
                console.log("texture buffer error");
            var img = new Image();
            img.onload = function () {
                _this._gl.pixelStorei(_this._gl.UNPACK_FLIP_Y_WEBGL, 1);
                _this._gl.activeTexture(_this._gl.Texture0);
                _this._gl.bindTexture(_this._gl.TEXTURE_2D, texBuffer);
                _this._gl.texParameteri(_this._gl.TEXTURE_2D, _this._gl.TEXTURE_MIN_FILTER, _this._gl.LINEAR);
                _this._gl.texImage2D(_this._gl.TEXTURE_2D, 0, _this._gl.RGBA, _this._gl.RGBA, _this._gl.UNSIGNED_BYTE, img);
                _this._gl.uniform1i(param.sampler, 0);
                _this._gl.bindTexture(_this._gl.TEXTURE_2D, null);
            };
            img.src = param.src;
            return texBuffer;
        };
        Director.prototype.initFrameBuffer = function (offsetWidth, offsetHeight) {
            var frameBuffer = this._gl.createFramebuffer();
            var texture = this._gl.createTexture();
            var depth = this._gl.createRenderbuffer();
            if (!frameBuffer || !texture || !depth) {
                console.log('Failed to create frame buffer object');
                return;
            }
            this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
            this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, offsetWidth, offsetHeight, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);
            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
            frameBuffer.texture = texture;
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, frameBuffer);
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, texture, 0);
            this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, depth);
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, offsetWidth, offsetHeight);
            this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, depth);
            var e = this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER);
            if (this._gl.FRAMEBUFFER_COMPLETE !== e) {
                console.log('Frame buffer object is incomplete: ' + e.toString());
                return;
            }
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
            return frameBuffer;
        };
        Director.prototype._setColor = function (R, G, B, A) {
            this._gl.clearColor(R, G, B, A);
        };
        Director.prototype._getWebgl = function (_canvas) {
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var item = names_1[_i];
                try {
                    this._gl = _canvas.getContext(item);
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
    var CubeData = (function () {
        function CubeData() {
        }
        CubeData.vertices = new Float32Array([
            1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
            1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
            1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
            1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
        ]);
        CubeData.texCoords = new Float32Array([
            1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
            1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
        ]);
        CubeData.indices = new Uint8Array([
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ]);
        CubeData.normals = new Float32Array([
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
        ]);
        CubeData.color = new Float32Array([
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
            0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1
        ]);
        return CubeData;
    }());
    Amy.CubeData = CubeData;
})(Amy || (Amy = {}));
var Amy;
(function (Amy) {
    var PlaneData = (function () {
        function PlaneData() {
        }
        PlaneData.vertices = new Float32Array([
            1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0
        ]);
        PlaneData.texCoords = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
        PlaneData.indices = new Uint8Array([0, 1, 2, 0, 2, 3]);
        return PlaneData;
    }());
    Amy.PlaneData = PlaneData;
})(Amy || (Amy = {}));
var Amy;
(function (Amy) {
    var VSHADER = "attribute vec4 a_Position;" +
        "attribute vec2 a_TexCoord;" +
        "uniform mat4 u_MvpMatrix;" +
        "varying vec2 v_TexCoord;" +
        "void main(){" +
        "gl_Position = u_MvpMatrix * a_Position;" +
        "v_TexCoord = a_TexCoord;" +
        "}";
    var FSHADER = "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "uniform sampler2D u_Sampler;" +
        "varying vec2 v_TexCoord;" +
        "void main(){" +
        "gl_FragColor = texture2D(u_Sampler,v_TexCoord);" +
        "}";
    var canvas = document.getElementById("webgl");
    var director = new Amy.Director();
    var gl = director.getWebglContext(canvas);
    var program = director.initShader(VSHADER, FSHADER);
    var last = Date.now();
    var g_ModelMatrix = new Amy.Matrix4();
    var g_MvpMatrix = new Amy.Matrix4();
    if (!program)
        alert("shader err");
    var a_Position = gl.getAttribLocation(program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
    var u_MvpMatrix = gl.getUniformLocation(program, "u_MvpMatrix");
    if (a_Position < 0 || a_TexCoord < 0 || !u_MvpMatrix)
        alert("attrib err");
    var cube = initObjectVertex(Amy.CubeData);
    var plane = initObjectVertex(Amy.PlaneData);
    var texture = initTexture();
    var fbo = initFrameBuffer();
    initWebglParam();
    var VpMatrix = new Amy.Matrix4();
    VpMatrix.setPerspective(45, canvas.offsetWidth / canvas.offsetHeight, 1, 100);
    VpMatrix.lookAt(0, 0, 7, 0, 0, 0, 0, 1, 0);
    var VpFboMatrix = new Amy.Matrix4();
    VpFboMatrix.setPerspective(45, 1, 1, 100);
    VpFboMatrix.lookAt(0, 2, 7, 0, 0, 0, 0, 1, 0);
    var currentAngle = 0.0;
    var tick = function () {
        currentAngle = animate(currentAngle);
        draw(currentAngle);
    };
    tick();
    function draw(angle) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, 1024, 1024);
        gl.clearColor(1, 1, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawTextureCube(angle, cube, texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawTexturePlane(angle, plane, fbo.texture);
    }
    function drawTexturePlane(angle, obj, texture) {
        g_ModelMatrix.setTranslate(0, 0, 1);
        g_ModelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
        g_ModelMatrix.rotate(angle, 0.0, 1.0, 0.0);
        g_MvpMatrix.set(VpMatrix);
        g_MvpMatrix.multiply(g_ModelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);
        drawTextureObject(obj, texture);
    }
    function drawTextureCube(angle, obj, texture) {
        g_ModelMatrix.setRotate(25.0, 1.0, 0.0, 0.0);
        g_ModelMatrix.rotate(angle, 0.0, 1.0, 0.0);
        g_MvpMatrix.set(VpFboMatrix);
        g_MvpMatrix.multiply(g_ModelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);
        drawTextureObject(obj, texture);
    }
    function drawTextureObject(obj, texture) {
        initAttributeVariable(a_Position, obj.vertexBuffer);
        initAttributeVariable(a_TexCoord, obj.texCoordBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
        gl.drawElements(gl.TRIANGLES, obj.numIndices, obj.indexBuffer.pointType, 0);
    }
    function initAttributeVariable(attribute, arrBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, arrBuffer);
        gl.vertexAttribPointer(attribute, arrBuffer.pointNumber, arrBuffer.pointType, false, 0, 0);
        gl.enableVertexAttribArray(attribute);
    }
    function animate(angle) {
        var now = Date.now();
        var temp = now - last;
        last = now;
        var newAngle = angle + (30 * temp) / 1000.0;
        return newAngle %= 360;
    }
    function initWebglParam() {
        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(program);
    }
    function initFrameBuffer() {
        var frameBuffer, texture, depthBuffer;
        var err = function () {
            if (frameBuffer)
                gl.deleteFramebuffer(frameBuffer);
            if (texture)
                gl.deleteTexture(texture);
            if (depthBuffer)
                gl.deleteRenderbuffer(depthBuffer);
            return null;
        };
        frameBuffer = gl.createFramebuffer();
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINES);
        frameBuffer.texture = texture;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1024, 1024);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
        var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (e !== gl.FRAMEBUFFER_COMPLETE) {
            alert("frame err");
            return err();
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        return frameBuffer;
    }
    function initTexture() {
        var texture = gl.createTexture();
        var u_Sampler = gl.getUniformLocation(program, "u_Sampler");
        if (!u_Sampler)
            alert("sampler err");
        var img = new Image();
        img.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINES);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.uniform1i(u_Sampler, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        img.src = "12.jpg";
        return texture;
    }
    function initObjectVertex(Object) {
        var obj = {
            vertexBuffer: initArrayBuffer(Object.vertices, 3, gl.FLOAT),
            texCoordBuffer: initArrayBuffer(Object.texCoords, 2, gl.FLOAT),
            indexBuffer: initElementArrayBuffer(Object.indices, gl.UNSIGNED_BYTE),
            numIndices: Object.indices.length
        };
        return obj;
    }
    function initArrayBuffer(arr, num, type) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
        buffer.pointNumber = num;
        buffer.pointType = type;
        return buffer;
    }
    function initElementArrayBuffer(arr, type) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arr, gl.STATIC_DRAW);
        buffer.pointType = type;
        return buffer;
    }
})(Amy || (Amy = {}));
//# sourceMappingURL=hiWebGl.js.map