import { useState, useEffect } from 'react'
import './App.css'

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function App() {

  // configurations
  // assume no duplicate letters in the PREDEFINED_WORDS, otherwise coloring rule not clear
  const PREDEFINED_WORDS = ['REACT','STATE','PROPS', 'REDUX'];
  const MAX_ROUNDS = 6;
  const COLORS = { key_bg: '#818384', hit: '#538d4e', present: '#b59f3b', miss: '#3a3a3c'}
  // TODO: extra, configurable word length, now fixed to 5

  // states
  const correct_word = randomPick(PREDEFINED_WORDS);
  const entered_chars = new Set();
  let round = 0;
  let game_ended = false;
  const cur_string = Array(5).fill(null);

  const KEY_EVENT = 'w_key_pressed';
  let dummy_target = new EventTarget(); // for key pressed publishing

  // UI components here
  function Prompt({msg}){
    return (
      <div className="prompt">
        {msg}
      </div>
    )
  }

  console.log(`[Cheat] correct answer: ${correct_word}`)

  function Board() {

    function Rect ({row, col}){
      let [ letter, setLetter ] = useState('');
      let _letter = '';
      let [ color, setColor ] = useState('');
      const _style = {height:'50px', minWidth:'50px', lineHeight:'50px',
                      margin:'3px 0px' , border:'1px solid #3a3a3c',}

      function check_Enter() {
          if ( correct_word[col] == _letter )  { setColor(COLORS['hit']); }
          else{
            if (correct_word.indexOf(_letter)>=0) { setColor(COLORS['present']); }
            else                                  { setColor(COLORS['miss']);    }
          }
      }

      function process_input(evt) {
        // MAIN LOGIC of the game
        if (game_ended) return;
        if ( row != round ) return;

        let {value:chr, null_col } = evt.detail;
        console.log(`processing ${chr} at ${row},${col}, null_col=${null_col}`);
         if (chr === 'Enter')  { check_Enter(); }
         else if (chr === '←') {
           if (null_col == 0) return; // row empty
           if (null_col == -1) { null_col = 5; } // row full
           if (col != null_col-1) return;
           setLetter(''); _letter = '';
           cur_string[null_col-1] = null;
         }
         else {
           if (null_col == -1) return; // row full
           if (col != null_col) return; // only current col can be filled
           // console.log(`processing ${chr} at ${row},${col}, letter: ${letter}`);

           setLetter(chr); _letter = chr;
           cur_string[col] = chr;
         }

      }

      useEffect(() => {
        dummy_target.addEventListener(KEY_EVENT, process_input);
        return () => { dummy_target.removeEventListener(KEY_EVENT, process_input); };
      }, []);

      return ( <span id={col} className="rect-board"
                              style={{..._style, backgroundColor: color}}>{letter}</span>)
    }

    function RenderRects() {
      const rects = [];
      for (let r=0; r<MAX_ROUNDS; r++) {
        const row_rects = [];
        for (let c=0; c<5; c++) {
          row_rects.push( <Rect key={`${r}-${c}`} row={r} col={c} /> )
        }
        const _sty = {display:'flex', justifyContent:'center'}
        rects.push(<div key={r} className="board-row" style={_sty}>{row_rects}</div> )
      }
      return rects;
    }

    return (
      <div className="board" style={{marginBottom:'25%'}}>
        <RenderRects />
      </div>
    )
  }


  function Keyboard() {

    const keys_onboard = [['Q','W','E','R','T','Y','U','I','O','P'],
                        ['A','S','D','F','G','H','J','K','L'],
                        ['Enter','Z','X','C','V','B','N','M','←']]

    function BtnRect({ch, bg_color}) {

      const _style = {height:'50px', minWidth:'50px', margin:'2px'}
      const [color, setColor] = useState(bg_color);

      function on_enter_pressed() {
        if (cur_string.includes(null)) { return; }

          let evt = new CustomEvent(KEY_EVENT,  {detail: {value: ch}});
          dummy_target.dispatchEvent(evt);

          let guess = cur_string.join('');
          console.log(`guessing ${guess} vs ${correct_word}`);
          if (guess == correct_word) { game_ended = true; }

          round += 1;
          cur_string.fill(null);
      }

      function key_pressed() {
        if (ch == "Enter") {
          on_enter_pressed();
        } else {
          const null_col = cur_string.indexOf(null)
          let evt = new CustomEvent(KEY_EVENT,  {detail: {value: ch, null_col: null_col}});
          dummy_target.dispatchEvent(evt);
        }
      }

      return (
        <button className="rect-btn" style= {{..._style, backgroundColor: color}}
                onClick={key_pressed} value={ch} >
          {ch}
        </button>)
    }

    function RenderButtons() {
       // TODO in app style css
       const _style = { display:'flex', justifyContent:'center'};
       return keys_onboard.map( (row, idx) => (
            <div key={idx} id={idx} className="keyboard-row" style={_style} >
              { row.map( (key) =>
                ( <BtnRect key={key} ch={key} bg_color={COLORS['key_bg']} />))
              }
            </div>
          ))
    }

    return (
      <div className="keyboard">
        <RenderButtons />
      </div>
    )
  }

  return (
    <>
      <div className="container">
        <Board />
        <Keyboard />
      </div>
    </>
  )
}

export default App
