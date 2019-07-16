import React, { Component } from 'react';

class LocationInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query1: '',
            query2: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
    handleSubmit(event) {
        event.preventDefault();
        this.props.handleSubmit(this.state.query1, this.state.query2);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Enter first location:
                        <input 
                            name='query1' 
                            type="text" 
                            value={this.state.query1}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Enter second location:
                        <input
                            name='query2'
                            type="text"
                            value={this.state.query2}
                            onChange={this.handleChange}
                            />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            
        );
    }
}

export default LocationInput;