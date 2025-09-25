const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// User can leave only one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  let averageRating = 0;

  if (obj.length > 0) {
    if (obj[0].count === 1) {
      // vain yksi review → avg = sen rating
      averageRating = obj[0].averageRating;
    } else {
      // useampi review → pyöristä halutulla tavalla
      averageRating = obj[0].averageRating;
    }
  } else {
    // ei yhtään reviews
    averageRating = 0;
  }

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageRating after deleteOne
ReviewSchema.post("deleteOne", { document: true, query: false }, function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
