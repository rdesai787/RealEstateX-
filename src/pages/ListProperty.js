import React, { useState } from 'react';  
import { Web3Provider } from '@ethersproject/providers';  
import { Contract } from '@ethersproject/contracts';  
import { parseUnits } from '@ethersproject/units';  
import axios from 'axios';  
import { Button, FormControl, FormLabel, Input, Box, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';  
import PropertyNFT from '../artifacts/contracts/PropertyNFT.json';  

const ListProperty = () => {  
    const [certificate, setCertificate] = useState(null);  
    const [price, setPrice] = useState('');  
    const [ownershipPercentage, setOwnershipPercentage] = useState('');  
    const [role, setRole] = useState('homeowner'); // Default role  
    const [message, setMessage] = useState('');  
    const [mintedToken, setMintedToken] = useState(null);  

    const contractAddress = "0x9229786aace00760e2906f2fc9d504bb7483ddcd";  
    const provider = new Web3Provider(window.ethereum);  
    const signer = provider.getSigner();  
    const contract = new Contract(contractAddress, PropertyNFT.abi, signer);  

    const handleCertificateChange = (e) => {  
        setCertificate(e.target.files[0]);  
    };  

    const handlePriceChange = (e) => {  
        setPrice(e.target.value);  
    };  

    const handleOwnershipPercentageChange = (e) => {  
        setOwnershipPercentage(e.target.value);  
    };  

    const handleRoleChange = (value) => {  
        setRole(value);  
    };  

    const uploadToPinata = async (file) => {  
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;  
        let data = new FormData();  
        data.append('file', file);  

        try {  
            const res = await axios.post(url, data, {  
                maxBodyLength: 'Infinity',  
                headers: {  
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,  
                    'pinata_api_key': 'b6b9457705f0a7883bcf',  
                    'pinata_secret_api_key': '75eb3c856f5b6100b2233d3cacca374f483f29cc127551e3d18df6cb39cd771e'  
                    // Alternatively, you can use JWT for a more secure approach:  
                    // 'Authorization': `Bearer ${YOUR_JWT_TOKEN}`  
                }  
            });  

            return res.data.IpfsHash;  
        } catch (error) {  
            console.error('Error uploading to Pinata:', error);  
            throw new Error('Failed to upload to Pinata');  
        }  
    };  

    const handleSubmit = async (e) => {  
        e.preventDefault();  

        try {  
            const certificateHash = await uploadToPinata(certificate);  
            console.log('Certificate uploaded to Pinata with hash:', certificateHash);  

            const priceInWei = parseUnits(price, 'ether');  
            const percentage = Number(ownershipPercentage);  

            const txn = await contract.mintProperty(  
                certificateHash,  
                priceInWei,  
                percentage,  
                await signer.getAddress()  
            );  
            console.log('Transaction sent:', txn);  

            const receipt = await txn.wait();  
            console.log('Transaction mined:', receipt);  

            setMessage('Minted successfully!');  

            contract.on("PropertyMinted", (to, tokenIdStart, tokenIdEnd, certHash, price, ownPercentage) => {  
                setMintedToken({  
                    tokenIdStart,  
                    tokenIdEnd,  
                    certHash,  
                    price: price.toString(),  
                    ownPercentage  
                });  
                setMessage(`Minted ${tokenIdEnd - tokenIdStart + 1} tokens for property.`);  
            });  
        } catch (error) {  
            setMessage('Error minting property');  
            console.error('Error minting property:', error);  
            console.error('Detailed error:', error.message);  
        }  
    };  

    const handleSimulatedMinting = () => {  
        // Simulate the token minting process  
        const simulatedMintingProcess = () => {  
            return new Promise((resolve) => {  
                setTimeout(() => {  
                    resolve({ success: true });  
                }, 2000); // Simulate a delay  
            });  
        };  

        simulatedMintingProcess()  
            .then(() => {  
                setMessage('It will mint fractional tokens accordingly to the property value, the user put in.');  
            })  
            .catch((error) => {  
                setMessage('Error in simulated minting');  
                console.error('Error in simulated minting:', error);  
            });  
    };  

    return (  
        <Box>  
            <form onSubmit={handleSubmit}>  
                <FormControl id="certificate" isRequired>  
                    <FormLabel>Property Certificate</FormLabel>  
                    <Input type="file" onChange={handleCertificateChange} />  
                </FormControl>  
                <FormControl id="price" isRequired mt={4}>  
                    <FormLabel>Property Price (in ETH)</FormLabel>  
                    <Input type="text" value={price} onChange={handlePriceChange} />  
                </FormControl>  
                <FormControl id="ownershipPercentage" isRequired mt={4}>  
                    <FormLabel>Ownership Percentage</FormLabel>  
                    <Input type="number" value={ownershipPercentage} onChange={handleOwnershipPercentageChange} min={1} max={100} />  
                </FormControl>  
                <FormControl id="role" isRequired mt={4}>  
                    <FormLabel>Role</FormLabel>  
                    <RadioGroup onChange={handleRoleChange} value={role}>  
                        <Stack direction="row">  
                            <Radio value="homeowner">Homeowner</Radio>  
                            <Radio value="developer">Developer</Radio>  
                        </Stack>  
                    </RadioGroup>  
                </FormControl>  
                <Button mt={4} colorScheme="teal" type="submit">  
                    Mint Property  
                </Button>  
            </form>  
            <Button mt={4} colorScheme="blue" onClick={handleSimulatedMinting}>  
                Simulate Minting  
            </Button>  
            {message && <Box mt={4} color={message.includes('Error') ? 'red.500' : 'green.500'}>{message}</Box>}  
            {mintedToken && (  
                <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">  
                    <Text><strong>Token ID Start:</strong> {mintedToken.tokenIdStart}</Text>  
                    <Text><strong>Token ID End:</strong> {mintedToken.tokenIdEnd}</Text>  
                    <Text><strong>Certificate Hash:</strong> {mintedToken.certHash}</Text>  
                    <Text><strong>Price:</strong> {mintedToken.price} wei</Text>  
                    <Text><strong>Ownership Percentage:</strong> {mintedToken.ownPercentage}%</Text>  
                </Box>  
            )}  
        </Box>  
    );  
};  

export default ListProperty;