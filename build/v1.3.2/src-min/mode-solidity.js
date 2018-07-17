define("ace/mode/solidity_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("../lib/lang").deepCopy,s=e("./text_highlight_rules").TextHighlightRules,o=function(e){var t="byte|int|uint";for(var n=8;n<=256;n+=8)t+="|bytes"+n/8+"|uint"+n+"|int"+n;var r={"variable.language":"this|super",keyword:"as|emit|from|import|returns","keyword.control":"break|continue|do|else|for|if|return|while","keyword.control.deprecated":"throw","keyword.operator":"delete|new","keyword.other.reserved":"abstract|after|alias|apply|auto|case|catch|copyof|default|define|final|immutable|implements|in|inline|let|macro|match|mutable|null|of|override|partial|promise|reference|relocatable|sealed|sizeof|static|supports|switch|try|type|typedef|typeof|unchecked","storage.type":"contract|library|interface|function|constructor|event|modifier|struct|mapping|enum|var|bool|address|"+t,"storage.type.array.dynamic":"bytes|string","storage.modifier.inheritance":"is","storage.modifier.storagelocation":"storage|memory|calldata","storage.modifier.statemutability":"constant|payable|pure|view","storage.modifier.visibility":"private|public|external|internal","storage.modifier.event":"anonymous|indexed","support.function":"addmod|assert|blockhash|ecrecover|gasleft|keccak256|mulmod|require|revert|ripemd160|selfdestruct|sha256","support.function.deprecated":"sha3|suicide","support.variable":"now","constant.language.boolean":"true|false","constant.numeric.other.unit.currency":"wei|szabo|finney|ether","constant.numeric.other.unit.time":"seconds|minutes|hours|days|weeks","constant.numeric.other.unit.time.deprecated":"years"},s=this.createKeywordMapper(r,"identifier"),o=!1,u=function(t){var n=s(t);return o&&"identifier"==n&&(n="variable.parameter"),o=!0,n},a="[a-zA-Z_$][a-zA-Z_$0-9]*\\b|\\$",f="\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|.)",l=function(t){return{token:"comment."+t+".doc.documentation.tag.storage.type",regex:"\\b(?:TODO|FIXME|XXX|HACK)\\b"}},c=function(t){return{token:"comment."+t+".doc.documentation.tag",regex:"\\B@(?:author|dev|notice|param|return|title)\\b"}},h=function(e,t){return(e!="start"||t.length)&&t.unshift("function_arguments",e),o=!1,"function_arguments"};this.$rules={start:[{token:"comment.block.doc.documentation",regex:"\\/\\*(?=\\*)",push:"doc_comment"},{token:"comment.line.triple-slash.double-slash.doc.documentation",regex:"\\/\\/\\/",push:"doc_line_comment"},{token:"comment.block",regex:"\\/\\*",push:"comment"},{token:"comment.line.double-slash",regex:"\\/\\/",push:"line_comment"},{token:"text",regex:"\\s+|^$"},{token:"string.quoted.single",regex:"'(?=.)",push:"qstring"},{token:"string.quoted.double",regex:'"(?=.)',push:"qqstring"},{token:"storage.type.reserved",regex:"u?fixed(?:8x[0-8]|16x(?:1[0-6]|[0-9])|24x(?:2[0-4]|1[0-9]|[0-9])|32x(?:3[0-2]|[1-2][0-9]|[0-9])|40x(?:40|[1-3][0-9]|[0-9])|48x(?:4[0-8]|[1-3][0-9]|[0-9])|56x(?:5[0-6]|[1-4][0-9]|[0-9])|64x(?:6[0-4]|[1-5][0-9]|[0-9])|72x(?:7[0-2]|[1-6][0-9]|[0-9])|(?:80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)x(?:80|[1-7][0-9]|[0-9]))?",inheritingStateRuleId:"fixedNumberType"},{token:"keyword.control",regex:/\b_\b/},{token:["string.other.hex","string.other.hex","string.other.hex","string.other.hex","string.other.hex"],regex:/(\b)(hex)(['"])((?:[0-9a-fA-F]{2})*)(\3)/},{token:"constant.numeric.hex",regex:/0[xX][0-9a-fA-F]+\b/},{token:"constant.numeric",regex:/[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/},{token:["keyword","text","keyword","text","constant.other"],regex:"(pragma)(\\s+)(solidity|experimental)(\\s+)([^;]+)"},{token:["keyword","text","identifier","text","keyword","text","identifier"],regex:"(using)(\\s+)("+a+")(\\s+)(for)(\\s+)("+a+"|\\*)"},{token:"support.function.deprecated",regex:/block\s*\.\s*blockhash|\.\s*callcode/},{token:"support.function",regex:/abi\s*\.\s*(?:encodeWithSignature|encodeWithSelector|encodePacked|encode)|\.\s*(?:delegatecall|transfer|call|send)/},{token:"support.variable",regex:/block\s*\.\s*(?:difficulty|timestamp|coinbase|gaslimit|number)|msg\s*\.\s*(?:sender|value|data)|tx\s*\.\s*(?:gasprice|origin)|\.\s*balance/},{token:"support.variable.deprecated",regex:/msg\s*\.\s*gas/},{token:["storage.type","text","entity.name.function","text","paren.lparen"],regex:"(function)(\\s+)("+a+")(\\s*)(\\()",next:h},{token:["storage.type","text","paren.lparen"],regex:"(function)(\\s*)(\\()",next:h},{token:["keyword","text","paren.lparen"],regex:"(returns)(\\s*)(\\()",next:h},{token:s,regex:a,inheritingStateRuleId:"keywordMapper"},{token:"keyword.operator",regex:/--|\*\*|\+\+|=>|<<|>>|<<=|>>=|&&|\|\||[!&|+\-*\/%~^<>=]=?/},{token:"punctuation.operator",regex:/[?:;]/},{token:"punctuation.operator",regex:/[.,]/,inheritingStateRuleId:"punctuation"},{token:"paren.lparen",regex:/[\[{]/},{token:"paren.lparen",regex:/[(]/,inheritingStateRuleId:"lparen"},{token:"paren.rparen",regex:/[\]}]/},{token:"paren.rparen",regex:/[)]/,inheritingStateRuleId:"rparen"}],comment:[l("block"),{token:"comment.block",regex:"\\*\\/",next:"pop"},{defaultToken:"comment.block",caseInsensitive:!0}],line_comment:[l("line"),{token:"comment.line.double-slash",regex:"$|^",next:"pop"},{defaultToken:"comment.line.double-slash",caseInsensitive:!0}],doc_comment:[l("block"),c("block"),{token:"comment.block.doc.documentation",regex:"\\*\\/",next:"pop"},{defaultToken:"comment.block.doc.documentation",caseInsensitive:!0}],doc_line_comment:[l("line"),c("line"),{token:"comment.line.triple-slash.double-slash.doc.documentation",regex:"$|^",next:"pop"},{defaultToken:"comment.line.triple-slash.double-slash.doc.documentation",caseInsensitive:!0}],qqstring:[{token:"constant.language.escape",regex:f},{token:"string.quoted.double",regex:"\\\\$",next:"qqstring"},{token:"string.quoted.double",regex:'"|$',next:"pop"},{defaultToken:"string.quoted.double"}],qstring:[{token:"constant.language.escape",regex:f},{token:"string.quoted.single",regex:"\\\\$",next:"qstring"},{token:"string.quoted.single",regex:"'|$",next:"pop"},{defaultToken:"string.quoted.single"}]};var p=i(this.$rules.start);p.forEach(function(e,t){if(e.inheritingStateRuleId){switch(e.inheritingStateRuleId){case"keywordMapper":e.token=u;break;case"punctuation":e.onMatch=function(n,r,i){return o=!1,e.token};break;case"lparen":e.next=h;break;case"rparen":e.next="pop";break;case"fixedNumberType":e.onMatch=function(n,r,i){return o=!0,e.token}}delete e.inheritingStateRuleId,delete this.$rules.start[t].inheritingStateRuleId,p[t]=e}},this),this.$rules.function_arguments=p,this.normalizeRules()};r.inherits(o,s),t.SolidityHighlightRules=o}),define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){"use strict";var r=e("../range").Range,i=function(){};(function(){this.checkOutdent=function(e,t){return/^\s+$/.test(e)?/^\s*\}/.test(t):!1},this.autoOutdent=function(e,t){var n=e.getLine(t),i=n.match(/^(\s*\})/);if(!i)return 0;var s=i[1].length,o=e.findMatchingBracket({row:t,column:s});if(!o||o.row==t)return 0;var u=this.$getIndent(e.getLine(o.row));e.replace(new r(t,0,t,s-1),u)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(i.prototype),t.MatchingBraceOutdent=i}),define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,n){"use strict";var r=e("../../lib/oop"),i=e("../../range").Range,s=e("./fold_mode").FoldMode,o=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};r.inherits(o,s),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var r=e.getLine(n);if(this.singleLineBlockCommentRe.test(r)&&!this.startRegionRe.test(r)&&!this.tripleStarBlockCommentRe.test(r))return"";var i=this._getFoldWidgetBase(e,t,n);return!i&&this.startRegionRe.test(r)?"start":i},this.getFoldWidgetRange=function(e,t,n,r){var i=e.getLine(n);if(this.startRegionRe.test(i))return this.getCommentRegionBlock(e,i,n);var s=i.match(this.foldingStartMarker);if(s){var o=s.index;if(s[1])return this.openingBracketBlock(e,s[1],n,o);var u=e.getCommentFoldRange(n,o+s[0].length,1);return u&&!u.isMultiLine()&&(r?u=this.getSectionRange(e,n):t!="all"&&(u=null)),u}if(t==="markbegin")return;var s=i.match(this.foldingStopMarker);if(s){var o=s.index+s[0].length;return s[1]?this.closingBracketBlock(e,s[1],n,o):e.getCommentFoldRange(n,o,-1)}},this.getSectionRange=function(e,t){var n=e.getLine(t),r=n.search(/\S/),s=t,o=n.length;t+=1;var u=t,a=e.getLength();while(++t<a){n=e.getLine(t);var f=n.search(/\S/);if(f===-1)continue;if(r>f)break;var l=this.getFoldWidgetRange(e,"all",t);if(l){if(l.start.row<=s)break;if(l.isMultiLine())t=l.end.row;else if(r==f)break}u=t}return new i(s,o,u,e.getLine(u).length)},this.getCommentRegionBlock=function(e,t,n){var r=t.search(/\s*$/),s=e.getLength(),o=n,u=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,a=1;while(++n<s){t=e.getLine(n);var f=u.exec(t);if(!f)continue;f[1]?a--:a++;if(!a)break}var l=n;if(l>o)return new i(o,r,l,t.length)}}.call(o.prototype)}),define("ace/mode/solidity",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/solidity_highlight_rules","ace/mode/matching_brace_outdent","ace/range","ace/worker/worker_client","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text").Mode,s=e("./solidity_highlight_rules").SolidityHighlightRules,o=e("./matching_brace_outdent").MatchingBraceOutdent,u=e("../range").Range,a=e("../worker/worker_client").WorkerClient,f=e("./behaviour/cstyle").CstyleBehaviour,l=e("./folding/cstyle").FoldMode,c=function(){this.HighlightRules=s,this.$outdent=new o,this.$behaviour=new f,this.foldingRules=new l};r.inherits(c,i),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=this.getTokenizer().getLineTokens(t,e),s=i.tokens,o=i.state;if(s.length&&s[s.length-1].type=="comment")return r;if(e=="start"){var u=t.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);u&&(r+=n)}else if(e=="doc_comment"){if(o=="start")return"";var u=t.match(/^\s*(\/?)\*/);u&&(u[1]&&(r+=" "),r+="* ")}return r},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/solidity"}.call(c.prototype),t.Mode=c});
                (function() {
                    window.require(["ace/mode/solidity"], function(m) {
                        if (typeof module == "object") {
                            module.exports = m;
                        }
                    });
                })();
            