import React, { Component } from "react";
import loadjs from "loadjs";
import FilterOptions from "./FilterOptions";
import "./App.css";

class App extends Component {
  state = {
    locations: [],
    counties: []
  };

  componentDidMount() {
    loadjs(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCGnAvu4__n-bl-rsNch6sLTHksCDbWJGg",
      this.initMap
    );
    this.getData();
  }

  getData() {
    let parks = [];
    let counties = [];
    fetch('https://data.ny.gov/api/views/9uuk-x7vh/rows.json')
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
        }
        if (thisPark[9] !== 'Other') {
          park.title += ' ' + thisPark[9];
        }
        parks.push(park);
      })
      thisJson.meta.view.columns[11].cachedContents.top.forEach(thisCounty => {
        counties.push(thisCounty.item);
      })
      this.setState({counties});
      this.setState({locations: parks});
    })
  }

  filterCounty = (county) => {
    const locations = this.state.locations;
    locations.forEach(location => {
      if (location.county !== county) {
        location.display = false;
      } else {
        location.display = true;
      }
    })
    this.setState({locations})
    this.initMap();
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
      mapTypeControl: false,
      center: {
        lat: 41.7004,
        lng: -73.921
      }
    });

    for (let i = 0; i < locations.length; i++) {
      let position = locations[i].location;
      let title = locations[i].title;
      if (locations[i].display) {
        let marker = new window.google.maps.Marker({
          map: map,
          position: position,
          title: title,
          animation: window.google.maps.Animation.DROP,
          id: i
        });
      }
    }
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
