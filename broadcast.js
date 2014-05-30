
var restify = require('restify')
var server = restify.createServer(
{
	
});

var io = require('socket.io')(server);

server.use(restify.bodyParser({ mapParams: true }));
server.use(restify.queryParser())
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

var client_to_send = io.of("/state_changes").on('connection', function(socket) 
{ 
	console.log('client connect') 
})

server.post('/state_change_broadcast', function(req, res, next) 
{
		res.header("Access-Control-Allow-Origin", "*")
		res.header("Access-Control-Allow-Headers", "x-requested-with")
		message = req.params.message

		console.log("broadcast: " + message);
		client_to_send.emit('new_states',  message);

		res.send({"error": false })
		next()
})

server.listen("8081");