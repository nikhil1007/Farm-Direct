/*Java Script File*/
//Set upper value of i in the drop down functions

/*Login is handled by this function*/
function login(){ 
	var res; //contains ID
	var data1 = document.getElementById("usr").value; 
	var data2 = document.getElementById("password").value;
	var dataJ = {"data1":data1,"data2":data2};  
	var cookievalue;
	var myRequest = new XMLHttpRequest();
	myRequest.open("POST","http://localhost:8888/signin.html",true);
	myRequest.onreadystatechange=function(){
		if(myRequest.readyState == 4 ){
			res = myRequest.responseText;
			if(res==="FAILURE"){
				alert("CHECK CREDENTIALS");
				window.location.href="signin.html";
				return false;
			}
			else{ 
               	 document.cookie="userID=" + data1; 
               	 document.cookie="name="+myRequest.responseText; 
				 if(data1.charAt(0)=="F"){
					window.location.href="farmer_page.html";
					return false;
				}
				else{ 
					window.location.href="retailer_page.html"; 
					return false;
				}
			}
		}
	}
	myRequest.send(JSON.stringify(dataJ));
}


/*Sign up is handled by this function*/
function signup(){  
	var data1 = document.getElementById("first").value; 
	var data2 = document.getElementById("last").value;
	var data3 = document.getElementById("location").value;
	var data4 = document.getElementById("contact").value;
	var data5 = document.getElementById("password").value;
	var data6 = document.getElementById("repassword").value;
	var data7 = document.getElementById("type").value;

	if(data5!=data6){
		alert("PASSWORD MIS-MATCH");
		window.location.href="signup.html";
	}
	else if(data1=="" || data2=="" || data3=="" || data4=="" || data5=="" || data6=="" || data7==""){
		alert("REQUIRED FIELDS EMPTY");
		window.location.href="signup.html";
	}
	else{
		var dataJ = {"data1":data1,"data2":data2,"data3":data3,"data4":data4,"data5":data5,"data6":data7}; 
		var myRequest = new XMLHttpRequest;
		myRequest.open("POST","http://localhost:8888/signup.html",true);
		myRequest.onreadystatechange=function(){
			if(myRequest.readyState == 4){
				alert("YOUR USER ID IS: "+myRequest.responseText);
				window.location.href="signin.html";
			}
		}
		myRequest.send(JSON.stringify(dataJ)); 
	}
}


//Farmer data is retrieved by this function
function getFarmerData(){
	var resJ,crp1,crp2,crp3,crp4,i,j,flag=0;
	var Cookie = document.cookie;
	//7 as the string we want begins at this index in the cookie
	var userid = Cookie.substring(7,12); 
	//19 as userid is 5 characters long, one space and one ; follow
	var username = Cookie.substring(19,Cookie.length);
	document.getElementById("username").value=username;
	var dataJ = {"data1":userid};
	var myRequest = new XMLHttpRequest();
	myRequest.open("POST","http://localhost:8888/farmer_page.html",true);
	myRequest.onreadystatechange=function(){
		if(myRequest.readyState == 4 ){
			resJ = JSON.parse(myRequest.responseText);
			crp1=resJ.data1;
			crp2=resJ.data2;
			crp3=resJ.data3;
			crp4=resJ.data4;
			if(crp1!=null){
				for(i=0;i<crp1.length;i++){
					if(crp1[i]=="-"&& flag==0){
						document.getElementById("0.0").value=crp1.substring(0,i);
						i=i+1;
						j=i;
						flag=1;
					}
					else if(crp1[i]=="-" && flag==1){
						document.getElementById("0.1").value=crp1.substring(j,i);
						i=i+1;
						document.getElementById("0.2").value=crp1.substring(i,crp1.length);
						break;
					}
				}
			}
			flag=0;
			if(crp2!=null){
				for(i=0;i<crp2.length;i++){ 
					if(crp2[i]=="-"&& flag==0){
						document.getElementById("1.0").value=crp2.substring(0,i);
						i=i+1;
						j=i;
						flag=1;
					}
					else if(crp2[i]=="-" && flag==1){
						document.getElementById("1.1").value=crp2.substring(j,i);
						i=i+1;
						document.getElementById("1.2").value=crp2.substring(i,crp2.length);
						break;
					}
				}
			}
			flag=0;
			if(crp3!=null){
				for(i=0;i<crp3.length;i++){ 
					if(crp3[i]=="-"&& flag==0){
						document.getElementById("2.0").value=crp3.substring(0,i);
						console.log(crp3.substring(0,i));
						i=i+1;
						j=i;
						flag=1;
					}
					else if(crp3[i]=="-" && flag==1){
						document.getElementById("2.1").value=crp3.substring(j,i);
						i=i+1;
						document.getElementById("2.2").value=crp3.substring(i,crp3.length);
						break;
					}
				}
			}
			flag=0;
			if(crp4!=null){
				for(i=0;i<crp4.length;i++){ 
					if(crp4[i]=="-"&& flag==0){
						document.getElementById("3.0").value=crp4.substring(0,i);
						i=i+1;
						j=i;
						flag=1;
					}
					else if(crp4[i]=="-" && flag==1){
						document.getElementById("3.1").value=crp4.substring(j,i);
						i=i+1;
						document.getElementById("3.2").value=crp4.substring(i,crp4.length);
						break;
					}
				}
			}
		}
	}
	myRequest.send(JSON.stringify(dataJ));
}


