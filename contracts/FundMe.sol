// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Converter.sol";

contract FundMe {
    uint256 minimumDonationInUSD = 2 * (10 ** 18);
    address[] public funders;
    mapping(address => uint256) addressToDonationAmt;
    using Converter for uint256;

    error FundMe__OnlyOwner();
    address public owner;
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.conversionRate(priceFeed) >= minimumDonationInUSD,
            "Lesser than minimum donation"
        );
        funders.push(msg.sender);
        addressToDonationAmt[msg.sender] = msg.value;
    }

    function withdraw() public OwnerOnly {
        for (uint256 i = 0; i < funders.length; i++) {
            address temp = funders[i];
            addressToDonationAmt[temp] = 0;
        }
        funders = new address[](0);

        (bool successful, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(successful, "Call failed");
    }

    modifier OwnerOnly() {
        // require(msg.sender == owner, "Only owner can call this");
        if (msg.sender != owner) revert FundMe__OnlyOwner();
        _;
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
}
