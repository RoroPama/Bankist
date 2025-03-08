import {
  doc,
  setDoc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../../firebase-config.js'; // Assurez-vous que le chemin est correct

export async function addUser(userData, id) {
  const { password, ...data } = userData;
  console.log('data', data);
  console.log('uid', id);

  try {
    await setDoc(doc(db, 'users', id), data); // Utilisation de setDoc et doc
    console.log(`Document utilisateur ajouté avec l'ID : ${id}`);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur : ", error);
    // Vous pouvez également lancer l'erreur à nouveau pour la propager si nécessaire
  }
}

export async function getUser(userId) {
  try {
    const userDocRef = doc(db, 'users', userId); // Crée une référence au document de l'utilisateur
    const userDoc = await getDoc(userDocRef); // Récupère le document

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }; // Retourne les données de l'utilisateur avec l'ID
    } else {
      console.log('Aucun utilisateur trouvé avec cet ID.');
      return null; // Retourne null si l'utilisateur n'existe pas
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur : ", error);
    throw error; // Propage l'erreur pour une gestion ultérieure
  }
}
