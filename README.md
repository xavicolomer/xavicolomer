# xavicolomer #1.0.0

This is the code running my personal website  [xavicolomer.com](https://xaviercolomer.com)

This repository does not only contain the code for all Javascript components on the website but also the workflow I am using to develop and deploy the code.

The website does not use any kind of library for DOM manipulation or animation easings, but a simplified collection of utils I developed myself for this website. 

## Stack

### Frontend

* HTML5
* Javascript ECMASCRIPT 6
* Sass with breakpoint-sass

When deploying the code is minified, uplodaded to S3 and the Cloudfront instance is invalidated.

### Backend

* Express

server.js, Updated using Claudiajs and Amazon API Gateway

## Important folders

* **gulpfile.babel.js**: This folder contains the development workflow
* **settings**: This folder contains an example configuration file like the one I use to set up my AWS Credentials.
* **src**: This folder contains all the magic you can see on the page 
* **static**: This is the folder expressjs will use to serve static files, including js and css
* **tests**: Not yet :)

## Installation
- Clone this project
- npm install
- Run the script

## Scripts

Starting the development server
```
npm run start
```

Deploying static content to S3
```
npm run deploy
```

Deploying server to API Gateway (you need to install and configure [claudiajs](https://claudiajs.com/tutorials/serverless-express.html))
```
claudia update
```

### Version
1.0.0

### Contact Info
* [twitter](https://twitter.com/xaviercolomer)
* [linkedin](https://es.linkedin.com/in/xaviercolomer)
* [website](http://xavicolomer.com)
