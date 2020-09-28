const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const validateLoginInput = require("../validation/staff/login");
const Staff = require("../models/Staff");
const Support = require("../models/Support");
const Demand = require("../models/On-Demand-Movies");
const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaints");
const Movie = require("../models/Movies");

exports.LOGIN_STAFF = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  Staff.findOne({ email })
    .exec()
    .then(staff => {
      if (!staff) {
        res.status(404).json({ emailNotFound: "Email not found" });
      }
      bcrypt.compare(password, staff.password).then(isMatch => {
        console.log(isMatch);

        if (isMatch) {
          //jwt_payload
          const payload = {
            id: staff._id,
            name: staff.name
          };
          jwt.sign(
            payload,
            keys.secret,
            { expiresIn: 31556926 },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                success: true,
                message: "Successfully Logged In",
                token: "Bearer" + " " + token,
                staff
              });
            }
          );
        } else {
          res
            .status(500)
            .json({ success: false, passwordIncorrect: "Password incorrect" });
        }
      });
    });
};
//Demands
exports.GET_PENDING_DEMANDS = (req, res, next) => {
  Demand.find({ status: false })
    .exec()
    .then(allDemands => {
      if (allDemands.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Demands Not Found" });
      }
      res.status(200).json({
        success: true,
        message: "All Demands",
        allDemands,
        totalDemands: allDemands.length
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all demands error :", err });
    });
};
exports.GET_ALL_DEMANDS = (req, res, next) => {
  Demand.find()
    .exec()
    .then(allDemands => {
      if (allDemands.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Demands Not Found" });
      }
      res.status(200).json({
        success: true,
        message: "All Demands",
        allDemands,
        totalDemands: allDemands.length
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all demands error :", err });
    });
};
exports.GET_DEMAND = (req, res, next) => {
  const { id } = req.params;
  Demand.findById({ _id: id })
    .select("_userId title1 title2 title3 review")
    .populate("_userId")
    .exec()
    .then(dMovie => {
      if (!dMovie) {
        return res
          .status(404)
          .json({ success: false, message: "Demanded Movie not Found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Demanded Movie found", dMovie });
    })
    .catch(err => {
      res.status(500).json({ Error: "Demanded Movie finding error :", err });
    });
};
exports.UPDATE_DEMAND = (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  Demand.findById({ _id: id })
    .select("_userId title1 title2 title3 review")
    .populate("_userId")
    .exec()
    .then(dMovie => {
      if (!dMovie) {
        return res
          .status(404)
          .json({ success: false, message: "Demanded Movie not Found" });
      }
      dMovie.status = status;
      dMovie.save();
      res
        .status(200)
        .json({ success: true, message: "Demanded Movie found", dMovie });
    })
    .catch(err => {
      res.status(500).json({ Error: "Demanded Movie finding error :", err });
    });
};
//Movies
exports.GET_MOVIE = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }

      return res.status(200).json({ success: true, movie });
    })
    .catch(err => {
      console.log("Error Fetching Movie :", err);
    });
};
exports.SEARCH_MOVIE = (req, res, next) => {
  const { query } = req.params;
  var regex = new RegExp(query, "i");
  console.log(regex);
  Movie.find({ title: regex })
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      return res.status(200).json({ success: true, movie });
    })
    .catch(err => {
      console.log("Error Fetching Movie :", err);
    });
};
exports.GET_ALL_MOVIES = (req, res, next) => {
  Movie.find()
    .exec()
    .then(movies => {
      if (!movies) {
        return res
          .status(404)
          .json({ success: false, message: "Movies not found" });
      }
      res.status(200).json({ success: true, movies });
    })
    .catch(err => {
      console.log("Getting all movies error :", err);
    });
};

//Complaints
exports.GET_ALL_COMPLAINTS = (req, res, next) => {
  console.log("Called Complaints");

  Complaint.find()
    .exec()
    .then(allComplaints => {
      if (allComplaints.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Complaints Not Found" });
      }
      res.status(200).json({
        success: true,
        message: "All Complaints",
        allComplaints,
        totalComplaints: allComplaints.length
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all complaints error :", err });
    });
};
exports.GET_COMPLAINT = (req, res, next) => {
  const { id } = req.params;
  Complaint.findById(id)
    .select("_userId subject complaint")
    .populate("_userId")
    .exec()
    .then(comp => {
      if (!comp) {
        return res
          .status(404)
          .json({ success: false, message: "Complaint not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Complaint found", complaint: comp });
    })
    .catch(err => {
      res.status(500).json({ Error: "Complaint finding error :", err });
    });
};
exports.MANAGE_STATUS = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  await Complaint.findById(id)
    .exec()
    .then(uStatus => {
      if (!uStatus) {
        return res
          .status(404)
          .json({ success: false, message: "Complaint not found for this Id" });
      }
      uStatus.status = status;
      console.log(uStatus);
      uStatus.save();
      res.status(200).json({
        success: true,
        message: "Status Changed successfuly",
        uStatus
      });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
//Feedback
exports.GET_ONE_FEEDBACK = (req, res, next) => {
  const { id } = req.params;
  Feedback.findById(id)
    .select("_movieId title review ratings")
    .populate("_movieId")
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      res.status(200).json({ success: true, message: "Movie found", movie });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
exports.UPDATE_FEEDBACK = (req, res, next) => {
  const { title, review, ratings } = req.body;
  const { id } = req.params;
  Feedback.findById(id)
    .select("_movieId title review ratings")
    .populate("_movieId")
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      movie.title = title;
      movie.review = review;
      movie.ratings = ratings;
      movie.save();
      res.status(200).json({ success: true, message: "Movie found", movie });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
exports.GET_MOVIE_FEEDBACK = (req, res, next) => {
  const { id } = req.params;
  Feedback.find({ _movieId: id })
    .select("_movieId title review ratings")
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      res.status(200).json({ success: true, message: "Movie found", movie });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
exports.GET_ALL_FEEDBACK = (req, res, next) => {
  Feedback.find()
    .exec()
    .then(allFeedbacks => {
      if (allFeedbacks.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "There is no feedback exists" });
      }
      res.status(200).json({
        success: true,
        message: "All Feedbacks",
        allFeedbacks,
        totalFeedbacks: allFeedbacks.length
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all feedbacks error :", err });
    });
};
//Support
exports.GET_ALL_SUPPORT = (req, res, next) => {
  Support.find()
    .populate("_userId", "email phone subject query ")
    .exec()
    .then(allSupport => {
      if (allSupport.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Support Not Found" });
      }
      const supports = allSupport.map(element => {
        const { phone, subject, query, _userId } = element;
        const { email } = _userId;
        return {
          phone,
          subject,
          query,
          email
        };
      });
      res
        .status(200)
        .json({ success: true, message: "All Support", allSupport: supports });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all support error :", err });
    });
};
exports.GET_SUPPORT = (req, res, next) => {
  const { id } = req.params;
  Support.findById(id)
    .populate("_userId")
    .exec()
    .then(comp => {
      if (!comp) {
        return res
          .status(404)
          .json({ success: false, message: "Support not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Support found", complaint: comp });
    })
    .catch(err => {
      res.status(500).json({ Error: "Support finding error :", err });
    });
};
