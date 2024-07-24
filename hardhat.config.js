require("@nomicfoundation/hardhat-toolbox"); 
require("dotenv").config(); 


module.exports = { 
 solidity: { 
   compilers: [ 
     { 
       version: "0.8.24" 
     }, 
     { 
       version: "0.8.9" 
     } 
   ] 
 }, 
 networks: { 
   rinkeby: { 
     url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`, 
     accounts: [process.env.PRIVATE_KEY] 
   } 
 } 
};
