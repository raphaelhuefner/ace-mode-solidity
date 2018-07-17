ace.define("ace/mode/solidity_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"], function(acequire, exports, module) {
"use strict";

var oop = acequire("../lib/oop");
var deepCopy = acequire("../lib/lang").deepCopy;
var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

var SolidityHighlightRules = function(options) {
    var intTypes = 'byte|int|uint';
    for (var width = 8; width <= 256; width += 8) {
        intTypes += '|bytes' + (width / 8) + '|uint' + width + '|int' + width;
    }
    var mainKeywordsByType = {
        "variable.language":
            "this|super",
        "keyword":
            "as|emit|from|import|returns",
        "keyword.control":
            "break|continue|do|else|for|if|return|while",
        "keyword.control.deprecated":
            "throw",
        "keyword.operator":
            "delete|new",
        "keyword.other.reserved": // see https://solidity.readthedocs.io/en/develop/miscellaneous.html#reserved-keywords
            "abstract|after|alias|apply|auto|case|catch|copyof|default|" +
            "define|final|immutable|implements|in|inline|let|macro|match|" +
            "mutable|null|of|override|partial|promise|reference|relocatable|" +
            "sealed|sizeof|static|supports|switch|try|type|typedef|typeof|" +
            "unchecked",
        "storage.type":
            "contract|library|interface|function|constructor|event|modifier|" +
            "struct|mapping|enum|" +
            "var|bool|address|" + intTypes,
        "storage.type.array.dynamic":
            "bytes|string",
        "storage.modifier.inheritance":
            "is",
        "storage.modifier.storagelocation":
            "storage|memory|calldata",
        "storage.modifier.statemutability":
            "constant|payable|pure|view",
        "storage.modifier.visibility":
            "private|public|external|internal",
        "storage.modifier.event":
            "anonymous|indexed",
        "support.function":
            "addmod|assert|blockhash|ecrecover|gasleft|keccak256|mulmod|" +
            "require|revert|ripemd160|selfdestruct|sha256",
        "support.function.deprecated":
            "sha3|suicide",
        "support.variable":
            "now",
        "constant.language.boolean":
            "true|false",
        "constant.numeric.other.unit.currency":
            "wei|szabo|finney|ether",
        "constant.numeric.other.unit.time":
            "seconds|minutes|hours|days|weeks",
        "constant.numeric.other.unit.time.deprecated":
            "years"
    }
    var mainKeywordMapper = this.createKeywordMapper(mainKeywordsByType, "identifier");
    var hasSeenFirstFunctionArgumentKeyword = false;

    var functionArgumentsKeywordMapper = function functionArgumentsKeywordMapper(value) {
      var mainKeywordToken = mainKeywordMapper(value);
      if (
        hasSeenFirstFunctionArgumentKeyword
        &&
        ("identifier" == mainKeywordToken)
      ) {
        mainKeywordToken = "variable.parameter";
      }
      hasSeenFirstFunctionArgumentKeyword = true;
      return mainKeywordToken;
    };

    var identifierRe = "[a-zA-Z_$][a-zA-Z_$0-9]*\\b|\\$"; // Single "$" can't have a word boundary since it's not a word char.

    var escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|" + // hex
        "u[0-9a-fA-F]{4}|" + // unicode
        ".)"; // stuff like "\r" "\n" "\t" etc.

    var commentWipMarkerRule = function commentWipMarkerRule(commentType) {
        return {
            token : "comment." + commentType + ".doc.documentation.tag.storage.type",
            regex : "\\b(?:TODO|FIXME|XXX|HACK)\\b"
        }
    };

    var natSpecRule = function natSpecRule(commentType) {
        return {
            token : "comment." + commentType + ".doc.documentation.tag",
            regex : "\\B@(?:author|dev|notice|param|return|title)\\b"
        }
    };
    var pushFunctionArgumentsState = function(currentState, stack) {
        if (currentState != "start" || stack.length)
            stack.unshift("function_arguments", currentState);
        hasSeenFirstFunctionArgumentKeyword = false;
        return "function_arguments";
    };

    this.$rules = {
        "start" : [
            {
                token : "comment.block.doc.documentation", // doc comment
                regex : "\\/\\*(?=\\*)",
                push  : "doc_comment"
            }, {
                token : "comment.line.triple-slash.double-slash.doc.documentation", // triple slash "NatSpec" doc comment
                regex : "\\/\\/\\/",
                push  : "doc_line_comment"
            }, {
                token : "comment.block", // multi line comment
                regex : "\\/\\*",
                push  : "comment"
            }, {
                token : "comment.line.double-slash",
                regex : "\\/\\/",
                push  : "line_comment"
            }, {
                token : "text",
                regex : "\\s+|^$"
            }, {
                token : "string.quoted.single",
                regex : "'(?=.)",
                push  : "qstring"
            }, {
                token : "string.quoted.double",
                regex : '"(?=.)',
                push  : "qqstring"
            }, {
                token : "storage.type.reserved", // TODO really "reserved"? Compiler 0.4.24 says "UnimplementedFeatureError: Not yet implemented - FixedPointType."
                regex : "u?fixed(?:" +
                        "8x[0-8]|" + // Docs say 0-80 for the fractional part. It's unclear whether 0-80 bits or 0-80 decimal places.
                        "16x(?:1[0-6]|[0-9])|" + // Longest match has to be first alternative.
                        "24x(?:2[0-4]|1[0-9]|[0-9])|" +
                        "32x(?:3[0-2]|[1-2][0-9]|[0-9])|" +
                        "40x(?:40|[1-3][0-9]|[0-9])|" +
                        "48x(?:4[0-8]|[1-3][0-9]|[0-9])|" +
                        "56x(?:5[0-6]|[1-4][0-9]|[0-9])|" +
                        "64x(?:6[0-4]|[1-5][0-9]|[0-9])|" +
                        "72x(?:7[0-2]|[1-6][0-9]|[0-9])|" +
                        "(?:80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)x(?:80|[1-7][0-9]|[0-9])" +
                        ")?",
                inheritingStateRuleId : "fixedNumberType"
            }, {
                token : "keyword.control", // PlaceholderStatement in ModifierDefinition
                regex : /\b_\b/
            }, {
                token : [ // HexLiteral
                    "string.other.hex", "string.other.hex", "string.other.hex",
                    "string.other.hex", "string.other.hex"
                ],
                regex : /(\b)(hex)(['"])((?:[0-9a-fA-F]{2})*)(\3)/
            }, {
                token : "constant.numeric.hex", // hex
                regex : /0[xX][0-9a-fA-F]+\b/
            }, {
                token : "constant.numeric", // float
                regex : /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
            }, {
                token : ["keyword", "text", "keyword", "text", "constant.other"],
                regex : "(pragma)(\\s+)(solidity|experimental)(\\s+)([^;]+)"
            }, {
                token : ["keyword", "text", "identifier", "text", "keyword", "text", "identifier"], // UsingForDeclaration
                regex : "(using)(\\s+)(" + identifierRe + ")(\\s+)(for)(\\s+)(" + identifierRe + "|\\*)"
            }, {
                token : "support.function.deprecated", // Not in keywordMapper because of ".". Longest match has to be first alternative.
                regex : /block\s*\.\s*blockhash|\.\s*callcode/
            }, {
                token : "support.function", // Not in keywordMapper because of ".". Longest match has to be first alternative.
                regex : /abi\s*\.\s*(?:encodeWithSignature|encodeWithSelector|encodePacked|encode)|\.\s*(?:delegatecall|transfer|call|send)/
            }, {
                token : "support.variable", // Not in keywordMapper because of ".". Longest match has to be first alternative.
                regex : /block\s*\.\s*(?:difficulty|timestamp|coinbase|gaslimit|number)|msg\s*\.\s*(?:sender|value|data)|tx\s*\.\s*(?:gasprice|origin)|\.\s*balance/
            }, {
                token : "support.variable.deprecated", // Not in keywordMapper because of ".". Longest match has to be first alternative.
                regex : /msg\s*\.\s*gas/
            }, {
                token : [ // FunctionDefinition
                    "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                ],
                regex : "(function)(\\s+)(" + identifierRe + ")(\\s*)(\\()",
                next  : pushFunctionArgumentsState
            }, {
                token : ["storage.type", "text", "paren.lparen"], // FunctionTypeName && fallback function definition
                regex : "(function)(\\s*)(\\()",
                next  : pushFunctionArgumentsState
            }, {
                token : ["keyword", "text", "paren.lparen"], // "returns" clause
                regex : "(returns)(\\s*)(\\()",
                next  : pushFunctionArgumentsState
            }, {
                token : mainKeywordMapper,
                regex : identifierRe,
                inheritingStateRuleId : "keywordMapper"
            }, {
                token : "keyword.operator",
                regex : /--|\*\*|\+\+|=>|<<|>>|<<=|>>=|&&|\|\||[!&|+\-*\/%~^<>=]=?/
            }, {
                token : "punctuation.operator",
                regex : /[?:;]/
            }, {
                token : "punctuation.operator", // keep "." and "," separate for easier cloning and modifying into "function_arguments"
                regex : /[.,]/,
                inheritingStateRuleId : "punctuation"
            }, {
                token : "paren.lparen",
                regex : /[\[{]/
            }, {
                token : "paren.lparen", // keep "(" separate for easier cloning and modifying into "function_arguments"
                regex : /[(]/,
                inheritingStateRuleId : "lparen"
            }, {
                token : "paren.rparen",
                regex : /[\]}]/
            }, {
                token : "paren.rparen", // keep ")" separate for easier cloning and modifying into "function_arguments"
                regex : /[)]/,
                inheritingStateRuleId : "rparen"
            }
        ],
        "comment" : [
            commentWipMarkerRule("block"),
            {
                token : "comment.block",
                regex : "\\*\\/",
                next  : "pop"
            }, {
                defaultToken : "comment.block",
                caseInsensitive : true
            }
        ],
        "line_comment" : [
            commentWipMarkerRule("line"),
            {
                token : "comment.line.double-slash",
                regex : "$|^",
                next  : "pop"
            }, {
                defaultToken : "comment.line.double-slash",
                caseInsensitive : true
            }
        ],
        "doc_comment" : [
            commentWipMarkerRule("block"),
            natSpecRule("block"),
            {
                token : "comment.block.doc.documentation", // closing comment
                regex : "\\*\\/",
                next  : "pop"
            }, {
                defaultToken : "comment.block.doc.documentation",
                caseInsensitive : true
            }
        ],
        "doc_line_comment" : [
            commentWipMarkerRule("line"),
            natSpecRule("line"),
            {
                token : "comment.line.triple-slash.double-slash.doc.documentation",
                regex : "$|^",
                next  : "pop"
            }, {
                defaultToken : "comment.line.triple-slash.double-slash.doc.documentation",
                caseInsensitive : true
            }
        ],
        "qqstring" : [
            {
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "string.quoted.double", // Multi-line string by ending line with back-slash, i.e. escaping \n.
                regex : "\\\\$",
                next  : "qqstring"
            }, {
                token : "string.quoted.double",
                regex : '"|$',
                next  : "pop"
            }, {
                defaultToken : "string.quoted.double"
            }
        ],
        "qstring" : [
            {
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "string.quoted.single", // Multi-line string by ending line with back-slash, i.e. escaping \n.
                regex : "\\\\$",
                next  : "qstring"
            }, {
                token : "string.quoted.single",
                regex : "'|$",
                next  : "pop"
            }, {
                defaultToken : "string.quoted.single"
            }
        ]
    };
    var functionArgumentsRules = deepCopy(this.$rules["start"]);
    functionArgumentsRules.forEach(function(rule, ruleIndex) {
        if (rule.inheritingStateRuleId) {
            switch (rule.inheritingStateRuleId) {
                case "keywordMapper":
                    rule.token = functionArgumentsKeywordMapper;
                    break;
                case "punctuation":
                    rule.onMatch = function onFunctionArgumentsPunctuationMatch(value, currentState, stack) {
                        hasSeenFirstFunctionArgumentKeyword = false;
                        return rule.token;
                    };
                  break;
                case "lparen":
                    rule.next = pushFunctionArgumentsState;
                    break;
                case "rparen":
                    rule.next = "pop";
                    break;
                case "fixedNumberType":
                    rule.onMatch = function onFunctionArgumentsFixedNumberTypeMatch(value, currentState, stack) {
                        hasSeenFirstFunctionArgumentKeyword = true;
                        return rule.token;
                    };
                    break;
            }
            delete rule.inheritingStateRuleId;
            delete this.$rules["start"][ruleIndex].inheritingStateRuleId; // TODO Keep id if there will be more "child" states.
            functionArgumentsRules[ruleIndex] = rule;
        }
    }, this);
    this.$rules["function_arguments"] = functionArgumentsRules;

    this.normalizeRules();
};

oop.inherits(SolidityHighlightRules, TextHighlightRules);

exports.SolidityHighlightRules = SolidityHighlightRules;
});

ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(acequire, exports, module) {
"use strict";

var Range = acequire("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

ace.define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"], function(acequire, exports, module) {
"use strict";

var oop = acequire("../../lib/oop");
var Behaviour = acequire("../behaviour").Behaviour;
var TokenIterator = acequire("../../token_iterator").TokenIterator;
var lang = acequire("../../lib/lang");

var SAFE_INSERT_IN_TOKENS =
    ["text", "paren.rparen", "punctuation.operator"];
var SAFE_INSERT_BEFORE_TOKENS =
    ["text", "paren.rparen", "punctuation.operator", "comment"];

var context;
var contextCache = {};
var initContext = function(editor) {
    var id = -1;
    if (editor.multiSelect) {
        id = editor.selection.index;
        if (contextCache.rangeCount != editor.multiSelect.rangeCount)
            contextCache = {rangeCount: editor.multiSelect.rangeCount};
    }
    if (contextCache[id])
        return context = contextCache[id];
    context = contextCache[id] = {
        autoInsertedBrackets: 0,
        autoInsertedRow: -1,
        autoInsertedLineEnd: "",
        maybeInsertedBrackets: 0,
        maybeInsertedRow: -1,
        maybeInsertedLineStart: "",
        maybeInsertedLineEnd: ""
    };
};

var CstyleBehaviour = function() {
    this.add("braces", "insertion", function(state, action, editor, session, text) {
        var cursor = editor.getCursorPosition();
        var line = session.doc.getLine(cursor.row);
        if (text == '{') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && selected !== "{" && editor.getWrapBehavioursEnabled()) {
                return {
                    text: '{' + selected + '}',
                    selection: false
                };
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                if (/[\]\}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode) {
                    CstyleBehaviour.recordAutoInsert(editor, session, "}");
                    return {
                        text: '{}',
                        selection: [1, 1]
                    };
                } else {
                    CstyleBehaviour.recordMaybeInsert(editor, session, "{");
                    return {
                        text: '{',
                        selection: [1, 1]
                    };
                }
            }
        } else if (text == '}') {
            initContext(editor);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == '}') {
                var matching = session.$findOpeningBracket('}', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        } else if (text == "\n" || text == "\r\n") {
            initContext(editor);
            var closing = "";
            if (CstyleBehaviour.isMaybeInsertedClosing(cursor, line)) {
                closing = lang.stringRepeat("}", context.maybeInsertedBrackets);
                CstyleBehaviour.clearMaybeInsertedClosing();
            }
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar === '}') {
                var openBracePos = session.findMatchingBracket({row: cursor.row, column: cursor.column+1}, '}');
                if (!openBracePos)
                     return null;
                var next_indent = this.$getIndent(session.getLine(openBracePos.row));
            } else if (closing) {
                var next_indent = this.$getIndent(line);
            } else {
                CstyleBehaviour.clearMaybeInsertedClosing();
                return;
            }
            var indent = next_indent + session.getTabString();

            return {
                text: '\n' + indent + '\n' + next_indent + closing,
                selection: [1, indent.length, 1, indent.length]
            };
        } else {
            CstyleBehaviour.clearMaybeInsertedClosing();
        }
    });

    this.add("braces", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '{') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.end.column, range.end.column + 1);
            if (rightChar == '}') {
                range.end.column++;
                return range;
            } else {
                context.maybeInsertedBrackets--;
            }
        }
    });

    this.add("parens", "insertion", function(state, action, editor, session, text) {
        if (text == '(') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                return {
                    text: '(' + selected + ')',
                    selection: false
                };
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                CstyleBehaviour.recordAutoInsert(editor, session, ")");
                return {
                    text: '()',
                    selection: [1, 1]
                };
            }
        } else if (text == ')') {
            initContext(editor);
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == ')') {
                var matching = session.$findOpeningBracket(')', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        }
    });

    this.add("parens", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '(') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == ')') {
                range.end.column++;
                return range;
            }
        }
    });

    this.add("brackets", "insertion", function(state, action, editor, session, text) {
        if (text == '[') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                return {
                    text: '[' + selected + ']',
                    selection: false
                };
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                CstyleBehaviour.recordAutoInsert(editor, session, "]");
                return {
                    text: '[]',
                    selection: [1, 1]
                };
            }
        } else if (text == ']') {
            initContext(editor);
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == ']') {
                var matching = session.$findOpeningBracket(']', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        }
    });

    this.add("brackets", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '[') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == ']') {
                range.end.column++;
                return range;
            }
        }
    });

    this.add("string_dquotes", "insertion", function(state, action, editor, session, text) {
        if (text == '"' || text == "'") {
            initContext(editor);
            var quote = text;
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && selected !== "'" && selected != '"' && editor.getWrapBehavioursEnabled()) {
                return {
                    text: quote + selected + quote,
                    selection: false
                };
            } else {
                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                var leftChar = line.substring(cursor.column-1, cursor.column);
                if (leftChar == '\\') {
                    return null;
                }
                var tokens = session.getTokens(selection.start.row);
                var col = 0, token;
                var quotepos = -1; // Track whether we're inside an open quote.

                for (var x = 0; x < tokens.length; x++) {
                    token = tokens[x];
                    if (token.type == "string") {
                      quotepos = -1;
                    } else if (quotepos < 0) {
                      quotepos = token.value.indexOf(quote);
                    }
                    if ((token.value.length + col) > selection.start.column) {
                        break;
                    }
                    col += tokens[x].value.length;
                }
                if (!token || (quotepos < 0 && token.type !== "comment" && (token.type !== "string" || ((selection.start.column !== token.value.length+col-1) && token.value.lastIndexOf(quote) === token.value.length-1)))) {
                    if (!CstyleBehaviour.isSaneInsertion(editor, session))
                        return;
                    return {
                        text: quote + quote,
                        selection: [1,1]
                    };
                } else if (token && token.type === "string") {
                    var rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar == quote) {
                        return {
                            text: '',
                            selection: [1, 1]
                        };
                    }
                }
            }
        }
    });

    this.add("string_dquotes", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && (selected == '"' || selected == "'")) {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == selected) {
                range.end.column++;
                return range;
            }
        }
    });

};

    
CstyleBehaviour.isSaneInsertion = function(editor, session) {
    var cursor = editor.getCursorPosition();
    var iterator = new TokenIterator(session, cursor.row, cursor.column);
    if (!this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
        var iterator2 = new TokenIterator(session, cursor.row, cursor.column + 1);
        if (!this.$matchTokenType(iterator2.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS))
            return false;
    }
    iterator.stepForward();
    return iterator.getCurrentTokenRow() !== cursor.row ||
        this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_BEFORE_TOKENS);
};

