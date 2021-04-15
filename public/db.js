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
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.success = function() {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["transaction"], "readwrite");
                const store = transaction.objectStore
                store.clear();
            });
        }
    }

    function saveRecord(record) {
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore("pending");
        store.add(record);
    }

}

window.addEventListener("online", checkDatabase);