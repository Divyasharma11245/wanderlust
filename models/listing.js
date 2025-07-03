const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
  type: String,
  required: true
},

    image: {
      url: String,
      filename: String,
},
    price: Number,
    location: String,
    country: String,
      reviews: [
        { type: Schema.Types.ObjectId,
         ref: "Review"
         }
        ] ,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
    geometry: {
    type: {
      type: String, // Don't forget this field!
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
      console.log("Deleting associated reviews: ", listing.reviews);
  await Review.deleteMany({_id : {$in : listing.reviews}});
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;