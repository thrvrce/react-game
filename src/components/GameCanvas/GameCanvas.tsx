import React from "react";
import './GameCanvas.css'
import {gameCell} from '../../Const/generallInterfaces'
import { cellValueColorBelow8, cellValueColorMore8 } from "../../Const/generalConsts";

interface gameCells {gameCells: gameCell[], animateCellAppearance: boolean, animateCellTransition: boolean, animationEndHandler: Function};

export default function GameCanvas({gameCells, animateCellAppearance, animateCellTransition, animationEndHandler}:gameCells) {
	const widthHeight = `${100 / Math.sqrt(gameCells.length)}%`;
	const [isTransitionEnd, set_isTransitionEnd] = React.useState(false);
	const gameCanvas = React.useRef<HTMLDivElement>(null)
	const handleAppearAnimation = React.useRef(false);
	handleAppearAnimation.current = animateCellAppearance;
	console.log('hi', animateCellAppearance, handleAppearAnimation.current)
	// React.useEffect(()=>{
	// 	handleAppearAnimation.current = animateCellAppearance;
	// 	console.log(handleAppearAnimation.current);
	// 	return () => {handleAppearAnimation.current = false; console.log(handleAppearAnimation.current) }
	// })

	// function TransitionEndHandler(e:TransitionEvent<>){
	// 	if(isTransitionEnd) {
	// 		console.log(e.target);
	// 		set_isTransitionEnd(false);
	// 	}
	// }
	function innerAnimationEndHandler(){
		if (handleAppearAnimation.current) {
			handleAppearAnimation.current = true;
			animationEndHandler();
			if (gameCanvas.current){
				gameCanvas.current.removeEventListener('animationend', innerAnimationEndHandler);
			}
		}
	}

//onTransitionEnd={TransitionEndHandler
	return(
		<div ref={gameCanvas} className='GameCanvas' onAnimationEnd={innerAnimationEndHandler} >
			{gameCells.map((value: gameCell, index: number) =>
				{
					// const cellStyle: object = {
					// 	background:
					// }

					return <div ref={gameCanvas} key={index.toString()} className='GameCanvas-CellWrapper' style={{ width: widthHeight, height: widthHeight}} >
									<div className='GameCanvas-CellBackground'>
										<div
											className='GameCanvas-Cell'
											style={{ background: value.color, animation: animateCellAppearance? 'insertNewCells .3s linear' : ''}}>
												{value.value}
										</div>
									</div>
								</div>
				})
			}
		</div>


	)
}
//