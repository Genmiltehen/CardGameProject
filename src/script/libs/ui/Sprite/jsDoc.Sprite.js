/**
 * @typedef spriteDims
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef spriteAnimationData
 * @property {number} row
 * @property {number} frameCount
 */

/** @typedef {Object<string, spriteAnimationData>} spriteAnimationDataMap */

/** @typedef {"infinite" | number} spriteRepeatValues */

/**
 * @typedef spriteInitValues						data set for sorite initialization
 * @property {string} path 							path to spritesheet
 * @property {spriteDims} frameDims 				dimensions of frame in pixels
 * @property {spriteAnimationDataMap} animations	map: string -> animation data
 * @property {number} [scale]						optional: scaling factor of image
 */

/**
 * @typedef spriteData
 * @property {string} path
 * @property {spriteDims} frameDims
 * @property {spriteAnimationDataMap} animations
 * @property {number} scale
 * @property {spriteDims} spriteDims
 * @property {boolean} isBound
 * @property {object} default
 * @property {number} default.duration
 * @property {spriteRepeatValues} default.repeat
 * @property {?string} default.currentAnimation
 */
