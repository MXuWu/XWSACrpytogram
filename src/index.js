import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// classNames utility to make naming classes more readable
import classNames from 'classnames';

// Define the base App component, Game
// Controls choosing of phrase and passes to Cipher
//    also includes generation of substitution cipher
class Game extends React.Component {
   constructor(){
      super();
      this.state = {
         phrase: "hello this is the Test phrase".toUpperCase()
      };
   }
   
   // generates 
   generateSubCipher(){
      const cipher = new Map();
      // is there a better way to generate the alphabet?
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      // werid behaviour if you don't use slice
      let alph2 = alphabet.slice();
      for(let i = 0; i < 26; i++){
         // choose a random index from remaining letters
         const subInd = Math.floor((Math.random() * (alph2.length - 1)));
         // console.log('subInd = ' + subInd);
         // console.log('alphabet: ' + alphabet.join('') + i);
         // console.log('alphabet[i]: ' + alphabet[i]);
         // console.log('alph2 ' + alph2[subInd]);
         // map letter to cipher letter
         cipher.set(alphabet[i], alph2[subInd]);
         // console.log('cipher get', cipher.get(alphabet[i]));
         alph2[subInd] = null;
         alph2 = alph2.join('');
         // console.log('alph2 join', alph2);
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
               <Cipher phrase={this.state.phrase} 
               cipher={this.generateSubCipher()}/>
            </div>
         </div>
      );
   }
}

class Cipher extends React.Component{
   constructor(props){
      super(props);
      this.state = {
         // change phrase into array of characters
         phrase: this.props.phrase.split(''),
         // hash map of substitution cipher
         cipher: this.props.cipher,
         letterSelected: "",
         userGuess: new Map(),
      };
      this.handleKeyPress = this.handleKeyPress.bind(this);
   }
   
   componentDidMount(){
      const userGuess = new Map();
      const phrase = this.state.phrase.join('').trim().split('');
      for (let i = 0; i < phrase.length; i++){
         userGuess.set(phrase[i], "_");
         console.log("userGuess added letter: " + userGuess.get(phrase[i]));
      }
      this.setState({userGuess: userGuess});
   }

   handleClick(letter){
      let letterSelected = this.state.letterSelected;
      if(letter !== " "){
         letterSelected = (letterSelected === letter) ? "" : letter;
      }
      this.setState({
         letterSelected: letterSelected,
      });
   }

   handleKeyPress(event){
      const userGuess = this.state.userGuess;
      const letterSelected = this.state.letterSelected;
      console.log("keypress: " + event.key);
      userGuess.set(letterSelected, event.key.toUpperCase());
      console.log("userguess for letter " + letterSelected + " is " + event.key);
      this.setState({userGuess: userGuess});
   }

   renderTile(phraseLetter, index){
      // console.log("phraseLetter:" + phraseLetter);
      // console.log("cipher letter:" + this.state.cipher.get(phraseLetter));
      let tileLetter = " ";
      if (phraseLetter !== " "){
         tileLetter = this.state.cipher.get(phraseLetter);
      }

      // create class "Tile", with conditional "active" class
      const tileClass = classNames({
         Tile: true,
         active: phraseLetter === this.state.letterSelected,
      });

      return(
         // give each tile a key for 'stable identity'
         //  pass map of userGuesses (do i need to do this???)
         //  pass onClick handler for user selection, use arrow function syntax
         //   to bind "this" (could also use bind())
         <Tile 
         className={tileClass} 
         key={index} 
         phraseLetter={phraseLetter} 
         cipherLetter={tileLetter} 
         userGuess={this.state.userGuess.get(phraseLetter)} 
         onClick={() => this.handleClick(phraseLetter)} 
         onKeyPress={this.handleKeyPress}
         />
      );
   }

   render(){
      // need to bind "this" to component "this"
      const tileList = [];
       this.state.phrase.map((letter, index) => {
          return tileList.push(this.renderTile(letter, index));
       });
      return(
         <div className="row">
         {tileList}
         </div>
      );
   }
}

// Tile component represents a single letter within the game
class Tile extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         encrypted: true,
         plainLetter: this.props.phraseLetter,
         cipherLetter: this.props.cipherLetter,
         userGuess: this.props.userGuess,
      };
   }

   render(){
      return(
         // <div className='Tile'>
         <div className={this.props.className} onClick={() => this.props.onClick(this.state.cipherLetter)} onKeyPress={this.props.onKeyPress} tabIndex="0">
            {this.state.plainLetter === " " ?
               <div className="space">{'\u00b7'}</div> 
               :
               <div className="cipherPair">
               <div className="char guess">
               {this.props.userGuess}
               </div>
               <div className="char cipher">
               {this.state.cipherLetter}
               </div>
               </div>
            }
         </div>
         // </div>
      );
   }
}

ReactDOM.render(
   <Game />,
   document.getElementById('root')
);
