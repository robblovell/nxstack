"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
jest.mock('./caller', () => {
    return {
        caller: () => {
            return { module: 'module', filename: 'filename' };
        }
    };
});
jest.mock('debug', () => {
    const ANOTHER_MESSAGE = 'message 0';
    return jest.fn().mockReturnValue(jest.fn().mockImplementation(aString => ANOTHER_MESSAGE));
});
const createDebug_1 = require("./createDebug");
const debug_1 = tslib_1.__importDefault(require("debug"));
describe('createDebug function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const THE_RESULT = 'modulefilename';
    const A_MESSAGE = 'message';
    const ANOTHER_MESSAGE = 'message 0';
    describe('globals()', () => {
        it('should call debugLib', () => {
            const result = createDebug_1.createDebug();
            expect(JSON.stringify(result)).toEqual(JSON.stringify(debug_1.default));
            expect(debug_1.default).toBeCalled();
            const mock = result(A_MESSAGE);
            expect(mock).toEqual(ANOTHER_MESSAGE);
        });
        it('should create debug for me', () => {
            expect(JSON.stringify(createDebug_1.debug)).toEqual(JSON.stringify(debug_1.default));
            const mock = createDebug_1.debug(A_MESSAGE);
            expect(mock).toEqual(ANOTHER_MESSAGE);
        });
    });
    describe('const debug = createDebug()', () => {
        it.skip('I should be able to create debug manually', () => {
            const debug = createDebug_1.createDebug();
            expect(debug_1.default).toBeCalledWith(THE_RESULT);
            const mock = debug(A_MESSAGE);
            expect(mock).toEqual(ANOTHER_MESSAGE);
        });
    });
});
//# sourceMappingURL=createDebug.unit.js.map