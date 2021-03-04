import React from 'react'
import "./GameField.css";
import ControlPanel from "./ControlPanel/ControlPanel";
import CurrentGameStatistics from "./CurrentGameStatistics/CurrentGameStatistics";
import GameCanvas from './GameCanvas/GameCanvas'
import SettingsPanel from './SettingsPanel/SettingsPanel'
import useSound from 'use-sound';

import {gameCell} from '../Const/generallInterfaces'
import {transitionUp,	transitionDown,	transitionLeft,	transitionRight, saved2048GamesLC, keyboardCeilsControlEvents} from '../Const/generalConsts'

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
	if (arrOfFilledIndexes.length !== arr.length) {
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
	}

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

function getSavedGames() {
  const savedGame = localStorage.getItem(saved2048GamesLC);
  return savedGame ? JSON.parse(savedGame) : [];
}

function saveGame (gameCells:gameCell[], score:number, cellMerges: number, movedCells:number, gameTime:number, volume:number, fieldSize: number, gameStartTime: string) {
  const gameToSave = { gameCells, score, cellMerges, movedCells, gameTime,volume, fieldSize, gameStartTime};
  const arrayOfSavedGames = getSavedGames();

  if (arrayOfSavedGames.length > 9) {
    arrayOfSavedGames.pop();
  }

  arrayOfSavedGames.unshift(gameToSave);
  localStorage.setItem(saved2048GamesLC, JSON.stringify(arrayOfSavedGames));
}

function getInitialState() {
  let gameCells:gameCell[], score:number, cellMerges: number, movedCells:number, gameTime:number, volume:number, fieldSize: number, gameStartTime: string;
  const arrayOfSavedGames = getSavedGames();

  if (arrayOfSavedGames.length === 0) {
    gameCells = generateNewGame();
    fieldSize = volume = gameTime = movedCells = cellMerges = score = 0 ;
    gameStartTime = new Date().toISOString();
  } else {
    gameCells     = arrayOfSavedGames[0].gameCells
    score      		= arrayOfSavedGames[0].score
    cellMerges    = arrayOfSavedGames[0].cellMerges
    movedCells    = arrayOfSavedGames[0].movedCells
    gameTime      = arrayOfSavedGames[0].gameTime
    volume      	= arrayOfSavedGames[0].volume
    fieldSize     = arrayOfSavedGames[0].fieldSize
    gameStartTime = arrayOfSavedGames[0].gameStartTime
  }
  return {gameCells, score, cellMerges, movedCells, gameTime, volume, fieldSize, gameStartTime}
}
const getinitVolumeLevel = ()=> {
	const arrayOfSavedGames = getSavedGames();
	if (arrayOfSavedGames.length === 0) {
    return 0.5;
  } else {
    return  arrayOfSavedGames[0].volume
  }
}

