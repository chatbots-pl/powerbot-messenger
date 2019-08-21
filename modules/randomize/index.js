function string(len) {
    const chars = 'abcdefghijklmnoprstuwxyzABCDEFGHIJKLMNOPRSTUWXYZ1234567890'
    let str = ''
    while(str.length < len){
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
}

module.exports = {
    string
}
