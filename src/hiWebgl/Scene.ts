namespace Amy {
    export class Scene {
        private objects:any = [];

        public addChild(gameObject:any):void {
            this.objects.push(gameObject);
        }

        public removeChild(gameObject:any):void {
            let index = this.objects.indexOf(gameObject);
            if (index > 0) {
                this.objects.splice(index, 1);
            }
        }

        public getAll():any {
            return [].slice.call(this.objects, 0);
        }

        public empty():void {
            this.objects = [];

        }
    }
}