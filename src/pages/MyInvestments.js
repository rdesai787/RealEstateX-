import React, { useState, useEffect } from 'react';  
import { Box, Heading, Text, Input, Button, VStack, HStack, useToast, SimpleGrid, Card, CardBody, Stack, Link } from '@chakra-ui/react';  
import { ethers } from 'ethers';  
import { Web3Provider } from '@ethersproject/providers';  
import { formatEther, parseEther } from '@ethersproject/units';  

// Define property information  
const property = {  
  id: 1,  
  name: 'Beautiful Home',  
  location: '11432 Marty St, Overland Park, KS 66210',  
  price: '$409,000',  
  zillowUrl: 'https://www.zillow.com/homedetails/11432-Marty-St-Overland-Park-KS-66210/75663850_zpid/',  
};  

// Smart contract address and ABI  
const smartContractAddress = "0xda6a7701b595bba3ca7411e1551fccd0f4c233ce";  
const smartContractABI = [  
  // Paste the ABI from the provided data  
  {  
    "inputs": [],  
    "stateMutability": "nonpayable",  
    "type": "constructor"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "spender",  
        "type": "address"  
      },  
      {  
        "internalType": "uint256",  
        "name": "allowance",  
        "type": "uint256"  
      },  
      {  
        "internalType": "uint256",  
        "name": "needed",  
        "type": "uint256"  
      }  
    ],  
    "name": "ERC20InsufficientAllowance",  
    "type": "error"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "sender",  
        "type": "address"  
      },  
      {  
        "internalType": "uint256",  
        "name": "balance",  
        "type": "uint256"  
      },  
      {  
        "internalType": "uint256",  
        "name": "needed",  
        "type": "uint256"  
      }  
    ],  
    "name": "ERC20InsufficientBalance",  
    "type": "error"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "approver",  
        "type": "address"  
      }  
    ],  
    "name": "ERC20InvalidApprover",  
    "type": "error"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "receiver",  
        "type": "address"  
      }  
    ],  
    "name": "ERC20InvalidReceiver",  
    "type": "error"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "sender",  
        "type": "address"  
      }  
    ],  
    "name": "ERC20InvalidSender",  
    "type": "error"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "spender",  
        "type": "address"  
      }  
    ],  
    "name": "ERC20InvalidSpender",  
    "type": "error"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "owner",  
        "type": "address"  
      }  
    ],  
    "name": "OwnableInvalidOwner",  
    "type": "error"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "account",  
        "type": "address"  
      }  
    ],  
    "name": "OwnableUnauthorizedAccount",  
    "type": "error"  
  },  
  {  
    "anonymous": false,  
    "inputs": [  
      {  
        "indexed": true,  
        "internalType": "address",  
        "name": "owner",  
        "type": "address"  
      },  
      {  
        "indexed": true,  
        "internalType": "address",  
        "name": "spender",  
        "type": "address"  
      },  
      {  
        "indexed": false,  
        "internalType": "uint256",  
        "name": "value",  
        "type": "uint256"  
      }  
    ],  
    "name": "Approval",  
    "type": "event"  
  },  
  {  
    "anonymous": false,  
    "inputs": [  
      {  
        "indexed": true,  
        "internalType": "address",  
        "name": "previousOwner",  
        "type": "address"  
      },  
      {  
        "indexed": true,  
        "internalType": "address",  
        "name": "newOwner",  
        "type": "address"  
      }  
    ],  
    "name": "OwnershipTransferred",  
    "type": "event"  
  },  
  {  
    "anonymous": false,  
    "inputs": [  
      {  
        "indexed": true,  
        "internalType": "address",  
        "name": "from",  
        "type": "address"  
      },  
      {  
        "indexed": true,  
        "internalType": "address",  
        "name": "to",  
        "type": "address"  
      },  
      {  
        "indexed": false,  
        "internalType": "uint256",  
        "name": "value",  
        "type": "uint256"  
      }  
    ],  
    "name": "Transfer",  
    "type": "event"  
  },  
  {  
    "inputs": [],  
    "name": "TOKENS_PER_ETH",  
    "outputs": [  
      {  
        "internalType": "uint256",  
        "name": "",  
        "type": "uint256"  
      }  
    ],  
    "stateMutability": "view",  
    "type": "function"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "owner",  
        "type": "address"  
      },  
      {  
        "internalType": "address",  
        "name": "spender",  
        "type": "address"  
      }  
    ],  
    "name": "allowance",  
    "outputs": [  
      {  
        "internalType": "uint256",  
        "name": "",  
        "type": "uint256"  
      }  
    ],  
    "stateMutability": "view",  
    "type": "function"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "spender",  
        "type": "address"  
      },  
      {  
        "internalType": "uint256",  
        "name": "value",  
        "type": "uint256"  
      }  
    ],  
    "name": "approve",  
    "outputs": [  
      {  
        "internalType": "bool",  
        "name": "",  
        "type": "bool"  
      }  
    ],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "account",  
        "type": "address"  
      }  
    ],  
    "name": "balanceOf",  
    "outputs": [  
      {  
        "internalType": "uint256",  
        "name": "",  
        "type": "uint256"  
      }  
    ],  
    "stateMutability": "view",  
    "type": "function"  
  },  
  {  
    "inputs": [],  
    "name": "buyTokens",  
    "outputs": [],  
    "stateMutability": "payable",  
    "type": "function"  
  },  
  {  
    "inputs": [],  
    "name": "decimals",  
    "outputs": [  
      {  
        "internalType": "uint8",  
        "name": "",  
        "type": "uint8"  
      }  
    ],  
    "stateMutability": "view",  
    "type": "function"  
  },  
  {  
    "inputs": [],  
    "name": "name",  
    "outputs": [  
      {  
        "internalType": "string",  
        "name": "",  
        "type": "string"  
      }  
    ],  
    "stateMutability": "view",  
    "type": "function"  
  },  
  {  
    "inputs": [],  
    "name": "owner",  
    "outputs": [  
      {  
        "internalType": "address",  
        "name": "",  
        "type": "address"  
      }  
    ],  
    "stateMutability": "view",  
    "type": "function"  
  },  
  {  
    "inputs": [],  
    "name": "renounceOwnership",  
    "outputs": [],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "uint256",  
        "name": "amount",  
        "type": "uint256"  
      }  
    ],  
    "name": "sellTokens",  
    "outputs": [],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": [],  
    "name": "symbol",  
    "outputs": [  
      {  
        "internalType": "string",  
        "name": "",  
        "type": "string"  
      }  
    ],  
    "stateMutability": "view",  
    "type": "function"  
  },  
  {  
    "inputs": [],  
    "name": "totalSupply",  
    "outputs": [  
      {  
        "internalType": "uint256",  
        "name": "",  
        "type": "uint256"  
      }  
    ],  
    "stateMutability": "view",  
    "type": "function"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "to",  
        "type": "address"  
      },  
      {  
        "internalType": "uint256",  
        "name": "value",  
        "type": "uint256"  
      }  
    ],  
    "name": "transfer",  
    "outputs": [  
      {  
        "internalType": "bool",  
        "name": "",  
        "type": "bool"  
      }  
    ],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "from",  
        "type": "address"  
      },  
      {  
        "internalType": "address",  
        "name": "to",  
        "type": "address"  
      },  
      {  
        "internalType": "uint256",  
        "name": "value",  
        "type": "uint256"  
      }  
    ],  
    "name": "transferFrom",  
    "outputs": [  
      {  
        "internalType": "bool",  
        "name": "",  
        "type": "bool"  
      }  
    ],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "newOwner",  
        "type": "address"  
      }  
    ],  
    "name": "transferOwnership",  
    "outputs": [],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": [  
      {  
        "internalType": "address",  
        "name": "to",  
        "type": "address"  
      },  
      {  
        "internalType": "uint256",  
        "name": "amount",  
        "type": "uint256"  
      }  
    ],  
    "name": "transferTokens",  
    "outputs": [],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": [],  
    "name": "getTokenUSDValue",  
    "outputs": [  
      {  
        "internalType": "uint256",  
        "name": "",  
        "type": "uint256"  
      }  
    ],  
    "stateMutability": "pure",  
    "type": "function"  
  }  
];  

