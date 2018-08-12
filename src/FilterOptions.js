import React, { Component } from "react";
import "./App.css";

class FilterOptions extends Component {
  render() {
    const { counties, locations, filterCounty } = this.props;
    return (
      <div className="filter-options-container">
        <div className="filter-options-form">
            <input type="text" name="Filter" placeholder="Filter Locations" className="search-field" />
            <select className="filter-counties-list" onChange={(event) => filterCounty(event.target.value)}>
                <option>All Counties</option>
                {counties.map(county => (
                    <option key={county}>{county}</option>
                ))}
            </select>
            <ul className='list-locations'>
                {locations.map(thislocation => (
                    thislocation.display && (
                    <li key={thislocation.id}>{thislocation.title} {thislocation.type}
                    </li>
                    )
                ))}
            </ul>
        </div>
      </div>
    );
  }
}

export default FilterOptions;
