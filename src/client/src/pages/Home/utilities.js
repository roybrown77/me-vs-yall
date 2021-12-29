import hoodiesBw from '../../styles/images/mvy-hoodie-white-bw.jpg';
import shirts from '../../styles/images/mvy-tee-white-romey.jpg';
import shirtsBw from '../../styles/images/mvy-tee-black-bw.jpg';

import { getRandomIntInclusive } from '../../utilities';

// private

const homePageImages = [
    hoodiesBw,
    shirts,
    shirtsBw
];

// public

const getHomePageEmoji = () => {
    const emojis = ["🏎","💃","🎒","🍄","🌶","🍿","🥊","🚣","🥁","🚗","⛽️","🏖","☎️","🧰","💌","🅰️"];
    return emojis[getRandomIntInclusive(0,emojis.length-1)];
};

const getHomePageImage = () => {
    return homePageImages[getRandomIntInclusive(0,homePageImages.length-1)];
};

export {
    getHomePageImage,
    getHomePageEmoji
};