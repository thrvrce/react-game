import React from 'react'

type messageProps = {
	isShowMessage: boolean,
	message: string,
	messageOkHandler: Function,

}
export default function Message(props: messageProps) {
	return (
		<div className='Message' style={{transform: props.isShowMessage ? 'translate(0%, 750%)' : ''}}>
			<div className='MessageTitle'>{props.message}</div>
			<input type="button" className='controlButton' value='OK' onClick={()=>props.messageOkHandler()}/>
		</div>
	)
}