// src/theme.js  

import { extendTheme } from '@chakra-ui/react';  

const customTheme = extendTheme({  
  styles: {  
    global: {  
      'html, body': {  
        backgroundColor: '#f4f4f4',  
        color: '#333',  
        fontFamily: 'Arial, sans-serif',  
        lineHeight: '1.6',  
        margin: '0',  
        padding: '0',  
        textAlign: 'center'  
      },  
      a: {  
        textDecoration: 'none',  
        _hover: {  
          textDecoration: 'underline',  
        },  
      },  
    },  
  },  
});  

export default customTheme;