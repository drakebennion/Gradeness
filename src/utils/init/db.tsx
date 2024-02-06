import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { data } from '../../../seedData'

const db = getFirestore()

export const doDataImport = () => {
  // todo: can this all just be done in one shot? hmm
  data.forEach(activity => {
    setDoc(doc(db, 'defaultActivities', activity.id), activity)
      .then(() => { console.log(`wrote default activity ${activity.id}`) })
      .catch((err) => { console.error(err) })
  })
}
