# Me vs Yall

Pick winners of sporting events and compete with others around the world.

https://mevsyall.herokuapp.com

![splash 50](https://user-images.githubusercontent.com/1335262/32418040-9d0fe974-c230-11e7-8825-54f90166f5f6.PNG)
![leagues 50](https://user-images.githubusercontent.com/1335262/32418044-a3a7abaa-c230-11e7-9d06-4aa57381d0a9.PNG)
![games 50](https://user-images.githubusercontent.com/1335262/32418048-ab2e3222-c230-11e7-952d-94e5d9b23b8d.PNG)
![login 50](https://user-images.githubusercontent.com/1335262/32418055-b321bed6-c230-11e7-964f-9f7a6ea10cd3.PNG)
![menu 50](https://user-images.githubusercontent.com/1335262/32418057-bb154392-c230-11e7-9830-7532560669b2.PNG)

# Tek Stak
  
*Most choices made in order to increase speed of development and automatically test.

Backend:

- Architected with a composition over inheritance mindset for less code coupling and Domain Driven Design principles to keep api and backing code modules pluggable, testable and scaleable.  Same goes for client.
- Node / Javascript - lightweight and efficient web server
- Auth0 - service based authentication for securing login that is tested on billions of logins instead of reinventing wheel
- MongoDB - document based data storage that allows for schemaless architecture

Client:

- React / Javascript - to build composable user interfaces
- Redux - fast data state management
- ImmutableJs - faster way to avoid mutating data and thus unexpected side effects for less bug prone features
- Auth0 - service based authentication for securing login that is tested on billions of logins instead of reinventing wheel
- Mobile first ui design - to work exceptionally well on phones first in addition to other screen sizes
- Google Material Design - framework to create beautiful, customizable ui components
- Progressive Web App capabilities to be
  1. Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
  2. Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
  3. Engaging - Feel like a natural app on the device, with an immersive user experience.
  4. more info at https://developers.google.com/web/progressive-web-apps/

Hosting server:

- tbd

# To run application locally

1. npm install
2. cd src/client
3. npm install
4. cd ../../
5. npm start