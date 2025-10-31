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
})("progressBarTicks.css");

/** @typedef {number[]} color */

export class ProgressBarSteps {
	/** @type {HTMLDivElement} */
	#mainElement;

	/** @type {number} */
	#value;
	/** @type {number} */
	#maxValue;

	/** @type {color} */
	#primaryColor;
	/** @type {color} */
	#secondaryColor;

	/** @type {"vertical" | "horizontal"} */
	#direction;

	/** @type {HTMLDivElement[]} */
	#ticks;
	/** @type {HTMLDivElement} */
	#pb;

	/**
	 *  @param {HTMLDivElement} mainElement
	 *  @param {number} ticks
	 *  @param {"vertical" | "horizontal"} [direction]
	 */
	constructor(mainElement, ticks, direction) {
		const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
		methods
			.filter((method) => method !== "constructor")
			// @ts-ignore
			.forEach((method) => (this[method] = this[method].bind(this)));

		this.#mainElement = mainElement;

		this.#maxValue = ticks;
		this.#value = 0;

		this.#primaryColor = [0, 0, 0];
		this.#secondaryColor = [0, 0, 0];

		if (direction != null) this.#direction = direction;
		else {
			const { width: W, height: H } = mainElement.getBoundingClientRect();
			this.#direction = W > H ? "horizontal" : "vertical";
		}

		this.#ticks = [];

		this.#pb = document.createElement("div");
		this.#pb.classList.add("progressBarTicks");
		this.#mainElement.appendChild(this.#pb);

		this.#rebuild();
		this.#reloadCss();
	}

	#rebuild() {
		for (const oldTick of this.#ticks) oldTick.remove();
		this.#ticks.splice(0, this.#ticks.length);
		for (let i = 0; i < this.#maxValue; i++) {
			const tick = document.createElement("div");
			tick.classList.add("tick");
			tick.style.setProperty("image-rendering", "pixelated");
			this.#ticks.push(tick);
			this.#pb.appendChild(tick);
		}
		this.#retoggle();
	}

	#retoggle() {
		for (let i = 0; i < this.#maxValue; i++) {
			const tick = this.#ticks[i];
			if (i < this.#value) {
				tick.classList.add("active");
			} else {
				tick.classList.remove("active");
			}
		}
	}

	/**
	 * @param {{
	 * primaryColor?: color,
	 * secondaryColor?: color,
	 * value?: number,
	 * maxValue?: number,
	 * direction?: "vertical" | "horizontal"
	 * }} values
	 */
	set(values) {
		if (values.maxValue != null) {
			this.#maxValue = values.maxValue;
			this.#rebuild();
		}

		if (values.value != null) {
			const cVal = values.value < 0 ? 0 : values.value > this.#maxValue ? this.#maxValue : values.value;
			this.#value = cVal;
			this.#retoggle();
		}

		this.#direction = values.direction ?? this.#direction;
		this.#primaryColor = values.primaryColor ?? this.#primaryColor;
		this.#secondaryColor = values.secondaryColor ?? this.#secondaryColor;
		this.#reloadCss();
	}

	/** @returns {number} */
	getValue() {
		return this.#value;
	}

	#reloadCss() {
		const pRGB = this.#primaryColor;
		const sRGB = this.#secondaryColor;

		this.#pb.style.setProperty("--primary-color", `rgb(${pRGB[0]}, ${pRGB[1]}, ${pRGB[2]})`);
		this.#pb.style.setProperty("--secondary-color", `rgb(${sRGB[0]}, ${sRGB[1]}, ${sRGB[2]})`);
		const pbClassList = this.#pb.classList;
		pbClassList.remove("vertical", "horizontal");
		pbClassList.add(this.#direction);
	}
}
