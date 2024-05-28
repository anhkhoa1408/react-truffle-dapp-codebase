// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract SimpleStorage {
    uint public contractBalance;
    string public helloWorld = "";

    mapping(address => uint256) balance;

    event TransferToAccount(address indexed _to, uint256 indexed amount);

    event HelloChanged(string indexed str);

    constructor() {
        balance[msg.sender] = msg.sender.balance;
    }

    function hello() public {
        helloWorld = "hello world";
        emit HelloChanged(helloWorld);
    }

    function showHello() public view returns (string memory) {
        return helloWorld;
    }

    function transfer(address payable _to, uint amount) public {
        _to.transfer(amount);
        emit TransferToAccount(_to, amount);
    }
}
