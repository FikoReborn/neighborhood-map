import React, { Component } from "react";
import loadjs from "loadjs";
import FilterOptions from "./FilterOptions";
import "./App.css";

class App extends Component {
  state = {
    locations: [],
    counties: [],
    mapLoaded: false
  };

  componentDidMount() {
    loadjs(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCGnAvu4__n-bl-rsNch6sLTHksCDbWJGg&libraries=places",
      this.getData
    );
  }

  getData = () => {
    let parks = [];
    let counties = [];
    fetch("https://data.ny.gov/api/views/9uuk-x7vh/rows.json")
      .then(response => response.json())
      .then(thisJson => {
        thisJson.data.forEach(thisPark => {
          let park = {
            id: thisPark[0],
            title: thisPark[8],
            county: thisPark[11],
            website: thisPark[17][0],
            display: true,
            location: {
              lat: Number(thisPark[21]),
              lng: Number(thisPark[20])
            }
          };
          if (thisPark[9] !== "Other") {
            park.type = thisPark[9];
          } else {
            park.type = "";
          }
          parks.push(park);
        });
        thisJson.meta.view.columns[11].cachedContents.top.forEach(
          thisCounty => {
            counties.push(thisCounty.item);
          }
        );
        this.setState({ counties });
        this.setState({ locations: parks });
        this.initMap();
      });
  };

  filterCounty = county => {
    const locations = this.state.locations;
    locations.forEach(location => {
      if (location.county !== county && county !== "All Counties") {
        location.display = false;
      } else {
        location.display = true;
      }
    });
    this.setState({ locations });
    this.initMap();
  };

  initMap = () => {
    let locations = this.state.locations;
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

    this.map = new window.google.maps.Map(document.getElementById("map"), {
      styles: styles,
      zoom: 7,
      mapTypeControl: false,
      center: {
        lat: 41.7004,
        lng: -73.921
      }
    });

    this.setMarkers(this.map);
  };

  setMarkers = map => {
    const locations = this.state.locations;
    const parksInfoWindow = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();

    for (let i = 0; i < locations.length; i++) {
      let position = locations[i].location;
      let title = locations[i].title + ' ' + locations[i].type;
      if (locations[i].display) {
        let marker = new window.google.maps.Marker({
          map: map,
          position: position,
          title: title,
          animation: window.google.maps.Animation.DROP,
          id: i
        });
        marker.addListener("click", () =>
          this.markerListener(parksInfoWindow, marker, map)
        );
        bounds.extend(marker.position);
      }
    }

    map.fitBounds(bounds);
  };

  markerListener = (parksInfoWindow, marker, map) => {
    if (parksInfoWindow.marker != marker) {
      let geocoder = new window.google.maps.Geocoder();
      let service = new window.google.maps.places.PlacesService(map);
      geocoder.geocode({'location': marker.position}, (results, geocodeStatus) => {
        if (geocodeStatus === 'OK') {
          service.getDetails({placeId:results[0].place_id}, (park, detailsStatus) => {
            if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
              parksInfoWindow.marker = marker;
              parksInfoWindow.setContent("<div><strong>" + marker.title + "</strong><br>" + park.formatted_address + "</div>");
              parksInfoWindow.open(map, marker);
              // Make sure the marker property is cleared if the infowindow is closed.
              parksInfoWindow.addListener("closeclick", function() {
                parksInfoWindow.setMarker = null;
              });
              console.log(park)
            } else {
              console.log('fail')
            }
          })
        }
      })
    }
  };

  findPlaceID = (park, map) => {
    const service = new window.google.maps.places.PlacesService(map);
    service.textSearch({ query: park.title }, (parkInfo, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        park.id = parkInfo[0].place_id;
      } else {
        console.log(status);
      }
    });
  };

  render() {
    return (
      <div className="App">
        <FilterOptions
          locations={this.state.locations}
          counties={this.state.counties}
          filterCounty={this.filterCounty}
        />
        <div className="neighborhood-map" id="map" />
      </div>
    );
  }
}

export default App;
