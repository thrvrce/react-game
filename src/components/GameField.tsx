import React from 'react'
// import "./GameField.css";
import ControlPanel from "./ControlPanel/ControlPanel";
import CurrentGameStatistics from "./CurrentGameStatistics/CurrentGameStatistics";
import GameCanvas from './GameCanvas/GameCanvas'
import SettingsPanel from './SettingsPanel/SettingsPanel'
import Message from './Message/Message'
import useSound from 'use-sound';

import {gameCell} from '../Const/generallInterfaces'
import {transitionUp,	transitionDown,	transitionLeft,	transitionRight, saved2048GamesLC, keyboardCeilsControlEvents} from '../Const/generalConsts'

import points from '../sounds/points.wav'
import move from '../sounds/move.wav'
import click from'../sounds/click.mp3'
import noChange from '../sounds/noChange.flac'
import loose from '../sounds/loose.mp3'
import victory from '../sounds/victory.wav'
import music from '../sounds/music.mp3'


const directions: string[] = [transitionUp,	transitionDown,	transitionLeft,	transitionRight]

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
  const newArr:gameCell[] = JSON.parse(JSON.stringify(gameCellsToChange));
	console.log(newArr === gameCellsToChange)
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

function solvabilityСheck (arrForChec: gameCell[]) {
	for (let index = 0; index < directions.length; index++) {
		const {isArrChanged} = calculateNewCellsState(arrForChec, directions[index]);
		if (isArrChanged) {
			return true;
		}
	}
	return false;
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

function saveGame (gameCells:gameCell[], score:number, cellMerges: number, movedCells:number, gameTime:number, volume:number, fieldSize: number, gameStartTime: string, goal: number, isEffectVolumeMuted:boolean, ismusicVolumeMuted: boolean, efectsVolume:number, musicVolume:number) {
  const gameToSave = { gameCells, score, cellMerges, movedCells, gameTime,volume, fieldSize, gameStartTime, goal, isEffectVolumeMuted, ismusicVolumeMuted, efectsVolume, musicVolume};
  const arrayOfSavedGames = getSavedGames();

  if (arrayOfSavedGames.length > 9) {
    arrayOfSavedGames.pop();
  }

  arrayOfSavedGames.unshift(gameToSave);
  localStorage.setItem(saved2048GamesLC, JSON.stringify(arrayOfSavedGames));
}

// function getInitialState() {
//   let gameCells:gameCell[], score:number, cellMerges: number, movedCells:number, gameTime:number, volume:number, fieldSize: number, gameStartTime: string, goal:number, isEffectVolumeMuted: boolean, ismusicVolumeMuted: boolean, efectsVolume:number, musicVolume:number;
//   const arrayOfSavedGames = getSavedGames();

//   if (arrayOfSavedGames.length === 0) {
//     gameCells = generateNewGame();
//     musicVolume = efectsVolume = volume = gameTime = movedCells = cellMerges = score = 0 ;
//     gameStartTime = new Date().toISOString();
// 		fieldSize = 4;
// 		goal = 2048;
// 		isEffectVolumeMuted = ismusicVolumeMuted = false;
//   } else {
//     gameCells     = arrayOfSavedGames[0].gameCells
//     score      		= arrayOfSavedGames[0].score
//     cellMerges    = arrayOfSavedGames[0].cellMerges
//     movedCells    = arrayOfSavedGames[0].movedCells
//     gameTime      = arrayOfSavedGames[0].gameTime
//     volume      	= arrayOfSavedGames[0].volume
//     fieldSize     = arrayOfSavedGames[0].fieldSize
//     gameStartTime = arrayOfSavedGames[0].gameStartTime
// 		goal					= arrayOfSavedGames[0].goal;
// 		isEffectVolumeMuted = arrayOfSavedGames[0].isEffectVolumeMuted;
// 		ismusicVolumeMuted = arrayOfSavedGames[0].ismusicVolumeMuted
// 		efectsVolume = arrayOfSavedGames[0].efectsVolume
// 		musicVolume = arrayOfSavedGames[0].musicVolume
//   }
//   return {gameCells, score, cellMerges, movedCells, gameTime, volume, fieldSize, gameStartTime, goal, isEffectVolumeMuted, ismusicVolumeMuted, efectsVolume, musicVolume}
// }
const getinitVolumeLevel = (type: string)=> {
	const arrayOfSavedGames = getSavedGames();
	if (arrayOfSavedGames.length === 0) {
    switch(type){
			case 'gameStartTime': return new Date().toISOString();
			case 'score' :
			case 'cellMerges' :
			case 'movedCells':
			case 'gameTime' : return 0;

			case 'fieldSize': return 4;
			case 'gameCells': return generateNewGame();
			case 'goal': return 2048;

			case 'musicVolume' :
			case 'efectsVolume' :
			case 'volume' : return 0.5;

			case 'isEffectVolumeMuted':
			case 	'ismusicVolumeMuted': return false;
		}
  } else {
    return  arrayOfSavedGames[0][type];
  }
}

function gameCellsHasValue(arr: gameCell[], value: number | null) {
	return arr.findIndex( (cell) => cell.curValue === value ) !== -1;
}
export default function GameField() {
  const [gameStartTime, setgameStartTime] = React.useState(getinitVolumeLevel('gameStartTime'))
  const [score				, setscore] = React.useState(getinitVolumeLevel('score'));
  const [cellMerges		, setcellMerges] = React.useState(getinitVolumeLevel('cellMerges'));
  const [movedCells		, setmovedCells] = React.useState(getinitVolumeLevel('movedCells'));
  const [gameTime			, setgameTime] = React.useState(getinitVolumeLevel('gameTime'));
  const [fieldSize		, setfieldSize] = React.useState(getinitVolumeLevel('fieldSize'))
  const [gameCells		, setGameCells] = React.useState(getinitVolumeLevel('gameCells'))
  const [fullScreenButtonValue, setfullScreenButtonValue] = React.useState<string>('Open in fullscreen');
  let [isCellAppearance, setisCellAppearance] = React.useState(true);
  let [transitionDirection, settransitionDirection] = React.useState('');
	const [isAutoplay, setisAutoplay] = React.useState(false);
	const [isShowMessage, setisShowMessage] = React.useState(false);
	const [goal, setgoal] = React.useState(getinitVolumeLevel('goal'));
	const [message, setmessage] = React.useState('');
  let cancalculateCelsNewState = React.useRef(false);
  let gameWStatAndCanvasWrapper = React.useRef<HTMLDivElement>(null);


  const [volume, setVolume] = React.useState(getinitVolumeLevel('volume'))
	const [efectsVolume, setfectsVolume] = React.useState(getinitVolumeLevel('efectsVolume'))
	const [musicVolume, setmusicVolume] = React.useState(getinitVolumeLevel('musicVolume'))
	const [isEffectVolumeMuted, setisEffectVolumeMuted] = React.useState(getinitVolumeLevel('isEffectVolumeMuted'))//todo load
	const [ismusicVolumeMuted, setismusicVolumeMuted] = React.useState(getinitVolumeLevel('ismusicVolumeMuted'))//todo load
  const [pointsSound] = useSound(points, {volume: efectsVolume});
  const [moveSound] = useSound(move, {volume: efectsVolume});
  const [clickSound] = useSound(click, {volume: efectsVolume});
  const [noChangeSound] = useSound(noChange, {volume: efectsVolume});
	const [looseSound] = useSound(loose, {volume: efectsVolume});
	const [victorySound] = useSound(victory, {volume:efectsVolume});
	const [musicSound, {isPlaying}] = useSound(music, {volume: musicVolume});

	React.useEffect( ()=> {
		if (isEffectVolumeMuted) {
			setfectsVolume(0);
		} else {
			setfectsVolume(volume);
		}
		if (ismusicVolumeMuted) {
			setmusicVolume(0);
		}	else {
			setmusicVolume(volume);
		}
	}, [volume, isEffectVolumeMuted, ismusicVolumeMuted])

  const keyDownHandler = React.useCallback((e: KeyboardEvent)=>{
    console.log(e);
    if(cancalculateCelsNewState.current) {
      // saveGame (gameCells, score, cellMerges, movedCells, gameTime, volume, fieldSize) ;
      cancalculateCelsNewState.current = false;
      const cellTransitionDirection: string = getCellsTransitionDirection(e.key);
      if (directions.includes(cellTransitionDirection)) {
        const {isArrChanged, newArr, points, cellMerges, movedCells } = calculateNewCellsState(gameCells, cellTransitionDirection);
        if (isArrChanged) {
          setGameCells([...newArr])
          settransitionDirection(cellTransitionDirection);
          setscore( (curValue:number) => curValue + points);
          setcellMerges( (curValue:number) => curValue + cellMerges);
          setmovedCells((curValue:number) => curValue + movedCells);
          if (points) {
            pointsSound();
          } else {
            moveSound();
          }
        } else if (!gameCellsHasValue(gameCells, null)){
					if (solvabilityСheck(gameCells)) {
						noChangeSound();
						cancalculateCelsNewState.current = true;
					} else {
						setmessage('You loose (no available moves)');
						setisShowMessage(true);
						looseSound();
						cancalculateCelsNewState.current = true;
					}
				} else {
          setGameCells(insertRandom2or4ValueToEmptyField(gameCells, 1, Math.sqrt(gameCells.length)))
          setisCellAppearance(true);
          noChangeSound();
        }
      }
    }
  }, [gameCells, pointsSound, moveSound, noChangeSound, looseSound/*, volume, score, cellMerges, movedCells, gameTime, volume, fieldSize*/])

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
    // const {gameCells, score, cellMerges, movedCells, gameTime, /*volume,*/ fieldSize, gameStartTime, goal, isEffectVolumeMuted, ismusicVolumeMuted} = getInitialState();
    // setgameStartTime(gameStartTime);
    // setscore(score)
    // setcellMerges(cellMerges)
    // setmovedCells(movedCells)
    // setgameTime(gameTime)
    // setfieldSize(fieldSize)
    // setGameCells(gameCells)
		// setgoal(goal);
		// setisEffectVolumeMuted(isEffectVolumeMuted);
		// setismusicVolumeMuted(ismusicVolumeMuted);
		cancalculateCelsNewState.current = true;
    // setVolume( volume) почему-то не устанавливало уровень звука в useEffect
  }, [])

	React.useEffect( () => {
		musicSound();
		// setInterval(musicSound, duration ? duration : 1000)
		// musicSound();
	}, [musicSound, isPlaying])//isPlaying duration

  React.useEffect(()=>{
		console.log('mouse event effect')
    window.addEventListener('keydown',keyDownHandler);
    return () =>  window.removeEventListener('keydown',keyDownHandler);
  },[keyDownHandler])

  React.useEffect(()=>{
    const timeIncrementInterval = setInterval(()=> setgameTime((curTime:number)=> Math.floor(curTime + 1)), 1000)
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
    saveGame (gameCells, score, cellMerges, movedCells, gameTime, volume, fieldSize, gameStartTime, goal, isEffectVolumeMuted, ismusicVolumeMuted, efectsVolume, musicVolume) ;
		if(gameCellsHasValue(gameCells, Number(goal))) {
			victorySound();
			if (isAutoplay) {
				setisAutoplay(false)
				setmessage(`Wow, autoplay reach ${goal}!`);
			} else {
				setmessage(`Goal ${goal} reached! Try change goal and continue`);
			}
			setisShowMessage(true);
		} else {

		}
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

	function messageOkHandler() {
		setmessage('');
		setisShowMessage(false);
	}

	function goalHandler(newGoal: number) {
		setgoal(newGoal);
	}
  return (
    <div ref={gameWStatAndCanvasWrapper} className='GameField'>
      {/* <div ref={gameWStatAndCanvasWrapper} className='gameWStatAndCanvasWrapper'> */}
      <Message isShowMessage={isShowMessage} message={message} messageOkHandler={messageOkHandler}/>
			<SettingsPanel
			volume={volume} setVolume={setVolume}
			musicVolume={musicVolume} setmusicVolume={setmusicVolume}
			isEffectVolumeMuted={isEffectVolumeMuted} setisEffectVolumeMuted={setisEffectVolumeMuted}
			ismusicVolumeMuted={ismusicVolumeMuted} setismusicVolumeMuted={setismusicVolumeMuted}
			fieldSize={fieldSize} fieldSizeSelecthandler={fieldSizeSelecthandler}
			goal={goal} goalHandler={goalHandler}/>
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
