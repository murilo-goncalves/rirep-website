import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'

class Rirreper {
    constructor(name, firestoreArray, nVips) {
        this.name = name;
        this.firestoreArray = firestoreArray;
        // QUANDO PRECISAR SALVAR NO BANCO NOVAMENTE
        // this.zeroFirestoreArray = { 0: [0, 0, 0],
        //                             1: [0, 0, 0],
        //                             2: [0, 0, 0] };
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
        this.storage = getStorage();

        this.rirrepersRef = collection(this.db, "rirrepers");
    }
    
    async getRirrepers() {
        let rirrepers = [];
        const querySnapshot = await getDocs(this.rirrepersRef);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let rirreper = new Rirreper(data.name, data.xArray, data.nVips)
            rirrepers.push(rirreper);
        });
        return rirrepers;
    }

    async saveRirreper(rirreper) {
        try {
            await setDoc(doc(this.db, "rirrepers", rirreper.name), {
                name: rirreper.name,
                nVips: rirreper.nVips,
                xArray: rirreper.firestoreArray
            });
        } catch(err) {
            console.error("não deu pra salvar não, irmão. Deu esse ruim: ", err);
            alert("deu ruim, olha o log")
        }
    }

    async deleteRirreper(rirreper) {
        try {
            await deleteDoc(doc(this.db, "rirrepers", rirreper.name));
        } catch(err) {
            console.error("não deu pra deletar não, irmão. Deu esse ruim: ", err);
            alert("deu ruim, olha o log")
        }
    }

     async updateXArray(rirreper) {
        try {
            await setDoc(doc(this.db, "rirrepers", rirreper.name), {
                xArray: rirreper.firestoreArray
            }, { merge: true });
        } catch(err) {
            console.error("não deu pra atualizar o X não, irmão. Deu esse ruim: ", err);
            alert("deu ruim, olha o log");
        }
    }

    async updateNVips(rirreper) {
        try {
            await setDoc(doc(this.db, "rirrepers", rirreper.name), {
                nVips: rirreper.nVips
            }, { merge: true });
        } catch(err) {
            console.error("não deu pra atualizar os vips não, irmão. Deu esse ruim: ", err);
            alert("deu ruim, olha o log");
        }
    }

    async getRirreperImgPromise(rirreperName) {
        let imgRef = ref(this.storage, `${rirreperName}.jpg`);
        return getDownloadURL(imgRef);
    }

}

export const rirreperServiceInstance = new RirreperService();