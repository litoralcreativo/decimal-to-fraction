inputDecimal.oninput = function () {
  let whole;
  let decimal;
  let period;
  let value = inputDecimal.value;
  let negative = false;
  if (value < 0) {
    negative = true;
  }
  value = Math.abs(value).toString();
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

  // get the number
  let nu = parseInt(numerador);
  let de = parseInt(denominador);

  let mcd = 1;

  if (value != 0) {
    mainTermn.style = "opacity: 1;";
  } else {
    mainTermn.style = "opacity: 0;";
    facTermn.style = "opacity: 0;";
    simpleTermn.style = "opacity: 0;";
  }

  if (nu >= 2 && de >= 2) {
    mcd = mcd_var([nu, de]);
    if (mcd > 1) {
      // get a factorized array of the number
      let nuFac = nu == 0 ? [0] : nu == 1 ? [1] : factor(nu);
      let deFac = de == 0 ? [0] : de == 1 ? [1] : factor(de);

      // get a string for the DOM element
      let numeFacText = arrToStr(nuFac, "*");
      let denoFacText = arrToStr(deFac, "*");

      // add text
      addFactorText(numeradorTextFactor, nuFac);
      addFactorText(denominadorTextFactor, deFac);
      numeradorTextSimple.innerHTML = nu / mcd;
      denominadorTextSimple.innerHTML = de / mcd;

      facTermn.style = "opacity: 1;";
      simpleTermn.style = "opacity: 1;";
    } else {
      facTermn.style = "opacity: 0;";
      simpleTermn.style = "opacity: 0;";
    }
  }

  // escribir
  wholeText.innerHTML = whole ? arr[0] : "";
  decimalText.innerHTML = decimal ? arr[1] : "";
  periodText.innerHTML = period ? arr[2] : "";
  numeradorText.innerHTML = numerador;
  denominadorText.innerHTML = denominador;
};

const addFactorText = (domElement, arr) => {
  while (domElement.firstChild) {
    domElement.firstChild.remove();
  }
  let occ = occurency(arr);
  for (let i = 0; i < occ[0].length; i++) {
    var p = document.createElement("p");
    p.innerHTML = occ[0][i];
    // si tiene exponente mayor a 1
    if (occ[1][i] > 1) {
      var sup = document.createElement("sup");
      sup.innerHTML = occ[1][i];
      sup.style = "font-size: 0.8rem";
      p.appendChild(sup);
    }
    domElement.appendChild(p);

    if (i < occ[0].length - 1) {
      let asterisco = document.createElement("p");
      asterisco.innerHTML = " · ";
      domElement.appendChild(asterisco);
    }
  }
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

const factor = (number, values = []) => {
  let counter = 2;
  while (number % counter !== 0) {
    counter++;
  }
  values.push(counter);
  return counter == number ? values : factor(number / counter, values);
};

const arrToStr = (arr, character = ",") => {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    const last = arr.length - 1;
    result = result + arr[i] + (i != last ? " " + character + " " : "");
  }
  return result;
};

const occurency = (arr) => {
  let a = [],
    b = [],
    prev;

  arr.sort((a, b) => a > b);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  return [a, b];
};

const occurency_var = (arrOfObj, nums) => {
  let arr = [];
  arrOfObj.forEach((element) => {
    arr.push(element.fac);
  });
  let ocurr = occurency(arr);
  let result = [];
  for (let i = 0; i < ocurr[1].length; i++) {
    if (ocurr[1][i] == nums) result.push(ocurr[0][i]);
  }
  return result;
};

const mcd_var = (numbers) => {
  // se factoriza cada numero y se lo guarda en un array
  let facArr = [];
  numbers.forEach((element) => {
    facArr.push(factor(element));
  });
  // console.log(facArr);

  // se toma el numero de ocurrencias de cada factor para cada numero
  let occurArr = [];
  facArr.forEach((element) => {
    occurArr.push(occurency(element));
  });
  // console.log(occurArr);

  // se agrupan todos los factores y ocurrencias en un único array
  let factorOcc = [];
  for (let i = 0; i < occurArr.length; i++) {
    for (let j = 0; j < occurArr[i][0].length; j++) {
      const fac = occurArr[i][0][j];
      const ocu = occurArr[i][1][j];
      const obj = { fac: fac, occ: ocu };
      factorOcc.push(obj);
    }
  }
  factorOcc.sort((a, b) => (a.fac > b.fac ? 1 : b.fac > a.fac ? -1 : 0));
  // console.log(factorOcc);

  // se filtran los factores para obtener cuales son divisores comunes
  const commons = occurency_var(factorOcc, numbers.length);
  // console.log(commons);

  // se filtra el array que contiene todos los factores
  // y sus ocurrencias en función de los divisores comúnes
  let midRes = [];
  for (let i = 0; i < factorOcc.length; i++) {
    // solo si el valor es un divisor comun
    if (commons.includes(factorOcc[i].fac)) {
      const fac = factorOcc[i].fac;
      const ocu = factorOcc[i].occ;
      if (midRes.find((x) => x.fac == fac) == undefined) {
        const obj = { fac: fac, occ: ocu };
        midRes.push(obj);
      }
      // se coteja si el divisor iterado actual es menor al último añadido y se remplaza
      // para asi tomar solo los justos y necesarios..
      if (midRes.find((x) => x.fac == fac).occ > ocu) {
        const indexToPop = midRes.indexOf(midRes.find((x) => x.fac == fac));
        midRes.splice(indexToPop, 1);
        const newObj = { fac: fac, occ: ocu };
        midRes.push(newObj);
      }
    }
  }
  // paso opciona, ordenado de mayor a menor
  midRes.sort((a, b) => (a.fac > b.fac ? 1 : b.fac > a.fac ? -1 : 0));

  let result = 1;

  // se obtiene el resultado con los factores finales y sus ocurrencias
  midRes.forEach((element) => {
    result *= Math.pow(element.fac, element.occ);
  });
  return result;
};
