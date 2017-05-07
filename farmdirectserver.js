//SERVER CODE

/*include http module and store it in variable http*/
var http = require("http");
//import url module and include it in variable url 
var url=require("url"); 
//import file system module. Gives functions related to file handling
var fs=require("fs"); 
//import node-mysql module
var mysql = require("mysql");
var server = http.createServer(incomeHandler); 
//Creating connection to MySQL server
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'nikhilkashyap',
   database : 'farmdirect'
 });
server.listen(8888,function(){  
	console.log("Server opened at 8888"); 
});


function incomeHandler(request,response){
	var incomeUrl=url.parse(request.url).pathname;
	console.log(incomeUrl);
	if(incomeUrl==='/'){ 
		//redirects to the index page of the website if the url is empty ie localhost:8888/
		incomeUrl="/main.html";
	}

	if(request.method==="GET"){
		console.log("GET REQUEST");
		getReq(request,response,incomeUrl);
	}

	if(request.method=="POST"){
		console.log("POST request");
		console.log(incomeUrl);
		postReq(request,response,incomeUrl);
	}
}

	
function getReq(request,response,incomeUrl){

	/*TO return contents of drop down*/

	if(incomeUrl=="/getDDVeg"){
		connection.query('SELECT vegetables from cropid_REF order by vegetables ASC', function(err, rows, fields) {
   			if (!err){
   				response.writeHead(200,{"Content-Type": "application/json"});
   				response.end(JSON.stringify(rows)); 
     		}

   			else{
    			console.log('Error while performing Query.');
    			response.end();
    		}
 		});

	} 

	else if(incomeUrl=="/getDDFru"){
		connection.query('SELECT fruits from cropid_REF order by fruits ASC', function(err, rows, fields) {
   			if (!err){
   				response.writeHead(200,{"Content-Type": "application/json"});
   				response.end(JSON.stringify(rows)); 
     		}

   			else{
    			console.log('Error while performing Query.');
    			response.end();
    		}
 		});
	}

	else{
		//process refers to server that is running ie node server, cwd stands for current working directory
		var filePath = process.cwd() + incomeUrl; 
		console.log(filePath);
		fs.exists(filePath,function(ExistFlag){ 
			if(ExistFlag){						
				fs.readFile(filePath,function(err,file){
						if(!err){ 
							response.end(file);
						}

						else
							console.log("Error in reading file"); 
				});
			}

			else{
				//this indicates to the browser that there is an error
				response.writeHead(404); 
				//this writes at the html document that there is an error
				response.write("Error 404,not found"); 
				response.end(); 
				console.log("File does not exist");
			}
		});
	}	
}


