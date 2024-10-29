const fs = require('fs');
const path = require('path');
const { scrapeIcons } = require('./src/scraper'); // Ajuste de la ruta hacia scraper.js en /src
const fetch = require('node-fetch'); // Asegúrate de tener `node-fetch` instalado

function randomDelay() {
    return Math.floor(Math.random() * 30000) + 30000; // Entre 30s y 60s en milisegundos
}

async function processKeyword(keyword) {
    console.log(`Iniciando scraping para "${keyword}"...`);
    try {
        await scrapeIcons(keyword, message => console.log(message));
        console.log(`Scraping finalizado para "${keyword}".`);
    } catch (error) {
        console.error(`Error al ejecutar el scraper para "${keyword}": ${error.message}`);
    }
}

async function scrapeFromJson(jsonFile) {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, jsonFile), 'utf8'));
        const keywords = data.keywords;

        for (const keyword of keywords) {
            await processKeyword(keyword);
            const delay = randomDelay();
            console.log(`Esperando ${delay / 1000} segundos antes de la próxima solicitud...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        console.log('Scraping finalizado para todas las palabras del archivo JSON.');
    } catch (error) {
        console.error('Error al procesar el archivo JSON:', error.message);
    }
}

// Ejecutar el script desde la terminal pasando el nombre del archivo JSON como argumento
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Por favor, proporciona el nombre de un archivo JSON con palabras clave.');
    process.exit(1);
}

const jsonFile = args[0];
scrapeFromJson(jsonFile);