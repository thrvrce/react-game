import React from 'react'
import './ControlPanel.css'

interface ControlPAnel {
	newGameHAndler: Function,
	toggleFullScreen: Function,
	fullScreenButtonValue: string,
}

export default function ControlPanel({newGameHAndler, toggleFullScreen, fullScreenButtonValue}: ControlPAnel) {
	return(
		<div className='ControlPanel'>
			{/* <div>Nickname or login\authorization</div> */}
			<input type='button' value='New Game' className=' controlButton' onClick={() => newGameHAndler()}></input>
			{/* <input type='button' value='Game Statistics' className=' controlButton'></input> */}
			<input type='button' value={fullScreenButtonValue} className=' controlButton'onClick={() => { toggleFullScreen()}}></input>
		</div>
	)
}