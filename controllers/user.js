const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
// models
const User = require("../models/Users");
const Movie = require("../models/Movies");
const Complaint = require("../models/Complaints");
const Support = require("../models/Support");
const Demand = require("../models/On-Demand-Movies");
const Feedback = require("../models/Feedback");
const PaymentScehma = require("../models/payments");
const Rating = require("../models/Rating");
const keys = require("../config/keys");
let ONLINE_USERS = [];
const validateRegisterInput = require("../validation/users/register");
const validateUpdateInput = require("../validation/users/update-profile");
exports.REGISTER_USER = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        return res
          .status(409)
          .json({ email: "Email Or Card Number already exists" });
      }
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json({ Error: err });
          } else {
            const { email, fname, lname } = req.body;
            const newUser = new User({
              fname,
              lname,
              email,
              password: hash
            });
            newUser.save().then(user => {
              console.log("New User: ", user);
              res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user
              });
            });
          }
        });
      });
    })
    .catch(err => {
      if (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          // Duplicate username
          return res.status(422).send({
            succes: false,
            message: "User with this profile data is already exist!"
          });
        }
      }
    });
};

exports.LOGIN_USER = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          console.log("Password Matched");
          const payload = {
            id: user.id,
            name: user.name
          };
          return jwt.sign(
            payload,
            keys.secret,
            { expiresIn: 31556926 },
            (err, token) => {
              if (err) console.log(err);
              if (!ONLINE_USERS.includes("" + user._id)) {
                ONLINE_USERS.push("" + user._id);
              } else {
                return res.status(200).json({
                  success: false,
                  message: "Reached Device limit. Logout from other devices"
                });
              }
              console.log(ONLINE_USERS);
              return res.status(200).json({
                success: true,
                message: "Successfully Logged In",
                token: "Bearer" + " " + token,
                currentUser: user
              });
            }
          );
        } else {
          return res
            .status(500)
            .json({ success: false, message: "Password incorrect" });
        }
      });
    });
};

exports.LOGOUT_USER = (req, res, next) => {
  const _id = req.body.user;
  ONLINE_USERS = ONLINE_USERS.filter(id => "" + _id != id);
  console.log(ONLINE_USERS);
  return res.json({
    success: true
  });
};

exports.UPDATE_USER = (req, res, next) => {
  const { errors, isValid } = validateUpdateInput(req.body);
  const { id } = req.params;
  console.log("Request Recieved");
  if (!isValid) {
    res.status(400).json(errors);
  }
  User.findByIdAndUpdate(id)
    .exec()
    .then(user => {
      console.log(id, " is the id of the user");
      if (!user) {
        console.log("user not found");
        return res
          .status(404)
          .json({ success: false, Error: "User not found" });
      }
      // user.password = req.body.password;
      console.log(req.body);
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          console.log(hash);
          console.log(err);
          if (err) {
            console.log("problem with hashing");
            return res.status(500).json({ Error: err });
          } else {
            console.log("User is being updated");
            // const { email, fname, lname } = req.body;

            user.fname = req.body.fname;
            user.lname = req.body.lname;
            user.email = req.body.email;
            user.password = hash;
            console.log(user);
            user.save();
            return res.status(200).json({
              success: true,
              message: "Profile updated successfully",
              user
            });
          }
        });
      });
    })
    .catch(err => {
      if (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          // Duplicate username
          return res.status(422).send({
            succes: false,
            message: "User with this profile data is already exist!"
          });
        }
      }
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
exports.GET_ALL_MOVIES = async (req, res, next) => {
  Movie.find()
    .exec()
    .then(movies => {
      if (!movies) {
        return res
          .status(404)
          .json({ success: false, message: "Movies not found" });
      }
      User.findById(req.userData.id)
        .exec()
        .then(user => {
          const ids = user.favourites.map(m => m._id);
          const newMovies = movies.map(m => {
            if (ids.includes(m._id)) {
              return Object.assign({}, m._doc, { isFav: true });
            } else {
              return Object.assign({}, m._doc, { isFav: false });
            }
          });
          return res.status(200).json({ success: true, movies: newMovies });
        });
    })
    .catch(err => {
      console.log("Getting all movies error :", err);
    });
};

exports.STREAM = function(req, res) {
  const { id } = req.params;
  Movie.findById(id)
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      const path = String(movie.video[0][0]);
      console.log(path);
      console.log("---------------------------------------------");
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    });
};

