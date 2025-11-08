/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

/**
 * @template {PlayerID} [T=any]
 * @typedef { import("./cardBase.js").CardBase<T> } CardBase
 */

/**
 * @template {PlayerID} [PID=any]
 * @typedef { import("./cardEntity.js").CardEntity<PID> } CardEntity 
 */

/** @typedef { import("./cardUI.js").CardUI } CardUI */

/* -------------------------------------------------------------------------- */
/*                                   DEFINES                                  */
/* -------------------------------------------------------------------------- */

/**
 * @template {PlayerID} T
 * @typedef {{
 *  spriteInitValues: spriteInitValues,
 *  name: string,
 *  playerId: T
 * }} CardBaseInitValues
 */
