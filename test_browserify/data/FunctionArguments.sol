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

contract FixedNumberFunctionArguments {
  function fixedNumberSyntaxHighlight(fixed136x63 param1, ufixed216x77 param2) internal returns(bool) {
    return false;
  }
}

library Somewhere {
  struct Great {
    int256 lat;
    int256 lon;
    string name;
  }
}

contract UserDefinedTypeNameFunctionArguments {
  struct Home {
    uint8 roomId;
    string name;
  }

  function userDefinedTypeNameSyntaxHighlight(Somewhere.Great memory vivid, Home storage trip) internal pure returns(bool) {
    return true;
  }
}
