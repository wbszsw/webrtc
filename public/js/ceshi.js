class Lesston {
    constructor(data) {
        this.model = data
    }
    static createBrtch(arr) {
        return arr.map(item => {
            return new Lesston(item)
        })
    }
    get jiage() {
        // console.log('jiage',this.model.jiage)
        return this.model.jiage
    }
    static pricePaixu(arr) {
        let paixu = arr.sort((a,b)=> Number(b.jiage) - Number(a.jiage))
       return paixu[0].jiage
    }
    static zongjia(arr) {
        return arr.reduce((first,now)=> {
            console.log('e32',first.jiage,now.jiage)
            return Number(first) + Number(now.jiage)
        },0)
    }

}