class CurrencyConverter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
		<div id="currency-converter">
        <div class="inputs" part="inputs">
          <label for="inputVal" part="label">Input Value</label>
          <input type="number" name="inputVal" id="input-val" placeholder="Input value" part="input-val">

          <label for="inputCurrency" part="label">Input Currency</label>
          <select name="inputCurrency" id="input-currency">
            <option value="" disabled selected>From...</option>
          </select>
        </div>

        <div class="outputs" part="outputs">
          <label for="outputVal" part="label">Output Value</label>
          <input type="number" name="outputVal" id="output-val" part="output-val" disabled>

          <label for="outputCurrency" part="label">Output Currency</label>
          <select name="outputCurrency" id="output-currency">
          <option value="" disabled selected>To...</option>
          </select>
        </div>

        <button id="convert-button" part="convert-button">Convert</button>
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
    const currencies = ['USD', 'CAD', 'GBP', 'EUR', 'JPY', 'AUD', 'CHF', 'CNY']
    for (const currency of currencies) {
      const option = document.createElement('option');
      option.value = currency;
      option.innerHTML = currency;
      this.inputCurrency.appendChild(option.cloneNode(true));
      this.outputCurrency.appendChild(option.cloneNode(true));
    }

		this.inputVal.value = this.getAttribute("default-input-val");
    this.inputCurrency.value = this.getAttribute("default-input-currency");
    this.outputCurrency.value = this.getAttribute("default-output-currency");

    const apiKey = '46abbabccf1a90d432c5';
    const apiURL = 'https://free.currconv.com/api/v7/convert?compact=ultra&apiKey=' + apiKey;
    this.convertButton.addEventListener("click", async (evt) => {
      const query = this.inputCurrency.value + '_' + this.outputCurrency.value;
      const data = await fetch(apiURL + '&q=' + query).then((response) => response.json());
      const conversionRate = data[query];

      const converted = this.inputVal.value * conversionRate;
      this.outputVal.value = converted.toFixed(2);
    })
	}
}

customElements.define('currency-converter', CurrencyConverter);