// ForStatement = 'for' '(' (SimpleStatement)? ';' (Expression)? ';' (ExpressionStatement)? ')' Statement
// Continue = 'continue'
// Break = 'break'

for (;;) {}
for (uint256 i = 0;;) {}
for (uint256 i = 0; i < 10;) {}
for (uint256 i = 0; i < 10; i++) {}

uint256 o = 0;
for (uint256 i = 0; i < 10; i++) {
  if (i % 2) {
    continue;
  }
  o += i;
  if (o > 40) {
    break;
  }
}
