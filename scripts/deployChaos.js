const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const acntBal = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account Balace: ", acntBal.toString());

    const Token = await hre.ethers.getContractFactory("ChaosPortal");
    const portal = await Token.deploy({
        value: hre.ethers.utils.parseEther('0.005')
    });
    await portal.deployed();

    console.log("ChaosPortal address: ", portal.address);
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