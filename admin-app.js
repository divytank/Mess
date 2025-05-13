const firebaseConfig = {
  apiKey: "AIzaSyDzCChRQGajRyy22iZ-P58QMLtjlbM4Bmc",
  authDomain: "mess-attendance-b92f9.firebaseapp.com",
  projectId: "mess-attendance-b92f9",
  storageBucket: "mess-attendance-b92f9.appspot.com",
  messagingSenderId: "671902269485",
  appId: "1:671902269485:web:e27454006792d27f51b8a4",
  measurementId: "G-9QQY5C1EPT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById("fetch-analysis").addEventListener("click", async () => {
  const month = document.getElementById("month").value;
  const tableBody = document.querySelector("#monthly-analysis tbody");
  tableBody.innerHTML = "";

  const snapshot = await db.collection("attendance")
    .where("month", "==", month)
    .orderBy("date")
    .get();

  snapshot.forEach(doc => {
    const data = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.date}</td>
      <td>${data.meal}</td>
    `;
    tableBody.appendChild(row);
  });
});
