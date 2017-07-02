import React, { Component } from 'react';

class LeagueSelection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <a class="list__item app js-app" href="https://m.flipkart.com/" data-app="flipkart" data-tags="business shopping">
                    <div class="app__wrapper"><h2 class="app__title">Flipkart</h2></div>
                </a>
            </div>
        );
    }
}

export default LeagueSelection;