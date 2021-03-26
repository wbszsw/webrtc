class errors extends Error{
    constructor(message) {
        super()
        this.message = message
    }

}
export default new errors