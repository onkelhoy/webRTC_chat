class Socket {
  constructor (url, protocols = []) {
    this.apikey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    this.socket = new window.WebSocket(url, protocols)
  }

  on (event, callback) {
    this.socket.addEventListener(event, callback)
  }
  remove (event, method) {
    this.socket.removeEventListener(event, method)
  }
  message (callback) {
    this.msgCB = callback
  }
  send (e) {
    let channel = e.channel || ''
    let id = e.id || ''
    let data = e.message || e

    let sendData = {
      type: 'message',
      username: window.sessionStorage.username, // maybe change so processor wont be loaded until logged in
      key: this.apikey,
      channel,
      data,
      id
    }
    this.socket.send(JSON.stringify(sendData))
  }
  close () {
    this.socket.close()
  }
}
