((fileName) => {
	const __dirname = import.meta.url.split("/").slice(0, -1).concat("").join("/");
	const name = fileName.split(".").join("");
	if (document.head.querySelector(`#${name}`) == null) {
		const link = document.createElement("link");
		link.id = name;
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = __dirname + fileName;
		document.head.appendChild(link);
	}
})("progressBar.css");

export class ProgressBar {
	/**
	 *  @param {HTMLDivElement} mainElement
	 *  @param {boolean} isHorintal
	 */
	constructor(mainElement, isHorintal) {
		const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
		methods
			.filter((method) => method !== "constructor")
			// @ts-ignore
			.forEach((method) => (this[method] = this[method].bind(this)));

		this.mainElement = mainElement;
		/** @type {number} */
		this.value = 0;
		/** @type {number[]} */
		this.primaryColor = [0, 0, 0];
		/** @type {number[]} */
		this.secondaryColor = [0, 0, 0];

		this.pb = document.createElement("div");
		this.pb.classList.add("progressBar");
		this.pb.classList.add(isHorintal ? "horizontal" : "vertical");

		this.textElem = document.createElement("span");
		this.textElem.classList.add("noselect");
		this.text = "";

		this.pb.appendChild(this.textElem);

		this.mainElement.appendChild(this.pb);
	}

	/**
	 * @param {{
	 * primaryColor?: number[],
	 * secondaryColor?: number[],
	 * text?: string,
	 * value?: ?number,
	 * }} data
	 */
	set(data) {
		this.primaryColor = data.primaryColor ?? this.primaryColor;
		this.secondaryColor = data.secondaryColor ?? this.secondaryColor;
		this.text = data.text ?? this.text;
		this.value = data.value ?? this.value;
		this.reload();
	}

	reload() {
		const pRGB = this.primaryColor;
		const sRGB = this.secondaryColor;

		this.pb.style.setProperty("--primary-color", `rgb(${pRGB[0]}, ${pRGB[1]}, ${pRGB[2]})`);
		this.pb.style.setProperty("--secondary-color", `rgb(${sRGB[0]}, ${sRGB[1]}, ${sRGB[2]})`);
		this.pb.style.setProperty("--value", `${this.value * 100}%`);
		this.textElem.innerText = this.text;
	}
}
