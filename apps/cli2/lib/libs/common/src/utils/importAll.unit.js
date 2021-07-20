"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const importAll_1 = require("./importAll");
jest.mock('fs', () => {
    return {
        readdirSync: jest.fn().mockReturnValue(['file.txt', 'importAll.fixture.js']),
    };
});
const fs_1 = require("fs");
describe('importAll()', () => {
    beforeEach(() => {
    });
    test('importAll: With one folder and two files', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const expected = [
            {
                'test': 1,
                'default': {
                    'test': 1
                }
            }
        ];
        const result = yield importAll_1.importAll('./');
        expect(result).toEqual(expected);
        expect(fs_1.readdirSync).toBeCalledTimes(1);
    }));
});
//# sourceMappingURL=importAll.unit.js.map