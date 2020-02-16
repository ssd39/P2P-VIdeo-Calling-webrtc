

var express = require('express');
var app = express();
var express_ws = require('express-ws')(app);
var cookieParser = require('cookie-parser');
var session = require('express-session')
app.use(cookieParser());
app.use(session({
    secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
    resave: false,
    saveUninitialized: true
}));

var user = [];
var sessions = [];

app.use(function (req, res, next) {
    console.log('middleware');
    req.testing = 'testing';
    return next();
});
app.use('/', express.static('public'))


app.ws('/', function (ws, req) {
    ws.on('close', function () {
        console.log(req.sessionID, "closed")
        let i = 0;
        user.forEach(function (session) {
            if (session == req.sessionID) {
                user.splice(i, 1);
                sessions.splice(i, 1);
            }
            i = i + 1;
        });
    });

    ws.on('message', function (msg) {
        console.log(msg);

        if (msg == "init") {
            console.log(req.sessionID);
            user.push(req.sessionID);
            sessions.push(ws);
        }
        try {
            const jmsg = JSON.parse(msg)
            if (jmsg.type == "setoffer") {
                let i = 0;
                user.forEach(function (session) {
                    if (session != req.sessionID) {
                        sessions[i].send(msg);
                    }
                    i = i + 1;
                });
            }
            if (jmsg.type == "setanswer") {
                let i = 0;
                user.forEach(function (session) {
                    if (session != req.sessionID) {
                        sessions[i].send(msg);
                    }
                    i = i + 1;
                });
            }
            if (jmsg.type == "ice") {
                let i = 0;
                user.forEach(function (session) {
                    if (session != req.sessionID) {
                        sessions[i].send(msg);
                    }
                    i = i + 1;
                });
            }
        } catch (err) {
            console.error(err)
        }


    });

    console.log('socket', req.testing);

});

app.listen(process.env.PORT || 3000);