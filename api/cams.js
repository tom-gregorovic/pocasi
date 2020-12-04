const express = require("express");
const fetch = require('node-fetch');
const Jimp = require('jimp');

const router = express.Router();

const chmi = (name) => { return {
  preview: `http://portal.chmi.cz/files/portal/docs/meteo/kam/${name}_small.jpg`,
  img: `http://portal.chmi.cz/files/portal/docs/meteo/kam/${name}.jpg`,
  page: `http://portal.chmi.cz/files/portal/docs/meteo/kam/prohlizec.html?cam=${name}` }; };

const cams = [
  { id: 1, name: "Maruška", dir: "V", coords: [49.3656953, 17.8278367, 660], ...chmi("maruska")},
  { id: 2, name: "Tišnov - náměstí", dir: "SV", coords: [49.3487122, 16.4230078, 260], 
    img: `http://46.149.124.196/webcam/radnice.jpg`,
    page: `https://www.tisnov.cz/mesto/mesto/web-kamera`
  }
];

const camsData = [];

const updatePreview = (cam) => {  
  return fetch(cam.preview || cam.img)
    .then(resp => resp.buffer())
    .then(buffer => {
      var data = camsData.find(c => c.id == cam.id);

      if (!data) {
        data = { id: cam.id };
        camsData.push(data);
      }
      
      data.img = buffer;
    });
};

router.get('/', (req, res) => {
  cams.forEach(cam => {
    if (!cam.date || Math.abs(new Date() - cam.date) >= 1 * 60 * 60 * 1000) {
      cam.date = new Date();
      updatePreview(cam);
    }
  });

  res.json(cams);
});

router.get('/:camId', (req, res) => {
  const id = parseInt(req.params.camId);
  if (id) {
    const data = camsData.find(c => c.id == id);
    if (data && data.img) {
      res.setHeader("Content-Type", 'image/jpeg');
      res.send(data.img);
      return;
    }
  }

  res.sendStatus(404);
});

module.exports = router;