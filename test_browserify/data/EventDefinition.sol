// EventDefinition = 'event' Identifier EventParameterList 'anonymous'? ';'
// EventParameterList = '(' ( EventParameter (',' EventParameter )* )? ')'
// EventParameter = TypeName 'indexed'? Identifier?
// EmitStatement = 'emit' FunctionCall

event Eve(bool, bool uneventful, bool indexed, bool indexed eventful);
event Eve(bool, bool uneventful, bool indexed, bool indexed eventful) anonymous;
event Eve(bool uneventful);
event Eve(bool);

emit Eve(true);
