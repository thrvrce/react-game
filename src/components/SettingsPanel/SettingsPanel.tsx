import React from 'react'
import { isPropertyAccessExpression } from 'typescript'
import './SettingsPanel.css'
import {insLeadZeroToTimer} from '../../Const/generalConsts'
function normalizeValue(value:number) {
	return Math.round(value * 10) / 10;
}

export default function SettingsPanel(props:any) {
	return(
		<div className='SettingsWrapper'>
			<div className='settingsPanelName'>Settings:</div>
			<div className='Parameters'>
				<div className='Volume parameter'> Volume level: {insLeadZeroToTimer(normalizeValue(props.volume)   * 10) }
					<div className='settingControls'>
						<input type='button' value='+' className='controlButton ' onClick={()=> props.setvolume( (prev:number) =>  prev < 1 ? normalizeValue(prev) + 0.1 : 1)}></input>
						<input type='button' value='-' className='controlButton' onClick={()=> props.setvolume( (prev:number) =>  prev > 0 ? normalizeValue(prev) - 0.1 : 0)}></input>
						<input type='button' value={`${normalizeValue(props.volume)  ?  'OFF' : 'ON'}`} className='controlButton' onClick={()=> props.setvolume( (prev:number) =>  prev ? 0 : 0.5)}></input>
					</div>
				</div>
				{/* <div className='Volume parameter'> Volume: {props.volume }% {normalizeValue(props.volume)}
					<div className='settingControls'>
						<input type='button' value='+' className='controlButton ' onClick={()=> props.setvolume( (prev:number) =>  prev < 1 ? prev + 0.1 : prev)}></input>
						<input type='button' value='-' className='controlButton' onClick={()=> props.setvolume( (prev:number) =>  prev > 0 ? prev - 0.1 : prev)}></input>
						<input type='button' value={`${props.volume ?  ' on' : 'off'}`} className='controlButton' onClick={()=> props.setvolume( (prev:number) =>  prev ? 0 : 0.5)}></input>
					</div>
				</div> */}
			</div>
		</div>
	)
}