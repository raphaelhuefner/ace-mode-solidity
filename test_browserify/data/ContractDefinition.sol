// ContractDefinition = ( 'contract' | 'library' | 'interface' ) Identifier
//                      ( 'is' InheritanceSpecifier (',' InheritanceSpecifier )* )?
//                      '{' ContractPart* '}'

contract EmptyOneLiner {}

// https://en.wikipedia.org/wiki/Indentation_style#Variant:_1TBS_(OTBS)
contract EmptyOneTrueBraceStyle {
}

// https://en.wikipedia.org/wiki/Indentation_style#Allman_style
contract EmptyAllmanBraceStyle
{
}

library Alexandria {
}

interface OECD {
}

contract Inheriting is Inheritable {
}

contract MultipleInheritance is Awesome, Multiple, Inheritable {
}

// (see https://solidity.readthedocs.io/en/develop/contracts.html#libraries )
// Restrictions for libraries in comparison to contracts:
// - No state variables
// - Cannot inherit nor be inherited
// - Cannot receive Ether
// (These might be lifted at a later point.)
library BetterBeenDecentralized is Alexandria, Ashurbanipal, Aksum {
}

// constructor (not in grammar.txt)
// But see https://solidity.readthedocs.io/en/develop/contracts.html#constructors
// Also see following inheritance section for base constructors as "modifiers" for
// the current constructor.
contract Constructed {
  bytes32 name;
  constructor(bytes32 _name) public {
    name = _name;
  }
}

// InheritanceSpecifier = UserDefinedTypeName ( '(' Expression ( ',' Expression )* ')' )?
// The above expression(s) ^^ is/are a way to specify arguments for base contructors.
// See https://solidity.readthedocs.io/en/develop/contracts.html#arguments-for-base-constructors
contract Base {
  uint x;
  constructor(uint _x) public { x = _x; }
}

contract Derived1 is Base(7) {
  constructor(uint _y) public {}
}

contract Derived2 is Base {
  constructor(uint _y) Base(_y * _y) public {}
}
