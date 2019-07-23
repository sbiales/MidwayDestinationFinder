import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import CurrentLocation from './Map';

const mapStyles = {
  width: '600px',
  height: '600px'
};

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,  //Hides or the shows the infoWindow
        activeMarker: {},          //Shows the active marker upon click
        selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    render() {
        return (
            <CurrentLocation
                centerAroundCurrentLocation
                google={this.props.google}
                initialCenter={this.props.center}
            >
                {this.props.data.map(item => (
                    <Marker
                        title={item.name}
                        name={item.name}
                        position={{ lat: item.lat, lng: item.lng }}
                        onClick={this.onMarkerClick}
                    />
                ))}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div>
                        <h4>{this.state.selectedPlace.name}</h4>
                    </div>
                </InfoWindow>
            </CurrentLocation>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_KEY
})(MapContainer);