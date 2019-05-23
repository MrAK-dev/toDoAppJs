const template =  document.getElementById('do')
class ToDo extends HTMLElement {
    constructor(){
        super()
        this.shadow = this.attachShadow({mode : 'open'})
        this.shadow.appendChild( template.content.cloneNode(true) )
        this.addContent()
		this.card = this.shadow.querySelector('.content-todo')
        this.currentDate = this.shadow.querySelector('.current-date')
        this.btnAdd = this.shadow.querySelector('.add-to-do')
        this.btnAdd.onclick = this.addToDoElem.bind(this)
        this.btnSave = this.shadow.querySelector('.save')
        this.btnSave.onclick = this.saveCards.bind(this)
        this.btnExit = this.shadow.querySelector('.exit')
        this.btnExit.onclick = this.exit.bind(this)
        this.input = this.shadow.querySelector('input[name=add-todo]')
        this.list = this.shadow.querySelector('#list')
        this.currentDate.textContent = `${new Date()
			.toLocaleDateString("en-US",{weekday : "long", month:"short", day:"numeric"})}`
		this.omg = this.shadow.querySelector('todo-elem')
    }
    addToDoElem(){
        this.card.appendChild(
            document.createElement("todo-elem")
        )
    }
    getCookies () {
		let res = document.cookie
			.split ( "; " )
			.map (
				x => {
					let tmp = x.split ( "=" )
					let elem = {}
					elem [ tmp [0] ] = tmp [1]
					return elem
				}
			)
		return Object.assign ( {}, ...res )
    }
    async saveCards () {
		let cookie = this.getCookies()
		let users = await fetch ("http://localhost:3000/users")
			.then (response => response.json())
		let user = users.find(
			user => {
				return  user.email === cookie.email
			}
		)
		let data = await fetch (`http://localhost:3000/data/${user.id}`)
			.then(response => response.json())
		for (let item of this.card.querySelectorAll("todo-elem")) {
			console.log(item.card.content)
			data.content.push(item.card.content)
			
		}
		fetch (`http://localhost:3000/data/${user.id}`, {
			method: "PATCH",
			body: JSON.stringify({
				content: data.content
			}),
			headers: {
				"Content-Type": "application/json"
			}
		})
		document.location.reload()
    }
    exit(){
        document.cookie = "email=; expires=" + 
            new Date ( 0 ).toUTCString ()
            this.remove()
		document.body.appendChild(
            document.createElement("auth-element")
        )
    }
    async addContent () {
        let cookie = this.getCookies()
		let users = await fetch ("http://localhost:3000/users")
			.then (response => response.json())
		let user = users.find(
			user => {
                return user.email === cookie.email
            }
		)
		let userData = await fetch (`http://localhost:3000/data/${user.id}`)
            .then (response => response.json())
		 		if (userData === []) return
		 		for (let item of userData.content){
		 			let lItem = this.list.appendChild(
						 document.createElement("li")
					 )
					lItem.className= 'item'
					lItem.id = item.id
					this.trash = document.createElement('div')
					this.trash.className = 'fa-trash-o'
					this.trash.onclick = function(event){
						event.target.parentElement.remove()
						userData.content.map((elem, index) => {
							if(elem.id == lItem.id) {
								userData.content.splice(index, 1)
								fetch(`http://localhost:3000/data/${user.id}`,{
												method: "PUT",		
												headers: {
													"Content-Type": "application/json"
												},
												body: JSON.stringify({
													content: userData.content
												})
											})
							}
						})
						
					}
					for (let event of item.events) {
						lItem.innerText = event
						lItem.appendChild(this.trash)
						
				
					}
                 }
         }
}
customElements.define( 'todo-list', ToDo)