import React, { Component } from "react";
import "./video.css";
import "./input.css";
import { url } from "../../util/api";

export class Video extends Component {
  constructor(props) {
    super(props);
    this.player = React.createRef();
    this.audio = React.createRef();
    this.progress = React.createRef();
    this.div = React.createRef();
    this.state = {
      playing: false,
      videos: [],
      languages: [],
      fullscreen: false,
      duration: 0
    };
  }

  async componentDidMount() {
    this.setState(
      {
        languages: this.props.languages.map(language => {
          return {
            audio: url + "/" + language.audio,
            language: language.language
          };
        }),
        videos: this.props.videos.map(video => {
          return {
            video: url + "/" + video.video,
            resolution: video.resolution
          };
        })
      },
      () => {
        if (this.player.current && this.audio.current) {
          this.setState({
            duration: this.player.current.duration
          });
          this.player.current.src = this.state.videos[0].video;
          this.audio.current.src = this.state.languages[0].audio;
        }
      }
    );
  }
  play = () => {
    if (this.player.current.paused) {
      this.player.current.play();
      this.audio.current.play();
      this.setState({ playing: !this.state.playing });
    } else if (this.player.current.played) {
      this.player.current.pause();
      this.audio.current.pause();
      this.setState({ playing: !this.state.playing });
    }
  };
  onChangeResolution = e => {
    const currentTime = this.player.current.currentTime;
    this.player.current.src = e.target.value;
    this.player.current.currentTime = currentTime;
    this.audio.current.currentTime = currentTime;
    this.changeDuration();
    this.setState({ playing: true });
    this.player.current.play();
    this.audio.current.play();
  };
  onChangeLanguage = e => {
    const currentTime = this.player.current.currentTime;
    this.audio.current.src = e.target.value;
    this.audio.current.currentTime = currentTime;
    this.setState({ playing: true });
    this.player.current.play();
    this.audio.current.play();
  };
  changeTime = value => {
    this.player.current.currentTime = value;
    this.audio.current.currentTime = value;
  };
  changeVolume = value => {
    this.audio.current.volume = value / 100;
  };
  fullscreen = () => {
    if (!this.state.fullscreen) {
      if (this.div.current.requestFullscreen) {
        this.div.current.requestFullscreen();
      } else if (this.div.current.mozRequestFullScreen) {
        this.div.current.mozRequestFullScreen();
      } else if (this.div.current.webkitRequestFullscreen) {
        this.div.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    this.setState({
      fullscreen: !this.state.fullscreen
    });
  };
  changeDuration = () => {
    this.progress.current.value = this.player.current.currentTime;
  };
  onChangeDuration = () => {
    this.setState({
      duration: this.player.current.duration
    });
    this.progress.current.currentTime = this.player.current.currentTime;
  };

  waiting = () => {
    this.audio.current.pause();
  };
  playing = () => {
    this.audio.current.play();
  };
  render() {
    const resolutions = this.state.videos.map(element => {
      return <option value={element.video}>{element.resolution}</option>;
    });
    const languages = this.state.languages.map(element => {
      return <option value={element.audio}>{element.language}</option>;
    });

    return (
      <div ref={this.div} className="player">
        <video
          onContextMenu={e => {
            e.preventDefault();
          }}
          onWaiting={this.waiting}
          onPlaying={this.playing}
          poster={this.props.poster}
          className="player-video"
          onTimeUpdate={this.changeDuration}
          muted
          height="720"
          width="720"
          onDurationChange={this.onChangeDuration}
          ref={this.player}
        ></video>
        <audio defaultValue={100} ref={this.audio}></audio>
        <div className="player-controls">
          {this.state.playing ? (
            <ion-icon
              style={{ fontSize: "40px" }}
              className="icon"
              name="pause"
              onClick={this.play}
            ></ion-icon>
          ) : (
            <ion-icon
              style={{ fontSize: "40px" }}
              className="icon"
              name="play"
              onClick={this.play}
            ></ion-icon>
          )}

          <ion-icon
            className="icon"
            style={{ color: "#FFF", fontSize: "40px" }}
            name="volume-high"
          ></ion-icon>
          <input
            className="audio-bar slider"
            onInput={e => {
              this.changeVolume(e.target.value);
            }}
            onChange={e => {
              this.changeVolume(e.target.value);
            }}
            defaultValue={100}
            min={0}
            max={100}
            type="range"
          />
          <ion-icon
            className="icon"
            style={{ color: "#FFF", fontSize: "40px" }}
            name="film"
          ></ion-icon>
          <input
            className="video-bar slider"
            ref={this.progress}
            onInput={e => {
              this.changeTime(e.target.value);
            }}
            onChange={e => {
              this.changeTime(e.target.value);
            }}
            min={0}
            max={this.state.duration ? this.state.duration : 0}
            type="range"
          />

          <select onChange={this.onChangeResolution}>{resolutions}</select>
          <select onChange={this.onChangeLanguage}>{languages}</select>
          <ion-icon
            style={{ fontSize: "40px" }}
            className="icon"
            name="expand"
            onClick={this.fullscreen}
          ></ion-icon>
        </div>
        <div className="player-back">
          <ion-icon name="arrow-back" onClick={this.props.back}></ion-icon>
        </div>
      </div>
    );
  }
}
export default Video;
