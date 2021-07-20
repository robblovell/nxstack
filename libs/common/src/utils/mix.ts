export const mix = (superclass=class {}) => new MixinBuilder(superclass)

class MixinBuilder {
    constructor(private superclass) {
        this.superclass = superclass
    }

    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass)
    }
}
// TODO: Consider moving to https://github.com/likerRr/ts-mixin
// https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
// class MyClass extends mix(MyBaseClass).with(Mixin1, Mixin2) {
//     /* ... */
//   }