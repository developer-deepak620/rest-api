const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {MongoClient,ObjectId} = require("mongodb");
const client = new MongoClient("mongodb+srv://deepakkumar456992:123%40deepak@cluster0.gexspmq.mongodb.net/");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));


let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,__dirname+"/public")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});
let upload = multer({storage:storage});


app.get("/products",async(req,res)=>{

    await client.connect();
    let db = client.db("rest_api");
    let coll = db.collection("products");
    let resp = await coll.find().toArray();

    res.json(resp);
});


app.post("/products",upload.single("image"),async(req,res)=>{

    let data = req.body;
    
    let image = "";
    if(req.file){
        image=req.file.originalname;
    }else{
        image="";
    }
    data.image = image;
    console.log(data);
    

    await client.connect();
    let db = client.db("rest_api");
    let coll = db.collection("products");
    let resp = await coll.insertOne(data);

    console.log("product name is "+data.title);

    res.json({msg:"Success! New Product Inserted!!",data:resp});
});


app.get("/products/:id",async(req,res)=>{

    let id = parseInt(req.params.id);

    await client.connect();
    let db = client.db("rest_api");
    let coll = db.collection("products");
    let resp = await coll.find({id:id}).toArray();

    res.json(resp[0]);
});





// customer

app.get("/user",async(req,res)=>{

    await client.connect();
    let db = client.db("rest_api");
    let coll = db.collection("user");
    let resp = await coll.find().toArray();

    res.json(resp);
});

app.post("/user",async(req,res)=>{

    let data = req.body;

    await client.connect();
    let db = client.db("rest_api");
    let user = db.collection("user");
    let resp = await user.insertOne(data);

    res.json({msg:"Success!! New Record Inserted!!",data:resp});
                                                                                
});


app.get("/user/:id",async(req,res)=>{

    let id = req.params.id;
    await client.connect();
    let db = client.db("rest_api");
    let user = db.collection("user");

    let resp = await user.find({_id:ObjectId.createFromHexString(id)}).toArray(); 

    res.json(resp[0]);
});


app.delete("/user/:id",async(req,res)=>{

    let id = req.params.id;
    
    await client.connect();
    let db = client.db("rest_api");
    let user = db.collection("user");
    let resp = await user.deleteOne({_id:ObjectId.createFromHexString(id)});

    res.json({msg:"Succcessfully!! record deeted.",data:resp});
});

app.put("/user/:id",async(req,res)=>{

    let id = req.params.id;
    let data = req.body;

    await client.connect();
    let db = client.db("rest_api");
    let user = db.collection("user");
    let resp = await user.updateOne({_id:ObjectId.createFromHexString(id)},{$set:data});

    res.json({msg:"Success!! new customer updated.",data:resp});
});

app.patch("/user/:id",async(req,res)=>{

    let id = req.params.id;
    let data = req.body;

    await client.connect();
    let db = client.db("rest_api");
    let user = db.collection("user");
    let resp = await user.updateOne({_id:ObjectId.createFromHexString(id)},{$set:data});

    res.json({msg:"Success!! customer'record updated.",data:resp});
});

app.listen(8000,()=>console.log("server started on port 8000"));