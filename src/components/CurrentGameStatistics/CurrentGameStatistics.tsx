import React from "react";
import './CurrentGameStatistics.css'
import Indicator from "./Indicator/Indicator";
type props ={
	score:number,
	cellMerges:number,
	movedCells: number,
	gameTime: number,
}
function insLeadZeroToTimer (timeNumber: number){
  return  (timeNumber < 10 ? "0" : "") + timeNumber.toString();
 }

export default function CurrentGameStatistics(props: props) {
	return (
		<div className='CurrentGameStatistics'>
				<Indicator name='Time' value={`${insLeadZeroToTimer(Math.floor(props.gameTime / 60))}:${insLeadZeroToTimer(props.gameTime % 60 || 0 )}`}/>
				<Indicator name='Moves' value={props.movedCells}/>
				<Indicator name='Merges' value={props.cellMerges}/>
				<Indicator name='Score' value={props.score}/>
			</div>
	)
}