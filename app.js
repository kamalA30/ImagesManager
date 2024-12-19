const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app); 
const routes = require('./routes/index'); 

app.use(express.json());

routes(app);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
