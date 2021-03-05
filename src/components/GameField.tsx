import React from 'react'
import ControlPanel from "./ControlPanel/ControlPanel";
import CurrentGameStatistics from "./CurrentGameStatistics/CurrentGameStatistics";
import GameCanvas from './GameCanvas/GameCanvas'
import SettingsPanel from './SettingsPanel/SettingsPanel'
import Message from './Message/Message'
import useSound from 'use-sound';
import SavedGamesStat from './SavedGamesStat/StatTable'
import {gameCell} from '../Const/generallInterfaces'
import {autoplayNewGame, transitionUp,	transitionDown,	transitionLeft,	transitionRight, saved2048GamesLC, keyboardCeilsControlEvents} from '../Const/generalConsts'

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

type savedGame = {
	gameCells:gameCell[], score:number, cellMerges: number, movedCells:number, gameTime:number, volume:number, fieldSize: number, gameStartTime: string, goal: number, isEffectVolumeMuted:boolean, ismusicVolumeMuted: boolean, efectsVolume:number, musicVolume:number, gameForAutoplay: string
}
function saveGame (gameToSave: savedGame) {
  const arrayOfSavedGames = getSavedGames();
	const currentGameSavedIndex = arrayOfSavedGames.findIndex( (savedGame: savedGame) =>  savedGame.gameStartTime === gameToSave.gameStartTime);

	if (currentGameSavedIndex !== -1 && currentGameSavedIndex === 0) {
		arrayOfSavedGames[currentGameSavedIndex] = 	gameToSave;
	} else {
		if (arrayOfSavedGames.length > 9) {
			arrayOfSavedGames.pop();
		}
		arrayOfSavedGames.unshift(gameToSave);
	}

  localStorage.setItem(saved2048GamesLC, JSON.stringify(arrayOfSavedGames));
}

const getInitialState = (type: string)=> {
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
			case 'gameForAutoplay': return autoplayNewGame;
		}
  } else {
    return  arrayOfSavedGames[0][type];
  }
}

function gameCellsHasValue(arr: gameCell[], value: number | null) {
	return arr.findIndex( (cell) => cell.curValue === value ) !== -1;
}

