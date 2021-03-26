class FormVaidle {
    constructor() {

    }
    proxys() {
        return new Proxy(target,{
            get(target,key) {
                return target[key]
            },
            set(target,key,value) {
                return true
            }
        })
    }
    event() {
        
    }
}
export default new FormVaidle()