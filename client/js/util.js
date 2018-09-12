class Util {
  constructor (DOMelement) {
    this.DOMelement = DOMelement
    this.others = []
  }
  append (client_info) {
    console.log('append', client_info)
    this.others.push(client_info)
    // add to DOMelement
    this.updateDOM()
  }
  remove (id) {
    console.log('remove', id)
    for (let i=0; i<this.others.length; i++) {
      if (this.others[i].id === id) {
        this.others.splice(i, 1)
        // remove from DOMelement
      }
    }

    this.updateDOM()
  }
  updateDOM () {
    this.DOMelement.innerHTML = ''
    if (this.others.length === 0)
      this.createOption(-1, 'wait for someone')
    else
      this.createOption(-1, 'chat with someone')
    for (let client of this.others) {
      this.createOption(client.id, client.name)
    }
  }
  createOption (value, text) {
    let option = document.createElement('option')

    if (value === -1) {
      option.setAttribute('selected', true)
      option.setAttribute('disabled', 'disabled')
    }
    option.value = value
    option.innerHTML = text
    this.DOMelement.appendChild(option)
  }
  confirm (name) {
    return confirm(name + ' wants to chat with you')
  }
  decline (name) {
    alert(name + ' decilned your offer')
  }
  error (message) {
    console.error(message)
    alert('something went wrong')
  }
}
