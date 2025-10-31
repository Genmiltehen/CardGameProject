import { methodBind } from "../../libs/utils.js";
import { Manager } from "../../manager/cardManager.js";
import { CardEntity } from "../cardEntity.js";
import { ComponentTriggerCounter } from "../../component/triggerTypes/componentTriggerCounter.js";
import { ComponentHealthOrganic } from "../../component/healthTypes/componentHealthOrganic.js";

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

export class CardSolider extends CardEntity {
	/**  @param {Manager} mgr */
	constructor(mgr) {
		super(mgr, {
			spriteInitValues: SOLIDER_SPRITE_VALUES,
			name: "solider",
		});
		methodBind(this);
		this.uiData.sprite.setDefaultAnimation("idle", 0.6);
		this.uiData.sprite.playAnimation("hit", 0.5, 1, "default");

		const health = new ComponentHealthOrganic(this, { maxHealth: 10 });
		this.components.add(health);
		health.set({ current: health.maximum });

		const counter = new ComponentTriggerCounter(this, { maxCounter: 5 });
		this.components.add(counter);
		this.mgr.eventSystem.addListener("TICK", this.tick);
	}

	/** @param {EV_GameEvent} [event] */
	tick(event) {
		if (event != null) {
			if (event.target != null) {
				const target = event.target;
				if (this === target) {
					const counter = this.components.getFirst(ComponentTriggerCounter);
					if (counter == null) throw new Error("counter is not found");
					counter.set({
						current: counter.current + 1,
					});
				}
			}
		}
	}
}
