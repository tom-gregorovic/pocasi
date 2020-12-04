const express = require("express");
const fetch = require('node-fetch');
const Jimp = require('jimp');

const router = express.Router();

const imageSnow = {};

const getNew = (url, now, image, res) => {
  return fetch(url)
    .then(resp => resp.buffer())
    .then(buffer => Jimp.read(buffer))
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