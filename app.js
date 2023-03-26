var express = require("express");
var app = express();
var fileUpload = require("express-fileupload");
const fs = require("fs");
var nodemailer = require('nodemailer');


var mysql = require("mysql");

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "studenthelp"
});

db.connect(function (error) {
    if (error) throw error;
    console.log("Database Connection Created");
});


app.use(fileUpload());
app.use(express.static("views"));
app.use(express.static("public"));
app.use(express.static("upload"));
app.use(express.urlencoded({extended:true}));

app.post("/load-sname",(req,res)=>{
  var a = req.body.username;
  var query = `SELECT name,email FROM users WHERE username= '${a}'`;
  db.query(query,function(error,data){
    if(error){
      throw error;
    }else{
      res.send(data);
    }
  });
  })

app.post("/load-tname",(req,res)=>{
var a = req.body.username;
var query = `SELECT cname,teacher FROM classes WHERE username= '${a}'`;
db.query(query,function(error,data){
  if(error){
    throw error;
  }else{
    res.send(data);
  }
});
})

app.post("/replied-query",(req,res)=>{
var query = `SELECT qid,qrid,reply FROM queryreply `;
db.query(query,function(error,data){
  if(error){
    throw error;
  }else{
    res.send(data);
  }
});

})

app.post("/reply-query",(req,res)=>{
var a = req.body.qid;
var b = req.body.reply; 

var query  = `INSERT INTO queryreply (qid,reply) VALUES ('${a}', '${b}')`;
db.query(query,function(error){
  if(error){
    throw error;
  }else{
    res.send("done");
  }
});


})


app.post( "/show-teacher-queries",(req,res)=>{
var a = req.body.id;
var query = `SELECT query,qid,name FROM query WHERE cid = '${a}'`;
db.query(query,function(error,data){
  if(error){
    throw error;
  }else{
    res.send(data);
  }
});






});


app.post("/show-query",(req,res)=>{
  var a = req.body.cid;
  var b  = req.body.username;
  var query = `SELECT query,qid FROM query WHERE username ='${b}' AND cid = '${a}'`;
  db.query(query,function(error,data){
    if(error){
      throw error;
    }else{
      res.send(data);
    }
  });

})



app.post("/ask-query",(req,res)=>{
var a = req.body.cid;
var b  = req.body.username;
var c  = req.body.query;
var query = `SELECT name,email FROM users WHERE username ='${b}'`;
db.query(query,function(error,data){
  if(error){
    throw error;
  }else{
    var query2 =`INSERT INTO query (cid,username,name,query) VALUES ('${a}', '${b}','${data[0].name}','${c}')`;
    db.query(query2,function(error){
      if(error){
        throw error;
      }else{
        res.send("done");
      }
    });
  }
});



})

app.get("/stu-download-work",(req,res)=>{
  var a = req.query.nothing;
  res.download(__dirname + "/upload/" + a, function (err) {
    if (err) {
      throw error;
    }
  });
  
  });


app.post( "/download-stu-work",(req,res)=>{
var a  = req.body.id;
var query =  `SELECT wid,name,filename FROM work_upload WHERE cid ='${a}' ORDER BY wid`;
db.query(query,function(error,data){
  if(error){
    throw error;
  }else{
    res.send(data);
  }
});

})

app.post("/work-submit",(req,res)=>{
var a  = req.body.cid;
var b  = req.body.username;
var query =  `SELECT wid,name,id FROM work_upload WHERE username ='${b}' AND cid = '${a}'`;
db.query(query,function(error,data){
  if(error){
    throw error;
  }else{
    res.send(data);
  }
});


});





app.get("/stu-download",(req,res)=>{
var a = req.query.nothing;
res.download(__dirname + "/upload/" + a, function (err) {
  if (err) {
    throw error;
  }
});

});

