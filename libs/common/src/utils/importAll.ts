import { readdirSync } from 'fs'

/**
 *
 * @param folder - Folder to import all .js files from
 */
export async function importAll(folder) {
    const commands = []
    readdirSync(folder).forEach(file => {
        if (file.endsWith('.js'))
            commands.push(import(folder + file))
    })
    return Promise.all(commands)
}