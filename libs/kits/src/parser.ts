import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'
import { mergeAdvanced } from 'object-merge-advanced'

const serverURL = process.env.HUB_SERVER_URL || 'https://codezero.io'  // default to latest.
const EMPTY_OBJECT = {}

export interface ParseOptions {
    rootFile?: string // c6o.yaml
    rootFolder?: string // c6o/
    folderFile?: string // app.yaml or env.yaml
}

export const parseManifest = (pathToFile?: string, basePath?: string, options: ParseOptions = {}) => {
    if (!basePath) {
        const temp = path.resolve(process.cwd(), pathToFile)
        if (fs.lstatSync(temp).isDirectory()) {
            basePath = temp
            pathToFile = null
        } else {
            basePath = path.dirname(temp)
            pathToFile = path.basename(temp)
        }
    }
    const primaryFile = getPrimaryFile(basePath, pathToFile, options)
    if (!primaryFile)
        return EMPTY_OBJECT
    const parsed = url.parse(serverURL)
    const environment = parsed.host.split('.')[0]
    const data = mergeProvisionerYaml(basePath, primaryFile, environment)

    // Simplified non-merge read
    // const data = read(primaryFile, EMPTY_OBJECT)

    resolveKeys(basePath, data)
    return data
}

export function getPrimaryFile(basePath, file, options: ParseOptions = {}) {
    let primaryFile

    if (file) {
        primaryFile = path.resolve(basePath, file)
        if (fs.existsSync(primaryFile))
            return primaryFile

        primaryFile = options.rootFolder ?
            path.resolve(basePath, options.rootFolder, file) :
            path.resolve(basePath, file)

        if (fs.existsSync(primaryFile))
            return primaryFile
    } else {
        primaryFile = path.resolve(basePath, options.rootFile)
        if (fs.existsSync(primaryFile))
            return primaryFile

        primaryFile = path.resolve(basePath, options.rootFolder, options.folderFile)
        if (fs.existsSync(primaryFile))
            return primaryFile
    }
}

export function read(file, contents) {
    if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
        const ext = path.extname(file)
        const fileContent: any = ext === '.yaml' || ext === '.yml' ?
            yaml.loadAll(fs.readFileSync(file, 'utf8')) :
            fs.readFileSync(file, 'utf8')

        if (contents.length) {
            return contents.map((obj,ix) => {
                if (!fileContent.length)
                    return mergeAdvanced(obj, fileContent, null)
                else if (ix < fileContent.length)
                    return mergeAdvanced(obj, fileContent[ix], null)
                else
                    return obj
            })
        } else {
            return fileContent.length === 1 ?
                mergeAdvanced(contents, fileContent[0], null) :
                mergeAdvanced(contents, fileContent, null)
        }
    }
    return contents
}

export function mergeProvisionerYaml(basePath, primaryFile, env='') {
    const ext = path.extname(primaryFile) || '.yaml'
    const filename = primaryFile.substr(0, primaryFile.length - ext.length)
    let data

    let envFile = path.resolve(basePath, `${filename}-${env}${ext}`)
    if (!env || env == 'codezero.io')
        envFile = path.resolve(basePath, `${filename}${ext}`)

    // in the future, we may want host specific modifications of the provisioner yaml file.
    // if (hostname) {
    //     const hostFile = path.resolve(basePath, `${filename}-${hostname}${ext}`)
    //     const hostEnvFile = path.resolve(basePath, `${filename}-${hostname}-${env}${ext}`)
    //
    //     data =
    //         read(hostEnvFile,
    //             read(hostFile,
    //                 read(envFile,
    //                     read(primaryFile, EMPTY_OBJECT))))
    // } else {
    if (envFile != primaryFile)
        data =
            read(envFile,
                read(primaryFile, EMPTY_OBJECT))
    else
        data = read(primaryFile, EMPTY_OBJECT)
    // }
    return data
}

export function resolveKeys(basePath, data) {
    if (Array.isArray(data) || typeof data === 'object')
        Object.keys(data).forEach(key => {
            const value = data[key]

            if (!value) return

            if (typeof value === 'string') {
                const content = parseManifest(value, basePath)
                if (content !== EMPTY_OBJECT)
                    data[key] = content
            }

            if (Array.isArray(value))
                value.forEach(item => resolveKeys(basePath, item))

            if (typeof value == 'object')
                resolveKeys(basePath, value)
        })
}