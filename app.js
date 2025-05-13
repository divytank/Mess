import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzCChRQGajRyy22iZ-P58QMLtjlbM4Bmc",
  authDomain: "mess-attendance-b92f9.firebaseapp.com",
  projectId: "mess-attendance-b92f9",
  storageBucket: "mess-attendance-b92f9.appspot.com",
  messagingSenderId: "671902269485",
  appId: "1:671902269485:web:e27454006792d27f51b8a4",
  measurementId: "G-9QQY5C1EPT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const loginSection = document.getElementById("login-section");
const mealSection = document.getElementById("meal-selection-section");
const userName = document.getElementById("user-name");
const status = document.getElementById("status");

const loginWithGoogle = () => {
  signInWithPopup(auth, provider).catch(console.error);
};

const updateUI = async (user) => {
  if (user) {
    loginSection.style.display = "none";
    mealSection.style.display = "block";
    userName.textContent = user.displayName;

    const today = new Date().toISOString().split("T")[0];
    const docRef = doc(db, "attendance", `${user.uid}_${today}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      status.textContent = `You have selected: ${docSnap.data().meal}`;
    } else {
      status.textContent = "You have not selected a meal yet.";
    }
  } else {
    loginSection.style.display = "block";
    mealSection.style.display = "none";
  }
};

const selectMeal = async (meal) => {
  const user = auth.currentUser;
  if (!user) return alert("Please sign in");

  const today = new Date().toISOString().split("T")[0];
  const month = today.slice(0, 7);
  const ref = doc(db, "attendance", `${user.uid}_${today}`);

  await setDoc(ref, {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    meal,
    date: today,
    month,
    timestamp: serverTimestamp()
  });

  status.textContent = `You have selected: ${meal}`;
};

document.getElementById("google-sign-in").addEventListener("click", loginWithGoogle);
document.getElementById("logout-btn").addEventListener("click", () => signOut(auth));
document.getElementById("lunch-btn").addEventListener("click", () => selectMeal("Lunch"));
document.getElementById("dinner-btn").addEventListener("click", () => selectMeal("Dinner"));

onAuthStateChanged(auth, updateUI);
