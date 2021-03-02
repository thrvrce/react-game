import React, { CSSProperties } from "react";
import './GameCanvas.css'
import {gameCell} from '../../Const/generallInterfaces'
import { cellValueColorBelow8, cellValueColorMore8, colorForEmty, colorFor2, colorFor4, colorFor8, colorFor16,	colorFor32,	colorFor64,	colorFor128, colorFor256, transitionUp,	transitionDown,	transitionLeft,	transitionRight, lengthBetweenCells} from '../../Const/generalConsts'

interface props {gameCells: gameCell[], isCellAppearance: boolean, transitionDirection: string, cellAnimationEndHandler: Function, cellTransitionEndHandler: Function};

function calcBgColor(value: number | null): string{
	let result: string = '';
	switch(value) {
		case 2 : result = colorFor2; break;
		case 4 : result = colorFor4; break;
		case 8 : result = colorFor8; break;
		case 16 : result = colorFor16; break;
		case 32 : result = colorFor32; break;
		case 64 : result = colorFor64; break;
		case 128 : result = colorFor128; break;
		case 256 : result = colorFor256; break;
		default: result = colorForEmty; break;
	}
	return result;
}


function calcTranslateX(direction: string, path:number){
	switch(direction) {
		case transitionRight: return path * lengthBetweenCells;
		case transitionLeft: return -path * lengthBetweenCells;
		default: return 0;
	}
}

function calcTranslateY(direction: string, path:number){
	switch(direction) {
		case transitionDown: return path * lengthBetweenCells;
		case transitionUp: return -path * lengthBetweenCells;
		default: return 0;
	}
}
export default function GameCanvas({gameCells, isCellAppearance, transitionDirection, cellAnimationEndHandler, cellTransitionEndHandler}:props) {
	const widthHeight = `${100 / Math.sqrt(gameCells.length)}%`;
	const gameCanvas = React.useRef<HTMLDivElement>(null)
	const handleAppearAnimation = React.useRef(false);
	const handleCellTransition = React.useRef(false);

	handleAppearAnimation.current = isCellAppearance;
	handleCellTransition.current = transitionDirection !== '';


	function innerCellAnimationEndHandler(){
		if (handleAppearAnimation.current) {
			handleAppearAnimation.current = false;
			cellAnimationEndHandler();
			if (gameCanvas.current){
				gameCanvas.current.removeEventListener('animationend', innerCellAnimationEndHandler);
			}
		}
	}

	function innercellTransitionEndHandler() {
		if (handleCellTransition.current) {
			handleCellTransition.current = false;
			cellTransitionEndHandler();
			if (gameCanvas.current){
				gameCanvas.current.removeEventListener('transitionend', innercellTransitionEndHandler);
			}
		}
	}

	return(
		<div ref={gameCanvas} className='GameCanvas' onAnimationEnd={innerCellAnimationEndHandler} onTransitionEnd={innercellTransitionEndHandler}>

			{
				gameCells.map((value: gameCell, index: number) => {
					const displayedValue: number | null = transitionDirection ? value.prevValue : value.curValue;
					const isCellTransitioned: boolean = transitionDirection !== '' &&  value.path !== 0;

					const cellStyle: CSSProperties = {
						color: displayedValue !== null && displayedValue < 8   ? cellValueColorBelow8 : cellValueColorMore8,
						background: calcBgColor(displayedValue),
						animation: isCellAppearance && value.prevValue !== value.curValue && value.curValue && value.isUpdatedOrNew ? 'insertNewCells .3s linear' : '',
						transform: isCellTransitioned ? `translate(${calcTranslateX(transitionDirection, value.path)}%, ${calcTranslateY(transitionDirection, value.path)}%)` : '',
						transition: isCellTransitioned ? 'transform 2s' : '',
					}

					return (
						<div ref={gameCanvas} key={index.toString()} className='GameCanvas-CellWrapper' style={{ width: widthHeight, height: widthHeight}} >
							<div className='GameCanvas-CellBackground'>
								<div className='GameCanvas-Cell' style={cellStyle}>
									{ displayedValue }
								</div>
							</div>
						</div>
					)
				})
			}
		</div>
	)
}
