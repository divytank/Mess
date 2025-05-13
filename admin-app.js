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
  appId: "1:671902269485:web:e27454006792d27f51b8a4",
  measurementId: "G-9QQY5C1EPT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("fetch-btn").addEventListener("click", async () => {
  const monthValue = document.getElementById("month-picker").value;
  const tableBody = document.querySelector("#analysis-table tbody");
  tableBody.innerHTML = "";

  if (!monthValue) {
    alert("Please select a month.");
    return;
  }

  const q = query(collection(db, "attendance"), where("month", "==", monthValue));
  const querySnapshot = await getDocs(q);

  const dataMap = {};

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const key = `${data.uid}_${data.date}`;
    dataMap[key] = data; // overwrite if re-selected

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.date}</td>
      <td>${data.meal}</td>
    `;
    tableBody.appendChild(row);
  });

  if (querySnapshot.empty) {
    tableBody.innerHTML = `<tr><td colspan="3">No records found for this month.</td></tr>`;
  }
});
