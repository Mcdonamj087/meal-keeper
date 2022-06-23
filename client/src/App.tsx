import React, {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';

import 'styles/global/index.css';

import Home from 'pages/Home';
import About from 'pages/About';
import NavBar from 'components/NavBar';

const App = () => {
  useEffect(() => {
    /* using global google from gis script loaded to index.html */
    console.log(window.google);
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;
