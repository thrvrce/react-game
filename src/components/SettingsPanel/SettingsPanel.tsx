import React from 'react'
// import './SettingsPanel.css'
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
				<div className='fieldSize parameter'> Field size
					<div className='settingControls'>
						<select name="fieldSize" className='controlButton ' value={props.fieldSize} onChange={ (e) =>props.fieldSizeSelecthandler(e.target.value)}>
							<option value={3}>3</option>
							<option value={4}>4</option>
							<option value={5}>5</option>
							<option value={6}>6</option>
							<option value={7}>7</option>
							<option value={8}>8</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	)
}