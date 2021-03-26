<template>
  <div class="wrap" ref='videoChatDom'>
    <div class="Closebutton">
      <!-- <button id="connserver" ref="joinDom" @click="createWebRtc()">Connect Sig Server</button> -->
    </div>
    <div class="videoWrap">
      <div class="preview big change local">
        <video id="localvideo" autoplay playsinline ref="LocalStreamDom"></video>
      </div>
      <div class="remote small change others">
        <video id="remotevideo" class="othersVideos" autoplay playsinline ref="othersVideoDomArr"></video>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props:['newSocket','pubSub'],
  data() {
    return {}
  },
  methods:{
    createWebRtc() {
      const local = document.querySelector('#localvideo')
      const other = [document.querySelector('#remotevideo')]
      this.newSocket.openWebRtc(local,other)
    }
  },
  mounted() {
        this.$nextTick(()=> {
        console.log('newSocket', this.newSocket)

      })
  },
};
</script>
<style lang="less" scoped>
.wrap {
  flex: 1;
  position: relative;
}
.videoWrap {
  position: relative;
  height: 100%;
}
.videoWrap video {
  width: 100%;
  height: 100%;
}
.big {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.small {
  width: 30%;
  height: 30%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1000;
}
.change {
  /* background: url('https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4188221002,2861657513&fm=26&gp=0.jpg') no-repeat center;
    background-size: 100% 100%; */
}
.hide {
  display: none;
}
.Closebutton {
  position: absolute;
  width: 120px;
  height: 60px;
  border-radius: 3px;
  z-index: 10000;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 10%;
}
.Closebutton button {
  width: 100%;
  height: 100%;
}
</style>
