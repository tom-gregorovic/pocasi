const express = require("express");
const fetch = require('node-fetch');
const Jimp = require('jimp');

const router = express.Router();

const imageVisIr = {};
const image24h = {};
const aladin = {};

const getNowUtc = () => {
  const now = new Date(new Date(Math.floor((new Date() - 35 * 60 * 1000) / (15 * 60 * 1000)) * 15 * 60 * 1000));
  return `${now.getUTCFullYear()}${("0" + (now.getUTCMonth() + 1)).slice(-2)}${("0" + now.getUTCDate()).slice(-2)}.${("0" + now.getUTCHours()).slice(-2)}${("0" + now.getMinutes()).slice(-2)}`;
}

const getNew = (url, now, image, res, mime = 'image/jpeg') => {
  return fetch(url)
    .then(resp => resp.buffer())
    .then(buffer => {
      Jimp.read(buffer)
      .then(img => img.crop(340, 280, 800, 400, (err, img) => {
      img.rotate(0, (err, img) => 
      Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font =>
      img.print(font, 20, 2, now, (err, img) =>
      img.getBufferAsync(mime)
      .then(data => {
        image.date = now; 
        image.changed = now; 
        image.image = data;

        res.setHeader("Content-Type", mime);
        res.setHeader("Content-Date", image.changed);
        res.send(image.image);
      }))))}))})
      .catch(error => {
        console.error(error);

        if (image.image) {
          image.date = now; 

          res.setHeader("Content-Type", mime);
          res.setHeader("Content-Date", image.changed);
          res.send(image.image);
        } else {
          res.status(500).send("Not available.");
        }
      });
}

const getNewPng = (url, now, image, res, mime = 'image/png') => {
  return fetch(url)
    .then(resp => resp.buffer())
    .then(buffer => {
      Jimp.read(buffer)
      .then(img =>
      img.rotate(0, (err, img) => 
      Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font =>
      img.print(font, 20, 2, now, (err, img) =>
      img.getBufferAsync(mime)
      .then(data => {
        image.date = now; 
        image.changed = now; 
        image.image = data;

        res.setHeader("Content-Type", mime);
        res.setHeader("Content-Date", image.changed);
        res.send(image.image);
      })))))})
      .catch(error => {
        console.error(error);

        if (image.image) {
          image.date = now; 

          res.setHeader("Content-Type", mime);
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

router.get('/aladin/:hours', (req, res) => {
  const n = new Date();
  const dateAladin = new Date(new Date(n.getFullYear(), n.getMonth(), n.getDate(),
    Math.floor(n.getHours() / 6) * 6).valueOf() - 6 * 60 * 60 * 1000);
  const dateTarget = new Date(new Date(n.getFullYear(), n.getMonth(), n.getDate(), req.params.hours).valueOf() 
    + 24 * 60 * 60 * 1000);
  const now = `${dateAladin.getFullYear()}${("0" + (dateAladin.getMonth() + 1)).slice(-2)}${("0" + dateAladin.getDate()).slice(-2)}${("0" + dateAladin.getHours()).slice(-2)}`;
  const h = ("0" + Math.round((dateTarget - dateAladin) / (60 * 60 * 1000))).slice(-2);

  if (!aladin[`h${req.params.hours}`]) {
    aladin[`h${req.params.hours}`] = {};
  }

  const a = aladin[`h${req.params.hours}`];

  if (a.date >= now) {
    res.setHeader("Content-Type", 'image/png');
    res.setHeader("Content-Date", a.changed);
    return res.send(a.image);
  }

  const url = `https://www.chmi.cz/files/portal/docs/meteo/ov/aladin/results/public/mapy/data/${now}/nebul_public_${h}.png`;
  
  console.log(url);
  getNewPng(url, now, a, res);
});

module.exports = router;