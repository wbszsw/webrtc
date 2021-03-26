// title：通知的标题
// options：通知的设置选项（可选）。
// body：通知的内容。
// tag：代表通知的一个识别标签，相同tag时只会打开同一个通知窗口。
// icon：要在通知中显示的图标的URL。
// image：要在通知中显示的图像的URL。
// data：想要和通知关联的任务类型的数据。
// requireInteraction：通知保持有效不自动关闭，默认为false。


class Notifications {
    constructor() {
        this.getPromise()
    }
    getPromise() {
        window.Notification.requestPermission? window.Notification.requestPermission().then(function (permission) { console.log('permiss', permission) }):''
       
    }
    showMessage(obj) {
        const that = this
        this.message = new Notification(obj.title, {
            body: obj.body,
            tag: obj.tag,
            requireInteraction:true
        })
    }
    closeMeassage() {
        this.message.close()
    }
}
export default Notifications