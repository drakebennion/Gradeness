import { doc, getFirestore, setDoc } from "firebase/firestore";
import { data } from "../../../seedData";

const db = getFirestore();

export const doDataImport = () => {
    // todo: can this all just be done in one shot? hmm
    data.forEach(task => {
        setDoc(doc(db, 'defaultTasks', task.id), task)
        .then(() => console.log(`wrote default task ${task.id}`))
        .catch((err) => console.error(err))
    });
};