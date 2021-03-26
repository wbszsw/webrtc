// import targets from './targets'
import LocalMedia from './LocalMedia'
// import targets from './targets'
import addEvent from './addeventLister'
/* eslint-disable */
console.log(LocalMedia)
// console.log('local', targets)
class Chat extends LocalMedia {
    constructor(roomid,options) {
        super(options)
        this.roomid = roomid
        this.socket = null
        this.state = null
        this.TextMsgListDom = ''
        this.friendListDom = ''
        // 没办法又要来发布订阅者模式来.....
        this.pubSub = {}
    }
    static appendTextMsg(msg,type) {
        if(!msg) return false
        // dom操作 type判断是不是自己发的消息  true是自己发的 false是别人发的
        const li = document.createElement('li')
        if(type) {
            li.className = 'chatMy chatItem'
        }else {
            li.className = 'chatOthers chatItem'
        }
        
        const divLeft = document.createElement('div')
        divLeft.className = 'TextLeft'
        const imgs = document.createElement('img')
        imgs.src = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2980896150,1513192047&fm=26&gp=0.jpg'
        divLeft.appendChild(imgs)
        const divRight = document.createElement('div')
        divRight.className = 'TextRight'
        const span = document.createElement('span')
        span.innerHTML = msg
        divRight.appendChild(span)
        li.appendChild(divLeft)
        li.appendChild(divRight)
        return li
    }
    initPubSub(obj) {
        this.pubSub = obj
        // 有些local的回调   没办法得拿
        // this.pubSub.addEvent('localMediaMessage',(msg)=> {
        //     if(msg){
        //         this.chatArr.push(JSON.parse(msg))
        //     }
        // })
    }
    // 加入
    join = () => {
        // this.socket.emit('join', this.roomid)
        return Promise.resolve()
    }
    // 离开
    leave = () => {
        if (this.socket) {
            this.socket.emit('leave', this.roomid)
        }
        this.closePeerConnection()
        this.closeLocalMedia()
        return Promise.resolve()

    }
    // 链接socket服务器
    connect = (io) => {
        console.log(`welcome to socket connect`)
        try {
            // const socket = io.connect('https://127.0.0.1:1114',{
            //     autoConnect: false
            // })
            // const socket = io.connect('wss://127.0.0.1:1114')
            // const socket = new WebSocket('wss://127.0.0.1:1114/');
            // var ws = new WebSocket("wss://127.0.0.1:1114/roomid=12345678");
            // addEvent.init(this.ws)
            // ws.onopen = function(evt) { 
            //     console.log("Connection open ..."); 
            //     ws.send("H!");
            // };

            // ws.onmessage = function(evt) {
            //     console.log( "Received Message: " + evt.data);
            // ws.close();
            // };

            // ws.onclose = function(evt) {
            //     console.log("Connection closed.");
            // };  
        
            // this.socket = ws
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        }
    }
    // 服务器发送给客户端的事件响应
    /**
     * 统一返回格式
     * {
     *     target:'join||msg||leave||...'
     *     data:{
     *          msg:{},
     *          
     *     }
     * }
     */
    socketTarget = async () => {
        const that = this
        if (that.socket) {
            const socket = that.socket
            // socket.on('textMsg', (roomid, socketid, data) => {
            //     if(roomid == this.roomid) {
            //         const chatDom = Chat.appendTextMsg(data,false)
            //         if(chatDom) {
            //             this.TextMsgListDom.appendChild(chatDom)
            //         }
            //     }
            // })
            // socket.on('joined', async (roomid, id) => {
            //     console.log('joined')
            //     that.state = 'joined'
            //     await that.createPeerConnection()
            // })
            // socket.on('otherjoin', async (roomid, id) => {
            //     console.log('...otherjoin')
            //     if (that.state === 'joined_unbind') {
            //         await that.createPeerConnection()
            //     }
            //     that.state = 'joined_conn'
            //     that.call()
            // })
            // socket.on('full', (roomid, id) => {
                
            //     that.closePeerConnection()
            //     that.closeLocalMedia()
            //     that.state = 'leaved'
            //     console.log('房间满了 进不去')
            // })
            // socket.on('leaved', (roomid, id) => {
            //     that.state = 'leaved';
            //     that.socket.disconnect();
            //     console.log('挂了  撤')
            // })
            // socket.on('bye', (roomid, id) => {
            //     console.log('bye')
            //     that.state = 'joined_unbind';
            //     that.closePeerConnection();
            // });
            // socket.on('disconnect', (socket) => {
            //     console.log('disConnect')
            //     if (!(that.state === 'leaved')) {
            //         that.closePeerConnection();
            //         that.closeLocalMedia();
            //     }
            //     that.state = 'leaved';

            // });
            // socket.on('message', async (roomid, id, data) => {
            //     //媒体协商
            //     if (data) {
            //         if (data.type === 'offer') {
            //             await that.pc.setRemoteDescription(new RTCSessionDescription(data));
            //             const offers = await that.pc.createAnswer()
            //             try {
            //                 await that.getAnswer(offers)
            //             }catch(err) {
            //                 that.handleAnswerError(err)
            //             }
            //         } else if (data.type === 'answer') {
            //             console.log("reveive client message=====>", data);
            //             that.pc.setRemoteDescription(new RTCSessionDescription(data));
            //         } else if (data.type === 'candidate') {
            //             const candidate = new RTCIceCandidate({
            //                 sdpMLineIndex: data.label,
            //                 candidate: data.candidate
            //             });
            //             that.pc.addIceCandidate(candidate);

            //         } else {
            //             console.error('the message is invalid!', data)
            //         }
            //     }

            // });
            return
        } else {
            return Promise.reject('peleese first send socketio!')
        }
    }
    // 关闭socket服务器
    closeConnect = (socket) => {

    }
    sendMessage(roomid, data) {
        const socket = this.socket
        // console.log(socket)
        if (this.socket) {
            socket.emit('message', roomid, data);
            
        }
    }

    // 文字消息
    textMsg = (val) => {
        if (!this.socket) {
            this.joinRoom()
        }
        // this.socket.emit('textMsg', this.roomid, val)
        const chatDom = Chat.appendTextMsg(val,true)
        if(chatDom) {
            this.TextMsgListDom.appendChild(chatDom)
        }
        return Promise.resolve()
    }

    //  流程
    static async joinRoom(roomid, io, textMsgs, videoDom, OtherVideoArr,TextMsgListDom,friendListDom,options) {
        const chat = new Chat(roomid, videoDom, OtherVideoArr,TextMsgListDom,friendListDom,options)
        await chat.init()
        await chat.connect(io)
        await chat.socketTarget()
        await chat.join()
        await chat.textMsg(textMsgs)

        // // 打开socket链接
        // chat.connect(io).then(() => {
        //     // 加入房间
        //     chat.join()
        // }).then(() => {
        //     // 文字消息
        //     chat.textMsg(textMsgs)
        // }).then(() => {
        //     // 看是否打开视频
        //     // 根据参数看是否是视频
        //     chat.init()
        // }).then(() => {
        //     chat.socketTarget()
        // }).then((stream)=>  {
        //     console.log('stream',stream)
        // })
        return chat
    }
}
export default Chat
/* eslint-enable */
