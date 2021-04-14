let database;

const request = indexedDB.open("budget", 1);

request.upgradeneeded = function(e) {
    const database = e.target.result;
    database.createObjectStore("pending", { autoIncrement: true });
};

request.onerror = function(e) {
    console.log("Error");
};

request.onsuccess = function(e) {
    database = e.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

function checkDatabase() {
    const transaction = db.transaction(["transaction"], "readwrite");
}