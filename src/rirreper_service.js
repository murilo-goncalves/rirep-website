import { initializeApp } from 'firebase/app'
import { getStorage, ref, getDownloadURL, deleteObject, uploadBytes } from "firebase/storage";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore'

class Rirreper {
    constructor(name, firestoreXArray, nVips, imgName) {
        this.name = name;
        this.firestoreXArray = firestoreXArray;
        this.xArray = this.getXArrayFromFirestoreXArray();
        this.nVips = nVips;
        this.imgName = imgName;
    }

    getXArrayFromFirestoreXArray() {
        const xArray = [];
        xArray.push(this.firestoreXArray['0']);
        xArray.push(this.firestoreXArray['1']);
        xArray.push(this.firestoreXArray['2']);
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
        const rirrepers = [];
        const querySnapshot = await getDocs(this.rirrepersRef);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const rirreper = new Rirreper(data.name, data.xArray, data.nVips, data.imgName);
            rirrepers.push(rirreper);
        });
        return rirrepers;
    }

    async getRirreperByName(name) {
        const rirreperRef = doc(this.db, "rirrepers", name);
        const rirreperSnap = await getDoc(rirreperRef);
        if (rirreperSnap.exists()) {
            const data = rirreperSnap.data();
            return new Rirreper(data.name,
                                data.xArray,
                                data.nVips,
                                data.imgName);
        } else {
            console.error(`não deu pra achar o rirreper ${name}, irmão. Deu esse ruim: `, err);
            alert("deu ruim, olha o log");
        }
    }

     async updateXArray(rirreper) {
        try {
            await setDoc(doc(this.db, "rirrepers", rirreper.name), {
                xArray: rirreper.firestoreXArray
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

    async getRirreperImgPromise(imgName) {
        const imgRef = ref(this.storage, imgName);
        return getDownloadURL(imgRef);
    }

    async deleteRirreperImg(imgName) {
        const imgRef = ref(this.storage, imgName);
        await deleteObject(imgRef).then(() => {
            console.log(`apagou a imagem ${imgName}}`)
        }).catch((err) => {
            console.error("não deu pra apagar a imagem não, irmão. Deu esse ruim: ", err);
            alert("deu ruim, olha o log");
        });
    }

    async saveRirreperImg(imgFile) {
        const imgRef = ref(this.storage, imgFile.name);
        await uploadBytes(imgRef, imgFile)
            .then((snapshot) => {
                console.log('deu bom salvar a imagem');
            })
            .catch(err => {
                console.error("não deu pra salvar a imagem não, irmão. Deu esse ruim: ", err);
                alert("deu ruim, olha o log");
            });    
    }

    async saveRirreper(name, firestoreXArray, nVips, imgFile) {
        try {
            await setDoc(doc(this.db, "rirrepers", name), {
                name: name,
                nVips: nVips,
                xArray: firestoreXArray,
                imgName: imgFile.name
            });
            await this.saveRirreperImg(imgFile);
            return true;
        } catch(err) {
            console.error("não deu pra salvar não, irmão. Deu esse ruim: ", err);
            alert("deu ruim, olha o log")
            return false;
        }
    }

    async deleteRirreper(rirreperName) {
        try {
            const rirreper = await this.getRirreperByName(rirreperName);
            await deleteDoc(doc(this.db, "rirrepers", rirreperName));
            await this.deleteRirreperImg(rirreper.imgName);
            return true;
        } catch(err) {
            console.error("não deu pra deletar não, irmão. Deu esse ruim: ", err);
            alert("deu ruim, olha o log")
            return false;
        }
    }
}

export const rirreperServiceInstance = new RirreperService();