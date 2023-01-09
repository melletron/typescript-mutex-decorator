// Self invoking function that creates a closure with the mutex lock, which means one lock for anyone using
// the decorator, i.e. we should be using this only on one kind of function

function mutexer() {
    // immediately invoked function expressions allows us to hide a state variable inside a function scope
    let locked = false;
    // This is the actual decorator function (which we can add modifiers, if we want to give a lock signature for example
    return function mutex(timeout = 100): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
        return function (
            target: any,
            propertyKey: string,
            descriptor: PropertyDescriptor
        ): PropertyDescriptor {
            // We want to keep the original method, so that we can call that when the slot is open
            const originalMethod = descriptor.value;

            // This is a proxy method doing the lock checking before executing the method
            descriptor.value = async function (...args: []) {
                return new Promise<any>(async (resolve, reject) => {
                    const sendReceive = async () => {
                        // if the mutex is locked, we use the VM's own callback queue to queue the request
                        if (locked) {
                            // We try to execute the method again in 100ms
                            setTimeout(sendReceive, timeout);
                        } else {
                            // If the mutex is not locked, lock it now
                            locked = true;
                            try { // the decorated method can throw an error, we don't want it to keep our mutex locked
                                // Let's make sure the transaction is complete before we unlock the mutex again
                                const result = await originalMethod.apply(this, args);
                                // Transaction is complete, so we can free up the connection again
                                locked = false;
                                // Now lets give the result back to the caller.
                                resolve(result);
                            } catch (e) {
                                // Unlock the mutex and bubble up the error
                                locked = false;
                                reject(e);
                            }
                        }
                    };
                    await sendReceive();
                });
            };
            return descriptor;
        };
    }
}

const mutex = mutexer();

export {mutex, mutexer}