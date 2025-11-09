import { BaseGEvent, GEventTypes } from "../../eventBase.js";

/**
 * @template {GEventKey} T
 * @extends BaseGEvent<T>
 */
export class ManagerGEvent extends BaseGEvent {
	/** @type {GameManager} */ gameManager;
	/** @type {GameBoard} */ gameBoard;

	/**
	 * @param {T} type
	 * @param {GameManager} gameManager
	 */
	constructor(type, gameManager) {
		super(type);
		this.gameManager = gameManager;
		this.gameBoard = gameManager.gameBoard;
	}
}

/** @extends ManagerGEvent<typeof GEventTypes.START> */
export class StartGEvent extends ManagerGEvent {
	/** @param {GameManager} gameManager */
	constructor(gameManager) {
		super(GEventTypes.START, gameManager);
	}
}

/** @extends ManagerGEvent<typeof GEventTypes.BOARD_TICK> */
export class BoardTickGEvent extends ManagerGEvent {
	/** @param {GameManager} gameManager */
	constructor(gameManager) {
		super(GEventTypes.BOARD_TICK, gameManager);
	}
}
