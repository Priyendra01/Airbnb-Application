const Listing = require("../models/listing.js");

module.exports.index =async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
 }

 module.exports.renderNewForm = async (req,res)=>{
 
    if(!req.isAuthenticated()){
      req.flash("error","You must be logged in to create listing !");
      res.redirect("/login");
    }
    res.render("listing/new.ejs");
  
  }

  module.exports.creatListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename
    let newListing =   new Listing( req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
   }

   module.exports.renderEditForm = async (req,res)=>{
      let {id} = req.params;
      let listing = await Listing.findById(id);
      let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
      res.render("listing/edit.ejs",{listing , originalImageUrl});
    }

    module.exports.updateListing = async (req,res)=>{
       let {id}= req.params;
      
      const listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success","Listing Updated");
      if(typeof req.file !=='undefined'){
      let url = req.file.path;
      let filename = req.file.filename;
       listing.image = {url,filename};
       await listing.save();
      }
       res.redirect(`/listings/${id}`);
       
     }

     module.exports.destroyListing = async (req,res)=>{
        let {id} = req.params;
     
        
       await Listing.findByIdAndDelete(id);
       req.flash("success"," Listing Deleted");
        res.redirect("/listings");
      }

      module.exports.showListing = async (req, res) => {
        const { id } = req.params;
        
        const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }
       
        res.render("listing/show.ejs", { listing });
      }