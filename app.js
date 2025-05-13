const firebaseConfig = {
    apiKey: "AIzaSyDzCChRQGajRyy22iZ-P58QMLtjlbM4Bmc",
    authDomain: "mess-attendance-b92f9.firebaseapp.com",
    projectId: "mess-attendance-b92f9",
    storageBucket: "mess-attendance-b92f9.firebasestorage.app",
    messagingSenderId: "671902269485",
    appId: "1:671902269485:web:e27454006792d27f51b8a4",
    measurementId: "G-9QQY5C1EPT"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            document.getElementById("user-name").textContent = user.displayName;
            document.getElementById("login-section").style.display = 'none';
            document.getElementById("meal-selection-section").style.display = 'block';
        })
        .catch((error) => {
            console.error(error.message);
        });
};

const changeMealPreference = (meal) => {
    const user = firebase.auth().currentUser;
    const date = new Date().toISOString().split('T')[0];  
    const month = date.substring(0, 7);  

    const mealDocRef = db.collection("attendance").doc(user.uid);

    mealDocRef.set({
        name: user.displayName,
        meal: meal,
        date: date,
        month: month,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
    .then(() => {
        alert(`Your meal preference has been updated to ${meal}.`);
    })
    .catch(error => {
        console.error("Error updating meal preference: ", error);
    });
};

document.getElementById("google-sign-in").addEventListener("click", signInWithGoogle);
document.getElementById("lunch-btn").addEventListener("click", () => changeMealPreference("Lunch"));
document.getElementById("dinner-btn").addEventListener("click", () => changeMealPreference("Dinner"));
document.getElementById("logout-btn").addEventListener("click", () => firebase.auth().signOut());
