import { error, log } from "console";
import { Browser } from "puppeteer";
const puppeteer = require('puppeteer');
//fs=fileSystem
const fs = require('fs');

const url = 'https://www.padelnuestro.com/palas-padel';

const main = async () =>{
    const browser: Browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    const racketsData = await page.evaluate(() => {
        const racketsInfo = Array.from(document.querySelectorAll('.product-item'));

        
        const data = racketsInfo.map((racket: any) => ({
            title: racket.querySelector('.product-item-name > a')?.textContent.trim(), // Accedemos al título correctamente
            //TODO: SE PODRIA LLEGAR A PLANTEAR DE PONER PRECIOS ANTIGUOS...
            price: racket.querySelector('.price-wrapper .price')?.textContent.trim(),
            imgSrc: racket.querySelector('.product-image-photo')?.getAttribute('data-src'),
        }));

        return data;
    });

    console.log(racketsData);
    
    await browser.close();

    fs.writeFile('rackets.json', JSON.stringify(racketsData), (err: any) =>{
        if(err) throw err
        console.log("Datos cargados correctamente para el JSON de palas de Padel!");
        
    })
}

main();
