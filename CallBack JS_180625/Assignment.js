
const h = n => n * 2;
const d = n => n * 2;
const t = n => n * 3;
const f = n => n * 4;
const fi = n => n * 5;

const calc = (arr, funcs) => {
  let res = [];
  for (let i = 0; i < funcs.length; i++) {
    let out = [];
    for (let j = 0; j < arr.length; j++) {
      out.push(funcs[i](arr[j]));
    }
    res.push(out);
  }
  return res;
};

const data = [8, 4, 2, 6, 1];

// const set3 = [h, d, t];
// console.log(calc(data, set3));

const set5 = [h, d, t, f, fi];
console.log(calc(data, set5));