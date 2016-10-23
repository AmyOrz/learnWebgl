namespace Amy{
    export class Game {
        private _contain:any;
        private _scene:any;
        private _renderer:any;

        private _camera:any;
        private _panel:any;
        private _sphere:any;
        private _stats:any;

        private _controls:any;
        private _orbitControl:any;
        public SphereArray:number[] = [0,Math.PI/2,Math.PI/3,Math.PI/3];
        public init():void{
            this._initComponent();
            this._initThreeParam();
            this._initScene();
            this._stats = this._initStats();
            this._contain.append(this._renderer.domElement);
            this._initGui();
            this.renderScene();
        }
        public renderScene():void{
            this._stats.update();
            this._sphere.rotation.y = this._controls.RotateY;
            this._renderer.render(this._scene,this._camera);
        }
        private _initGui():void{
            this._controls = {
                RotateY:0.1,
                width:Math.PI/2,
                top:Math.PI/3,
                bottom:Math.PI/3,
                texture:1
            };

            let gui = new dat.GUI();
            gui.add(this._controls,"RotateY",0,10);
            gui.add(this._controls,"width",0,Math.PI*2).onChange(()=>{
                this._scene.remove(this._sphere);
                this.SphereArray[1] = this._controls.width;
                this._renderSphere(20,80,60,this.SphereArray);
            });
            gui.add(this._controls,"top",0,Math.PI/2).onChange(()=>{
                this._scene.remove(this._sphere);
                this.SphereArray[2] = this._controls.top;
                this._renderSphere(20,80,60,this.SphereArray);
            });
            gui.add(this._controls,"bottom",0,Math.PI).onChange(()=>{
                this._scene.remove(this._sphere);
                this.SphereArray[3] = this._controls.bottom;
                this._renderSphere(20,80,60,this.SphereArray);
            });
        }
        private _initStats():any{
            let stats = new Stats();
            stats.showPanel(0);
            stats.dom.style.position = 'absolute';
            stats.dom.style.left = '0px';
            stats.dom.style.top = '0px';
            $("#stats").append(stats.dom);
            return stats;
        }
        private _initComponent():void{
            this._contain = $("#ct");
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            this._renderer = new THREE.WebGLRenderer();
            this._orbitControl = new THREE.OrbitControls(this._camera,this._renderer.domElement);
        }
        private _initThreeParam():void{
            this._renderer.setClearColor(new THREE.Color(0xcccccc));
            this._renderer.setSize(window.innerWidth,window.innerHeight);
            this._renderer.shadowMapEnabled = true;
            this._orbitControl.damping = 0.2;
        }
        private _initScene():void{
            this._renderCame(-30,40,30);
            this._renderAxes(20);
            // this._renderPanel(60,40,15,-10,0);
            this._renderLight(-40,40,-10);
            this._renderSphere(20,80,60,this.SphereArray);
        }
        private _renderLight(x:number,y:number,z:number){
            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(x,y,z);
            spotLight.castShadow = true;
            this._scene.add(spotLight);
        }
        private _renderCame(x:number,y:number,z:number):void{
            this._camera.position.x = x;
            this._camera.position.y = y;
            this._camera.position.z = z;
            this._camera.lookAt(this._scene.position);
        }
        private _renderAxes(size:number):void{
            this._scene.add(new THREE.AxisHelper(size));
        }
        private _renderPanel(width:number,height:number,x:number,y:number,z:number):void{
            this._panel = new THREE.Mesh(new THREE.PlaneGeometry(width,height,1,1),new THREE.MeshBasicMaterial({color:0x00ffff}));
            this._panel.rotation.x = -Math.PI/2;
            this._panel.position.x = x;
            this._panel.position.y = y;
            this._panel.position.z = z;
            this._panel.receiveShadow = true;
            this._scene.add(this._panel);
        }
        private _renderSphere(radius:number,longitude:number,latitude:number,slice:number[]):void{
            let isNull:any = {};
            let texture = THREE.ImageUtils.loadTexture('./12.jpg',isNull, function() {
            });
            slice = slice == void 0?[0,Math.PI*2,0,Math.PI]:slice;
            // this._sphere = new THREE.Mesh(
            //     new THREE.SphereGeometry(radius,longitude,latitude,slice[0],slice[1],slice[2],slice[3]),
            //     new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));

            this._sphere = THREE.SceneUtils.createMultiMaterialObject(
                new THREE.SphereGeometry(radius,longitude,latitude,slice[0],slice[1],slice[2],slice[3]),
                [new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}),new THREE.MeshBasicMaterial({wireframe:true})]
            );

            this._sphere.castShadow = true;
            this._scene.add(this._sphere);
        }
    }
    let game = new Game();
    game.init();
    let tick = ()=>{
        game.renderScene();
        requestAnimationFrame(tick);
    };
    tick();
}