//Actions after logout performed here
function logout(){
	var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	//putting date that has passed will delete the cookie 
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"; 
    }
    window.location.href="main.html";
}


//Checking session validity before a page is loaded for farmer
function checkValidSessionFarmer(){ 
	var Cookie = document.cookie;
	if(Cookie.length===0){
		alert("SESSION HAS EXPIRED");
		window.location.href="main.html";
	}
	else
		getFarmerData();
}


//Checking session validity before a page is loaded for retailer
function checkValidSessionRetailer(){
	var Cookie = document.cookie;
	if(Cookie.length===0){
		alert("SESSION HAS EXPIRED");
		window.location.href="main.html";
	}
	else
		getRetailerData();
}


//Adding crops performed here
function editFarmerData(){
	var userid = document.cookie.substring(7,12);
	var cropno=document.getElementById("cropno").value;
	var cropname=document.getElementById("cropname").value;
	var quant=document.getElementById("newquant").value;
	var price=document.getElementById("newprice").value;
	var dataJ ={"data1":cropno,"data2":cropname,"data3":quant,"data4":price,"data5":userid};
	var myRequest = new XMLHttpRequest();
	myRequest.open("POST","http://localhost:8888/editfarmer.html",true);
	myRequest.onreadystatechange=function(){
		if(myRequest.readyState == 4 ){
			window.location.href="farmer_page.html";
		}
	}
	myRequest.send(JSON.stringify(dataJ));
}


//Deleting crops performed here
function deleteFarmerData(){
	var cropno=document.getElementById("deletecropid").value;
	var userid = document.cookie.substring(7,12);
	var dataJ={"data1":cropno,"data2":userid};
	var myRequest = new XMLHttpRequest();
	myRequest.open("POST","http://localhost:8888/deletefarmer.html",true);
	myRequest.onreadystatechange=function(){
		if(myRequest.readyState == 4 ){
			window.location.href="farmer_page.html";
		}
	}
	myRequest.send(JSON.stringify(dataJ));
}


//Drop down data of all fruits and veggies is retrieved for farmer
function getDropDownDataFarmer(){
	var resJ;
	var cropno=document.getElementById("cropno").value;
	if(cropno==1||cropno==2){ 
		//request to get drop down content
		var myRequest = new XMLHttpRequest();
		myRequest.open("GET","http://localhost:8888/getDDVeg",true);
		myRequest.onreadystatechange=function(){
		if(myRequest.readyState == 4 ){
			resJ = JSON.parse(myRequest.responseText);
			document.getElementById("cropname").options.length=0;
			var selectList = document.getElementById("cropname");
			for (var i = 0; i < 30; i++) { 
				//set upper limit based on number of veggies
   				 var option = document.createElement("option");
   				 option.value = resJ[i].vegetables;
    			 option.text = resJ[i].vegetables;
   				 selectList.appendChild(option);
			} 
		}
	}
		myRequest.send();
	} 

	else{ //populate fruits column
		var myRequest = new XMLHttpRequest();
		myRequest.open("GET","http://localhost:8888/getDDFru",true);
		myRequest.onreadystatechange=function(){
		if(myRequest.readyState == 4 ){
			resJ = JSON.parse(myRequest.responseText);
			document.getElementById("cropname").options.length=0;
			var selectList = document.getElementById("cropname");
			for (var i = 0; i < 30; i++) { 
				//set upper limit carefully
   				 var option = document.createElement("option");
   				 option.value = resJ[i].fruits;
    			 option.text = resJ[i].fruits;
   				 selectList.appendChild(option);
			} 
		}
	}
		myRequest.send();
	}
}


