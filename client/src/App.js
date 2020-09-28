import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import SideBar from "./components/sidebar/sidebar";
import Movie from "./pages/movie";
import Home from "./pages/home";
import Error404 from "./pages/404";
import Loader from "./components/loader/loader";
import DemandMovies from "./pages/demandMovies";
import Support from "./pages/support";
import Complaint from "./pages/complaint";
import Feedback from "./pages/feedback";
import Account from "./pages/account";
import Grid from "./pages/grid";
import Policy from "./pages/privacy";
import RefundPolicy from "./pages/refund";
import Footer from "./components/footer/footer";
import { withAlert } from "react-alert";
import { api, url, getToken, getUser, setUser } from "./util/api";
import Ham from "./components/hamburger-menu/hamburger-menu";
import "./app.css";
import termOfUse from "./pages/termOfUse";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.navbar = React.createRef();
    this.state = {
      movies: [],
      search: "",
      user: null,
      isBlock: false,
      isLoading: true,
    };
  }

  clearNavbarContext = () => {
    this.navbar = null;
  };

  setAppUser = (newUser) => {
    this.setState({ user: newUser });
  };
  clearSearch = () => {
    this.setState({ search: "" });
  };

  getSearchResults = (movies, searchText) => {
    if (searchText == "") return movies;
    const filteredMovies = movies.filter((m) =>
      m.title.toLowerCase().includes(this.state.search)
    );
    console.log(filteredMovies);
    return filteredMovies;
  };

  change = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });

    let filterCopy = [...this.state.movies].filter((m) =>
      m.title.toLowerCase().includes(this.state.search)
    );
    if (!filterCopy.length) {
      this.setState({
        filteredMovies: [],
      });
    } else {
      this.setState({
        filteredMovies: filterCopy,
      });
    }
  };

  fetchMovies = async () => {
    const token = getToken();
    const response = await api.get("/user/movies", {
      headers: {
        authorization: token,
      },
    });
    const movies = response.data.movies.map(
      ({
        _id,
        cast,
        description,
        genre,
        image,
        title,
        language,
        video,
        trailer,
        artwork,
        rating,
        isFav,
        type,
        ratingByUsers,
        userRating,
      }) => {
        return {
          _id,
          cast,
          description,
          genre,
          imgLink: url + "/" + image,
          title,
          language,
          video,
          trailer,
          artwork,
          rating,
          isFav,
          type,
          ratingByUsers,
          userRating,
        };
      }
    );
    this.setState({
      movies: movies,
      isLoading: false,
    });
  };

  getFavMovies = () => {
    return this.state.movies.filter((m) => m.isFav);
  };
  getFilteredMovies = (type) => {
    return this.state.movies.filter((m) => m.type == type);
  };

  favouriteHandler = async (event, movie) => {
    const userId = getUser()._id;
    const token = getToken();
    const response = await api.get(`/user/movies/${userId}/favourates`, {
      headers: {
        authorization: token,
      },
    });
    let data = response.data.favourites;
    let changeMovies = [...this.state.movies];
    if (
      data.filter((e) => e._id == movie._id).length === 0 ||
      data.length == 0
    ) {
      console.log("hua ");

      data.push(Object.assign({}, movie));

      changeMovies = changeMovies.map((m) => {
        if (m._id == movie._id) m.isFav = true;
        return m;
      });
    } else {
      data = data.filter((e) => e._id !== movie._id);
      changeMovies = changeMovies.map((m) => {
        if (m._id == movie._id) m.isFav = false;
        return m;
      });
    }
    this.setState({ movies: changeMovies });
    try {
      await api.patch(
        `/user/movies/${userId}/favourates`,
        {
          favourites: data,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
    } catch (error) {
      console.log("error ", error);
    }
  };

  async componentWillMount() {
    const user = getUser();
    const token = getToken();
    this.setState({ user: user });
    // const args = {
    //   sellerId: "901417254",
    //   publishableKey: "EB4FDCF8-45C9-47BF-9E2A-2745A6405827",
    //   ccNo: "" + user.cardNumber,
    //   expMonth: "" + (new Date(user.cardExpirationDate).getMonth() + 1),
    //   expYear: "" + new Date(user.cardExpirationDate).getFullYear(),
    //   cvv: "" + user.cardCVV
    // };
    // await window.TCO.loadPubKey("sandbox", async () => {
    //   await window.TCO.requestToken(
    //     async data => {
    //       try {
    //         const response = await api.post(
    //           "/payment/check/" + user._id,
    //           { token: data.response.token.token },
    //           {
    //             headers: {
    //               authorization: token
    //             }
    //           }
    //         );
    //         if (response.data.success) {
    //           this.props.alert.success(response.data.message);
    //         } else {
    //           this.props.alert.error(response.data.message);
    //         }
    //         this.setState({ user: response.data.user });
    //         setUser(response.data.user);
    //         console.log(response.data);
    //         this.setState({ isBlock: !response.data.success });
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     },
    //     err => {
    //       console.log(args);
    //     },
    //     args
    //   );
    // });
  }

  navScroll = () => {
    if (!this.state.isBlock) {
      let height = this.navbar.current.getBoundingClientRect().height;
      const isTop = window.scrollY > height;
      if (isTop) {
        this.navbar.current.classList.add("dark");
      } else {
        this.navbar.current.classList.remove("dark");
      }
    }
  };

  componentWillUnmount() {
    document.removeEventListener("scroll", this.navScroll);
  }

  componentDidMount = async () => {
    const token = getToken();
    document.addEventListener("scroll", this.navScroll);
    const response = await api.get("/user/movies", {
      headers: {
        authorization: token,
      },
    });
    const movies = response.data.movies.map(
      ({
        _id,
        cast,
        description,
        genre,
        image,
        title,
        language,
        video,
        trailer,
        artwork,
        rating,
        isFav,
        type,
        ratingByUsers,
        userRating,
      }) => {
        return {
          _id,
          cast,
          description,
          genre,
          imgLink: url + "/" + image,
          title,
          language,
          video,
          trailer,
          artwork,
          rating,
          isFav,
          type,
          ratingByUsers,
          userRating,
        };
      }
    );
    this.setState({
      movies: movies,
      isLoading: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Loader></Loader>
        ) : (
          <React.Fragment>
            {!this.state.isBlock && (
              <div className="app">
                <SideBar
                  navbarContext={this.navbar}
                  change={this.change}
                  signout={this.props.signout}
                  username={this.state.user.fname + " " + this.state.user.lname}
                  clearContext={this.clearNavbarContext}
                  clearSearch={this.clearSearch}
                  searchValue={this.state.search}
                />
                <Ham
                  navbarContext={this.navbar}
                  change={this.change}
                  signout={this.props.signout}
                  username={this.state.user.fname + " " + this.state.user.lname}
                  clearContext={this.clearNavbarContext}
                  clearSearch={this.clearSearch}
                  searchValue={this.state.search}
                ></Ham>
                {this.state.search ? (
                  <Grid
                    movies={this.getSearchResults(
                      this.state.movies,
                      this.state.search
                    )}
                    favouriteHandler={this.favouriteHandler}
                    navbar={this.navbar}
                    fetchMovies={this.fetchMovies}
                  ></Grid>
                ) : (
                  <div className="screen">
                    <Switch>
                      <Route exact path="/">
                        <Home
                          movies={this.state.movies}
                          favouriteHandler={this.favouriteHandler}
                          fetchMovies={this.fetchMovies}
                        ></Home>
                      </Route>
                      <Route
                        exact
                        path="/demand-movies"
                        component={DemandMovies}
                      />
                      <Route exact path="/support" component={Support} />
                      <Route exact path="/complaint" component={Complaint} />
                      <Route exact path="/movie" component={Movie} />
                      <Route exact path="/feedback" component={Feedback} />
                      <Route exact path="/policy" component={Policy} />
                      <Route
                        exact
                        path="/refund_policy"
                        component={RefundPolicy}
                      />
                      <Route exact path="/term_of_use" component={termOfUse} />
                      <Route exact path="/account">
                        <Account
                          setAppUser={this.setAppUser}
                          user={this.state.user}
                        ></Account>
                      </Route>
                      <Route exact path="/movies">
                        <Grid
                          movies={this.getFilteredMovies("Movie")}
                          favouriteHandler={this.favouriteHandler}
                          navbar={this.navbar}
                          name={"Movies"}
                          fetchMovies={this.fetchMovies}
                        ></Grid>
                      </Route>
                      <Route exact path="/tvshows">
                        <Grid
                          movies={this.getFilteredMovies("TV Show")}
                          favouriteHandler={this.favouriteHandler}
                          navbar={this.navbar}
                          name={"TV Shows"}
                          fetchMovies={this.fetchMovies}
                        ></Grid>
                      </Route>
                      <Route exact path="/favourite">
                        <Grid
                          name={"Favourites"}
                          movies={this.getFavMovies()}
                          favouriteHandler={this.favouriteHandler}
                          navbar={this.navbar}
                          fetchMovies={this.fetchMovies}
                        ></Grid>
                      </Route>
                      <Route exact path="">
                        <Error404></Error404>
                      </Route>
                    </Switch>
                  </div>
                )}
                <Footer clearSearch={this.clearSearch} />
              </div>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(withAlert()(App));
