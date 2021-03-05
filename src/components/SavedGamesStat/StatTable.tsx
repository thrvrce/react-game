import React from "react";
import { getPrettyTimeFromSecondsOrMinutes} from '../../Const/generalConsts'
export default function SavedGamesStat(props: any) {


	const tableData = () => {
		const savedGames = props.getSavedGames();
		if(savedGames.length) {
			return savedGames.map( (savedGame:any)=> {
				const gameStartTime_Date =new Date(savedGame.gameStartTime)
				const gameStartTimeEdited =
				`${gameStartTime_Date.getFullYear()}/${gameStartTime_Date.getMonth()+1}/${gameStartTime_Date.getDate()} ${getPrettyTimeFromSecondsOrMinutes(gameStartTime_Date.getHours() * 60 +  gameStartTime_Date.getMinutes() )}`
				return (
					<tr key={savedGame.gameStartTime}>
						<td>{gameStartTimeEdited}</td>
						<td>{getPrettyTimeFromSecondsOrMinutes(savedGame.gameTime)}</td>
						<td>{savedGame.movedCells}</td>
						<td>{savedGame.cellMerges}</td>
						<td>{savedGame.score}</td>
					</tr>
				)
			})
		} else {
			return <tr> <td colSpan={4}> No saved games! </td> </tr>;
		}
	}
	return (
    <div className='savedGamesStat hiddenPAnel' style={{transform: props.isShowStatistics ? 'translate(0%, 225%)' : '', opacity: props.isShowStatistics ? '1' : '0'}}>
			<table>
				<caption>Previous ten games statistic</caption>
				<thead>
				<tr>
				<th>Game start time</th><th>Time</th><th>Moves</th><th>Merges</th><th>Score</th>
				</tr>
				</thead>
				<tbody>
				{tableData()}
				</tbody>
			</table>
    </div>
  );
}
