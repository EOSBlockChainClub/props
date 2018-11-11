# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.11

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/local/Cellar/cmake/3.11.3/bin/cmake

# The command to remove a file.
RM = /usr/local/Cellar/cmake/3.11.3/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/surabhilodha/code/eos

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/surabhilodha/code/eos/build

# Utility rule file for eosio.bios.

# Include the progress variables for this target.
include contracts/eosio.bios/CMakeFiles/eosio.bios.dir/progress.make

contracts/eosio.bios/CMakeFiles/eosio.bios: contracts/eosio.bios/eosio.bios.wast.hpp
contracts/eosio.bios/CMakeFiles/eosio.bios: contracts/eosio.bios/eosio.bios.abi.hpp
contracts/eosio.bios/CMakeFiles/eosio.bios: contracts/eosio.bios/eosio.bios.wasm


contracts/eosio.bios/eosio.bios.wast.hpp: contracts/eosio.bios/eosio.bios.wast
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/surabhilodha/code/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Generating eosio.bios.wast.hpp"
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && echo "const char* const eosio_bios_wast = R\"=====(" > /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.wast.hpp
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && cat /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.wast >> /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.wast.hpp
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && echo ")=====\";" >> /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.wast.hpp

contracts/eosio.bios/eosio.bios.abi.hpp: contracts/eosio.bios/eosio.bios.abi
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/surabhilodha/code/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Generating eosio.bios.abi.hpp"
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && echo "const char* const eosio_bios_abi = R\"=====(" > /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.abi.hpp
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && cat /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.abi >> /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.abi.hpp
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && echo ")=====\";" >> /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.abi.hpp

contracts/eosio.bios/eosio.bios.wasm: contracts/eosio.bios/eosio.bios.wast
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/surabhilodha/code/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Generating WASM eosio.bios.wasm"
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && /Users/surabhilodha/code/eos/build/libraries/wasm-jit/Source/Programs/eosio-wast2wasm /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.wast /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.wasm -n

contracts/eosio.bios/eosio.bios.wast: contracts/eosio.bios/eosio.bios.s
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/surabhilodha/code/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Generating WAST eosio.bios.wast"
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && /Users/surabhilodha/code/eos/build/externals/binaryen/bin/eosio-s2wasm -o /Users/surabhilodha/code/eos/build/contracts/eosio.bios/eosio.bios.wast -s 10240 eosio.bios.s

contracts/eosio.bios/eosio.bios.s: contracts/eosio.bios/eosio.bios.bc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/surabhilodha/code/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Generating textual assembly eosio.bios.s"
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && /usr/local/wasm/bin/llc -thread-model=single -asm-verbose=false -o eosio.bios.s eosio.bios.bc

contracts/eosio.bios/eosio.bios.bc: contracts/eosio.bios/eosio.bios.cpp.bc
contracts/eosio.bios/eosio.bios.bc: contracts/libc++/libc++.bc
contracts/eosio.bios/eosio.bios.bc: contracts/musl/libc.bc
contracts/eosio.bios/eosio.bios.bc: contracts/eosiolib/eosiolib.bc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/surabhilodha/code/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Linking LLVM bitcode executable eosio.bios.bc"
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && /usr/local/wasm/bin/llvm-link -only-needed -o eosio.bios.bc eosio.bios.cpp.bc /Users/surabhilodha/code/eos/build/contracts/libc++/libc++.bc /Users/surabhilodha/code/eos/build/contracts/musl/libc.bc /Users/surabhilodha/code/eos/build/contracts/eosiolib/eosiolib.bc

contracts/eosio.bios/eosio.bios.cpp.bc: ../contracts/eosio.bios/eosio.bios.cpp
contracts/eosio.bios/eosio.bios.cpp.bc: ../contracts/eosio.bios/eosio.bios.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/surabhilodha/code/eos/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_7) "Building LLVM bitcode eosio.bios.cpp.bc"
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && /usr/local/wasm/bin/clang -emit-llvm -O3 --std=c++14 --target=wasm32 -ffreestanding -nostdlib -nostdlibinc -DBOOST_DISABLE_ASSERTS -DBOOST_EXCEPTION_DISABLE -fno-threadsafe-statics -fno-rtti -fno-exceptions -c /Users/surabhilodha/code/eos/contracts/eosio.bios/eosio.bios.cpp -o eosio.bios.cpp.bc -Weverything -Wno-c++98-compat -Wno-old-style-cast -Wno-vla -Wno-vla-extension -Wno-c++98-compat-pedantic -Wno-missing-prototypes -Wno-missing-variable-declarations -Wno-packed -Wno-padded -Wno-c99-extensions -Wno-documentation-unknown-command -I /Users/surabhilodha/code/eos/contracts -I /Users/surabhilodha/code/eos/build/contracts -I /Users/surabhilodha/code/eos/externals/magic_get/include -isystem /Users/surabhilodha/code/eos/contracts/libc++/upstream/include -isystem /Users/surabhilodha/code/eos/contracts/musl/upstream/include -isystem /usr/local/include

eosio.bios: contracts/eosio.bios/CMakeFiles/eosio.bios
eosio.bios: contracts/eosio.bios/eosio.bios.wast.hpp
eosio.bios: contracts/eosio.bios/eosio.bios.abi.hpp
eosio.bios: contracts/eosio.bios/eosio.bios.wasm
eosio.bios: contracts/eosio.bios/eosio.bios.wast
eosio.bios: contracts/eosio.bios/eosio.bios.s
eosio.bios: contracts/eosio.bios/eosio.bios.bc
eosio.bios: contracts/eosio.bios/eosio.bios.cpp.bc
eosio.bios: contracts/eosio.bios/CMakeFiles/eosio.bios.dir/build.make

.PHONY : eosio.bios

# Rule to build all files generated by this target.
contracts/eosio.bios/CMakeFiles/eosio.bios.dir/build: eosio.bios

.PHONY : contracts/eosio.bios/CMakeFiles/eosio.bios.dir/build

contracts/eosio.bios/CMakeFiles/eosio.bios.dir/clean:
	cd /Users/surabhilodha/code/eos/build/contracts/eosio.bios && $(CMAKE_COMMAND) -P CMakeFiles/eosio.bios.dir/cmake_clean.cmake
.PHONY : contracts/eosio.bios/CMakeFiles/eosio.bios.dir/clean

contracts/eosio.bios/CMakeFiles/eosio.bios.dir/depend:
	cd /Users/surabhilodha/code/eos/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/surabhilodha/code/eos /Users/surabhilodha/code/eos/contracts/eosio.bios /Users/surabhilodha/code/eos/build /Users/surabhilodha/code/eos/build/contracts/eosio.bios /Users/surabhilodha/code/eos/build/contracts/eosio.bios/CMakeFiles/eosio.bios.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : contracts/eosio.bios/CMakeFiles/eosio.bios.dir/depend
