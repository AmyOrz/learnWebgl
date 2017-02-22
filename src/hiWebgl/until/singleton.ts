namespace Amy{
    export function enumerable(value:boolean = false){
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            descriptor.enumerable = value;
        };
    }
}
