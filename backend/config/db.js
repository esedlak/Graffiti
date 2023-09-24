// Erforderliche Module importieren
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// URI für die Verbindung zur MongoDB aus der Umgebungsvariablen holen
const uri = process.env.DB_CONNECTION;

// MongoDB-Client erstellen
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Funktion zum Testen der Dokumentanzahl (Gelbe Zahl nach node server.js)
async function docTest() {
    const docCount = await collection.countDocuments({});
    console.log(docCount);
}

// Verbindung zur MongoDB herstellen
const dbconnection = client.connect();

// Database und Collection mithilfe der Umgebungsvariablen erstellen
const database = client.db(process.env.DB_NAME);
const collection = database.collection(process.env.COLLECTION);

// Konsolenausgabe zur Bestätigung der Verbindung
console.log(`Connected to DB ... `);

// Testen der Dokumentanzahl aufrufen und Fehler behandeln
docTest().catch(console.dir);

// Exportiere MongoDB-Client, Verbindung, Datenbank und Collection für die Verwendung in anderen Modulen
module.exports.client = client;
module.exports.dbconnection = dbconnection;
module.exports.database = database;
module.exports.collection = collection;