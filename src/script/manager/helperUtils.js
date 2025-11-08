/**
 * @param {"A"|"E"|"AE"} player A - ALLY, E - ENEMY
 * @param {"B"|"P"|"H"|"BP"|"PH"|"BH"|"BHP"} area B - Card, P - Placeholders, H - Hand cards
 * @param {boolean} state
 * @returns {InteractivitySelector[]}
 */
function createIS(player, area, state) {
	/** @type {ISPlayer[]} */
	const players = [];
	if (player.includes("A")) players.push("ALLY");
	if (player.includes("E")) players.push("ENEMY");

	/** @type {ISArea[]} */
	const areas = [];
	if (area.includes("B")) areas.push("BOARD_CARDS");
	if (area.includes("H")) areas.push("HAND_CARDS");
	if (area.includes("P")) areas.push("PLACEHOLDERS");

	/** @type {"enabled"|"disabled"} */
	const state_ = state ? "enabled" : "disabled";

	const raw = players.map((isp) => {
		return areas.map((isa) => {
			return { player: isp, area: isa, state: state_ };
		});
	});
	return raw.flat();
}

export const commonIS = /** @const */ {
	readyHand: createIS("A", "H", true),
	//
	onEnemyBoard: createIS("E", "BP", true),
	//
	onAllyBoard: createIS("A", "BP", true),
	onAllyBoardCards: createIS("A", "B", true),
	onAllyPlace: createIS("A", "P", true),
	onAllyCards: createIS("A", "BH", true),
	//
	onFullBoard: createIS("AE", "BP", true),
	//
	offAll: createIS("AE", "BHP", false),
};
