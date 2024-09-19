import express from 'express';
import { createServer } from 'http';

const folder = "/savact.app";
const file = "index.html";
const port = 8000;

const __dirname = './';
const __filename = __dirname + file;

let httpServer;

async function startServer() {
  const app = express();
  httpServer = createServer(app);
  app.use(express.static(__dirname));

  app.get("/", (req, res) => {
    res.sendFile(__filename);
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Something went wrong!');
    closeServer();
  });

  return new Promise((resolve, reject) => {
    httpServer.listen(port, () => {
      const url = `http://localhost:${port}${folder}#_browser_`;
      console.info("Server runs on", url);
      resolve();
    });

    httpServer.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
      closeServer();
    });
  });
}

function closeServer() {
  if (httpServer) {
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  closeServer();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  closeServer();
});

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  closeServer();
});


export default (on, config) => {
  // on('before:run', startServer);
  // on('before:browser:launch', startServer);


  return config;
};