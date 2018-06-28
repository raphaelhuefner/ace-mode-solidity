// VariableDefinition = ('var' IdentifierList | VariableDeclaration | '(' VariableDeclaration? (',' VariableDeclaration? )* ')' ) ( '=' Expression )?
//
// semantic restriction: mappings and structs (recursively) containing mappings
// are not allowed in argument lists
// VariableDeclaration = TypeName StorageLocation? Identifier
// TypeName = ElementaryTypeName
//          | UserDefinedTypeName
//          | Mapping
//          | ArrayTypeName
//          | FunctionTypeName
// StorageLocation = 'memory' | 'storage' | 'calldata'
// Mapping = 'mapping' '(' ElementaryTypeName '=>' TypeName ')'

// Warning: Use of the "var" keyword is deprecated.
// TypeError: Assignment necessary for type detection.
var (abc, def, ghi) = (0, 0, 0);
var xyz = 1000;

// StorageLocation
uint256 memory x;
uint256 storage x;
uint256 calldata x;

// ElementaryTypeName
address owner = 0x0123456789abcdef0123456789ABCDEF01234567;
bool truth = true;
bool (truth, untruth) = (true, false);
string greet = "Hello World!";
var xyz = 1000;

int x = 0;
int8 x = 0;
int16 x = 0;
int24 x = 0;
int32 x = 0;
int40 x = 0;
int48 x = 0;
int56 x = 0;
int64 x = 0;
int72 x = 0;
int80 x = 0;
int88 x = 0;
int96 x = 0;
int104 x = 0;
int112 x = 0;
int120 x = 0;
int128 x = 0;
int136 x = 0;
int144 x = 0;
int152 x = 0;
int160 x = 0;
int168 x = 0;
int176 x = 0;
int184 x = 0;
int192 x = 0;
int200 x = 0;
int208 x = 0;
int216 x = 0;
int224 x = 0;
int232 x = 0;
int240 x = 0;
int248 x = 0;
int256 x = 0;

uint x = 0;
uint8 x = 0;
uint16 x = 0;
uint24 x = 0;
uint32 x = 0;
uint40 x = 0;
uint48 x = 0;
uint56 x = 0;
uint64 x = 0;
uint72 x = 0;
uint80 x = 0;
uint88 x = 0;
uint96 x = 0;
uint104 x = 0;
uint112 x = 0;
uint120 x = 0;
uint128 x = 0;
uint136 x = 0;
uint144 x = 0;
uint152 x = 0;
uint160 x = 0;
uint168 x = 0;
uint176 x = 0;
uint184 x = 0;
uint192 x = 0;
uint200 x = 0;
uint208 x = 0;
uint216 x = 0;
uint224 x = 0;
uint232 x = 0;
uint240 x = 0;
uint248 x = 0;
uint256 x = 0;

byte x = 0;
bytes x = 0;
bytes1 x = 0;
bytes2 x = 0;
bytes3 x = 0;
bytes4 x = 0;
bytes5 x = 0;
bytes6 x = 0;
bytes7 x = 0;
bytes8 x = 0;
bytes9 x = 0;
bytes10 x = 0;
bytes11 x = 0;
bytes12 x = 0;
bytes13 x = 0;
bytes14 x = 0;
bytes15 x = 0;
bytes16 x = 0;
bytes17 x = 0;
bytes18 x = 0;
bytes19 x = 0;
bytes20 x = 0;
bytes21 x = 0;
bytes22 x = 0;
bytes23 x = 0;
bytes24 x = 0;
bytes25 x = 0;
bytes26 x = 0;
bytes27 x = 0;
bytes28 x = 0;
bytes29 x = 0;
bytes30 x = 0;
bytes31 x = 0;
bytes32 x = 0;

fixed x = 0.0;
fixed8x4 x = 0.0;
fixed16x12 x = 0.0;
fixed24x18 x = 0.0;
fixed32x18 x = 0.0;
fixed40x18 x = 0.0;
fixed48x18 x = 0.0;
fixed56x18 x = 0.0;
fixed64x18 x = 0.0;
fixed72x18 x = 0.0;
fixed80x80 x = 0.0;
fixed88x80 x = 0.0;
fixed96x80 x = 0.0;
fixed104x80 x = 0.0;
fixed112x80 x = 0.0;
fixed120x80 x = 0.0;
fixed128x80 x = 0.0;
fixed136x80 x = 0.0;
fixed144x80 x = 0.0;
fixed152x80 x = 0.0;
fixed160x80 x = 0.0;
fixed168x80 x = 0.0;
fixed176x80 x = 0.0;
fixed184x80 x = 0.0;
fixed192x80 x = 0.0;
fixed200x80 x = 0.0;
fixed208x80 x = 0.0;
fixed216x80 x = 0.0;
fixed224x80 x = 0.0;
fixed232x80 x = 0.0;
fixed240x80 x = 0.0;
fixed248x80 x = 0.0;
fixed256x80 x = 0.0;

ufixed x = 0.0;
ufixed8x4 x = 0.0;
ufixed16x12 x = 0.0;
ufixed24x18 x = 0.0;
ufixed32x18 x = 0.0;
ufixed40x18 x = 0.0;
ufixed48x18 x = 0.0;
ufixed56x18 x = 0.0;
ufixed64x18 x = 0.0;
ufixed72x18 x = 0.0;
ufixed80x80 x = 0.0;
ufixed88x80 x = 0.0;
ufixed96x80 x = 0.0;
ufixed104x80 x = 0.0;
ufixed112x80 x = 0.0;
ufixed120x80 x = 0.0;
ufixed128x80 x = 0.0;
ufixed136x80 x = 0.0;
ufixed144x80 x = 0.0;
ufixed152x80 x = 0.0;
ufixed160x80 x = 0.0;
ufixed168x80 x = 0.0;
ufixed176x80 x = 0.0;
ufixed184x80 x = 0.0;
ufixed192x80 x = 0.0;
ufixed200x80 x = 0.0;
ufixed208x80 x = 0.0;
ufixed216x80 x = 0.0;
ufixed224x80 x = 0.0;
ufixed232x80 x = 0.0;
ufixed240x80 x = 0.0;
ufixed248x80 x = 0.0;
ufixed256x80 x = 0.0;

// UserDefinedTypeName
Abc.def.ghi jkl = 13;

// Mapping
mapping (address => uint256) accounts;

// ArrayTypeName
uint256[] amounts;
uint256[7] lessAmounts;

// FunctionTypeName
// 'function' FunctionTypeParameterList ( 'internal' | 'external' | StateMutability )*
//                    ( 'returns' FunctionTypeParameterList )?
function (uint256, string) internal pure returns(uint256, bool) myDecision;
function (uint256, string) internal pure myAction;

// Destructuring Assignments
(uint256 x, bool b, uint256 y) = f();
(, bool b, uint256 y) = f();
(uint256 x,, uint256 y) = f();
