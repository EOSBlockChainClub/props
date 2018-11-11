# CMake generated Testfile for 
# Source directory: /Users/surabhilodha/code/eos/contracts/identity
# Build directory: /Users/surabhilodha/code/eos/build/contracts/identity
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test(validate_identity_abi "/Users/surabhilodha/code/eos/build/scripts/abi_is_json.py" "/Users/surabhilodha/code/eos/contracts/identity/identity.abi")
subdirs("test")
