const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/screenshot', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("URL ausente");

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshot = await page.screenshot({ type: 'jpeg' });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(screenshot);
  } catch (error) {
    res.status(500).send("Erro ao capturar a página: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`ScrapeServ rodando na porta ${PORT}`);
});
