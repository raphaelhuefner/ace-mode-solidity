// FunctionDefinition = 'function' Identifier? ParameterList
//                      ( ModifierInvocation | StateMutability | 'external' | 'public' | 'internal' | 'private' )*
//                      ( 'returns' ParameterList )? ( ';' | Block )
// Return = 'return' Expression?
// Throw = 'throw'

// Order: ModifierInvocation StateMutability Visibility
function f(uint256 param) modding(param) pure external returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) constant external returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) view external returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) payable external returns(uint256) {return 2 * param;}

function f(uint256 param) modding(param) pure public returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) constant public returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) view public returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) payable public returns(uint256) {return 2 * param;}

function f(uint256 param) modding(param) pure internal returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) constant internal returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) view internal returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) payable internal returns(uint256) {return 2 * param;}

function f(uint256 param) modding(param) pure private returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) constant private returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) view private returns(uint256) {return 2 * param;}
function f(uint256 param) modding(param) payable private returns(uint256) {return 2 * param;}


// Order: StateMutability Visibility ModifierInvocation
function f(uint256 param) pure external modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) constant external modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) view external modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) payable external modding(param) returns(uint256) {return 2 * param;}

function f(uint256 param) pure public modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) constant public modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) view public modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) payable public modding(param) returns(uint256) {return 2 * param;}

function f(uint256 param) pure internal modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) constant internal modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) view internal modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) payable internal modding(param) returns(uint256) {return 2 * param;}

function f(uint256 param) pure private modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) constant private modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) view private modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) payable private modding(param) returns(uint256) {return 2 * param;}


// Order: Visibility StateMutability ModifierInvocation
function f(uint256 param) external pure modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) external constant modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) external view modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) external payable modding(param) returns(uint256) {return 2 * param;}

function f(uint256 param) public pure modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) public constant modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) public view modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) public payable modding(param) returns(uint256) {return 2 * param;}

function f(uint256 param) internal pure modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) internal constant modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) internal view modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) internal payable modding(param) returns(uint256) {return 2 * param;}

function f(uint256 param) private pure modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) private constant modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) private view modding(param) returns(uint256) {return 2 * param;}
function f(uint256 param) private payable modding(param) returns(uint256) {return 2 * param;}


// Leave off some/all optional parts.
function (uint256 param) {}
function g(uint256 param);
function g(MyStruct memory param) returns(MyOtherStruct memory);
function g(MyStruct storage param) returns(MyOtherStruct storage);
function g(MyStruct calldata param);
function g(uint256 param) returns(bool, uint256, string);
function g(uint256 param) private returns(bool, uint256, string) {}
function g(uint256 param) public modding(param, 17) returns(bool, uint256, string) {}
function g(uint256 param) private modding(123456, param, 17) returns(bool, uint256, string) {}

function g(uint256 param) private modding(123456, param, 17) {
  // NOTE: From version 0.4.13 the throw keyword is deprecated and will be phased out in the future.
  if (param < 17000) {
    throw;
  }
  return;
}

function g() public modding(123456, 13, 17) returns(bool) {
  return false;
}

function g() public moddingWithoutParam returns(bool, uint256, string) {
  return (true, 17, "Hello World!");
}
