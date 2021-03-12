<template>
  <div class="right">
    <div class="rightTop">
      <div class="title">聊天室成员</div>
      <ul class="friendList" ref="friendList">
        <!-- <li class="friendItem">
          <div class="FriendLeft">
            <img
              src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2980896150,1513192047&fm=26&gp=0.jpg"
              alt=""
            />
          </div>
          <div class="friendCenter">
            <div class="friendName">
              <span>吴彦祖</span>
            </div>
          </div>
          <div class="FriendRight">
            <div class="mediaWrap">
              <div class="videoIcon"></div>
              <div class="audioIcon"></div>
            </div>
          </div>
        </li> -->
      </ul>
    </div>

    <div class="message rightBottom">
      <ul class="textMsgList" ref="textMsgList">
        <!-- <li class="chatMy chatItem">
                            <div class="TextLeft">
                                <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2980896150,1513192047&fm=26&gp=0.jpg" alt="">
                            </div>
                            <div class="TextRight">
                                <span>我eqeq</span>
                            </div>
                        </li>
                        <li class="chatOthers chatItem">
                            <div class="TextLeft">
                                <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2980896150,1513192047&fm=26&gp=0.jpg" alt="">
                            </div>
                            <div class="TextRight">
                                <span>别人</span>
                            </div>
                        </li> -->
      </ul>
      <div class="textMsgInput">
        <input type="text" class="inputs" placeholder="消息" ref="textMsgDom"/>
        <button class="sendMsg" ref="subMitDom">发送</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>

/* 右边广告和聊天的样式 */
  .right {
    width: 300px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
/* 广告位置 */
  .right .rightTop {
    flex: 1;
    display: flex;
    flex-direction:column;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
}
  .right .rightTop .title {
    height: 60px;
    line-height: 60px;
    color:#959595;
    text-indent: 1em;
}
  .right .rightTop .friendList {
    background: #ccc;
} 
.friendList {
    flex: 1;
}
.friendList .friendItem {
    box-sizing: border-box;
    padding: 4px;
    margin-bottom: 3px;
    display: flex;
    flex-direction: row;
}
.friendItem .FriendLeft {
    width:35px;
    height: 35px;
    display: flex;
    /* flex-direction: column; */
    align-self: center;
}
.friendItem .FriendLeft img {
    width: 100%;
}
.friendItem .friendCenter{
    flex: 1;
    align-self: center;
}
.friendItem .friendCenter .friendName {
    padding-left: 8px;
}

.friendItem .FriendRight {
    width: 80px;
    padding-left: 3px;
    box-sizing: border-box;
    color: #000;
    font-size: 12px;
    height: 35px;
    align-self: center;

}
.mediaWrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.friendItem .FriendRight .videoIcon {
    width: 30px;
    height: 30px;
    background: url('../assets/shipintonghua.png') no-repeat center;
    background-size:100% 100%;
}
.friendItem .FriendRight .audioIcon {
    width: 30px;
    height: 30px;
    background: url('../assets/yuyindianhua.png') no-repeat center;
    background-size:100% 100%;
}
/* 聊天内容区域 */
  .right .rightBottom {
    display: flex;
    flex-direction: column;
    height: 350px;
}
.textMsgList {
    flex: 1;
    overflow: scroll;
}
.textMsgList li {
    display: flex;
    flex-direction: row;
}
.chatItem {
    box-sizing: border-box;
    padding: 4px;
    margin-bottom: 3px;
}
.chatItem  .TextLeft {
    width:35px;
    height: 35px;
    display: flex;
    /* flex-direction: column; */
    align-self: center;

}
.chatItem  .TextLeft img {
    width: 100%;
}
.chatItem .TextRight {
    flex: 1;
    padding-left: 3px;
    box-sizing: border-box;
    color: #000;
    font-size: 12px;
    align-self: center;
}
.chatMy .TextRight{
   order: -1;
   padding-right: 3px;
   text-align: right;
}
.textMsgInput {
    height: 40px;
    display: flex;
    flex-direction: row;
}
.textMsgInput input {
    flex: 1;
    border: 1px solid #ccc;
    color: #555;
    box-sizing: border-box;
    border-radius: 5px;
    text-indent: 1em;

}
.textMsgInput button {
    width: 70px;
    outline: none;
    box-sizing: border-box;
    border: none;
    color: #fff;
    background-color:#4cae4c;
}

</style>
