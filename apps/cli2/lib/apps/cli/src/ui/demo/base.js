"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Demo = void 0;
const tslib_1 = require("tslib");
const inquirer = tslib_1.__importStar(require("inquirer"));
const client_1 = require("@c6o/kubeclient/client");
class Demo {
    constructor(_params = {}, display) {
        this._params = _params;
        this.display = display;
        this.pause = (delay = 2000) => new Promise((resolve) => setTimeout(resolve, delay));
        this.resourcePrompt = (found, kind) => {
            return (found ?
                `The ${kind} given was not found, please choose which ${kind} you want to debug:` :
                `Please choose which ${kind} you want to debug:`);
        };
    }
    get params() { return this._params; }
    demo() {
        throw new Error('Perform for command not implemented');
    }
    prompt(questions, initialAnswers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield inquirer.prompt(questions, initialAnswers);
        });
    }
    ensureResourceParameter(helper, kind, namespace, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const filter = Array.isArray(name) ? name : undefined;
            name = (Array.isArray(name) ? undefined : name);
            const names = yield this.findResources(helper, namespace, name);
            const nameToFind = (name && !Array.isArray(name) ? name : namespace);
            if (names.find((aname) => aname === nameToFind))
                return nameToFind;
            const filteredNames = filter ? names.filter((name) => !filter.includes(name)) : names;
            return yield this.promptResource(nameToFind, filteredNames, kind);
        });
    }
    getResourceList(helper, namespace, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cluster = new client_1.Cluster();
            const template = helper.from(namespace, name).resource;
            const result = yield cluster.list(template);
            result.throwIfError();
            const list = result.as().items;
            if (!list.length)
                throw new Error(`Could not find any resources in ${namespace}`);
            return list;
        });
    }
    findResources(helper, namespace, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const list = yield this.getResourceList(helper, namespace, name);
            return list.map(resource => resource.metadata.name);
        });
    }
    promptForResource(promptText, resource, resourceChoices = []) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.prompt([
                {
                    name: 'resource',
                    message: promptText,
                    type: 'list',
                    when: resourceChoices.length > 1,
                    choices: _ => resourceChoices,
                    default: 0
                },
                {
                    name: 'resource',
                    message: promptText,
                    type: 'input',
                    when: resourceChoices.length === 0,
                }
            ], (resourceChoices.length > 1) ? {} : { resource });
            return response.resource;
        });
    }
    promptResource(resource, resourceChoices = [], kind) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const prompt = this.resourcePrompt(!!resource, kind);
            resource = yield this.promptForResource(prompt, resource, resourceChoices);
            return resource;
        });
    }
}
exports.Demo = Demo;
//# sourceMappingURL=base.js.map