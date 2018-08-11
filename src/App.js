import React, { Component } from "react";
import loadjs from "loadjs";
import FilterOptions from "./FilterOptions";
import "./App.css";

class App extends Component {
  state = {
    locations: [
      {
        title: "Bear Mountain State Park",
        location: {
          lat: 41.2846,
          lng: -74.0006
        }
      },
      {
        title: "Blauvelt State Park",
        location: {
          lat: 41.0715,
          lng: -73.9389
        }
      },
      {
        title: "Clarence Fahnestock Memorial State Park",
        location: {
          lat: 41.4657,
          lng: -73.8364
        }
      },
      {
        title: "Clermont State Park",
        location: {
          lat: 42.0828,
          lng: -73.9051
        }
      },
      {
        title: "High Tor State Park",
        location: {
          lat: 41.1908,
          lng: -73.9819
        }
      },
      {
        title: "Hook Mountain State Park",
        location: {
          lat: 41.1279,
          lng: -73.9123
        }
      },
      {
        title: "James Baird State Park",
        location: {
          lat: 41.686,
          lng: -73.7917
        }
      },
      {
        title: "Lake Taghkanic State Park",
        location: {
          lat: 42.0954,
          lng: -73.7134
        }
      },
      {
        title: "Mohansic State Park",
        location: {
          lat: 41.2821,
          lng: -73.8082
        }
      },
      {
        title: "Norrie State Park",
        location: {
          lat: 41.8413,
          lng: -73.9404
        }
      },
      {
        title: "Rockland Lake State Park",
        location: {
          lat: 41.1466,
          lng: -73.9184
        }
      },
      {
        title: "Stony Point State Park",
        location: {
          lat: 41.2413,
          lng: 73.9735
        }
      },
      {
        title: "Storm King State Park",
        location: {
          lat: 41.4318,
          lng: -73.9973
        }
      },
      {
        title: "Taconic State Park",
        location: {
          lat: 42.1221,
          lng: -73.5154
        }
      },
      {
        title: "Tallman Mountain State Park",
        location: {
          lat: 41.0305,
          lng: -73.914
        }
      },
      {
        title: "Vanderbilt Mansion National Historic Site",
        location: {
          lat: 41.7963,
          lng: -73.9424
        }
      }
    ]
  };

  componentDidMount() {
    loadjs(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCGnAvu4__n-bl-rsNch6sLTHksCDbWJGg",
      this.initMap
    );
  }

  initMap = () => {
    const locations = this.state.locations;
    // Style made by Aiziel Nazario and posted to snazzymaps.com
    // https://snazzymaps.com/style/137900/green
    const styles = [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#ffffff"
          }
        ]
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
          {
            visibility: "on"
          },
          {
            color: "#3e606f"
          },
          {
            weight: 2
          },
          {
            gamma: 0.84
          }
        ]
      },
      {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            weight: 0.6
          },
          {
            color: "#313536"
          }
        ]
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
          {
            color: "#44a688"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#13876c"
          }
        ]
      },
      {
        featureType: "poi.attraction",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#f5e4e4"
          },
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.attraction",
        elementType: "labels",
        stylers: [
          {
            visibility: "on"
          },
          {
            lightness: "14"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#13876c"
          },
          {
            visibility: "simplified"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#067372"
          },
          {
            lightness: "-20"
          }
        ]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
          {
            color: "#357374"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#004757"
          }
        ]
      }
    ];

    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 9,
      styles: styles,
      center: {
        lat: 41.7004,
        lng: -73.921
      }
    });

    for (let i = 0; i < locations.length; i++) {
      let position = locations[i].location;
      let title = locations[i].title;
      let marker = new window.google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        id: i
      });
    }
  };

  render() {
    return (
      <div className="App">
        <FilterOptions locations={this.state.locations} />
        <div className="neighborhood-map" id="map" />
      </div>
    );
  }
}

export default App;
