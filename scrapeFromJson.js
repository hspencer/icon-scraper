const fs = require('fs');
const path = require('path');
const { scrapeIcons } = require('./src/scraper'); // Ajuste de la ruta hacia scraper.js en /src
const fetch = require('node-fetch'); // Asegúrate de tener `node-fetch` instalado

// Función para generar un delay aleatorio entre 5 y 20 segundos
function randomDelay() {
    return Math.floor(Math.random() * 15000) + 5000; // Entre 5s y 20s en milisegundos
}

async function processKeyword(keyword) {
    const dir = path.join(__dirname, 'icons', keyword);

    // Verificar si la carpeta ya existe
    if (fs.existsSync(dir)) {
        console.log(`\x1b[33mCarpeta para "${keyword}" ya existe. Vamos a la siguiente...\x1b[0m`);
        return;
    }

    // Dividir el mensaje en dos partes para resaltar el concepto en blanco
    console.log(`\x1b[1m\x1b[35mIniciando scraping para "\x1b[37m${keyword}\x1b[35m"...\x1b[0m`);
    try {
        await scrapeIcons(keyword, message => console.log(`\x1b[32m${message}\x1b[0m`));
        console.log(`\x1b[32mScraping completado para "${keyword}".\x1b[0m`);
    } catch (error) {
        console.error(`\x1b[31mError al ejecutar el scraper para "${keyword}": ${error.message}\x1b[0m`);
    }
}

async function scrapeFromJson(jsonFile) {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, jsonFile), 'utf8'));
        const keywords = data.keywords;

        console.log(`\x1b[1m\x1b[36mProcesando ${keywords.length} palabras clave del archivo JSON...\x1b[0m`);

        for (const keyword of keywords) {
            await processKeyword(keyword);

            // Aplicar delay solo si la palabra fue procesada (es decir, si la carpeta no existía)
            if (!fs.existsSync(path.join(__dirname, 'icons', keyword))) {
                const delay = randomDelay();
                console.log(`\x1b[36mEsperando ${delay / 1000} segundos antes de la próxima solicitud...\x1b[0m`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        console.log('\x1b[1m\x1b[32mScraping finalizado para todas las palabras del archivo JSON.\x1b[0m');
    } catch (error) {
        console.error(`\x1b[31mError al procesar el archivo JSON: ${error.message}\x1b[0m`);
    }
}

// Ejecutar el script desde la terminal pasando el nombre del archivo JSON como argumento
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('\x1b[31mPor favor, proporciona el nombre de un archivo JSON con palabras clave.\x1b[0m');
    process.exit(1);
}

const jsonFile = args[0];
scrapeFromJson(jsonFile);