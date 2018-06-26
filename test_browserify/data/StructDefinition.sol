// StructDefinition = 'struct' Identifier '{'
//                      ( VariableDeclaration ';' (VariableDeclaration ';')* ) '}'
struct Structure {
    address architect;
    uint256 maxLoad;
}

struct Town {
    string name;
    mapping (address => Structure) buildings;
}
