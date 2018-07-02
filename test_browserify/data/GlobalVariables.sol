// https://solidity.readthedocs.io/en/develop/units-and-global-variables.html
// https://solidity.readthedocs.io/en/develop/miscellaneous.html#global-variables

contract GlobalVariables {
  function j(uint256 param) payable external {
    address addy = block.coinbase; // current block miner’s address
    uint256 hardship = block.difficulty; // current block difficulty
    uint256 tankVolume = block.gaslimit; // current block gaslimit
    uint256 houseNumber = block.number; // current block number
    uint256 nowish = block.timestamp; // current block timestamp
    bytes memory whatToDo = msg.data; // complete calldata
    uint256 runway = msg.gas; // remaining gas - deprecated in version 0.4.21 and to be replaced by gasleft()
    address boss = msg.sender; // sender of the message (current call)
    uint256 worth = msg.value; // number of wei sent with the message
    uint256 betterThanNever = now; // current block timestamp (alias for block.timestamp)
    uint256 fuel = tx.gasprice; // gas price of the transaction
    address bigWig = tx.origin; // sender of the transaction (full call chain)
    this.j(17); // the current contract, explicitly convertible to address
    super.j(17); // the contract one level higher in the inheritance hierarchy
    uint256 addyPurse = addy.balance; // balance of the Address in Wei
  }
}
