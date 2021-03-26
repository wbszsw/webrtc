// import User from './User'
// import status from './status'
const User = require('./User')
const status = require('./status')
const RoomObj ={}
class Room extends  status{
    constructor(ws) {
        super(ws)
        this.room = {}
        // this.RoomObj ={}
    }
    get Room() {
        return this.RoomObj
    }
    addUser(roomid,room) {
        RoomObj[roomid] = room
    }
    createRoom(roomid,options) {
        /**
         * options
         * {
         *  user:'aaa
         * }
         */
        // this.room.add(RoomId)
        const room = RoomObj[roomid]
        let type = 0
        return new Promise((resolve,reject)=> {
            // types 
            // 1  roomid存在 user存在
            // 2  roomid 存在 user不存在
            // 3  roomid 不存在 user不存在
            if(RoomObj.hasOwnProperty(roomid)) {
                if(RoomObj[roomid].hasOwnProperty(User.init(options.user))){
                    //  原先房间就存在该用户
                    type = 1
                    console.log(`房间号${roomid}存在,用户${options.user}存在`)
                    this.send({
                        types:'join',
                        user:options.user,
                        roomid:roomid,
                        msg:`房间号${roomid}存在,用户${options.user}存在`
                    })
                }else {
                    // 原先房间不存在该用户，新加的用户
                    type = 2
                    // this.room[roomid].add(User.init(options.user))
                    // this.addUser(roomid,this.room)
                    // RoomObj[roomid][options.user] = true 
                    RoomObj[roomid][options.user] = true 
                    console.log(`房间号${roomid}存在,用户${options.user}不存在，已添加到房间`)
                    this.send({
                        types:'join',
                        user:options.user,
                        roomid:roomid,
                        msg:`房间号${roomid}存在,用户${options.user}不存在，已添加到房间`
                    })

                }
            }else {
                // 创建新房间里面加人
                type = 3
                RoomObj[roomid]= {}
                RoomObj[roomid][options.user] = true 
                console.log(`房间号${roomid}不存在，已创建`,RoomObj)
                // RoomObj[roomid] = new Set()
                // RoomObj[roomid].add(User.init(options.user))
                // this.addUser(roomid,this.room)
                this.send({
                    types:'join',
                    user:options.user,
                    roomid:roomid,
                    msg:`房间号${roomid}不存在，已创建,用户${options.user}已加入该房间`
                })
            }
            resolve(RoomObj)
        })

    }
    textChat(roomid,user,textChat) {
        console.log('————————————————————func  textChat')
        this.send({
            types:'textChat',
            user:user,
            roomid:roomid,
            textChat:textChat
        })
    }
    static init(ws) {
        return new Room(ws)
    }
}
// export default Room
module.exports = Room