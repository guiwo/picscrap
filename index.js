//instal npm i fs https puppeteer
//npm index to run

const fs = require("fs");
const https = require("https");
const puppeteer = require("puppeteer");

/**
 * 
 * @param {*} url 
 * @param {*} destination 
 * @returns 
 */
const download = (url, destination) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve(true));
        });
      })
      .on("error", (error) => {
        fs.unlink(destination);

        reject(error.message);
      });
  });

/**
 * 
 */
(async () => {
  try {
    const navigator = await puppeteer.launch();
    const page = await navigator.newPage();
    await page.goto(""); //https://www.url.com/page.html
    // const html = await page.content();
    //console.log(html);

    const result = await page.evaluate(() => {
      //selector
      const pics = [...document.querySelectorAll("selector")].map(
        (imgNode) => imgNode.href //selector property with image data
      );
      //returns an array with the url
      return pics.map((picUrl, i) => ({
        pic: picUrl,
        index: i,
      }));
    });

    for (let i = 0; i < result.length; i++) {
      let r = await download(result[i].pic, `./images/image-${i}.png`);

      if (r === true) {
        console.log(
          "Success:",
          result[i].pic,
          "has been downloaded successfully."
        );
      } else {
        console.log("Error:", result[i].pic, "was not downloaded.");
        console.error(block);
      }
    }

    // console.log("result", result);

    await navigator.close();
  } catch (error) {
    console.error(error);
  }
})(); //() executes;
