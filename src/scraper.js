const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Función principal para realizar el scraping de íconos desde The Noun Project.
 * @param {string} keyword - La palabra clave para buscar íconos.
 * @param {function} updateProgress - Función de callback para actualizar el progreso.
 * @returns {Promise<string[]>} - Una lista con las rutas de las imágenes descargadas.
 */

async function scrapeIcons(keyword, updateProgress) {
    const url = `https://thenounproject.com/search/icons/?q=${keyword}`;
    const results = [];

    // Lanzamos puppeteer para controlar un navegador de forma automatizada
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Mensajes de progreso
        updateProgress("Realizando solicitud HTTP...<br>");
        await page.goto(url, { waitUntil: 'networkidle2' });
        updateProgress("Página cargada, extrayendo URLs de imágenes...<br>");

        // Extraer URLs de las imágenes que coincidan con el selector especificado
        const imageElements = await page.$$eval('div#browse-page-1 img.styles__Image-sc-1bj1qlf-2', imgs =>
            imgs.map(img => img.src)
        );

        // Verificamos si hay imágenes disponibles
        if (imageElements.length > 0) {
            // Crear la carpeta de destino solo si hay imágenes
            const mainDir = path.join(__dirname, '../icons', keyword);
            if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir, { recursive: true });

            updateProgress(`<br>Descargando ${imageElements.length} imágenes...<br>`);

            for (const [index, imgUrl] of imageElements.entries()) {
                // Descargar cada imagen utilizando su URL
                const viewSource = await page.goto(imgUrl);
                const imgName = path.basename(new URL(imgUrl).pathname); // Extrae el nombre del archivo de la URL
                const imgPath = path.join(mainDir, imgName);
                fs.writeFileSync(imgPath, await viewSource.buffer());

                results.push(imgPath); // Almacenar la ruta de la imagen descargada
                // updateProgress(`Imagen ${index + 1} de ${imageElements.length} descargada.<br>`);
            }

            // Mensaje final de progreso indicando el total de imágenes descargadas
            updateProgress(`<br>Scraping finalizado para "${keyword}". Se descargaron un total de ${results.length} imágenes en la carpeta:<br>${mainDir}<br>`);
        } else {
            // Mensaje si no se encontraron imágenes
            updateProgress(`Se omite la creación de la carpeta "${keyword}" por falta de resultados.<br>`);
            updateProgress(`No se descargaron imágenes para "${keyword}".<br>`);
        }
    } catch (error) {
        // Manejo de errores durante el scraping
        console.error(`Error en el scraping:`, error.message);
    } finally {
        // Cerrar el navegador de puppeteer
        await browser.close();
    }

    return results;
}

module.exports = { scrapeIcons };
