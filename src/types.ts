type Receipes = {
	rowspan?: number
	value: string
}

export type Crafts = Array<{
	result?: Receipes
	ingredients?: Receipes
	station?: Receipes
}>

export interface Base {
	type: string
	title: string
	summaries: string[]
	statistics: {
		[key: string]: string
	}
	crafts?: {
		[key: string]: Crafts
	}
}

// Table content
export interface Hooks extends Base {
	source?: string
	notes?: string
}

export interface NPC extends Base {
    drops?: string
    living_preferences?: string
}

export interface Bosses extends Base {
    drops?: string
    summon?: string[]
}

export interface Pets extends Base {
	summon: string
}

export interface Tools extends Base {
    toolpower: string[]
}



export interface Result {
	type: string
	name: string
}