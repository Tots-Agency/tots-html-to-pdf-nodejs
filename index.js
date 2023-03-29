const functions = require('@google-cloud/functions-framework');
const puppeteer = require('puppeteer');

functions.http('init', async (req, res) => {
    // Cors
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }

    const fileName = Date.now() + '_' + generateCode() + '.pdf';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(req.body.html);
    await page.pdf({ path: fileName, format: 'A4' });
    await browser.close();

    res.download(fileName, 'export_' + fileName, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
        }
    });
});

function generateCode() {
    let codigo = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < 10; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
  
    return codigo;
}