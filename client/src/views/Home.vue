<template>
  <div class="home streamChat" v-if="socket">
    <Header roomId="99789898989" ref="HeaderDom" />
    <div class="top">
      <videoChat ref="videoChat" :newSocket = socket  :pubSub = pubSub />
      <textChat ref="textChatDom" :newSocket= socket :pubSub = pubSub />
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
// import targets from "@/utils/targets.js";
// import io from "@/utils/io.js"
import websocket from '../utils/addeventLister'
// 观察者模式
import Subject from '../utils/observeSubject';
// 发布订阅者模式
import pubSub from'../utils/pubSub'

export default {
  name: "Home",
  components: {
    Header,
    videoChat,
    textChat,
    friendList:{}
    // HelloWorld
  },
  data() {
    return {
      socket:null,
      user:null,
      friendList:null,
      pubSub
      // ws:new WebSocket("wss://127.0.0.1:1114/roomid=12345678")
    }
  },
  methods: {
    init() {
      const socket = websocket.init(
        "123456789",
        this.user,
        {
          video: true,
          audio: true
        }
      );
      this.socket = socket
      this.socket.initPubsub(this.pubSub)
    },
  },
  mounted(){
    // console.log('Subject',Subject)
    // Subject.init()
    // console.log('.....发布订阅者模式')

    // pubSub.addEvent('shuijue',(time)=> {
    //   console.log(`睡觉:${time}`)
    // })
    // pubSub.publish('chifan','16.00')
    // pubSub.publish('shuijue','19.00')
    this.user = this.$route.query.user
    console.log(this.user,this.$route.query)
    this.init()
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
