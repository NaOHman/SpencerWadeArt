SpencerWadeArt
==============

A website for artist Spencer Wade, who is partially colorblind.

*Note:* If running this front end code, please run a simple http server in python in order to have the project be responsive. 

Use `cd` to get into the SpencerWadeArt directory.
Then run `python -m SimpleHTTPServer`
Then in the browser of your choice run `http://localhost:8000/`.

Setting up the local SMTP server for sending emails
---------------------------------------------------

This project comes with FakeSMTP - a software that would allow for `localhost` to be the SMTP server, instead of Gmail or some other service for which we need to register the website. For development purposes this is enough.
Fake SMTP is writen in Java, and it is a `.jar` file located in the `utilities` folder. To run it, try to just double click it (works on Windows). Otherwise, use the following command:

`java -jar fakeSMTP.jar`

For more info please visit https://nilhcem.github.io/FakeSMTP/index.html.

