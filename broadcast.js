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

var dev_client = io
        .of('/dev' + endPoint)
        .on('connection', function(socket) {
                console.log('dev client connect')
        })

rest.post('/state_change_broadcast', function(req, res, next) {
        env = req.query.environment

        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "x-requested-with")
        message = req.params.message

        if (env == "DEV")
        {
                console.log("dev broadcast: " + message)
                client_to_send = dev_client
        }
        else if (env == "PROD")
        {
                console.log("prod broadcast: " + message)
                client_to_send = prod_client
        }
        client_to_send.emit('new_states',  message)

        res.send({"error": false })
        next()
})

rest.listen(8080, function() {
        console.log('socket listening')
})

})
