import { rirreperServiceInstance } from './rirreper_service.js'

class Home {
  constructor() {
    this.rirrepers = [];
  }

  async init() {
    document.getElementById("new-rirreper-btn").onclick = this.clickNovoRirreper;
    document.getElementById("vip-selector-btn").onclick = this.changeHtmlToVipSelector;

    this.rirrepers = await rirreperServiceInstance.getRirrepers();

    let tableFrag = document.createDocumentFragment();

    for (let i = 0; i < this.rirrepers.length; i += 1) {
      const column = await this.createCard(this.rirrepers[i]);
      tableFrag.appendChild(column);
    }
    
    const row = document.getElementById("row");
    row.appendChild(tableFrag);

    document.getElementById("board-btn").onclick = this.changeHtmlToBoard;
    document.getElementById("close").onclick = this.closeModal;
    document.getElementById("submit-btn").onclick = this.clickSalvarRirreper
    // form.addEventListener("form", this.clickSalvarRirreper);
    document.addEventListener("click", this.deleteRirreperEventListener);
  }
  
  createCard = async (rirreper) => {
    let column = document.createElement("div");
    column.className = "column";

    let card = document.createElement("div");
    card.className = "card";
    card.id = rirreper.name;
    let img = document.createElement("img");
    
    rirreperServiceInstance.getRirreperImgPromise(rirreper.imgName)
      .then((url) => {
        img.src = url;
      })
      .catch((err) => {
        console.error("Não deu pra pegar essa imagem do banco não, irmão. Deu esse ruim: ", err);
        alert("deu ruim, olha o log");
      });

    let container = document.createElement("div");
    container.className = "cardContainer";

    let name = document.createElement("h4");

    let bold = document.createElement("b");
    bold.innerHTML = rirreper.name;
    
    name.appendChild(bold);
    container.appendChild(name);
    // add outras infos talvez
    card.appendChild(img);
    card.appendChild(container);
    column.appendChild(card);

    return column;
  }

  // REMOVER RIRREPER

  deleteRirreperEventListener = async (event) => {
    if (this.isOnCard(event.composedPath())) {
      const card = this.getClickedCard(event.composedPath());
      await this.clickCard(card);
    }
  }

  isOnCard = (path) => {
    return path.some(element => element.className === "card");
  }

  getClickedCard = (path) => {
    return path.filter(element => element.className === "card")[0];
  }

  clickCard = async (card) => {
    if (confirm(`certeza que quer apagar o ${card.id}?`) == true) {
      const rirreperName = card.id;
      const didDelete = await rirreperServiceInstance.deleteRirreper(rirreperName);
      if (didDelete) {
        card.parentNode.remove(); // remove column
        this.rirrepers = await rirreperServiceInstance.getRirrepers();
      }
    }
  }

  // ADD RIRREPER

  clickNovoRirreper = () => {
    if (this.rirrepers.length >= 12) {
      alert("tá maluco de botar mais de 12 rirrepers nessa casa?");
    } else {
      document.getElementById("addRirreperModal").style.display = "block";
    }
  }

  clickSalvarRirreper = async (event) => {
    const form = document.getElementById("form");
    const NAME_REQUIRED = "bota o nome do rirreper";
    const NVIPS_REQUIRED = "bota o número de vips do rirreper";
    const IMG_REQUIRED = "bota uma imagem do rirreper";

    // stop form submission
    event.preventDefault();
    
    // validate the form
    const nameValid = this.hasValue(form.elements["name"], NAME_REQUIRED);
    const nVipsValid = this.hasValue(form.elements["nVips"], NVIPS_REQUIRED);
    const imgValid = this.hasValue(form.elements["img"], IMG_REQUIRED);

    // if valid, submit the form.
    if (nameValid && nVipsValid && imgValid) {
      const zeroFirestoreXArray = { 0: [0, 0, 0],
                                   1: [0, 0, 0],
                                   2: [0, 0, 0] };
      const name = form.elements["name"].value;
      const nVips = form.elements["nVips"].value;
      const imgFile = form.elements["img"].files[0];

      console.log(name, nVips, imgFile);
      
      const didSave = await rirreperServiceInstance.saveRirreper(name, zeroFirestoreXArray, nVips, imgFile);  

      if (didSave) {
        this.closeModal();
        alert("rirreper add com sucesso!");
        this.rirrepers = await rirreperServiceInstance.getRirrepers();
        const rirreper = this.rirrepers.filter(rirreper => rirreper.name === name)[0];
        const column = await this.createCard(rirreper);
        const row = document.getElementById("row");
        row.appendChild(column);
      }

    }
  }

  showMessage = (input, message, type) => {
    // get the small element and set the message
    const msg = input.parentNode.querySelector("small");
    msg.innerText = message;
    // update the class for the input
    input.className = type ? "success" : "error";
    return type;
  }

  showError = (input, message) => {
    return this.showMessage(input, message, false);
  }
  
  showSuccess = (input) => {
    return this.showMessage(input, "", true);
  }
  
  hasValue = (input, message) => {
    if (input.value.trim() === "") {
      return this.showError(input, message);
    }
    return this.showSuccess(input);
  }

  closeModal = () => {
    document.getElementById("addRirreperModal").style.display = "none";
  }

  // ROUTING

  changeHtml = (path) => {
    window.location.href = `${path}.html`;
  }

  changeHtmlToVipSelector = () => {
    this.changeHtml("vip_selector");
  }

  changeHtmlToBoard = () => {
    this.changeHtml("board");
  }
}



window.onload = () => {
  const home = new Home();
    try {
        home.init();
    } catch (err) {
        console.error(err);
    }
}