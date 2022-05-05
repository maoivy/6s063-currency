class CurrencyConverter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
		<div id="currency-converter">
        <div part="inputs">
          <div part="group">
            <label for="inputVal" part="label">Input Value</label>
            <input type="number" name="inputVal" id="input-val" placeholder="Input value" part="input-val">
          </div>

          <div part="group">
            <label for="inputCurrency" part="label">Input Currency</label>
            <select name="inputCurrency" id="input-currency">
              <option value="" disabled selected>From...</option>
            </select>
          </div>
        </div>

        <div part="outputs">
          <div part="group">
            <label for="outputVal" part="label">Output Value</label>
            <div id="output-val" part="output-val"></div>
          </div>

          <div part="group">
            <label for="outputCurrency" part="label">Output Currency</label>
            <select name="outputCurrency" id="output-currency">
            <option value="" disabled selected>To...</option>
            </select>
          </div>
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

  #expanded = false;

  get init() { return this.#expanded; }
	set init(v) { this.#expanded = v; this.setAttribute("expanded", v); }

	static get observedAttributes() { return ["expanded"] }

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "expanded") this.#expanded = newValue;
    this.#render();
	}

  connectedCallback() {
		this.#render();
	}

  async #render () {
    const apiKey = '46abbabccf1a90d432c5';
    const currenciesURL = 'https://free.currconv.com/api/v7/currencies?apiKey=' + apiKey;

    let currencies = ['USD', 'CAD', 'GBP', 'EUR', 'JPY', 'AUD', 'CHF', 'CNY']
    if (this.#expanded) {
      const response = await fetch(currenciesURL).then((response => response.json()));
      currencies = Object.keys(response.results);
    } 
    for (const currency of currencies) {
      const option = document.createElement('option');
      option.value = currency;
      option.innerHTML = currency;
      this.inputCurrency.appendChild(option.cloneNode(true));
      this.outputCurrency.appendChild(option.cloneNode(true));
    }

		this.inputVal.value = this.getAttribute("default_input_val");
    const default_input_currency = this.getAttribute("default_input_currency");
    const default_output_currency = this.getAttribute("default_output_currency");
    if (currencies.includes(default_input_currency)) {
      this.inputCurrency.value = default_input_currency;
    }
    if (currencies.includes(default_output_currency)) {
      this.outputCurrency.value = default_output_currency;
    }

    const convertURL = 'https://free.currconv.com/api/v7/convert?compact=ultra&apiKey=' + apiKey;
    this.convertButton.addEventListener("click", async (evt) => {
      const query = this.inputCurrency.value + '_' + this.outputCurrency.value;
      const data = await fetch(convertURL + '&q=' + query).then((response) => response.json());
      const conversionRate = data[query];

      const converted = this.inputVal.value * conversionRate;
      this.outputVal.innerHTML = converted.toFixed(2);
    })
	}
}

export { CurrencyConverter };