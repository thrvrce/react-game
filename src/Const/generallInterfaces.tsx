interface gameCell {
	curValue: number | null,
	prevValue: number | null,
	isMerged: boolean,
	path: number
}

export type {gameCell}