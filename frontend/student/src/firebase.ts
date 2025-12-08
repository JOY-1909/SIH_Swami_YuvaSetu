import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-QjtF0vUm_WvWPs2XH7_NhMXIu7Se52M",
  authDomain: "yuvasetu-26ba4.firebaseapp.com",
  projectId: "yuvasetu-26ba4",
  storageBucket: "yuvasetu-26ba4.firebasestorage.app",
  messagingSenderId: "5806108984",
  appId: "1:5806108984:web:ea49c472347aacedca11cd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export { RecaptchaVerifier };
export const googleProvider = new GoogleAuthProvider();
