const signalServer = 'ws://localhost:3000'
let from = null, socket, before, to


function socketSetup () {
  socket = new WebSocket(signalServer)
  socket.onmessage = message => {
    let data = JSON.parse(message.data)
    if (data.from) to = data.from

    switch (data.type) {
      case 'register':
        registerResponse(data); break;
      case 'new client':
        appendClient(data); break;
      case 'disconnect':
        removeClient(data); break;
      case 'error':
        showError(data.message); break;
      case 'reject':
        reject(data); break;
      case 'offer':
        offer(data); break;
      case 'answer':
        answer(data); break;
    }
  }

  socket.onopen = () => {
    //let data = { type: 'register', name: 'henry' }
    // socket.send(JSON.stringify(data))
    // register the events
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

  socket.send(JSON.stringify({ type: 'register', name }))
}
function registerResponse (data) {
  window.onbeforeunload = closingCode
  from = { name: data.name, id: data.id }
  window.sessionStorage.setItem('from', JSON.stringify(from))

  let btn = document.querySelector('button.register')
  setTimeout(() => {
    btn.classList.remove('loading')
    btn.classList.add('success')

    fillSelect(data.others)
  }, 1000 - (new Date().getTime() - before))


  // document.querySelector('.chat').innerHTML = 'start conversation'
  // e.target.parentNode.parentNode.classList.add('hide')
}

// select handle
async function fillSelect (others) {
  let select = document.querySelector('.set_name select')
  if (others.length === 1) // its you
    select.querySelector('option').innerHTML = 'wait for others'

  select.onchange = connect

  for (let user of others) {
    if (user.id !== from.id)
      appendClient(user)
  }
}
function appendClient (user) {
  let select = document.querySelector('.set_name select')
  if (select.children.length > 0 && select.children[0].value == -1)
    select.children[0].innerHTML = 'chat with someone'

  let option = document.createElement('option')

  if (user.id === -1) {
    option.setAttribute('selected', true)
    option.setAttribute('disabled', 'disabled')
  }
  option.value = user.id
  option.innerHTML = user.name

  select.appendChild(option)
}
function removeClient (user) {
  let select = document.querySelector('select')

  for (let i=0; i<select.children.length; i++) {
    if (user.id === select.children[i].value)
      select.removeChild(select.children[i])
  }

  if (select.children.length === 1)
    appendClient({id: -1, name: 'wait for others'})
}

async function connect (e) {
  let id = document.querySelector('.set_name select').value
  peerConnection = new WebRTC()
  let offer = await peerConnection.getOffer() // creates offer & sets local
  if (offer === null) return alert('Could not create offer')

  to = { id, name: '' }
  socket.send(JSON.stringify({ type: 'offer', to, offer, from }))
}
async function reject (data) {
  alert(data.from.name + ' did not want to chat with you')
}
async function offer (data) {
  if (!confirm(data.from.name + ' wants to chat with you'))
    return socket.send(JSON.stringify({ type: 'reject', from, to }))

  peerConnection = new WebRTC ()
  peerConnection.setRemote(data.offer)
    .then(u => createAnswer(data))
    .catch(console.error)
}
async function createAnswer (data) {
  let answer = await peerConnection.getAnswer()
  if (answer === null) return alert('Could not create answer')
  socket.send(JSON.stringify({ type: 'answer', from, to, answer }))
}
async function answer (data) {
  peerConnection.setRemote(data.answer)
    .then(u => console.log('all done with descriptions'))
    .catch(console.error)
}

function answerRTC () {
  console.log('connected')
}



async function closingCode () {
 // do something...
 socket.send(JSON.stringify({ type: 'disconnect', id: from.id }))
 return null
}
function showError (message) {
  console.error(message)
}
