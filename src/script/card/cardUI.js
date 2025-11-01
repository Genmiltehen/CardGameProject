import { _v } from "../libs/_v.js";
import { Sprite } from "../libs/ui/Sprite/Sprite.js";
import { createElement, methodBind, RGBtoCssStr } from "../libs/utils.js";
import { CardBase } from "./cardBase.js";

const DEFAULT_CARD_SIZE = 200;

export const prettyColors = {
	red: [231, 24, 11],
	yellow: [255, 235, 59],
	green: [24, 230, 11],
	blue: [25, 144, 255],
	purple: [225, 42, 251],
};

export class CardUI {
	static aspectRatio = 5 / 7;

	/** @type {spriteInitValues}*/
	spriteData;
	/** @type {HTMLElement} */
	container;
	/** @type {Sprite} */
	sprite;
	/** @type {?CardBase} */
	cardData;

	/** @type {number} */
	height;
	/** @type {number} */
	width;
	/** @type {boolean} */
	isEnemyFlag;

	/**
	 * @param {?CardBase} cardData
	 * @param {spriteInitValues} spriteData
	 */
	constructor(spriteData, cardData) {
		methodBind(this);
		this.spriteData = spriteData;
		if (cardData != null) {
			this.cardData = cardData;
			this.cardData.uiData = this;
		} else this.cardData = null;

		this.height = DEFAULT_CARD_SIZE;
		this.width = DEFAULT_CARD_SIZE * CardUI.aspectRatio;
		this.isEnemyFlag = false;

		const imgHolder = createElement("div.imgHolder");
		// @ts-ignore
		this.sprite = new Sprite(imgHolder);
		this.sprite.bindSprite(this.spriteData);

		this.container = createElement("div.cardUImain", { fontSize: `${this.height / 20}px` }, {}, [
			createElement("div.cardInsHolder", {}, {}, [
				imgHolder,
				createElement("div.cardName", {}, { innerText: "name" }),
				createElement("div.cardDesc", {}, { innerText: "balls" }),
			]),
		]);

		this.reloadCss();
	}

	/**
	 * @param {object} values
	 * @param {number} [values.cardSize]
	 * @param {_v} [values.position]
	 * @param {string} [values.descString]
	 * @param {string} [values.name]
	 * @param {boolean} [values.isEnemy]
	 * @param {boolean} [values.isFixed]
	 * @param {Object} [values.colorPallete]
	 * @param {number[]} values.colorPallete.primary
	 */
	set(values) {
		const CardStyle = this.container.style;
		if (values.cardSize != null) {
			this.height = values.cardSize;
			this.width = values.cardSize * CardUI.aspectRatio;
		}
		if (values.descString != null) {
			/** @type {HTMLElement?} */
			const cardDesc = this.container.querySelector("div.cardDesc");
			if (cardDesc == null) throw new Error("How? [no cardDesc]");
			cardDesc.innerText = values.descString;
		}
		if (values.name != null) {
			/** @type {HTMLElement?} */
			const cardName = this.container.querySelector(".cardName");
			if (cardName == null) throw new Error("How? [no cardName]");
			cardName.innerText = values.name;
		}
		if (values.colorPallete != null) {
			CardStyle.setProperty("--card-bg-color", RGBtoCssStr(values.colorPallete.primary));
		}
		if (values.position != null) {
			CardStyle.setProperty("--x", `${values.position.x}px`);
			CardStyle.setProperty("--y", `${values.position.y}px`);
		}
		if (values.isEnemy != null) {
			this.isEnemyFlag = values.isEnemy;
		}
		if (values.isFixed != null) {
			if (values.isFixed) this.container.classList.add("fixedCard");
			else this.container.classList.remove("fixedCard");
		}
		this.reloadCss();
	}

	reloadCss() {
		if (this.isEnemyFlag) this.container.classList.add("enemy");
		if (!this.isEnemyFlag) this.container.classList.remove("enemy");
		const CStyle = this.container.style;
		CStyle.fontSize = `${this.height / 20}px`;
		CStyle.height = `${this.height}px`;
		CStyle.width = `${Math.round(this.height * CardUI.aspectRatio)}px`;
	}
}

/**
 
 */
