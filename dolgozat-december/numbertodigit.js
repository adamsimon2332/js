function numbertodigit(number) {
  let s = '' +number, result = [];
  for (let i = 1; i <= s.length; ++i) result.push(s.slice(0, i));
  return result;
}

console.log(numbertodigit("6442"))