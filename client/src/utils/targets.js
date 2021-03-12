import Chat from './Chat'
class Targets {
    constructor(roomid, textMsgDom, submitDom, LocalStreamDom, otherStreamArr, leaveDom, joinDom, TextMsgListDom, friendListDom,io) {
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
        this.io = io
        // 其他的otherStream集合  是个数组类型（防止以后改成多个）
        // this.otherPeople = [...otherStreamArr].map((item) => {
        //     return Chat.joinRoom(otherStreamArr)
        // })
    }

    submitText() {
        if (!this.My) {
            this.join()
        }
        return this.My.textMsg(this.textMsgDom.value)
    }
    async join(options={}) {
        this.My = await Chat.joinRoom(this.roomid, this.io, this.textMsgDom.value, this.LocalStreamDom, this.otherStreamArr, this.TextMsgListDom,this.friendListDom,options)
        return this.My
    }
    leave() {
        return this.My.leave()
    }
    changeLcoalStreamOption(options={}) {
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
        // const that = this
        if(dom === this.friendListDom) {
            const friendArr = [...dom.querySelectorAll('li')]
            friendArr.map((item => {
                const friendAudio = item.querySelector('.audioIcon')
                const friendVudio = item.querySelector('.videoIcon')
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
            // console.log('dom',dom)
            dom.addEventListener('click', () => {
                if (dom === this.submitDom) {
                    this.submitText().then(() => this.textMsgDom.value = '')
                } else if (dom === this.leaveDom) {
                    this.leave()
                } else if (dom === this.joinDom) {
                    this.join()
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
    static init(roomid, textMsgDom, submitDom, LocalStreamDom, otherStreamArr, leaveDom, joinDom,TextMstListDom,friendListDom,io) {
        const targetObgs = new Targets(roomid, textMsgDom, submitDom, LocalStreamDom, otherStreamArr, leaveDom, joinDom,TextMstListDom,friendListDom,io)
        targetObgs.action()
        return targetObgs
    }
}
export default Targets
// const textMsgDom = document.getElementsByClassName('inputs')[0]
// const subMitDom = document.getElementsByClassName('sendMsg')[0]
// const LocalStreamDom = document.getElementById('localvideo')
// const othersVideoDomArr = document.getElementsByClassName('othersVideos')
// const leaveDom = document.getElementById('leave')
// const joinDom = document.getElementById('connserver')

// // 文字消息 列表
// const  textMsgList = document.getElementsByClassName('textMsgList')[0]
// // 朋友列表
// const friendList = document.getElementsByClassName('friendList')[0]
// const targetObj = targets.init('123456789', textMsgDom, subMitDom, LocalStreamDom, othersVideoDomArr, leaveDom, joinDom, textMsgList, friendList)
// targetObj.join()