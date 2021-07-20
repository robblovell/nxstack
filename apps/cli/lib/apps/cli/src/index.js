#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
process.env['SUPPRESS_NO_CONFIG_WARNING'] = 'true';
process.env['OCLIF_TS_NODE'] = '0';
require("./instrumentation");
const command_1 = require("@oclif/command");
const flush_1 = tslib_1.__importDefault(require("@oclif/command/flush"));
const handle_1 = tslib_1.__importDefault(require("@oclif/errors/handle"));
command_1.run().then(flush_1.default, handle_1.default);
//# sourceMappingURL=index.js.map