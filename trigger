


1.THESE THE THE TWO TRIGGERS WHICH AUTO GENETRATES userid FOR BOTH FARMER AND RETAILER RESPECTIVELY:
  
  a) DELIMITER $$
 		CREATE TRIGGER get_ID
 		BEFORE INSERT ON user_FARMER
 		FOR EACH ROW
 		BEGIN
 		DECLARE maxid INT;
  
 		SET maxid= (SELECT max(id) FROM user_FARMER);

   		SET  NEW.userid = CONCAT('F',LPAD(maxid, 4,'0'));
 	END$$
 DELIMITER ;

 

  b) DELIMITER $$
  		CREATE TRIGGER get_ID_RETAILER
  		BEFORE INSERT ON user_RETAILER
  		FOR EACH ROW
  		BEGIN
  		DECLARE maxid INT;
  
  		SET maxid= (SELECT max(id) FROM user_RETAILER);

  		SET  NEW.userid = CONCAT('R',LPAD(maxid, 4,'0'));
 	END$$
 DELIMITER ;



2. These are the two views from the table USER_FARMER_DATA for vegetables and fruits respectively, and they help in separation of crop name,
   price,quantity.

 a) CREATE VIEW RETAIL_VIEW_VEGETABLES AS
    SELECT         userid,SUBSTRING_INDEX(crop,'-',1) AS VCROP1_NAME, 
                  SUBSTRING_INDEX(SUBSTRING_INDEX(crop,'-',2),'-',-1) AS VCROP1_PRICE, 
                  SUBSTRING_INDEX(crop,'-',-1) AS VCROP1_QUANTITY, 
                  
                  SUBSTRING_INDEX(crop2,'-',1) AS VCROP2_NAME, 
                  SUBSTRING_INDEX(SUBSTRING_INDEX(crop2,'-',2),'-',-1) AS VCROP2_PRICE, 
                  SUBSTRING_INDEX(crop2,'-',-1) AS VCROP2_QUANTITY
   FROM USER_FARMER_DATA;

  b) CREATE VIEW RETAIL_VIEW_FRUITS AS
     SELECT       userid,SUBSTRING_INDEX(crop3,'-',1) AS FCROP1_NAME, 
                  SUBSTRING_INDEX(SUBSTRING_INDEX(crop3,'-',2),'-',-1) AS FCROP1_PRICE, 
                  SUBSTRING_INDEX(crop3,'-',-1) AS FCROP1_QUANTITY,
  
		  SUBSTRING_INDEX(crop4,'-',1) AS FCROP2_NAME, 
                  SUBSTRING_INDEX(SUBSTRING_INDEX(crop4,'-',2),'-',-1) AS FCROP2_PRICE, 
                  SUBSTRING_INDEX(crop4,'-',-1) AS FCROP2_QUANTITY 
   FROM USER_FARMER_DATA;






8. These views created will select columns from user_FARMER table and (RETAIL_VIEW_VEGETABLES->vegetables,RETAIL_VIEW_FRUITS->fruits)
   and displays the crop searched along with the respective farmer name, his contact and location.


   CREATE VIEW RETAIL_VIEW_1 AS
   SELECT         user_FARMER.Fname,user_FARMER.Lname,user_FARMER.location,user_FARMER.contact,
	          RETAIL_VIEW_FRUITS.FCROP1_NAME,RETAIL_VIEW_FRUITS.FCROP1_PRICE,RETAIL_VIEW_FRUITS.FCROP1_QUANTITY,
		  RETAIL_VIEW_FRUITS.FCROP2_NAME,RETAIL_VIEW_FRUITS.FCROP2_PRICE,RETAIL_VIEW_FRUITS.FCROP2_QUANTITY		
   FROM      RETAIL_VIEW_FRUITS     

   JOIN user_FARMER
   ON RETAIL_VIEW_FRUITS.userid=user_FARMER.userid;


   CREATE VIEW RETAIL_VIEW_2 AS
   SELECT         user_FARMER.Fname,user_FARMER.Lname,user_FARMER.location,user_FARMER.contact,
	          RETAIL_VIEW_VEGETABLES.VCROP1_NAME,RETAIL_VIEW_VEGETABLES.VCROP1_PRICE,RETAIL_VIEW_VEGETABLES.VCROP1_QUANTITY,
		  RETAIL_VIEW_VEGETABLES.VCROP2_NAME,RETAIL_VIEW_VEGETABLES.VCROP2_PRICE,RETAIL_VIEW_VEGETABLES.VCROP2_QUANTITY		
   FROM      RETAIL_VIEW_VEGETABLES     
   JOIN user_FARMER
   ON RETAIL_VIEW_VEGETABLES.userid=user_FARMER.userid;



// quick access to create tables in mysql:

 A. CREATE TABLE user_FARMER(userid varchar(20) PRIMARY KEY,password varchar(20),Fname varchar(20),Lname varchar(20),location varchar(20),      contact varchar(20) UNIQUE KEY,id int(11) UNIQUE KEY AUTO_INCREMENT) 

B. CREATE TABLE USER_FARMER_DATA(userid varchar(20), crop varchar(20),crop2 varchar(20),crop3 varchar(20),crop4 varchar(20))
