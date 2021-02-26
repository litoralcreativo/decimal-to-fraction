inputDecimal.oninput = function () {
  let whole;
  let decimal;
  let period;
  let value = inputDecimal.value;
  const wholeExp = /\-?\d+/gi;
  const decimalExp = /\.(\d+)/gi;
  if (value.match(wholeExp)) whole = value.match(wholeExp)[0];
  if (value.match(decimalExp)) decimal = value.match(decimalExp)[0];
  const periodExp = /(\d+)\1+\b/gi;
  if (decimal && decimal.match(periodExp)) {
    period = decimal.match(periodExp)[0];
  }
  if (decimal) decimal = decimal.replace(".", "");
  let _period = period;
  let _decimal = decimal;
  if (period) {
    if (period.length != decimal.length) {
      _decimal = decimal.replace(period, "");
    } else {
      _decimal = "";
    }
  }

  console.clear();
  if (period) _period = exec(decimal, periodExp);
  let arr = [];
  arr.push(whole ? whole : "");
  arr.push(_decimal ? _decimal : "");
  arr.push(_period ? _period : "");

  let n1 = parseInt(
    arr[0] + arr[1] + arr[2] == "" ? 0 : arr[0] + arr[1] + arr[2]
  );
  let n2 = parseInt(arr[0] + arr[1] == "" ? 0 : arr[0] + arr[1]);
  let d2 = "";
  if (arr[1]) {
    if (arr[2]) {
      d2 = strToNum(arr[1].length, 0);
    } else {
      d2 = "1" + strToNum(arr[1].length, 0);
    }
  }
  let d1 = "";
  if (arr[2]) {
    d1 = strToNum(arr[2].length, 9);
  }
  let numerador = n1 == n2 ? n1 : n1 - n2;
  let denominador = d1 ? d1 + d2 : d2 == 1 ? 1 : d2;
  denominador = denominador == "" ? 1 : denominador;
  console.log("numerador: " + numerador);
  console.log("denominador: " + denominador);
  console.log("resultado: " + numerador / denominador);

  // escribir
  wholeText.innerHTML = whole ? arr[0] : "";
  decimalText.innerHTML = decimal ? arr[1] : "";
  periodText.innerHTML = period ? arr[2] : "";
  numeradorText.innerHTML = numerador;
  denominadorText.innerHTML = denominador;
};

const exec = (s, r) => {
  let arr = [];
  while ((result = r.exec(s))) {
    arr.push(result);
  }
  return arr[0][1].match(/^(.+?)(?=\1*$)/)[1];
};

const strToNum = (num, dig) => {
  let str = "";
  for (let i = 0; i < num; i++) {
    str = str + dig;
  }
  return str;
};
