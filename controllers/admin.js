const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
// models
const Admin = require("../models/Admin");
const Movie = require("../models/Movies");
const User = require("../models/Users");
const Staff = require("../models/Staff");
const Demand = require("../models/On-Demand-Movies");
const Feedback = require("../models/Feedback");
const Support = require("../models/Support");
const Complaint = require("../models/Complaints");
///////////////////////////////////////////////////////////////////
const keys = require("../config/keys");
const validateRegisterInput = require("../validation/admin/register");
const validateLoginInput = require("../validation/admin/login");
const validateRegisterInputStaff = require("../validation/staff/register");
const validateUpdateInput = require("../validation/staff/update");
const validateUserUpdateInput = require("../validation/users/update-profile");
////////////////////////////////////////////////////////////////////////////////////
//Authentication
exports.REGISTER_ADMIN = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Admin.findOne({ email: req.body.email })
    .exec()
    .then(admin => {
      if (admin) {
        return res.status(409).json({ email: "Email already exists" });
      }
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        return bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json({ Error: err });
          } else {
            const newAdmin = new Admin({
              name: req.body.name,
              email: req.body.email,
              password: hash
            });
            newAdmin.save().then(user => {
              console.log("New User: ", user);
              res.status(201).json({
                success: true,
                message: "Admin created successfully",
                data: user
              });
            });
          }
        });
      });
    });
};
exports.LOGIN_ADMIN = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  Admin.findOne({ email })
    .exec()
    .then(admin => {
      if (!admin) {
        return res.status(404).json({ emailNotFound: "Email not found" });
      }
      bcrypt.compare(password, admin.password).then(isMatch => {
        if (isMatch) {
          //jwt_payload
          const payload = {
            id: admin.id,
            name: admin.name
          };
          jwt.sign(
            payload,
            keys.secret,
            { expiresIn: 31556926 },
            (err, token) => {
              if (err) throw err;
              return res.status(200).json({
                success: true,
                message: "Successfully Logged In",
                token: "Bearer" + " " + token
              });
            }
          );
        } else {
          return res
            .status(500)
            .json({ success: false, passwordIncorrect: "Password incorrect" });
        }
      });
    });
};
//Movies
exports.UPLOAD_MOVIE = (req, res, next) => {
  const filter = ["language", "res"];

  let languageArr = [],
    resolutionArr = [];
  Object.keys(req.body).forEach(key => {
    const element = key.split("-");
    const length = element.length;
    if (filter.includes(element[0]) && length > 1 && element[1] != "file") {
      if (element[0] == "language") {
        languageArr.push({
          language: req.body[key],
          audio: req.body[element[0] + "-file-" + element[length - 1]]
        });
      } else {
        if (element[0] == "res") {
          resolutionArr.push({
            resolution: req.body[key],
            video: req.body[element[0] + "-file-" + element[length - 1]]
          });
        }
      }
    }
  });
  let {
    title,
    description,
    genre,
    cast,
    image,
    artwork,
    rating,
    trailer,
    type
  } = req.body;
  cast = cast.split(",");
  genre = genre.split(",");
  const newMovie = new Movie({
    title,
    description,
    language: languageArr,
    genre: genre,
    cast: cast,
    image: image,
    video: resolutionArr,
    artwork: artwork,
    rating: rating,
    trailer: trailer,
    type: type
  });

  newMovie
    .save()
    .then(result => {
      res.status(200).json({
        success: true,
        message: "Movie uploaded successfully",
        result
      });
    })
    .catch(err => {
      console.log("Movie upload error :", err);
    });
};

