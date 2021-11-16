// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ChessPortal{
    struct Player {
        uint256 gamesPlayed;
        uint256 wins;
        bytes tree;
        string lastGame;
    }

    address owner;
    uint256 totalGames;
    mapping(address => Player) players;

    constructor(){
        owner = msg.sender;
    }

    function update(bool won) internal {
        totalGames += 1;
        players[msg.sender].gamesPlayed += 1;

        if(won){
            players[msg.sender].wins += 1;
        }

        // console.log(players[msg.sender].wins);
    }

    function update(string memory newGT, bool won) public {
        players[msg.sender].lastGame = newGT; //Validate the new tree

        update(won);
    }

    // function update(bytes memory newGT, bool won) public {
    //     players[msg.sender].tree = newGT; //Validate the new tree

    //     update(won);
    // }

    function getTotalGames() public view returns (uint256){
        console.log("%d total games have been played!", totalGames);
        return totalGames;
    }
}