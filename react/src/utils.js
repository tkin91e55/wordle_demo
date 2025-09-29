export function ComputeKeyColors (states,colors) {
  const flat_state = states.flat();
  const flat_colors = colors.flat();
  const ret = {};
  for (let i=0; i<flat_state.length; i++) {
    if (!flat_state[i]) break;
    const k = flat_state[i];
    ret[k] = flat_colors[i];
  }
  return ret;
}

export function firstEmpty(arr) {
  for (let i=0; i<arr.length; i++) {
    if (arr[i][0] == '') return i;
  }
  return 0;
}


export function arrMap(arr,M) {
  return arr.map( (row) =>
     row.map( (col) => {
      if (col != '') return M[col];
      else return '';
    })
  )
}

export function dictMap(dict,M) {
    const ret = {};
    Object.keys(dict).forEach( (k) => { ret[k] = M[dict[k]]; })
    return ret;
}
