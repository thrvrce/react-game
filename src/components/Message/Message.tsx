import React from 'react'

type messageProps = {
	isShowMessage: boolean,
	message: string,
	messageOkHandler: Function,

}
export default function Message(props: messageProps) {
	return (
		<div className='hiddenPAnel Message' style={{transform: props.isShowMessage ? 'translate(0%, 750%)' : '', opacity: props.isShowMessage ? '1' : '0'}}>
			<div className='MessageTitle'>{props.message}</div>
			<input type="button" className='controlButton' value='OK' onClick={()=>props.messageOkHandler()}/>
		</div>
	)
}