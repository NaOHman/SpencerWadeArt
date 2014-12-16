SpencerWadeArt
==============

A website for artist Spencer Wade, who is partially colorblind.

To run this website locally clone the repository and change into the root directory
then  run `node app.js` if you get an EACCES error, your user account doesn't have
access to port 80, to work around this run `sudo node app.js`

Our database is hosted on MonogLabs

Setting up the local SMTP server for sending emails
---------------------------------------------------

This project comes with FakeSMTP - a software that would allow for `localhost` to be the SMTP server, instead of Gmail or some other service for which we need to register the website. For development purposes this is enough.
Fake SMTP is writen in Java, and it is a `.jar` file located in the `utilities` folder. To run it, try to just double click it (works on Windows). Otherwise, use the following command:

`java -jar fakeSMTP.jar`

For more info please visit https://nilhcem.github.io/FakeSMTP/index.html.

Payment
---------------------------------------------------
This project uses Stripe for payment. In order to prevent this test website from actually charging anyone's credit card, we have only used the test enviornment codes for stripe. If you would like to "make a purchace" on the website, please use one of the credit card examples listed https://stripe.com/docs/testing#cards any valid email address (like your own, you won't have your email recorded), any valid expiration date (ex 08/28), and any CCV of numbers (ex 888).

