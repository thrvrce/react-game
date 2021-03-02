import { type } from "os";
import React from "react";
import './CurrentGameStatistics.css'
import Indicator from "./Indicator/Indicator";
type props ={
	score:number
}

export default function CurrentGameStatistics(props: props) {
	return (
		<div className='CurrentGameStatistics'>
				<Indicator name='Time' value={(new Date()).toISOString()}/>
				<Indicator name='Moves' value={0}/>
				<Indicator name='Merged' value={0}/>
				<Indicator name='Score' value={props.score}/>
			</div>
	)
}