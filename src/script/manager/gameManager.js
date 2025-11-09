import { _v, BoardPos, methodBind } from "../libs/index.js";
import { GEventTypes } from "../event/eventBase.js";
import { GameBoard } from "./gameBoard.js";
import { PlayerFighter } from "../player/playerFighter.js";
import { CardTickGEvent, GEventSystem, RequesPlayerActionGEvent, StartGEvent } from "../event/index.js";

const BOARD_SIZE = new BoardPos(6, 2);

export class GameManager {
	/**  @type {UIManagersType}  */
	#uiManagers;
	/** @type {GameBoard} */
	gameBoard;
	/** @type {GEventSystem} */
	eventSystem;

	/** @type {{ [PID in PlayerID]: PlayerFighter<PID> }} */
	players;

	/** @type {GameState} */
	state;

	/**
	 * @param {PlayerData<"ally">} playerData
	 */
	constructor(playerData) {
		methodBind(this, "ev");
		this.gameBoard = new GameBoard(this, BOARD_SIZE);
		this.eventSystem = new GEventSystem();
		this.#uiManagers = { ally: null, enemy: null };

		this.state = "NONE";

		this.players = {
			ally: new PlayerFighter(this, "ally", playerData),
			enemy: new PlayerFighter(this, "enemy", { inventory: [] }),
		};

		this.#setupEvents();
	}

	/**
	 * @template {PlayerID} T
	 * @param {T} playerId
	 * @returns {PlayerFighter<T>}
	 */
	getPlayer(playerId) {
		return this.players[playerId];
	}

	/**
	 * @template {PlayerID} T
	 * @param {T} side
	 */
	getUIManager(side) {
		if (side == "enemy") throw new Error("UNIMPLEMENTED [multiplayer]");
		if (this.#uiManagers[side] == null) throw new Error("UIManager is not bound");
		return this.#uiManagers[side];
	}

	/**
	 * @template {PlayerID} T
	 * @param {T} side
	 * @param {UIManagersType[T]} uiManager
	 */
	bindUIManager(side, uiManager) {
		this.#uiManagers[side] = uiManager;
		if (this.#uiManagers[side] != null) {
			this.#uiManagers[side].bindGameManager(this, "ally");
		}
	}

	#setupEvents() {
		this.eventSystem.addListener(GEventTypes.START, this.evGStart);
		this.eventSystem.addListener(GEventTypes.BOARD_TICK, this.evGTickBoard);

		this.eventSystem.addListener(GEventTypes.REQUEST_PLAYER_ACTION, this.evGPlayerActionStart);
	}

	run() {
		const event = new StartGEvent(this);
		this.eventSystem.dispatch(event);
	}

	/** @param {StartGEvent} event */
	evGStart(event) {
		this.players.ally.drawHand(1);

		const eventPlayerActionStart = new RequesPlayerActionGEvent(this.players.ally);
		this.eventSystem.dispatch(eventPlayerActionStart);
	}

	/** @param {RequesPlayerActionGEvent} event */
	evGPlayerActionStart(event) {
		this.state = "PLAYER_ACTION";
	}

	/** @param {BoardTickGEvent} event */
	evGTickBoard(event) {
		this.gameBoard.fullBoard().forEach((boardCell) => {
			if (boardCell.card != null) {
				const pos = boardCell.pos;
				const event = new CardTickGEvent(pos, boardCell.card);
				this.eventSystem.dispatch(event);
			}
		});
	}
}
