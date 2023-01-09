import {expect} from "chai";
import {mutex, mutexer} from "../mutex";

describe('mutex', function () {

    it('only allows a single execution of the method at a time', function () {

        let a = 0;
        let count = 0;
        let count2 = 0;

        class Sub {
            @mutex(0)
            public decorated(answer: number): Promise<void> {
                count++;
                setTimeout(() => {
                    a = answer;
                }, 0);
                return new Promise((resolve) => {
                    const check = () => {
                        if (a === answer) {
                            resolve();
                        } else {
                            setTimeout(check, 0);
                        }
                    };
                    check();
                });
            }

            @mutexer()(0)
            public uniq(answer: number): Promise<void> {
                count2++;
                setTimeout(() => {
                    a = answer;
                }, 0);
                return new Promise((resolve) => {
                    const check = () => {
                        if (a === answer) {
                            resolve();
                        } else {
                            setTimeout(check, 0);
                        }
                    };
                    check();
                });
            }

            @mutex()
            public other() {
            }
        }

        const sub = new Sub();

        sub.decorated(1);
        sub.uniq(1);
        sub.decorated(2);
        sub.uniq(2);
        sub.decorated(3);
        sub.uniq(3);
        sub.decorated(4);
        sub.uniq(4);
        expect(count).to.equal(1);
        expect(count2).to.equal(1);
    });

    it('unlocks if a mutexed method throws an error', async () => {
        let count = 0;

        class Bla {

            @mutex()
            public async foo() {
                count++;
                return new Promise<any>(() => {
                    throw new Error('Meh...');
                });
            }

            @mutex()
            public async bar() {
                count++;
                return new Promise<any>((resolve, reject) => {
                    reject('error');
                });
            }

        }
        const meh = new Bla();
        try {
            await meh.bar();
        } catch (e) {

        }
        try {
            await meh.foo();
        } catch (e) {

        }
        expect(count).to.equal(2);
    });


});