class CurrencyConverter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `
		<div id="currency-converter">hello</div>
		`;
	}
}
customElements.define('currency-converter', CurrencyConverter);