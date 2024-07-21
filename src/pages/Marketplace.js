import React, { useState } from 'react';  
import { Box, Heading, SimpleGrid, Card, CardBody, Text, Stack, Button, Link } from '@chakra-ui/react';  
import { ethers } from 'ethers';  

const property = {  
  id: 1,  
  name: 'Beautiful Home',  
  location: '11432 Marty St, Overland Park, KS 66210',  
  price: '$409,000',  
  zillowUrl: 'https://www.zillow.com/homedetails/11432-Marty-St-Overland-Park-KS-66210/75663850_zpid/',  
};  

// Replace with your actual smart contract address and ABI  
const smartContractAddress = "0xYourSmartContractAddress";  
const smartContractABI = [  
  // Replace with your actual smart contract ABI  
];  

const supportedEnsNetworks = [1, 4]; // Mainnet and Rinkeby  

const Marketplace = () => {  
  const [account, setAccount] = useState(null);  
  const [address, setAddress] = useState('');  
  const [error, setError] = useState('');  
  const [showTokenOptions, setShowTokenOptions] = useState(false);  
  const [selectedTokens, setSelectedTokens] = useState(0);  

  const connectWallet = async () => {  
    try {  
      if (window.ethereum) {  
        const provider = new ethers.BrowserProvider(window.ethereum);  
        await provider.send("eth_requestAccounts", []);  
        const signer = await provider.getSigner();  
        const address = await signer.getAddress();  
        setAccount(address);  
      } else {  
        alert("MetaMask is not installed. Please install MetaMask and try again.");  
      }  
    } catch (error) {  
      console.error(error);  
      alert("Failed to connect wallet.");  
    }  
  };  

  const disconnectWallet = () => {  
    setAccount(null);  
    // Reload the page to ensure complete disconnection  
    window.location.reload();  
  };  

  const handleBuyTokensClick = () => {  
    setShowTokenOptions(true);  
  };  

  const buyTokens = async (numTokens) => {  
    try {  
      if (account) {  
        const provider = new ethers.BrowserProvider(window.ethereum);  
        const network = await provider.getNetwork();  

        if (supportedEnsNetworks.includes(network.chainId)) {  
          try {  
            const ensAddress = await provider.resolveName("example.eth");  
            setAddress(ensAddress);  
            console.log("Resolved address:", ensAddress);  
          } catch (err) {  
            console.warn("ENS resolution failed", err);  
            setError("ENS resolution failed, proceeding without ENS.");  
          }  
        } else {  
          console.warn("ENS is not supported on this network");  
          setError("ENS is not supported on this network, proceeding without ENS.");  
        }  

        const signer = await provider.getSigner();  
        const contract = new ethers.Contract(smartContractAddress, smartContractABI, signer);  

        // Replace with actual contract method call  
        const tx = await contract.buyTokens({  
          value: ethers.parseEther((0.01 * numTokens).toString()), // Example amount per token  
        });  

        await tx.wait(); // Wait for transaction confirmation  
        alert(`Successfully purchased ${numTokens} tokens!`);  
      } else {  
        alert("Please connect your wallet first.");  
      }  
    } catch (error) {  
      console.error("An error occurred:", error);  
      setError(error.message);  
      alert("Failed to buy tokens.");  
    }  
  };  

  return (  
    <Box p={5}>  
      <Heading mb={5}>Marketplace</Heading>  
      <SimpleGrid columns={[1]} spacing={5}>  
        <Card key={property.id} borderWidth="1px" borderRadius="lg" overflow="hidden">  
          <CardBody>  
            <Stack spacing={3}>  
              <Heading size="md">{property.name}</Heading>  
              <Text>{property.location}</Text>  
              <Text fontWeight="bold">{property.price}</Text>  
              <Text fontSize="sm">Listed by: Seller X</Text>  
              <Link href={property.zillowUrl} color="teal.500" isExternal>  
                View on Zillow  
              </Link>  
              <Button colorScheme="teal" variant="solid" onClick={connectWallet}>  
                {account ? "Wallet Connected" : "Connect Wallet"}  
              </Button>  
              <Button colorScheme="red" variant="solid" onClick={disconnectWallet} isDisabled={!account}>  
                Disconnect Wallet  
              </Button>  
              <Button colorScheme="teal" variant="solid" onClick={handleBuyTokensClick} isDisabled={!account}>  
                Buy Tokens  
              </Button>  
              {showTokenOptions && (  
                <Stack spacing={3}>  
                  <Button colorScheme="blue" variant="solid" onClick={() => buyTokens(1)}>  
                    Buy 1 Token (0.01 ETH)  
                  </Button>  
                  <Button colorScheme="blue" variant="solid" onClick={() => buyTokens(5)}>  
                    Buy 5 Tokens (0.05 ETH)  
                  </Button>  
                </Stack>  
              )}  
              {account && <Text fontSize="sm">Connected account: {account}</Text>}  
              {address && <Text fontSize="sm">ENS Resolved Address: {address}</Text>}  
              {error && <Text fontSize="sm" color="red">Error: {error}</Text>}  
            </Stack>  
          </CardBody>  
        </Card>  
      </SimpleGrid>  
    </Box>  
  );  
};  

export default Marketplace;