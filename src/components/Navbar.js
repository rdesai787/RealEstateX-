import React from 'react';  
import { Box, Flex, Link, Button } from '@chakra-ui/react';  
import { Link as RouterLink } from 'react-router-dom';  

const Navbar = () => {  
  return (  
    <Box bg="teal.500" p={4}>  
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">  
        <Flex>  
          <Link as={RouterLink} to="/" px={2} color="white" fontWeight="bold">  
            Home  
          </Link>  
          <Link as={RouterLink} to="/marketplace" px={2} color="white" fontWeight="bold">  
            Marketplace  
          </Link>  
          <Link as={RouterLink} to="/my-investments" px={2} color="white" fontWeight="bold">  
            My Investments  
          </Link>  
          <Link as={RouterLink} to="/list-property" px={2} color="white" fontWeight="bold">  
            List Property  
          </Link>  
          <Link as={RouterLink} to="/profile" px={2} color="white" fontWeight="bold">  
            Profile  
          </Link>  
        </Flex>  
        <Button colorScheme="teal" bg="white" color="teal.500">  
          Logout  
        </Button>  
      </Flex>  
    </Box>  
  );  
};  

export default Navbar;