import { ComponentList } from "../component/componentList.js";
import { boardPos, methodBind } from "../libs/utils.js";
import { CardUI } from "./cardUI.js";

/**
 * @typedef {{
 *  spriteInitValues: spriteInitValues,
 *  name: string,
 * }} CardBaseInitValues
 */

export class CardBase {
	/** @type {string} */
	name;

	/** @type {CardUI} */
	uiData;
	/** @type {GameManager} */
	mgr;
	/** @type {ComponentList} */
	components;

	/** 
	 * @param {GameManager} manager 
	 * @param {CardBaseInitValues} data
	 */
	constructor(manager, data) {
		methodBind(this);
		this.name = data.name;

		this.components = new ComponentList();

		this.mgr = manager;

		this.uiData = new CardUI(data.spriteInitValues, this);
		this.uiData.set({ name: this.name });
	}

	/** @param {boardPos} pos */
	validatePos(pos){
		return false;
	}
}
