/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

/** @typedef {import("../player/playerFighter.js").PlayerFighter} PlayerFighter*/

/** @typedef {import("./cardManager.js").Manager} Manager */
/** @typedef {import("./uiHandler.js").UIHandler} UIHandler */
/** @typedef {import("./cardEventSystem.js").CardEventSystem} CardEventSystem */

/* -------------------------------------------------------------------------- */
/*                                   DEFINES                                  */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {(
 * "TICK_BOARD" |
 * "TICK" |
 * "CARD_DRAWN" |
 * "CARD_DISCARDED" |
 * "CARD_REFRESHED" |
 * "")
 * } eventType
 */

/**
 * @typedef {CardBase | Manager | PlayerFighter} EV_SourceType
 */

/**
 * @typedef EV_GameEvent
 * @property {EV_SourceType} source
 * @property {CardBase} [target]
 * @property {object} data
 */

/**
 * @callback EV_CallbackEventListener
 * @param {EV_GameEvent} [event]
 * @returns {void}
 */
