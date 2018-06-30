// Precedence by order (see github.com/ethereum/solidity/pull/732)
// Expression
//   = Expression ('++' | '--')
//   | NewExpression
//   | IndexAccess
//   | MemberAccess
//   | FunctionCall
//   | '(' Expression ')'
//   | ('!' | '~' | 'delete' | '++' | '--' | '+' | '-') Expression
//   | Expression '**' Expression
//   | Expression ('*' | '/' | '%') Expression
//   | Expression ('+' | '-') Expression
//   | Expression ('<<' | '>>') Expression
//   | Expression '&' Expression
//   | Expression '^' Expression
//   | Expression '|' Expression
//   | Expression ('<' | '>' | '<=' | '>=') Expression
//   | Expression ('==' | '!=') Expression
//   | Expression '&&' Expression
//   | Expression '||' Expression
//   | Expression '?' Expression ':' Expression
//   | Expression ('=' | '|=' | '^=' | '&=' | '<<=' | '>>=' | '+=' | '-=' | '*=' | '/=' | '%=') Expression
//   | PrimaryExpression
//
// PrimaryExpression = BooleanLiteral
//                   | NumberLiteral
//                   | HexLiteral
//                   | StringLiteral
//                   | TupleExpression
//                   | Identifier
//                   | ElementaryTypeNameExpression
//
// ExpressionList = Expression ( ',' Expression )*
// NameValueList = Identifier ':' Expression ( ',' Identifier ':' Expression )*
//
// FunctionCall = Expression '(' FunctionCallArguments ')'
// FunctionCallArguments = '{' NameValueList? '}'
//                       | ExpressionList?
//
// NewExpression = 'new' TypeName
// MemberAccess = Expression '.' Identifier
// IndexAccess = Expression '[' Expression? ']'
//
// BooleanLiteral = 'true' | 'false'
// NumberLiteral = ( HexNumber | DecimalNumber ) (' ' NumberUnit)?
// NumberUnit = 'wei' | 'szabo' | 'finney' | 'ether'
//            | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'years'
// HexLiteral = 'hex' ('"' ([0-9a-fA-F]{2})* '"' | '\'' ([0-9a-fA-F]{2})* '\'')
// StringLiteral = '"' ([^"\r\n\\] | '\\' .)* '"'
// Identifier = [a-zA-Z_$] [a-zA-Z_$0-9]*
//
// HexNumber = '0x' [0-9a-fA-F]+
// DecimalNumber = [0-9]+ ( '.' [0-9]* )? ( [eE] [0-9]+ )?
//
// TupleExpression = '(' ( Expression? ( ',' Expression? )*  )? ')'
//                 | '[' ( Expression  ( ',' Expression  )*  )? ']'

// Expression ('++' | '--')
int256 x = 0;
x++;
x ++;
x--;
x --;

// NewExpression
CustomContract customContract = new CustomContract();

// IndexAccess
uint256[] amounts;
amounts[0] = 17;
uint256 a = 1;
amounts[a] = amounts[0];

// MemberAccess
customContract.customColor = "red";
customContract.customize();
string color = customContract.customColor;

// FunctionCall
// FunctionCall = Expression '(' FunctionCallArguments ')'
// FunctionCallArguments = '{' NameValueList? '}'
//                       | ExpressionList?
// NameValueList = Identifier ':' Expression ( ',' Identifier ':' Expression )*
uint256 result = customContract.customize();
uint256 result = customContract.customize(1, 2, 3);
uint256 result = customContract.customize({a:1, b:2, c:3});

doit();
doit(1, 2, 3);
doit({a:1, b:2, c:3});

doit ();
doit (1, 2, 3);
doit ({a:1, b:2, c:3});

// '(' Expression ')'
(myInt);
(1);

// ('!' | '~' | 'delete' | '++' | '--' | '+' | '-') Expression
!a; ! a;
~a; ~ a;
delete a;
++a; ++ a;
--a; -- a;
+a; + a;
-a; - a;

// Expression '**' Expression
uint256 x = a ** b;

// Expression ('*' | '/' | '%') Expression
uint256 x = a * b;
uint256 y = a / b;
uint256 z = a % b;

// Expression ('+' | '-') Expression
uint256 x = a + b;
uint256 y = a - b;

// Expression ('<<' | '>>') Expression
uint256 x = a << b;
uint256 y = a >> b;

// Expression '&' Expression
uint256 x = a & b;

// Expression '^' Expression
uint256 x = a ^ b;

// Expression '|' Expression
uint256 x = a | b;

// Expression ('<' | '>' | '<=' | '>=') Expression
bool lt = a < b;
bool gt = a > b;
bool le = a <= b;
bool ge = a >= b;