function postReq(request,response,incomeUrl){ //request will have both request and data

/*SIGN IN is handled here*/

	if(incomeUrl=="/signin.html"){	
		var data,parsedData,uid;
		//request.on is an inbuilt function used to fetch the data	
		//data sent to the server will be in the form of byte stream. so it cannot be read directly
		request.on("data",function(chunk){ 
			data=chunk.toString();
			console.log(data);
			parsedData=JSON.parse(data);
			uid=parsedData.data1;
			pwd=parsedData.data2;
			console.log("PASSWORD:"+pwd);
			if(uid.charAt(0)=="F"){
				connection.query('SELECT password,Fname from user_FARMER where userid=?',[uid], function(err, rows, fields) {
   					if (!err){
     					console.log(rows);
     					//empty set is returned if user does not exist
     					if(rows.length===0){  
     						response.end("FAILURE");
     					}

     					else if(pwd===rows[0].password){
     						response.end(rows[0].Fname);
     					}

     					else{
     						response.end("FAILURE");
     					} 
     				}

   					else{
    					console.log('Error while performing Query.');
    					response.end();
    				}
 				});
			}

			else if(uid.charAt(0)=="R"){
				connection.query('SELECT password,Fname from user_RETAILER where userid=?',[uid], function(err, rows, fields) {
   					if (!err){
     					console.log(rows);
     					if(rows.length===0){  
     						response.end("FAILURE");
     					}

     					else if(pwd===rows[0].password){
     						response.end(rows[0].Fname);
     					}

     					else{
     						console.log("Error while performing query");
     						response.end();
     					} 
     				}

   					else{
    					console.log('Error while performing Query.');
    					response.end();
    				}
 				});
			}

			else{
				response.end("FAILURE");
			}
		});
	}

/*SIGN UP is handled here*/

	else if(incomeUrl=="/signup.html"){
		var data,first,last,location,contact,pwd,type,Userid;
		request.on("data",function(chunk){ //data sent to the server will be in the form of byte stream. so it cannot be read directly
		data=chunk.toString();
		parsedData=JSON.parse(data);
   		first=parsedData.data1;
	    last=parsedData.data2;
	    location=parsedData.data3;
	    contact=parsedData.data4;
		pwd=parsedData.data5;
	    type=parsedData.data6;
	    if(type==="Farmer"){
			connection.query('insert into user_FARMER SET password=?,Fname=?,Lname=?,location=?,contact=?',[pwd,first,last,location,contact], function(err, res) {
	   			if (!err){
	     	    	connection.query('select userid from user_FARMER where contact=?',contact,function(err,rows){
	              if(!err){
	              		Userid=rows[0].userid;
	              		connection.query('insert into USER_FARMER_DATA set userid=?',Userid,function(err,row){
	              			if(!err)
	                			response.end(Userid);
	                		
	                		else
	                			response.end();
	                	});
	              }

	              else{
	                console.log("ERROR");
	                response.end();
	              }
	            });
     		}

   			else{
    			console.log('Error while performing Query.');
    	    	response.end();
    	   }
 		}); 
    }
    else if(type==="Retailer"){
    connection.query('insert into user_RETAILER SET password=?,Fname=?,Lname=?,location=?,contact=?',[pwd,first,last,location,contact], function(err, res) {
        if (!err){
            connection.query("select userid from user_RETAILER where contact=?",contact,function(err,res){
              if(!err){
                response.end(res[0].userid);
              }

              else{
                console.log("ERROR");
                response.end();
              }
            });
        }

        else{
          console.log('Error while performing Query.');
           response.end();
         }
      }); 
    }
	}); 
	}

/*Farmer data is fetched from here*/

	else if(incomeUrl=="/farmer_page.html"){
		var data,resJ,crp1,crp2,crp3,crp4,i=0;
		request.on("data",function(chunk){ //data sent to the server will be in the form of byte stream. so it cannot be read directly
		data=chunk.toString();
		console.log(data);
		parsedData=JSON.parse(data);
		uid=parsedData.data1;
		connection.query('select * from USER_FARMER_DATA where userid=?',uid, function(err, res) {
   			if (!err){
   				console.log(res);
   				if(res.length==0)
   					response.end();

   				else{
   					crp1=res[0].crop1;
         			crp2=res[0].crop2;
         			crp3=res[0].crop3;
          			crp4=res[0].crop4;
   					resJ={"data1":crp1,"data2":crp2,"data3":crp3,"data4":crp4};
   					console.log(resJ);
   					response.writeHead(200,{"Content-Type": "application/json"});
   					response.end(JSON.stringify(resJ)); 
   				}
     		}

   			else{
    			console.log('Error while performing Query.');
    	    	response.end();
    	   }
 		});
	 });
	}

/* Editing Farmer Data */
	else if(incomeUrl=="/editfarmer.html"){
		var data,cropno,cropname,qty,price,res,userid;
		request.on("data",function(chunk){ //data sent to the server will be in the form of byte stream. so it cannot be read directly
		data=chunk.toString();
		parsedData=JSON.parse(data);
		cropno=parsedData.data1;
		cropname=parsedData.data2;
		qty=parsedData.data4;
		price=parsedData.data3;
		userid=parsedData.data5;
		res=cropname+"-"+qty+"-"+price;
		if(cropno==1){
			connection.query('update USER_FARMER_DATA set crop=? where userid=?',[res,userid], function(err, res) {
   			if (!err){
   				response.end();
     		}
     		
   			else{
    			console.log('Error while performing Query.');
    	    	response.end();
    	   }
 		});
		}

		else if(cropno==2){
			connection.query('update USER_FARMER_DATA set crop2=? where userid=?',[res,userid], function(err, res) {
   			if (!err){
   				response.end();
     		}

   			else{
    			console.log('Error while performing Query.');
    	    	response.end();
    	   }
 		});
		}

		else if(cropno==3){
			connection.query('update USER_FARMER_DATA set crop3=? where userid=?',[res,userid], function(err, res) {
   			if (!err){
   				response.end();
     		}

   			else{
    			console.log('Error while performing Query.');
    	    	response.end();
    	   }
 		});
		}

		else{
			connection.query('update USER_FARMER_DATA set crop4=? where userid=?',[res,userid], function(err, res) {
   			if (!err){
   				response.end();
     		}

   			else{
    			console.log('Error while performing Query.');
    	    	response.end();
    	   }
 		});
		} 
	});
	}

	/*DELETE FARMER DATA*/

	else if(incomeUrl=="/deletefarmer.html"){
		var data,cropno,userid,res;
		request.on("data",function(chunk){ //data sent to the server will be in the form of byte stream. so it cannot be read directly
			data=chunk.toString();
			parsedData=JSON.parse(data);
			cropno=parsedData.data1;
			userid=parsedData.data2;
			res=null;
			if(cropno==1){
			connection.query('update USER_FARMER_DATA set crop=? where userid=?',[res,userid], function(err, res) {
   			if (!err){
   				response.end();
     		}

   			else{
    			console.log('Error while performing Query.');
    	    	response.end();
    	   }
 		});
		}

		else if(cropno==2){
			connection.query('update USER_FARMER_DATA set crop2=? where userid=?',[res,userid], function(err, res) {
   			if (!err){
   				response.end();
     		}

   			else{
    			console.log('Error while performing Query.');
    	    	response.end();
    	   }
 		});
		}

		else if(cropno==3){
			connection.query('update USER_FARMER_DATA set crop3=? where userid=?',[res,userid], function(err, res) {
   				if (!err){
   					response.end();
     			}

   				else{
    				console.log('Error while performing Query.');
    	    		response.end();
    	   		}
 			});
		}

		else{
			connection.query('update USER_FARMER_DATA set crop4=? where userid=?',[res,userid], function(err, res) {
   				if (!err){
   					response.end();
     			}

   				else{
    				console.log('Error while performing Query.');
    	    		response.end();
    	   		}
 			});
		} 
		});
	}

	else if(incomeUrl=="/retailer_page.html"){
		var  data, resJ,Fname,Lname,location,contact,Fname2,Lname2,location2,contact2,croptype,crp,crop_name,crop_price,crop_qty,crop2_name,crop2_price,crop2_qty;
		request.on("data",function(chunk){
			data=chunk.toString();
			console.log(data);
			parsedData=JSON.parse(data);
			croptype=parsedData.data1;
			crp=parsedData.data2;
			console.log("HERE1");
			if(croptype==="Vegetables"){
			connection.query('SELECT Fname,Lname,location,contact,VCROP1_NAME,VCROP1_PRICE,VCROP1_QUANTITY FROM RETAIL_VIEW_2 WHERE VCROP1_NAME=? UNION SELECT Fname,Lname,location,contact,VCROP2_NAME,VCROP2_PRICE,VCROP2_QUANTITY FROM RETAIL_VIEW_2 WHERE VCROP2_NAME=?',[crp,crp],function(err,res,fields){
				if(!err){
					response.writeHead(200,{"Content-Type": "application/json"});
   					response.end(JSON.stringify(res));
					}

				else{
					console.log("Error");
					response.end();
					}
				});
			}

			else{ 
				connection.query('SELECT Fname,Lname,location,contact,FCROP1_NAME,FCROP1_PRICE,FCROP1_QUANTITY FROM RETAIL_VIEW_1 WHERE FCROP1_NAME=? UNION SELECT Fname,Lname,location,contact,FCROP2_NAME,FCROP2_PRICE,FCROP2_QUANTITY FROM RETAIL_VIEW_1 WHERE FCROP2_NAME=?',[crp,crp],function(err,res,fields){
					if(!err){
						console.log(res);
						response.writeHead(200,{"Content-Type": "application/json"});
   				    	response.end(JSON.stringify(res)); 
					}
					else{
						console.log("error");
						response.end();
					}
				});
			}  
		});
	}
} 
