import { GEventTypes } from "../../eventSystem.js";
import { CardTransferGEvent } from "./cardTransferEvent.js";

/**
 * @extends CardTransferGEvent<"CARD_TRANSFER_PLACE">
 */
export class CardPlaceGEvent extends CardTransferGEvent {
	/**
	 * @param {CardEntity} card
	 * @param {BoardPos} destination
	 */
	constructor(card, destination) {
		const player = card.player;
		if (player == null) throw new Error("Card has no bound Player");
		super(GEventTypes.CARD_TRANSFER_PLACE, card, player, destination);
	}
}