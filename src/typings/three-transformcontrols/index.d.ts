// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/7de6c3dd94feaeb21f20054b9f30d5dabc5efabd/threejs/three-transformcontrols.d.ts
declare namespace THREE {
	class TransformControls extends Object3D {
		constructor(object:Camera, domElement?:HTMLElement);

		object: Object3D;

		update():void;
		detach(): void;
		attach(object: Object3D): void;
		getMode(): string;
		setMode(mode: string): void;
		setSnap(snap: any): void;
		setSize(size:number):void;
		setSpace(space:string):void;

	}
}
