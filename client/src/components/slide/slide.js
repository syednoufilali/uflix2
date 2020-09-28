import React, { Fragment } from "react";
import Card from "../card/card";
import "./slide.css";
import Modal from "../modal/modal";

import ItemsCarousel from "react-items-carousel";
import { SCREEN_SIZES } from "../../util/api";
export default class Slide extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.state = {
      selected: false,
      movie: null,
      activeItemIndex: 0
    };
  }

  settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  openModal = (e, movie) => {
    this.setState({ movie: movie, selected: true }, () => {
      if (window.innerWidth < 768) {
        this.modal.current.style.height = "auto";
      } else {
        this.modal.current.style.height = "80vh";
      }
      this.modal.current.style.width = "auto";
      this.modal.current.style.opacity = "1";
    });
  };
  closeModal = e => {
    this.modal.current.style.height = "0px";
    this.modal.current.style.width = "0px";
    this.modal.current.style.opacity = "0";
    this.setState({ movie: null, selected: false });
  };

  getChevronWidth() {
    const width = window.innerWidth;

    if (width <= SCREEN_SIZES.mobile) {
      return 20;
    } else if (width <= SCREEN_SIZES.hd) {
      return 40;
    } else if (width <= SCREEN_SIZES.fhd) {
      return 60;
    }
  }
  getMovieNumbers() {
    const width = window.innerWidth;

    if (width <= SCREEN_SIZES.mobile) {
      return 1;
    } else if (width <= SCREEN_SIZES.hd) {
      return 6;
    } else if (width <= SCREEN_SIZES.shd) {
      return 6;
    } else if (width <= SCREEN_SIZES.fhd) {
      return 8;
    }
  }

  render() {
    const { title, movies } = this.props;

    const items = movies.map((movie, index) => {
      return (
        <Card
          key={index}
          movie={movie}
          openModal={e => this.openModal(e, movie)}
          favouriteHandler={this.props.favouriteHandler}
        />
      );
    });

    return (
      <Fragment>
        <div className="slide-container">
          <p>{title}</p>
          <div style={{ padding: 0, maxWidth: "100%", margin: "0" }}>
            <ItemsCarousel
              infiniteLoop={false}
              gutter={6}
              activePosition={"center"}
              chevronWidth={this.getChevronWidth()}
              disableSwipe={false}
              alwaysShowChevrons={false}
              numberOfCards={this.getMovieNumbers()}
              slidesToScroll={this.getMovieNumbers()}
              outsideChevron={false}
              showSlither={false}
              firstAndLastGutter={true}
              activeItemIndex={this.state.activeItemIndex}
              requestToChangeActive={value =>
                this.setState({ activeItemIndex: value })
              }
              rightChevron={">"}
              leftChevron={"<"}
              classes={{
                wrapper: "",
                itemsWrapper: "cards",
                itemsInnerWrapper: "",
                itemWrapper: "card",
                rightChevronWrapper: "items-control",
                leftChevronWrapper: "items-control"
              }}
            >
              {[...items, ...items]}
            </ItemsCarousel>
          </div>
        </div>
        {this.state.selected ? (
          <Modal
            context={this.modal}
            closeModal={this.closeModal}
            movie={this.state.movie}
            fetchMovies={this.props.fetchMovies}
          />
        ) : null}
      </Fragment>
    );
  }
}
