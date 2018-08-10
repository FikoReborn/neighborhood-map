import React, { Component } from "react";
import loadjs from 'loadjs';
import "./App.css";

class NeighborhoodMap extends Component {
    componentDidMount() {
        loadjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyCGnAvu4__n-bl-rsNch6sLTHksCDbWJGg', this.initMap)
    }

  initMap = () => {
    new window.google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: {
        lat: this.props.lat,
        lng: this.props.lng
      }
    });
  }

  render() {
    return (
        <div className="gmap" id="map" />
        
    )
  }
}

export default NeighborhoodMap;