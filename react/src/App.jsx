import { useState, useMemo } from 'react'
import './App.css'

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

// configurations
// words with duplicate letter has undeterministic coloring
const PREDEFINED_WORDS = ['REACT', 'HOOKS' ,'STATE','PROPS', 'REDUX'];
const MAX_ROUNDS = 6;
const COLORS = { key_bg: '#818384', hit: '#538d4e', present: '#b59f3b', miss: '#3a3a3c'}
const correct_word = randomPick(PREDEFINED_WORDS);

console.log(`[Cheat] correct answer: ${correct_word}`)

function App() {

  const [board_state, setBoardState] = useState( Array(MAX_ROUNDS).fill(null).map(
                                                  ()=>Array(5).fill('') ) );
  const [cursor, setCursor] = useState({row:0, col:0});
  const [game_ended, setGameEnded] = useState(false);
  const round = cursor.row;

  const [key_colors, board_colors] = useMemo( () => ComputeColor(board_state), [round]);

  function ComputeColor(_state) {
    const _key_colors = {}
    const _board_colors = Array(MAX_ROUNDS).fill().map(()=>Array(5).fill(null) );
    if (round==0) {return [_key_colors, _board_colors];}
    for (let r=0; r<round; r++) {
      for (let c=0; c<5; c++) {
        const chr = _state[r][c];
        if (correct_word[c] == chr) {
          _board_colors[r][c] = COLORS['hit'];
          _key_colors[chr] = COLORS['hit'];
        }
        else{
          if (correct_word.indexOf(chr)>=0) {
            _board_colors[r][c] = COLORS['present'];
            _key_colors[chr] = COLORS['present'];
          } else {
            _board_colors[r][c] = COLORS['miss'];
            _key_colors[chr] = COLORS['miss'];
          }
        }
      }
    }
    return [_key_colors, _board_colors];
  }

  function on_input(chr) {
    // MAIN LOGIC of the game
    if (game_ended) return;
    // console.log(`processing ${chr}`);
    console.log(`processing ${board_state}`);
     if (chr === 'Enter')  { check_answer()  }
     else if (chr === '←') { remove_letter() }
     else                  { add_letter(chr) }
  }

  function add_letter(chr){
    if (cursor.col<5){
      let new_board = structuredClone(board_state);
      new_board[round][cursor.col] = chr;
      setBoardState(new_board);
      setCursor({row:round, col:cursor.col+1});
    }
  }

  function remove_letter(){
    if (cursor.col>0){
      let new_board = structuredClone(board_state);
      new_board[round][cursor.col-1] = '';
      setBoardState(new_board);
      setCursor({row:round, col:cursor.col-1});
    }
  }

  function check_answer() {
    if (cursor.col<5) return; // not enough letters
    const is_correct = board_state[round].join('') === correct_word;
    if (is_correct || round == MAX_ROUNDS ) {
      setGameEnded(true);
    }
    setCursor({row: round+1, col:0});
  }

  function Keyboard() {

    const keys_onboard = [['Q','W','E','R','T','Y','U','I','O','P'],
                        ['A','S','D','F','G','H','J','K','L'],
                        ['Enter','Z','X','C','V','B','N','M','←']]

    function RenderButtons() {
       const row_style = { display:'flex', justifyContent:'center'};
       return keys_onboard.map( (row,idx) => (
            <div key={idx} className="keyboard-row" style={row_style} >
              { row.map( (chr) =>
                ( <BtnRect key={chr} chr={chr} color={key_colors[chr]} cb={on_input} />))
              }
            </div>
          ))
    }
    return <div className="keyboard"> <RenderButtons /> </div>
  }

  return (
    <>
      <div className="container">
        <Board states={board_state} colors={board_colors}/>
        <Keyboard />
      </div>
    </>
  )
}

function Board({states,colors}) {

  function RenderRects() {
    return states.map((arr,r) => {
      const _sty = {display:'flex', justifyContent:'center'}
      return (
        <div key={r} className="board-row" style={_sty}>
          { arr.map( (ch,c) => ( <Rect key={c} chr={ch} color={colors[r][c]} /> ) ) }
        </div>
      )
    })
  }

  return <div className="board" style={{marginBottom:'25%'}}> <RenderRects /> </div>
}

function Rect ({chr, color,}){
  const _style = {height:'50px', minWidth:'50px', lineHeight:'50px',
                  margin:'3px 0px' , border:'1px solid #3a3a3c',}
  return ( <span className="rect-board"
                 style={{..._style, backgroundColor: color}}>{chr}</span>)
}

function BtnRect({chr, color, cb}) {
  const bg_color = color || COLORS['key_bg'];
  const _style = {height:'50px', minWidth:'50px', margin:'2px'}

  return (
    <button className="rect-btn" id={chr}
            style={{..._style, backgroundColor: bg_color,}}
            onClick={(e)=>{cb(e.target.value)}}
            value={chr} > {chr}
    </button>)
}

export default App
