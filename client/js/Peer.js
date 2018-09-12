class Peer {
  constructor (signalingHost, util) {
    this.socket = null
    this.peerConnection = null
    this.name = 'bob'
    this.util = util
    this.servers = {
      iceServers: [{urls: "stun:stun.l.google.com:19302"}]
    }

    this.initialize = this.initialize.bind(this, [signalingHost])
  }
  // we set our name, now lets connect & initialize socket
  set Name (name) {
    this.name = name
    this.initialize()
  }
  // we connected to the signaling server, now we give them our name
  initialize (signalServer) {
    this.socket = new window.WebSocket(signalServer)
    this.socket.onmessage = message => {
      let data = JSON.parse(message.data)
      console.log(message, data)
      switch (data.type) {
        case 'connect':
          this.append(data.info); break;
        case 'disconnect':
          this.remove(data.id); break;
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
    }
  }
  makeOfferTo (id) {
    this.peerConnection = new
  }
  makeAnswerTo (id) {

  }
  reciveOffer (data) {

  }
  reciveAnswer (data) {

  }
  reciveCandidate (candidate) {

  }
  register (data) {
    this.id = data.id
    this.socket.send(JSON.stringify({ type: 'register', name: this.name }))
  }
}
