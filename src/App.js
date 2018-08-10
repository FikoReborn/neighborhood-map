import React, { Component } from "react";
import loadjs from 'loadjs';
import "./App.css";

class App extends Component {
    componentDidMount() {
        loadjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyCGnAvu4__n-bl-rsNch6sLTHksCDbWJGg', this.initMap)
    }

  initMap = () => {
    new window.google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: {
        lat: 42.0776,
        lng: -73.9529
      }
    });
  }

  render() {
    return (
      <div class="App">
        <div className="gmap" id="map" />
      </div>  
    )
  }
}

export default App;