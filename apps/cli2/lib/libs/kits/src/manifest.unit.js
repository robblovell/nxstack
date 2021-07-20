"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
jest.mock('js-yaml', () => {
    return {
        loadAll: jest.fn().mockReturnValue([{ 'thing1': 'thing2' }]),
    };
});
const manifest_1 = require("./manifest");
const manifest = tslib_1.__importStar(require("./manifest"));
const parser = tslib_1.__importStar(require("./parser"));
describe('manifest helper tests', () => {
    const a_manifest = {
        appId: 1,
        namespace: 'namespace',
        name: 'name',
        summary: 'summary',
        iconUrl: 'iconUrl',
        package: 'package',
    };
    const an_edition = {
        name: 'name',
        spec: 'spec',
        interfaces: ['item1', 'item2']
    };
    const another_edition = {};
    const some_content = {
        editions: [an_edition]
    };
    describe('convertManifestToAppResource', () => {
        const result = manifest_1.convertManifestToAppResource(a_manifest, an_edition);
        expect(result).toEqual({
            "apiVersion": "system.codezero.io/v1",
            "kind": "App",
            "metadata": {
                "annotations": {
                    "system.codezero.io/appId": 1,
                    "system.codezero.io/description": "summary",
                    "system.codezero.io/display": "name",
                    "system.codezero.io/iconUrl": "iconUrl"
                },
                "labels": {
                    "system.codezero.io/edition": "name",
                    "system.codezero.io/interface-item1": "true",
                    "system.codezero.io/interface-item2": "true"
                },
                "name": "namespace"
            },
            "spec": {
                "0": "s",
                "1": "p",
                "2": "e",
                "3": "c",
                "package": "package"
            }
        });
    });
    describe('loadLocalAppManifests', () => {
        let parseSpy, convertSpy;
        beforeAll(() => {
            convertSpy = jest.spyOn(manifest, 'convertEditions')
                .mockReturnValue('result');
            parseSpy = jest.spyOn(parser, 'parseManifest');
        });
        afterAll(() => {
            convertSpy.mockRestore();
            parseSpy.mockRestore();
        });
        test('Convert single edition', () => {
            parseSpy.mockReturnValue({ editions: [an_edition] });
            const result = manifest_1.loadLocalAppResources(a_manifest);
            expect(convertSpy).toBeCalled();
            expect(parseSpy).toBeCalled();
            expect(result).toEqual('result');
        });
        test('Convert array of editions', () => {
            parseSpy.mockReturnValue([{ editions: [an_edition] }]);
            const some_manifests = [a_manifest];
            const result = manifest_1.loadLocalAppResources(some_manifests);
            expect(convertSpy).toBeCalled();
            expect(parseSpy).toBeCalled();
            expect(result).toEqual(['r']);
        });
        test('loadLocalAppManifests', () => {
            parseSpy.mockReturnValue({ editions: [an_edition] });
            const result = manifest_1.loadLocalAppManifests(a_manifest);
            expect(parseSpy).toBeCalled();
            expect(result).toEqual({ editions: [an_edition] });
        });
    });
    describe('convertEditions', () => {
        test('Convert array of editions', () => {
            const a_manifest = {};
            const some_editions = [an_edition, a_manifest];
            const result = manifest_1.convertEditions(some_content, some_editions);
            expect(result).toEqual([
                {
                    "apiVersion": "system.codezero.io/v1",
                    "kind": "App",
                    "metadata": {
                        "annotations": {},
                        "labels": {
                            "system.codezero.io/edition": "name",
                            "system.codezero.io/interface-item1": "true",
                            "system.codezero.io/interface-item2": "true"
                        }
                    },
                    "spec": {
                        "0": "s",
                        "1": "p",
                        "2": "e",
                        "3": "c"
                    }
                }
            ]);
        });
        test('Throws when editions length is 0', () => {
            const no_content = {
                editions: []
            };
            expect(() => {
                manifest_1.convertEditions(no_content, a_manifest);
            }).toThrow(`No available editions found in ${a_manifest}.`);
        });
    });
});
//# sourceMappingURL=manifest.unit.js.map