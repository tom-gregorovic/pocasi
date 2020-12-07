const express = require("express");
const fetch = require('node-fetch');
const Jimp = require('jimp');
const captureWebsite = require('capture-website');

const router = express.Router();

const chmi = (name) => { return {
  preview: `http://portal.chmi.cz/files/portal/docs/meteo/kam/${name}_small.jpg`,
  img: `http://portal.chmi.cz/files/portal/docs/meteo/kam/${name}.jpg`,
  page: `https://www.chmi.cz/files/portal/docs/meteo/kam/prohlizec.html?cam=${name}` }; };

const cams = [
  { id: 1, name: "Maruška", dir: "V", coords: [49.3656953, 17.8278367, 664], ...chmi("maruska")},
  { id: 2, name: "Lysá Hora JZ", dir: "JZ", coords: [49.5461503, 18.4476114, 1322], ...chmi("lysa_hora3")},
  { id: 3, name: "Lysá Hora JV", dir: "JV", coords: [49.5461503, 18.4476114, 1322], ...chmi("lysa_hora2")},
  { id: 4, name: "Šerák", dir: "SV", coords: [50.1876511, 17.1084386, 1328], ...chmi("serak")},
  { id: 5, name: "Rýmařov", dir: "SZ", coords: [49.9320617, 17.2732753, 578], ...chmi("rymarov")},

  { id: 100, name: "Tišnov - náměstí", dir: "SV", coords: [49.3487122, 16.4230078, 260], 
    img: `http://46.149.124.196/webcam/radnice.jpg`,
    page: `https://www.tisnov.cz/mesto/mesto/web-kamera`
  },
  { id: 101, name: "Adamov", dir: "JV", coords: [49.3022919, 16.6562461, 320], 
    img: `https://adamov.realhost.cz/img/webcam/koupaliste.jpg`,
    page: `https://www.adamov.cz/rychle-odkazy/webkamery`
  },
  { id: 102, name: "Velká Javořina", dir: "JV", coords: [48.8574139, 17.6819269, 900], 
    page: 'http://myjava.dohlad.info/kamera/128/holubyho-chata-pred-chatou',
    pageOptions: { type: "jpeg", width: 200, height: 150, removeElements: ["#header", ".menu", "#mini_imgs"], fullPage: true, scaleFactor: 1 }
  },
  { id: 103, name: "Pálava - Nové Mlýny", dir: "Z", coords: [48.8727572, 16.7250322, 175], 
    page: 'https://www.webcamlive.cz/web-kamera-chko-palava-172-36',
    pageOptions: { type: "jpeg", width: 200, height: 150, 
      removeElements: ["#header", ".col_1", ".col_2", ".googleBottom", "#footer", "h2", ".regionWide", ".supRegsLinks",
        "p", ".supregs", "iframe", ".mapbutton"], fullPage: true, scaleFactor: 1 },
    pageCrop: {x: 0, y: 0, w: 500, h: 300},
  },
];

const camsData = [];

const updatePreview = (cam) => {  
  return ((cam.preview || cam.img) ? fetch(cam.preview || cam.img).then(resp => resp.buffer()) 
    : captureWebsite.buffer(cam.page, cam.pageOptions))
    .then(buffer => {
      if (!cam.pageCrop) {
        return buffer;
      }

      return new Promise((resolve, reject) => Jimp.read(buffer)
        .then(img => img.crop(cam.pageCrop.x, cam.pageCrop.y, cam.pageCrop.w, cam.pageCrop.h, (e, img) => img.getBufferAsync("image/jpeg").then(b => resolve(b))))
        .catch(e => reject(e)));
    })
    .then(buffer => {
      var data = camsData.find(c => c.id == cam.id);

      if (!data) {
        data = { id: cam.id };
        camsData.push(data);
      }
      
      data.img = buffer;

      return Promise.resolve(data);
    });
};

router.get('/', (req, res) => {
  res.json(cams);
});

router.get('/:camId', (req, res) => {
  const id = parseInt(req.params.camId);
  const cam = cams.find(c => c.id == id);
  
  if (id && cam) {
    var dataPromise = null;

    if (!cam.date || Math.abs(new Date() - cam.date) >= 1 * 60 * 60 * 1000) {
      cam.date = new Date();
      dataPromise = updatePreview(cam);
    }
    else {
      dataPromise = Promise.resolve(camsData.find(c => c.id == id));
    }

    dataPromise.then(data =>  {
    if (data && data.img) {
      res.setHeader("Content-Type", 'image/jpeg');
      res.send(data.img);
    }}).catch(e => {
      console.error(e);
      res.status(500).send(e.toString());
    });
  }
  else {
    res.sendStatus(404);
  }
});

module.exports = router;