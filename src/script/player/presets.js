import { CardSolider } from "../card/entities/cardSolider.js";

/**
 * @template {PlayerID} T
 * @returns {PlayerData<T>}
 */
export function getSoliderPreset() {
	/** @type {CardInitData<T>[]} */
	const cards = [];
	for (let i = 0; i < 40; i++) {
		cards.push({
			cardType: CardSolider,
			componentModifiersData: [],
		});
	}
	return { inventory: cards };
}
