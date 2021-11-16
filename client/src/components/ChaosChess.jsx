import React from 'react';
import { Chessboard } from 'react-chessboard';
// import Chess from 'chess.js';
import { abi } from '../utils/ChaosPortal.json';
import { ethers } from 'ethers';
import Moves from './Moves';
import Games from './Games'


class ChaosChess extends React.Component {
  constructor(props) {
    super(props);

    this.contractAddress = '0x9Ef541D6B5acFe891f7aa3CcF13A7c2595B5c256';
    this.contractABI = abi;
    this.startPos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.peicePath = 'https://images.chesscomfiles.com/chess-themes/pieces/glass/150/';

    this.state = { 
      allGames: [],
      prevFen: this.startPos,
      displayedGame: null
    }

    this.ref = React.createRef();
  }

  connect = async () => {
    try{
			const { ethereum } = window;

			if(ethereum){
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const chaosPortalContract = new ethers.Contract(this.contractAddress, this.contractABI, signer);
				
				const games = await chaosPortalContract.getAllGames();

        let cleanGames = [];
				games.forEach( (g, i) => {
					cleanGames.push({
						currBoard: g.currBoard,
						timestamp: new Date(g.timestamp * 1000),
						moves: []
					});
					g.moves.forEach( (m) => {
						cleanGames[i].moves.push({
							address: m.player,
							timestamp: new Date(m.timestamp * 1000),
							san: m.move,
              pos: m.boardPos
						});
					});
				});

				// this.setState({ allGames: cleanGames });
				// console.log(allGames);

				const g = cleanGames[cleanGames.length - 1];
				this.props.onBoardUpdate(g.currBoard);

        // console.log("hey");

        this.setState({ allGames:  cleanGames });
        this.setState({ prevFen: g.currBoard });
        this.setState({ displayedGame: g });
			} else {
				console.log("Ethereum object not present.");
			}
    } catch(e){
      console.log(e);
    }
  }

  sendGame = async (currMove) => {
		// let mvPGN = formatPGN();

		try{
			const { ethereum } = window;

			if(ethereum){
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const chaosPortalContract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

				const txn = await chaosPortalContract.move(currMove, this.props.game.fen(), this.state.prevFen, this.props.game.game_over());
				console.log("Mining...", txn.hash);

				await txn.wait();
				console.log("Mined -- ", txn.hash);

        this.setState({ prevFen: this.props.game.fen() })
			} else {
				console.log("Ethereum object not present.");
			}
		} catch (e){
			console.log(e)
		}
	}

  getNewMoves = () => {
    let chaosContract;

    const onNewMove = (from, timestamp, move, fen) => {
      console.log("New Move", from, move);
      let g;
      let curr;

      this.setState( (prevState) => {
        let newGames = [...prevState.allGames];
        let index = newGames.length - 1;
        curr = {...newGames[index]};
        // console.log(prevState);

        curr.moves.push({
          address: from,
          timestamp: new Date(timestamp * 1000),
          san: move,
          pos: fen
        });

        if(fen === this.startPos){
          g = {
            currBoard: fen,
            timestamp: new Date(timestamp * 1000),
            moves: []
          }
          newGames.push(g);
          this.handleNewGame();
        } else {
          curr.currBoard = fen;
        }

        newGames[index] = {...curr}

        console.log(2, curr.moves[curr.moves.length - 2]);
        return { allGames: newGames };
      }, 
      () => {
        console.log(3, curr.moves[curr.moves.length - 2]);


      //If displaying the newest game
      // console.log(this.state.displayedGame.timestamp, newGames[newGames.length - 1].moves[newGames[newGames.length - 1].moves - 1].timestamp)
        if(this.state.displayedGame.timestamp === curr.timestamp){
          curr.moves.pop();
          this.setState({ displayedGame: curr });
          // console.log(4, curr.moves[curr.moves.length - 2]);
          
          let gameCopy = {...this.props.game};
          gameCopy.move(move);

          //If state of board is one move away from new move
          if(gameCopy.fen() === curr.currBoard){
            this.props.onBoardUpdate(gameCopy.fen());
          }
        }
      });
    } 

    if(window.ethereum){
      console.log("got him")
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      chaosContract = new ethers.Contract(this.contractAddress, this.contractABI, signer);
      chaosContract.on("NewMove", onNewMove);
    }

    return () => {
      if(chaosContract){
        chaosContract.off("NewMove", onNewMove);
      }
    }
  }

  handleNewGame = () => {
    alert("new game");
  }

  switchBoard = (game) => {
    this.setState({ displayedGame: game });
    this.props.onBoardUpdate(game.currBoard);
  }

  pieces = ['wp', 'wn', 'wb', 'wr', 'wq', 'wk', 'bp', 'bn', 'bb', 'br', 'bq', 'bk'];
  customPieces = () => {
    const returnPieces = {};
    this.pieces.map((p) => {
      let path = this.peicePath.concat(p,'.png');
      // console.log(path)
      returnPieces[p] = ({ squareWidth }) => (
        <img style={{ width: squareWidth, height: squareWidth }} src={path} alt={p} />
      );
      return null;
    });
    return returnPieces;
  };

  componentDidMount(){
    // console.log("h")
    this.props.checkWallet()
      .then(() => { this.connect(); })
      .then(() => { this.getNewMoves(); })
        // .catch(e => console.log(e))
      .catch(e => console.log(e) )
  }

  // componentWillUnmount(){
  //   this.props.clearOptions();
  // }

  render() { 
    const { boardWidth, 
            game, 
            onConnect, 
            onSquareRightClick,
            onSquareClick,
            onBoardUpdate, 
            moveSquares, 
            optionSquares, 
            rightClickedSquares,
            clearOptions,
            account 
          } = this.props;

    const { displayedGame, allGames } = this.state;

    return (
      <React.Fragment>
        <div className="">
          <div className="flex justify-center">
            <div className="mr-4">
              <Chessboard
                id="ClickToMove"
                animationDuration={100}
                arePiecesDraggable={false}	
                boardWidth={boardWidth}
                position={game.fen()}
                onSquareClick={
                  account ? (square) => {
                    if(displayedGame && game.fen() === displayedGame.currBoard){
                      let move = onSquareClick(square);
                      if(move){
                        this.sendGame(move);
                      }
                    }
                  }
                  : () => {
                    onConnect()
                      .then( () => { this.connect() });
                  }
                }
                onSquareRightClick={onSquareRightClick}
                customBoardStyle={{
                  borderRadius: '4px',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                }}
                customSquareStyles={{
                  ...moveSquares,
                  ...optionSquares,
                  ...rightClickedSquares
                }}
                ref={this.ref}

                customDarkSquareStyle={{ backgroundColor: '#0e4081' }}
                customLightSquareStyle={{ backgroundColor: '#ffc099' }}
                customPieces={this.customPieces()}
              />
            </div>
            <Moves
              onClick={clearOptions}
              moves={displayedGame ? displayedGame.moves : []}
              gamePos={game.fen()}
              onBoardUpdate={onBoardUpdate}
            />
          </div>
          <div className="flex justify-center mt-12">
            <Games
              onClick={this.switchBoard}
              onMouseEnter={(g) => { onBoardUpdate(g.currBoard); clearOptions();  }}
              onMouseLeave={() => { onBoardUpdate(displayedGame.currBoard) }}
              games={allGames}
              currGame={displayedGame}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
 
export default ChaosChess;