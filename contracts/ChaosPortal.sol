// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ChaosPortal{
    string constant STARTPOS = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    uint256 constant  prizeAmt = 0.0001 ether;

    struct Move {
        address player;
        string move;
        string boardPos;
        uint256 timestamp;
    }

    struct Game {
        string currBoard;
        uint256 timestamp;
        // string prevBoard;
        uint256 numMoves;
        mapping(uint256 => Move) moves;
    }

    struct ReturnableGame {
        string currBoard;
        uint256 timestamp;
        // string prevBoard;
        uint256 numMoves;
        Move[] moves;
    }

    mapping(uint => Game) games;
    uint256 totalMoves;
    uint256 totalGames;
    address owner;

    mapping(address => uint256) lastPlayed;

    event NewMove(address indexed from, uint256 timestamp, string move, string newFen);

    constructor() payable {
        owner = msg.sender;
        newGame();
    }

    function getTotalMoves() public view returns (uint256) {
        return totalMoves;
    }

    function getTotalGames() public view returns (uint256) {
        return totalGames;
    }

    function getAllGames() public view returns (ReturnableGame[] memory){
        ReturnableGame[] memory ret = new ReturnableGame[](totalGames);
        Game storage g;

        for(uint i = 0; i < totalGames; i++){
            g = games[i];
            ret[i].currBoard =  g.currBoard;
            ret[i].timestamp = g.timestamp;
            ret[i].numMoves = g.numMoves;
            ret[i].moves = new Move[](g.numMoves);

            for(uint j = 0; j < g.numMoves; j++){
                ret[i].moves[j] = g.moves[j];
            }
        }

        return ret;
    }

    // function createNewPlayer(address a) internal {
    //     players[a] = Player(0, 0, "0x0");
    // }
    function newGame() internal {
        Game storage g = games[totalGames++];
        g.currBoard = STARTPOS;
        g.timestamp = block.timestamp;

        // games[totalGames] = Game(STARTPOS, 0);
        // totalGames += 1;
    }

    function move(string memory _move, string memory _fen, string memory _prevFen, bool _over) public {
        // Game memory g = games[games.length - 1];

        Game storage g = games[totalGames - 1];
        uint256 nm;
         unchecked {
            nm = g.numMoves - 1;
        }

        require(msg.sender != g.moves[nm].player || lastPlayed[msg.sender] + 5 minutes < block.timestamp || msg.sender == owner, "Please don't play against yourself. If you must, wait 5 minutes.");
        require(keccak256(bytes(_prevFen)) == keccak256(bytes(g.currBoard)), "Previous board does not match current state.");
        
        lastPlayed[msg.sender] = block.timestamp;

        g.currBoard = _fen;
        g.moves[g.numMoves++] = Move(msg.sender, _move, _fen, block.timestamp);

        totalMoves += 1;

        emit NewMove(msg.sender, block.timestamp, _move, _fen);

        if(_over){
            newGame();
            bytes memory bMv = bytes(_move);
            bytes1 b = bytes1("#");

            if(b == bMv[bMv.length - 1])
                require(prizeAmt <= address(this).balance, "Contract out of funds");
                (bool success, ) = (msg.sender).call{value: prizeAmt}("");
                require(success, "Failed to withdraw from contract");
        }

        
        console.log("board:", g.currBoard, "moves:", g.numMoves);
        console.log("player:", g.moves[g.numMoves - 1].player);
        // console.log(games[totalMoves].currBoard);
        // games[games.length - 1] = g;
    }


}