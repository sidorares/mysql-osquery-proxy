var mysql = require('mysql2');

function columnsFor(row) {
  res = [];
  for (var fieldName in row) {
    res.push({
        catalog: 'def',
        schema: '',
        table: '',
        orgTable: '',
        name: fieldName,
        orgName: '',
        characterSet: 63,
        columnType: 253,
        columnLength: 100,
        flags: 1,
        decimals: 31
    });
  }
  return res;
}

function toRow(columns, obj) {
  var result = [];
  columns.forEach(function(c) {
    result.push(obj[c.name]);
  });
  return result;
}

function osqueryClient() {
  var thrift = require('thrift');
  var ExtensionManager = require('./gen-nodejs/ExtensionManager.js');
  var conn = thrift.createConnection(0, '/var/osquery/osquery.em');
  var client = thrift.createClient(ExtensionManager, conn);
  return client;
}

var id = 0;
var server = mysql.createServer();
server.on('connection', function(conn) {
  conn.serverHandshake({
    protocolVersion: 10,
    serverVersion: 'osquery mysql interface',
    connectionId: id++,
    statusFlags: 2,
    characterSet: 8,
    capabilityFlags: 0xffffff
  });
  var client = osqueryClient();
  conn.on('query', function(sql) {
    client.query(sql, function(err, result) {
      //console.log(result);
      if (result.status.code !== 0)
        return conn.writeError({ code: 1064, message: result.status.message});

      // TODO: conn.getQueryColumns
      // all fields as text for now

      // TODO: handle empty responses
      var columns = columnsFor(result.response[0]);
      conn.writeColumns(columns);
      // TODO: convert properly to columns
      var rows = [].slice.call(result.response);
      rows.forEach(function(row) {
        var arrRow = toRow(columns, row);
        conn.writeTextRow(arrRow);
      });
      conn.writeEof();
    });
  });
  conn.on('error', function() {
    console.log('remote connection lost');
  });
});
server.listen(process.argv[2], function(err) {
  // TODO: add server.address() in mysql2
  var address = server._server.address();
  console.log('listening on %s:%s', address.address, address.port);
  console.log('start client as "mysql -h 127.0.0.1 -P %s"', address.port);
});
