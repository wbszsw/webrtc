var broadcast = require('./broadcast')

class Status extends broadcast{
    constructor(ws) {
        super(ws)
        this.ws = ws
    }
    sendStatus(roomid,user) {
        
    }
    send(obj) {
        this.ws.forEach(item => {
            item.send(`${JSON.stringify(obj)}`, (err) => {
                if (err) {
                    console.log(`服务器错误：${err}`);
                }
            });
        });
        // console.log('触发send方法:', `${JSON.stringify(obj)}`)
        // this.ws.
    }
}
// export default status
module.exports =  Status