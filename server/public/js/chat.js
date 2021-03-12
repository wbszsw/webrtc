// const { localsName } = require("ejs")

// import LocalMedia from './LocalMedia.js'
class LocalMedia {
    _localStream = null
    _localOptions = {
        video: true,
        audio: true
    }
    _othersOptions = {
        video: true,
        audio: true
    }
    constructor(videoDom, OtherVideoArr,options) {
        // ice 信令转发服务器
        this.pcConfig = {
            'iceServers': [{
                'urls': 'stun:stun.l.google.com:19302',
                'credential': '123456',
                'username': 'huang'
            }]
        }
        this.videoDom = videoDom
        this.OtherVideoArr = OtherVideoArr
        this.pc = null,
        this.localOptions = options
    }
    get localStream() {
        return this._localStream
    }
    set localStream(stream) {
        this._localStream = stream
    }
    // get localOptions() {
    //     return this._localOptions
    // }
    // set localOptions(options) {
    //     this._localOptions = options
    // }
    get otherOptions() {
        return this._othersOptions
    }
    set otherOptions(options) {
        this._othersOptions = options
    }
    async init() {
        const that = this
        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia is not supported!")
            return;
        } else {
            //1 ===============配置音视频参数===============
            console.log('初始化配置参数',this.localOptions)
            const stream = await navigator.mediaDevices.getUserMedia(this.localOptions)
                // .then(that.getMediaStream)
                // .catch(that.handleError)
            try{
                await that.getMediaStream(stream)
            }catch(err) {
                await that.handleError(err)
            }
        }
    }
    getMediaStream (stream) {
        this.localStream = stream
        this.videoDom.srcObject = stream
        return Promise.resolve(this.localStream)
    }
    handleError (err) {
        if (err) {
            console.error("getUserMedia  error:", err);
        }
    }
    // webRtc RTCPeerConnection 流
    createPeerConnection = () => {
        const that = this
        if (!that.pc) {
            this.pc = new RTCPeerConnection(this.pcConfig)
            this.pc.onicecandidate = (e) => {
                if (e.candidate) {
                    that.sendMessage(this.roomid, {
                        type: 'candidate',
                        label: e.candidate.sdpMLineIndex,
                        id: e.candidate.sdpMid,
                        candidate: e.candidate.candidate
                    });
                }
            }
            this.pc.ontrack = (e) => {
                this.OtherVideoArr[0].srcObject = e.streams[0]
            }
        }
        if (this.pc === null || this.pc === undefined) {
            console.error('chat this.pc is null or undefined!');
            return;
        }
        if (this.localStream === null || this.localStream === undefined) {
            
            console.error('localStream is null or undefined!');
            return;
        }
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => {
                this.pc.addTrack(track, this.localStream)
            })
        }
        return Promise.resolve()
    }
    // 关闭本地媒体流
    closePeerConnection() {
        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }
        return Promise.resolve()
    }
    // 关闭流通道
    closeLocalMedia = () => {
        if (this.localStream && this.localStream.getTracks()) {
            this.localStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
        this.localStream = null;
        return Promise.resolve()
    }
    // getOffer 
    getOffer = (desc) => {
        this.pc.setLocalDescription(desc)
        this.sendMessage(this.roomid, desc)
        // return Promise.resolve()
    }
    handleOfferError = (err) => {
        console.error('Failed to get Offer!', err);
    }
    // call 接收远端流通道
    async call() {
        const that = this
        if (that.state === 'joined_conn') {
            if (that.pc) {
                console.log('this.pc ', that.pc)
                const options = {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                }
                const offer = await that.pc.createOffer(options)
                try{
                    await that.getOffer(offer)
                }catch(err) {
                    that.handleOfferError(err)
                }
            }
        }
    }
    async getAnswer(desc) {
        await this.pc.setLocalDescription(desc);
        await this.sendMessage(this.roomid, desc);
    }

}
class Chat extends LocalMedia {
    constructor(roomid, videoDom, OtherVideoArr,TextMsgListDom,friendListDom,options) {
        super(videoDom, OtherVideoArr,options)
        this.roomid = roomid
        this.socket = null
        this.state = null
        this.TextMsgListDom = TextMsgListDom
        this.friendListDom = friendListDom

    }
    // 加入
    join = () => {
        this.socket.emit('join', this.roomid)
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
            const socket = io.connect()
            this.socket = socket
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
            socket.on('textMsg', (roomid, socketid, data) => {
                if(roomid == this.roomid) {
                    const chatDom = targets.appendTextMsg(data,false)
                    if(chatDom) {
                        this.TextMsgListDom.appendChild(chatDom)
                    }
                }
            })
            socket.on('joined', async (roomid, id) => {
                console.log('joined')
                that.state = 'joined'
                if(this.localStream) {
                    await that.createPeerConnection()
                }
            })
            socket.on('otherjoin', async (roomid, id) => {
                console.log('...otherjoin')
                if (that.state === 'joined_unbind') {
                    if(that.localStream) {
                        await that.createPeerConnection()
                    }
                    
                }
                that.state = 'joined_conn'
                if(that.localStream) {
                    that.call()
                }
            })
            socket.on('full', (roomid, id) => {
                if(this.localStream) {
                    that.closePeerConnection()
                    that.closeLocalMedia()
                }

                that.state = 'leaved'
                console.log('房间满了 进不去')
            })
            socket.on('leaved', (roomid, id) => {
                that.state = 'leaved';
                that.socket.disconnect();
                console.log('挂了  撤')
            })
            socket.on('bye', (roomid, id) => {
                console.log('bye')
                that.state = 'joined_unbind';
                if(this.localStream) {
                    that.closePeerConnection();
                }
                
            });
            socket.on('disconnect', (socket) => {
                console.log('disConnect')
                if (!(that.state === 'leaved')) {
                    if(this.localStream) {
                        that.closePeerConnection();
                        that.closeLocalMedia();         
                    }

                }
                that.state = 'leaved';

            });
            socket.on('message', async (roomid, id, data) => {
                //媒体协商
                if (data) {
                    if (data.type === 'offer') {
                        await that.pc.setRemoteDescription(new RTCSessionDescription(data));
                        const offers = await that.pc.createAnswer()
                        try {
                            await that.getAnswer(offers)
                        }catch(err) {
                            that.handleAnswerError(err)
                        }
                    } else if (data.type === 'answer') {
                        console.log("reveive client message=====>", data);
                        that.pc.setRemoteDescription(new RTCSessionDescription(data));
                    } else if (data.type === 'candidate') {
                        const candidate = new RTCIceCandidate({
                            sdpMLineIndex: data.label,
                            candidate: data.candidate
                        });
                        that.pc.addIceCandidate(candidate);

                    } else {
                        console.error('the message is invalid!', data)
                    }
                }

            });
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
        this.socket.emit('textMsg', this.roomid, val)
        const chatDom = targets.appendTextMsg(val,true)
        if(chatDom) {
            this.TextMsgListDom.appendChild(chatDom)
        }
        return Promise.resolve()
    }

