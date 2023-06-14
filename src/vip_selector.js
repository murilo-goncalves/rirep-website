import { rirreperServiceInstance } from './rirreper_service.js'

class VipSelector {
  constructor() {
    this.rirrepers = [];
  }

  async init() {
    this.rirrepers = await rirreperServiceInstance.getRirrepers();
    let inputsFrag = document.createDocumentFragment();

    for (let i = 0; i < this.rirrepers.length; i += 1) {
      let label = document.createElement("label");
      label.for = this.rirrepers[i].name;
      label.innerHTML = this.rirrepers[i].name + ": ";
      inputsFrag.appendChild(label);

      let input = document.createElement("input");
      input.type = "number";
      input.id = i;
      input.name = this.rirrepers[i].name;
      input.value = this.rirrepers[i].nVips
      input.className = "input";
      inputsFrag.appendChild(input);

      let line_break1 = document.createElement("br");
      let line_break2 = document.createElement("br");
      inputsFrag.appendChild(line_break1)
      inputsFrag.appendChild(line_break2)
    }
    
    let form = document.getElementById("form");
    form.appendChild(inputsFrag);

    document.getElementById("select-btn").onclick = this.select;
    document.getElementById("save-btn").onclick = this.save;
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
    const inputs = document.getElementById("form").querySelectorAll(".input");

    let inputValues = [];
    inputs.forEach((input) => {
      inputValues.push(input.value);
    });
  
    const nMaxVip = Math.max(...inputValues);
  
    const weights = inputValues.map((n) => {
      return n < 0 ? 0 : 1 + nMaxVip - n;
    });

    const idx = this.weightedRandom(weights);
    const winnerInput = document.getElementById(`${idx}`);
    
    const winnerName = winnerInput.name;
    document.getElementById("winner").value = winnerName;
    document.getElementById("winner-container").style.display = "block";

    let winner = await rirreperServiceInstance.getRirreperByName(winnerName);
    winner.nVips = winnerInput.value;

    rirreperServiceInstance.getRirreperImgPromise(winner.imgName).then((url) => {
      document.getElementById("rirreper").src = url;
    })
    .catch((err) => {
      console.error("Não deu pra pegar essa imagem do banco não, irmão. Deu esse ruim: ", err);
      alert("deu ruim, olha o log");
    });
  }

  save = async () => {
    const form = document.getElementById("form");
    const inputs = form.querySelectorAll(".input");

    for (var i = 0; i < this.rirrepers.length; i++) {
      this.rirrepers[i].nVips = inputs[i].value;
      rirreperServiceInstance.updateNVips(this.rirrepers[i]);
    }
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