import { GEventTypes } from "../../eventBase.js";
import { CardTransferGEvent } from "./cardTransferEvent.js";

/**  @extends CardTransferGEvent<typeof GEventTypes.CARD_TRANSFER_SWAP> */
export class CardSwapGEvent extends CardTransferGEvent {
	/**
	 * @param {CardEntity} card
	 * @param {CardEntity} destination
	 */
	constructor(card, destination) {
		const player = card.player;
		if (player == null) throw new Error("Card has no bound Player");
		super(GEventTypes.CARD_TRANSFER_SWAP, card, card, destination);
	}
}
