const express = require("express");
const fetch = require('node-fetch');
const Jimp = require('jimp');

const router = express.Router();

const imageSnow = {};
var imageSnowImg = null;

Jimp.read("./img/snow.png").then(img => imageSnowImg = img);

const diff = (src, mask) => new Promise((resolve) => {
  mask.scanQuiet(0, 0, mask.bitmap.width, mask.bitmap.height, function(
    x,
    y,
    idx
  ) {
    const srcIdx = src.getPixelIndex(x, y);

    const srcData = src.bitmap.data;
    const maskData = mask.bitmap.data;
    if (srcData[srcIdx + 0] == maskData[idx + 0] &&
      srcData[srcIdx + 1] == maskData[idx + 1] &&
      srcData[srcIdx + 2] == maskData[idx + 2]) {
        src.bitmap.data[srcIdx + 3] = 0;
    } else {
      //red or blue
      const show = srcData[srcIdx + 0] > (srcData[srcIdx + 1] * 0.7 + srcData[srcIdx + 2] * 0.7) || 
        (srcData[srcIdx + 0] < srcData[srcIdx + 1] && srcData[srcIdx + 1] < srcData[srcIdx + 2]);

      src.bitmap.data[srcIdx + 3] = show ? 255 : 0;
      if (show) {
        src.bitmap.data[src.getPixelIndex(x - 1, y) + 3] = 255;
        src.bitmap.data[src.getPixelIndex(x - 1, y - 1) + 3] = 255;
        src.bitmap.data[src.getPixelIndex(x, y - 1) + 3] = 255;
      }
    }
  });

  resolve(src);
});

const getNew = (url, now, image, res) => {
  return fetch(url)
    .then(resp => resp.buffer())
    .then(buffer => Jimp.read(buffer))
    //.then(img => diff(img, imageSnowImg))
    .then(img => img.rotate(-1, (err, img) => 
      img.getBufferAsync('image/png')
      .then(data => {
        image.date = now; 
        image.changed = now; 
        image.image = data;

        res.setHeader("Content-Type", 'image/png');
        res.setHeader("Content-Date", image.changed);
        res.send(image.image);
      })))
      .catch(error => {
        console.error(error);

        if (image.image) {
          image.date = now; 

          res.setHeader("Content-Type", 'image/png');
          res.setHeader("Content-Date", image.changed);
          res.send(image.image);
        } else {
          res.status(500).send("Not available.");
        }
      });
}

router.get('/', (req, res) => {
  const now = new Date();

  if (imageSnow.date >= now - 1 * 60 * 60 * 1000) {
    res.setHeader("Content-Type", 'image/png');
    res.setHeader("Content-Date", imageSnow.changed);
    return res.send(imageSnow.image);
  }

  const url = `https://www.chmi.cz/files/portal/docs/poboc/OS/OMK/mapy/SCE_ST.png`;
  
  getNew(url, now, imageSnow, res);
});

module.exports = router;