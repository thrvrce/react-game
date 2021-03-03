import React from 'react'
import './ControlPanel.css'

interface ControlPAnel {
	newGameHAndler: Function,
}

export default function ControlPanel({newGameHAndler}: ControlPAnel) {
	return(
		<div className='ControlPanel'>
			{/* <div>Nickname or login\authorization</div> */}
			<input type='button' value='New Game' className=' controlButton' onClick={() => newGameHAndler()}></input>
			<input type='button' value='Game Statistics' className=' controlButton'></input>
		</div>
	)
}