import React, { Component } from 'react';

class LocationInput extends Component {

    render() {
        return (
            <div>
                <h3>Enter first location:</h3>
                <input type="text" />
                <h3>Enter second location:</h3>
                <input type="text" />
            </div>
            
        );
    }
}

export default LocationInput;