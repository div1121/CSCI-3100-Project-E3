import './News.css';

//News is a functional component.
//It returns a list of news about our game.
//The database and an admin page to manage this section have not been prepared yet so this is just a hardcoded sample.
function News() {
	return(
		<div className='news'>
			<div>
				<h1>Check out the news about Magic Maze v1.0!</h1>
			</div>
			<div className="newsPiece">
				<h4>30/4/2021: Magic Maze v1.0 finished! Thank you all!😆😆😆</h4>
			</div>
			<div className="newsPiece">
				<h4>16/4/2021: Today is our demonstration😆</h4>
			</div>
			<div className="newsPiece">
				<h4>19/3/2021: Initial code deadline today!</h4>
			</div>
			<div className="newsPiece">
				<h4>19/2/2021: Magic maze start developing~</h4>
			</div>
		</div>
	);
}

export default News;