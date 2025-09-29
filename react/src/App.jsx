import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import Panel from './Components.jsx'
import {ComputeKeyColors} from './utils.js'

// configurations
const default_config = {
  HOST: "http://127.0.0.1:8000",
  ROOM_ID: 'abcdef',
  PLAYER_ID: '123456',
  MAX_ROUNDS: 6,
};
const config = window.wordleConfig || default_config;
// merge configs
Object.keys(default_config).forEach( k =>
  { if (config[k] === undefined) { config[k] = default_config[k]; }
  })

const {HOST, ROOM_ID, PLAYER_ID, MAX_ROUNDS} = config;

function App() {

  const [host, setHost] = useState(HOST); // allow to change server
  const [game_id, setGameId] = useState(ROOM_ID);
  const [playerID, setPlayerID] = useState(PLAYER_ID);

  const [roomState, setRoomState] = useState('waiting'); // waiting, playing, disconnected, ended
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [history, setHistory] = useState('');
  const posting = useRef(false); // ignore inputs, and repeated submit
  const [game_ended, setGameEnded] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  async function poll() {
    const API_URL = `${host}/task4/api/sync/${game_id}?player=${playerID}`;
    const response = await fetch(API_URL);
    if (response.ok) {
        let data = await response.json()
        return data
    }
    throw new Error('unable to sync');
  }

  async function submitGuess(guess) {
    if (posting.current) return;
    posting.current = true;
    console.log(`submitting ${guess}`);
    const API_URL = `${host}/task4/api/check_ans_m/`;
    try {
        const resp = await fetch(API_URL,
            {method:'POST',
             body: JSON.stringify(
                     {room_id:game_id, guess:guess, token:playerID }
             )})
        if (resp.ok) {
            let data = await resp.json()
            if (data.result === 'ok') {
              posting.current = false;
              syncWith(data);
              return data
            }
            posting.current = false;
        }
    } catch(e) {
        posting.current = false;
        console.error(`abnormal submit: ${e}`);
    }
  }

  function syncWith(data) {
    const {state,is_over,is_your_round,history:hist,winner} = data;
    setRoomState(state);
    setIsMyTurn(is_your_round);
    setHasWon(winner === playerID);
    if (history != hist) {
        setHistory(hist);
    }
    setGameEnded(is_over);
  }

  useEffect(()=>{
    const interval = setInterval(() => {
      function onSync(data) {
        console.log(data);
        syncWith(data);
      }

      // https://javascript.info/task/async-from-regular
      // let data = poll() // MyMistake: very common problem to newcomers
      poll().then((data)=> { onSync(data); }
      ).catch((e)=>{ console.log(e); })

    }, 1000);
    return () => clearInterval(interval);
  })

  function historyTo(_type="board"){
    _type = (_type=='board' ? 0 : 1)
    const ret = Array(MAX_ROUNDS).fill().map(()=>Array(5).fill(''));
    if (!history) return ret;
    const str2Arr = history.split(',')
          .map((ss) => ss.split(':')[_type]).map(x=>Array.from(x))
    for (let r=0; r<str2Arr.length; r++) {
      for (let c=0; c<str2Arr[r].length; c++) {
        ret[r][c] = str2Arr[r][c];
      }
    }
    return ret
  }

  const board_state = useMemo( () => historyTo('board'), [history] );
  const board_colors = useMemo( () => historyTo('color'), [history] );
  const key_colors = ComputeKeyColors(board_state,board_colors);
  const ignoreInput = posting.current || game_ended || !isMyTurn;
  const _states = { board_state, board_colors, key_colors };

  return (
    <>
      <div className="container">
        <Panel key={history} submit_handler={submitGuess}
              _states={_states} ignore_input={ignoreInput} />
        <div> Room ID  : {game_id} </div>
        <div> Player ID: {playerID} </div>
        <div> State    : {roomState} </div>
        <div> My Turn  : {isMyTurn ? 'yes' : 'no'} </div>
        <div> Game Over: {game_ended ? 'yes' : 'no'} </div>
        <div> Has Won  : {hasWon ? 'yes' : 'no'} </div>
      </div>
    </>
  )
}

export default App
