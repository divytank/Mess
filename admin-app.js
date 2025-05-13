const db = firebase.firestore();

const fetchMonthlyAnalysis = () => {
    const month = document.getElementById("month").value;

    db.collection("attendance")
        .where("month", "==", month)
        .get()
        .then(snapshot => {
            const tableBody = document.querySelector("#monthly-analysis tbody");
            tableBody.innerHTML = "";  // Clear previous data

            snapshot.forEach(doc => {
                const data = doc.data();
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.name}</td>
                    <td>${data.meal === "Lunch" ? 1 : 0}</td>
                    <td>${data.meal === "Dinner" ? 1 : 0}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching analysis: ", error);
        });
};

document.getElementById("fetch-analysis").addEventListener("click", fetchMonthlyAnalysis);
