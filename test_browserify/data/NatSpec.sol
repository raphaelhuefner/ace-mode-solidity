// https://solidity.readthedocs.io/en/develop/layout-of-source-files.html#comments

// Double-Asterisk doc comments

/** @title Shape calculator. */
contract ShapeCalculator {
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
    function rectangle(uint w, uint h) returns (uint s, uint p) {
        s = w * h;
        p = 2 * (w + h);
    }
}

// Triple-Slash doc comments

/// @title Shape calculator.
contract ShapeCalculator2 {
    /// @dev Calculates a rectangle's surface and perimeter.
    /// @param w Width of the rectangle.
    /// @param h Height of the rectangle.
    /// @return s The calculated surface.
    /// @return p The calculated perimeter.
    function rectangle(uint w, uint h) returns (uint s, uint p) {
        s = w * h;
        p = 2 * (w + h);
    }
}

// https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format

/// @title A simulator for Bugs Bunny, the most famous Rabbit
/// @author Warned Bros
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implement without side effects
contract BugsBunny {
    /// @author Bob Clampett
    /// @notice Determine if Bugs will accept `(_food)` to eat
    /// @dev String comparison may be inefficient
    /// @param _food The name of a food to evaluate (English)
    /// @return true if Bugs will eat it, false otherwise
    function doesEat(string _food) external pure returns (bool) {
        return keccak256(_food) == keccak256("carrot");
    }
}

// https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format#dynamic-expressions

/// @author email.address@not-highlighted.com
contract ShowcaseDynamicComments {
  /// @notice Send `(valueInmGAV / 1000).fixed(0,3)` GAV from the account of 
  /// `message.caller.address()` to an account accessible only by `to.address()`
  function send(address to, uint256 valueInmGAV) {
  }
}

// The following simple comments should not have NatSpec highlighting:

// @title A simulator for Bugs Bunny, the most famous Rabbit
// @author Warned Bros
// @notice You can use this contract for only the most basic simulation
// @dev All function calls are currently implement without side effects
// @param _food The name of a food to evaluate (English)
// @return true if Bugs will eat it, false otherwise

/*
 * @title A simulator for Bugs Bunny, the most famous Rabbit
 * @author Warned Bros
 * @notice You can use this contract for only the most basic simulation
 * @dev All function calls are currently implement without side effects
 * @param _food The name of a food to evaluate (English)
 * @return true if Bugs will eat it, false otherwise
 */
