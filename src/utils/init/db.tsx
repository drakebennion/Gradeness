import { doc, getFirestore, setDoc } from "firebase/firestore";
import { data } from "../../../seedData";

const db = getFirestore();

export const doDataImport = () => {
    data.forEach(task => {
        setDoc(doc(db, 'defaultTasks', task.id), task)
        .then(() => console.log(`wrote ${task.id}`))
        .catch((err) => console.error(err))
    });
};