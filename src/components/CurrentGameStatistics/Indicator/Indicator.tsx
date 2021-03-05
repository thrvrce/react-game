import React from 'react'
// import './Indicator.css'

interface Props {
	name: string,
	value: string | number,
}
export default function Indicator(props: Props) {
	return (
		<div className='Indicator'>
			<div className='Indicator-Name'>{props.name}</div>
			<div className='Indicator-Value'>{props.value}</div>
		</div>
	)
}