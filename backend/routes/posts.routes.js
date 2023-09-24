//=====================================================
// Diese Datei definiert die Routen für die Posts in der REST-Schnittstelle.
//=====================================================

// Erforderliche Module importieren
const express = require('express');
const router = express.Router();
const { collection } = require('../config/db')

const  ObjectId = require('mongodb').ObjectId
const upload = require('../middleware/upload');

//-----------------------------------------------------------------
// GET all post
//-----------------------------------------------------------------
router.get('/', async(req, res) => {
    console.log("hallo Alle Posts werden abgefragt");
    const post = await collection.find().toArray();
    res.send(post);
    }
)

//-----------------------------------------------------------------
// GET one post by id
//-----------------------------------------------------------------
router.get('/:id', async(req, res) => {

    try {
        // Erzeugt ein MongoDB-Objekt-ID aus dem in der Anfrage übergebenen ID-Parameter
        const id_obj = new ObjectId(req.params.id);

        // Sucht den Post in der Datenbank anhand der ID und gibt ihn zurück
        const post = await collection.find( {_id: id_obj } ).toArray();
        console.log('post', req.params.id);

        // Erfolgreiche Anfrage mit Statuscode 202 und dem gefundenen Post als Antwort senden
        res.status(202);
        res.send(post);
    } catch {
        // Fehlerfall: ID existiert nicht, daher Statuscode 404 und Fehlermeldung senden
        res.status(404);
        res.send({
            error: "ID does not exist!"
        });
    }
});

//-----------------------------------------------------------------
// PATCH (update) one post
// Diese Route aktualisiert die Daten eines vorhandenen Posts basierend auf den übergebenen Parametern.
//-----------------------------------------------------------------
router.patch('/:id', async(req, res) => { 
    try 
    { 
        // Erzeugt ein MongoDB-Objekt-ID aus dem in der Anfrage übergebenen ID-Parameter
        const id_obj = new ObjectId(req.params.id);
        
        // Sucht den Post in der Datenbank anhand der ID
        const post = await collection.findOne({ _id: id_obj })

        // Aktualisiert die Post-Daten basierend auf den in der Anfrage übergebenen Parametern
        if (req.body.title) {
            post.title = req.body.title
        }

        if (req.body.location) {
            post.location = req.body.location
        }

        if (req.body.image_id) {
            post.image_id = req.body.image_id
        }
        
        // Aktualisierten Post in der Datenbank speichern
        await collection.updateOne({ _id: id_obj }, { $set: post });

        // Aktualisierten Post als Antwort senden
        res.send(post);
    } 
    catch { 
        // Fehlerfall: Der Post existiert nicht, daher Statuscode 404 und Fehlermeldung senden
        res.status(404);
        res.send({ error: "Post does not exist!" }) 
    }
});

//-----------------------------------------------------------------
//  DELETE one post via id
//-----------------------------------------------------------------
router.delete('/:id', async(req, res) => {
    try {
        // Erzeugt ein MongoDB-Objekt-ID aus dem in der Anfrage übergebenen ID-Parameter
        const id_obj = new ObjectId(req.params.id);

        // Löscht den Post in der Datenbank anhand der ID
        const post = await collection.deleteOne({ _id: id_obj })
        console.log('post', post)

        // Wenn der Post erfolgreich gelöscht wurde, sende Statuscode 204 (Erfolgreich, keine Inhaltsangabe)
        if(post.deletedCount === 1) {
            res.status(204)
            res.send( { message: "deleted" })
        } else {
            // Wenn der Post nicht gefunden wurde, sende Statuscode 404 und Fehlermeldung
            res.status(404)
            res.send({ error: "Post does not exist!" })
        }
    } catch {
        // Fehlerfall: Etwas ist schiefgelaufen, daher Statuscode 404 und Fehlermeldung senden
        res.status(404)
        res.send({ error: "something wrong" })
    }
});

//-----------------------------------------------------------------
// POST one new post
//-----------------------------------------------------------------
router.post('/', async(req, res) => {

    try {
        // Erzeugt ein neues Object auf Basis der Informationen im Request-Body
        const newPost = {
            title: req.body.title,
            location: req.body.location,
            image_id: req.body.image_id 
        }
        console.log(newPost);

        // Fügt das neue Post-Objekt der Datenbank hinzu
        const result = await collection.insertOne(newPost);

        // Erfolgreiche Anfrage mit Statuscode 201 (Erstellt) und dem Ergebnis der Datenbankoperation als Antwort senden
        res.status(201);
        res.send(result);
    } catch {
        // Fehlerfall: Der Post existiert nicht, daher Statuscode 404 und Fehlermeldung senden
        res.status(404);
        res.send({
            error: "Post does not exist!"
        });
    }
});

// Exportiere Router für die Verwendung in anderen Modulen
module.exports = router;