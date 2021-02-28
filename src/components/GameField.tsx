import React from 'react'
import "./GameField.css";
import ControlPanel from "./ControlPanel/ControlPanel";
import CurrentGameStatistics from "./CurrentGameStatistics/CurrentGameStatistics";
import GameCanvas from './GameCanvas/GameCanvas'

import {gameCell} from '../Const/generallInterfaces'
import {
	colorForEmty,
	colorFor2,
	colorFor4,
	colorFor8,
	colorFor16,
	colorFor32,
	colorFor64,
	colorFor128,
	colorFor256,
} from '../Const/generalConsts'

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
	const valuesForInsert: {indexForInsert:number, gameCell: gameCell}[] = insertRandom2or4ValueToEmptyField(array, numOfInsertedValuesOnNewGame, fieldSize);

	valuesForInsert.forEach( (value) => array[value.indexForInsert] = value.gameCell);

	return array;
}


export default function GameField() {
	return (
		<div className='GameField'>
			<ControlPanel/>
			<CurrentGameStatistics/>
			<GameCanvas gameCells={generateNewGame()}/>
		</div>
	)
}
