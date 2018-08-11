import React, { Component } from "react";
import "./App.css";

class FilterOptions extends Component {
  render() {
    const locations = this.props.locations;
    return (
      <div className="filter-options-container">
        <div className="filter-options-form">
            <input type="text" name="Filter" placeholder="Filter Locations" className="search-field" />
            <ul className='list-locations'>
                {locations.map((thislocation) => (
                    <li key={thislocation.id}>{thislocation.title}</li>
                ))}
            </ul>
        </div>
      </div>
    );
  }
}

export default FilterOptions;