CstyleBehaviour.$matchTokenType = function(token, types) {
    return types.indexOf(token.type || token) > -1;
};

CstyleBehaviour.recordAutoInsert = function(editor, session, bracket) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    if (!this.isAutoInsertedClosing(cursor, line, context.autoInsertedLineEnd[0]))
        context.autoInsertedBrackets = 0;
    context.autoInsertedRow = cursor.row;
    context.autoInsertedLineEnd = bracket + line.substr(cursor.column);
    context.autoInsertedBrackets++;
};

CstyleBehaviour.recordMaybeInsert = function(editor, session, bracket) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    if (!this.isMaybeInsertedClosing(cursor, line))
        context.maybeInsertedBrackets = 0;
    context.maybeInsertedRow = cursor.row;
    context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket;
    context.maybeInsertedLineEnd = line.substr(cursor.column);
    context.maybeInsertedBrackets++;
};

CstyleBehaviour.isAutoInsertedClosing = function(cursor, line, bracket) {
    return context.autoInsertedBrackets > 0 &&
        cursor.row === context.autoInsertedRow &&
        bracket === context.autoInsertedLineEnd[0] &&
        line.substr(cursor.column) === context.autoInsertedLineEnd;
};

CstyleBehaviour.isMaybeInsertedClosing = function(cursor, line) {
    return context.maybeInsertedBrackets > 0 &&
        cursor.row === context.maybeInsertedRow &&
        line.substr(cursor.column) === context.maybeInsertedLineEnd &&
        line.substr(0, cursor.column) == context.maybeInsertedLineStart;
};

