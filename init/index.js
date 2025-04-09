const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then((res)=>{
    console.log("connection successfully");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  }


  async function initDB(){
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner : "6757f469119333970c47c248"}));
   await Listing.insertMany(initData.data);
   console.log(initData.data);

  };

  initDB();