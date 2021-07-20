import path from 'path'
import callsite from 'callsite'
/*
    A function to figure out who is calling the parent function.
  This is a way to introspect to the file of the parent's calling function.
 */
export function caller(depth = 0,
                       defaults: { packagesMatch: string; libMatch: string } = {
                           packagesMatch: 'packages',
                           libMatch: '/lib'
                       }
) {
    const stack = callsite()[depth + 2]
    const requester = stack.getFileName()

    if (!requester) {
        return {
            module: 'Anonymous',
            path: 'unknown',
            filename: 'unknown',
            line: -1
        }
    }

    let dir = path.dirname(requester)
    const index = dir.indexOf(defaults.packagesMatch)
    if (~index) {
        dir = dir.substring(index + defaults.packagesMatch.length, dir.length)
    }

    let filename = requester
    const fileIndex = requester.lastIndexOf(defaults.libMatch)
    if (~fileIndex) {
        filename = requester.substring(fileIndex + defaults.libMatch.length, requester.length)
    }
    dir = dir
        .replace(defaults.libMatch, '') // filter out lib
        .replace(/[//+]/g, ':') // replace / with :

    return {
        module: dir,
        path: requester,
        filename,
        line: stack.getLineNumber()
    }
}
