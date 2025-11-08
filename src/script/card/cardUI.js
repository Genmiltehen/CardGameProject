import { CardMoveGEvent, CardSwapGEvent, GEventTypes, GUIEvent } from "../event/index.js";
import { _v, createElement, methodBind, RGBtoCssStr } from "../libs/index.js";
import { Sprite } from "../libs/ui/Sprite/Sprite.js";
import { commonIS } from "../manager/helperUtils.js";
import { CardBase } from "./cardBase.js";
import { CardEntity } from "./cardEntity.js";

/** @typedef {"none"|"fixed"|"hand"} cardPositioning */
/** @typedef {"none"|"locked"|"ready"|"selected"} cardState */

const DEFAULT_CARD_SIZE = 200;

export const prettyColors = {
	red: [231, 24, 11],
	yellow: [255, 235, 59],
	green: [24, 230, 11],
	blue: [25, 144, 255],
	purple: [225, 42, 251],
};

export class CardUI {
	static aspectRatio = 5 / 7;

	/** @type {spriteInitValues}*/
	spriteData;
	/** @type {HTMLElement} */
	container;
	/** @type {Sprite} */
	sprite;
	/** @type {?CardBase} */
	cardData;

	/** @type {number} */
	height;
	/** @type {number} */
	width;
	/** @type {boolean} */
	isEnemyFlag;

	/** @type {cardPositioning} */
	positioning;
	/** @type {cardState} */
	state;

	/**
	 * @param {?CardBase} cardData
	 * @param {spriteInitValues} spriteData
	 */
	constructor(spriteData, cardData) {
		methodBind(this, "ev");
		this.spriteData = spriteData;
		if (cardData != null) {
			this.cardData = cardData;
			this.cardData.uiData = this;
		} else this.cardData = null;

		this.height = DEFAULT_CARD_SIZE;
		this.width = DEFAULT_CARD_SIZE * CardUI.aspectRatio;
		this.isEnemyFlag = false;

		this.positioning = "none";
		this.state = "none";

		const imgHolder = createElement("div.imgHolder");
		this.container = createElement("div.card", { fontSize: `${this.height / 20}px` }, { positioning: "none" }, [
			createElement("div.cardInsHolder", {}, {}, [
				imgHolder,
				createElement("div.cardName", {}, { innerText: "name" }),
				createElement("div.cardDesc", {}, { innerText: "balls" }),
			]),
		]);

		// @ts-ignore
		this.sprite = new Sprite(imgHolder);
		this.sprite.bindSprite(this.spriteData);

		this.container.addEventListener("click", this.evUIClick);

		this.reloadCss();
	}

	/**
	 * @param {object} values
	 * @param {number} [values.cardSize]
	 * @param {_v} [values.position]
	 * @param {string} [values.descString]
	 * @param {string} [values.name]
	 * @param {boolean} [values.isEnemy]
	 * @param {cardPositioning} [values.positioning]
	 * @param {cardState} [values.state]
	 * @param {Object} [values.colorPallete]
	 * @param {number[]} values.colorPallete.primary
	 */
	set(values) {
		const CardStyle = this.container.style;
		if (values.cardSize != null) {
			this.height = values.cardSize;
			this.width = values.cardSize * CardUI.aspectRatio;
		}
		if (values.descString != null) {
			/** @type {HTMLElement?} */
			const cardDesc = this.container.querySelector("div.cardDesc");
			if (cardDesc == null) throw new Error("How? [no cardDesc]");
			cardDesc.innerText = values.descString;
		}
		if (values.name != null) {
			/** @type {HTMLElement?} */
			const cardName = this.container.querySelector(".cardName");
			if (cardName == null) throw new Error("How? [no cardName]");
			cardName.innerText = values.name;
		}
		if (values.colorPallete != null) {
			CardStyle.setProperty("--card-bg-color", RGBtoCssStr(values.colorPallete.primary));
		}
		if (values.position != null) {
			CardStyle.setProperty("--x", `${values.position.x}px`);
			CardStyle.setProperty("--y", `${values.position.y}px`);
		}
		if (values.isEnemy != null) {
			this.isEnemyFlag = values.isEnemy;
		}
		if (values.positioning != null) {
			this.positioning = values.positioning;
		}
		if (values.state != null) {
			this.state = values.state;
		}
		this.reloadCss();
	}

	reloadCss() {
		const isEnemy = this.cardData instanceof CardEntity ? this.cardData.isEnemy : this.isEnemyFlag;
		if (isEnemy) this.container.classList.add("enemy");
		if (!isEnemy) this.container.classList.remove("enemy");

		this.container.setAttribute("positioning", this.positioning);
		this.container.setAttribute("state", this.state);

		const CStyle = this.container.style;
		CStyle.fontSize = `${this.height / 20}px`;
		CStyle.height = `${this.height}px`;
		CStyle.width = `${Math.round(this.height * CardUI.aspectRatio)}px`;
	}

	evUIClick() {
		const card = this.cardData;
		if (card == null) return false;
		if (card.uiData.positioning == "none") return;

		const uiManager = card.uiManager;

		const clickedPos = card.uiData.positioning;
		const selected = uiManager.selectedInputCard;

		uiManager.lockGUI();
		if (selected == card) {
			uiManager.clearInputCard();
			uiManager.unlockGUI();
		} else if (selected == null) {
			const uiState = clickedPos == "fixed" ? commonIS.onAllyBoard : card.inputTargetType;
			uiManager.setUIState(uiState);
			uiManager.setInputCard(card);
		} else {
			const selectedPos = selected.uiData.positioning;
			if (selectedPos == "none") return;

			if (selectedPos == "fixed") {
				if (clickedPos == "fixed") {
					const IEM = "How? [Trying to swap not CardEntity]";
					if (!(card instanceof CardEntity) || !(selected instanceof CardEntity)) throw new Error(IEM);
					uiManager.gameManager.eventSystem.dispatch(new CardSwapGEvent(card, selected));
				} else {
					const IEM = "How? [Imposible action: selected - on board, clicked - in hand]";
					throw new Error(IEM);
				}
			} else {
				console.debug("item card action here");
			}
		}
	}
}
