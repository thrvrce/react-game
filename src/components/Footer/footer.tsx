import React from 'react'
// import './foter.css'
import schoolLogo from './rs_school_js.svg'
import githubLogo from './github.png'

export default function Footer() {
	return(
		<footer>
			<a href="https://rs.school/js/" target='blank'><div ><img src={schoolLogo} alt="schoolLogo"/>RSS-School</div></a>
			<a href="https://github.com/thrvrce/react-game" target='blank'><div><img src={githubLogo} alt="githubLogo"/>Viktor Avdeev</div></a>
			<div>2021</div>
		</footer>
	)
}