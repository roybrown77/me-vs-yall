import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Scoreboard from './pages/Scoreboard';
import Leader from './pages/Leader';
import Shop from './pages/Shop';
import OfTheWeek from './pages/OfTheWeek';
import Tips from './pages/Tips';
import Origin from './pages/Origin';
import Contact from './pages/Contact';
import Play from './pages/Play';
import AuthenticationCallback from './pages/AuthenticationCallback';

import ServiceWorkerManager from './ServiceWorkerManager';
import PwaInstallBanner from './components/PwaInstallBanner';

const App = () => {
  return (
    <div className="App">
      {import.meta.env.PROD ? <ServiceWorkerManager /> : null}
      <main>
        <div style={{ height: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scoreboards/:leagueName" element={<Scoreboard />} />
            <Route path="/leaders/:leagueName" element={<Leader />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/oftheweek" element={<OfTheWeek />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/origin" element={<Origin />} />
            <Route path="/play" element={<Play />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/authenticationCallback" element={<AuthenticationCallback />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </main>
      <PwaInstallBanner />
    </div>
  );
};

export default App;
