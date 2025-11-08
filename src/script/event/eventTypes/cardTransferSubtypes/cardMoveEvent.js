import { GEventTypes } from "../../eventSystem.js";
import { CardTransferGEvent } from "./cardTransferEvent.js";

/**
 * @extends CardTransferGEvent<"CARD_TRANSFER_MOVE">
 */
export class CardMoveGEvent extends CardTransferGEvent {
	/**
	 * @param {CardEntity} card
	 * @param {BoardPos} destination
	 */
	constructor(card, destination) {
		const player = card.player;
		if (player == null) throw new Error("Card has no bound Player");
		if (card.pos == null) throw new Error("Card not on Board [pos is null]");
		super(GEventTypes.CARD_TRANSFER_MOVE, card, card.pos, destination);
	}
}
