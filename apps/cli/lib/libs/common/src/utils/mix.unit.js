"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mix_1 = require("./mix");
const BareMixin = (mixin) => wrap(mixin, (s) => apply(s, mixin));
const _appliedMixin = '__mixwith_appliedMixin';
const _wrappedMixin = '__mixwith_wrappedMixin';
const unwrap = (wrapper) => wrapper[_wrappedMixin] || wrapper;
const apply = (superclass, mixin) => {
    const application = mixin(superclass);
    application.prototype[_appliedMixin] = unwrap(mixin);
    return application;
};
const wrap = (mixin, wrapper) => {
    Object.setPrototypeOf(wrapper, mixin);
    if (!mixin[_wrappedMixin]) {
        mixin[_wrappedMixin] = mixin;
    }
    return wrapper;
};
const hasMixin = (o, mixin) => {
    while (o != null) {
        if (isApplicationOf(o, mixin))
            return true;
        o = Object.getPrototypeOf(o);
    }
    return false;
};
const isApplicationOf = (proto, mixin) => proto.hasOwnProperty(_appliedMixin) && proto[_appliedMixin] === unwrap(mixin);
describe('mix().with()', () => {
    test('applies mixins in order', () => {
        const M1 = BareMixin((s) => class extends s {
        });
        const M2 = BareMixin((s) => class extends s {
        });
        class S {
        }
        class C extends mix_1.mix(S).with(M1, M2) {
        }
        const i = new C();
        expect(hasMixin(i, M1)).toBe(true);
        expect(hasMixin(i, M2)).toBe(true);
        expect(isApplicationOf(i.__proto__.__proto__, M2)).toBe(true);
        expect(isApplicationOf(i.__proto__.__proto__.__proto__, M1)).toBe(true);
        expect(i.__proto__.__proto__.__proto__.__proto__).toEqual(S.prototype);
    });
    test('mix() can omit the superclass', () => {
        const M = BareMixin((s) => class extends s {
            static staticMixinMethod() {
                return 42;
            }
            foo() {
                return 'foo';
            }
        });
        class C extends mix_1.mix().with(M) {
            static staticClassMethod() {
                return 7;
            }
            bar() {
                return 'bar';
            }
        }
        const i = new C();
        expect(hasMixin(i, M)).toEqual(true);
        expect(isApplicationOf(i.__proto__.__proto__, M)).toEqual(true);
        expect('foo').toEqual(i.foo());
        expect('bar').toEqual(i.bar());
        expect(42).toEqual(C.staticMixinMethod());
        expect(7).toEqual(C.staticClassMethod());
    });
});
//# sourceMappingURL=mix.unit.js.map