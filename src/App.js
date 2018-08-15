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
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCGnAvu4__n-bl-rsNch6sLTHksCDbWJGg&libraries=places,geometry",
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

  getFoursquareData = (lat, lng, marker) => {
    fetch(`https://api.foursquare.com/v2/venues/search?client_id=4JHXDI1WSAPJJDMNWR3AZHMFZHAVJBBAW3MT3G45US5KXVQS&client_secret=HSVBUXRQSKYB30IJL510PXHA11QOOFTHPHNR1SNSAWO53WJX&v=20180814&ll=${lat},${lng}`)
      .then(response => response.json())
      .then(data => {
        const parkid = data.response.venues[0].id;
        return fetch(`https://api.foursquare.com/v2/venues/${parkid}?client_id=4JHXDI1WSAPJJDMNWR3AZHMFZHAVJBBAW3MT3G45US5KXVQS&client_secret=HSVBUXRQSKYB30IJL510PXHA11QOOFTHPHNR1SNSAWO53WJX&v=20180814`)
                  .then(details => details.json())
                  .then(parkdetails => {
                      marker.contact = parkdetails.response.venue.contact;
                      marker.rating = parkdetails.response.venue.rating;
                  })
      })
      .catch(error => console.log(error));
  }

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
          website: locations[i].website,
          rating: 0,
          contact: {},
          county: locations[i].county,
          animation: window.google.maps.Animation.DROP,
          id: i
        });
        marker.addListener("click", () => {
          this.markerListener(parksInfoWindow, marker, map, position);
        });
        bounds.extend(marker.position);
      }
    }

    map.fitBounds(bounds);
  };

  markerListener = (parksInfoWindow, marker, map, position) => {
    this.getFoursquareData(position.lat, position.lng, marker);
    let geocoder = new window.google.maps.Geocoder();
    let service = new window.google.maps.places.PlacesService(map);
    let InfoContent = '';
    if (parksInfoWindow.marker !== marker) {
      parksInfoWindow.marker = marker;
      InfoContent = `<strong>${marker.title}</strong>`;
      parksInfoWindow.setContent(`<div class="infowindow"><div class="inner-info">${InfoContent}<p>Loading data...</p></div></div>`);
      parksInfoWindow.open(map, marker);
      parksInfoWindow.addListener("closeclick", function () {
        parksInfoWindow.setMarker = null;
      });
      geocoder.geocode({ 'location': marker.position }, (results, geocodeStatus) => {
        if (geocodeStatus === 'OK') {
          service.getDetails({ placeId: results[0].place_id }, (park, detailsStatus) => {
            if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
              InfoContent += `<p class="address-link"><a href="${park.url}" target="_blank">${park.formatted_address}</a></p>`;
              var nearStreetViewLocation = park.geometry.location;
              var heading = window.google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
              InfoContent += `<p><strong>${marker.county} County</strong></p>`;
              InfoContent += `<p><img src="/Images/Foursquare.png" class="foursquare"> Rating: ${marker.rating} / <sup>10</sup></p>`;
              marker.contact.twitter && (InfoContent += `<p>${marker.contact.twitter}</p>`);
              marker.contact.facebook && (InfoContent += `<p>${marker.contact.facebook}</p>`);
              marker.contact.formattedPhone && (InfoContent += `<p>${marker.contact.formattedPhone}</p>`);
              marker.rating && (InfoContent += `<p class="address-link"><a href="${marker.website}" target="_blank">Website</a>`); 
              parksInfoWindow.setContent(`<div class="infowindow"><div class="inner-info">${InfoContent}</div></div>`);
              document.getElementsByClassName('infowindow')[0].setAttribute('style', `background-image: url("https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${position.lat},${position.lng}&heading=${heading}&pitch=0&radius=3000&key=AIzaSyCGnAvu4__n-bl-rsNch6sLTHksCDbWJGg")`);
            }
          })
        }
      })
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
