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

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredImage", async( req: Request, res: Response ) => {
    let {image_url} = req.query.image_url;
    // check for image URL, send error message and 400 code if not
    if (!image_url) {
      return res.status(400).send('No image URL included. Image URL must be included.');
    }
    // continue if image URL is existent
    else {
      // get filtered image using provided function
      const filteredpath = await filterImageFromURL(image_url);
      // if no filtered image, send 404 not found with error message
      if (!filteredpath) {
        return res.status(404).send('Filtered image was not found.');
      }
      // if image url and image are found, send back the image and a success code 200
      else {
        res.status(200).sendFile(filteredpath);
        res.on("finish", () => deleteLocalFiles([image_url]));
      }
    }
  } )

  //! END @TODO1
  
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
