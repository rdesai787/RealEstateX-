import React, { useState } from 'react';  
import { Box, Heading, Text, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';  
import { ethers } from 'ethers';  
import PropertyNFT from '../artifacts/PropertyNFT.json';  
import axios from 'axios';  

const CONTRACT_ADDRESS = "0x5f38e0c71b4b035edcd2b4daf2f905374cfa47aa";  // Replace with your deployed contract address  
const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwODFkY2EzMC00Y2Y5LTRmYzEtYThmYi01MGQxYmQ4MTEwZDYiLCJlbWFpbCI6InJhZGVzYWVlQGt1LmVkdSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhMGI3ODdjYjUxZTNhZjVhMGE2ZiIsInNjb3BlZEtleVNlY3JldCI6IjFlNWExMWY1NTc0YzM4OTk4NzgyNzZhNWFlMWIxY2I1Mjk2ZDAyMDVhNTY2Y2MyNDAzM2FhMTJmZWY4MTExZWQiLCJleHAiOjE3NTMzMzUxODV9.QZgI4TI2zexlN2IbvcfRcWjR2viLgM2aLDSrB-S9xo0';  // Replace with your Pinata JWT  

const ListProperty = () => {  
    const [address, setAddress] = useState('');  
    const [walletConnected, setWalletConnected] = useState(false);  
    const [certificate, setCertificate] = useState(null);  

    const connectWallet = async () => {  
        if (window.ethereum) {  
            try {  
                const provider = new ethers.BrowserProvider(window.ethereum);  
                const accounts = await provider.send("eth_requestAccounts", []);  
                setAddress(accounts[0]);  
                setWalletConnected(true);  
            } catch (error) {  
                console.error(error);  
            }  
        } else {  
            alert('Please install MetaMask!');  
        }  
    };  

    const handleCertificateChange = (event) => {  
        setCertificate(event.target.files[0]);  
    };  

    const uploadToPinata = async (file) => {  
        const formData = new FormData();  
        formData.append('file', file);  

        const metadata = JSON.stringify({  
            name: file.name,  
            keyvalues: {  
                description: 'Certificate for property listing'  
            }  
        });  

        formData.append('pinataMetadata', metadata);  

        const options = JSON.stringify({  
            cidVersion: 0  
        });  

        formData.append('pinataOptions', options);  

        try {  
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {  
                maxBodyLength: 'Infinity', // Allow infinite size  
                headers: {  
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,  
                    'Authorization': `Bearer ${PINATA_JWT}`  
                }  
            });  

            return response.data;  
        } catch (error) {  
            console.error(error);  
            alert('Failed to upload file to Pinata');  
        }  
    };  

    const handleSubmit = async (event) => {  
        event.preventDefault();  

        if (!certificate) {  
            alert('Please choose a certificate file');  
            return;  
        }  

        const pinataResponse = await uploadToPinata(certificate);  

        if (pinataResponse && pinataResponse.IpfsHash) {  
            const certificateHash = pinataResponse.IpfsHash;  

            if (window.ethereum) {  
                const provider = new ethers.BrowserProvider(window.ethereum);  
                const signer = provider.getSigner();  
                const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyNFT.abi, signer);  

                try {  
                    const tx = await contract.mintProperty(certificateHash, address);  
                    await tx.wait();  
                    alert('Property minted successfully');  
                } catch (error) {  
                    console.error(error);  
                    alert('Failed to mint property');  
                }  
            } else {  
                alert('Ethereum object not found');  
            }  
        }  
    };  

    return (  
        <Box p={5}>  
            <Heading>List Your Property</Heading>  
            <Text mt={4}>Connect your wallet to get started:</Text>  
            <Button onClick={connectWallet} mt={2} mb={4} colorScheme="blue">  
                {walletConnected ? `Connected: ${address}` : 'Connect Wallet'}  
            </Button>  

            <form onSubmit={handleSubmit}>  
                <FormControl id="certificate" isRequired>  
                    <FormLabel>Property Certificate</FormLabel>  
                    <Input type="file" onChange={handleCertificateChange} />  
                </FormControl>  

                <Button mt={4} colorScheme="teal" type="submit">  
                    Mint Property  
                </Button>  
            </form>  
        </Box>  
    );  
};  

export default ListProperty;