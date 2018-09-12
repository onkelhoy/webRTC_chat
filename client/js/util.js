class util {
  constructor (listElement) {
    this.list = listElement
    this.others = []
  }
  append (client_info) {
    this.others.push(client_info)
    this.util.append(this.others)
  }
  remove (id) {
    for (let i=0; i<this.others.length; i++) {
      if (this.others[i].id === id) {
        this.others.splice(i, 1)
        return this.util.remove(this.others)
      }
    }
  }
  decline (name) {
    alert(name + ' decilned your offer')
  }
  error (message) {
    console.error(message)
    alert('something went wrong')
  }
}