    //  流程
    static async joinRoom(roomid, io, textMsgs, videoDom, OtherVideoArr,TextMsgListDom,friendListDom,options) {
        const chat = new Chat(roomid, videoDom, OtherVideoArr,TextMsgListDom,friendListDom,options)
        // await chat.init()
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
class targets {
    constructor(roomid, textMsgDom, submitDom, LocalStreamDom, otherStreamArr, leaveDom, joinDom, TextMsgListDom, friendListDom) {
        // 文本input dom
        this.textMsgDom = textMsgDom
        // 文本消息的发送按钮
        this.submitDom = submitDom
        // 本地的localStream 资源
        this.My = {}
        this.leaveDom = leaveDom
        this.joinDom = joinDom
        this.roomid = roomid
        this.LocalStreamDom = LocalStreamDom
        this.otherStreamArr = otherStreamArr
        // 文字消息展示
        this.TextMsgListDom = TextMsgListDom
        // 房间人全部展示
        this.friendListDom = friendListDom
        // 其他的otherStream集合  是个数组类型（防止以后改成多个）
        // this.otherPeople = [...otherStreamArr].map((item) => {
        //     return Chat.joinRoom(otherStreamArr)
        // })
    }

    submitText() {
        if (!this.My) {
            this.join({video: true,
                audio: true})
        }
        return this.My.textMsg(this.textMsgDom.value)
    }
    async join(options) {
        this.My = await Chat.joinRoom(this.roomid, io, this.textMsgDom.value, this.LocalStreamDom, this.otherStreamArr, this.TextMsgListDom,this.friendListDom,options)
        return this.My
    }
    leave() {
        return this.My.leave()
    }
    changeLcoalStreamOption(options) {
        this.My._localOptions = options
        return Promise.resolve()
    }
    changeOtherStreamOption(index, options) {
        this.otherPeople.forEach((key, i) => {
            if (index == i) {
                key._othersOptions = options
            }
        })
    }
    // 给dom绑定事件
    action() {
        this.addEvents(this.submitDom)
        this.addEvents(this.leaveDom)
        this.addEvents(this.joinDom)
        this.addEvents(this.friendListDom)
    }
    addEvents(dom) {
        if(dom === this.friendListDom) {
            const friendArr = [...dom.querySelectorAll('li')]
            friendArr.map((item => {
                let friendAudio = item.querySelector('.audioIcon')
                let friendVudio = item.querySelector('.videoIcon')
                if(!this.My) {
                    console.log('还未初始化....')
                }else {
                    friendAudio.addEventListener('click',() => {
                        this.join({
                            video:false,
                            audio:true
                        })
                    })
                    friendVudio.addEventListener('click',() => {
                        this.join({
                            video:true,
                            audio:true
                        })
                    })
                }

            }))
        }else {
            dom.addEventListener('click', () => {
                if (dom === this.submitDom) {
                    this.submitText().then(() => textMsgDom.value = '')
                } else if (dom === this.leaveDom) {
                    this.leave()
                } else if (dom === this.joinDom) {
                    console.log('触发init',this)
                    this.My.init({video: true,
                        audio: true})
                }
            }) 
        }
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
    static init(roomid, textMsgDom, submitDom, LocalStreamDom, otherStreamArr, leaveDom, joinDom,TextMstListDom,friendListDom) {
        let targetObgs = new targets(roomid, textMsgDom, submitDom, LocalStreamDom, otherStreamArr, leaveDom, joinDom,TextMstListDom,friendListDom)
        targetObgs.action()
        return targetObgs
    }
}

const textMsgDom = document.getElementsByClassName('inputs')[0]
const subMitDom = document.getElementsByClassName('sendMsg')[0]
const LocalStreamDom = document.getElementById('localvideo')
const othersVideoDomArr = document.getElementsByClassName('othersVideos')
const leaveDom = document.getElementById('leave')
const joinDom = document.getElementById('connserver')

// 文字消息 列表
const  textMsgList = document.getElementsByClassName('textMsgList')[0]
// 朋友列表
const friendList = document.getElementsByClassName('friendList')[0]
const targetObj = targets.init('123456789', textMsgDom, subMitDom, LocalStreamDom, othersVideoDomArr, leaveDom, joinDom, textMsgList, friendList)
targetObj.join({
    video: true,
        audio: true
})

