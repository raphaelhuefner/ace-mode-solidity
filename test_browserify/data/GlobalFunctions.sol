// https://solidity.readthedocs.io/en/develop/units-and-global-variables.html
// https://solidity.readthedocs.io/en/develop/miscellaneous.html#global-variables

contract GlobalFunctions {
  function h(uint256 param) payable external {
    bytes memory encoded1 = abi.encode("Hello", "World!"); // ABI-encodes the given arguments
    bytes memory encoded2 = abi.encodePacked("Hello", "World!"); // Performes packed encoding of the given arguments
    bytes memory encoded3 = abi.encodeWithSelector(0x12345678, "Hello", "World!"); // ABI-encodes the given arguments starting from the second and prepends the given four-byte selector
    bytes memory encoded4 = abi.encodeWithSignature("m(string,string)", "Hello", "World!"); // Equivalent to abi.encodeWithSelector(bytes4(keccak256(bytes(signature)), ...)
    bytes32 b1hash = block.blockhash(12); // hash of the given block - only works for 256 most recent, excluding current, blocks - deprecated in version 0.4.22 and replaced by blockhash(uint blockNumber).
    uint256 runway = gasleft(); // remaining gas
    assert(param < 10); // abort execution and revert state changes if condition is false (use for internal error)
    require(param < 10); // abort execution and revert state changes if condition is false (use for malformed input or error in external component)
    require(param < 10, "Value of `i` is too big!"); // abort execution and revert state changes if condition is false (use for malformed input or error in external component). Also provide error message.
    revert(); // abort execution and revert state changes
    revert("Better not!"); // abort execution and revert state changes providing an explanatory string
    bytes32 b2hash = blockhash(12); // hash of the given block - only works for 256 most recent blocks
    bytes32 khash = keccak256(hex'0123456789'); // compute the Ethereum-SHA-3 (Keccak-256) hash of the input
    bytes32 s3hash = sha3(hex'0123456789'); // a deprecated alias to keccak256
    bytes32 s256hash = sha256(hex'0123456789'); // compute the SHA-256 hash of the input
    bytes20 rhash = ripemd160(hex'0123456789'); // compute the RIPEMD-160 hash of the input
  }

  function i(uint256 param) payable external {
    // All I learned about `ecrecover()` is that people have difficulties to learn about `ecrecover()`.
    // Fortunately, I don't need to understand it yet, only to make it's syntax highlighting work:
    bytes32 b32 = hex'0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    address addy = ecrecover(b32, 0xff, b32, b32); // recover address associated with the public key from elliptic curve signature, return zero on error

    uint256 sum = addmod(1, 2, 3); // compute (x + y) % k where the addition is performed with arbitrary precision and does not wrap around at 2**256. Assert that k != 0 starting from version 0.5.0.
    uint256 prod = mulmod(1, 2, 3); // compute (x * y) % k where the multiplication is performed with arbitrary precision and does not wrap around at 2**256. Assert that k != 0 starting from version 0.5.0.
    selfdestruct(addy); // destroy the current contract, sending its funds to the given address
    suicide(addy); // a deprecated alias to selfdestruct
    bool success1 = addy.call(hex'01234567'); // issue low-level CALL with the given payload, returns false on failure, forwards all available gas, adjustable
    bool success2 = addy.callcode(hex'01234567'); // issue low-level CALLCODE with the given payload, returns false on failure, forwards all available gas, adjustable
    bool success3 = addy.delegatecall(hex'01234567'); // issue low-level DELEGATECALL with the given payload, returns false on failure, forwards all available gas, adjustable
    bool success4 = addy.send(1337); // send given amount of Wei to Address, returns false on failure
    addy.transfer(1337); // send given amount of Wei to Address, throws on failure
  }
}
