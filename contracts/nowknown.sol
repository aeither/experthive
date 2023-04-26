// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract NowKnown {
    mapping(address => mapping(address => bool)) public scheduledCalls; // mapping to store scheduled calls
    mapping(address => mapping(address => bool)) public access; // mapping to store access control list
    mapping(address => uint256) public earnings; // mapping to store expert earnings

    function scheduleCall(address expert, address user) external payable {
        require(msg.value > 0, "Payment required to schedule call");
        scheduledCalls[expert][user] = true; // schedule call for user
        earnings[expert] += msg.value; // register earnings for expert
    }

    function startCall(address expert, address user) external {
        require(
            scheduledCalls[expert][user],
            "Call has not been scheduled yet"
        );
        require(msg.sender == expert, "Only expert can grant access");
        access[expert][user] = true; // grant access to user
    }

    function rejectCall(address expert, address payable user) external {
        require(scheduledCalls[expert][user], "Call has not been scheduled");
        require(msg.sender == expert, "Only expert can reject call");
        uint256 amount = earnings[expert]; // get earnings for expert
        earnings[expert] = 0; // set earnings to 0
        (bool sent, bytes memory data) = user.call{value: amount}(""); // refund user
        require(sent, "Failed to send Ether");
        access[expert][user] = false; // revoke access for user
        scheduledCalls[expert][user] = false; // set scheduled call to false
    }

    function completeCall(address payable expert, address user) external {
        require(scheduledCalls[expert][user], "Call has not been scheduled");
        require(msg.sender == expert, "Only expert can complete call");
        uint256 amount = earnings[expert]; // get earnings for expert
        earnings[expert] = 0; // set earnings to 0
        access[expert][user] = false; // revoke access for user
        scheduledCalls[expert][user] = false; // set scheduled call to false
        _withdrawEarnings(expert, amount); // withdraw earnings for expert
    }

    function _withdrawEarnings(
        address payable expert,
        uint256 amount
    ) internal {
        require(amount > 0, "No earnings to withdraw");
        (bool sent, bytes memory data) = expert.call{value: amount}(""); // transfer earnings to expert
        require(sent, "Failed to send Ether");
    }
}