CstyleBehaviour.popAutoInsertedClosing = function() {
    context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1);
    context.autoInsertedBrackets--;
};

CstyleBehaviour.clearMaybeInsertedClosing = function() {
    if (context) {
        context.maybeInsertedBrackets = 0;
        context.maybeInsertedRow = -1;
    }
};



oop.inherits(CstyleBehaviour, Behaviour);

exports.CstyleBehaviour = CstyleBehaviour;
});

ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(acequire, exports, module) {
"use strict";

var oop = acequire("../../lib/oop");
var Range = acequire("../../range").Range;
var BaseFoldMode = acequire("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/solidity",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/solidity_highlight_rules","ace/mode/matching_brace_outdent","ace/range","ace/worker/worker_client","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"], function(acequire, exports, module) {
"use strict";

var oop = acequire("../lib/oop");
var TextMode = acequire("./text").Mode;
var SolidityHighlightRules = acequire("./solidity_highlight_rules").SolidityHighlightRules;
var MatchingBraceOutdent = acequire("./matching_brace_outdent").MatchingBraceOutdent;
var Range = acequire("../range").Range;
var WorkerClient = acequire("../worker/worker_client").WorkerClient;
var CstyleBehaviour = acequire("./behaviour/cstyle").CstyleBehaviour;
var CStyleFoldMode = acequire("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = SolidityHighlightRules;

    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
            if (match) {
                indent += tab;
            }
        } else if (state == "doc_comment") {
            if (endState == "start") {
                return "";
            }
            var match = line.match(/^\s*(\/?)\*/);
            if (match) {
                if (match[1]) {
                    indent += " ";
                }
                indent += "* ";
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/solidity";
}).call(Mode.prototype);

exports.Mode = Mode;
});
