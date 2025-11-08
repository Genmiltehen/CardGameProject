import { GEventTypes, GUIEvent } from "./event/index.js";
import { _v } from "./libs/_v.js";
import { GameManager } from "./manager/gameManager.js";
import { UIManager } from "./manager/uiManager.js";

import { getSoliderPreset } from "./player/presets.js";

/** @type {?HTMLDivElement} */
const base = document.querySelector("div.base");
if (base == null) throw new Error("die");

/** @type {?HTMLDivElement} */
const leftButton = document.querySelector("button.draw");
if (leftButton == null) throw new Error("die");

/** @type {?HTMLDivElement} */
const rightButton = document.querySelector("button.discard");
if (rightButton == null) throw new Error("die");

/** @type {PlayerData<"ally">} */
const pd = getSoliderPreset();

const mgr = new GameManager(pd);

/**@type {UIManager<"ally">} */
const uiMgr = new UIManager(base);
mgr.bindUIManager("ally", uiMgr);

leftButton.addEventListener("click", () => {
	mgr.players.ally.drawHand();
});

rightButton.addEventListener("click", () => {
	const uiMgr_ = mgr.getUIManager("ally")
	mgr.eventSystem.dispatch(new GUIEvent(GEventTypes.UNLOCK_GUI, mgr, uiMgr_))
	// mgr.player.discardHand();
	// /** @type {InteractivitySelector} */
	// const ITT = { player: "ALLY", area: "FULL", state: "enabled" };
	// mgr.getUIManager.setUIState(ITT);
	// const a = mgr.gameBoard.allySide().forEach((bc) => {
	// 	if (bc.card != null) {
	// 		const np = new BoardPos(bc.pos.col - 1, bc.pos.row);
	// 		mgr.gameBoard.placeCard(bc.card, np);
	// 	}
	// });
});

mgr.run();
