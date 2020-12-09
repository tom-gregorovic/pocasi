const express = require("express");
const fetch = require('node-fetch');
const Jimp = require('jimp');

const router = express.Router();

const chmi = (name) => { return {
  preview: `http://portal.chmi.cz/files/portal/docs/meteo/kam/${name}_small.jpg`,
  img: `http://portal.chmi.cz/files/portal/docs/meteo/kam/${name}.jpg`,
  page: `https://www.chmi.cz/files/portal/docs/meteo/kam/prohlizec.html?cam=${name}` }; };

const cams = [
  { id: 1, name: "Maruška", dir: "V", coords: [49.3656953, 17.8278367, 664], ...chmi("maruska")},
  { id: 2, name: "Lysá Hora", dir: "JZ", coords: [49.5461503, 18.4476114, 1322], ...chmi("lysa_hora3")},
  { id: 3, name: "Lysá Hora", dir: "JV", coords: [49.5461503, 18.4476114, 1322], ...chmi("lysa_hora2")},
  { id: 4, name: "Šerák", dir: "SV", coords: [50.1876511, 17.1084386, 1328], ...chmi("serak")},
  { id: 5, name: "Rýmařov", dir: "SZ", coords: [49.9320617, 17.2732753, 578], ...chmi("rymarov")},

  { id: 100, name: "Tišnov - náměstí", dir: "SV", coords: [49.3487122, 16.4230078, 260], 
    img: `http://46.149.124.196/webcam/radnice.jpg`,
    page: `https://www.tisnov.cz/mesto/mesto/web-kamera`
  },
  { id: 104, name: "Olešnice", dir: "V", coords: [49.5565986, 16.4046589, 650], 
    img: `https://www.olesnice.cz/sites/all/modules/olesnice_webcam/olesnice_webcam_img.php?location=zavrsi`,
    page: `https://www.ski-areal.cz/cz/webkamery`
  },
  { id: 105, name: "Oslavany", dir: "Z", coords: [49.1262922, 16.3414272, 280], 
    img: `https://www.oslavany.net/images/cam/vodarna000M.jpg`,
    page: `https://www.oslavany.net/aktualne/`
  },
  { id: 106, name: "Nedvědice", dir: "Z", coords: [49.4563561, 16.3375856, 325], 
    img: `https://cam01.pernstejn.net/axis-cgi/jpg/image.cgi?resolution=200x150`,
    page: `https://www.nedvedice.cz/modules.php?name=WebCam`
  },
  { id: 107, name: "Kořenec", dir: "Z", coords: [49.5294150, 16.7649250, 660], 
    img: `https://www.korenec-golf.cz/kamera/kamera_PE.jpg`,
    page: `https://www.lyzarsketrasy.cz/cz/m/kamery/`
  },
  { id: 108, name: "Tři Studně", dir: "V", coords: [49.6141394, 16.0345572, 730], 
    img: `https://tristudne.cz/Webcam/Last`,
    page: `https://tristudne.cz/cz/webkamera`
  },
  { id: 109, name: "Nové Město na Moravě", dir: "SZ", coords: [49.5606614, 16.0727178, 590], 
    img: `https://ic.nmnm.cz/data/pocasi/zasranec04.png`,
    page: `https://ic.nmnm.cz/data/pocasi/K1155270.php`
  },
  { id: 110, name: "Suchý vrch", dir: "SZ", coords: [50.0509347, 16.6933653, 995], 
    img: `https://kamery.ttnet.cz/images/sv2.jpg`,
    page: `https://kamery.ttnet.cz/index.php?kamera=sv2`
  },
  { id: 111, name: "Bystřice nad Pernštejnem", dir: "Z", coords: [49.5190961, 16.2502922, 540], 
    img: `https://www.bystricenp.cz/webcam/bnp/luz.jpg`,
    page: `https://www.bystricenp.cz/luzanky-kamera`
  },
  { id: 101, name: "Adamov", dir: "JV", coords: [49.3022919, 16.6562461, 320], 
    img: `https://adamov.realhost.cz/img/webcam/koupaliste.jpg`,
    page: `https://www.adamov.cz/rychle-odkazy/webkamery`
  },
  { id: 102, name: "Velká Javořina", dir: "JV", coords: [48.8574139, 17.6819269, 900], 
    page: 'http://myjava.dohlad.info/kamera/128/holubyho-chata-pred-chatou',
    getImg: (src) => "http://myjava.dohlad.info" + [...src.matchAll(/<img src="(.*)" id="detailImg" \/>/g)][0][1]
  },
  { id: 103, name: "Pálava - Nové Mlýny", dir: "Z", coords: [48.8727572, 16.7250322, 175], 
    page: 'https://www.webcamlive.cz/web-kamera-chko-palava-172-36',
    getImg: (src) => "https://www.webcamlive.cz/" + [...src.matchAll(/<img src="(.*)" alt="CHKO Pálava/g)][0][1]
    
    
    //<img src="outputCache/archiv_clear__172_2020_20201207161505_386.jpg_maxSize445_squarefalse_bgColorFFFFFF_width0_height0_tagtrue_fontSize10_barHeight18.jpg" alt="CHKO Pálava
    
  },
];

const camsData = [];


const updatePreview = (cam) => {  
  return ((cam.preview || cam.img) ? fetch(cam.preview || cam.img) 
    : fetch(cam.page).then(res => res.text()).then(src => {
      const url = cam.getImg(src);
      return fetch(url) }))
    .then(resp => resp.buffer())
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