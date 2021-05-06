customElements.define("game-sprite", class extends HTMLElement {
	connectedCallback() {
		this.attachShadow({
			mode: "open"
		});
		let image = document.createElement("img");
		image.src = this.image;
		image.setAttribute("class", "display");
		this.shadowRoot.appendChild(image);
		this.spriteName = undefined;
		let style = document.createElement("style");
		style.innerHTML = `
		img.display {
			top: 50%;
			left: 50%;
			position: absolute;
			transform: translate(-50%, -50%);
			display: inline-block;
		}
		`
		this.shadowRoot.appendChild(style);
	}
	static get observedAttributes() {
		return ["image-url", "x-position", "y-position", "layer"];
	}
	get image() {
		return this.getAttribute("image-url");
	}
	set image(newURL) {
		this.setAttribute("image-url", newURL);
	}
	get x() {
		return this.getAttribute("x-position");
	}
	set x(newX) {
		this.setAttribute("x-position", newX);
	}
	get y() {
		return this.getAttribute("x-position");
	}
	set y(newY) {
		this.setAttribute("y-position", newY);
	}
	get layer() {
		return this.getAttribute("layer-index");
	}
	set layer(newLayer) {
		this.setAttribute("layer-index", newLayer);
	}
	attributeChangedCallback(name, oldValue, newValue) {
		let display = this.shadowRoot.querySelector("img.display");
		switch(name) {
			case "image-url":
				display.src = newValue;
				break;
			case "x-position":
				display.style.setProperty("left", "calc(50% + " + newValue + "px)");
				break;
			case "y-position":
				display.style.setProperty("top", "calc(50% + " + newValue + "px)");
				break;
			case "layer-index":
				if(newValue !== Number(newValue)) {
					throw new TypeError("layer-index is not a Number");
				}
				display.style.setProperty("z-index", String(newValue));
				break;
		}
	}
});
var game = {
	muted: false,
	get sprites() {
		let sprites = this._sprites;
		return {
			array: sprites,
			get: function(name) {
				let sprite = this.array.filter(element => element.name === name)[0];
				return sprite;
			}
		};
	},
	_sprites: new Array(0),
	sprite: function(data) {
		if(!data.name) {
			throw new TypeError("name cannot be undefined");
		}
		if(this.sprites.get(data.name)) {
			throw new Error("There is already a sprite with a name of \"" + data.name + "\"");
		}
		if(!typeof data.image === "string") {
			console.warn("image should be a String: otherwise unexpected problems may occur");
		}
		let sprite = document.createElement("game-sprite");
		sprite.image = String(data.image);
		sprite.spriteName = String(data.name);
		document.body.appendChild(sprite);
		sprite.y = data.y ?? 0;
		sprite.x = data.x ?? 0;
		sprite.layer = data.layer ?? 0;
		this._sprites.push({
			name: data.name,
			image: data.image,
			_hidden: data.hidden ?? false,
			get hidden() {
				return this._hidden;
			},
			set hidden(hidden) {
				sprite.hidden = hidden;
				this._hidden = hidden;
			},
			get layer() {
				return this._layer;
			},
			set layer(newLayer) {
				sprite.layer = newLayer;
			},
			addEventListener: sprite.addEventListener,
			removeEventListener: sprite.removeEventListener,
			_x: sprite.x,
			_y: sprite.y,
			_layer: sprite.layer,
			get x() {
				return this._x;
			},
			get y() {
				return this._y;
			},
			set x(newX) {
				this._x = newX;
				sprite.x = newX;
			},
			set y(newY) {
				this._y = newY;
				sprite.y = newY;
			}
		});
	}
};
