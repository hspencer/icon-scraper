const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeIcons(keyword, updateProgress) {
    const url = `https://thenounproject.com/search/icons/?q=${keyword}`;
    const results = [];

    // Lanzamos puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Mensajes de progreso
        updateProgress("Realizando solicitud HTTP...");
        await page.goto(url, { waitUntil: 'networkidle2' });
        updateProgress("Página cargada, extrayendo URLs de imágenes...");

        // Extraer URLs de imágenes
        const imageElements = await page.$$eval('div#browse-page-1 img.styles__Image-sc-1bj1qlf-2', imgs =>
            imgs.map(img => img.src)
        );

        // Crear la carpeta de destino
        const mainDir = path.join(__dirname, '../icons', keyword);
        if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir, { recursive: true });

        // Descargar cada imagen usando el nombre original de la URL
        for (const imgUrl of imageElements) {
            const viewSource = await page.goto(imgUrl);
            const imgName = path.basename(new URL(imgUrl).pathname); // Extrae el nombre del archivo de la URL
            const imgPath = path.join(mainDir, imgName);
            fs.writeFileSync(imgPath, await viewSource.buffer());

            results.push(imgPath); // Almacenar la ruta de la imagen descargada
        }

        // Mensaje final de progreso
        updateProgress(`Scraping finalizado para "${keyword}". ${results.length} imágenes descargadas en la carpeta: ${mainDir}`);
    } catch (error) {
        console.error(`Error en el scraping:`, error.message);
    } finally {
        await browser.close();
    }

    return results;
}

module.exports = { scrapeIcons };
