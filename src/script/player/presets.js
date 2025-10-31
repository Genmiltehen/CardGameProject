import { CardSolider } from "../card/entities/cardSolider.js";

/** @returns {PlayerData}  */
export function getSoliderPreset() {
	/** @type {CardInitData[]} */
	const cards = [];
	for (let i = 0; i < 40; i++) {
		cards.push({
			cardType: CardSolider,
			componentModifiersData: [],
		});
	}
	return { inventory: cards };
}
