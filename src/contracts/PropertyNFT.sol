// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.0;  

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";  
import "@openzeppelin/contracts/access/Ownable.sol";  

contract PropertyNFT is ERC721Enumerable, Ownable {  

    uint256 public nextTokenId = 1;  
    mapping(string => bool) public certificateIsUsed;  

    constructor() ERC721("Property NFT", "PNFT") Ownable(msg.sender) {  
        // The Ownable constructor is now explicitly initialized with msg.sender  
    }  

    function mintProperty(string memory certificateHash, address to) external onlyOwner {  
        require(!certificateIsUsed[certificateHash], "Certificate already used");  
        certificateIsUsed[certificateHash] = true;  

        for (uint256 i = 0; i < 100; i++) {  
            _mint(to, nextTokenId + i);  
        }  
        
        nextTokenId += 100;  
    }  
}