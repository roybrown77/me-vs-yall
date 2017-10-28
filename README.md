# Me vs Yall

Pick winners of sporting events and compete with others around the world.

https://mevsyall.herokuapp.com

![splash copy](https://user-images.githubusercontent.com/1335262/32139228-1ef99780-bc11-11e7-9693-a9ea7325236b.PNG)
![leagues copy](https://user-images.githubusercontent.com/1335262/32139231-244ea45a-bc11-11e7-8e06-3096a87bbb4a.PNG)

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