"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestUtils = void 0;
const tslib_1 = require("tslib");
class TestUtils {
    static render(tag, attributes = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            TestUtils._renderToDocument(tag, attributes);
            return yield TestUtils._waitForComponentToRender(tag);
        });
    }
    static _renderToDocument(tag, attributes) {
        const htmlAttributes = TestUtils._mapObjectToHTMLAttributes(attributes);
        document.body.innerHTML = `<${tag} ${htmlAttributes}></${tag}>`;
    }
    static _mapObjectToHTMLAttributes(attributes) {
        return Object.entries(attributes).reduce((previous, current) => {
            return previous + ` ${current[0]}="${current[1]}"`;
        }, '');
    }
    static _waitForComponentToRender(tag) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                function requestComponent() {
                    const element = document.querySelector(tag);
                    if (element) {
                        resolve(element);
                    }
                    else {
                        window.requestAnimationFrame(requestComponent);
                    }
                }
                requestComponent();
            });
        });
    }
}
exports.TestUtils = TestUtils;
//# sourceMappingURL=testUtils.js.map