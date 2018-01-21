const chai = require('chai');
const expect = require('chai').expect;
const app = require('../app');
const _ = require('lodash');
chai.use(require('chai-http'));

describe('API endpoint /trailers', function () {
  this.timeout(5000); // How long to wait for a response (ms)
  before(() => {});
  after(() => {});

  it('should return trailer url', () =>
    chai
      .request(app)
      .get('/api/v1/trailers?url=https://content.viaplay.se/pc-se/film/arrival-2016')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(!_.isEmpty(res.body.url));
      }));

  it('should return trailer url from cache', () =>
    chai
      .request(app)
      .get('/api/v1/trailers?url=https://content.viaplay.se/pc-se/film/arrival-2016')
      .then((res) => {
        expect(res).to.have.status(200);
      }));

  it('should return Not Found', () =>
    chai
      .request(app)
      .get('/InvalidPath')
      .then((res) => {
        throw new Error('Path exists!');
      })
      .catch((err) => {
        expect(err).to.have.status(404);
      }));

  it('should return Error for Empty URL', () =>
    chai
      .request(app)
      .get('/api/v1/trailers?url=')
      .then((res) => {
        throw new Error('Bad Request!!');
      })
      .catch((err) => {
        expect(err).to.have.status(400);
      }));

  it('should return Error for Bad Request', () =>
    chai
      .request(app)
      .get('/api/v1/trailers?url=cvy')
      .then((res) => {
        throw new Error('Bad Request!!');
      })
      .catch((err) => {
        expect(err).to.have.status(400);
      }));

  it('should return 404 for content not found', () =>
    chai
      .request(app)
      .get('/api/v1/trailers?url=https://content.viaplay.se/pc-se/film/arrival-2016AB')
      .then((res) => {
        throw new Error('Bad Request!!');
      })
      .catch((err) => {
        expect(err).to.have.status(404);
      }));

  it('should return api docs', () =>
    chai
      .request(app)
      .get('/api/docs')
      .then((res) => {
        expect(res).to.have.status(200);
      }));
});
