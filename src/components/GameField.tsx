import React from 'react'
import "./GameField.css";
import ControlPanel from "./ControlPanel/ControlPanel";
import CurrentGameStatistics from "./CurrentGameStatistics/CurrentGameStatistics";
import GameCanvas from './GameCanvas/GameCanvas'
import SettingsPanel from './SettingsPanel/SettingsPanel'
import useSound from 'use-sound';

import {gameCell} from '../Const/generallInterfaces'
import {transitionUp,	transitionDown,	transitionLeft,	transitionRight} from '../Const/generalConsts'

import points from '../sounds/points.wav'
import move from '../sounds/move.wav'
import click from'../sounds/click.mp3'
import noChange from '../sounds/noChange.flac'


const Events: string[] = [transitionUp,	transitionDown,	transitionLeft,	transitionRight]

function getRandomNumber(maxValue: number): number{
	return Math.floor(Math.random() * maxValue);
}

function getRandom2Or4Value(): gameCell{
	const isTwo: boolean = Math.floor(Math.random() * 10) < 9;
	return isTwo ? {	curValue: 2, prevValue: null, isUpdatedOrNew: true, path: 0} : {curValue: 4, prevValue: null, isUpdatedOrNew: true, path: 0};
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
	return {curValue: null, prevValue: null, isUpdatedOrNew: false, path: 0};
}

function generateNewGame(fieldSize : number = 4): gameCell[]{
	const numOfInsertedValuesOnNewGame = 2;

	let array:gameCell[] = new Array(fieldSize ** 2).fill(getEmptyGameCell());

	for (let index = 0; index < array.length; index++) {
		array[index] = getEmptyGameCell();
	}

	array = insertRandom2or4ValueToEmptyField(array, numOfInsertedValuesOnNewGame, fieldSize);

	return array;
}



