const game = {
  t: [6, 10, 20],
  p: ["Erik Pantzar", "-OndaAnkan-"],

  g: [
    { d: 1, s: 1, w: "cykel", r: 0, t: 1668306451466 },
    { d: 1, s: 0, w: "nordsvensk", r: 1, t: 1668306451466 },
    { d: 0, s: 0, w: "flagstångsknoppsputsare", r: 1, t: 1668306451466 },
    { d: 1, s: 1, w: "kalashnikov", r: 1, t: 1668306451466 },
    { d: 1, s: 1, w: "cykel", r: 0, t: 1668306451466 },
    { d: 1, s: 0, w: "nordsvensk", r: 1, t: 1668306451466 },
    { d: 0, s: 0, w: "flagstångsknoppsputsare", r: 1, t: 1668306451466 },
    { d: 1, s: 1, w: "kalashnikov", r: 1, t: 1668306451466 },
  ],
};

function decode(string) {
  return JSON.parse(atob(string));
}

console.log(JSON.stringify(game).length);

function encode(data) {
  return btoa(JSON.stringify(data));
}

console.log(encode(game));

// window.history.pushState(null, null, encode(game));
