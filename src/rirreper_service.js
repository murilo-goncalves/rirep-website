import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { collection, doc, setDoc, getDocs } from 'firebase/firestore'

class Rirreper {
    constructor(col, row, name, firestoreArray, nVips) {
        this.name = name;
        this.col = col;
        this.row = row;
        this.firestoreArray = firestoreArray;
        this.xArray = this.getXArrayFromFirestoreArray();
        this.nVips = nVips;
    }

    getXArrayFromFirestoreArray() {
        let xArray = [];
        xArray.push(this.firestoreArray['0']);
        xArray.push(this.firestoreArray['1']);
        xArray.push(this.firestoreArray['2']);
        return xArray;
    }
}

class RirreperService {
    constructor() {
        const firebaseConfig = {

            apiKey: "AIzaSyBdMn31JI0ENjHpdG8ymFFgvNQbYoeZk5g",
            authDomain: "quadro-de-x-ri-rep.firebaseapp.com",
            projectId: "quadro-de-x-ri-rep",
            storageBucket: "quadro-de-x-ri-rep.appspot.com",
            messagingSenderId: "1068317095641",
            appId: "1:1068317095641:web:b463f337238d8c72bfb0c8"
        
        };
        
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);

        this.rirrepersRef = collection(this.db, "rirrepers")
    }
    
    async getRirrepers() {
        let rirrepers = [];
        const querySnapshot = await getDocs(this.rirrepersRef);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let rirreper = new Rirreper(data.col, data.row, data.name, data.xArray, data.nVips)
            rirrepers.push(rirreper);
        });
        return rirrepers;
    }

    async saveRirreper(rirreper) {
        try {
            await setDoc(doc(this.db, "rirrepers", rirreper.name), {
                name: rirreper.name,
                nVips: rirreper.nVips,
                row: rirreper.row,
                col: rirreper.col,
                xArray: rirreper.firestoreArray
            })
        } catch(err) {
            console.error("Não deu pra salvar não, irmão. Deu esse ruim: ", err);
        }
    }

     async updateXArray(rirreper) {
        try {
            await setDoc(doc(this.db, "rirrepers", rirreper.name), {
                xArray: rirreper.firestoreArray
            }, { merge: true })
        } catch(err) {
            console.error("Não deu pra atualizar o X não, irmão. Deu esse ruim: ", err)
        }
    }
}

export const rirreperServiceInstance = new RirreperService();