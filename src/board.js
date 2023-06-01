import { rirreperServiceInstance } from './rirreper_service.js'

class LittleSquare {
    constructor(col, row, x, y, width, height, ctx) {
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.hasX = false
        this.cleaningOffset = 10
    }

    draw() {
        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawX() {
        this.ctx.fillStyle = 'red';
        this.ctx.font = "60px 'Comic Sans', 'Comic Sans MS', 'cursive'";
        this.ctx.textAlign = "center";
        this.ctx.fillText("x", this.x + this.width / 2, this.y + this.height / 2 + 20);
        this.hasX = true
    }

    removeX() {
        this.ctx.clearRect(this.x + this.cleaningOffset,
            this.y + this.cleaningOffset,
            this.width - 2 * this.cleaningOffset,
            this.height - 2 * this.cleaningOffset);
        this.hasX = false;
    }
}

class Square {
    static headerHeight = 50;

    constructor(col, row, rirreper, width, height, ctx) {
        this.rirreper = rirreper
        this.x = col * width;
        this.y = row * height;
        this.width = width;
        this.height = height;
        this.ctx = ctx;

        this.nRows = 3;
        this.nCols = 3;

        this.littleSquares = [];
    }

    draw() {
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + Square.headerHeight);
        this.ctx.lineTo(this.x + this.width, this.y + Square.headerHeight);
        this.ctx.stroke();

        this.drawName();
        this.drawLittleSquares();
    }

    drawLittleSquares() {
        const w = this.width / this.nCols;
        const h = (this.height - Square.headerHeight) / this.nRows;

        for (let col = 0; col < this.nCols; col++)
            for (let row = 0; row < this.nRows; row++) {

                let littleSquare = new LittleSquare(col, row, col * w + this.x,
                    row * h + Square.headerHeight + this.y, w, h, this.ctx)

                this.littleSquares.push(littleSquare);

                if (this.rirreper.xArray[row][col] == 1)
                    littleSquare.drawX();
            }

        this.littleSquares.forEach(littleSquare => littleSquare.draw());
    }

    drawName() {
        this.ctx.fillStyle = 'blue';
        this.ctx.font = "25px 'Comic Sans', 'Comic Sans MS', 'cursive'";
        this.ctx.textAlign = "center";

        this.ctx.fillText(this.rirreper.name,
            this.x + this.width / 2,
            this.y + Square.headerHeight / 2 + 8
        );
    }

    click(x, y) {
        for (let littleSquare of this.littleSquares) {
            if (x >= littleSquare.x &&
                x <= littleSquare.x + littleSquare.width &&
                y >= littleSquare.y &&
                y <= littleSquare.y + littleSquare.height) {

                if (!littleSquare.hasX) {
                    littleSquare.drawX();
                    this.rirreper.xArray[littleSquare.row][littleSquare.col] = 1;
                } else {
                    littleSquare.removeX();
                    this.rirreper.xArray[littleSquare.row][littleSquare.col] = 0;
                }
            }
        }
    }
}

class Board {
    constructor() {
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');

        this.nRows = 2;
        this.nCols = 6;

        this.rirrepers = []

        this.squares = [];

        this.canvas.addEventListener('click', function (event) { this.click(event); }.bind(this));
    }

    async init() {
        let col = 0;
        let row = 0
        this.rirrepers = await rirreperServiceInstance.getRirrepers();
        this.rirrepers.forEach((rirreper) => {
            console.log(col, row);
            const w = this.canvas.width / this.nCols;
            const h = this.canvas.height / this.nRows;
            let square = new Square(col, row, rirreper, w, h, this.ctx)
            this.squares.push(square);
            square.draw();
            
            // atualiza linha e coluna
            if (col < this.nCols-1) {
                col++;
            } else if (row < this.nRows-1) {
                row++;
                col = 0;
            }
        });

        let btn = document.getElementById("btn");
        btn.addEventListener('click', event => {
            this.saveChanges();
        });
    }

    click(event) {
        const bounds = this.canvas.getBoundingClientRect();
        let mouseX = event.pageX - bounds.left - scrollX;
        let mouseY = event.pageY - bounds.top - scrollY;
        mouseX /= bounds.width;
        mouseY /= bounds.height;
        mouseX *= this.canvas.width;
        mouseY *= this.canvas.height;

        for (let square of this.squares) {
            square.click(mouseX, mouseY);
        }
    }

    async saveChanges() {
        for (const rirreper of this.rirrepers) {
            await rirreperServiceInstance.updateXArray(rirreper);
        }

        alert("brabo, atualizou o quadro. É bom não estar azaralhando");
    }
}

window.onload = () => {
    let board = new Board();
    try {
        board.init();
    } catch (err) {
        console.error(err)
    }
}
