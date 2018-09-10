const signalServer = 'http://localhost:3000'
let myid = '', socket


function socketSetup () {
  socket = new Socket(signalServer)

  // register the events 
}
async function register (e) {
  let name = e.target.parentNode.querySelector('input.name').value
  if (name === '')
    return

  let before = new Date().getTime()
  e.target.classList.add('loading')
  e.target.innerHTML = '<span></span>'
  let res = await fetch(`${signalServer}/register`, {
    method: 'post',
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({ name })
  })

  let id = await res.text()
  window.onbeforeunload = closingCode
  window.sessionStorage.setItem('info', JSON.stringify({ name, id }))
  myid = id

  setTimeout(() => {
    e.target.classList.remove('loading')
    e.target.classList.add('success')

    fillSelect()
  }, 1000 - (new Date().getTime() - before))


  // document.querySelector('.chat').innerHTML = 'start conversation'
  // e.target.parentNode.parentNode.classList.add('hide')
}
async function fillSelect () {
  let res = await fetch(`${signalServer}/connections`)
  let connections = await res.json()

  let select = document.querySelector('.set_name select')
  select.innerHTML = ''
  select.onchange = connect
  for (let user of connections) {
    if (user.id !== myid) {
      let option = document.createElement('option')
      option.value = user.id
      option.innerHTML = user.name
      select.appendChild(option)
    }
  }
}

async function connect (e) {
  console.log(this.value)
}
async function closingCode () {
 // do something...
 let res = await fetch(`${signalServer}/removeme`, {
   method: 'post',
   mode: "cors", // no-cors, cors, *same-origin
   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
   headers: {
     "Content-Type": "application/json; charset=utf-8",
     // "Content-Type": "application/x-www-form-urlencoded",
   },
   body: window.sessionStorage.getItem('info')
 })
 console.log(res)
 return null
}
