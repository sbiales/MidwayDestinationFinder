import React, { Component } from 'react';
import './App.css';
import LocationInput from './LocationInput';
import MapContainer from './MapContainer';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin1: {
                formatted_address: '',
                lat: '',
                lng: '',
                placeid: '',
                name: ''
            },
            origin2: {
                formatted_address: '',
                lat: '',
                lng: '',
                placeid: '',
                name: ''
            },
            browser: {
                lat: '41.3229056',
                lng: '-73.0988544'
            },
            currentLocation: {
                lat: '41.3229056',
                lng: '-73.0988544'
            },
            data: []
        };
        this.onLocationSubmit = this.onLocationSubmit.bind(this);
    }

    onLocationSubmit(q1, q2) {
        var o1, o2;
        var latlong = 'point:' + this.state.browser.lat + ',' + this.state.browser.lng;
        var url = 'http://127.0.0.1:5000/findLocation?query=' +
            q1 + '&latlong=' + latlong;
        fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            response.json().then(data => {
                console.log(data);
                o1 = data;
                this.setState(prevState => ({
                    origin1: {
                        ...prevState.origin1,
                        formatted_address: o1.formatted_address,
                        lat: o1.geometry.location.lat,
                        lng: o1.geometry.location.lng,
                        placeid: o1.id,
                        name: o1.name
                    }
                }));
            });
        });
        url = 'http://127.0.0.1:5000/findLocation?query=' +
            q2 + '&latlong=' + latlong;
        fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            response.json().then(data => {
                console.log(data);
                o2 = data;
                this.setState(prevState => ({
                    origin2: {
                        ...prevState.origin2,
                        formatted_address: o2.formatted_address,
                        lat: o2.geometry.location.lat,
                        lng: o2.geometry.location.lng,
                        placeid: o2.id,
                        name: o2.name
                    }
                }));
                var midpt = [(this.state.origin1.lat + this.state.origin2.lat) / 2, (this.state.origin1.lng + this.state.origin2.lng) / 2];
                this.setState({currentLocation: {lat: midpt[0], lng: midpt[1]}});
            });
        });
    }

    getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log(position.coords);
                this.setState({
                    browser: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }  
                });
            });
        } else {
            console.log('error');
        }
    };
    
    componentDidMount() {
        this.getGeoLocation();
    }

    render() {
        let latlong = 'point:' + this.state.browser.lat + ',' + this.state.browser.lng;
        let testData = [this.state.origin1, this.state.origin2];
        return (
            <div className="App">
                <LocationInput handleSubmit={this.onLocationSubmit} />
                <p>Origin 1: {this.state.origin1.formatted_address}</p>
                <p>Origin 2: {this.state.origin2.formatted_address}</p>
                <p>Latlong: {latlong}</p>
                <MapContainer center={this.state.currentLocation} data={testData} />
            </div>
        );
    }
}

export default App;
