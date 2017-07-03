import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class LeagueSelection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="list js-list">
                <Link className="list__item app js-app" to="/league/nfl">
                    <h2 className="app__title">NFL</h2>
                </Link>
            </div>
        );
    }
}

export default LeagueSelection;