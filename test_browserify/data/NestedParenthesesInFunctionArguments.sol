pragma solidity ^0.4.24;

contract NestedParenthesesInFunctionArguments {
  mapping(uint256 => address) internal contrived;

  function difficultSyntaxHighlight(
    function(mapping(uint256 => address), bool) internal returns(bool) callbackParam,
    bool simpleParam
  ) internal returns(bool) {
    return callbackParam(contrived, simpleParam);
  }
}
