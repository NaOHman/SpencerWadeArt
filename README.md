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

