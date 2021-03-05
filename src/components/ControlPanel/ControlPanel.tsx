import React from 'react'
// import './ControlPanel.css'

interface ControlPAnel {
	newGameHAndler: Function,
	toggleFullScreen: Function,
	fullScreenButtonValue: string,
	autoplayHandler: Function,
	togleSavedGamesStatisticsVsibility: Function
}

export default function ControlPanel({newGameHAndler, toggleFullScreen, fullScreenButtonValue, autoplayHandler, togleSavedGamesStatisticsVsibility}: ControlPAnel) {
	return(
		<div className='ControlPanel'>
			{/* <div>Nickname or login\authorization</div> */}
			<input type='button' value='New Game' className=' controlButton' onClick={() => newGameHAndler()}></input>
			<input type='button' value='Game Statistics' className=' controlButton' onClick={ ()=> { togleSavedGamesStatisticsVsibility()}}></input>
			<input type='button' value={fullScreenButtonValue} className=' controlButton'onClick={() => { toggleFullScreen()}}></input>
			<input type='button' value='Autoplay' className='controlButton'onClick={() => autoplayHandler()}></input>
		</div>
	)
}