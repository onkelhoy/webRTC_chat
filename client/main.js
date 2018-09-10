let textarea, pc
async function init () {
  textarea = document.querySelector('textarea')
  document.querySelector('.container > button').onclick = send
  document.querySelector('.set_name button').onclick = setName

  pc = new RTCPeerConnection(null)
  let offer = await pc.createOffer()
  pc.setLocalDescription(offer)

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


function setName (e) {
  let name = e.target.parentNode.querySelector('input.name').value
  let url = e.target.parentNode.querySelector('input.url').value
  if (name === '' || url === '')
    return
  window.sessionStorage.setItem('name', name)
  document.querySelector('.chat').innerHTML = 'start conversation'
  e.target.parentNode.parentNode.classList.add('hide')
}


window.onload = init
