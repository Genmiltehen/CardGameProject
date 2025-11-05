import { ComponentList } from "../component/componentList.js";
import { boardPos, methodBind } from "../libs/utils.js";
import { CardUI } from "./cardUI.js";

export class CardBase {
	/** @type {string} */
	name;

	/** @type {CardUI} */
	uiData;
	/** @type {?PlayerFighter} */
	boundPlayer;
	/** @type {GameManager} */
	mgr;

	/** @type {ComponentList} */
	components;
	/** @type {InputTargetType} */
	inputTargetType;

	/**
	 * @param {GameManager} manager
	 * @param {CardBaseInitValues} data
	 */
	constructor(manager, data) {
		methodBind(this);
		this.name = data.name;

		this.boundPlayer = null;
		this.mgr = manager;
		this.uiData = new CardUI(data.spriteInitValues, this);
		this.uiData.set({ name: this.name });

		this.components = new ComponentList();
		this.inputTargetType = "NONE";
	}

	get container() {
		return this.uiData.container;
	}

	/** @param {boardPos} pos */
	validatePos(pos) {
		return false;
	}
}
