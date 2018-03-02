var cfg = require('../../bin/config.json');
var pg  = require('pg');

let configuration = {
  host: cfg.dbIp ,
  port: cfg.dbPort,
  user: cfg.dbUser,
  database: cfg.dbName,
  max: cfg.dbMaxConnectionCount,
  password: cfg.dbPasswd
}

var pool = new pg.Pool(configuration); 

pool.connect(function(err, client, done) {
    if (err) {
        return console.error('error fetching client from pool', err);
    } 
    else {
        console.log("connection successful")
    } 
});

pool.on('error', function(err, client) {
    console.error('idle client error', err.message, err.stack)
}) 
module.exports = pool;





// select 시 사용한다.
function selectQuery (strQery) { 
    if(pool)
        pool = new pg.Pool(configuration);  

    var returnData ;

    pool.query(strQery)
        .then(res => {
            const rows = res.rows;
            rows.map(row => {    // row into map
                console.log(`Read: ${JSON.stringify(row)}`);
            });
           
            
            // return JSON.stringify(rows);
            return
            pool.end(console.log('Closed pool connection'));      
        })
        .catch(err => {
            console.log(err);
            process.exit();  
        }); 
    
}

//insert, update, delete시 사용한다.
function updateQuery (strQery) {
    if(pool = null)
        pool = new pg.Pool(configuration); 
    
    pool.query(strQery)
        .then(result => {
            console.log('Update completed');
            console.log(`Rows affected: ${result.rowCount}`);

            pool.end(console.log('Closed pool connection'));
        })
        .catch(err => {
            console.log(err);            
            process.exit();  
        });

    return result.rowCount;
}

selectQuery("SELECT * FROM public.members;");
// console.log ("############# "+data);
// console.log (">>>>>>>>>>>>> "+JSON.stringify(data));
