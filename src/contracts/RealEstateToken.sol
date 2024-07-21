// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.0;  

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";  
import "@openzeppelin/contracts/access/Ownable.sol";  

contract RealEstateToken is ERC20, Ownable {  
    uint256 public tokenPrice;  

    constructor(uint256 _tokenPrice) ERC20("RealEstateToken", "RET") {  
        tokenPrice = _tokenPrice;  
    }  

    function mintTokens(uint256 amount) external onlyOwner {  
        _mint(msg.sender, amount);  
    }  

    function buyTokens(uint256 amount) external payable {  
        require(msg.value == amount * tokenPrice, "Incorrect Ether value sent");  
        _transfer(owner(), msg.sender, amount);  
    }  

    function withdraw() external onlyOwner {  
        payable(owner()).transfer(address(this).balance);  
    }  
}