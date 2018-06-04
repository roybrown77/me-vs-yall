import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Game from '../components/Game';

import { teams } from '../selectors';

class Games extends Component {
    render() {
        const games = this.props.games;
        const picks = this.props.picks;
        const handleMakePick = this.props.handleMakePick;

        const sortedGames = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
        
        const formattedGames = sortedGames.map((game)=>{
                game.startDateTimeDisplay = moment(new Date(game.startDateTime)).tz('America/New_York').format('dddd MMM D YYYY h:mm a') + ' ET';
                game.stadiumCity = game.overrideStadiumCity ? game.overrideStadiumCity : teams.find(x=>x._id === game.competitors[1]._id).stadiumCity;
                game.stadiumName = game.overrideStadiumName ? game.overrideStadiumName : teams.find(x=>x._id === game.competitors[1]._id).stadiumName;
                game.winner = game.competitors[0].score === game.competitors[1].score ? null : (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)

                game.competitors = game.competitors.map((competitor, index)=> {
                    const team = teams.find(x=>x._id === competitor._id);
                    competitor.shortLocation = team.shortLocation;
                    competitor.name = team.name;
                    competitor.color = team.color;
                    competitor.selected = picks.find(x=>x.gameId === game._id && x.pickId === competitor._id) ? true : false;
                    return competitor;
                });

                return game;
            });

        const rows = formattedGames.map(function(game) {
            const pick = picks.find(x=>x.gameId === game._id);
            return <Game game={game} pick={pick} key={game._id} handleMakePick={handleMakePick}/>;
        });

        return (
            <div>
                {rows}
            </div>
        );
    }
}

Games.propTypes = {
  games: PropTypes.array,
  picks: PropTypes.array,
  handleMakePick: PropTypes.func
};

export default Games;