require("http").globalAgent.maxSockets = Infinity;

var d = require('domain').create()
var restify = require('restify')

var rest = restify.createServer()
var io = require('socket.io').listen(rest)

io.set('log level', 1);

rest.use(restify.bodyParser({ mapParams: true }));
rest.use(restify.queryParser())

d.on('error', function(err) {
        console.log(err);
})

var endPoint = "/state_changes"

d.run(function() {
	var prod_client = io
			.of(endPoint)
			.on('connection', function(socket) {
					console.log('client connect')
			})

	rest.post('/state_change_broadcast', function(req, res, next) {

			res.header("Access-Control-Allow-Origin", "*")
			res.header("Access-Control-Allow-Headers", "x-requested-with")
			message = req.params.message

			console.log("broadcast: " + message)
			client_to_send = prod_client

			client_to_send.emit('new_states',  message)

			res.send({"error": false })
			next()
	})

	rest.listen(8081, function() {
			console.log('socket listening')
	})
})
