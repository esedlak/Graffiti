//=====================================================
// SERVER.JS
// Datum: 18.09.2023
//=====================================================

// Importiere die benötigten Module
const express = require('express');  // Express.js für die REST-API
const postRoutes = require('./routes/posts.routes'); // Routen für Posts
const cors = require('cors'); // Cors-Modul für Cross-Origin-Anfragen

// Erstelle eine Express-App
const app = express();

// Port, auf dem der Server lauscht
const PORT = 3000;

// Middleware für das Parsen von JSON-Anfragen aktivieren
app.use(express.json());

// CORS (Cross-Origin Resource Sharing) aktivieren, um Anfragen von verschiedenen Ursprüngen zu ermöglichen
app.use(cors());

// Verknüpfe die Routen für die Posts unter dem Präfix '/posts'
app.use('/posts', postRoutes);


// Starte den Server und höre auf dem angegebenen Port
app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});