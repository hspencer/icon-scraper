const express = require('express');
const { scrapeIcons } = require('./scraper');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde `public`
app.use(express.static(path.join(__dirname, '../public')));

// Verifica la ruta real de `icons`
const iconsPath = path.join(__dirname, '../icons');
console.log(`Serving icons from: ${iconsPath}`);
app.use('/icons', express.static(iconsPath)); // Servir archivos estáticos desde `icons`

app.use(express.json());

// Endpoint para ejecutar el scraper
app.post('/scrape', async (req, res) => {
    const { keyword } = req.body;
    if (!keyword) {
        return res.status(400).json({ message: 'Por favor, proporciona una palabra clave.' });
    }

    const progressUpdates = [];

    function updateProgress(message) {
        progressUpdates.push(message);
    }

    try {
        const results = await scrapeIcons(keyword, updateProgress);
        res.json({ message: `Scraping finalizado para ${keyword}`, results, progress: progressUpdates });
    } catch (error) {
        res.status(500).json({ message: 'Error al ejecutar el scraper', error: error.message, progress: progressUpdates });
    }
});

// Endpoint para listar los contenidos de la carpeta `icons` o de una subcarpeta
app.get('/list-icons', (req, res) => {
    const folder = req.query.folder || '';
    const iconsDir = path.join(__dirname, '../icons', folder);

    fs.readdir(iconsDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error al listar la carpeta:', err.message);
            return res.status(500).json({ message: 'Error al listar la carpeta', error: err.message });
        }

        // Convertir en una lista con nombre y tipo (directorio o archivo)
        const contents = files.map(file => ({
            name: file.name,
            isDirectory: file.isDirectory()
        }));

        res.json({ path: folder, contents });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
