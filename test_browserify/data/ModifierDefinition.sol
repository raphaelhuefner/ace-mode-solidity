// ModifierDefinition = 'modifier' Identifier ParameterList? Block
// PlaceholderStatement = '_'
modifier costs(uint price) {
    if (msg.value >= price) {
        _;
    }
}

modifier notSoDifferent {
    _;
}
