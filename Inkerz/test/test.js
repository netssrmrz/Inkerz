var expect = require('chai').expect;
var request = require('request');
var crypto = require('crypto');
var server = require('../app');
var sp_request = require('supertest');

describe('Marvel API', function ()
{
  it('should authenticate for Server-Side applications', MarvelAPI_Auth);
});

describe('Express Proxy', function ()
{
  after(function (done)
  {
    server.close(done);
  })

  it('should make Express Get call', Express_Get);
});

function MarvelAPI_Auth(done)
{
  const
    name = "Iron%20Man",
    apiKey = "a4ce240a80425a2ba715c8baf78048b6",
    ts = "1",
    publicKey = "a4ce240a80425a2ba715c8baf78048b6",
    privateKey = "4711f770abe38a3f232b6010017c06a1bc07aabd",
    data = ts + privateKey + publicKey,
    hash = crypto.createHash('md5').update(data).digest("hex"),
    url = "https://gateway.marvel.com:443/v1/public/characters?name=" + name + "&apikey=" + apiKey + "&hash=" + hash + "&ts=" + ts;

  this.timeout = 10000;
  request(url, { json: true }, Have_Res)
  function Have_Res(err, res, body)
  {
    expect(body.code).to.be.equal(200);
    expect(body.status).to.be.equal("Ok");
    done();
  }
}

function Express_Get(done)
{
  this.timeout = 10000;
  sp_request(server)
    .get("/v1/public")
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, function (err, res)
    {
      if (err) { return done(err); }
      callStatus = res.body.goodCall;
      expect(callStatus).to.equal(true);
      // Done
      done();
    });
}