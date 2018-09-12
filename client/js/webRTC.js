class WebRTC {
  constructor () {
    const servers = {
      iceServers: [{urls: "stun:stun.l.google.com:19302"}]
    }

    this.pc = new RTCPeerConnection(servers)
    this.pc.onicecandidate = WebRTC.onCandidate
  }

  static onCandidate (event) {
    console.log('host ?', event.candidate)
    socket.send(JSON.stringify({
      type: 'candidate', candidate: event.candidate,
      to: from
    }))
  }

  async getOffer () { // only host should call this
    let offer = await this.pc.createOffer()
    return await this.setLocal(offer)
  }
  async getAnswer () { // only non-host should call this
    let answer = await this.pc.createAnswer()
    return await this.setLocal(answer)
  }

  setLocal (description) {
    return this.pc.setLocalDescription(description)
      .then(u => description)
      .catch(e => null)
  }
  setRemote (description) {
    return this.pc.setRemoteDescription(description)
  }
  addCandidate (candidate) {
    console.log('one candidate', candidate)
    this.pc.addIceCandidate(candidate)
  }
}
