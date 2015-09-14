var express = require('express');
var pg = require('pg');
var app = express();

var lastSeenInterval = 30;
var conString = process.env.DATABASE_URL;
var findQueryString = 'select * from userinfo where lastseen > (current_timestamp - interval \''+ lastSeenInterval+'\' minute)';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

//web function
app.get('/check', function(request, response) {
      pg.connect(conString, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query('select * from userinfo where lastseen > (current_timestamp - interval \''+lastSeenInterval+'\' minute)',function(err, result) {
        done();        //call `done()` to release the client back to the pool

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result.rows);
        return response.json(result.rows);
      });
    });
    // response.render('pages/index');
});

//web function
app.post('/register', function(request, response) {
      pg.connect(conString, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        // client.query('SELECT $1::int AS number', ['1'], function(err, result) {
        // insert into userinfo(name,devicetype,mac,lastseen) values('lol','iphone','MMM',transaction_timestamp());

        client.query('insert into userInfo(name,devicetype,mac,lastseen) values($1,$2,$3,transaction_timestamp())',['max','iphone','SSccaass'],function(err, result) {
        done();        //call `done()` to release the client back to the pool

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result.rows);
        return response.json(result);
      });
    });
    // response.render('pages/index');
});


//client function
app.post('/update', function(request, response) {
      var jsonString ='';
      var userInfo = new Array();
      var property ='';

      request.on('data', function (data) {
           console.log(decodeURIComponent(jsonString));
           jsonString = data.toString().split('&');
           console.log(jsonString);

           for(i=0;i<jsonString.length;i++){
              property = jsonString[i].toString().split('=');

              if(property.length >1){
                key = decodeURIComponent(property[0]);
                value = decodeURIComponent(property[1])
                userInfo[key]=value;
              }
           }
           if(userInfo.mac){
              upsert(userInfo);
           }
           console.log(userInfo);
       });

    return response.json("status : success");
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function upsert(userInfo){
      pg.connect(conString, function(err, client, done) {
          if(err) {
            return console.error('error fetching client from pool', err);
          }
          client.query('update userinfo set lastseen = now() where mac = $1',[userInfo.mac],function(err, result) {
          userPresent = result.rowCount;

          if(err) {
            return console.error('error running query', err);
          }
          console.log("Update rowcount : "+ result.rowCount);

          if(userPresent == 0){
                console.log(userInfo);
                userName = "user_"+Math.floor(Math.random()*10000);
                client.query('insert into userInfo(name,alias,devicetype,mac,lastseen) values($1,$2,$3,$4,transaction_timestamp())',[userName,userName,'unkown device',userInfo.mac],function(err, insertResult) {

                if(err) {
                  return console.error('error running query', err);
                }
                console.log("Inserted rowcount : "+insertResult.rowCount);
              });
          }
          done();
        });
    });
}
