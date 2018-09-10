let textarea, pc
async function init () {
  textarea = document.querySelector('textarea')
  document.querySelector('.container > button').onclick = send
  document.querySelector('.set_name button.register').onclick = register

  /*pc = new RTCPeerConnection(null)
  let offer = await pc.createOffer()
  pc.setLocalDescription(offer)*/

  socketSetup()
}
function clear () {

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
window.onload = init
