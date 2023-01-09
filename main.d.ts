declare module "@bcga/mutex-utility" {
    function mutex(timeout?: number): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

    function mutexer(): mutex;

    export {mutex, mutexer}
}