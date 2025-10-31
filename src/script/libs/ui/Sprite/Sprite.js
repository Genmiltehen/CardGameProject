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
})("Sprite.css");

export class Sprite {
	/** @type {HTMLDivElement} */
	#mainElement;
	/** @type {HTMLDivElement} */
	#imgCont;
	/** @type {HTMLDivElement} */
	#imgElem;

	/** @type {spriteData} */
	data;

	/** @param {HTMLDivElement} mainElement */
	constructor(mainElement) {
		this.#mainElement = mainElement;
		this.data = {
			path: "",
			frameDims: { x: 0, y: 0 },
			animations: {},
			isBound: false,
			spriteDims: { x: 0, y: 0 },
			scale: 1,
			default: {
				duration: 0,
				currentAnimation: "",
				repeat: 0,
			},
		};

		this.#imgCont = document.createElement("div");
		this.#imgCont.classList.add("imgCont");

		this.#imgElem = document.createElement("div");
		this.#imgElem.classList.add("imgElem");
		this.#imgElem.classList.add("noSmoothing");

		this.#imgCont.appendChild(this.#imgElem);

		this.#mainElement.appendChild(this.#imgCont);

		this.playDefaultAnimation = this.playDefaultAnimation.bind(this);
	}

	/** @param {spriteInitValues} spriteInitValues */
	bindSprite(spriteInitValues) {
		this.data.animations = spriteInitValues.animations;
		this.data.frameDims = spriteInitValues.frameDims;
		this.data.path = spriteInitValues.path;
		this.data.scale = spriteInitValues.scale ?? 1;

		this.data.isBound = true;
		this.#reload();
	}

	#reload() {
		new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve({ x: img.width, y: img.height });
			img.onerror = reject;
			img.src = this.data.path;
		}).then((spriteDims) => {
			this.data.spriteDims = spriteDims;

			const IEStyle = this.#imgElem.style;
			const scale = this.data.scale;
			const fDims = this.data.frameDims;

			IEStyle.setProperty("background-size", `${spriteDims.x}px ${spriteDims.y}px`);
			IEStyle.setProperty("background-image", `url(${this.data.path})`);
			IEStyle.setProperty("width", `${fDims.x}px`);
			IEStyle.setProperty("height", `${fDims.y}px`);
			IEStyle.setProperty("transform", `translate(-50%, -50%) scale(${scale})`);
		});
	}

	/**
	 * @param {string} animationName
	 * @param {number} duration
	 * @param {spriteRepeatValues} repeat
	 */
	#setCssAnimation(animationName, duration, repeat = "infinite") {
		const ImgElemStyle = this.#imgElem.style;

		const cssAnimationName = ImgElemStyle.animationName;
		ImgElemStyle.animationName = "none";

		const animation = this.data.animations[animationName];
		ImgElemStyle.setProperty("--steps", `${animation.frameCount}`);
		ImgElemStyle.setProperty("--animation-end", `${(animation.frameCount - 1) * this.data.frameDims.x}px`);
		ImgElemStyle.setProperty("--y-offset", `${animation.row * this.data.frameDims.y}px`);

		ImgElemStyle.animationName = cssAnimationName;
		ImgElemStyle.animationDuration = `${duration}s`;
		ImgElemStyle.animationIterationCount = `${repeat}`;
	}

	/**
	 * @param {string} animationName
	 * @param {number} duration
	 * @param {spriteRepeatValues} repeat
	 */
	setDefaultAnimation(animationName, duration, repeat = "infinite") {
		if (animationName in this.data.animations) {
			this.data.default.currentAnimation = animationName;
			this.data.default.duration = duration;
			this.data.default.repeat = repeat;
		} else throw new Error("no such animation found");
	}

	playDefaultAnimation() {
		const animationName = this.data.default.currentAnimation;
		const duration = this.data.default.duration;
		const repeat = this.data.default.repeat;
		if (animationName == null) throw new Error("No default animation");

		this.#setCssAnimation(animationName, duration, repeat);
	}

	/**
	 *  @param {string} animationName
	 *  @param {number} duration
	 *  @param {number} repeat
	 *  @param {boolean} switchToDeafult
	 */
	playAnimation(animationName, duration, repeat = 1, switchToDeafult = true) {
		if (animationName in this.data.animations) {
			this.#setCssAnimation(animationName, duration, repeat);
			if (switchToDeafult) {
				window.setTimeout(this.playDefaultAnimation, repeat * duration * 1000);
			}
		} else throw new Error("no such animation found");
	}
}
