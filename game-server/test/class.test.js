class A {
    constructor() {
        this.print();
    }
    print() {
        console.log('A');
    }
}
class B extends A {
    constructor() {
        super();
    }
    print() {
        console.log('B');
    }
}
const b = new B();
