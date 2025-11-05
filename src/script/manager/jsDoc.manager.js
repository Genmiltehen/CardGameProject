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

/* ------------------------------ HELPER TYPES ------------------------------ */

/**
 * @typedef BoardCell
 * @property {boardPos} pos
 * @property {?CardEntity} card
 */

/* ---------------------------------- STATE --------------------------------- */

/**
 * @typedef { "NONE"
 * | "PLAYER_ACTION"
 * } GameState
 */

/* ---------------------------------- EVENT --------------------------------- */

/**
 * @typedef {{
 * START: {},
 * PLAYER_ACTION_START: DataPlayerActionStart,
 * CARD_DRAW_AFTER: DataCardDrawAfter,
 * HAND_DRAW_AFTER: DataHandDrawAfter,
 * CARD_DISCARD_AFTER: DataCardDiscardAfter,
 * HAND_DISCARD_AFTER: DataHandDiscardAfter
 * CARD_MOVE: DataCardMove
 * BOARD_TICK: {},
 * CARD_TICK: DataCardTick,
 * TRIGGER_COUNTER: DataTriggerCounter,
 * }} GEV_DataMap
 */

/**
 * @template {keyof GEV_DataMap} T
 * @typedef GEV_Event
 * @property {T} type
 * @property {GEV_DataMap[T]} payload
 */

/**
 * @template {keyof GEV_DataMap} T
 * @callback GEV_Listener
 * @param {GEV_Event<T>} event
 * @returns {void}
 */

/**
 * @typedef {CardBase | GameManager | PlayerFighter} GEV_TargetType
 */

/* -------------------------------------------------------------------------- */
/*                                DATA DEFINES                                */
/* -------------------------------------------------------------------------- */

/**
 * @typedef DataPlayerActionStart
 * @property {PlayerFighter} player
 */

/**
 * @typedef DataCardDrawAfter
 * @property {CardBase} drawnCard
 * @property {PlayerFighter} player
 */

/**
 * @typedef DataCardDiscardAfter
 * @property {CardBase} discardedCard
 */

/**
 * @typedef DataHandDrawAfter
 * @property {PlayerFighter} player
 */

/**
 * @typedef DataHandDiscardAfter
 * @property {PlayerFighter} player
 */

/**
 * @typedef DataCardMove
 * @property {"hand"|"board"} from
 * @property {boardPos} to
 * @property {CardEntity} card
 */

/**
 * @typedef DataCardTick
 * @property {boardPos} pos
 * @property {GEV_TargetType} target
 */
