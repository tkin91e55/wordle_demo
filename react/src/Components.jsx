import { useState, useRef } from 'react'

// configurations
const default_config = {
  COLORS: {
            key_bg: '#818384', hit: '#538d4e',
            present: '#b59f3b', miss: '#3a3a3c'
          },
};
const config = window.wordleConfig || default_config;
// merge configs
Object.keys(default_config).forEach( k =>
  { if (config[k] === undefined) { config[k] = default_config[k]; }
  })

const {COLORS} = config;

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

import {firstEmpty, arrMap, dictMap} from './utils.js'
const M = { p: COLORS['present'], h: COLORS['hit'], m: COLORS['miss'] };

export function Panel({ _states, submit_handler,
                        game_ended=false, ignore_input=false,}) {
  const [board_state, setBoardState] = useState(_states.board_state);
  const round = useRef(firstEmpty(board_state)).current;
  const [cursor, setCursor] = useState({row:round, col:0});

  const board_colors = arrMap(_states.board_colors,M) || {};
  const key_colors = dictMap(_states.key_colors,M) || {};

  function on_input(chr) {
    if (game_ended) return;
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
    const guess = board_state[round].join('');
    // submit_handler(guess).then( (data) => {
    //     console.log(`2. data=${data}`);
    // })
    submit_handler(guess)
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
                ( <BtnRect key={chr} chr={chr} color={key_colors[chr]}
                    cb={ !ignore_input ? on_input : ()=>{} } />))
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

export default Panel
