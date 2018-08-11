import React, { Component } from "react";
import "./App.css";

class FilterOptions extends Component {
  render() {
    const { counties, locations } = this.props;
    return (
      <div className="filter-options-container">
        <div className="filter-options-form">
            <input type="text" name="Filter" placeholder="Filter Locations" className="search-field" />
            <select className="filter-counties-list">
                <option>All Counties</option>
                {counties.map(county => (
                    <option>{county}</option>
                ))}
            </select>
            <ul className='list-locations'>
                {locations.map(thislocation => (
                    <li key={thislocation.id}>{thislocation.title}</li>
                ))}
            </ul>
        </div>
      </div>
    );
  }
}

export default FilterOptions;
