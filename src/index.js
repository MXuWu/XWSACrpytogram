import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Define the base App component, Game
// Controls choosing of phrase and passes to Cipher
class Game extends React.Component {
   constructor(){
      super();
      this.state = {
         phrase: "Test phrase".toUpperCase()
      };
   }
   
   generateSubCipher(){
      const cipher = new Map();
      // is there a better way to generate the alphabet?
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      let alph2 = alphabet;
      for(const letter in alphabet){
         cipher.set(letter, '');
         // this.setState({
         //    cipher: this.state.cipher.set(letter, ''),
         // });
      }
      cipher.set('test', 'hello');
      console.log(cipher.get('test'));

      for(let i = 0; i <= 26; i++){
         const subInd = Math.floor((Math.random() * alph2.length));
         console.log('subInd = ' + subInd);
         console.log('alphabet: ' + alphabet[i]);
         console.log('alph2 ' + alph2[subInd]);
         cipher.set(alphabet[i], alph2[subInd]);
         // });
         console.log('cipher get', cipher.get(alphabet[i]));
         alph2[subInd] = null;
         alph2 = alph2.join('');
         console.log('alph2 join', alph2);
         alph2 = alph2.split('');
      }
      return cipher;
   }

   render(){
      return (
         <div>
            <div id="gameHeader">
               <h1> XWSA Cryptogram Game </h1>
            </div>
            <div className="game">
               <Cipher phrase={this.state.phrase} cipher={this.generateSubCipher()}/>
            
            </div>
         </div>
      );
   }
}

class Cipher extends React.Component{
   constructor(props){
      super(props);
      this.state = {
         phrase: this.props.phrase.split(),
         // hash map of substitution cipher
         cipher: this.props.cipher,
      };
   }
   
   renderCipher(){
      return (
         <div> 
         why won't this work  
         {this.state.cipher['a']}
         </div>
      );
   }

   render(){
      return(
         <div>
         <h2> {this.state.phrase} </h2>
         <div>
            {this.renderCipher()}
            {this.props.name}
         </div>
         </div>
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
