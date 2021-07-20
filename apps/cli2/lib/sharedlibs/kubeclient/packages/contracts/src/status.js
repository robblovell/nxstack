"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Stage = exports.Event = void 0;
const tslib_1 = require("tslib");
const ulid_1 = require("ulid");
const util_1 = tslib_1.__importDefault(require("util"));
class Event {
    constructor() {
        this.is = 'e';
    }
}
exports.Event = Event;
class Stage {
    constructor() {
        this.is = 's';
        this.depth = 0;
    }
    begin() {
        this.condition = 'running';
        this.startTime = new Date();
    }
    end() {
        this.endTime = new Date();
    }
    add(event) {
        if (!event.id) {
            event.id = ulid_1.ulid();
            event.timestamp = new Date();
            event.stageId = this.id;
        }
        this.latestEvent = event;
    }
}
exports.Stage = Stage;
class Status {
    constructor() {
        this.stages = [];
        this.warnings = [];
        this.errors = [];
        this.findStage = (id) => this.stages.find(stage => id === stage.id);
        this.newStage = () => new Stage();
    }
    mutated(...items) { }
    begin() {
        this.condition = 'running';
    }
    end() {
        if (this.condition === 'running')
            this.condition = 'done';
    }
    push(stageName, stageIdOrMeta, meta = undefined) {
        if (typeof stageIdOrMeta === 'object')
            meta = stageIdOrMeta;
        else if (stageIdOrMeta && this.findStage(stageIdOrMeta))
            throw new Error(`Stage Id ${stageIdOrMeta} already exists`);
        const stage = this.newStage();
        stage.id = stageIdOrMeta || ulid_1.ulid();
        stage.name = stageName;
        stage.meta = meta;
        this.addStage(stage);
        if (this.condition !== 'running')
            this.begin();
    }
    pop(skipped) {
        const lastStage = this.currentStage;
        if (this.currentStage.condition === 'running')
            this.currentStage.condition = skipped === true ? 'skipped' : 'done';
        this.currentStage.end();
        if (this.currentStage.parentId)
            this.currentStage = this.findStage(this.currentStage.parentId);
        else
            this.end();
        this.mutated(lastStage, this.currentStage);
    }
    info(message, ...args) {
        const event = new Event();
        event.type = 'info';
        event.message = util_1.default.format(message, ...args);
        this.addEvent(event);
    }
    warn(message, ...args) {
        const event = new Event();
        event.type = 'warn';
        event.message = util_1.default.format(message, ...args);
        this.addEvent(event);
    }
    error(ex, message, ...args) {
        const event = new Event();
        event.type = 'error';
        if (ex) {
            event.exception = ex;
            event.message = ex.message;
        }
        if (message)
            event.message = util_1.default.format(message, ...args);
        this.addEvent(event);
    }
    addStage(stage) {
        const lastStage = this.currentStage;
        if (this.currentStage) {
            stage.depth = this.currentStage.depth + 1;
            stage.parentId = this.currentStage.id;
            delete this.currentStage.latestEvent;
        }
        this.stages.push(stage);
        this.currentStage = stage;
        this.currentStage.begin();
        this.mutated(lastStage, stage);
    }
    addEvent(event) {
        const mutations = [];
        if (event.stageId) {
            if (event.stageId === this.currentStage.id) {
                this.currentStage.add(event);
                mutations.push(this.currentStage);
            }
            else {
                const stage = this.findStage(event.stageId);
                stage.add(event);
                mutations.push(stage);
            }
        }
        else if (this.currentStage) {
            event.stageId = this.currentStage.id;
            this.currentStage.add(event);
            mutations.push(this.currentStage);
        }
        if (event.type === 'warn')
            this.warnings.push(event);
        else if (event.type === 'error') {
            this.errors.push(event);
            let current = this.currentStage;
            do {
                current.condition = 'error';
                mutations.push(current);
                current = current.parentId ?
                    this.findStage(current.parentId) :
                    undefined;
            } while (current);
            this.condition = 'error';
        }
        mutations.push(event);
        this.mutated(...mutations);
    }
    received(items) {
        items.forEach(item => {
            if (!item)
                return;
            if (item.is === 's') {
                const stage = this.findStage(item.id);
                if (stage)
                    Object.assign(stage, item);
                else
                    this.addStage(Object.assign(this.newStage(), item));
            }
            else
                this.addEvent(Object.assign(new Event(), item));
        });
    }
}
exports.Status = Status;
//# sourceMappingURL=status.js.map