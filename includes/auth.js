const conn = require("../db/conn");

//fetch all records
let blogodb = {};
blogodb.all = () => {
  return new Promise((resolve, reject)=>{
    conn.query('SELECT * FROM students', (err, results)=>{
      if(err){return reject(err);}
      return resolve(results)
    });
  });
};

//fetch one record
blogodb.one = (email, userID) => {
  return new Promise((resolve, reject)=>{
    conn.query('SELECT * FROM students WHERE RegistrationNumber = ? || UserID = ?', [email, userID], (err, results)=>{
      if(err){return reject(err);}
      return resolve(results[0])
    });
  });
}


//create a new record
blogodb.create = (userData) => {
  return new Promise((resolve, reject)=>{
    conn.query("SELECT RegistrationNumber FROM  students WHERE RegistrationNumber = ?", [userData.email], (err, result) => {
        if(err){return reject(err);}
        if(result.length === 0){
          conn.query('INSERT INTO students(FirstName, LastName, RegistrationNumber, PhoneNumber, Password, YearOfStudy, Semester, School, Department, UserID) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )', [ userData.fname, userData.lname, userData.regno, userData.phone, userData.password, userData.year, userData.semester, userData.school, userData.department, userData.userID ], (err, results)=>{
            if(err){return reject(err);}
            return resolve(results)
          });
        }else{  
          return reject({"error": "RegistrationNumber provided is already in use!", "message":"please login to your account", "details": err});
        }
    });
  });
}

//register a new user to the system
blogodb.reguser = (userData) => {
  return new Promise((resolve, reject)=>{
    conn.query("SELECT RegistrationNumber FROM  students WHERE RegistrationNumber = ?", [userData.email], (err, result) => {
        if(err){return reject(err);}
        if(result.length === 0){
          conn.query('INSERT INTO students(FullName, RegistrationNumber, PhoneNumber, Password, UserID, SessionID) VALUES( ?, ?, ?, ?, ?, ? )', [ userData.fullname, userData.email, userData.phone, userData.password, userData.userID, userData.sessionID ], (err, results)=>{
            return resolve(results)
          });
        }else{
          return reject({"error": "RegistrationNumber provided is already in use!", "message":"please login to your account", "details": err});
        }
    });
  }).catch(err => { throw err });
}

//google reg user to sys
blogodb.googlereg = (userData) => {
  return new Promise((resolve, reject)=>{
    conn.query("SELECT RegistrationNumber FROM  google_auth WHERE RegistrationNumber = ?", [userData.email], (err, result) => {
        if(err){return reject(err);}
        if(result.length === 0){
          conn.query('INSERT INTO google_auth(RegistrationNumber, FamilyName, GivenName, GoogleId, ImgUrl, Name, UserID) VALUES( ?, ?, ?, ?, ?, ?, ?)', [ userData.email, userData.familyName, userData.givenName, userData.googleId, userData.imageUrl, userData.name, userData.userID ], (err, results)=>{
            if(err){return reject(err);}
            return resolve(results)
          });
        }else{
          console.log("RegistrationNumber provided is already in use!");
          //return reject({"error": "RegistrationNumber provided is already in use!", "message":"please login to your account", "details": err});
        }
    });
  });
}

//update a record
blogodb.update = (id, userData) => {
  return new Promise((resolve, reject)=>{
    conn.query('UPDATE students SET name=?, released_year=?, githut_rank=?, pypl_rank=?, tiobe_rank=? WHERE id=?', [ userData.name, userData.released_year, userData.githut_rank, userData.pypl_rank, userData.tiobe_rank, id ], (err, results)=>{
      if(err){return reject(err);}
      return resolve(results)
    });
  });
}
//remove a record
blogodb.update = (id) => {
  return new Promise((resolve, reject)=>{
    conn.query('DELETE FROM students WHERE id=?', [id], (err, results)=>{
      if(err){return reject(err);}
      return resolve(results)
    });
  });
}

module.exports = blogodb;