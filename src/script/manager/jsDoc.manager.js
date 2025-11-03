/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

/** @typedef {import("../player/playerFighter.js").PlayerFighter} PlayerFighter*/

/** @typedef {import("./gameManager.js").GameManager} GameManager */
/** @typedef {import("./uiManager.js").UIManager} UIManager */
/** @typedef {import("./eventSystem.js").CardEventSystem} CardEventSystem */
/** @typedef {import("./gameBoard.js").GameBoard} GameBoard */

/* -------------------------------------------------------------------------- */
/*                                   DEFINES                                  */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {{
 * TICK_BOARD: {},
 * TICK: TickData,
 * CARD_DRAWN: CardDrawnData,
 * CARD_DISCARDED: CardDiscardedData,
 * TRIGGER_COUNTER: TriggerCounterData, 
 * }} EventDataMap
 */

/**
 * @typedef TickData
 * @property {import("../libs/utils.js").boardPos} pos
 * @property {EV_TargetType} target
 */

/**
 * @typedef CardDrawnData
 * @property {CardBase} drawnCard
 * @property {PlayerFighter} player
 */

/**
 * @typedef CardDiscardedData
 * @property {CardBase} discardedCard
 */

/**
 * @typedef {CardBase | GameManager | PlayerFighter} EV_TargetType
 */

/**
 * @template {keyof EventDataMap} T
 * @typedef EV_GameEvent
 * @property {T} type
 * @property {EventDataMap[T]} data
 */

/**
 * @template {keyof EventDataMap} T
 * @callback EV_CallbackEventListener
 * @param {EV_GameEvent<T>} event
 * @returns {void}
 */
