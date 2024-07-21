// src/theme.js  
import { extendTheme } from "@chakra-ui/react";  

const customTheme = extendTheme({  
    styles: {  
        global: {  
            "html, body": {  
                backgroundColor: "gray.100",  
                color: "gray.800",  
                fontFamily: "Arial, sans-serif",  
                lineHeight: "1.6",  
                margin: "0",  
                padding: "0",  
            },  
            a: {  
                textDecoration: "none",  
                _hover: {  
                    textDecoration: "underline",  
                },  
            },  
        },  
    },  
    colors: {  
        teal: {  
            500: "#319795",  
        },  
        white: "#ffffff",  
        gray: {  
            100: "#f7fafc",  
            800: "#1a202c",  
        },  
    },  
});  

export default customTheme;