# Icon Scraper

Icon Scraper es una herramienta en Node.js que descarga íconos de [The Noun Project](https://thenounproject.com/) basado en palabras clave de búsqueda.

## Instalación

1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Extraer íconos a partir de palabras clave

1. Corre el servidor:
   ```bash
   node src/server.js
   ```
2. Visita [tu servidor](http://localhost:3000) para descargar y examinar tu carpeta local de íconos

## Extraer múltiples íconos a partir de una lista

1. Debes confeccionar un archivo `json` que contenga el listado de palabras que quieres extraer:
   ```json
   {
    "keywords": ["car", "motorcycle", "scooter", "bicycle", "skate"]
   }
   ```
2. Ejecuta el script:
   ```bash
   node scrapeFromJson.js keywords.json
   ```
   El script se saltará la palabra que ya tenga una carpeta con su nombre dentro de `/icons`. Puedes aplicar este script a cualquier archivo `json`.