exports.UPDATE_MOVIE = (req, res, next) => {
  const { id } = req.params;
  const filter = ["language", "res"];

  let languageArr = [],
    resolutionArr = [];
  Object.keys(req.body).forEach(key => {
    const element = key.split("-");
    const length = element.length;
    if (filter.includes(element[0]) && length > 1 && element[1] != "file") {
      if (element[0] == "language") {
        languageArr.push({
          language: req.body[key],
          audio: req.body[element[0] + "-file-" + element[length - 1]]
        });
      } else {
        if (element[0] == "res") {
          resolutionArr.push({
            resolution: req.body[key],
            video: req.body[element[0] + "-file-" + element[length - 1]]
          });
        }
      }
    }
  });
  let {
    title,
    description,
    genre,
    cast,
    image,
    artwork,
    rating,
    trailer,
    type
  } = req.body;
  cast = cast.split(",");
  genre = genre.split(",");
  Movie.findById(id)
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      movie.title = title;
      movie.description = description;
      movie.language = languageArr;
      movie.genre = genre;
      movie.cast = cast;
      movie.image = image;
      movie.video = resolutionArr;
      movie.artwork = artwork;
      movie.rating = rating;
      movie.trailer = trailer;
      movie.type = type;

      return movie.save();
    })
    .then(updatedMovie => {
      res.status(200).json({
        success: true,
        updatedMovie,
        message: "Movie Updated successfully"
      });
    })
    .catch(err => {
      console.log("Error during movie update :", err);
    });
};
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
      console.log("Error during movie update :", err);
    });
};