export default function GameField() {
  const [gameStartTime, setgameStartTime] = React.useState('')
  const [score				, setscore] = React.useState(0);
  const [cellMerges		, setcellMerges] = React.useState(0);
  const [movedCells		, setmovedCells] = React.useState(0);
  const [gameTime			, setgameTime] = React.useState(0);
  const [fieldSize		, setfieldSize] = React.useState(4)
  const [gameCells		, setGameCells] = React.useState(generateNewGame())
  const [fullScreenButtonValue, setfullScreenButtonValue] = React.useState<string>('Open in fullscreen');
  let [isCellAppearance, setisCellAppearance] = React.useState(true);
  let [transitionDirection, settransitionDirection] = React.useState('');
  let cancalculateCelsNewState = React.useRef(false);
  let gameWStatAndCanvasWrapper = React.useRef<HTMLDivElement>(null);
  const [isAutoplay, setisAutoplay] = React.useState(false);

  const [volume, setvolume] = React.useState(getinitVolumeLevel())
  const [pointsSound] = useSound(points, {volume});
  const [moveSound] = useSound(move, {volume});
  const [clickSound] = useSound(click, {volume});
  const [noChangeSound] = useSound(noChange, {volume});

  const keyDownHandler = React.useCallback((e: KeyboardEvent)=>{
    console.log(e);
    if(cancalculateCelsNewState.current) {
      // saveGame (gameCells, score, cellMerges, movedCells, gameTime, volume, fieldSize) ;
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
        } else if (newArr.findIndex( (value) => value.curValue === null) === -1){
					noChangeSound();
					cancalculateCelsNewState.current = true;
				} else {
          setGameCells(insertRandom2or4ValueToEmptyField(gameCells, 1, Math.sqrt(gameCells.length)))
          setisCellAppearance(true);
          noChangeSound();
        }
      }
    }
  }, [gameCells, pointsSound, moveSound, noChangeSound/*, volume, score, cellMerges, movedCells, gameTime, volume, fieldSize*/])

  const newGame = React.useCallback ( ()=> {
    clickSound();
    setisCellAppearance(true)
    setgameStartTime(new Date().toISOString());
    setscore(0);
    setcellMerges(0);
    setmovedCells(0);
    setgameTime(0);
    setGameCells(generateNewGame(fieldSize));
  }, [fieldSize, clickSound])

  React.useEffect(() => {
    const {gameCells, score, cellMerges, movedCells, gameTime, /*volume,*/ fieldSize, gameStartTime} = getInitialState();
    setgameStartTime(gameStartTime);
    setscore(score)
    setcellMerges(cellMerges)
    setmovedCells(movedCells)
    setgameTime(gameTime)
    setfieldSize(fieldSize)
    setGameCells(gameCells)
		cancalculateCelsNewState.current = true;
    // setvolume( volume) почему-то не устанавливало уровень звука в useEffect
  }, [])

  React.useEffect(()=>{
		console.log('mouse event effect')
    window.addEventListener('keydown',keyDownHandler);
    return () =>  window.removeEventListener('keydown',keyDownHandler);
  },[keyDownHandler])

  React.useEffect(()=>{
    const timeIncrementInterval = setInterval(()=> setgameTime((curTime)=> Math.floor(curTime + 1)), 1000)
    return () =>  clearInterval(timeIncrementInterval);
  },[gameStartTime])

  React.useEffect(() => {
    let interval: any;
    if (isAutoplay) {
      const getRandomKeyDownevent = ()=> {
        return new KeyboardEvent('keydown', {key: keyboardCeilsControlEvents[getRandomNumber(4)]});
      }
      interval = setInterval(() => window.dispatchEvent(getRandomKeyDownevent()) , 1000);
    }
    return () =>  clearInterval(interval);
  }, [isAutoplay])

  function newGameHAndler() {
    setisAutoplay(false);
    newGame();
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
    setisCellAppearance(false)
    setGameCells(gameCells.map( (cell:gameCell) => {
      cell.prevValue = null;
      cell.isUpdatedOrNew = false;
      cell.path = 0;
      return cell;
    }));
    saveGame (gameCells, score, cellMerges, movedCells, gameTime, volume, fieldSize, gameStartTime) ;
    cancalculateCelsNewState.current = true;
  }

  function cellTransitionEndHandler (){
    setGameCells(insertRandom2or4ValueToEmptyField(gameCells, 1, Math.sqrt(gameCells.length)));
    setisCellAppearance(true);
    settransitionDirection('');
  }

  function fieldSizeSelecthandler(newFieldSize: number) {
    setfieldSize(newFieldSize);
  }

  function autoplayHandler() {
    if (!isAutoplay) {
			newGame();
		}
    setisAutoplay(!isAutoplay);
  }

  return (
    <div ref={gameWStatAndCanvasWrapper} className='GameField'>
      {/* <div ref={gameWStatAndCanvasWrapper} className='gameWStatAndCanvasWrapper'> */}
      <SettingsPanel volume={volume} setvolume={setvolume} fieldSize={fieldSize} fieldSizeSelecthandler={fieldSizeSelecthandler} />
      <ControlPanel newGameHAndler={newGameHAndler} toggleFullScreen={toggleFullScreen} fullScreenButtonValue={fullScreenButtonValue} autoplayHandler={autoplayHandler}/>

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
