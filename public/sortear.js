function sortear() {
  var rirrepers = {};
  var inputs = document.getElementById("form").querySelectorAll(".input");
  [...inputs].forEach((elm) => {
    if (elm.type === "number") {
      rirrepers[elm.name] = elm.value;
    }
  });

  nvips = Object.values(rirrepers).map((n) => {
    return parseInt(n, 10);
  });
  nMaxVip = Math.max.apply(null, nvips);

  weights = nvips.map((n) => {
    return n < 0 ? 0 : 1 + nMaxVip - n;
  });

  console.log(weights);

  idx = weightedRandom(weights);
  winner = document.getElementById(`${idx}`).name;
  document.getElementById("winner").value = winner;
  document.getElementById("rirreper").src = `images/${winner}.jpg`;

  startConfetti();
}

function weightedRandom(weights) {
  const cumulativeWeights = [];
  for (let i = 0; i < weights.length; ++i) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
  }
  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const randomNumber = maxCumulativeWeight * Math.random();

  for (let itemIndex = 0; itemIndex < weights.length; ++itemIndex) {
    if (cumulativeWeights[itemIndex] >= randomNumber) {
      return itemIndex;
    }
  }
}

// function leastCommonMultiple(arr) {
//   function gcd(a, b) {
//     return !b ? a : gcd(b, a % b);
//   }

//   function lcm(a, b) {
//     return (a * b) / gcd(a, b);
//   }

//   var multiple = 1;
//   arr.forEach((n) => {
//     if (n > 0) {
//       multiple = lcm(multiple, n);
//     }
//   });

//   return multiple;
// }