exports.GET_ALL_COMPLAINTS = (req, res, next) => {
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

exports.GET_ONE_FEEDBACK = (req, res, next) => {
  const { id } = req.params;
  Feedback.findById(id)
    .exec()
    .then(feedback => {
      if (!feedback) {
        return res
          .status(404)
          .json({ success: false, message: "Feedback not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Feedback found", feedback });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
exports.UPDATE_FEEDBACK = (req, res, next) => {
  const { title, review, ratings } = req.body;
  const { id } = req.params;
  Feedback.findById(id)
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

exports.ADD_MOVIE_RATING = async (req, res, next) => {
  const { id } = req.params;
  const { userId, rating } = req.body;
  Movie.findById(id)
    .exec()
    .then(async movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }

      const index = movie.ratingByUsers.findIndex(element => {
        console.log(element);
        return element.user_id == userId;
      });
      console.log(index);

      if (index >= 0) {
        movie.ratingByUsers[index].rating = rating;
      } else {
        const newRating = new Rating.model({
          user_id: userId,
          rating
        });
        movie.ratingByUsers = [...movie.ratingByUsers, newRating];
      }

      const avg = movie.ratingByUsers.reduce((acc, { rating }) => {
        return (acc += parseInt(rating));
      }, 0);

      movie.userRating = avg / movie.ratingByUsers.length;

      await movie.save();

      return res.status(200).json({
        success: true,
        message: "Rating Added",
        movie
      });
    })
    .catch(err => {
      return res.status(404).json({
        success: false,
        message: "Rating can not be added"
      });
    });
};

exports.ADD_COMPLAINT = (req, res, next) => {
  const { subject, complaint } = req.body;
  const { id } = req.params;
  User.findById(id)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      const newComplaint = new Complaint({
        _userId: id,
        subject,
        complaint
      });
      return newComplaint.save();
    })
    .then(result => {
      res.status(200).json({
        success: true,
        message: "Complaint registered successfully : ",
        result
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Complaint registration error :", err });
    });
};
exports.ADD_SUPPORT = (req, res, next) => {
  const { subject, phone, query } = req.body;
  const { id } = req.params;
  User.findById(id)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      const newSupport = new Support({
        _userId: id,
        subject,
        phone,
        query
      });
      return newSupport.save();
    })
    .then(result => {
      res.status(200).json({
        success: true,
        message: "Support registered successfully : ",
        result
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Support registration error :", err });
    });
};
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

exports.ADD_FEEDBACK = (req, res, next) => {
  const { title, review, ratings } = req.body;
  const { id } = req.params;
  User.findById(id)
    .then(result => {
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      if (result) {
        const newFeedback = new Feedback({
          _userId: id,
          title,
          review,
          ratings
        });
        return newFeedback.save();
      }
    })
    .then(result => {
      res
        .status(200)
        .json({ success: true, result, message: "Thanks for your feedback!" });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
exports.GET_ALL_COMPLAINTS = (req, res, next) => {
  Complaint.find()
    .exec()
    .then(allComplaints => {
      if (allComplaints.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Complaints Not Found" });
      }
      res
        .status(200)
        .json({ success: true, message: "All Complaints", allComplaints });
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
exports.ADD_DEMAND = (req, res, next) => {
  const { titles, review } = req.body;
  // console.log(titles);
  const { id } = req.params;
  User.findById(id)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const newDemand = new Demand({
        _userId: id,
        titles,
        review
      });
      return newDemand.save();
    })
    .then(result => {
      return res.status(200).json({
        success: true,
        message: "Demanded Movie registered successfully : ",
        result
      });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ Error: "Demanded Movie registration error :", err });
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

exports.ADD_FAVOURATE = (req, res, next) => {
  const { id } = req.params;
  const { favourites } = req.body;

  User.findByIdAndUpdate(id)
    .exec()
    .then(result => {
      if (!result) {
        return result
          .status(404)
          .json({ success: false, message: "User not Found" });
      }
      result.favourites = favourites;
      result.save();
      res.status(200).json({
        success: true,
        message: "favourites Updated",
        favourites: result.favourites
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "favourites finding error :", err });
    });
};

exports.GET_FAVOURATE = (req, res, next) => {
  const { id } = req.params;
  User.findById({ _id: id })
    .exec()
    .then(result => {
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "User not Found" });
      }
      res.status(200).json({
        success: true,
        message: "favourites Fetched",
        favourites: result.favourites
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "favourites finding error :", err });
    });
};
const Twocheckout = require("2checkout-node");

const sendPayment = (token, _id) => {
  return new Promise((res, rej) => {
    const tco = new Twocheckout({
      apiUser: "sameershk819", // Admin API Username, required for Admin API bindings
      apiPass: "Pakistanzindabad1", // Admin API Password, required for Admin API bindings
      sellerId: "901417254", // Seller ID, required for all non Admin API bindings
      privateKey: "DB26F73B-E38E-43D0-81B7-48A2DC1CDC1C", // Payment API private key, required for checkout.authorize binding
      secretWord: "uflix", // Secret Word, required for response and notification checks
      demo: true, // Set to true if testing response with demo sales
      sandbox: true // Uses 2Checkout sandbox URL for all bindings
    });

    var params = {
      merchantOrderId: _id,
      token: token,
      currency: "USD",
      total: "10.00",
      billingAddr: {
        name: "Testing Tester",
        addrLine1: "123 Test St",
        city: "Columbus",
        state: "Ohio",
        zipCode: "43123",
        country: "USA",
        email: "example@2co.com",
        phoneNumber: "5555555555"
      }
    };

    tco.checkout.authorize(params, (error, data) => {
      if (error) {
        return rej(error);
      } else {
        return res(data);
      }
    });
  });
};

exports.checkPayment = async (req, res, next) => {
  const userId = req.params.userId;
  const token = req.body.token;
  const user = await User.findById(userId).exec();

  const SEVEN_DAYS = 3 * 24 * 60 * 60 * 1000;
  const MONTH = 30 * 24 * 60 * 60 * 1000;
  const isTrial = new Date() - new Date(user.createdAt) < SEVEN_DAYS;
  console.log(isTrial);

  let success = true;
  let message = "";
  if (isTrial) {
    message = "This Account is on Trial Period";
  } else if (user.willPay) {
    let firstTime = user.payments.length == 0;
    let hasPaid;
    if (user.payments.length != 0) {
      const lastPayment = user.payments[user.payments.length - 1];
      hasPaid = new Date() - new Date(lastPayment.createdAt) < MONTH;
    }
    if (firstTime || !hasPaid) {
      message = "Payment has been deducted for this month";
      try {
        const response = await sendPayment(token, user._id);
        const { transactionId, orderNumber } = response.response;
        const newPayment = new PaymentScehma.model({
          transaction_id: transactionId,
          order_number: orderNumber
        });
        user.payments = [...user.payments, newPayment];
        await user.save();
      } catch (error) {
        message =
          "Error deducting payment from the card. Please ensure your card has enough credit";
        success = false;
        return res.json({
          error,
          success,
          user,
          message
        });
      }
    } else {
      message = "User has already Paid their dues";
    }
  } else {
    message = "User need to pay their dues to activate the subscription";
    success = false;
  }
  return res.json({
    success,
    user,
    message
  });
};

module.exports.LIST_PAYMENTS = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).exec();
  return res.json({ success: true, payments: user.payments });
};

exports.UPDATE_CARD_DETAILS = (req, res, next) => {
  const { id } = req.params;
  console.log("----------------------");

  const { cvv, ccNo, expYear, expMonth, willPay } = req.body;
  User.findByIdAndUpdate(id)
    .exec()
    .then(async user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      user.willPay = willPay;
      user.cardNumber = ccNo;
      user.cardExpirationDate = new Date(parseInt(expYear), parseInt(expMonth));
      user.cardCVV = cvv;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
      });
    });
};

exports.UPDATE_WILL_PAY = (req, res, next) => {
  const { id } = req.params;
  const { willPay } = req.body;
  User.findByIdAndUpdate(id)
    .exec()
    .then(async user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, Error: "User not found" });
      }
      user.willPay = willPay;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
      });
    });
};
