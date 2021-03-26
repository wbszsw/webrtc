import Notifications from './Notification'
// import error from './error';
import chat from './Chat'
// import Room from '../../../server/bin/Room';
// import { json } from 'express';
// const NotificationsObj = new Notifications()
// const vueObj = {}
// const addEventObj = Object.create(null)
// const _obj = {}
// function returnThis(obj) {
//     if(!JSON.parse(JSON.stringify(obj)) == '{}') {
//         _obj = obj
//     }
//     return _obj
// }
class addEvent{
    constructor(roomid,user) {
        this.roomid = roomid
        this.user = user
        this.to = ''
        // console.log('123123',`wss://127.0.0.1:1115/webRtc/roomid=${roomid}/user=${user}`)
        // const ws = new WebSocket(`wss://${window.location.host}/webRtc/roomid=${roomid}/user=${user}`)
        const ws = new WebSocket(`wss://1.15.43.45:1120/webRtc/roomid=${roomid}/user=${user}`)

        this.ws = ws
        this.Chat = null
        this.state = 'wait....'
        this.newVue= {}
        // 用户集合
        this.userList = []
        ws.addEventListener('open',(e)=> {
            ws.send(JSON.stringify({
                types:'open',
                message:'websocket is open!'
            }))
        })
        ws.addEventListener('close',(e)=> {
            ws.send({
                types:'close',
                message:'websocket is close!'
            })
        })
        ws.addEventListener('message',async (e)=> {
            let message 
            if(e.data) {
                console.log('message服务器回复 e.data',e.data)
                message = JSON.parse(e.data)

            }else {
                console.log('message服务器回复 e',e)
                message = {}

            }
        //    console.log(message,message.types)
           if(message.types == 'join') {
                this.state = 'join'
               console.log('************************************join')
            //    NotificationsObj.showMessage({
            //     title:`welcome: ${message.user}`,
            //     tag:`join${Math.random(0,1)}`,
            //     body:message.msg
            //    })
               this.getUser()
           }
            //文字聊天    
           if(message.types === 'textChat') {
               this.submitText(message)
           }
        //    if(message.types == 'webRtc') {
                // this.openWebRtc(message)
                // this.DowebRtc(message)
        //    }

        //    if(message.types === 'createChat') {
        //     // 发起通话
        //         this.sendOffer()
        //    }
           if(message.types === 'mediaRtcChat') {
            //  相当于message
                // {
                //     types:'mediaRtcChat'
                //     user:'XX',
                //     data: {
                //         type:'offer'
                //     }
                // }
               this.mediaRtcChat(message)
           }
            // 获取当前房间在线用户
            if(message.type ==='getUser') {
                this.showUsers(message)
            } 
            // 发送offer  开始呼叫某个用户   就是点击视频按钮了
            if(message.types === 'callRtc') {
                this.state = 'callRtc'
                this.listenCall(message)
            }
            if(message.type == 'offer') {
                console.log('......................type   offer')

                await this.Chat.pc.setRemoteDescription(new RTCSessionDescription(message));
                const offers = await this.Chat.pc.createAnswer()
                try {
                    await this.Chat.getAnswer(offers,this,this.sendMessage)
                }catch(err) {
                    await this.Chat.handleAnswerError(err)
                }
            }else if(message.type=== 'answer') {
                console.log('......................type   answer')
                console.log("reveive client message=====>", message);
                this.Chat.pc.setRemoteDescription(new RTCSessionDescription(message));
            }else if(message.type === 'candidate') {
                console.log('......................type   candidate')
                const candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                this.Chat.pc.addIceCandidate(candidate);
            }

        })
        // 订阅者模式
        this.pubSub = {}
    
    }
    mediaRtcChat(obj) {
        if(!obj?.data) {return}
        const data = obj.data
        const pc = this.Chat.pc
        const getAnswer = this.Chat.getAnswer
        const handleAnswerError = this.Chat.handleAnswerError
        if (data) {
            if (data.type === 'offer') {
                pc.setRemoteDescription(new RTCSessionDescription(data));
                pc.createAnswer()
                    .then(getAnswer)
                    .catch(handleAnswerError);
            } else if (data.type === 'answer') {
                console.log("reveive client message=====>", data);
                pc.setRemoteDescription(new RTCSessionDescription(data));
            } else if (data.type === 'candidate') {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: data.label,
                    candidate: data.candidate
                });
                pc.addIceCandidate(candidate);

            } else {
                console.error('the message is invalid!', data)
            }
        }

        console.log("reveive client message", roomid, id, data);
    }
    getUser() {
        console.log('........getUser')
        this.sendMsg({
            types:'getUser'
        })
    }
    showUsers(obj) {
        console.log('12321', obj.roomObj[this.roomid])
        this.userList = Object.keys(obj.roomObj[this.roomid])
        console.log('userlist',this.userList)
        const SetArr = []
        this.userList.forEach(item => {
            let objs = {}
            objs.name = item
            objs.options = {
                audio:true,
                video:true
            }
            SetArr.push(objs)
        })
        console.log('jieguoArr',SetArr)
        this.pubSub.publish('getUserList',JSON.stringify(SetArr))
        
    }
    
    sendMsg(options) {
        console.log('options',options)
        if(this.ws) {
            this.ws.send(JSON.stringify(options))
        }else {
            console.log('初始化没完成...')
            // new error('请初始化ws...')
        }
        
    }
    join() {

    }
    sendMessage(obj,that) {
        console.log('sendmessage',obj)
        console.log(that)
        that.sendMsg(obj)
        // const that = this
        // this.Chat.pubSub.addEvent('localMediaMessage',(msg)=> {
        //     if(msg){
        //         that.this.sendMsg(JSON.parse(msg))
        //     }
        // })
    }
    async leave() {
       await this.Chat.closePeerConnection()
    }
    submitText(message) {
        console.log('文字聊天到处理',message,this.pubSub)
        // this.pubSub.publish('textChat',JSON.stringify(message))
        this.pubSub.publish('chat',JSON.stringify(message))

    }
    async openWebRtc(localDom,otherDom,to,from) {
        // console.log('打开webRtc',this.Chat,this)
        // 跟谁视频
        this.to = to
        this.from = from
        // this.localDom = localDom
        // this.otherDom = otherDom
        // console.log(this)
        await this.Chat.init(localDom,otherDom)
        // 本地流
        await this.Chat.createPeerConnection(this,this.sendMessage)
        // 向websocket提交事件 callRtc  表示想和他聊天了
        this.sendMsg({
            types:'callRtc',
            to,
            from
        })
        
        // 这个应该是被呼叫到
        // await this.Chat.createPeerConnection(this.sendMessage)
        // 其他流
        // await this.Chat.call(this.sendMessage)

    }
    async listenCall(message) {
        console.log('接到什么信息',message)
        if(this.user === message.to) {
            const localDom  = document.querySelector('#localvideo')
            const otherDom = [document.querySelector('#remotevideo')]
            await this.Chat.init(localDom,otherDom)
            // 本地流
            await this.Chat.createPeerConnection(this,this.sendMessage)
            // 向websocket提交事件 callRtc  表示想和他聊天了
            // this.sendMsg({
            //     types:'callRtc',
            //     to,
            //     from
            // })
            console.log(`****************${message.from}和你通话`)
            // 被call事件触发的响应 表示一起视频了
            console.log('...............func listen Call')
            if(this.state == 'joined_unbind') {
                await this.Chat.createPeerConnection(this.this.sendMessage)
            }
            this.state = 'joined_conn'
            this.Chat.callRtc(this.state,this,this.sendMessage)
        }
        
    }
    async DowebRtc(data) {
        // webRtc响应 处理
        // if(data) {
        //     //媒体协商
        //     if (data.type === 'offer') {
        //         console.log('......................type   offer')
        //         await this.Chat.pc.setRemoteDescription(new RTCSessionDescription(data));
        //         const offers = await Chat.pc.createAnswer()
        //         try {
        //             await this.Chat.getAnswer(offers,this,this.sendMessage)
        //         }catch(err) {
        //             await this.Chat.handleAnswerError(err)
        //         }
        //     } else if (data.type === 'answer') {
        //         console.log('......................type   answer')
        //         console.log("reveive client message=====>", data);
        //         this.Chat.pc.setRemoteDescription(new RTCSessionDescription(data));
        //     } else if (data.type === 'candidate') {
        //         console.log('......................type   candidate')
        //         const candidate = new RTCIceCandidate({
        //             sdpMLineIndex: data.label,
        //             candidate: data.candidate
        //         });
        //         this.Chat.pc.addIceCandidate(candidate);

        //     } else {
        //         console.error('the message is invalid!', data)
        //     }
        // }
    }
    proxys(target){
        let Proxyss = new Proxy(target,()=> {
            get:(obj,key)=> {
                console.log('proxy get',obj,key)
            }
            set:(obj,key,value)=> {
                console.log('proxy set',obj,key,value)

            }
        })
        return Proxyss
    }
    initVue(obj) {
        // console.log('initVue' , obj)
        //vue data传给newVue对象
        this.newVue = obj
        console.log('initVye',this)
    }
    // 把发布订阅者模式挂在对象pubsub上
    initPubsub(pubSub) {
        // vue对象和addEvent  事件响应
        this.pubSub = pubSub
        // 需要addEvent 和Chat事件响应
        this.Chat.initPubSub(pubSub)
    }
    static init(roomid,user,options) {
        const Chat = new chat(roomid,options)
        const addEvents = new addEvent(roomid,user)
        addEvents.Chat = Chat
        // addEventObj = addEvents
        return addEvents
    }
}
export default addEvent