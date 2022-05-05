class CurrencyConverter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
		<div id="currency-converter">
        <div part="inputs">
          <div part="group">
            <label for="inputVal" part="label">Input Value</label>
            <input type="number" name="inputVal" id="input-val" placeholder="Amount to convert..." part="input-val">
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
    this.inputValInput = this.shadowRoot.querySelector("#input-val");
    this.inputVal = this.getAttribute("default_input_val");
    this.inputValInput.addEventListener("input", (e) => {
      this.inputVal = this.inputValInput.value;
    });

    this.outputValDisplay = this.shadowRoot.querySelector("#output-val");
    this.outputVal = null;

    this.inputCurrencyInput = this.shadowRoot.querySelector("#input-currency");
    this.inputCurrency = this.getAttribute("default_input_currency");
    this.inputCurrencyInput.addEventListener("input", (e) => {
      this.inputCurrency = this.inputCurrencyInput.value;
    });
    
    this.outputCurrencyInput = this.shadowRoot.querySelector("#output-currency");
    this.outputCurrency = this.getAttribute("default_output_currency");
    this.outputCurrencyInput.addEventListener("input", (e) => {
      this.outputCurrency = this.outputCurrencyInput.value;
    });

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
      this.inputCurrencyInput.appendChild(option.cloneNode(true));
      this.outputCurrencyInput.appendChild(option.cloneNode(true));
    }

    this.inputCurrencyInput.value = this.inputCurrency;
    this.outputCurrencyInput.value = this.outputCurrency;
    this.inputValInput.value = this.inputVal;

    const convertURL = 'https://free.currconv.com/api/v7/convert?compact=ultra&apiKey=' + apiKey;
    this.convertButton.addEventListener("click", async (evt) => {
      const query = this.inputCurrencyInput.value + '_' + this.outputCurrencyInput.value;
      const data = await fetch(convertURL + '&q=' + query).then((response) => response.json());
      const conversionRate = data[query];

      const converted = (this.inputValInput.value * conversionRate).toFixed(2);
      this.outputVal = converted;
      this.outputValDisplay.innerHTML = converted;
    })
	}
}

export { CurrencyConverter };