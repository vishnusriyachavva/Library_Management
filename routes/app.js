var express = require('express');
var router = express.Router();
const { async } = require("@firebase/util");
const {FieldValue} = require('firebase-admin/firestore');

const {db}=require('../firebase.js')



router.get('/', function(req, res, next) {
    res.render('index', { title: 'Library Management' });
  });

  router.post('/student',(req,res,next)=>{
    const id1=req.body.na;
    const id2=req.body.pass;
    try{
      db.collection("Student_details").where("student_username","==",id1).where("Password","==",id2).get()
      .then((docs)=>{
          if(docs.size >0){
              //console.log(doc);
              res.render('student',{id1:id1})
          }
           
              else{
                  res.send("no user available")
              }
})
     }catch(error){
      res.json("hello");
  }
})
router.post('/stusignup',(req,res,next)=>{
    
  res.render('stusignup')
  
})

router.post('/index',(req,res,next)=>{
    
  res.render('index')
  
})

router.post('/adsignup',(req,res)=>{
    
  res.render("adsignup")
  
})

router.post('/admin',(req,res,next)=>{
  const id1=req.body.ad;
  const id2=req.body.adp;
  try{
    db.collection("Admin_details").where("admin_username","==",id1).where("Password","==",id2).get()
    .then((docs)=>{
        if(docs.size >0){
            //console.log(doc);
            res.render('admin',{id1:id1})
        }
         
            else{
                res.send("no user available")
            }
})
   }catch(error){
    res.json("hello");
}
    
})

router.post('/add',(req,res,next)=>{
  
  res.render('add')
  
})


router.post('/remove',(req,res,next)=>{
  
  res.render('remove')
  
})

router.post('/check',(req,res,next)=>{
  
  res.render('check')
  //res.send(responseArr)
})

router.post('/adding',(req,res,next)=>{
  try{
    const id=req.body.bname;
    const UserJson={
        
         book_title:req.body.bname,
         Type:req.body.type,
         Published_Date:req.body.date,
         Description:req.body.des,
         Author:req.body.baname,
         About_author:req.body.about

    }
    //console.log(UserJson);
    const response=db.collection("books").doc(id).set(UserJson);
    //console.log("await response"); 
    res.json("Successfully added")
}catch(error){
    res.json("hello");
    console.log("error")
}
})

router.post('/adsign',(req,res,next)=>{
  try{
    const id=req.body.aname;
    const UserJson={
        
         admin_username:req.body.aname,
         Password:req.body.passw,
        

    }
    console.log(UserJson);
    const response=db.collection("Admin_details").doc(id).set(UserJson);
    //console.log("await response"); 
    res.json("Successfully added")
}catch(error){
    res.json("hello");
    console.log("error")
}
})

router.post('/stsign',(req,res,next)=>{
  try{
    const id=req.body.sname;
    const UserJson={
        
         student_username:req.body.sname,
         Password:req.body.passw,
        

    }
    console.log(UserJson);
    const response=db.collection("Student_details").doc(id).set(UserJson);
    //console.log("await response"); 
    res.json("Successfully added")
}catch(error){
    res.json("hello");
    console.log("error")
}
})


router.post('/reserve/:id',(req,res,next)=>{
  const i = req.body.sname.concat("-",req.params.id);
  try{
    
    const UserJson={
        bname:req.params.id,
         sname:req.body.sname,
         date:req.body.dat
    }
    console.log(UserJson);
    const response=db.collection("reserved").doc(i).set(UserJson);
    
    res.send("Successfully added")
}catch(error){
    res.send("hello");
    console.log("error")
}
})


router.post('/sub/:id',(req,res,next)=>{
  
  try{
    console.log(req.body.sname)
    const i = req.body.sname.concat("-",req.params.id);
    
    const userRef = db.collection("reserved").doc(i).delete()
    
    res.send('deleted');

}catch(error){
    res.send("hello");
}
})


router.get('/about/:id',async (req,res)=>{
 
  try{
    
    const a = req.params.id;
      const usersRef=db.collection("books").doc(a);
    //  console.log(a)
      const doc=await usersRef.get();
      
      let responseArr=doc.data();
      
      
      console.log(responseArr)
      //res.send(doc.data())
     res.render('about',{responseArr:responseArr});
//res.end()
  }catch(error){
      res.send(error);
  }
});

router.post('/read',async (req,res)=>{
  try{
      const usersRef=db.collection("books");
      const doc=await usersRef.get();
      console.log(doc)
      let responseArr=[];
      doc.forEach(ele=>{
          responseArr.push(ele.data());
          //console.log(ele.data())
      })
      res.render('read',{responseArr:responseArr});
      //console.log(responseArr)
     
//res.end()
  }catch(error){
      res.send(error);
  }
});


router.post('/show',async (req,res)=>{
  try{
      const usersRef=db.collection("reserved");
      const doc=await usersRef.get();
      let responseArr=[];
      const id2=req.body.in;
      
      doc.forEach(ele=>{
        if((ele.data()).sname==id2){
          responseArr.push(ele.data());
        }
         
      })
      res.render('show',{responseArr:responseArr});
      
     
//res.end()
  }catch(error){
      res.send(error);
  }
});

router.post('/delete',async (req,res)=>{
  try{
    
      const userRef=await db.collection("books").doc(req.body.book).delete()
      
      res.send('deleted');

  }catch(error){
      res.send("hello");
  }
})

module.exports=router;