exports.DELETE_MOVIE = (req, res, next) => {
  const { id } = req.params;
  Movie.findByIdAndRemove(id)
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      res.status(200).json({
        success: true,
        message: "Movie deleted successfully",
        deletedMovie: movie
      });
    })
    .catch(err => {
      console.log("Error during movie delete :", err);
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
//Staff
exports.REGISTER_STAFF = (req, res) => {
  const { errors, isValid } = validateRegisterInputStaff(req.body);
  console.log(isValid);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Staff.findOne({ email: req.body.email })
    .exec()
    .then(staff => {
      if (staff) {
        return res.status(409).json({ email: "Email already exists" });
      }
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json({ Error: err });
          } else {
            const { email, fname, lname, role } = req.body;
            const newStaff = new Staff({
              fname,
              lname,
              email,
              role,
              password: hash
            });
            newStaff.save().then(staff => {
              console.log("New Staff: ", staff);
              res.status(201).json({
                success: true,
                message: "Staff created successfully",
                data: staff
              });
            });
          }
        });
      });
    })
    .catch(err => console.log("Error during user creation :", err));
};
exports.UPDATE_STAFF = (req, res, next) => {
  const { errors, isValid } = validateUpdateInput(req.body);
  const { id } = req.params;
  console.log("________________________________");
  if (!isValid) {
    return res.status(400).json(errors);
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        return res.status(500).json({ Error: err });
      } else {
        Staff.findByIdAndUpdate(id, {
          $set: {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: hash,
            role: req.body.role
          }
        })
          .exec()
          .then(staff => {
            console.log(staff);

            if (!staff) {
              return res
                .status(404)
                .json({ success: false, Error: "Staff User not found" });
            }
            return res.status(200).json({
              success: true,
              message: "Profile updated successfully",
              data: staff
            });
          })
          .catch(err => {
            console.log("Error during updated staff :", err);
          });
      }
    });
  });
};
exports.REMOVE_STAFF = (req, res, next) => {
  const { id } = req.params;
  Staff.findByIdAndRemove(id)
    .exec()
    .then(staff => {
      if (!staff) {
        return res
          .status(404)
          .json({ success: false, message: "Staff user not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Staff user Removed successfully" });
    })
    .catch(err => {
      console.log("Error during remove user action :", err);
    });
};
exports.GET_ALL_STAFF = (req, res, next) => {
  Staff.find()
    .then(staff => {
      if (!staff) {
        return res
          .status(404)
          .json({ succes: false, message: "User not found" });
      }
      return res
        .status(200)
        .json({ succes: true, staff, staffTotals: staff.length });
    })
    .catch(err => {
      res.status(500).json({ Error: "Error during getting all users :", err });
    });
};
exports.GET_STAFF = (req, res, next) => {
  const { id } = req.params;
  Staff.findById(id)
    .then(staff => {
      if (!staff) {
        return res
          .status(404)
          .json({ succes: false, message: "User not found" });
      }
      return res.status(200).json({ succes: true, staff });
    })
    .catch(err => {
      res.status(500).json({ Error: "Error during getting all users :", err });
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
    .populate("_userId", "_id titles status createdAt")
    .exec()
    .then(allDemands => {
      if (allDemands.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Demands Not Found" });
      }
      const demands = allDemands.map(element => {
        const { _id, titles, status, createdAt } = element;
        const statusValue = status ? "Completed" : "Pending";
        const date = new Date(createdAt).toLocaleDateString();
        const title = titles.reduce((acc, e) => {
          if (acc != "") {
            return acc + ", " + e;
          }
          return acc + e;
        }, "");
        return {
          title,
          _id,
          status: statusValue,
          createdAt: date
        };
      });
      res.status(200).json({
        success: true,
        message: "All Demands",
        allDemands: demands,
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
  console.log(status);
  Demand.findById({ _id: id })
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
//Complaints
exports.GET_ALL_COMPLAINTS = (req, res, next) => {
  console.log("Get All complaints");

  Complaint.find()
    .populate(
      "_userId",
      "complaints._id complaint status subject lname fname email createdAt"
    )
    .exec()
    .then(async allComplaints => {
      if (allComplaints.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Complaints Not Found" });
      }
      const complaints = allComplaints.map(element => {
        const { _id, status, subject, complaint, _userId, createdAt } = element;
        if (!_userId) {
          return {
            _id,
            status,
            subject,
            complaint,
            email: null,
            username: null,
            createdAt
          };
        } else {
          const { email, fname, lname } = _userId;
          const username = fname + " " + lname;
          return {
            _id,
            status,
            subject,
            complaint,
            email,
            username,
            createdAt
          };
        }
      });
      res.status(200).json({
        success: true,
        message: "All Complaints",
        allComplaints: complaints,
        totalComplaints: allComplaints.length
      });
    })
    .catch(err => {
      console.log(err);

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
    .populate("_userId", "fname lname email")
    .exec()
    .then(allFeedbacks => {
      console.log(allFeedbacks);

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
    .populate("_userId", "email phone subject query createAt")
    .exec()
    .then(allSupport => {
      if (allSupport.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Support Not Found" });
      }
      const supports = allSupport.map(element => {
        const { phone, subject, query, _userId, createdAt } = element;
        const date = new Date(createdAt).toLocaleDateString();
        if (!_userId) {
          return {
            phone,
            subject,
            query,
            email: null,
            createdAt: date
          };
        } else {
          const { email } = _userId;
          return {
            phone,
            subject,
            query,
            email,
            createdAt: date
          };
        }
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
//Users
exports.UPDATE_USER = (req, res, next) => {
  const { errors, isValid } = validateUserUpdateInput(req.body);
  const { id } = req.params;
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findByIdAndUpdate(id, {
    $set: {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    }
  })
    .exec()
    .then(user => {
      console.log(user);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, Error: "User not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user
      });
    })
    .catch(err => {
      console.log("Error during updated staff :", err);
    });
};
exports.REMOVE_USER = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      user.deleted = true;
      return user.save().then(result => {
        return res
          .status(200)
          .json({ success: true, message: "User Removed successfully" });
      });
    })
    .catch(err => {
      console.log("Error during remove user action :", err);
    });
};
exports.GET_ALL_USER = (req, res, next) => {
  User.find()
    .then(users => {
      if (!users) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      const filteredUsers = users.filter(user => user.deleted === false);
      return res.status(200).json({
        success: true,
        users: filteredUsers,
        usersTotals: users.length
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ Error: "Error during getting all users :", err });
    });
};
exports.GET_USER = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ succes: false, message: "User not found" });
      }
      return res.status(200).json({ succes: true, user });
    })
    .catch(err => {
      res.status(500).json({ Error: "Error during getting user :", err });
    });
};
