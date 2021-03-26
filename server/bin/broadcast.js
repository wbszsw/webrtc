class Broadcast {
    constructor(client) {
        this.client = client
    }
    callAll(obj) {
        this.client.forEach(item => {
            item.send(obj)
        });
    }
}
module.exports = Broadcast