app.post("/stu-upload",(req,res)=>{

if (req.files && Object.keys(req.files).length &&req.body.topic&&req.body.username&&req.body.cid&&req.body.wid !== 0) {
    
    var uploadedFile = req.files.myfile;

    var uploadPath = __dirname
        + "/upload/" + uploadedFile.name;
  
    uploadedFile.mv(uploadPath, function (err) {
      if (err) {
        console.log(err);
      } else {
        var uploadedFile = req.files.myfile;
        var filename = uploadedFile.name;
        var topic = req.body.topic;
        var wid = req.body.wid;
        var user = req.body.username;
        var cid = req.body.cid;
        var query = `SELECT name,email FROM users WHERE username ='${user}'`;
        db.query(query,function(error,data){
          if(error){
            throw error;
          }else{
            var query1 =`INSERT INTO work_upload (cid,wid,username,name,topic,filename) VALUES ('${cid}', '${wid}','${user}','${data[0].name}','${topic}','${filename}')`;
        
        db.query(query1,function(error){
          if(error){
            throw error;
          }else{
            res.send("done");
          }
        });

      };
    });
  }});} else res.send("Enter the all Information!");

});







app.post("/load-content",(req,res)=>{
var a = req.body.id;
var query = `SELECT file_name,topic,work,time,id FROM work WHERE cid ='${a}'`;
db.query(query,function(error,data){
  if(error){
    throw error;
  }else{

    res.send(data);
  }
});

});


app.post("/show-content",(req,res)=>{
var a = req.body.id;
var query = `SELECT file_name,topic,work,id,time FROM work WHERE cid ='${a}'`;
db.query(query,function(error,data){
  if(error){
    throw error;
  }else{

    res.send(data);
  }
});


});


app.post("/work-upload",(req,res)=>{
  if (req.files && Object.keys(req.files).length &&req.body.topic&&req.body.work&&req.body.time !== 0) {
    
    var uploadedFile = req.files.myfile;

    var uploadPath = __dirname
        + "/upload/" + uploadedFile.name;
  
    uploadedFile.mv(uploadPath, function (err) {
      if (err) {
        console.log(err);
      } else {
        var uploadedFile = req.files.myfile;
        var filename = uploadedFile.name;
        var topic = req.body.topic;
        var work = req.body.work;
        var time = req.body.time;
        var cid = req.body.cid;
        var query =`INSERT INTO work (file_name,topic,work,time,cid) VALUES ('${filename}', '${topic}','${work}','${time}','${cid}')`;
        
        db.query(query,function(error){
          if(error){
            throw error;
          }else{
            res.send("done");
          }
        });

      };
    });
  } else res.send("Enter the all Information!");
});

app.post("/load-stu" ,(req,res)=>{
var cid=req.body.id;
var query = `SELECT name,subject FROM student_join WHERE id ='${cid}'`;
db.query(query,function(error,data){
  if(error) throw error;
  if(data.length>0){
    res.send(data);
  }


});

});

app.post("/load-classes-stu",(req,res)=>{
  var a = req.body.username;
  var classquery = `SELECT id,cname,subject,code,teacher FROM student_join WHERE username ='${a}'`;
  db.query(classquery,function(error,data){
    if(error) throw error;
    if(data.length>0){

          res.send(data); 
      

    }
  });

})

app.post("/join-class",(req,res)=>{
var a = req.body.code;
var b = req.body.username;
var query = `SELECT id,cname,subject,code,teacher FROM classes WHERE code ='${a}'`;
db.query(query,function(error,data){
  if(error) throw error;
  if(data.length>0){

  var query2 = `SELECT name FROM student_join WHERE username ='${b}' AND id = '${data[0].id}'`;
  db.query(query2,function(error,data2){
    if(error) throw error;
    if(data2.length>0){
      res.send("Class Already Joined");
    }else{
      var query3 = `SELECT email,name FROM users WHERE username ='${b}'`;
      db.query(query3,function(error,data3){
        if(error) throw error;
        if(data3.length>0){
          var query4 = `INSERT INTO student_join (username,name,id,cname,subject,code,teacher) VALUES ('${b}', '${data3[0].name}','${data[0].id}','${data[0].cname}','${data[0].subject}','${data[0].code}','${data[0].teacher}')`;
          db.query(query4,function(error){
            if(error){
              throw error;
            }else{
              res.send("Class Joined");
            }
          
          });
        }
      
      });
    }
  
  });


   }else{
    res.send("Wrong Class Code");
   }
  
});

});


app.post("/load-data",(req,res)=>{

var a = req.body.id;
var query = `SELECT cname,subject,code,teacher FROM classes WHERE id ='${a}'`;
db.query(query,function(error,data){
  if(error) throw error;
  if(data.length>0){
    res.send(data);
   }
  
})
});

