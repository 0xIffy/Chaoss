const web3 = require('web3');

const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    const waveContractFactory = await hre.ethers.getContractFactory("ChaosPortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1')
    });
    await waveContract.deployed();

    console.log("Delpoyed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);

    let contractBal = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Current Bal:", hre.ethers.utils.formatEther(contractBal));

    let txn;

    txn = await waveContract.move("e4", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", false);
    await txn.wait();

    txn = await waveContract.connect(randomPerson).move("Qh5#", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2323", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", true);
    await txn.wait();

    txn = await waveContract.connect(randomPerson).move("Qh5#", "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", false);
    await txn.wait();

    txn = await waveContract.connect(randomPerson).move("Qh5#", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2323","rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", false);
    await txn.wait();

    contractBal = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Current Bal:", hre.ethers.utils.formatEther(contractBal));

    let games = await waveContract.getAllGames();
    // await txn.wait();

    // console.log(games); 
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