// ImportDirective = 'import' StringLiteral ('as' Identifier)? ';'
//         | 'import' ('*' | Identifier) ('as' Identifier)? 'from' StringLiteral ';'
//         | 'import' '{' Identifier ('as' Identifier)? ( ',' Identifier ('as' Identifier)? )* '}' 'from' StringLiteral ';'

import "./other.sol";
import "./other.sol" as other;
import * from "./other.sol";
import other from "./other.sol";
import * as other from "./other.sol";
import other as something from "./other.sol";
import {other} from "./other.sol";
import {other as something} from "./other.sol";
import {other, something} from "./other.sol";
import {other as something, more} from "./other.sol";
import {other as something, more as something_else} from "./other.sol";
import {other as something, more, even_more as completely_different} from "./other.sol";
import {other as something, more as something_else, even_more as completely_different} from "./other.sol";
