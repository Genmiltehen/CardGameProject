import { GEventTypes } from "../../eventSystem.js";
import { CardInteractionGEvent } from "../cardInteractionEvent.js";

/**
 * @template T
 * @typedef {T extends typeof GEventTypes.CARD_TRANSFER_SWAP ? CardEntity : never |
 * Matches<T, [typeof GEventTypes.CARD_TRANSFER_PLACE], PlayerFighter> |
 * Matches<T, [typeof GEventTypes.CARD_TRANSFER_MOVE], BoardPos>} SourceMatch
 */

/**
 * @template T
 * @typedef { T extends typeof GEventTypes.CARD_TRANSFER_SWAP ? CardEntity : never |
 * Matches<T, [], PlayerFighter> |
 * Matches<T, [
 *	typeof GEventTypes.CARD_TRANSFER_PLACE,
 *	typeof GEventTypes.CARD_TRANSFER_MOVE
 * ], BoardPos>} DestinationMatch
 */

/**
 * @template T
 * @typedef {Matches<T, [
 *  typeof GEventTypes.CARD_TRANSFER_PLACE,
 *  typeof GEventTypes.CARD_TRANSFER_MOVE
 * ], CardEntity, CardBase>} CardMatch
 */

/**
 * @template {GEventKey} T
 * @extends CardInteractionGEvent<T>
 */
export class CardTransferGEvent extends CardInteractionGEvent {
	/** @type {CardMatch<T>} */ card;
	/** @type {SourceMatch<T>} */ source;
	/** @type {DestinationMatch<T>} */ destination;

	/**
	 * @param {T} type
	 * @param {CardMatch<T>} card
	 * @param {SourceMatch<T>} source
	 * @param {DestinationMatch<T>} destination
	 */
	constructor(type, card, source, destination) {
		if (card.playerId == null) throw new Error("Card has no bound Player");
		const player = card.manager.getPlayer(card.playerId);

		super(type, card, player);

		this.card = card;
		this.source = source;
		this.destination = destination;
	}
}
