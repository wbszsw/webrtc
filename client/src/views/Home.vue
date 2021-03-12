<template>
  <div class="home streamChat">
    <Header roomId="99789898989" ref="HeaderDom" />
    <div class="top">
      <videoChat ref="videoChat" />
      <textChat ref="textChatDom" />
    </div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Header from "@/components/header.vue";
import videoChat from "@/components/videoChat.vue";
import textChat from "@/components/textChat.vue";
import targets from "@/utils/targets.js";
import io from "@/utils/io.js"
export default {
  name: "Home",
  components: {
    Header,
    videoChat,
    textChat,
    // HelloWorld
  },
  methods: {
    init() {
      const textMsgDom = this.$refs.textChatDom.$refs.textMsgDom
      const subMitDom = this.$refs.textChatDom.$refs.subMitDom
      const LocalStreamDom = this.$refs.videoChat.$refs.LocalStreamDom
      const othersVideoDomArr = [this.$refs.videoChat.$refs.othersVideoDomArr]
      const leaveDom = this.$refs.HeaderDom.$refs.leaveDom
      const joinDom = this.$refs.videoChat.$refs.joinDom
      // 文字消息 列表
      const textMsgList = this.$refs.textChatDom.$refs.textMsgList
      // 朋友列表
      const friendList = this.$refs.textChatDom.$refs.friendList
      // console.log(textMsgDom,
      //   subMitDom,
      //   LocalStreamDom,
      //   othersVideoDomArr,
      //   leaveDom,
      //   joinDom,
      //   textMsgList,
      //   friendList)
      // const io = {
      //   connect() {

      //   }
      // }
      const targetObj = targets.init(
        "123456789",
        textMsgDom,
        subMitDom,
        LocalStreamDom,
        othersVideoDomArr,
        leaveDom,
        joinDom,
        textMsgList,
        friendList,
        io
      );
      targetObj.join({
        video:false,
        audio:true
      },io);
    },
  },
  mounted() {
    // this.init()
    // console.log("ref", this.$refs.videoChat1.$refs.videoChatDom);
  },
};
</script>
<style lang="less" scoped>
.home {
  // display: flex;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}
.top {
  flex: 1;
  display: flex;
  flex-direction: row;
}
</style>
