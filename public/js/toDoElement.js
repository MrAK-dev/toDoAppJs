class ToDoElement extends HTMLElement {
	constructor () {
        super()
            this.card = this.createElem('ul')
            this.card.id = 'list'
            this.shadow = this.attachShadow({mode: "open"})
		    this.shadow.appendChild( this.card )
		    let style = this.shadow.appendChild(
			    document.createElement("style")
		    )
            style.textContent =`
            @font-face {
                font-family: 'FontAwesome';
                src: url('../fonts/fontawesome-webfont.eot?v=4.7.0');
                src: url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');
                font-weight: normal;
                font-style: normal;
            }
            #list{
                padding:0;
                margin:0;
            }
            .fa-trash-o{
                width: 20px;
                height: 20px;
                position: absolute;
                top: 5px;
                right: 0px;
                width: 20px;
                height: 20px;
                background-image: url('img/korzina1.png');
                background-size: contain;
            }
            .fa-trash-o:hover{
                cursor: pointer;
                background-image: url('img/korzina.png');
                background-size: contain;
            }
            .item{
                position: relative;
                width:300px;
                height: 45px;
                min-height: 45px;
                position: relative;
                border-bottom: 1px solid rgba(0,0,0,0.1);
                list-style: none;
                padding: 0;
                margin-left: 40px;
            }
            .fa-check-circle{
                color:#6eb200;
            }
            .item p.text{
                position: absolute;
                padding:0;
                margin:0;
                font-size: 20px;
                left:50px;
                top:5px;
                background-color: #FFF;
                max-width:285px;
            }
            #list input{
                outline: none;
                height: 25px;
                width: 250px;
                background-color: transparent;
                border: 1px solid gray;
                border-radius: 15px 15px 15px 15px;
                padding-left: 5px;
            }
          
            `
        this.card.content = {
            id: [],
            events: []
        }
        this.list = this.createElem("li", this.card)
        this.list.className = 'item'
        this.trash = this.createElem('div',this.list)
        this.trash.className = 'fa-trash-o'
        this.trash.onclick = function(event){
            event.target.parentElement.remove()
        }
        
        
        this.input = this.createElem("input", this.list)
		this.input.placeholder = "Add a to do"
		this.input.onchange = (event) => {
			if (
				this.card.content.events.includes(event.target.value) ||
				event.target.value === ""
			) return
            this.list.innerText = event.target.value
            this.list.appendChild(this.trash)
            this.card.content.id.push(Math.random().toString().substr(2,5))
            this.card.content.events.push(event.target.value)
            this.input.remove()
        }
    }
    createElem ( tagName, container ) {
		return  ( !container ? document.body : container )
			.appendChild (
				document.createElement ( tagName )
			)
	}
}
customElements.define( 'todo-elem', ToDoElement)