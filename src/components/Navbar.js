import React from 'react';  
import { Box, Flex, Link, Button } from '@chakra-ui/react';  
import { Link as RouterLink } from 'react-router-dom';  

const Navbar = () => {  
  return (  
    <Box bg="brown.500" p={4}>  
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">  
        <Flex>  
          <Link as={RouterLink} to="/" px={2} color="black" fontWeight="bold">  
            Home  
          </Link>  
          <Link as={RouterLink} to="/marketplace" px={2} color="black" fontWeight="bold">  
            Marketplace  
          </Link>  
          <Link as={RouterLink} to="/my-investments" px={2} color="black" fontWeight="bold">  
            My Investments  
          </Link>  
          <Link as={RouterLink} to="/list-property" px={2} color="black" fontWeight="bold">  
            List Property  
          </Link>  
          <Link as={RouterLink} to="/about" px={2} color="black" fontWeight="bold">  
            About  
          </Link>  
        </Flex>  
        <Button colorScheme="teal" bg="white" color="brown.500">  
          Logout  
        </Button>  
      </Flex>  
    </Box>  
  );  
};  

export default Navbar;