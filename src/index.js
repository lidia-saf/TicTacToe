import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.won) {
    return (
      <button className="square" onClick={props.onClick} style={{color: 'red'}}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick} style={{color: 'black'}}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  

//Rewrite Board to use two loops to make the squares instead of hardcoding them.
  createSquares = (i) => {
    let squares = [];
    let won = false;

    for (let j = 0; j < 1; ++j) {
      let children = []
      for (let i = 0; i < 9; i++) {
        if (this.props.winButtons && this.props.winButtons.indexOf(i) >= 0) {
              won = true;
          }
        children.push(<Square value={this.props.squares[i]} key={i}
          won={won} onClick={() => this.props.onClick(i)}/>)
      }
      squares.push(<div className="board-row" key="0">{children.slice(0, 3)}</div>)
      squares.push(<div className="board-row" key="1">{children.slice(3, 6)}</div>)
      squares.push(<div className="board-row" key="2">{children.slice(6)}</div>)
    }
    return squares
  }
  


  render() {
      return (
      <div>{this.createSquares()}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      historyLocation: [{
        col: 0,
        row: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      isDesc: true,
      winTrio: []
    };
    this._nodes = new Map();
    this.toggleDesc = this.toggleDesc.bind(this);
  };

  handleClick(i) {
    this.assignLocation(i);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(array, step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });

  //Bold the currently selected item in the move list
    const newArray = Array.from(this._nodes.values())
    for (let i = 0; i < newArray.length; ++i) {
      if (i === step) {
        newArray[i].style.setProperty('font-weight', 'bold');
        console.log(newArray[i]);
      } else {
        newArray[i].style.setProperty('font-weight', 'normal');
      }
    }
  }

  // Add a toggle button that lets you sort the moves in either ascending or descending order.
  toggleDesc() {
    this.setState({
      isDesc: !this.state.isDesc
    })
  }
  



  //Display the location for each move in the format (col, row) in the move history list
  assignLocation(i) {
    const position = [
      {arrayNumber: 0, col: 1, row: 1},
      {arrayNumber: 1, col: 2, row: 1}, 
      {arrayNumber: 2, col: 3, row: 1},
      {arrayNumber: 3, col: 1, row: 2},
      {arrayNumber: 4, col: 2, row: 2},
      {arrayNumber: 5, col: 3, row: 2},
      {arrayNumber: 6, col: 1, row: 3},
      {arrayNumber: 7, col: 2, row: 3},
      {arrayNumber: 8, col: 3, row: 3},
    ];
    const historyLocation = this.state.historyLocation.slice();
    this.setState({
      historyLocation: historyLocation.concat([{
        col: position[i].col,
        row: position[i].row
      }])
    })
  }

  render() {
   const history = this.state.history;
   const current = history[this.state.stepNumber];
   const win = calculateWinner(current.squares);

   const moves = history.map((step, move) => {
     const desc = move ? 
       'Go to move #' + move :
       'Go to game start';
     return (
       <li key={move} style={{fontWeight: 'normal'}} ref={c => this._nodes.set(move, c)}>
         You are at ({this.state.historyLocation[move].row}, 
         {this.state.historyLocation[move].col})
         <br/>
         <button onClick={() => this.jumpTo(moves, move)}>
         {desc}</button>
       </li>
     );
    });

   let status;
   let winButtons;
    if (win) {
      status = 'Winner: ' + win.winner;
      winButtons = win.winButtons;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={i=> this.handleClick(i)}
            winButtons = {winButtons}
            
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isDesc ? moves : moves.reverse()}</ol>
          <button onClick={this.toggleDesc}>Change order</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winButtons: lines[i]
      }
    }
  }
  return null;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