function calculateNewCellsState(gameCellsToChange:gameCell[], direction: string) :{isArrChanged: boolean, newArr :gameCell[], points: number, cellMerges: number, movedCells: number}{
	const newArr = gameCellsToChange;
	let isArrChanged: boolean = false;
	let points: number = 0;
	let cellMerges : number = 0;
	let movedCells: number = 0;
	const size = Math.sqrt(newArr.length);
	let mainAxisStartIndex: number = 0;
	let mainAxisOffset: number = 0;
	let crossAxisOffset: number = 0;
	let mainAxisLastIndex: number = 0;

	switch (direction) {
		case transitionUp: {
			mainAxisStartIndex = 0;
			mainAxisLastIndex = size - 1;
			mainAxisOffset = 1;
			crossAxisOffset = size;
			break;
		}

		case transitionDown: {
			mainAxisStartIndex = newArr.length - size;
			mainAxisLastIndex = newArr.length - 1;
			mainAxisOffset = 1;
			crossAxisOffset = -size;
			break;
		}

		case transitionLeft: {
			mainAxisStartIndex = 0;
			mainAxisLastIndex = newArr.length - size;
			mainAxisOffset = size;
			crossAxisOffset = 1;
			break;
		}

		case transitionRight: {
			mainAxisStartIndex = size - 1;
			mainAxisLastIndex = newArr.length - 1;
			mainAxisOffset = size;
			crossAxisOffset = -1;
			break;
		}
		default: {}
	}

	newArr.forEach(cell => cell.prevValue = cell.curValue);

	for (let curColumnIndex = mainAxisStartIndex; curColumnIndex <= mainAxisLastIndex; curColumnIndex += mainAxisOffset) {
		const testArr = [];

		for (let iteration = 0; iteration < size; iteration++) {
			testArr.push(curColumnIndex + crossAxisOffset * iteration)
		}

			for (let srcCellIndexForMove = curColumnIndex + crossAxisOffset; testArr.includes(srcCellIndexForMove); srcCellIndexForMove += crossAxisOffset) {

				let curCheckRowNumber: number = 0;
				let processAnalysis: boolean = true;

				while(processAnalysis) {
					const srcCellIndex: number = srcCellIndexForMove - (curCheckRowNumber * crossAxisOffset);
					const srcCell: gameCell = newArr[srcCellIndex];

					const dstCellIndex:number = srcCellIndex - crossAxisOffset;
					const dstCell:gameCell = newArr[dstCellIndex];


					if (!srcCell || !dstCell || !testArr.includes(srcCellIndex) || !testArr.includes(dstCellIndex)) {
						break;
					}

					if ( srcCell.curValue ){
						if (dstCell !== undefined && (dstCell.curValue === null || (dstCell.curValue === srcCell.curValue && dstCell.isUpdatedOrNew === false && srcCell.isUpdatedOrNew === false))){

							if (dstCell.curValue === null) {
								dstCell.curValue = 	srcCell.curValue;
							} else {
								dstCell.curValue = dstCell.curValue * 2 ;
								dstCell.isUpdatedOrNew = true;
								points = +dstCell.curValue;
								cellMerges += 1;
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

			if (newArr[srcCellIndexForMove].path > 0) {
				movedCells +=1
			}
		}
	}
	return { isArrChanged, newArr, points, cellMerges, movedCells};
}

function getCellsTransitionDirection(eventName: string): string {

	switch(eventName){
		case 'ArrowUp': return transitionUp;
		case 'ArrowDown': return transitionDown;
		case 'ArrowRight': return transitionRight;
		case 'ArrowLeft': return transitionLeft;
		default: return '';
	}
}

export default function GameField() {
	const [gameStartTime, setgameStartTime] = React.useState(new Date().toISOString())//todo from storage
	const [score, setscore] = React.useState(0);//todo from storage
	const [cellMerges, setcellMerges] = React.useState(0);//todo from storage
	const [movedCells, setmovedCells] = React.useState(0);//todo from storage
	const [gameTime, setgameTime] = React.useState(0);//todo from storage
	const [gameCells, setGameCells] = React.useState(generateNewGame())
	const [fullScreenButtonValue, setfullScreenButtonValue] = React.useState<string>('Open in fullscreen');
	let [isCellAppearance, setisCellAppearance] = React.useState(true);
	let [transitionDirection, settransitionDirection] = React.useState('');
	let cancalculateCelsNewState = React.useRef(false);
	let gameWStatAndCanvasWrapper = React.useRef<HTMLDivElement>(null);

	const [volume, setvolume] = React.useState(1)
	const [pointsSound] = useSound(points, {volume});
	const [moveSound] = useSound(move, {volume});
	const [clickSound] = useSound(click, {volume});
	const [noChangeSound] = useSound(noChange, {volume});

	const keyDownHandler = React.useCallback((e: KeyboardEvent)=>{
		if(cancalculateCelsNewState.current) {
			cancalculateCelsNewState.current = false;
			const cellTransitionDirection: string = getCellsTransitionDirection(e.key);

			if (Events.includes(cellTransitionDirection)) {

				const {isArrChanged, newArr, points, cellMerges, movedCells } = calculateNewCellsState(gameCells, cellTransitionDirection);

				if (isArrChanged) {
					setGameCells([...newArr])
					settransitionDirection(cellTransitionDirection);
					setscore( (curValue) => curValue + points);
					setcellMerges( (curValue) => curValue + cellMerges);
					setmovedCells((curValue) => curValue + movedCells);
					if (points) {
						pointsSound();
					} else {
						moveSound();
					}
				} else {
					setGameCells(insertRandom2or4ValueToEmptyField(gameCells, 1, Math.sqrt(gameCells.length)))
					setisCellAppearance(true);
					noChangeSound();
				}
			}
		}
	}, [gameCells])


	React.useEffect(()=>{
		window.addEventListener('keydown',keyDownHandler);
		return () =>  window.removeEventListener('keydown',keyDownHandler);
	},[keyDownHandler])

	React.useEffect(()=>{
		const timeIncrementInterval = setInterval(()=> setgameTime((curTime)=> Math.floor(curTime + 1)), 1000)
		return () =>  clearInterval(timeIncrementInterval);
	},[gameStartTime])

	function newGameHAndler() {
		clickSound();
		setGameCells(generateNewGame());
		setisCellAppearance(true)
		setscore(0);
		setcellMerges(0);
		setmovedCells(0);
		setgameTime(0);
		setgameStartTime(new Date().toISOString())
	}

	function toggleFullScreen() {
		clickSound();
		if(document.fullscreenElement){
			document.exitFullscreen();
			setfullScreenButtonValue('Open in fullscreen');
		} else {
			if (gameWStatAndCanvasWrapper.current !== null) {
				gameWStatAndCanvasWrapper.current.requestFullscreen();
				setfullScreenButtonValue('Close fullscreen');
			}
		}
	}

	function cellAnimationEndHandler(){
		// pointsSound();
		// moveSound()
		setisCellAppearance(false)
		setGameCells(gameCells.map( (cell) => {
			cell.prevValue = null;
			cell.isUpdatedOrNew = false;
			cell.path = 0;
			return cell;
		}));
		cancalculateCelsNewState.current = true;
	}

	function cellTransitionEndHandler (){

		setGameCells(insertRandom2or4ValueToEmptyField(gameCells, 1, Math.sqrt(gameCells.length)));
		setisCellAppearance(true);
		settransitionDirection('');
	}

	return (
		<div ref={gameWStatAndCanvasWrapper} className='GameField'>
			{/* <div ref={gameWStatAndCanvasWrapper} className='gameWStatAndCanvasWrapper'> */}
			<SettingsPanel volume={volume} setvolume={setvolume}/>
			<ControlPanel newGameHAndler={newGameHAndler} toggleFullScreen={toggleFullScreen} fullScreenButtonValue={fullScreenButtonValue}/>

				<CurrentGameStatistics
					score={score}
					cellMerges={cellMerges}
					movedCells={movedCells}
					gameTime={gameTime}
				/>
				<GameCanvas
					gameCells={gameCells}
					isCellAppearance={isCellAppearance}
					transitionDirection={transitionDirection}
					cellAnimationEndHandler={cellAnimationEndHandler}
					cellTransitionEndHandler={cellTransitionEndHandler}
				/>
			{/* </div> */}

		</div>
	)
}
