const server = require('./api/server');

const port = process.env.PORT || 8000;
server.listen(port, () =>{
    console.log(`\n**We Go from 0 to ${port}, Real Quick**\n`)
})