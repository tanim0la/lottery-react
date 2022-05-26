import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Transaction pending..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  onClick = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Transaction pending..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    let winner = await lottery.methods.getWinner().call();

    this.setState({ message: `Address ${winner} won the lottery` });
  };

  render() {
    return (
      <div>
        <h1>lottery Contract</h1>
        <p>
          This contract is manage by {this.state.manager}. <br />
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h3> Want to try your luck?</h3>
          <div>
            <label>Amount of ether to enter: </label>
            <input
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h3> Ready to pick a winner</h3>
        <button onClick={this.onClick}>pick a winner</button>
        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
