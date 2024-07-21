import React from 'react';  
import { ChakraProvider } from '@chakra-ui/react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Navbar from './components/Navbar';  
import Home from './pages/Home';  
import About from './pages/About';  
import Marketplace from './pages/Marketplace';  
import MyInvestments from './pages/MyInvestments';  
import ListProperty from './pages/ListProperty';  
import Profile from './pages/Profile';  
import customTheme from './theme';  

const App = () => {  
  return (  
    <ChakraProvider theme={customTheme}>  
      <Router>  
        <Navbar />  
        <Routes>  
          <Route path="/" element={<Home />} />  
          <Route path="/about" element={<About />} />  
          <Route path="/marketplace" element={<Marketplace />} />  
          <Route path="/my-investments" element={<MyInvestments />} />  
          <Route path="/list-property" element={<ListProperty />} />  
          <Route path="/profile" element={<Profile />} />  
        </Routes>  
      </Router>  
    </ChakraProvider>  
  );  
};  

export default App;