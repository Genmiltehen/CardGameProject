import { _v } from "./_v.js";

/**
 * @param {any} class_
 * @param {string} [selector]
 */
export function methodBind(class_, selector) {
	const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(class_));
	methods
		.filter((method) => {
			const isNotCtor = method !== "constructor";
			const selected = selector == null ? true : method.startsWith("ev");
			return isNotCtor && selected;
		})
		.forEach((method) => {
			class_[method] = class_[method].bind(class_);
		});
}

/**
 *
 * @param {number} val
 * @param {number} max
 * @param {number} min
 * @returns
 */
export function clamp(val, min, max) {
	return Math.max(min, Math.min(val, max));
}

/**  @param {number[]} RGB */
export function RGBtoCssStr(RGB) {
	return `rgb(${RGB[0]}, ${RGB[1]}, ${RGB[2]})`;
}

/**
 * @param {string} name
 * @param {Object.<string, string>} [style] Css style
 * @param {Object.<string, string>} [attributes]
 * @param {(HTMLElement[])} [nested]
 */
export function createElement(name, style, attributes, nested) {
	const classArgs = name.match(/\.\w+/gm);
	const idArgs = name.match(/#\w+/gm);
	const tagNameQ = name.match(/^\w+/gm);
	if (tagNameQ == null) throw new Error("Name is not provided");
	const tagName = tagNameQ[0];

	const res = document.createElement(tagName);

	classArgs?.forEach((m_) => {
		res.classList.add(m_.slice(1));
	});
	idArgs?.forEach((m_) => {
		res.id = m_.slice(1);
	});

	// if (style != null) for (const [styleName, styleVal] of Object.entries(style)) res.style[styleName] = styleVal;
	if (style != null)
		Object.entries(style).forEach(([styleName, styleVal]) => {
			res.style.setProperty(styleName, styleVal);
		});
	if (attributes != null)
		Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
			res.setAttribute(attributeName, attributeValue);
		});
	nested?.forEach((elem) => {
		res.appendChild(elem);
	});
	return res;
}

export class BoardPos {
	/**
	 * @constructor
	 * @param {number} col
	 * @param {number} row
	 */
	constructor(col, row) {
		/** @type {number} */
		this.col = col;
		/** @type {number} */
		this.row = row;
	}
}

/**
 * @param {any[]} array
 */
export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i

		[array[i], array[j]] = [array[j], array[i]];
	}
}
