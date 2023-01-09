declare module "typescript-mutex-decorator" {
    function mutex(timeout?: number): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

    function mutexer(): mutex;

    export {mutex, mutexer}
}