import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
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
const mealSection = document.getElementById("meal-section");
const userNameSpan = document.getElementById("user-name");
const dateSpan = document.getElementById("current-date");

const today = new Date().toISOString().split("T")[0];
const month = today.slice(0, 7);
dateSpan.textContent = today;

document.getElementById("google-sign-in").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    userNameSpan.textContent = user.displayName;
    loginSection.style.display = "none";
    mealSection.style.display = "block";
  } catch (error) {
    console.error("Sign-in error:", error);
  }
});

async function updateMeal(meal) {
  const user = auth.currentUser;
  if (!user) return alert("Please sign in.");

  const docRef = doc(db, "attendance", `${user.uid}_${today}`);
  await setDoc(docRef, {
    uid: user.uid,
    name: user.displayName,
    meal,
    date: today,
    month,
    timestamp: serverTimestamp()
  });

  alert(`Meal set to: ${meal}`);
}

document.getElementById("lunch-btn").addEventListener("click", () => updateMeal("Lunch"));
document.getElementById("dinner-btn").addEventListener("click", () => updateMeal("Dinner"));

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth);
  loginSection.style.display = "block";
  mealSection.style.display = "none";
});
