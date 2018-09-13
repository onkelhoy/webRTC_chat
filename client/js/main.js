const signalServer = 'ws://peer2peertest.herokuapp.com'
let textarea, peer, util, before
let chatBox, template
async function init () {
  textarea = document.querySelector('textarea')
  document.querySelector('.container > button').onclick = send
  document.querySelector('.set_name button.register').onclick = register
  chatBox = document.querySelector('div.container > div.chat')
  template = document.querySelector('template.message').content

  util = new Util(document.querySelector('select.list'))
  peer = new Peer(signalServer, util)
  peer.onopen = open

  util.DOMelement.onchange = function () {
    peer.makeOfferTo(Number(this.value))
  }
}
function open () {
  document.querySelector('.chat').innerHTML = 'start conversation'
  document.querySelector('.set_name').classList.add('hide')
  peer.on('message', addMessage)
}
function send (e) {
  let text = textarea.value
  textarea.value = ''
  peer.send(JSON.stringify(({name: peer.name, text})))

  write(text, 'me')
  this.focus()
}

// TODO: scroll to bottom
function addMessage (message) {
  let data = JSON.parse(message.data)
  write(data.text, data.name)
}

function write (text, name) {
  let elm = document.importNode(template.querySelector('div.message'), true)

  let d = new Date()
  let time = d.getHours() + ':' + d.getMinutes()
  if (name === 'me') {
    elm.classList.add('me')
    elm.querySelector('span').innerText = 'You ' + time
  }
  else elm.querySelector('span').innerText = name + ' ' + time
  elm.querySelector('p').innerText = text

  chatBox.appendChild(elm)
  chatBox.scrollTo(0,chatBox.scrollHeight);
}

// register handlement
function register (e) {
  e.target.onclick = null
  let name = e.target.parentNode.querySelector('input.name').value
  if (name === '')
    return

  before = new Date().getTime()
  e.target.classList.add('loading')
  e.target.innerHTML = '<span></span>'

  peer.name = name
}
function registerResponse () {
  let btn = document.querySelector('button.register')
  setTimeout(() => {
    btn.classList.remove('loading')
    btn.classList.add('success')

    util.updateDOM()
  }, 1000 - (new Date().getTime() - before))
}

window.onload = init
