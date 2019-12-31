import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req,res) => {
    let { image_url } = req.query;
    let http = /http/gi;
    let https = /https/gi;
    if (!image_url){
      return res.status(422).send({message: 'The image_url parameter is required.'});
    }

    if (!image_url){
      return res.status(422).send({message: 'The image_url parameter is required.'});
    }
    if (image_url.search(http) == -1 && image_url.search(https) == -1) { 
      return res.status(422).send({message: 'The image_url is incorrect.'});
    }

    let filteredpath = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredpath), () => {deleteLocalFiles([filteredpath]);}
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();