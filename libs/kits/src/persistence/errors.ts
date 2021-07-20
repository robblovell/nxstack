// TODO:: refactor this out.
export class PersistenceHelperError extends Error {
    constructor(error: any) {
        if (typeof(error) === 'string')
            super(error)
        else
            super(JSON.stringify(error,null,4))
        this.name = "PersistenceHelper"
    }
}
