import { BaseGEvent } from "../../eventSystem.js";

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
