import { GEventTypes } from "../../eventBase.js";
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

/** @extends GUIEvent<typeof GEventTypes.LOCK_GUI> */
export class LockGUIevent extends GUIEvent {
	/**
	 * @param {GameManager} gameManager
	 * @param {UIManager} uiManager
	 */
	constructor(gameManager, uiManager) {
		super(GEventTypes.LOCK_GUI, gameManager, uiManager);
	}
}

/** @extends GUIEvent<typeof  GEventTypes.UNLOCK_GUI> */
export class UnlockGUIevent extends GUIEvent {
	/**
	 * @param {GameManager} gameManager
	 * @param {UIManager} uiManager
	 */
	constructor(gameManager, uiManager) {
		super( GEventTypes.UNLOCK_GUI, gameManager, uiManager);
	}
}
