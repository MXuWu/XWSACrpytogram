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
         userGuess: new Map(),
         letterSelected: new Map(),
      };
   }

   handleClick(letter){
      const letterSelected = this.state.letterSelected;
      if(this.letterSelected){
         letterSelected.set(letter, true);
      }
   }

   renderTile(phraseLetter, index){
      console.log("phraseLetter:" + phraseLetter);
      console.log("cipher letter:" + this.state.cipher.get(phraseLetter));
      let tileLetter = " ";
      if (phraseLetter !== " "){
         tileLetter = this.state.cipher.get(phraseLetter);
      }

      const tileClass = classNames({
         Tile: true,
         active: this.state.letterSelected.get(phraseLetter),
      })

      return(
         // give each tile a key for 'stable identity'
         <Tile className={tileClass} key={index} phraseLetter={phraseLetter} cipherLetter={tileLetter} userGuess={this.state.userGuess} onClick={()=> this.handleClick(phraseLetter)} onKeyDown={this.handleKeyPress}/>
      );
   }

   handleKeyPress(event){
      console.log("handleKeypress: " + event);
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
      };
   }

   render(){
      return(
         // <div className='Tile'>
         <div className='Tile'>
            {this.state.plainLetter === " " ? 
               <div className="space"></div> 
               :
               <div className="char" onKeyPress={this.props.handleKeyPress}>
               _
               <div className="char">
               {this.state.cipherLetter}
               </div>
               </div>
            }
         {/* <form >
            <label>
               <input className="cipherBox" type="text" name="subLetter" pattern="[A-Za-z]{1}" onKeyDown={this.props.handleKeyPress} />
               {this.state.cipherLetter}
            </label>
            <input type="submit" value="try"/>
         </form> */}
         </div>
         // </div>
      );
   }
}

ReactDOM.render(
   <Game />,
   document.getElementById('root')
);
