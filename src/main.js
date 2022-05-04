class CurrencyConverter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
		<div id="currency-converter">
        <label for="inputVal">Input Value</label>
        <input type="number" name="inputVal" id="input-val">

        <label for="inputCurrency">Input Currency</label>
        <select name="inputCurrency" id="input-currency">
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="EUR">EUR</option>
        </select>

        <label for="outputVal">Output Value</label>
        <input type="number" name="outputVal" id="output-val" disabled>

        <label for="outputCurrency">Output Currency</label>
        <select name="outputCurrency" id="output-currency">
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="EUR">EUR</option>
        </select>

        <button id="convert-button">Convert</button>
    </div>
		`;
    this.inputVal = this.shadowRoot.querySelector("#input-val");
    this.outputVal = this.shadowRoot.querySelector("#output-val");
    this.inputCurrency = this.shadowRoot.querySelector("#input-currency");
    this.outputCurrency = this.shadowRoot.querySelector("#output-currency");
    this.convertButton = this.shadowRoot.querySelector("#convert-button");
	}

  connectedCallback() {
		this.#render();
	}

  #render () {
		this.inputVal.value = 5;
    const apiKey = '46abbabccf1a90d432c5';
    const apiURL = 'https://free.currconv.com/api/v7/convert?compact=ultra&apiKey=' + apiKey;
    this.convertButton.addEventListener("click", async (evt) => {
      const query = this.inputCurrency.value + '_' + this.outputCurrency.value;
      const data = await fetch(apiURL + '&q=' + query).then((response) => response.json());
      const conversionRate = data[query];

      const converted = this.inputVal.value * conversionRate;
      this.outputVal.value = converted;
    })
	}
}

customElements.define('currency-converter', CurrencyConverter);