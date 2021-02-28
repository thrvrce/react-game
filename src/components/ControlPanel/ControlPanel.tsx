import React from 'react'
import './ControlPanel.css'

export default function ControlPanel() {
	return(
		<div className='ControlPanel'>
			{/* <div>Nickname or login\authorization</div> */}
			<div className='NewGame'> New Game</div>
			<div className='GameStatistics'> Game Statistics</div>
		</div>
	)
}