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
            lat: '',
            long: ''
        };
        this.onLocationSubmit = this.onLocationSubmit.bind(this);
    }

    onLocationSubmit(q1, q2) {
        var o1, o2;
        var latlong = (this.state.lat && this.state.long) ? 'point:' + this.state.lat + ',' + this.state.long : '';
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
            });
        });
    }

    getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log(position.coords);
                this.setState({
                    lat: position.coords.latitude,
                    long: position.coords.longitude
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
        let latlong = 'point:' + this.state.lat + ',' + this.state.long;
        return (
            <div className="App">
                <LocationInput handleSubmit={this.onLocationSubmit} />
                <p>Origin 1: {this.state.origin1.formatted_address}</p>
                <p>Origin 2: {this.state.origin2.formatted_address}</p>
                <p>Latlong: {latlong}</p>
                <MapContainer />
            </div>
        );
    }
}

export default App;
