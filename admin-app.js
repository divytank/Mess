import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
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
const db = getFirestore(app);

document.getElementById("fetch-analysis").addEventListener("click", async () => {
  const month = document.getElementById("month").value;
  const q = query(collection(db, "attendance"), where("month", "==", month));
  const snapshot = await getDocs(q);

  const tableBody = document.querySelector("#monthly-analysis tbody");
  tableBody.innerHTML = "";

  const userMealCounts = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name;
    const meal = data.meal;

    if (!userMealCounts[name]) {
      userMealCounts[name] = { Lunch: 0, Dinner: 0 };
    }
    userMealCounts[name][meal]++;
  });

  for (const name in userMealCounts) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${userMealCounts[name].Lunch}</td>
      <td>${userMealCounts[name].Dinner}</td>
    `;
    tableBody.appendChild(row);
  }
});
