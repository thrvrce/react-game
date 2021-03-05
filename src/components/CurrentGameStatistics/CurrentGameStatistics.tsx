import React from "react";
// import './CurrentGameStatistics.css'
import Indicator from "./Indicator/Indicator";
import { getPrettyTimeFromSecondsOrMinutes} from '../../Const/generalConsts'
type props ={
	score:number,
	cellMerges:number,
	movedCells: number,
	gameTime: number,
}

export default function CurrentGameStatistics(props: props) {
	return (
		<div className='CurrentGameStatistics'>
				<Indicator name='Time' value={getPrettyTimeFromSecondsOrMinutes(props.gameTime)}/>
				<Indicator name='Moves' value={props.movedCells}/>
				<Indicator name='Merges' value={props.cellMerges}/>
				<Indicator name='Score' value={props.score}/>
			</div>
	)
}