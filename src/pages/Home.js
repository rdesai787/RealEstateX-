// src/pages/Home.js  

import React from 'react';  
import { Box, Image } from '@chakra-ui/react';  

const Home = () => {  
  return (  
    <Box  
      p={5}  
      bgImage="url('/nyc.jpg')"  
      bgPosition="center"  
      bgRepeat="no-repeat"  
      bgSize="cover"  
      color="white"  
      minHeight="100vh"  
      display="flex"  
      alignItems="flex-start"  // Align items to the start (top)  
      justifyContent="flex-start"  // Justify content to the start (left)  
      textAlign="center"  
    >  
      <Box p={10}>  
        <Image src="/logo.png" alt="Real EstateX Logo" />  
      </Box>  
    </Box>  
  );  
};  

export default Home;