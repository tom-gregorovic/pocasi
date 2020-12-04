const express = require("express");
const fetch = require('node-fetch');
const Jimp = require('jimp');

const router = express.Router();

const imageVisIr = {};
const image24h = {};

const getNowUtc = () => {
  const now = new Date(new Date(Math.floor((new Date() - 35 * 60 * 1000) / (15 * 60 * 1000)) * 15 * 60 * 1000));
  return `${now.getUTCFullYear()}${("0" + (now.getUTCMonth() + 1)).slice(-2)}${("0" + now.getUTCDate()).slice(-2)}.${("0" + now.getUTCHours()).slice(-2)}${("0" + now.getMinutes()).slice(-2)}`;
}

const getNew = (url, now, image, res) => {
  return fetch(url)
    .then(resp => resp.buffer())
    .then(buffer => {
      Jimp.read(buffer).then(img => img.crop(340, 280, 800, 400, (err, img) => {
      img.rotate(-2.5, (err, img) => 
      Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font =>
      img.print(font, 20, 2, now, (err, img) =>
      img.getBufferAsync('image/jpeg')
      .then(data => {
        image.date = now; 
        image.changed = now; 
        image.image = data;

        res.setHeader("Content-Type", 'image/jpeg');
        res.setHeader("Content-Date", image.changed);
        res.send(image.image);
      }))))}))})
      .catch(error => {
        console.error(error);

        if (image.image) {
          image.date = now; 

          res.setHeader("Content-Type", 'image/jpeg');
          res.setHeader("Content-Date", image.changed);
          res.send(image.image);
        } else {
          res.status(500).send("Not available.");
        }
      });
}

router.get('/24h', (req, res) => {
  const now = getNowUtc();

  if (image24h.date >= now) {
    res.setHeader("Content-Type", 'image/jpeg');
    res.setHeader("Content-Date", image24h.changed);
    return res.send(image24h.image);
  }

  const url = `http://portal.chmi.cz/files/portal/docs/meteo/sat/msg_hrit/img-msgcz-1160x800-24M/msgcz-1160x800.24M.${now}.0.jpg`;
  
  getNew(url, now, image24h, res);
});

router.get('/vis-ir', (req, res) => {
  const now = getNowUtc();

  if (imageVisIr.date >= now) {
    res.setHeader("Content-Type", 'image/jpeg');
    res.setHeader("Content-Date", imageVisIr.changed);
    return res.send(imageVisIr.image);
  }

  const url = `http://portal.chmi.cz/files/portal/docs/meteo/sat/msg_hrit/img-msgcz-1160x800-vis-ir/msgcz-1160x800.vis-ir.${now}.0.jpg`;
  
  getNew(url, now, imageVisIr, res);
});

module.exports = router;