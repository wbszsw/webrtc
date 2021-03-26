class User{
    constructor(user) {
        console.log('user',user)
        this.user = user
    }
    static init(user) {
        return new User(user)
    }
}
// export default  User
module.exports = User