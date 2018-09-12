const signalServer = 'ws://localhost:3000'
let textarea, peer, util, before
async function init () {
  textarea = document.querySelector('textarea')
  document.querySelector('.container > button').onclick = send
  document.querySelector('.set_name button.register').onclick = register

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
}
function send (e) {
  let text = textarea.value
  textarea.value = ''
  console.log(text)

  this.focus()
}

// TODO: scroll to bottom
function addMessage (name, text) {
  if (name === window.sessionStorage.getItem('name')) {

  }
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

  peer.Name = name
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
