// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.24;  
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";  
import "@openzeppelin/contracts/access/Ownable.sol";  

contract InvestmentToken is ERC20, Ownable {  
    uint256 public constant TOKENS_PER_ETH = 100;  
    uint256 public constant TOKEN_USD_VALUE = 1000; // Each token is worth $1000  

    constructor() ERC20("Investment Token", "INVT") Ownable(msg.sender) {}  

    function buyTokens() public payable {  
        require(msg.value > 0, "Send ETH to buy tokens");  
        uint256 tokensToMint = msg.value * TOKENS_PER_ETH;  
        _mint(msg.sender, tokensToMint);  
    }  

    function sellTokens(uint256 amount) public {  
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");  
        uint256 ethToReturn = amount / TOKENS_PER_ETH;  
        require(address(this).balance >= ethToReturn, "Insufficient contract balance");  
        _burn(msg.sender, amount);  
        payable(msg.sender).transfer(ethToReturn);  
    }  

    function transferTokens(address to, uint256 amount) public {  
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");  
        _transfer(msg.sender, to, amount);  
    }  

    function getTokenUSDValue() public pure returns (uint256) {  
        return TOKEN_USD_VALUE;  
    }  
}