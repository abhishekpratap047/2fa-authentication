const Mailjet = require('node-mailjet');

module.exports = function(email, token, callback){

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC || 'f8567f3fa78b1d69ef5fed053afc6520',
  process.env.MJ_APIKEY_PRIVATE || '77d0437bc521fbc4a0d745e90dbdeeed',
);

const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            "Email": "silverkai125@gmail.com",
            "Name": "Supercoder Dev"
          },
          To: [
            {
                "Email": email,
                "Name": "Abhishek"
            }
          ],
          Subject: "Your email flight plan!",
          TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
          HTMLPart: ` verify your email please by clicking the link below
          <a href ="http://localhost:3000/verifyuser/${token}">VERIFY</a> `
        }
      ]
    })

request
 .then((result) => {
    callback(null, req.body)
 })
 .catch((err) => {
    callback(err.statusCode, null)
 })

}
