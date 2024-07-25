// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.0;  

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";  
import "@openzeppelin/contracts/access/Ownable.sol";  
import "@openzeppelin/contracts/access/AccessControl.sol";  

contract PropertyNFT is ERC721Enumerable, Ownable, AccessControl {  
    bytes32 public constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");  

    struct Property {  
        string certificateHash;  
        uint256 price;  
        uint8 ownershipPercentage; // From 1 to 100  
    }  

    mapping(uint256 => Property) public properties;  
    mapping(string => bool) public certificateIsUsed;  
    uint256 public nextTokenId = 1;  
    uint256 public constant TOKENS_PER_PROPERTY = 100;  

    event PropertyMinted(  
        address indexed to,  
        uint256 tokenIdStart,  
        uint256 tokenIdEnd,  
        string certificateHash,  
        uint256 price,  
        uint8 ownershipPercentage  
    );  

    constructor() ERC721("Property NFT", "PNFT") Ownable(msg.sender) {  
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);  
        _grantRole(DEVELOPER_ROLE, msg.sender);  
    }  

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, AccessControl) returns (bool) {  
        return super.supportsInterface(interfaceId);  
    }  

    function mintProperty(  
        string memory certificateHash,  
        uint256 price,  
        uint8 ownershipPercentage,  
        address to  
    ) public {  
        require(  
            hasRole(DEVELOPER_ROLE, msg.sender) || ownershipPercentage <= 49,  
            "Ownership percentage exceeds allowed limit"  
        );  
        require(!certificateIsUsed[certificateHash], "Certificate already used");  
        require(ownershipPercentage > 0 && ownershipPercentage <= 100, "Invalid ownership percentage");  

        certificateIsUsed[certificateHash] = true;  
        uint256 tokenIdStart = nextTokenId;  
        uint256 tokenIdEnd = tokenIdStart + TOKENS_PER_PROPERTY - 1;  

        for (uint256 i = tokenIdStart; i <= tokenIdEnd; i++) {  
            _mint(to, i);  
            properties[i] = Property(certificateHash, price, ownershipPercentage);  
        }  

        nextTokenId += TOKENS_PER_PROPERTY;  

        // Emit event after successful minting  
        emit PropertyMinted(to, tokenIdStart, tokenIdEnd, certificateHash, price, ownershipPercentage);  
    }  

    function isDeveloper(address account) public view returns (bool) {  
        return hasRole(DEVELOPER_ROLE, account);  
    }  

    function grantDeveloperRole(address account) public onlyOwner {  
        grantRole(DEVELOPER_ROLE, account);  
    }  
}