import React from 'react'
import "./GameField.css";
import ControlPanel from "./ControlPanel/ControlPanel";
import CurrentGameStatistics from "./CurrentGameStatistics/CurrentGameStatistics";
import GameCanvas from './GameCanvas/GameCanvas'

import {gameCell} from '../Const/generallInterfaces'


function getRandomNumber(maxValue: number): number{
	return Math.floor(Math.random() * maxValue);
}

function getRandom2Or4Value(): gameCell{
	const isTwo: boolean = Math.floor(Math.random() * 10) < 9;
	return isTwo ? {	curValue: 2, prevValue: null, isMerged: false, path: 0} : {curValue: 4, prevValue: null, isMerged: false, path: 0};
}

function insertRandom2or4ValueToEmptyField(arr: gameCell[], numOfInserts: number, fieldSize: number):  gameCell[]{
	const newGameCell: {indexForInsert:number, gameCell: gameCell}[] = [];
	const arrOfFilledIndexes: number[] = [];

	for (let index = 0; index < arr.length; index++) {
		if(arr[index].curValue !== null) {
			arrOfFilledIndexes.push(index);
		}
	}

	for(let i: number = 1; i <= numOfInserts; i += 1) {
		let searcValue: boolean = true;

		while(searcValue) {
			let indexForInsert: number = getRandomNumber(fieldSize ** 2);
			if(!arrOfFilledIndexes.includes(indexForInsert)) {
				searcValue = false;
				arrOfFilledIndexes.push(indexForInsert)
				newGameCell.push({indexForInsert, gameCell: getRandom2Or4Value()});
			}
		}
	}

	newGameCell.forEach( (value) => arr[value.indexForInsert] = value.gameCell)
	return arr;
}

function getEmptyGameCell(): gameCell{
	// return {curValue: null, prevValue: null, isMerged: false, path: 0};
	return {curValue: null, prevValue: null, isMerged: false, path: 0};
}

function generateNewGame(fieldSize : number = 4): gameCell[]{
	//const emptyGameCell : gameCell = {curValue: null, prevValue: null, isMerged: false, path: 0}
	const numOfInsertedValuesOnNewGame = 2;

	let array:gameCell[] = new Array(fieldSize ** 2).fill(getEmptyGameCell());

	for (let index = 0; index < array.length; index++) {
		array[index] = getEmptyGameCell();
	}

	// const valuesForInsert: {indexForInsert:number, gameCell: gameCell}[] =
	array = insertRandom2or4ValueToEmptyField(array, numOfInsertedValuesOnNewGame, fieldSize);

	// valuesForInsert.forEach( (value) => array[value.indexForInsert] = value.gameCell);

	return array;
}



function calculateNewCellsState(gameCellsToChange:gameCell[]) :{isArrChanged: boolean, newArr :gameCell[]}{
	const newArr = gameCellsToChange;
	let isArrChanged: boolean = false;
	const size = 4;
	let collumnStartIndex: number = 0;
	let horizontalOffset: number = 0;
	let verticalOffset: number = 0;
	let lastColumnIndex: number = 0;

	if ('ArrowUp' === 'ArrowUp') {
		collumnStartIndex = 0;
		horizontalOffset = 1;
		verticalOffset = size;
		lastColumnIndex = size - 1;
	}

	newArr.forEach(cell => cell.prevValue = cell.curValue);

	for (let curColumnIndex = collumnStartIndex; curColumnIndex <= lastColumnIndex; curColumnIndex += horizontalOffset) {
		for (let srcCellIndexForMove = curColumnIndex + verticalOffset; srcCellIndexForMove < newArr.length; srcCellIndexForMove += verticalOffset) {

			// newArr[srcCellIndexForMove].prevValue = newArr[srcCellIndexForMove].curValue;

				let curCheckRowNumber: number = 0;
				let processAnalysis: boolean = true;

				while(processAnalysis) {
					const srcCellIndex: number = srcCellIndexForMove - (curCheckRowNumber * verticalOffset);
					const srcCell: gameCell = newArr[srcCellIndex];

					if (!srcCell) {
						break;
					}

					if ( srcCell.curValue ){
						const dstCellIndex:number = srcCellIndex - verticalOffset;
						const dstCell:gameCell = newArr[dstCellIndex];

						if (dstCell !== undefined && (dstCell.curValue === null || (dstCell.curValue === srcCell.curValue && dstCell.isMerged === false && srcCell.isMerged === false))){

							if (dstCell.curValue === null) {
								dstCell.curValue = 	srcCell.curValue;
							} else {
								dstCell.prevValue = dstCell.curValue;
								dstCell.curValue = dstCell.curValue * 2 ;
								dstCell.isMerged = true;
							}

							srcCell.curValue = null;
							newArr[srcCellIndexForMove].path += 1;
							curCheckRowNumber += 1;
							isArrChanged = true;
						} else {
							processAnalysis = false;
						}
				} else {
					curCheckRowNumber += 1;
				}
			}
		}
	}
	return { isArrChanged, newArr };
}


export default function GameField() {
	const [gameCells, setGameCells] = React.useState(generateNewGame())

	// let isCellAppearance = isCellTransition ? false : true;
	// let isCellTransition = isCellTransition ? true : false;
	let [isCellAppearance, setisCellAppearance] = React.useState(true);
	let [isCellTransition, setisCellTransition] = React.useState(false);

	const keyDownHandler = React.useCallback((e: KeyboardEvent)=>{
		if (e.key === 'ArrowUp') {
			console.log(e.key)
			const {isArrChanged, newArr } = calculateNewCellsState(gameCells);
			if (isArrChanged) {
				setGameCells([...newArr])
				setisCellTransition(true);
			} else {
				setGameCells(insertRandom2or4ValueToEmptyField(gameCells, 1, Math.sqrt(gameCells.length)))
				setisCellAppearance(true);
			}

		}
	}, [gameCells])

	React.useEffect(()=>{
		window.addEventListener('keydown',keyDownHandler);
		return () =>  window.removeEventListener('keydown',keyDownHandler);
	},[keyDownHandler])

	function newGameHAndler() {
		setGameCells(generateNewGame());
		// setisCellTransition(false);
		setisCellAppearance(true)

	}

	function cellAnimationEndHandler(){
		// setisCellTransition(true);
		setisCellAppearance(false)
		setGameCells(gameCells.map( (cell) => {
			cell.prevValue = null;
			cell.isMerged = false;
			cell.path = 0;
			return cell;
		}));
		console.log(321)
	}

	function cellTransitionEndHandler (){
		setGameCells(insertRandom2or4ValueToEmptyField(gameCells, 1, Math.sqrt(gameCells.length)));

		setisCellAppearance(true);
		setisCellTransition(false);
	}

	return (
		<div className='GameField'>
			<ControlPanel newGameHAndler={newGameHAndler}/>
			<CurrentGameStatistics/>
			<GameCanvas
			gameCells={gameCells}
			isCellAppearance={isCellAppearance}
			isCellTransition={isCellTransition}
			cellAnimationEndHandler={cellAnimationEndHandler}
			cellTransitionEndHandler={cellTransitionEndHandler}
			/>
		</div>
	)
}
