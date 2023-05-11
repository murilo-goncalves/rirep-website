import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { collection, doc, setDoc, getDocs } from 'firebase/firestore'
      
const firebaseConfig = {

    apiKey: "AIzaSyBdMn31JI0ENjHpdG8ymFFgvNQbYoeZk5g",
    authDomain: "quadro-de-x-ri-rep.firebaseapp.com",
    projectId: "quadro-de-x-ri-rep",
    storageBucket: "quadro-de-x-ri-rep.appspot.com",
    messagingSenderId: "1068317095641",
    appId: "1:1068317095641:web:b463f337238d8c72bfb0c8"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rirrepersRef = collection(db, "rirrepers")

let rirrepers = []

class RiRepper {
    constructor(col, row, name, firestoreArray, nVips) {
        this.name = name;
        this.col = col;
        this.row = row;
        this.firestoreArray = firestoreArray;
        this.xArray = this.getXArrayFromFirestoreArray();
        this.nVips = nVips;
    }

    getXArrayFromFirestoreArray() {
        let tmpArray = [];
        tmpArray.push(this.firestoreArray['0']);
        tmpArray.push(this.firestoreArray['1']);
        tmpArray.push(this.firestoreArray['2']);
        return tmpArray;
    }

    async save() {
        try {
            await setDoc(doc(db, "rirrepers", this.name), {
                xArray: this.firestoreArray
            }, { merge: true })
        } catch(err) {
            console.error("writeToDB failed. reason: ", err)
        }
    }
}

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

    constructor(rirreper, width, height, ctx) {
        this.rirreper = rirreper
        this.x = rirreper.col * width;
        this.y = rirreper.row * height;
        this.width = width;
        this.height = height;
        this.ctx = ctx;

        this.nrows = 3;
        this.ncols = 3;

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
        const w = this.width / this.ncols;
        const h = (this.height - Square.headerHeight) / this.nrows;
        
        for (let col = 0; col < this.ncols; col++)
            for (let row = 0; row < this.nrows; row++) {

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
        for (let littleSquare of this.littleSquares)
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

        this.rirreper.save();
    }
}

class Board {
    constructor() {
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');

        this.nrows = 2;
        this.ncols = 6;

        // this.zeroFirestoreArray = { 0: [0, 0, 0],
        //                             1: [0, 0, 0],
        //                             2: [0, 0, 0] };

        // new RiRepper(0, 0, "Jaguar", this.zeroFirestoreArray),
        // new RiRepper(1, 0, "Malfoi", this.zeroFirestoreArray),
        // new RiRepper(2, 0, "Torrent", this.zeroFirestoreArray),
        // new RiRepper(3, 0, "Linguini", this.zeroFirestoreArray),
        // new RiRepper(4, 0, "Guto", this.zeroFirestoreArray),
        // new RiRepper(5, 0, "Murikeko", this.zeroFirestoreArray),
        // new RiRepper(0, 1, "Baiano", this.zeroFirestoreArray),
        // new RiRepper(1, 1, "Clock", this.zeroFirestoreArray),
        // new RiRepper(2, 1, "Lirou", this.zeroFirestoreArray),
        // new RiRepper(3, 1, "Jueio", this.zeroFirestoreArray),
        // new RiRepper(4, 1, "Pampers", this.zeroFirestoreArray),
        // new RiRepper(5, 1, "Pinça", this.zeroFirestoreArray),

        this.squares = [];

        this.canvas.addEventListener('click', function(event) { this.click(event); }.bind(this));
    }

    async init() {
        // for (const rirreper of rirrepers) {
        //     await rirreper.save(); 
        //     console.log(rirreper)
        // }

        const querySnapshot = await getDocs(rirrepersRef);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let rirreper = new RiRepper(data.col, data.row, data.name, data.xArray, data.nVips)
            console.log(JSON.stringify(rirreper));
            rirrepers.push(rirreper);
            const w = this.canvas.width / this.ncols;
            const h = this.canvas.height / this.nrows;
            let square = new Square(rirreper, w, h, this.ctx)
            console.log(JSON.stringify(square));
            this.squares.push(square);
            square.draw();
            
            console.log(doc.id, " => ", doc.data());
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
}

window.onload = () => {
    let board = new Board();
    try {
        board.init();
    } catch(err) {
        console.error(err)
    }
}
