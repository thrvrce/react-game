interface gameCell {
	curValue: number | null,
	prevValue: number | null,
	isUpdatedOrNew: boolean,
	path: number
}

export type {gameCell}