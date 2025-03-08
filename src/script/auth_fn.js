import { auth, signOut } from './../../firebase-config.js';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { addUser } from './firestore.js';

export async function currentUser() {}

export async function signUp(userData) {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      userData.email.trim(),
      userData.password.trim()
    );
    const uid = userCred.user.uid;
    await addUser(userData, uid);
    window.location.href = `./src/pages/account.html?id=${uid}`;
  } catch (e) {
    console.log(e.message);
  }
}

export async function login(email, pw) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pw);
    console.log(cred);
  } catch (e) {
    console.log(e.message);
  }
}

export function setupAuthListener(callback) {
  return onAuthStateChanged(auth, user => {
    if (user) {
      // Utilisateur connecté
      console.log('Utilisateur connecté:', user.uid);

      // window.location.href = `./src/pages/account.html?id=${user.uid}`;
    } else {
      // window.location.href = `./src/index.html`;
    }
  });
}

export function logout() {
  signOut(auth)
    .then(() => {
      // L'utilisateur a été déconnecté avec succès.
      console.log('Utilisateur déconnecté');
      window.location.href = `./../../index.html`;
    })
    .catch(error => {
      // Une erreur s'est produite lors de la déconnexion.
      console.error('Erreur de déconnexion :', error);
    });
}

// // Exemple d'utilisation de la fonction logout (par exemple, un bouton de déconnexion)
// document.getElementById('logoutButton').addEventListener('click', logout);
