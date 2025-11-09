import { methodBind } from "../../libs/utils.js";
import { commonIS } from "../../manager/helperUtils.js";
import { ComponentTriggerCounter } from "../../component/triggerTypes/componentTriggerCounter.js";
import { ComponentHealthOrganic } from "../../component/healthTypes/componentHealthOrganic.js";
import { CardTickGEvent } from "../../event/eventTypes/cardTickEvent.js";
import { GameManager } from "../../manager/gameManager.js";
import { CardEntity } from "../cardEntity.js";
import { GEventTypes } from "../../event/eventBase.js";

/** @type {spriteInitValues} */
const SOLIDER_SPRITE_VALUES = {
	path: "./src/assets/cardSprites/MiniSwordMan.png",
	frameDims: { x: 32, y: 32 },
	animations: {
		idle: { row: 0, frameCount: 4 },
		moving: { row: 1, frameCount: 6 },
		jump: { row: 2, frameCount: 3 },
		attack: { row: 3, frameCount: 6 },
		hit: { row: 4, frameCount: 3 },
		death: { row: 5, frameCount: 4 },
	},
	scale: 4,
};

/**
 * @template {PlayerID} PID
 * @extends CardEntity<PID>
 */
export class CardSolider extends CardEntity {
	/**
	 * @param {GameManager} mgr
	 * @param {PID} playerId
	 */
	constructor(mgr, playerId) {
		super(mgr, {
			spriteInitValues: SOLIDER_SPRITE_VALUES,
			name: "solider",
			playerId: playerId,
		});
		methodBind(this);

		this.inputTargetType = commonIS.onAllyPlace;

		this.uiData.sprite.setDefaultAnimation("idle", 0.6);
		// this.uiData.sprite.playDefaultAnimation();

		const health = new ComponentHealthOrganic(this, { maxHealth: 10 });
		this.components.add(health);
		health.set({ current: health.maximum });

		const counter = new ComponentTriggerCounter(this, { maxCounter: 5 });
		this.components.add(counter);
		this.manager.eventSystem.addListener(GEventTypes.CARD_TICK, this.evGTick);
	}

	/** @param {CardTickGEvent} event */
	evGTick(event) {
		if (event != null && event.target != null) {
			const target = event.target;
			if (this === target) {
				const counter = this.components.getFirst(ComponentTriggerCounter);
				if (counter == null) throw new Error("counter is not found");
				counter.advance();
			}
		}
	}
}
