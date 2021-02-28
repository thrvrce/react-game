import React from "react";
import './GameCanvas.css'
import {gameCell} from '../../Const/generallInterfaces'

interface gameCells {gameCells: gameCell[]};

export default function GameCanvas({gameCells}:gameCells) {
	const widthHeight = `${100 / Math.sqrt(gameCells.length)}%`;
	return(
		<div className='GameCanvas'>
			{gameCells.map((value: gameCell, index: number) =>
					<div key={index.toString()} className='GameCanvas-CellWrapper' style={{ width: widthHeight, height: widthHeight}}>
						<div
							className='GameCanvas-Cell'
							style={{ background: value.color}}>
								{value.value}
						</div>
					</div>
				)
			}
		</div>


	)
}