var express = require('express');
var fs = require('fs');
var config = require('./config.json');

const port = config.serverport;

var router = express();

var check_name = function(x) {
	var ok = true;
	for(var i = 0; i < x.length; x++) {
		var c = x.charAt(i);
		if((c > '9' || c < '0') && (c > 'Z' || c <'A') && (c > 'z' || c < 'a') && c != '.' && c != '_' && c !='-') {
			ok = false;
			break;
		}
	}
	return ok;
};


router.get("/", function(req, res) {
	var data = fs.readFileSync('../resources/main.html');
	res.writeHead(200,{'Content-Type':'text/html'});
	res.write (data);
	res.end();
});

router.get("/map/:id", function(req, res) {
	var id = req.params.id;
	if(!check_name(id)) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.write("403 : Not Authorized");
		res.end();
		return ;
	}
	var data = fs.readFileSync('../resources/maps/mp' + id + '.map');
	res.writeHead(200,{'Content-Type':'application/json'});
	res.write (data);
	res.end();
});

router.get("/js/:file", function(req, res) {
	var id = req.params.file;
	if(!check_name(id)) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.write("403 : Not Authorized");
		res.end();
		return ;
	}
	var data = fs.readFileSync('../resources/js/' + id + '');
	res.writeHead(200,{'Content-Type':'text/javascript'});
	res.write (data);
	res.end();
});

router.get("/css/:file", function(req, res) {
	var id = req.params.file;
	if(!check_name(id)) {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.write("403 : Not Authorized");
		res.end();
		return ;
	}
	var data = fs.readFileSync('../resources/css/' + id + '');
	res.writeHead(200,{'Content-Type':'text/css'});
	res.write (data);
	res.end();
});

router.listen(port);
