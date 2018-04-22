import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
   constructor(){
      super();
      this.state = {cipher: "Test cipher"};
   }
   render(){
      return (
         <div>
            <div id="gameHeader">
               <h1> XWSA Cryptogram Game </h1>
            </div>
            <div className="game">
               <Cipher cipher={this.state.cipher}/>
            
            </div>
         </div>
      );
   }
}

class Cipher extends React.Component{
   // constructor(props){
   //    super(props);
   // }
   render(){
      return(
         <h2> {this.props.cipher} </h2>
      );
   }
}


class Tile extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         encrypted: true,
      };
   }
}


ReactDOM.render(
   <Game />,
   document.getElementById('root')
);
