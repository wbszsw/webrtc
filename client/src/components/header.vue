<template>
  <!-- <div class="hello"> -->
    <header>
        <div class="headerLeft">
            <div class="RoomId">
                <span>房间号：</span><span>{{roomId}}</span>
            </div>
        </div>
        <div class="headeCenter"></div>
        <div class="headeRight">
            <button id="leave" ref="leaveDom">离开此房间</button>
        </div>
    </header>
  <!-- </div> -->
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  @Prop() private roomId!: string;
  mounted() {
      console.log('guazai:',this.roomId)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
header {
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background:#000;
}
.headerLeft .RoomId {
    line-height: 60px;
    color: #fff;
}
.headeRight {
    display: flex;
    flex-direction: row;
}
.headeRight #leave{
    width: 100px;
    outline: none;
    box-sizing: border-box;
    border: none;
    color: #fff;
    background-color: #ae4c69;
    height: 40px;
    align-self: center;
}
</style>
