var Amy;
(function (Amy) {
    var Game = (function () {
        function Game() {
            this.SphereArray = [0, Math.PI / 2, Math.PI / 3, Math.PI / 3];
        }
        Game.prototype.init = function () {
            this._initComponent();
            this._initThreeParam();
            this._initScene();
            this._stats = this._initStats();
            this._contain.append(this._renderer.domElement);
            this._initGui();
            this.renderScene();
        };
        Game.prototype.renderScene = function () {
            this._stats.update();
            this._sphere.rotation.y = this._controls.RotateY;
            this._renderer.render(this._scene, this._camera);
        };
        Game.prototype._initGui = function () {
            var _this = this;
            this._controls = {
                RotateY: 0.1,
                width: Math.PI / 2,
                top: Math.PI / 3,
                bottom: Math.PI / 3,
                texture: 1
            };
            var gui = new dat.GUI();
            gui.add(this._controls, "RotateY", 0, 10);
            gui.add(this._controls, "width", 0, Math.PI * 2).onChange(function () {
                _this._scene.remove(_this._sphere);
                _this.SphereArray[1] = _this._controls.width;
                _this._renderSphere(20, 80, 60, _this.SphereArray);
            });
            gui.add(this._controls, "top", 0, Math.PI / 2).onChange(function () {
                _this._scene.remove(_this._sphere);
                _this.SphereArray[2] = _this._controls.top;
                _this._renderSphere(20, 80, 60, _this.SphereArray);
            });
            gui.add(this._controls, "bottom", 0, Math.PI).onChange(function () {
                _this._scene.remove(_this._sphere);
                _this.SphereArray[3] = _this._controls.bottom;
                _this._renderSphere(20, 80, 60, _this.SphereArray);
            });
        };
        Game.prototype._initStats = function () {
            var stats = new Stats();
            stats.showPanel(0);
            stats.dom.style.position = 'absolute';
            stats.dom.style.left = '0px';
            stats.dom.style.top = '0px';
            $("#stats").append(stats.dom);
            return stats;
        };
        Game.prototype._initComponent = function () {
            this._contain = $("#ct");
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            this._renderer = new THREE.WebGLRenderer();
            this._orbitControl = new THREE.OrbitControls(this._camera, this._renderer.domElement);
        };
        Game.prototype._initThreeParam = function () {
            this._renderer.setClearColor(new THREE.Color(0xcccccc));
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            this._renderer.shadowMapEnabled = true;
            this._orbitControl.damping = 0.2;
        };
        Game.prototype._initScene = function () {
            this._renderCame(-30, 40, 30);
            this._renderAxes(20);
            this._renderLight(-40, 40, -10);
            this._renderSphere(20, 80, 60, this.SphereArray);
        };
        Game.prototype._renderLight = function (x, y, z) {
            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(x, y, z);
            spotLight.castShadow = true;
            this._scene.add(spotLight);
        };
        Game.prototype._renderCame = function (x, y, z) {
            this._camera.position.x = x;
            this._camera.position.y = y;
            this._camera.position.z = z;
            this._camera.lookAt(this._scene.position);
        };
        Game.prototype._renderAxes = function (size) {
            this._scene.add(new THREE.AxisHelper(size));
        };
        Game.prototype._renderPanel = function (width, height, x, y, z) {
            this._panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
            this._panel.rotation.x = -Math.PI / 2;
            this._panel.position.x = x;
            this._panel.position.y = y;
            this._panel.position.z = z;
            this._panel.receiveShadow = true;
            this._scene.add(this._panel);
        };
        Game.prototype._renderSphere = function (radius, longitude, latitude, slice) {
            var isNull = {};
            var texture = THREE.ImageUtils.loadTexture('./12.jpg', isNull, function () {
            });
            slice = slice == void 0 ? [0, Math.PI * 2, 0, Math.PI] : slice;
            this._sphere = THREE.SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(radius, longitude, latitude, slice[0], slice[1], slice[2], slice[3]), [new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }), new THREE.MeshBasicMaterial({ wireframe: true })]);
            this._sphere.castShadow = true;
            this._scene.add(this._sphere);
        };
        return Game;
    }());
    Amy.Game = Game;
    var game = new Game();
    game.init();
    var tick = function () {
        game.renderScene();
        requestAnimationFrame(tick);
    };
    tick();
})(Amy || (Amy = {}));
var TreeNode = (function () {
    function TreeNode(data, left, right) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
    return TreeNode;
}());
var Tree = (function () {
    function Tree() {
    }
    Tree.prototype.show = function () {
        console.log(this.root);
    };
    Tree.prototype.insert = function (data) {
        var n = new TreeNode(data, null, null);
        if (this.root == null) {
            this.root = n;
        }
        else {
            var current = this.root;
            var parent_1;
            while (current) {
                parent_1 = current;
                if (data < current.data) {
                    current = current.left;
                    if (current == void 0) {
                        parent_1.left = n;
                        break;
                    }
                }
                else {
                    current = current.right;
                    if (current == void 0) {
                        parent_1.right = n;
                        break;
                    }
                }
            }
        }
    };
    Tree.prototype.preOrder = function (root) {
        if (root != void 0) {
            console.log(root.data);
            arguments.callee(root.left);
            arguments.callee(root.right);
        }
    };
    Tree.prototype.inOrder = function (root) {
        if (root != void 0) {
            arguments.callee(root.left);
            console.log(root.data);
            arguments.callee(root.right);
        }
    };
    Tree.prototype.lastOrder = function (root) {
        if (root != void 0) {
            arguments.callee(root.left);
            arguments.callee(root.right);
            console.log(root.data);
        }
    };
    Tree.prototype.DepthFirstSearch = function () {
    };
    return Tree;
}());
var tree = new Tree();
tree.insert(25);
tree.insert(45);
tree.insert(16);
tree.insert(17);
tree.insert(3);
tree.insert(12);
tree.insert(22);
tree.insert(18);
tree.insert(23);
tree.lastOrder(tree.root);
//# sourceMappingURL=fck.js.map