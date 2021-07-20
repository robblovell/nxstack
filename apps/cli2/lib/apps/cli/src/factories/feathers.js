"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeathers = void 0;
const common_1 = require("@c6o/common");
const getFeathers = () => {
    if (!process.env.SYSTEM_SERVER_URL)
        throw Error('SYSTEM_SERVER_URL is not defined');
    const feathersFactory = new common_1.FeathersServiceFactory();
    feathersFactory.url = process.env.SYSTEM_SERVER_URL;
    return feathersFactory;
};
exports.getFeathers = getFeathers;
//# sourceMappingURL=feathers.js.map