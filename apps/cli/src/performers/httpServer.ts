import { ServerResponse, createServer, /* TODO: RequestListener */ } from 'http'
import stoppable from 'stoppable'

export class HTTPServer {
    server
    callback
    serverPromise


    respond(res: ServerResponse, status: number, response: string) {
        res.writeHead(status, { 'Content-Type': 'text/plain' })
        res.statusCode = status
        res.end(response)
    }

    // TODO: put the 'RequestListener' typing back.
    async start(port: number, requestListener /* TODO: : RequestListener */) {
        if (this.server) return
        this.server = stoppable(createServer(requestListener)).listen(port)
        return this.serverPromise = new Promise(resolve => this.callback = resolve)
    }

    stop() {
        this.server.close()
        this.callback()
    }
}

