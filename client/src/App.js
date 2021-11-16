// import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import BaseChess from './components/BaseChess';
import Navbar from './components/Navbar'
// import { createTheme, ThemeProvider } from '@mui/material/styles';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      currentAccount: ''
    };
  }

  checkIfWalletConnected = async () => {
		try{
			const { ethereum } = window;

			if(!ethereum){
				console.log("Need Metamask");
				return;
			} else{
				console.log("We've got Payet, I mean ethereum", ethereum)
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found authorized account");
        // return account;
				this.setState({ currentAccount: account });

				// await this.connect();
			} else{
				console.log("No authorized accont found.");
        // return '';
			}
		} catch (e){
			console.log(e)
		}	
	};

  connectWallet = async () => {
    console.log("hey");
		try{
			const { ethereum } = window;

			if(!ethereum){
				alert("Please install Metamask to interact with this site.");
				return;
			}

			const accounts = await  ethereum.request({ method: 'eth_requestAccounts' });
			console.log("Connected to", accounts[0]);
			this.setState({ currentAccount: accounts[0] });
			// console.log(this.state);

			// await this.connect();
		} catch (e){
			console.log(e)
		}
	};

  // componentDidMount(){
  //   // this.checkIfWalletConnected();
  // }


  render() { 
    return  (
      <div className="App bg-primary bg-opacity-100 min-w-full min-h-screen">
        <Navbar/>
        <BaseChess
          account={this.state.currentAccount}
          onConnect={this.connectWallet}
          boardWidth={450}
          checkWallet={this.checkIfWalletConnected}
        />
      </div>
    );
  }
}
 
export default App;
