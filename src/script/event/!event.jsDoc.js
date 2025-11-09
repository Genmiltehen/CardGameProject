/* ------------------------------ BASIC IMPORTS ----------------------------- */

/** @typedef {import("./eventSystem.js").GEventKey} GEventKey */

/**
 * @template {GEventKey} T
 * @typedef {import("./eventSystem.js").GEventListener<T>} GEventListener
 */

/* -------------------------------------------------------------------------- */
/*                             EVENT BASE CLASSES                             */
/* -------------------------------------------------------------------------- */

/** @typedef {import("./eventTypes/cardTickEvent.js").CardTickGEvent} CardTickGEvent */

/* ------------------------------ PLAYER EVENTS ----------------------------- */
/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/playerEvent.js").PlayerGEvent<T>} PlayerGEvent
 */
/** @typedef {import("./eventTypes/playerEvent.js").HandDrawGEvent} HandDrawGEvent */
/** @typedef {import("./eventTypes/playerEvent.js").HandDiscardGEvent} HandDiscardGEvent */
/** @typedef {import("./eventTypes/playerEvent.js").RequesPlayerActionGEvent} RequesPlayerActionGEvent */

/* ------------------------- CARD INTERCATION EVENT ------------------------- */
/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/cardInteractionEvent.js").CardInteractionGEvent<T>} CardInteractionGEvent
 */
/** @typedef {import("./eventTypes/cardInteractionEvent.js").CardDrawGEvent} CardDrawGEvent */
/** @typedef {import("./eventTypes/cardInteractionEvent.js").CardDiscardGEvent} CardDiscardGEvent */

/* -------------------------- CARD TRANSFER EVENTS -------------------------- */
/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/cardTransferSubtypes/cardTransferEvent.js").CardTransferGEvent<T>} CardTransferGEvent
 */
/** @typedef {import("./eventTypes/cardTransferSubtypes/cardPlaceEvent.js").CardPlaceGEvent} CardPlaceGEvent */
/** @typedef {import("./eventTypes/cardTransferSubtypes/cardMoveEvent.js").CardMoveGEvent} CardMoveGEvent */
/** @typedef {import("./eventTypes/cardTransferSubtypes/cardSwapEvent.js").CardSwapGEvent} CardSwapGEvent */

/* ----------------------------- MANAGER EVENTS ----------------------------- */
/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/managerSubtypes/managerEvent.js").ManagerGEvent<T>} ManagerGEvent
 */
/** @typedef {import("./eventTypes/managerSubtypes/managerEvent.js").StartGEvent} StartGEvent */
/** @typedef {import("./eventTypes/managerSubtypes/managerEvent.js").BoardTickGEvent} BoardTickGEvent */

/* ------------------------------- GUI EVENTS ------------------------------- */
/**
 * @template {GEventKey} T
 * @typedef {import("./eventTypes/managerSubtypes/guiEvent.js").GUIEvent<T>} GUIEvent
 */
/** @typedef {import("./eventTypes/managerSubtypes/guiEvent.js").LockGUIevent} LockGUIevent */
/** @typedef {import("./eventTypes/managerSubtypes/guiEvent.js").UnlockGUIevent} UnlockGUIevent */
