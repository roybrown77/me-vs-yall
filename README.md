# Me vs Yall

Pick winners of sporting events and compete with others around the world.

https://mevsyall.herokuapp.com

![splash](https://user-images.githubusercontent.com/1335262/32139207-bdaa6da6-bc10-11e7-854a-c6da6ef8c79f.PNG)
![leagues](https://user-images.githubusercontent.com/1335262/32139195-79fe4046-bc10-11e7-8812-948cf0ebc3ec.PNG)
![games](https://user-images.githubusercontent.com/1335262/32139196-8c9c5706-bc10-11e7-8640-52b4329bb9e6.PNG)
![login](https://user-images.githubusercontent.com/1335262/32139171-f60b2bfa-bc0f-11e7-9ca9-97d48f3da164.PNG)
![menu](https://user-images.githubusercontent.com/1335262/32139198-9c485eca-bc10-11e7-988f-26623caec9a2.PNG)

# Tek Stak
  
Backend:

- Architected with a composition over inheritance mindset for less code coupling and Domain Driven Design principles to keep api and backing code modules pluggable, testable and scaleable.  Same goes for client.
- Node / Javascript - lightweight and efficient web server that is testable, fast and increases speed of development
- Auth0 - service based authentication for securing login that is tested on billions of logins instead of reinventing wheel; increases speed of development
- MongoDB - document based data storage that allows for schemaless architecture for less bug prone features; increases speed of development

Client:

- Mobile first design - to work well on phones exceptionally well in addition to other screen sizes; increases speed of development
- React / Javascript - to build user interfaces that are composable, testable, fast and increases speed of development
- Redux - data state management that is reliable, testable, fast and increases speed of development
- ImmutableJs - avoid mutating data and thus unexpected side effects for less bug prone features and increase speed of application
- Auth0 - service based authentication for securing login that is tested on billions of logins instead of reinventing wheel; increases speed of development
- Google Material Design - framework to create beautiful, customizable ui components; increases speed of development
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