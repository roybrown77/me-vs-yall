import './styles/App.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import useSyncServiceWorker from './hooks/useSyncServiceWorker';

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

const container = document.getElementById('root');
const root = createRoot(container);

// Legacy cleanup: spread/arcade modes are now query-param driven.
try {
  localStorage.removeItem('spreadModeToggle');
  localStorage.removeItem('arcadeModeToggle');
} catch (e) {
  // ignore
}

const AppRoot = () => {
  useSyncServiceWorker();

  return (
    <div className="App">
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
    </div>
  );
};

root.render(
  <BrowserRouter>
    <AppRoot />
  </BrowserRouter>
);