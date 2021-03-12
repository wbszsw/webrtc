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
    constructor(videoDom, OtherVideoArr) {
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
        this.pc = null
    }
    get localStream() {
        return this._localStream
    }
    set localStream(stream) {
        console.log('set local', stream)
        this._localStream = stream
    }
    get localOptions() {
        return this._localOptions
    }
    set localOptions(options) {
        this._localOptions = options
    }
    get otherOptions() {
        return this._othersOptions
    }
    set otherOptions(options) {
        this._othersOptions = options
    }
    async init() {
        const that = this
        console.log('****************init', that)
        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia is not supported!")
            return;
        } else {
            //1 ===============配置音视频参数===============
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
        console.log('getMediaStream',this.localStream)
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
        console.log('.....createPeerConnection')
        const that = this
        if (!that.pc) {
            console.log('this.pc',this.pc, this.pcConfig)
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
            console.log('this.pc',this.pc)
            console.log('检查dom结构',this.OtherVideoArr[0])
            console.log('this.localStream',this.localStream)
            this.pc.ontrack = (e) => {
                console.log('检查数据通道',e.streams[0])
                this.OtherVideoArr[0].srcObject = e.streams[0]
            }
        }
        if (this.pc === null || this.pc === undefined) {
            console.error('chat this.pc is null or undefined!');
            return;
        }
        console.log('看看这个this local', this )
        console.log('看看这个this local', this.localStream )
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
        console.log('close RTCPeerConnection!');
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
        console.log('getOffer desc',desc)
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
        console.log('...func call',this)
        if (that.state === 'joined_conn') {
            console.log('state type')
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
        console.log('看看这个this', this)
        console.log('getAnsWer', this.pc)
        await this.pc.setLocalDescription(desc);
        await this.sendMessage(this.roomid, desc);
    }

}
export default LocalMedia