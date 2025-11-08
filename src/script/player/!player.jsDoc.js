/**
 * @template T
 * @typedef {T extends [any, ...infer R] ? R : never} OmitFirst
 */

/**
 * @template {PlayerID} U
 * @template {new(host: CardBase<U>, data: object) => ComponentBase} T
 * @typedef ComponentInitData
 * @property {T} componentType
 * @property {OmitFirst<ConstructorParameters<T>>} constructorArgs
 */

/**
 * @template {PlayerID} T
 * @typedef CardInitData
 * @property {new(manager: GameManager, playerId: T) => CardBase<T>} cardType
 * @property {ComponentInitData<T, new(host: CardBase<T>, data: object) => ComponentBase>[]} componentModifiersData
 */

/**
 * @template {PlayerID} T
 * @typedef PlayerData
 * @property {CardInitData<T>[]} inventory
 */
