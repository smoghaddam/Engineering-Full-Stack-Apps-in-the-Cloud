import express from 'express';
import bodyParser from 'body-parser';
import { config } from './config/config';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Get the API KEY
  const cfg = config;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (reqest,response) => {
    let { image_url } = reqest.query;
    let http = /http/gi;
    let https = /https/gi;
    let theAPIKey = reqest.header("X-API-Key");

    if (!theAPIKey){
      return response.status(422).send({message: 'The API Key parameter is required.'});
    }

    if (theAPIKey != cfg.api.key){
      return response.status(401).send({message: 'The API Key is incorrect.'});
    }
  
    if (!image_url){
      return response.status(422).send({message: 'The image_url parameter is required.'});
    }

    if (image_url.search(http) == -1 && image_url.search(https) == -1) { 
      return response.status(422).send({message: 'The image_url is incorrect.'});
    }

    let filteredpath = await filterImageFromURL(image_url);
    response.status(200).sendFile(filteredpath), () => {deleteLocalFiles([filteredpath]);}
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( request, response ) => {
    response.send("try GET /filteredimage?image_url={{}}   |   The value of API KEY is \"Udacity\"    |    by Sepid M.")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();