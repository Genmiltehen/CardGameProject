import { ComponentList } from "../component/componentList.js";
import { BoardPos, methodBind } from "../libs/utils.js";
import { commonIS } from "../manager/helperUtils.js";
import { CardUI } from "./cardUI.js";

/** @template {PlayerID} [T=any] */
export class CardBase {
	/** @type {string} */
	name;
	/** @type {T} */
	playerId;

	/** @type {CardUI} */
	uiData;
	/** @type {GameManager} */
	manager;

	/** @type {ComponentList} */
	components;
	/** @type {InteractivitySelector[]} */
	inputTargetType;

	/**
	 * @param {GameManager} manager
	 * @param {CardBaseInitValues<T>} data
	 */
	constructor(manager, data) {
		methodBind(this);
		this.name = data.name;
		this.playerId = data.playerId;

		this.manager = manager;
		this.uiData = new CardUI(data.spriteInitValues, this);
		this.uiData.set({ name: this.name });

		this.components = new ComponentList();

		this.inputTargetType = commonIS.offAll;
	}

	get container() {
		return this.uiData.container;
	}

	/**
	 * @readonly
	 * @type {PlayerFighter<T>}
	 */
	get player() {
		if (this.playerId == null) throw new Error("no bound player");
		const player = this.manager.players[this.playerId];
		return player;
	}

	/**
	 * @readonly
	 * @type {UIManager<"ally">}
	 */
	get uiManager() {
		const uiManager = this.manager.getUIManager(this.playerId);
		if (uiManager == null) throw new Error("UNIMPLEMENTED [multilayer]");
		return uiManager;
	}

	/** @param {BoardPos} pos */
	validatePos(pos) {
		return false;
	}
}