export default function GameField() {
  const [gameStartTime        , setgameStartTime        ] = React.useState(getInitialState('gameStartTime'))
  const [score				        , setscore								] = React.useState(getInitialState('score'));
  const [cellMerges		        , setcellMerges						] = React.useState(getInitialState('cellMerges'));
  const [movedCells		        , setmovedCells						] = React.useState(getInitialState('movedCells'));
  const [gameTime			        , setgameTime							] = React.useState(getInitialState('gameTime'));
  const [fieldSize		        , setfieldSize						] = React.useState(getInitialState('fieldSize'))
  const [gameCells		        , setGameCells						] = React.useState(getInitialState('gameCells'))
  const [fullScreenButtonValue, setfullScreenButtonValue] = React.useState<string>('Open in fullscreen');
  const [isCellAppearance			, setisCellAppearance			] = React.useState(true);
  const [transitionDirection	, settransitionDirection	] = React.useState('');
	const [isAutoplay						, setisAutoplay						] = React.useState(false);
	const [isShowMessage				, setisShowMessage				] = React.useState(false);
	const [goal									, setgoal									] = React.useState(getInitialState('goal'));
	const [message							, setmessage							] = React.useState('');
	const [volume								, setVolume								] = React.useState(getInitialState('volume'))
	const [efectsVolume					, setfectsVolume					] = React.useState(getInitialState('efectsVolume'))
	const [musicVolume					, setmusicVolume					] = React.useState(getInitialState('musicVolume'))
	const [isEffectVolumeMuted	, setisEffectVolumeMuted	] = React.useState(getInitialState('isEffectVolumeMuted'))
	const [ismusicVolumeMuted		, setismusicVolumeMuted		] = React.useState(getInitialState('ismusicVolumeMuted'))
	const [isShowStatistics			, setisShowStatistics			] = React.useState(false);
	const [gameForAutoplay      , setgameForAutoplay      ] = React.useState(getInitialState('gameForAutoplay'));// todo from saved
	const [pointsSound									] = useSound(points, {volume: efectsVolume});
  const [moveSound										] = useSound(move, {volume: efectsVolume});
  const [clickSound										] = useSound(click, {volume: efectsVolume});
  const [noChangeSound								] = useSound(noChange, {volume: efectsVolume});
	const [looseSound										] = useSound(loose, {volume: efectsVolume});
	const [victorySound									] = useSound(victory, {volume:efectsVolume});
	const [musicSound, {isPlaying, stop}] = useSound(music, {volume: musicVolume});

	const cancalculateCelsNewState  = React.useRef(false);
  const gameWStatAndCanvasWrapper = React.useRef<HTMLDivElement>(null);

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

    if(cancalculateCelsNewState.current) {

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
						if (isAutoplay) {
							setisAutoplay(false)
						}
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
      } else {
				cancalculateCelsNewState.current = true;
			}
    }
  }, [gameCells, pointsSound, moveSound, noChangeSound, looseSound, isAutoplay])

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
		cancalculateCelsNewState.current = true;
  }, [])

	React.useEffect( () => {
		musicSound();
		return () => {stop()};
	}, [musicSound, isPlaying,stop])

  React.useEffect(()=>{
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
    saveGame ( {gameCells, score, cellMerges, movedCells, gameTime, volume, fieldSize, gameStartTime, goal, isEffectVolumeMuted, ismusicVolumeMuted, efectsVolume, musicVolume, gameForAutoplay}) ;
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
			if (gameForAutoplay === autoplayNewGame) {
				newGame();
			}
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

	function togleSavedGamesStatisticsVsibility() {
		setisShowStatistics(!isShowStatistics)
	}

	function gameForAutoplayHandler(gameType: string) {
		setgameForAutoplay(gameType);
	}

  return (
    <div ref={gameWStatAndCanvasWrapper} className='GameField'>
      {/* <div ref={gameWStatAndCanvasWrapper} className='gameWStatAndCanvasWrapper'> */}
      <Message
				isShowMessage={isShowMessage}
				message={message}
				messageOkHandler={messageOkHandler}/>
			<SavedGamesStat
				getSavedGames={getSavedGames}
				isShowStatistics={isShowStatistics}
				/>
			<SettingsPanel
				volume={volume} setVolume={setVolume}
				musicVolume={musicVolume} setmusicVolume={setmusicVolume}
				isEffectVolumeMuted={isEffectVolumeMuted} setisEffectVolumeMuted={setisEffectVolumeMuted}
				ismusicVolumeMuted={ismusicVolumeMuted} setismusicVolumeMuted={setismusicVolumeMuted}
				fieldSize={fieldSize} fieldSizeSelecthandler={fieldSizeSelecthandler}
				goal={goal} goalHandler={goalHandler}
				gameForAutoplay={gameForAutoplay} gameForAutoplayHandler={gameForAutoplayHandler}/>

      <ControlPanel
				newGameHAndler={newGameHAndler}
				toggleFullScreen={toggleFullScreen}
				fullScreenButtonValue={fullScreenButtonValue}
				autoplayHandler={autoplayHandler}
				togleSavedGamesStatisticsVsibility={togleSavedGamesStatisticsVsibility}/>
			<CurrentGameStatistics
				score={score}
				cellMerges={cellMerges}
				movedCells={movedCells}
				gameTime={gameTime}/>
			<GameCanvas
				gameCells={gameCells}
				isCellAppearance={isCellAppearance}
				transitionDirection={transitionDirection}
				cellAnimationEndHandler={cellAnimationEndHandler}
				cellTransitionEndHandler={cellTransitionEndHandler}/>
      {/* </div> */}

    </div>
  )
}
