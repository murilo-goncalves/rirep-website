import { rirreperServiceInstance } from './rirreper_service.js'

class VipSelector {
  constructor() {
    this.rirrepers = [];
  }

  async init() {
    this.rirrepers = await rirreperServiceInstance.getRirrepers();
    var inputsFrag = document.createDocumentFragment();

    for (var i = 0; i < this.rirrepers.length; i += 1) {
      var label = document.createElement("label");
      label.for = this.rirrepers[i].name;
      label.innerHTML = this.rirrepers[i].name + ":  ";
      inputsFrag.appendChild(label);

      var input = document.createElement("input");
      input.type = "number";
      input.id = i;
      input.name = this.rirrepers[i].name;
      input.value = this.rirrepers[i].nVips
      input.className = "input";
      inputsFrag.appendChild(input);

      var line_break1 = document.createElement("br");
      var line_break2 = document.createElement("br");
      inputsFrag.appendChild(line_break1)
      inputsFrag.appendChild(line_break2)
    }
    
    let form = document.getElementById("form");
    form.appendChild(inputsFrag);

    document.getElementById("btn").onclick = this.select;
  }

  weightedRandom = (weights) => {
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

  select = async () => {
    var inputs = document.getElementById("form").querySelectorAll(".input");

    var inputValues = [];
    inputs.forEach((input) => {
      inputValues.push(input.value);
    });
  
    let nMaxVip = Math.max(...inputValues);
  
    let weights = inputValues.map((n) => {
      return n < 0 ? 0 : 1 + nMaxVip - n;
    });

    let idx = this.weightedRandom(weights);

    let winner = document.getElementById(`${idx}`).name;
    document.getElementById("winner").value = winner;
    rirreperServiceInstance.getRirreperImgPromise(winner).then((url) => {
      document.getElementById("rirreper").src = url;
    })
    .catch((err) => {
      console.error("Não deu pra pegar essa imagem do banco não, irmão. Deu esse ruim: ", err);
      alert("deu ruim, olha o log");
    });
    
  }
}



window.onload = () => {
  let vipSelector = new VipSelector();
    try {
        vipSelector.init();
    } catch (err) {
        console.error(err)
    }
}