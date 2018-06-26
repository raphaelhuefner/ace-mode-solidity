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

// grammar.txt seems to define something like "inheritance parameters":
// > InheritanceSpecifier = UserDefinedTypeName ( '(' Expression ( ',' Expression )* ')' )?
// I can not find anything like that in the current Solidity documentation, not even the "develop" branch.
// Also, I can't see where that parameter could get "received" in the definition of a parent.
// All I can understand this as are C++ templates, and that this is "reserved syntax", like "reserved keywords".
// Here is my best guess as to how it could look like:
interface FacyMcFaceface is So(2016), Able(Meme) {
}
