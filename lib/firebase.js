import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAbHsK69U4g2iLNQX68gb6rRwGmuRjPmNY",
  authDomain: "thyvisionapi-a116b.firebaseapp.com",
  databaseURL:
    "https://thyvisionapi-a116b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "thyvisionapi-a116b",
  storageBucket: "thyvisionapi-a116b.firebasestorage.app",
  messagingSenderId: "975611372271",
  appId: "1:975611372271:web:f1564401c20eb738fcf11a",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveToFirebase = async (path, data) => {
  const savePath = ref(db, path);
  const newRef = push(savePath);
  await set(newRef, data);
};

export { database, ref, set, saveToFirebase };
