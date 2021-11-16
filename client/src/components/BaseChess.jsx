import React, { Component } from 'react';
import Chess from 'chess.js';
import ChaosChess from './ChaosChess';

class BaseChess extends Component {
	state = {
		game: new Chess(),
		moveFrom: '',
		rightClickedSquares: {},
		moveSquares: {},
		optionSquares: {},
	}

	// safeGameMutate = (modify) => {
  //   this.setState((g) => {
  //     const update = { ...g };
  //     modify(update);
  //     return update;
  //   });
  // }

	getMoveOptions = (square) => {
    const moves = this.state.game.moves({
      square,
      verbose: true
    });
    if (moves.length === 0) {
			// if(game.game_over() || game.in_draw())
			// 	console.log("black");
				
      return;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          this.state.game.get(move.to) && this.state.game.get(move.to).color !== this.state.game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
    this.setState({ optionSquares: newSquares });
		// console.log(this.state.optionSquares);
  }

  onSquareClick = (square) => {
		// console.log(this.state.game.fen());

    this.setState({ rightClickedSquares: {} });
		// console.log(this.state.rightClickedSquares);
		// setPrevFen(this.state.game.fen())

  	const resetFirstMove = (square) => {
      this.setState({ moveFrom: square });
      this.getMoveOptions(square);
    }

    // from square
    if (!this.state.moveFrom) {
      resetFirstMove(square);
      // console.log(this.state.moveFrom);
      return null;
    }

    // attempt to make move
    const gameCopy = { ...this.state.game };
    const move = gameCopy.move({
      from: this.state.moveFrom,
      to: square,
      promotion: 'q' // always promote to a queen for example simplicity
    });
    this.setState({ game: gameCopy });

    this.setState({ moveFrom: '' });
    this.setState({ optionSquares: {} });

    

    // if invalid, setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square);
      return null;
    } else{
			// setMoves(moves.push([move.san, ""]));
			// setCurrMove(move.san);
			// console.log(prevFen, move.san);
      return move.san;

			// await sendGame(move.san);
		}

    // setTimeout(makeRandomMove, 300);
  }

	onSquareRightClick = (square) => {
    const colour = 'rgba(0, 0, 255, 0.4)';
    this.setState({
      ...this.state.rightClickedSquares,
      [square]:
        this.state.rightClickedSquares[square] && this.state.rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    });
  }

  updateBoard = (fen) => {
    this.setState({ game: new Chess(fen) });
  }

  clearOptions = () =>{
    this.setState({ optionSquares: {} });
  }

	render() { 
		return (
      <div className="flex justify-center items-center pt-32">
        <ChaosChess
          account={this.props.account}
          onConnect={this.props.onConnect}
          boardWidth={this.props.boardWidth}
          game={this.state.game}
          moveFrom={this.state.moveFrom}
          rightClickedSquares={this.state.rightClickedSquares}
          moveSquares={this.state.moveSquares}
          optionSquares={this.state.optionSquares}
          onSquareClick={this.onSquareClick}
          onSquareRightClick={this.onSquareRightClick}
          onBoardUpdate={this.updateBoard}
          checkWallet={this.props.checkWallet}
          clearOptions={this.clearOptions}
        />
      </div>
		);
	}
}
 
export default BaseChess;