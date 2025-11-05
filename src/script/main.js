import { CardSolider } from "./card/entities/cardSolider.js";
import { _v } from "./libs/_v.js";
import { boardPos as BoardPos } from "./libs/utils.js";
import { createGameEvent } from "./manager/eventSystem.js";
import { GameManager } from "./manager/gameManager.js";
import { UIManager } from "./manager/uiManager.js";

import { getSoliderPreset } from "./player/presets.js";

/** @type {?HTMLDivElement} */
const base = document.querySelector("div.base");
if (base == null) throw new Error("die");

/** @type {?HTMLDivElement} */
const drawButton = document.querySelector("button.draw");
if (drawButton == null) throw new Error("die");

/** @type {?HTMLDivElement} */
const discardButton = document.querySelector("button.discard");
if (discardButton == null) throw new Error("die");

const pd = getSoliderPreset();

const mgr = new GameManager(pd);
const uiMgr = new UIManager(base);
mgr.bindUIManager(uiMgr);

drawButton.addEventListener("click", () => {
	mgr.player.drawHand();
});

discardButton.addEventListener("click", () => {
	mgr.player.discardHand();

	// const a = mgr.gameBoard.allySide().forEach((bc) => {
	// 	if (bc.card != null) {
	// 		const np = new BoardPos(bc.pos.col - 1, bc.pos.row);
	// 		mgr.gameBoard.placeCard(bc.card, np);
	// 	}
	// });
});

mgr.run();
