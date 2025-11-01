import { CardSolider } from "./card/entities/cardSolider.js";
import { _v } from "./libs/_v.js";
import { boardPos } from "./libs/utils.js";
import { createGameEvent } from "./manager/cardEventSystem.js";
import { GameManager } from "./manager/gameManager.js";

import { getSoliderPreset } from "./player/presets.js";

/** @type {?HTMLDivElement} */
const base = document.querySelector("div.base");
if (base == null) throw new Error("die");

/** @type {?HTMLDivElement} */
const drawButton = document.querySelector("button.draw");
if (drawButton == null) throw new Error("die");

const pd = getSoliderPreset();

const mgr = new GameManager(base, pd);

const test_setup = [
	{ pos: new boardPos(0, 0), name: "test_ally" },
	{ pos: new boardPos(2, 1), name: "test_enemy" },
];

test_setup.forEach(({ pos: pos, name: name }) => {
	const res = new CardSolider(mgr);
	res.uiData.set({
		descString: "god is angry",
		position: mgr.uiHandler.bottom_right,
	});

	mgr.uiHandler.placeCard(res, pos);
});

const event = createGameEvent("TICK_BOARD", {});
mgr.eventSystem.dispatchEvent(event);

drawButton.addEventListener("click", () => {
	mgr.player.drawHand();
});
