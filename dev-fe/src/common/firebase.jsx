// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwDEnDf_RKTgntV4AtzhlUr2xrvcDUWNo",
  authDomain: "dev-community-7f3b8.firebaseapp.com",
  projectId: "dev-community-7f3b8",
  storageBucket: "dev-community-7f3b8.firebasestorage.app",
  messagingSenderId: "324624540970",
  appId: "1:324624540970:web:8862f8fdeebfbef23f6a53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Google

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {

  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user
    })
    .catch((err) => {
      console.log(err)
    })
  return user;
}