// Expression ('==' | '!=') Expression
bool eq = a == b;
bool ne = a != b;

// Expression '&&' Expression
bool and = a && b;

// Expression '||' Expression
bool or = a || b;

// Expression '?' Expression ':' Expression
string outcome = conditional > 10 ? "yes" : "no";

// Expression ('=' | '|=' | '^=' | '&=' | '<<=' | '>>=' | '+=' | '-=' | '*=' | '/=' | '%=') Expression
struct KitchenSink {
  uint32 color;
  uint256 volume;
}
KitchenSink k;
k.color = 0x00000000;
k.color |= 0xff000000;
k.color ^= 0x0f0f0f0f;
k.color &= 0xffff0000;
v.volume = 25;
v.volume <<= 2;
v.volume >>= 2;
v.volume += 2;
v.volume -= 2;
v.volume *= 2;
v.volume /= 2;
v.volume %= 2;

// PrimaryExpression = BooleanLiteral
//                   | NumberLiteral
//                   | HexLiteral
//                   | StringLiteral
//                   | TupleExpression
//                   | Identifier
//                   | ElementaryTypeNameExpression



// BooleanLiteral = 'true' | 'false'
bool truth = true;
bool truth = false;

// NumberLiteral = ( HexNumber | DecimalNumber ) (' ' NumberUnit)?
// HexNumber = '0x' [0-9a-fA-F]+
// DecimalNumber = [0-9]+ ( '.' [0-9]* )? ( [eE] [0-9]+ )?
// NumberUnit = 'wei' | 'szabo' | 'finney' | 'ether'
//            | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'years'
uint256 number = 0x123abcDEF wei;
uint256 number = 123456 szabo;
uint256 number = 123456 finney;
uint256 number = 123456 ether;
uint256 time = 60 seconds;
uint256 time = 60 minutes;
uint256 time = 60 hours;
uint256 time = 60 days;
uint256 time = 60 weeks;
uint256 time = 60 years;

ufixed128x80 fractional = 123.456;
ufixed128x80 fractional = -123.456;
ufixed128x80 fractional = 123.456e12;
ufixed128x80 fractional = -123.456e12;
ufixed128x80 fractional = 123.456E12;
ufixed128x80 fractional = -123.456E12;

// grammar.txt is missing negative exponents (for really small numbers).
ufixed128x80 fractional = 1.456e-12;
ufixed128x80 fractional = -1.456e-12;
ufixed128x80 fractional = 1.456E-12;
ufixed128x80 fractional = -1.456E-12;

// HexLiteral = 'hex' ('"' ([0-9a-fA-F]{2})* '"' | '\'' ([0-9a-fA-F]{2})* '\'')
bytes[] hexer = hex"";
bytes[] hexer = hex"0123456789abcdef0123456789ABCDEF";
bytes[] hexer = hex'';
bytes[] hexer = hex'0123456789abcdef0123456789ABCDEF';

// StringLiteral = '"' ([^"\r\n\\] | '\\' .)* '"'
string talker = "";
string talker = "Hello!";
string talker = "Hello \x26\x03!";
string talker = "Hello \u2603!";
string talker = "I said \"Hello!\", did you hear it?";
string talker = "Look ma, \
multi-line strings! Just escape \
the newline with a back-slash.";

// https://solidity.readthedocs.io/en/develop/types.html#string-literals
// ^^ says both single-quoted and double-quoted string literals, even if
// grammar.txt has only double-quoted.
string greet = '';
string greet = 'Hello World!';
string greet = 'Hello \x26\x03!';
string greet = 'Hello \u2603!';
string greet = 'Hello \'World\'!';
string greet = 'Hello \
World!';

// Identifier = [a-zA-Z_$] [a-zA-Z_$0-9]*
uint a = 0;
uint A = 0;
// "_" is be a legal identifier outside of modifiers. Keyword syntax
// highlighting triggers nevertheless, to alert user of special meaning and
// potential confusion.
uint _ = 0;
uint $ = 0;
uint a0b_$1c = 0;
uint A0b_$1c = 0;
uint _0b_$1c = 0;
uint $0b_$1c = 0;

// TupleExpression = '(' ( Expression? ( ',' Expression? )*  )? ')'
//                 | '[' ( Expression  ( ',' Expression  )*  )? ']'
// The "[]" bracket notation is not a tuple but an array literal. See below.
uint256 a = 0;
uint256 b = 0;
uint256 c = 0;
(a, b, c) = (1, 1, 1);

// Array Literal (not in grammar.txt)
uint256[3] memory b = [uint256(1), 2, 3];

// Explicit Type Cast (not in grammar.txt AFAICT)
uint8 a = 1;
uint256 b = uint256(a);

address o = address(otherContract);
