// TODO: Whis should be replaced with crypto version

export const randomString = (len: number) => {
    const chars = 'abcdefghijklmnoprstuwxyzABCDEFGHIJKLMNOPRSTUWXYZ1234567890'
    let str = ''
    while(str.length < len){
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
}
