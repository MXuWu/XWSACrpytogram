import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// classNames utility to make naming classes more readable
import classNames from 'classnames';
// react-bootstrap for Panel functionality
import Panel from 'react-bootstrap/lib/Panel';

// Define the base App component, Game
// Controls choosing of phrase and passes to Cipher
//    also includes generation of substitution cipher
class Game extends React.Component {
   constructor(){
      super();
      this.state = {
         phrases: ["hello this is the Test phrase", "I hope you enjoyed solving my something awesome", "security engineering is a lot of fun", "i really loved blogging", 'Dont cry because its over smile because it happened', 'Be the change that you wish to see in the world'],
         win: false,
         phraseInd: Math.floor((Math.random()*(6))),
      };
      this.startNewGame = this.startNewGame.bind(this);
   }


   startNewGame(){
         this.setState((prevState)=>{
            let phraseInd = Math.floor((Math.random()*(this.state.phrases.length)));
            while(prevState.phraseInd === phraseInd){
               phraseInd = Math.floor((Math.random()*(this.state.phrases.length)));
            }
            return {phraseInd};
      });
      console.log("startnewgame: ");
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
         const subInd = Math.floor((Math.random() * (alph2.length)));
         // map letter to cipher letter
         cipher.set(alphabet[i], alph2[subInd]);
         alph2[subInd] = null;
         alph2 = alph2.join('');
         alph2 = alph2.split('');
      }
      return cipher;
   }

   render(){
      const phraseInd = this.state.phraseInd;
      return (
      <div>
         <div id="gameHeader">
            <h1> XWSA Cryptogram Game </h1>
         </div>
         <div className="game">
            <Cipher phrase={this.state.phrases[phraseInd].toUpperCase()}
            cipher={this.generateSubCipher()}
            startNewGame={this.startNewGame}
            />
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
         // hint: 0,
         win: false,
      };
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.handleClear = this.handleClear.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
      this.checkWin = this.checkWin.bind(this);
   }

   componentDidMount(){
      const userGuess = new Map();
      const phrase = this.props.phrase.trim().split('');
      for (let i = 0; i < phrase.length; i++){
         userGuess.set(phrase[i], "_");
         console.log("userGuess added letter: " + userGuess.get(phrase[i]));
      }
      this.setState(
         {
         userGuess: userGuess,
         }
      );
   }

   componentWillReceiveProps(){
      const userGuess = new Map();
      const phrase = this.props.phrase.trim().split('');
      console.log("COMPONENTWILLRECEIVEPROPS: " + phrase);
      for (let i = 0; i < phrase.length; i++){
         userGuess.set(phrase[i], "_");
         console.log("userGuess added letter: " + userGuess.get(phrase[i]));
      }
      this.setState(
         {
         phrase: this.props.phrase.split(''), 
         cipher: this.props.cipher,
         userGuess: userGuess,
         win: false,
         letterSelected: "",
         }
      );
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
      // console.log("keypress: " + event.key);
      userGuess.set(letterSelected, event.key.toUpperCase());
      console.log("userguess for letter " + letterSelected + " is " + event.key);
      this.setState({userGuess: userGuess});
   }

   handleKeydown(event){
      const userGuess = this.state.userGuess;
      const letterSelected = this.state.letterSelected;  
      if(event.key === "Backspace"){
         userGuess.set(letterSelected, '_');
         this.setState({userGuess: userGuess});
      }
   }

   // Handles clear button action
   handleClear(){
      const userGuess = this.state.userGuess;
      // iterate through all key/value pair of userGuess map
      userGuess.forEach((v, k) => {
         userGuess.set(k, "_");
      });
      this.setState({userGuess: userGuess});
   }

   getKeyByValue(map, value){
      map.forEach((v, k) => {
         console.log("foreach k: " + k, v);
         if(value === k){
            console.log("value === v");
            return k;
         }
      });
   }

   checkWin(){
      const userGuess = this.state.userGuess;
      let win = true;
      userGuess.forEach((v,k)=>{
         if (k !== " "){
            if (v !== k){
               win = false;
            }
         }
      });
      if(win){
         this.setState({win: win});
      }
   }

   componentDidUpdate(){
      console.log("UPDATE");
      if(this.state.win !== true){
         this.checkWin();
      };
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
         onKeyDown={this.handleKeydown}
         />
      );
   }

   render(){
      // need to bind "this" to component "this"
      const tileList = [];
       this.state.phrase.map((letter, index) => {
          return tileList.push(this.renderTile(letter, index));
       });
       const winClass = classNames({
          win: "win",
          hidden: this.state.win ? false : true,
       });
      return(
         <div>
            <div className="row">
               {tileList}
            </div>
            <div className={winClass}>
            You Win!
            </div>
            <div className="panel-game-btns">
               <button className="btn btn-clear" onClick={this.handleClear}>  Clear 
               </button>
               <button className="btn btn-newGame" onClick={this.props.startNewGame}>  New Game 
               </button>
            </div>
            <div className="hints">
               {/* react-bootstrap component */}
               <div className="hint">
               <Panel>
                  <Panel.Heading>
                     <Panel.Title toggle>Hint</Panel.Title>
                  </Panel.Heading>
                  <Panel.Collapse>
                     <Panel.Body>
                     Consider the most common letters in regular English
                     </Panel.Body>
                  </Panel.Collapse>
               </Panel>
               </div>
               <div className="hint">
               <Panel>
                  <Panel.Heading>
                     <Panel.Title toggle>Hint</Panel.Title>
                  </Panel.Heading>
                  <Panel.Collapse>
                     <Panel.Body>
                     A single letter only has two possibilities!
                     </Panel.Body>
                  </Panel.Collapse>
               </Panel>
               </div>
               <div className="hint">
               <Panel>
                  <Panel.Heading>
                     <Panel.Title toggle>Hint</Panel.Title>
                  </Panel.Heading>
                  <Panel.Collapse>
                     <Panel.Body>
                        The most common digraphs in English are 'TH' 'ER' 'ON' 'AN'
                     </Panel.Body>
                  </Panel.Collapse>
               </Panel>
               </div>
               <div className="hint">
               <Panel>
                  <Panel.Heading>
                     <Panel.Title toggle>Hint</Panel.Title>
                  </Panel.Heading>
                  <Panel.Collapse>
                     <Panel.Body>
                        This is a hint
                     </Panel.Body>
                  </Panel.Collapse>
               </Panel>
               </div>
            </div>
         </div>
      );
   }
}

// Tile component represents a single letter within the game
class Tile extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         // encrypted: true,
         plainLetter: this.props.phraseLetter,
         cipherLetter: this.props.cipherLetter,
         userGuess: this.props.userGuess,
      };
   }

   componentWillReceiveProps(){
      this.setState({
         plainLetter: this.props.phraseLetter,
         cipherLetter: this.props.cipherLetter,
         userGuess: this.props.userGuess,
      });
   }

   render(){
      return(
         // <div className='Tile'>
         <div className={this.props.className} onClick={() => this.props.onClick(this.state.cipherLetter)} onKeyPress={this.props.onKeyPress} onKeyDown={this.props.onKeyDown} tabIndex="0">
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
