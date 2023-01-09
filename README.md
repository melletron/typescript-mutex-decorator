# TypeScript Mutex Decorator
Makes sure a method is called only once at a time and queues all subsequent requests, good for talking to robots

## Quickstart
### Install
```npm i @melletron/typescript-mutex-decorator```

#### Usage

Simple usage if you want to have one system-wide queue
```TypeScript
class Example {
    @mutex() // Decorate method using the default retry timeout (100ms)
    public decorated(answer: number): Promise<void> {
        // do some stuff
        return new Promise((resolve) => {
            // Return a promise
            // You can also make it an async method 
        });
    }
}
```

Simple usage if you want to override the timeout with a custom timeout
```TypeScript
class Example {
    @mutex(0) // Retry the method call within 0ms after first try
    public decorated(answer: number): Promise<void> {
        // do some stuff
        return new Promise((resolve) => {
            // Return a promise
            // You can also make it an async method 
        });
    }
}
```

Spawn a new mutex on the fly so that you can have your own queue only for that method
```TypeScript
class Example {
    @mutexer()() // Create an own instance of the mutex decorator and decorate method using the default retry timeout (100ms) 
    public decorated(answer: number): Promise<void> {
        // do some stuff
        return new Promise((resolve) => {
            // Return a promise
            // You can also make it an async method 
        });
    }
}
```

You can also set a custom timeout on the decorator you just spawned
Spawn a new mutex on the fly so that you can have your own queue only for that method
```TypeScript
class Example {
    @mutexer()(0) // Create an own instance of the mutex decorator and retry the method call within 0ms after first try 
    public decorated(answer: number): Promise<void> {
        // do some stuff
        return new Promise((resolve) => {
            // Return a promise
            // You can also make it an async method 
        });
    }
}
```

#### Testing the source code

```
% npm run coverage

> @melletron/typescript-mutex-decorator@0.0.1 coverage
> nyc -r text -e .ts -x "src/tests/*.test.ts" npm run test


> @melletron/typescript-mutex-decorator@0.0.1 test
> mocha -r ts-node/register src/tests/**/*.test.ts



  mutex
    ✔ only allows a single execution of the method at a time
    ✔ unlocks if a mutexed method throws an error (102ms)


  2 passing (106ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 mutex.ts |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------

```