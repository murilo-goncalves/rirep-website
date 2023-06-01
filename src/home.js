import { rirreperServiceInstance } from './rirreper_service.js'

class Home {
  constructor() {
    this.rirrepers = [];

    this.modal = document.getElementById("addNoiaModal");
    this.btn = document.getElementById("myBtn");
    this.span = document.getElementsByClassName("close")[0];
    this.span.onclick = () => {
      this.modal.style.display = "none";
    }
  }

  async init() {
    this.rirrepers = await rirreperServiceInstance.getRirrepers();

    var tableFrag = document.createDocumentFragment();

    for (var i = 0; i < this.rirrepers.length; i += 1) {
      var column = document.createElement("div");
      column.className = "column";

      var card = document.createElement("div");
      card.className = "card";

      var img = document.createElement("img");
      
      await rirreperServiceInstance.getRirreperImgPromise(this.rirrepers[i].name)
        .then((url) => {
          img.src = url;
        })
        .catch((err) => {
          console.error("Não deu pra pegar essa imagem do banco não, irmão. Deu esse ruim: ", err);
          alert("deu ruim, olha o log");
        });

      var container = document.createElement("div");
      container.className = "cardContainer";
      tableFrag.appendChild(container);

      var name = document.createElement("h4");

      var bold = document.createElement("b");
      bold.innerHTML = this.rirrepers[i].name;
      
      name.appendChild(bold);
      container.appendChild(name);
      // add outras infos
      card.appendChild(img);
      card.appendChild(container);
      column.appendChild(card);

      tableFrag.appendChild(column);
    }
    
    let row = document.getElementById("row");
    row.appendChild(tableFrag);

    document.getElementById("btn").onclick = this.clickAddNoia;
  }

  clickAddNoia = () => {
    // if (this.rirrepers.length >= 12) {
    //   alert("tá maluco de botar mais de 12 noias nessa casa?");
    // } else {
      this.modal.style.display = "block";
      
    // }
  }
}

window.onload = () => {
  let home = new Home();
    try {
        home.init();
    } catch (err) {
        console.error(err);
    }
}