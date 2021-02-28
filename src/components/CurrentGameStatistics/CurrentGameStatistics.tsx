import React from "react";
import './CurrentGameStatistics.css'
import Indicator from "./Indicator/Indicator";

export default function CurrentGameStatistics() {
	return (
		<div className='CurrentGameStatistics'>
				<Indicator name='Time' value={(new Date()).toISOString()}/>
				<Indicator name='Moves' value={0}/>
				<Indicator name='Merged' value={0}/>
				<Indicator name='Score' value={0}/>
			</div>
	)
}