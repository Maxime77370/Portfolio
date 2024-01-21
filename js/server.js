const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Configuration du middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../')));

// Configuration des routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'portfolio.html'));
});


// Démarrage du serveur
app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur http://localhost:${port}/`);
});