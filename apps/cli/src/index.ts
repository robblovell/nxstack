#!/usr/bin/env node
import 'source-map-support/register'
process.env['SUPPRESS_NO_CONFIG_WARNING']='true' // no config used
process.env['OCLIF_TS_NODE']='0' // oclif tries to compile ts when it sees a tsconfig.json

import './instrumentation'

import { run } from '@oclif/command'
import flush from '@oclif/command/flush'
import handleErrors from '@oclif/errors/handle'

run().then(flush, handleErrors)
