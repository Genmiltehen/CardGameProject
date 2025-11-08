/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

/**
 * @template {PlayerID} [PID=any]
 * @typedef {import("../player/playerFighter.js").PlayerFighter<PID>} PlayerFighter
 */

/**
 * @template {PlayerID} [PID=any]
 * @typedef {import("./uiManager.js").UIManager<PID>} UIManager
 */

/** @typedef {import("./gameManager.js").GameManager} GameManager */
/** @typedef {import("./gameBoard.js").GameBoard} GameBoard */
/** @typedef {import("./uiBoard.js").UIBoard} UIBoard */
/** @typedef {import("../event/eventSystem.js").CardEventSystem} CardEventSystem */

/* -------------------------------------------------------------------------- */
/*                                   DEFINES                                  */
/* -------------------------------------------------------------------------- */

/* ------------------------------ HELPER TYPES ------------------------------ */

/** @typedef { "ALLY" | "ENEMY" } ISPlayer */
/** @typedef { "BOARD_CARDS" | "HAND_CARDS" | "PLACEHOLDERS" } ISArea */
/**
 * @typedef {{
 * 	player: ISPlayer
 * 	area: ISArea
 * 	state: "enabled" | "disabled"
 * }} InteractivitySelector
 */

/**
 * @typedef {{
 *  ally: ?UIManager<"ally">,
 * 	enemy: null
 * }} UIManagersType
 */

/** @typedef {"ally" | "enemy"} PlayerID */

/**
 * @typedef BoardCell
 * @property {BoardPos} pos
 * @property {?CardEntity} card
 */

/**
 * @template Name
 * @template {readonly any[]} List
 * @template [TrueType=Name]
 * @template [FalseType=never]
 * @typedef {Name extends List[number] ? TrueType : FalseType} Matches
 */

/**
 * @template U
 * @template {readonly U[]} T
 * @typedef {T[number]} Subset
 */

/* ---------------------------------- STATE --------------------------------- */

/**
 * @typedef { "NONE"
 * | "PLAYER_ACTION"
 * } GameState
 */
