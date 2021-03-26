// //  发布订阅者模式
// class PubSub {
//     constructor() {
//         this.PubSubList = {}
//     }
//     // 订阅
//     addEvent(key,fn) {
//         if(!this.PubSubList[key]) {
//             this.PubSubList[key] = []
//         }
//         this.PubSubList[key].push(fn)

//     }  
//     // 发布
//     publish(key,...arg) {
//         for(let fn of this.PubSubList[key]) {
//             console.log('111', this.PubSubList[key])
//             fn.call(this,...arg)
//         }
//     } 
//     // 移除订阅
// }
// export default  new PubSub()


class PubSub {
    constructor() {
        this.clientList = {}
    }
    addEvent(key,fn) {
        if(!this.clientList[key]){
            this.clientList[key]=[];
        }
        this.clientList[key].push(fn);
    }
    publish() {
        
        let key = Array.prototype.shift.call(arguments),
            fns = this.clientList[key];
            // console.log('argu',arguments)
            // console.log('key',key)
            // console.log('fns',fns)
            if(!fns || fns.length===0){
                return false;
            }

            for (var i =0,fn;fn=fns[i++];){
                fn.apply(this,arguments);
            }
        }
}


export default  new PubSub()
