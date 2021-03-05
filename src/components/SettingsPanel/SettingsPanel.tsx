import React from 'react'
// import './SettingsPanel.css'
import {insLeadZeroToTimer, autoplayNewGame, autoplayCurentGame} from '../../Const/generalConsts'
function normalizeValue(value:number) {
	return Math.round(value * 10) / 10;
}


export default function SettingsPanel(props:any) {
	return(
		<div className='SettingsWrapper'>
			<div className='settingsPanelName'>Settings:</div>
				<div className='Parameters'>
					<div className='Volume parameter'> Volume level
						<div className='settingControls'>
							<input type='button' value='+' className='controlButton ' onClick={()=> props.setVolume( (prev:number) =>  prev < 1 ? normalizeValue(prev) + 0.1 : 1)}></input>
							{insLeadZeroToTimer(normalizeValue(props.volume)   * 10) }
							<input type='button' value='-' className='controlButton' onClick={()=> props.setVolume( (prev:number) =>  prev > 0 ? normalizeValue(prev) - 0.1 : 0)}></input>
						</div>
						<input type='button' value={`Sound ${props.isEffectVolumeMuted  ?  'OFF' : 'ON'}`} className='controlButton' onClick={ ()=> props.setisEffectVolumeMuted( !props.isEffectVolumeMuted)}></input>
						<input type='button' value={`Music ${props.ismusicVolumeMuted  ?  'OFF' : 'ON'}`} className='controlButton' onClick={()=> props.setismusicVolumeMuted(!props.ismusicVolumeMuted)}></input>
					</div>
					<div >
						<div className='GameParemetersWrapper'>
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
							<div className='goal parameter'> Current goal
								<div className='settingControls'>
									<select name="goal" className='controlButton ' value={props.goal} onChange={(e) => props.goalHandler(e.target.value)}>
										<option value={16}>16</option>
										<option value={32}>32</option>
										<option value={64}>64</option>
										<option value={128}>128</option>
										<option value={256}>256</option>
										<option value={512}>512</option>
										<option value={1024}>1024</option>
										<option value={2048}>2048</option>
										<option value={4096}>4096</option>
										<option value={8192}>8192</option>
										<option value={16384}>16384</option>
										<option value={32768}>32768</option>
										<option value={65536}>65536</option>
									</select>
								</div>
							</div>
						</div>
						<div className='autopilot parameter'>Game for autoplay
						<div className='settingControls'>
							<select name="autopilot" className='controlButton ' value={props.gameForAutoplay} onChange={(e) => props.gameForAutoplayHandler(e.target.value)}>
								<option value={autoplayNewGame}>New game</option>
								<option value={autoplayCurentGame}>Current game</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}