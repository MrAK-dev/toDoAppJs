const tempAuth = document.getElementById('authorisation')

class Authorisation extends HTMLElement{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode : 'open'})
        this.shadow.appendChild( tempAuth.content.cloneNode(true) )
        this.shadow.querySelector('.flipper-reg').addEventListener('click', function(event){
             this.shadow.querySelector('.flip').className = "flip flipped"
             this.refreshForm()
         }.bind(this))
         this.shadow.querySelector('.flipper-log').addEventListener('click', function(event){
            this.shadow.querySelector('.flip').className = "flip"
            this.refreshForm()
        }.bind(this))

        this.userName = this.shadow.querySelector("form.reg input[name=username]")
        this.emailReg = this.shadow.querySelector("form.reg input[name=email]")
        this.passwordReg = this.shadow.querySelector("form.reg input[name=password]")
        this.buttonReg = this.shadow.querySelector(".sign-up")
        this.emailAuth = this.shadow.querySelector("form.auth input[name=email]")
        this.passwordAuth = this.shadow.querySelector("form.auth input[name=password]")
        this.buttonAuth = this.shadow.querySelector(".sign-in")
        this.msg = this.shadow.querySelector(".login-msg")
        this.msgAuth = this.shadow.querySelector(".auth-msg")
        this.buttonReg.onclick = this.sendData.bind(this)
        this.buttonAuth.onclick = this.logIn.bind(this)
    }
    refreshForm () {
        let inputs = [
            this.userName,
            this.passwordReg,
            this.emailReg,
            this.emailAuth,
            this.passwordAuth
        ]
        inputs.forEach (input => {
            input.value = ""
            input.style.border = "1px solid #ccc"
            this.msg.innerText = ""
            this.msgAuth.innerText = ""
        })
    }
    validateEmail (email) {
        let regExp =  /\S+@\S+\.\S+/
        return regExp.test(email)
    }
    wrongMail () {
        this.msg.innerText = "Неккоректный e-mail"
        this.emailReg.style.border = "1px solid red"
    }
    checkEmail () {
        if (!this.validateEmail (this.email.value)){
            this.wrongMail ()
            return false
       }
    }
    checkAuthInputs(){
        let inputs = [
            this.emailAuth,
            this.passwordAuth
        ]
        let counter = 0
        inputs.forEach(input => {
            input.style.border = "1px solid #ccc"
            !input.value ? input.style.border = "1px solid red" :
                                    ++counter
        })
        return counter
    }
    checkInputs () {
        let inputs = [
           this.userName,
           this.passwordReg,
           this.emailReg
        ]
       let counter = 0
       inputs.forEach (input => {
            input.style.border = "1px solid #ccc"
           !input.value ? input.style.border = "1px solid red" :
                                   ++counter
       })
       return counter
   }
   
   async sendData (event) {
        if(this.checkInputs() === 1 || this.checkInputs() === 2 ||  this.checkInputs() === 0) {
            this.msg.innerText = "Заполните все поля"
            return
        }
        let users = await fetch('http://localhost:3000/users')
                .then(response => response.json())
        let userkey = Sha256.hash ( this.passwordReg.value + this.emailReg.value)
        let user = users.some (user => user.key === userkey)
        if (user) {
            this.msg.innerText = "Пользователь зарегистрирован"
            return
        }
        fetch ('http://localhost:3000/users',
        {
            method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    name: this.userName.value,
                    email: this.emailReg.value,
                    key : userkey,
                })
            }).then (response => {
				fetch ("http://localhost:3000/data", {
					method: "POST",
					body: JSON.stringify({
						key: userkey,
						content: []
					}),
					headers: {
						"Content-Type": "application/json"
					}
                })
            })
        
        this.refreshForm ()
        this.msg.style.color = "green"
        this.msg.innerText = "Вы успешно зарегистрировались"
    }
    async logIn () {
        if(!this.checkAuthInputs())
        {
            this.msgAuth.innerText = "Заполните все поля"
            return
        }
        let user_Key = Sha256.hash(this.passwordAuth.value + this.emailAuth.value)
        let users = await fetch('http://localhost:3000/users')
                   .then(response => response.json())
        let user = users.find(user => user.key === user_Key)
        if (user) {
            this.remove()
            console.log('Step 1 done! :D')
            document.body.appendChild(document.createElement('todo-list'))
            document.cookie = `email=${user.email}`
            document.location.reload()
        } else this.msgAuth.innerText = "Зарегистрируйтесь"
    }
}
customElements.define('auth-element',Authorisation)