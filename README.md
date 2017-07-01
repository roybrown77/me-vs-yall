# Me vs Yall

Pick winners of sporting events and compete with others around the world.

https://me-vs-yall.firebaseapp.com

# Tek Stak

Client:

- Progressive Web App capabilities per https://developers.google.com/web/progressive-web-apps/
- React / Redux / Javascript
- Google Material Design

Backend:

- Node / Javascript
- Couchbase

Hosting server:

- Google Firebase

# To run application locally

1. npm install
2. npm start

# To deploy to production

1. open system terminal
2. npm config set prefix '~/.npm-global'
3. export PATH=~/.npm-global/bin:$PATH
4. npm install -g firebase-tools
5. npm run build
6. npm firebase deploy