import { ManagerGEvent } from "./managerEvent.js";

/**
 * @template {GEventKey} T
 * @extends ManagerGEvent<T>
 */
export class GUIEvent extends ManagerGEvent {
	/** @type {UIManager} */ uiManager;
	/** @type {UIBoard} */ uiBoard;

	/**
	 * @param {T} type
	 * @param {GameManager} gameManager
	 * @param {UIManager} uiManager
	 */
	constructor(type, gameManager, uiManager) {
		super(type, gameManager);
		this.uiManager = uiManager;
		this.uiBoard = uiManager.uiBoard;
	}
}
