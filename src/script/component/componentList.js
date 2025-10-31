/** @typedef {import("./componentBase.js").ComponentBase} ComponentBase */

export class ComponentList {
	constructor() {
		/** @type {ComponentBase[]} */
		this.list = [];
	}

	/** @param {ComponentBase} component */
	add(component) {
		if (!this.list.includes(component)) this.list.push(component);
		else throw new Error("Component already added");
	}

	/** @param {ComponentBase} component */
	remove(component) {
		const idx = this.list.indexOf(component);
		if (idx >= 0) this.list.splice(idx, 1);
		else throw new Error("No such component");
	}

	/**
	 * @template {ComponentBase} T
	 * @param {new (...args: any[]) => T} type
	 * @returns {T[]}
	 */
	getAll(type) {
		/** @type {T[]} */
		const res = [];
		for (const item of this.list) if (item instanceof type) res.push(item);
		return res;
	}

	/**
	 * @template {ComponentBase} T
	 * @param {new (...args: any[]) => T} type
	 * @returns {?T}
	 */
	getFirst(type) {
		/** @type {T[]} */
		const res = [];
		for (const item of this.list) if (item instanceof type) res.push(item);
		if (res.length > 0) return res[0];
		else return null;
	}
}