app.post("/load-classes",(req,res)=>{
  var a = req.body.username;
  
  var classquery = `SELECT cname,subject,code,id,teacher FROM classes WHERE username ='${a}'`;
  db.query(classquery,function(error,data){
    if(error) throw error;
    if(data.length>0){
      res.send(data);
     }
    
  })
})

app.post("/todo-action",(req,res)=>{
var a = req.body.username;
var taskquery = `SELECT task,id FROM tasks WHERE username ='${a}'`;
db.query(taskquery,function(error,data){
 if(error) throw error;
 if(data.length>0){
  res.send(data);
 }
});

});


app.post("/addtask",(req,res)=>{
var a = req.body.username;
var b = req.body.task;
console.log(a);
console.log(b);
var atask = `INSERT INTO tasks (task, username) VALUES ('${b}', '${a}')`;
db.query(atask,function(error){
  if(error) {
    throw error;
  }else{
    res.send("ok");
  }
})

})

app.post("/deletetask",(req,res)=>{
  var a = req.body.id;
  var dtask = `DELETE FROM tasks WHERE id = '${a}'`;
  db.query(dtask,function(error){
    if(error){
      throw error;
    }else{
      res.send("ok");
    }
  })
})

app.post("/class-signup",(req,res)=>{
var a = req.body.cname;
var b = req.body.subject;
var c = req.body.username;
var d = req.body.classcode;
var selectquery=`SELECT code FROM classes WHERE code ='${d}'`;
db.query(selectquery,function(error,rows,fields){
  if(error) throw error;
  if(rows.length<=0){
    var selectquery2=`SELECT name FROM users WHERE username ='${c}'`;
    db.query(selectquery2,function(error,rows,fields){
      if(error) {
        throw error;
      }else{
        var insertSQL = `INSERT INTO classes(cname, subject, code,username,teacher) VALUES('${a}','${b}','${d}','${c}','${rows[0].name}')`; 
        db.query(insertSQL,function(error){
          if(error) {
            throw error;
          }else{
           res.send("ok"); 
          }
        })
      }
      
    })
  }else{
    res.send("Code Already Exists");
  }

})


});


app.post("/signup-action", (req, res) => {
console.log("active");
    var a = req.body.name;
    var b = req.body.email;
    var c = req.body.username;
    var f = req.body.user;
    var selectquery=`SELECT username FROM login_table WHERE username ='${c}'`;
    db.query(selectquery,function(error,rows,fields){
        if(error) throw error;
        if(rows.length<=0){


          function generateP() {
            var pass = '';
            var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
                    'abcdefghijklmnopqrstuvwxyz0123456789@#$';
              
            for (let i = 1; i <= 8; i++) {
                var char = Math.floor(Math.random()
                            * str.length + 1);
                  
                pass += str.charAt(char)
            }
              
            return pass;
        }

        var password = generateP();
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'kchhabra416@gmail.com',
              pass: 'rexldpmgpxwgynqr'
            }

          });
          
          var mailOptions = {
            from: 'kchhabra416@gmail.com',
            to: b,
            subject: 'Login Password',
            html: `Hello ${a}! <br><br>Your Password is ${password}<br><br>Thanks,<br>Student Help`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });



          var insertSQL = `INSERT INTO login_table(username, password, type) VALUES('${c}','${password}','${f}')`;
          var insertSQL2 = `INSERT INTO users(name, username,email, type) VALUES('${a}','${c}','${b}','${f}')`;
            db.query(insertSQL2,function(error){
              if (error) throw error;
            });
            db.query(insertSQL, function (error) {
         if (error) throw error;});
         
         res.send("ok");
   
}else{
    res.send("Username Already Exists");
}

})

});

app.post("/login-action",(req,res)=>{

var a = req.body.username;
var b = req.body.password;

var selectquery = `SELECT password,type FROM login_table WHERE username='${a}'`;
db.query(selectquery,function(error,rows,fields){
if(error)throw error;
if(rows.length<=0){
   res.send("Incorrect Username or Password");
}else{

  if(b==rows[0].password){
    
    if(rows[0].type=='teacher'){
      res.send("teacher");
   }
    else{
      res.send("student");      
    }
  }else{
    res.send("Incorrect Username or Password");   
  }
}

});
});



app.get("/", function (req, res) {
    res.redirect("login.html");
});


app.listen(5000);