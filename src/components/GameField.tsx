import React from 'react'
import "./GameField.css";
import ControlPanel from "./ControlPanel/ControlPanel";
import CurrentGameStatistics from "./CurrentGameStatistics/CurrentGameStatistics";
import GameCanvas from './GameCanvas/GameCanvas'

import {gameCell} from '../Const/generallInterfaces'
import { colorForEmty, colorFor2, colorFor4, colorFor8, colorFor16,	colorFor32,	colorFor64,	colorFor128, colorFor256,} from '../Const/generalConsts'

function getRandomNumber(maxValue: number): number{
	return Math.floor(Math.random() * maxValue);
}

function getRandom2Or4Value(): gameCell{
	const isTwo: boolean = Math.floor(Math.random() * 10) < 9;
	return isTwo ? {value: 2, color: colorFor2} : {value: 4, color: colorFor4};
}

function insertRandom2or4ValueToEmptyField(arr: gameCell[], numOfInserts: number, fieldSize: number): {indexForInsert:number, gameCell: gameCell}[]{
	const newGameCell: {indexForInsert:number, gameCell: gameCell}[] = [];
	const arrOfEmptyIndexes: number[] = [];

	for (let index = 0; index < arr.length; index++) {
		if(arr[index] === null) {
			arrOfEmptyIndexes.push(index);
		}
	}

	for(let i: number = 1; i <= numOfInserts; i += 1) {
		let searcValue: boolean = true;

		while(searcValue) {
			let indexForInsert: number = getRandomNumber(fieldSize ** 2);
			if(!arrOfEmptyIndexes.includes(indexForInsert)) {
				searcValue = false;
				arrOfEmptyIndexes.push(indexForInsert)
				newGameCell.push({indexForInsert, gameCell: getRandom2Or4Value()});
			}
		}
	}

	return newGameCell;
}

function generateNewGame(fieldSize : number = 4): gameCell[]{
	const emptyGameCell : gameCell = {
		value:null,
		color: colorForEmty
	}
	const numOfInsertedValuesOnNewGame = 2;

	const array:gameCell[] = new Array(fieldSize ** 2).fill(emptyGameCell);
	const valuesForInsert: {indexForInsert:number, gameCell: gameCell}[] = insertRandom2or4ValueToEmptyField(array, /*numOfInsertedValuesOnNewGame*/ 12, fieldSize);

	valuesForInsert.forEach( (value) => array[value.indexForInsert] = value.gameCell);

	return array;
}

let i:number = 1;
export default function GameField() {
	const [gameCells, setGameCells] = React.useState(generateNewGame())
	const [isCellTransition,  setisCellTransition] = React.useState(false);

	// let animateCellAppearance = isCellTransition ? false : true;
	// let animateCellTransition = isCellTransition ? true : false;
	let [animateCellAppearance, setanimateCellAppearance] = React.useState(true);
	let [animateCellTransition, setanimateCellTransition] = React.useState(false);

	function newGameHAndler() {
		setGameCells(generateNewGame());
		// setisCellTransition(false);
		setanimateCellAppearance(true)
	}

	function animationEndHandler(){
		// setisCellTransition(true);
		setanimateCellAppearance(false)
		console.log(321)
	}

	return (
		<div className='GameField'>
			<ControlPanel newGameHAndler={newGameHAndler}/>
			<CurrentGameStatistics/>
			<GameCanvas gameCells={gameCells} animateCellAppearance={animateCellAppearance} animateCellTransition={animateCellTransition} animationEndHandler={animationEndHandler}/>
		</div>
	)
}
