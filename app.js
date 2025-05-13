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
  appId: "1:671902269485:web:e27454006792d27f51b8a4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      document.getElementById("user-info").innerHTML = `
        <p>Welcome, ${user.displayName}</p>
        <p>Email: ${user.email}</p>
      `;
      document.getElementById("login-section").style.display = "none";
      document.getElementById("meal-selection-section").style.display = "block";
      document.getElementById("user-name").textContent = user.displayName;
    })
    .catch((error) => {
      console.error("Login error:", error);
    });
}

async function changeMealPreference(meal) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please sign in first.");
    return;
  }

  const date = new Date().toISOString().split('T')[0];
  const month = date.substring(0, 7);
  const docRef = doc(db, "attendance", `${user.uid}_${date}`);

  try {
    await setDoc(docRef, {
      name: user.displayName,
      meal: meal,
      date: date,
      month: month,
      timestamp: serverTimestamp()
    });
    alert(`Your meal preference has been updated to ${meal}.`);
  } catch (error) {
    console.error("Error updating meal preference:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("google-sign-in").addEventListener("click", loginWithGoogle);
  document.getElementById("lunch-btn").addEventListener("click", () => changeMealPreference("Lunch"));
  document.getElementById("dinner-btn").addEventListener("click", () => changeMealPreference("Dinner"));
  document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
      document.getElementById("login-section").style.display = "block";
      document.getElementById("meal-selection-section").style.display = "none";
    });
  });
});
