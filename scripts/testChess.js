const web3 = require('web3');

const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    const waveContractFactory = await hre.ethers.getContractFactory("ChessPortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("Delpoyed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);

    // let moveCount;
    // moveCount = await waveContract.getTotalMoves();

    // // Me
    let txn = await waveContract.update("0x" + ("0000000000" + web3.utils.asciiToHex('d4').substr(-4)).substr(-10), true );
    // let txn = await waveContract.move('d4');
    await txn.wait();

    // moveCount = await waveContract.getTotalMoves();

    // //Guy she tells me not to worry about
    txn = await waveContract.connect(randomPerson).update("0x" + ("0000000000" + web3.utils.asciiToHex('Nf6').substr(-4)).substr(-10), false );
    await txn.wait();

    // moveCount = await waveContract.getTotalMoves();
};

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    } catch (e){
        console.log(e);
        process.exit(1);
    }
};

runMain();