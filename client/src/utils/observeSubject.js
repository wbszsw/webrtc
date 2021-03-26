// 感觉后端可以用来搞房间实时人数
// 观察者模式  监听数据
// 观察者
class Observe {
    constructor(name){
        console.log('name',name)
        this.name = name
    }
    update() {
        console.log(`目标通知我更新了,我是${this.name}`)
    }
}
const arr = ['前端','后段']
// 目标
class Subject {
    constructor() {
        this.Observe = []
    }
    addObserve(name) {
        this.Observe.push(name)
    }
    deleteObserve(name) {
        const idx = this.Observe.findIndex((item)=>{item == name})
        idx>-1&&this.Observe.splice(inx,1)
    }
    nofity() {
        this.Observe.forEach(item => {
            item.update()
        });
    }
    static init() {
        const subject = new Subject()
        arr.forEach((item)=> {
            
            subject.addObserve(new Observe(item))
        })
        subject.nofity()
        // return
    }
}
export default Subject