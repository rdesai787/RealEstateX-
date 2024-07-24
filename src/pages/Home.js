import React from 'react';  
import { Box, Heading, Text } from '@chakra-ui/react';  

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
    >  
      <Heading>Home Page!</Heading>  
      <Text>Welcome to the Home page!</Text>  
    </Box>  
  );  
};  

export default Home;