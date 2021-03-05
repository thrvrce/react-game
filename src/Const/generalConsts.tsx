const colorForEmty: string = 'rgba(0, 0, 0, 0)';//прозрачный цвет :D
const colorFor2: string = '#eee4da';
const colorFor4: string = '#eee1c9';
const colorFor8: string = '#f3b27a';
const colorFor16: string = '#f69664';
const colorFor32: string = '#f77c5f';
const colorFor64: string = '#f75f3b';
const colorFor128: string = '#edd073';
const colorFor256: string = '#edcc62';
const colorFor512: string = '#edc850';
const colorFor1024: string = '#edc53f';
const colorFor2048: string = '#edc22e';


const cellValueColorBelow8: string= '#776e65';
const cellValueColorMore8: string= '#f9f6f2';

const transitionUp: string = 'up';
const transitionDown: string = 'daown';
const transitionLeft: string = 'left';
const transitionRight: string = 'right';

const lengthBetweenCells: number = 100 / 85 *100; // соотношение длинны класса GameCanvas-CellBackground и GameCanvas-Cell.
const saved2048GamesLC = 'saved2048Games';
const keyboardCeilsControlEvents: string[] = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];

const autoplayNewGame = 'New game';
const autoplayCurentGame = 'Current game';

function insLeadZeroToTimer (timeNumber: number){
  return  (timeNumber < 10 ? "0" : "") + timeNumber.toString();
}

function getPrettyTimeFromSecondsOrMinutes (seconds: number):string {
	return `${insLeadZeroToTimer(Math.floor(seconds / 60))}:${insLeadZeroToTimer(seconds % 60 || 0 )}`
}

export {


	colorForEmty,
	colorFor2,
	colorFor4,
	colorFor8,
	colorFor16,
	colorFor32,
	colorFor64,
	colorFor128,
	colorFor256,
	colorFor512,
	colorFor1024,
	colorFor2048,

	cellValueColorBelow8,
	cellValueColorMore8,

	transitionUp,
	transitionDown,
	transitionLeft,
	transitionRight,

	lengthBetweenCells,
	saved2048GamesLC,
	keyboardCeilsControlEvents,

	autoplayNewGame,
	autoplayCurentGame,


	insLeadZeroToTimer,
	getPrettyTimeFromSecondsOrMinutes,
}