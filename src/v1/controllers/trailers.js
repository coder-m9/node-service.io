const axios = require('axios');
const _ = require('lodash');
const config = require('config');
const util = require('../util/trailerUtil');

module.exports.fetchTrailerURL = function fetchTrailerURL(req, res) {

 const url = req.query.url;

  if (!url) {
    res.status(400);
    res.json({ message: 'URL is empty' });
    return res;
  }

  axios
    .get(url)
    .then((response) => {
      let imdbData = {};
      imdbData =
        response.data._embedded['viaplay:blocks'][0]._embedded['viaplay:product'].content.imdb;
      return imdbData;
    })
    .then((imdbData) => {
      const movieDbUrl = `${config.get('url').movieDBOrg}/${imdbData.id}/videos?api_key=${
        process.env.MOVIEDB_API_KEY
      }`;
      return axios.get(movieDbUrl);
    })
    .then((response) => {
      const finalResponse = _.flow(util.filterData, util.formatTrailerResponse)(
        response.data.results,
        req
      );

      res.status(200);
      res.json(finalResponse);
      return res;
    })
    .catch((error) => {
      console.log(error.stack);
      if (error.response && error.response.status === 404) {
        res.status(404);
        res.json({});
      } else {
        res.status(400);
        res.json({});
      }
      return res;
    });
};
