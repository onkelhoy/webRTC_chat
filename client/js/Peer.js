class Peer {
  constructor (signalingHost, util) {
    this.socket = null
    this.peerConnection = null
    this.info = {name: 'bob', id: -1}
    this.util = util
    this.servers = {
      iceServers: [{urls: "stun:stun.l.google.com:19302"}]
    }
    this.contact = null
    this.stack = []
    this.channel
    this.onopen // when RTC is open

    this.onevent = this.onevent.bind(this)
    this.initialize = this.initialize.bind(this, [signalingHost])
  }
  // we set our name, now lets connect & initialize socket
  set name (name) {
    this.info.name = name
    this.initialize()
  }
  get name () { return this.info.name }
  // we connected to the signaling server, now we give them our name
  initialize (signalServer) {
    this.socket = new window.WebSocket(signalServer)
    this.socket.onmessage = message => {
      let data = JSON.parse(message.data)
      switch (data.type) {
        case 'connect':
          this.util.append(data.info); break;
        case 'disconnect':
          this.util.remove(data.id); break;
        case 'offer':
          this.reciveOffer(data); break;
        case 'answer':
          this.reciveAnswer(data); break;
        case 'candidate':
          this.reciveCandidate(data.candidate); break;
        case 'ack':
          this.acknowledgement(data); break;
        case 'ping': // respond to ping with ping
          this.socket.send(message.data); break;
        case 'decline':
          this.util.decline(data.name); break;

        default: // error
          this.util.error(data.message);
      }
    }
  }

  acknowledgement (data) {
    switch (data.ack) {
      case 'connection':
        this.register(data); break;
      case 'register':
        this.createPeer(data.others); break;
    }
  }
  // register
  register (data) {
    this.info.id = data.id
    this._send({ type: 'register', name: this.info.name })
  }
  // TODO: implement on server side so they wont be affected by anything but ping
  busy () {
    this._send({ type: 'busy' })
  }
  // simple wrap for sending
  _send (data) {
    this.socket.send(JSON.stringify(data))
  }

  // WebRTC stuff
  createPeer (others) {
    // ugly code
    registerResponse()

    this.util.others = others
    this.util.updateDOM()

    this.peerConnection = new RTCPeerConnection(this.servers)
    console.log('RTCPeerConnection object was created')
    this.peerConnection.onicecandidate = this.onevent
    this.peerConnection.ondatachannel = this.onevent
  }
  makeOfferTo (id) {
    this.setChannel(this.peerConnection.createDataChannel('chat'))
    this.contact = id

    this.peerConnection.createOffer()
      .then(offer => this.peerConnection.setLocalDescription(offer))
      .then(u => this._send({ type: 'offer', to: id, from: this.info, offer: this.peerConnection.localDescription }))
      .catch(this.util.error)
  }
  async reciveOffer (data) {
    let ans = this.util.confirm(data.from.name)
    if (!ans) {
      this._send({ type: 'decline', to: data.from.id, from: this.info })
      return
    }
    this.contact = data.from.id

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
    this.peerConnection.createAnswer()
      .then(answer => this.peerConnection.setLocalDescription(answer))
      .then(u => this._send({ type: 'answer', to: data.from.id, from: this.info, answer: this.peerConnection.localDescription}))
      .catch(this.util.error)
  }
  reciveAnswer (data) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
      .then(u => this.busy())
      .catch(e => this.util.error(e))
  }
  reciveCandidate (candidate) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }
  onevent (event) {
    console.log('recived event', event)
    if (event.candidate)
      this._send({ type: 'candidate', candidate: event.candidate, to: this.contact, from: this.info })
    else if (event.channel)
      this.setChannel(event.channel)
  }
  setChannel (channel) {
    this.channel = channel
    this.channel.onopen = e => {
      this.onopen()
      this.stack.reverse()
      while (this.stack.length > 0)
        this.send(this.stack.pop())
    }
  }

  send (data) {
    if (!this.channel)
      this.util.error('You have no channel')
    else if (this.channel.readyState === 'open')
      this.channel.send(data)
    else
      this.stack.push(data)
  }

  on (type, callback) {
    if (!this.channel) {
      console.log('must be initiated first')
      return
    }

    this.channel['on'+type] = callback
  }
}
