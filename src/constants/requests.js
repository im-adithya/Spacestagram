import axios from 'axios';
// eslint-disable-next-line no-undef
const REACT_APP_NASA_KEY = process.env.REACT_APP_NASA_KEY;

export const createAPODRequests = (date) => {
  return axios.get(
    `https://api.nasa.gov/planetary/apod?api_key=${REACT_APP_NASA_KEY}&date=${date}`
  );
};

export const createEPICRequests = (date) => {
  return axios.get(
    `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${REACT_APP_NASA_KEY}`
  );
};

export const createNASARequests = (fiveDCode, code) => {
  return axios.get(
    `https://images-assets.nasa.gov/image/${code ? 'PIA' + fiveDCode : fiveDCode}/metadata.json`
  );
};

export const createMaRoPhoRequests = (date) => {
  return axios.get(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${REACT_APP_NASA_KEY}`
  );
};

export const createStarLikeRequests = (identifier) => {
  const account = identifier.split('/')[0];
  const id = identifier.split('/')[1];
  if (parseInt(account) === 0)
    return axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${REACT_APP_NASA_KEY}&date=${id}`
    );
  if (parseInt(account) === 1)
    return axios.get(
      `https://api.nasa.gov/EPIC/api/natural/date/${id}?api_key=${REACT_APP_NASA_KEY}`
    );
  if (parseInt(account) === 3)
    return axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${id}&api_key=${REACT_APP_NASA_KEY}`
    );
};

export const APODRequests = (dates) => {
  return dates.map((date) => createAPODRequests(date));
};
export const APODTodayRequest = `https://api.nasa.gov/planetary/apod?api_key=${REACT_APP_NASA_KEY}`;
export const EPICRequests = (dates) => {
  return dates.map((date) => createEPICRequests(date));
};
export const NASARequests = (fiveDCodes) => {
  return fiveDCodes.map((code) => createNASARequests(code, true));
};
export const MaRoPhoRequests = (dates) => {
  return dates.map((date) => createMaRoPhoRequests(date));
};
export const EarthRequest = `https://images-api.nasa.gov/search?q=earth&media_type=image`;

export const starLikeRequests = (starLike) => {
  const arr = starLike.slice(1);
  return arr.map((p) => createStarLikeRequests(p));
};

const imageGenerator = (identifier, index, starLikeResps) => {
  const account = identifier.split('/')[0];
  const id = identifier.split('/')[1];
  switch (parseInt(account)) {
    case 0:
      return starLikeResps[index].url;
    case 1:
      return `https://api.nasa.gov/EPIC/archive/natural/${id.replaceAll('-', '/')}/png/${
        starLikeResps[index][0].image
      }.png?api_key=${REACT_APP_NASA_KEY}`;
    case 2:
      return `https://images-assets.nasa.gov/image/${id}/${id}~orig.jpg`;
    case 3:
      return starLikeResps[index].photos[0].img_src;
    case 4:
      return `https://images-assets.nasa.gov/image/${id}/${id}~orig.jpg`;
    default:
      return '';
  }
};

export const starLikeRespHandler = (resps, starLike) => {
  const arr = starLike.slice(1);
  let starLikeResps = resps.map((resp) => (resp ? resp.data : [])).filter((n) => n);
  return arr.map((identifier, index) => {
    var o = {};
    o.id = identifier;
    o.photoURL = imageGenerator(identifier, index, starLikeResps);
    return o;
  });
};

export const APODRespHandler = (resps) => {
  let apodResps = resps.map((resp) => resp.data).filter((n) => n);
  return apodResps.map((el) => {
    var o = {};
    o.account = 0;
    o.date = el.date;
    o.description = el.explanation;
    o.id = el.date;
    o.photoURL = el.url;
    return o;
  });
};

export const APODSingleRespHandler = (resp) => {
  const el = resp;
  var o = {};
  o.account = 0;
  o.date = el.date;
  o.description = el.explanation;
  o.id = el.date;
  o.photoURL = el.url;
  return o;
};

export const APODTodayRespHandler = (resp) => {
  var o = {};
  o.date = resp.data.date;
  o.description = resp.data.explanation;
  o.photoURL = resp.data.url;
  return o;
};

export const EPICRespHandler = (resps) => {
  let epicResps = resps.map((resp) => resp.data[0]).filter((n) => n);
  return epicResps.map((el) => {
    var o = {};
    o.account = 1;
    o.date = el.date.split(' ')[0];
    o.description = el.caption;
    o.id = el.date.split(' ')[0];
    o.photoURL = `https://api.nasa.gov/EPIC/archive/natural/${o.date.replaceAll('-', '/')}/png/${
      el.image
    }.png?api_key=${REACT_APP_NASA_KEY}`;
    return o;
  });
};

export const EPICSingleRespHandler = (resp) => {
  const el = resp[0];
  var o = {};
  o.account = 1;
  o.date = el.date.split(' ')[0];
  o.description = el.caption;
  o.id = el.image;
  o.photoURL = `https://api.nasa.gov/EPIC/archive/natural/${o.date.replaceAll('-', '/')}/png/${
    el.image
  }.png?api_key=${REACT_APP_NASA_KEY}`;
  return o;
};

export const NASARespHandler = (resps, fiveDCodes, feed, actualNS) => {
  let nasaResps = resps.map((resp) => resp.data).filter((n) => n);
  if (feed) localStorage.setItem('nasa', actualNS);
  return nasaResps.map((el, index) => {
    var o = {};
    o.account = 2;
    o.date = el['File:FileAccessDate'].split(' ')[0].replaceAll(':', '-');
    o.description = el['AVAIL:Description508'];
    o.id = `PIA${fiveDCodes[index]}`;
    o.photoURL = `https://images-assets.nasa.gov/image/PIA${fiveDCodes[index]}/PIA${fiveDCodes[index]}~orig.jpg`;
    return o;
  });
};

export const NASASingleRespHandler = (resp, nasa_id, earth) => {
  const el = resp;
  var o = {};
  o.account = earth ? 4 : 2;
  o.date = el['File:FileAccessDate'].split(' ')[0].replaceAll(':', '-');
  o.description = el['AVAIL:Description508'];
  o.id = nasa_id;
  o.photoURL = `https://images-assets.nasa.gov/image/${nasa_id}/${nasa_id}~orig.jpg`;
  return o;
};

export const MaRoPhoRespHandler = (resps) => {
  let marophoResps = resps.map((resp) => resp.data.photos[0]).filter((n) => n);
  return marophoResps.map((el) => {
    var o = {};
    o.account = 3;
    o.date = el.earth_date;
    o.description = `${el.rover.name} Rover - ${el.camera.full_name}`;
    o.id = el.earth_date;
    o.photoURL = el.img_src;
    return o;
  });
};

export const MaRoPhoSingleRespHandler = (resp) => {
  const el = resp.photos[0];
  var o = {};
  o.account = 3;
  o.date = el.earth_date;
  o.description = `${el.rover.name} Rover - ${el.camera.full_name}`;
  o.id = el.earth_date;
  o.photoURL = el.img_src;
  return o;
};

export const earthRespHandler = (resp, actualES, feed, end = 5) => {
  let earthResps = resp.data.collection.items.slice(actualES, end);
  if (feed) localStorage.setItem('earth', actualES + 5);
  return earthResps.map((el) => {
    var o = {};
    o.account = 4;
    o.date = el.data[0].date_created.split('T')[0];
    o.description = el.data[0].description_508
      ? el.data[0].description_508
      : el.data[0].description;
    o.id = el.data[0].nasa_id;
    o.photoURL = el.links[0].href;
    return o;
  });
};
