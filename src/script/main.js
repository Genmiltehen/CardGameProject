import { CardSolider } from "./card/entities/cardSolider.js";
import { _v } from "./libs/_v.js";
import { Manager } from "./manager/cardManager.js";

import { getSoliderPreset } from "./player/presets.js";

/** @type {?HTMLDivElement} */
const main = document.querySelector("div.main");
if (main == null) throw new Error("die");

const pd = getSoliderPreset()

const mgr = new Manager(main, pd);


const setup = [
	{ pos: { col: 0, row: 0 }, name: "test_ally" },
	{ pos: { col: 2, row: 1 }, name: "test_enemy" },
];

setup.forEach(({ pos: pos, name: name }) => {
	const res = new CardSolider(mgr);
	res.uiData.set({
		descString: "god is angry",
		position: mgr.uiHandler.bottom_right,
	});

	mgr.uiHandler.placeCard(res, pos);
});
