const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const user = require("../controllers/user");
const staff = require("../controllers/staff");
const file = require("../controllers/file");
const checkAuth = require("../middleware/check-auth");
const upload = require("../config/multer").upload;

// client Routes
router.post("/user", user.REGISTER_USER);
router.post("/user/login", user.LOGIN_USER);
router.get("/user/movies", checkAuth, user.GET_ALL_MOVIES);
router.patch("/user/movies/:id/favourates", checkAuth, user.ADD_FAVOURATE);
router.get("/user/movies/:id/favourates", checkAuth, user.GET_FAVOURATE);
router.patch("/user/movies/rating/:id", checkAuth, user.ADD_MOVIE_RATING);
// checking payment
router.post("/payment/check/:userId", user.checkPayment);
router.get("/payment/list/:userId", user.LIST_PAYMENTS);
router.patch("/payment/status/:id", checkAuth, user.UPDATE_WILL_PAY);
router.post("/user/support/:id", checkAuth, user.ADD_SUPPORT);
router.patch("/payment/details/:id", checkAuth, user.UPDATE_CARD_DETAILS);
router.post("/user/complaint/:id", checkAuth, user.ADD_COMPLAINT);
router.post("/user/feedback/:id", checkAuth, user.ADD_FEEDBACK);
router.post("/user/demand/:id", checkAuth, user.ADD_DEMAND);
router.post("/user/logout", user.LOGOUT_USER);
///////////////////////////////////////////////////

// admin routes
router.get("/files", file.GET_SERVER_FILES);
router.get("/files/audios", file.GET_AUDIO_FILES);
router.get("/files/videos", file.GET_VIDEO_FILES);
router.get("/files/images", file.GET_IMAGE_FILES);
router.post("/files", checkAuth, upload.any(), file.ADD_FILE);

router.post("/admin/login", admin.LOGIN_ADMIN);
router.post("/admin/register", admin.REGISTER_ADMIN);

router.get("/movies", checkAuth, admin.GET_ALL_MOVIES);
router.get("/movies/:id", checkAuth, admin.GET_MOVIE);
router.post("/movies", checkAuth, admin.UPLOAD_MOVIE);
router.patch("/movies/:id", checkAuth, admin.UPDATE_MOVIE);
router.delete("/movies/:id", checkAuth, admin.DELETE_MOVIE);

router.get("/admin/complaint/", checkAuth, admin.GET_ALL_COMPLAINTS);
router.get("/admin/complaint/:id", checkAuth, admin.GET_COMPLAINT);
router.patch("/admin/complaint/:id", checkAuth, admin.MANAGE_STATUS);
router.get("/admin/demand/", checkAuth, admin.GET_ALL_DEMANDS);
router.get("/admin/demand/:id", checkAuth, admin.GET_DEMAND);
router.get("/admin/demandPending/", checkAuth, admin.GET_PENDING_DEMANDS);
router.patch("/admin/demand/:id", checkAuth, admin.UPDATE_DEMAND);
router.get("/admin/feedback/", checkAuth, admin.GET_ALL_FEEDBACK);
router.get("/admin/feedback/:id", checkAuth, admin.GET_ONE_FEEDBACK);
router.patch("/admin/feedback/:id", checkAuth, admin.UPDATE_FEEDBACK);
router.get("/admin/feedback/movie/:id", checkAuth, admin.GET_MOVIE_FEEDBACK);
router.get("/admin/support/", checkAuth, admin.GET_ALL_SUPPORT);
router.get("/admin/support/:id", checkAuth, admin.GET_SUPPORT);

router.post("/staff", checkAuth, admin.REGISTER_STAFF);
router.get("/staff", checkAuth, admin.GET_ALL_STAFF);
router.get("/staff/:id", checkAuth, admin.GET_STAFF);
router.patch("/staff/:id", checkAuth, admin.UPDATE_STAFF);
router.delete("/staff/:id", checkAuth, admin.REMOVE_STAFF);
router.get("/admin/user", checkAuth, admin.GET_ALL_USER);
router.get("/admin/user/:id", checkAuth, admin.GET_USER);
router.patch("/admin/user/:id", checkAuth, admin.UPDATE_USER);
router.delete("/admin/user/:id", checkAuth, admin.REMOVE_USER);

router.post("/staff/login", staff.LOGIN_STAFF);
router.get("/staff/complaint/", checkAuth, staff.GET_ALL_COMPLAINTS);
router.get("/staff/complaint/:id", checkAuth, staff.GET_COMPLAINT);
router.patch("/staff/complaint/:id", checkAuth, staff.MANAGE_STATUS);
router.get("/staff/demand/", checkAuth, staff.GET_ALL_DEMANDS);
router.get("/staff/demand/:id", checkAuth, staff.GET_DEMAND);
router.get("/staff/demandPending/", checkAuth, staff.GET_PENDING_DEMANDS);
router.patch("/staff/demand/:id", checkAuth, staff.UPDATE_DEMAND);
router.get("/staff/feedback/", checkAuth, staff.GET_ALL_FEEDBACK);
router.get("/staff/feedback/:id", checkAuth, staff.GET_ONE_FEEDBACK);
router.patch("/staff/feedback/:id", checkAuth, staff.UPDATE_FEEDBACK);
router.get("/staff/feedback/movie/:id", checkAuth, staff.GET_MOVIE_FEEDBACK);
router.get("/staff/support/", checkAuth, staff.GET_ALL_SUPPORT);
router.get("/staff/support/:id", checkAuth, staff.GET_SUPPORT);

router.patch("/user/:id", checkAuth, user.UPDATE_USER);

router.get("/user/movies/:id", checkAuth, user.GET_MOVIE);

router.get("/user/movies/search/:query", checkAuth, user.SEARCH_MOVIE);

router.get("/user/complaint/", checkAuth, user.GET_ALL_COMPLAINTS);
router.get("/user/complaint/:id", checkAuth, user.GET_COMPLAINT);
router.patch("/user/complaint/:id", checkAuth, user.MANAGE_STATUS);

router.get("/user/feedback/", checkAuth, user.GET_ALL_FEEDBACK);
router.get("/user/feedback/:id", checkAuth, user.GET_ONE_FEEDBACK);
router.patch("/user/feedback/:id", checkAuth, user.UPDATE_FEEDBACK);

router.patch("/user/demand/:id", checkAuth, user.UPDATE_DEMAND);
router.get("/user/demand/:id", checkAuth, user.GET_DEMAND);
router.get("/user/demand/", checkAuth, user.GET_ALL_DEMANDS);
router.get("/user/demandPending/", checkAuth, user.GET_PENDING_DEMANDS);

router.get("/user/support/", checkAuth, user.GET_ALL_SUPPORT);
router.get("/user/support/:id", checkAuth, user.GET_SUPPORT);

router.get("/video/:id", checkAuth, user.STREAM);

module.exports = router;
