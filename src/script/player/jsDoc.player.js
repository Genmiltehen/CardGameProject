/**
 * @template T
 * @typedef {T extends [any, ...infer R] ? R : never} OmitFirst
 */

/**
 * @template {new(host: CardBase, data: object) => import("../component/componentBase.js").ComponentBase} T
 * @typedef ComponentInitData
 * @property {T} componentType
 * @property {OmitFirst<ConstructorParameters<T>>} constructorArgs
 */

/**
 * @typedef CardInitData
 * @property {new(manager: Manager) => import("../card/cardBase.js").CardBase} cardType
 * @property {ComponentInitData<new(host: CardBase, data: object) => import("../component/componentBase.js").ComponentBase>[]} componentModifiersData
 */

/**
 * @typedef PlayerData
 * @property {CardInitData[]} inventory
 */
