/* ------------------------------ BASIC IMPORTS ----------------------------- */

/** @typedef {import("./eventSystem.js").GEventKey} GEventKey */

/** @typedef {import("./eventSystem.js").GEventMap} GEventMap */

/**
 * @template {GEventKey} T
 * @typedef {import("./eventSystem.js").GEventListener<T>} GEventListener
 */

/* -------------------------------------------------------------------------- */
/*                             EVENT BASE CLASSES                             */
/* -------------------------------------------------------------------------- */

/** @typedef {import("./eventTypes/cardTickEvent.js").CardTickGEvent} CardTickGEvent */

/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/playerEvent.js").PlayerGEvent<T>} PlayerGEvent
 */

/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/cardInteractionEvent.js").CardInteractionGEvent<T>} CardInteractionGEvent
 */

/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/cardTransferSubtypes/cardTransferEvent.js").CardTransferGEvent<T>} CardTransferGEvent
 */
/** @typedef {import("./eventTypes/cardTransferSubtypes/cardPlaceEvent.js").CardPlaceGEvent} CardPlaceGEvent */
/** @typedef {import("./eventTypes/cardTransferSubtypes/cardMoveEvent.js").CardMoveGEvent} CardMoveGEvent */
/** @typedef {import("./eventTypes/cardTransferSubtypes/cardSwapEvent.js").CardSwapGEvent} CardSwapGEvent */

/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/managerSubtypes/managerEvent.js").ManagerGEvent<T>} ManagerGEvent
 */

/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/managerSubtypes/guiEvent.js").GUIEvent<T>} GUIEvent
 */

/* -------------------------------------------------------------------------- */
/*                               DERIVED EVENTS                               */
/* -------------------------------------------------------------------------- */

/** @typedef {PlayerGEvent<"HAND_DRAW">} HandDrawGEvent */
/** @typedef {PlayerGEvent<"HAND_DISCARD">} HandDiscardGEvent */
/** @typedef {PlayerGEvent<"REQUEST_PLAYER_ACTION">} RequesPlayerActionGEvent */

/** @typedef {CardInteractionGEvent<"CARD_DRAW">} CardDrawGEvent */
/** @typedef {CardInteractionGEvent<"CARD_DISCARD">} CardDiscardGEvent */

/** @typedef {ManagerGEvent<"START">} StartGEvent */
/** @typedef {ManagerGEvent<"BOARD_TICK">} BoardTickGEvent */

/** @typedef {GUIEvent<"LOCK_GUI">} LockGUIevent */
/** @typedef {GUIEvent<"UNLOCK_GUI">} UnlockGUIevent */
