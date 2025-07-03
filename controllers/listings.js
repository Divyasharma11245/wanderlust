// const Listing = require("../models/listing.js");
// const axios = require("axios");


// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", {allListings});
// };

// module.exports.renderNewForm = (req, res) => {
//     res.render("listings/new.ejs");
// };

// module.exports.showListing = async(req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate({ path:"reviews", populate: {path:"author"},}).populate("owner");
//     if(!listing){
//         req.flash("error", "Listing you requested for doesn't exist");
//          return res.redirect("lListings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", { listing });
// };

// // module.exports.createListing = async(req, res, next) => {
// //     let url = req.file.path;
// //     let filename = req.file.filename;

// //     const newListing = new Listing(req.body.listing);
// //     newListing.owner = req.user._id;
// //     newListing.image = { url, filename };
// //     await newListing.save();
// //     req.flash("success", "New Listing Created");
// //     res.redirect("/listings");
// // };

// module.exports.createListing = async (req, res, next) => {
//   try {
//     const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
//       params: {
//         q: req.body.listing.location,
//         format: "json",
//         limit: 1,
//       },
//       headers: {
//         'User-Agent': 'wanderlust-app/1.0' // Required by Nominatim usage policy
//       }
//     });

//     const coords = geoResponse.data[0];

//     if (!coords) {
//       req.flash("error", "Location not found! Please enter a valid place.");
//       return res.redirect("/listings/new");
//     }

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;

//     // Image from multer/cloudinary
//     newListing.image = {
//       url: req.file.path,
//       filename: req.file.filename,
//     };

//     // Coordinates from Nominatim
//     newListing.geometry = {
//       type: "Point",
//       coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)], // [lng, lat]
//     };

//     await newListing.save();
//     req.flash("success", "New Listing Created");
//     res.redirect(`/listings/${newListing._id}`);
//   } catch (err) {
//     console.error("Geocoding error:", err);
//     req.flash("error", "Something went wrong while creating listing.");
//     res.redirect("/listings/new");
//   }
// };


// module.exports.renderEditForm = async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//      if(!listing){
//         req.flash("error", "Listing you requested for doesn't exist");
//         res.redirect("/Listings");
//     }

//     let originalImageUrl = listing.image.url;
//      originalImageUrl =  originalImageUrl.replace("/upload", "/upload/w_250")
//     res.render("listings/edit.ejs", {listing,  originalImageUrl});
// };

// module.exports.updateListing = async(req, res) => {

//     const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
//   params: {
//     q: req.body.listing.location,
//     format: "json",
//     limit: 1,
//   },
//   headers: {
//     'User-Agent': 'wanderlust-app/1.0'
//   }
// });

// const coords = geoResponse.data[0];
// if (!coords) {
//   req.flash("error", "Location not found! Please enter a valid place.");
//   return res.redirect(`/listings/${id}/edit`);
// }

// listing.geometry = {
//   type: "Point",
//   coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)],
// };

//     let {id} = req.params;
//    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

//    if(typeof req.file !== "undefined") {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//    }

//    req.flash("success", "Listing Updated");
//    res.redirect(`/listings/${id}`);
// };

// module.exports.destroyListing = async(req, res) => {
//     let {id} = req.params;
//     let deletedListing =  await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//      req.flash("success", "Listing Deleted");
//     res.redirect("/listings");
// };


const Listing = require("../models/listing.js");
const axios = require("axios");
const { cloudinary } = require("../cloudConfig.js");

// GET /listings - show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// GET /listings/new - show form to create new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// GET /listings/:id - show single listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// POST /listings - create new listing
module.exports.createListing = async (req, res, next) => {
  try {
    const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: req.body.listing.location,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "wanderlust-app/1.0",
      },
    });

    const coords = geoResponse.data[0];
    if (!coords) {
      req.flash("error", "Location not found! Please enter a valid place.");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Image from Cloudinary
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    // Geolocation
    newListing.geometry = {
      type: "Point",
      coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)],
    };

    await newListing.save();
    console.log("Saved listing geometry:", newListing.geometry); // 👈 Add this

    req.flash("success", "New Listing Created");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("Geocoding error:", err);
    req.flash("error", "Something went wrong while creating listing.");
    res.redirect("/listings/new");
  }
};

// GET /listings/:id/edit - render edit form
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// PUT /listings/:id - update listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: req.body.listing.location,
      format: "json",
      limit: 1,
    },
    headers: {
      "User-Agent": "wanderlust-app/1.0",
    },
  });

  const coords = geoResponse.data[0];
  if (!coords) {
    req.flash("error", "Location not found! Please enter a valid place.");
    return res.redirect(`/listings/${id}/edit`);
  }

  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Update image if new file uploaded
  if (req.file) {
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // Update location geometry
  listing.geometry = {
    type: "Point",
    coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)],
  };

  await listing.save();
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

// DELETE /listings/:id - delete listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);

  if (listing && listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
