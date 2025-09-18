import { useState } from 'react'
import './App.css'

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function App() {

  // configurations
  const PREDEFINED_WORDS = ['react','hooks','state','props', 'redux'];
  const MAX_ROUNDS = 6;
  const COLORS = { key_bg: '#818384', hit: '#538d4e', present: '#b59f3b', miss: '#3a3a3c'}
  // TODO: extra, configurable word length, now fixed to 5

  // states
  const [game_ended, set_game_ended] = useState(false);
  const correct_word = randomPick(PREDEFINED_WORDS);
  const entered_chars = new Set();
  const [round, set_round] = useState(0);
  const [cur_string, set_cur_string] = useState(Array(5).fill(null));

  // UI components here
  function Prompt({msg}){
    return (
      <div className="prompt">
        {msg}
      </div>
    )
  }


  function Board() {

    function Rect ({row, col}){
      const _row = row;
      const _col = col;
      let [ letter, setLetter ] = useState('');
      let [ color, setColor ] = useState('#e4d7da');
      const _style = {height:'50px', minWidth:'50px', lineHeight:'50px',
                      margin:'2px' ,backgroundColor:color}
      return ( <span id={col} className="rect-board" style={_style}>{letter}</span>)
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

  function BtnRect({ch, bg_color}) {

    const [color, setColor] = useState(bg_color);
    const _style = {height:'50px', minWidth:'50px', margin:'2px' ,backgroundColor: color}
    return ( <button className="rect-btn" style= {_style}> {ch} </button>)
  }

  function Keyboard() {
    const keystrokes = [['Q','W','E','R','T','Y','U','I','O','P'],
                        ['A','S','D','F','G','H','J','K','L'],
                        ['Enter','Z','X','C','V','B','N','M','←']]

    function RenderButtons() {
       // TODO in app style css
       const _style = { display:'flex', justifyContent:'center'};
       return keystrokes.map( (row, idx) => (
            <div key={idx} className="keyboard-row" style={_style} >
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