//Drop down data of all fruits and veggies is retrieved for farmer
function getDropDownDataRetailer(){
	var resJ;
	var croptype=document.getElementById("cropno").value;
	if(croptype==="Vegetables"){ 
		var myRequest = new XMLHttpRequest();
		myRequest.open("GET","http://localhost:8888/getDDVeg",true);
		myRequest.onreadystatechange=function(){
		if(myRequest.readyState == 4 ){
			resJ = JSON.parse(myRequest.responseText);
			document.getElementById("cropname").options.length=0;
			var selectList = document.getElementById("cropname");
			for (var i = 0; i < 30; i++) { //set upper limit based on number of veggies
   				 var option = document.createElement("option");
   				 option.value = resJ[i].vegetables;
    			 option.text = resJ[i].vegetables;
   				 selectList.appendChild(option);
			} 
		}
	}
		myRequest.send();
	} 

	else{ //populate fruits column
		var myRequest = new XMLHttpRequest();
		myRequest.open("GET","http://localhost:8888/getDDFru",true);
		myRequest.onreadystatechange=function(){
		if(myRequest.readyState == 4 ){
			resJ = JSON.parse(myRequest.responseText);
			document.getElementById("cropname").options.length=0;
			var selectList = document.getElementById("cropname");
			for (var i = 0; i < 30; i++) { //set upper limit carefully
   				 var option = document.createElement("option");
   				 option.value = resJ[i].fruits;
    			 option.text = resJ[i].fruits;
   				 selectList.appendChild(option);
			} 
		}
	}
		myRequest.send();
	}
}


//function to get reatiler data
function getRetailerData(){
	var Cookie = document.cookie;
	var username = Cookie.substring(19,Cookie.length);
	document.getElementById("username").value=username;
}


//Searching operation is done here
function retailer(){
	console.log("here");
	var crp=document.getElementById("cropname").value;
	var croptype=document.getElementById("cropno").value;
	var dataJ={"data1":croptype,"data2":crp};
	var myRequest= new XMLHttpRequest();
	myRequest.open("POST","http://localhost:8888/retailer_page.html",true);
	myRequest.onreadystatechange=function(){
		if(myRequest.readyState==4){
			resJ = JSON.parse(myRequest.responseText);
			document.getElementById("data1");
			try{
				if(croptype==="Vegetables"){
					for(i=0;;i++){
						addRow(resJ[i].Fname,resJ[i].Lname,resJ[i].location,resJ[i].contact,resJ[i].VCROP1_NAME,resJ[i].VCROP1_PRICE,resJ[i].VCROP1_QUANTITY);
					}
				}
				else{
					for(i=0;;i++){
						addRow(resJ[i].Fname,resJ[i].Lname,resJ[i].location,resJ[i].contact,resJ[i].FCROP1_NAME,resJ[i].FCROP1_PRICE,resJ[i].FCROP1_QUANTITY);
					}
				}
			}
			catch(err){
				console.log(err);
			}
		}
	}
	myRequest.send(JSON.stringify(dataJ)); 
} 


//Search results are added to the HTML dynamically from here
function addRow(Fname,Lname,location,contact,VCROP1_NAME,VCROP1_PRICE,VCROP1_QUANTITY)
{
    var table = document.getElementById("table");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);

    cell1.innerHTML = Fname;
    cell2.innerHTML = Lname;
    cell3.innerHTML = location;
    cell4.innerHTML = contact;
    cell5.innerHTML = VCROP1_NAME;
    cell6.innerHTML = VCROP1_PRICE;
    cell7.innerHTML = VCROP1_QUANTITY;
}