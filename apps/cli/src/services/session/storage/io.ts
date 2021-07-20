import { promises as fs } from 'fs'

export const ensureOwner  = async(path: string) => {
    if (process.getuid() === 0) {
        // We are running as root. Make sure the file is owned by the invoker if possible
        if (process.env.SUDO_UID && process.env.SUDO_GID) {
            const uid = parseInt(process.env.SUDO_UID)
            const gid = parseInt(process.env.SUDO_GID)
            await fs.chown(path, uid, gid)
        }
    }
}