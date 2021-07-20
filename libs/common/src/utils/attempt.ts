export const attempt = async (times: number, sleepTime: number, callback: () => Promise<boolean>, errorMessage?: string) => {
    let attempts = 0
    times = times - 1
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    do {
        if (attempts) {
            await sleep(sleepTime)
        }
        try {
            const result = await callback()
            if (result) return
        }
        catch (ex) {
            // Fail silently
        }

        if (++attempts > times)
            throw new Error(errorMessage || `Failed after ${times+1} attempts`)

        // eslint-disable-next-line no-constant-condition
    } while (true)
}