const MyInvestments = () => {  
  const [account, setAccount] = useState('');  
  const [balance, setBalance] = useState('');  
  const [usdValue, setUsdValue] = useState('');  
  const [buyAmount, setBuyAmount] = useState('');  
  const [sellAmount, setSellAmount] = useState('');  
  const [error, setError] = useState('');  
  const toast = useToast();  

  const connectWallet = async () => {  
    try {  
      if (window.ethereum) {  
        const provider = new Web3Provider(window.ethereum);  
        await provider.send("eth_requestAccounts", []);  
        const signer = provider.getSigner();  
        const address = await signer.getAddress();  
        setAccount(address);  
        const tokenContract = new ethers.Contract(smartContractAddress, smartContractABI, signer);  
        const balance = await tokenContract.balanceOf(address);  
        setBalance(formatEther(balance));  
        const tokenUSDValue = await tokenContract.getTokenUSDValue();  
        setUsdValue((balance / 1e18) * tokenUSDValue);  
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
    setBalance('');  
    setUsdValue('');  
    window.location.reload();  
  };  

  const buyTokens = async (numTokens) => {  
    try {  
      if (account) {  
        const provider = new Web3Provider(window.ethereum);  
        const signer = provider.getSigner();  
        const contract = new ethers.Contract(smartContractAddress, smartContractABI, signer);  

        const tx = await contract.buyTokens({  
          value: parseEther((0.01 * numTokens).toString()),  
        });  

        await tx.wait();  
        alert(`Successfully purchased ${numTokens} tokens!`);  
        const newBalance = await contract.balanceOf(account);  
        setBalance(formatEther(newBalance));  
        const tokenUSDValue = await contract.getTokenUSDValue();  
        setUsdValue((newBalance / 1e18) * tokenUSDValue);  
      } else {  
        alert("Please connect your wallet first.");  
      }  
    } catch (error) {  
      console.error("An error occurred:", error);  
      setError(error.message);  
      alert("Failed to buy tokens.");  
    }  
  };  

  const sellTokens = async (numTokens) => {  
    try {  
      if (account) {  
        const provider = new Web3Provider(window.ethereum);  
        const signer = provider.getSigner();  
        const contract = new ethers.Contract(smartContractAddress, smartContractABI, signer);  
        
        const tx = await contract.sellTokens(parseEther(numTokens.toString()));  
        await tx.wait();  
        
        alert(`Successfully sold ${numTokens} tokens!`);  
        const newBalance = await contract.balanceOf(account);  
        setBalance(formatEther(newBalance));  
        const tokenUSDValue = await contract.getTokenUSDValue();  
        setUsdValue((newBalance / 1e18) * tokenUSDValue);  
      } else {  
        alert("Please connect your wallet first.");  
      }  
    } catch (error) {  
      console.error("An error occurred:", error);  
      setError(error.message);  
      alert("Failed to sell tokens.");  
    }  
  };  

  return (  
    <Box p={5}>  
      <Heading mb={4}>My Investments</Heading>  
      <VStack spacing={4} align="stretch">  
        <HStack>  
          <Button colorScheme="teal" onClick={connectWallet}>  
            {account ? "Wallet Connected" : "Connect Wallet"}  
          </Button>  
          <Button colorScheme="red" onClick={disconnectWallet} isDisabled={!account}>  
            Disconnect Wallet  
          </Button>  
        </HStack>  
        {account && <>  
          <Text>Connected Account: {account}</Text>  
          <Text>Token Balance: {balance}</Text>  
          <Text>USD Value: ${usdValue}</Text>  
        </>}  
      </VStack>  

      <SimpleGrid columns={[1]} spacing={5} mt={5}>  
        <Card key={property.id} borderWidth="1px" borderRadius="lg" overflow="hidden">  
          <CardBody>  
            <Stack spacing={3}>  
              <Heading size="md">{property.name}</Heading>  
              <Text>{property.location}</Text>  
              <Text fontWeight="bold">{property.price}</Text>  
              <Link href={property.zillowUrl} color="teal.500" isExternal>  
                View on Zillow  
              </Link>  

              <Button colorScheme="teal" variant="solid" onClick={() => buyTokens(1)} isDisabled={!account}>  
                Buy 1 Token for $1000  
              </Button>  
              <Button colorScheme="teal" variant="solid" onClick={() => buyTokens(5)} isDisabled={!account}>  
                Buy 5 Tokens for $5000  
              </Button>  

              <HStack>  
                <Input  
                  placeholder="Amount to sell"  
                  value={sellAmount}  
                  onChange={(e) => setSellAmount(e.target.value)}  
                />  
                <Button colorScheme="red" variant="solid" onClick={() => sellTokens(sellAmount)} isDisabled={!account}>  
                  Sell Tokens  
                </Button>  
              </HStack>  

              {account && <Text fontSize="sm">Connected account: {account}</Text>}  
              {error && <Text fontSize="sm" color="red.500">{error}</Text>}  
            </Stack>  
          </CardBody>  
        </Card>  
      </SimpleGrid>  
    </Box>  
  );  
};  

export default MyInvestments;