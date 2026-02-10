
import { Dependency, BuildStep } from './types';

export const BITCOIN_METADATA = {
  version: "0.01 ALPHA",
  copyright: "Copyright (c) 2009 Satoshi Nakamoto",
  license: "MIT/X11 Software License",
  licenseUrl: "http://www.opensource.org/licenses/mit-license.php",
  author: "Satoshi Nakamoto",
  originalLanguage: "Thai (Reconstructed)"
};

export const INTRODUCTION = {
  title: "บทนำ",
  content: "บิตคอยน์เป็นระบบเงินอิเล็กทรอนิกส์ที่ใช้เครือข่ายแบบบุคคลต่อบุคคลเพื่อป้องกันการใช้จ่ายซ้ำซ้อน เป็นระบบกระจายศูนย์อย่างสมบูรณ์โดยไม่มีเซิร์ฟเวอร์หรือหน่วยงานกลาง"
};

export const SETUP_INSTRUCTIONS = {
  title: "การตั้งค่าและการใช้งาน",
  steps: [
    "แตกไฟล์ลงในโฟลเดอร์แล้วเรียกใช้ bitcoin.exe",
    "ซอฟต์แวร์จะค้นหาโหนดอื่นเพื่อเชื่อมต่อโดยอัตโนมัติ",
    "ตั้งค่าไฟร์วอลล์ของคุณให้ส่งต่อพอร์ต 8333 ไปยังคอมพิวเตอร์ของคุณ",
    "หากต้องการสนับสนุนเครือข่าย ให้ไปที่: ตัวเลือก -> สร้างเหรียญ (Generate Coins)",
    "โปรแกรมจะทำงานในสถานะว่าง (Idle) เพื่อแก้ปัญหาการคำนวณที่ยากมาก"
  ],
  os_support: "Windows NT/2000/XP (และอาจรวมถึง Vista)"
};

export const DEPENDENCIES: Dependency[] = [
  {
    name: "wxWidgets",
    path: "\\wxWidgets",
    url: "http://www.wxwidgets.org/downloads/",
    license: "LGPL 2.1",
    description: "The original Graphical User Interface framework used for the Bitcoin wallet."
  },
  {
    name: "OpenSSL",
    path: "\\OpenSSL",
    url: "http://www.openssl.org/source/",
    license: "Old BSD",
    description: "Used for elliptic curve cryptography (secp256k1) and hashing."
  },
  {
    name: "Berkeley DB",
    path: "\\DB",
    url: "http://www.oracle.com/technology/software/products/berkeley-db/index.html",
    license: "Sleepycat (Open Source)",
    description: "The primary key-value storage system for blocks and transactions before LevelDB."
  },
  {
    name: "Boost",
    path: "\\Boost",
    url: "http://www.boost.org/users/download/",
    license: "Boost Software License (MIT-like)",
    description: "C++ libraries for networking, multi-threading, and general utilities."
  }
];

export const BUILD_STEPS: BuildStep[] = [
  {
    title: "OpenSSL (Modified)",
    instructions: [
      "Edit engines\\e_gmp.c to wrap rsa.h in #ifndef OPENSSL_NO_RSA",
      "Edit crypto\\err\\err_all.c to add ERR_load_RSA_strings stub",
      "Modify ms\\mingw32.bat to disable unnecessary crypto modules (no-aes, no-rsa, etc.)"
    ],
    command: "ms\\mingw32.bat"
  },
  {
    title: "Berkeley DB",
    instructions: [
      "Navigate to \\DB\\build_unix",
      "Run configure with mingw and cxx flags",
      "Execute make command"
    ],
    command: "sh ../dist/configure --enable-mingw --enable-cxx && make"
  }
];

export const TECHNICAL_ANALYSIS = {
  compilers: [
    {
      name: "MinGW GCC 3.4.5",
      purpose: "The standard for Windows/MinGW porting in 2009. Later versions introduced ABI changes that broke linking with older static libraries.",
      flags: "-mthreads -O3 -Wall",
      details: "Used -mthreads to ensure the C++ exception handling worked correctly in a multi-threaded environment (crucial for nodes)."
    },
    {
      name: "MSVC 6.0 SP6",
      purpose: "A decade-old compiler by 2009 standards. Satoshi used it for its lightweight runtime requirements (msvcrt.dll dependency only).",
      flags: "/GX /O2 /D 'WIN32'",
      details: "Required specific Service Pack 6 for stability. Includes specific flags for exception handling and optimization."
    }
  ],
  msvc_flag_details: [
    {
      flag: "/GX",
      name: "Enable Exception Handling",
      description: "Enables synchronous exception handling. This is critical for Bitcoin's C++ codebase because it ensures that C++ objects with automatic storage (on the stack) are correctly destroyed when an exception is thrown. Without this, RAII (Resource Acquisition Is Initialization) would fail, causing memory leaks or database corruption."
    },
    {
      flag: "/O2",
      name: "Maximize Speed",
      description: "Instructs the compiler to prioritize execution speed over binary size. It enables a suite of optimizations including inline expansion, global register allocation, and frame pointer omission. For a 2009 CPU, this was necessary to handle the initial hashing and verification of blocks efficiently."
    },
    {
      flag: "/D 'WIN32'",
      name: "Define WIN32 Macro",
      description: "Defines the preprocessor macro 'WIN32'. This is the standard way to signal to the code that it is being compiled for the Windows environment. It triggers the inclusion of Windows-specific headers and enables sections of code wrapped in #ifdef WIN32 blocks, which handle WinSock (networking) and file system operations."
    }
  ],
  openssl_hacks: [
    {
      flag: "Disable Unnecessary Crypto Modules (ms\\mingw32.bat)",
      meaning: "Modifying the build script to use 'no-aes', 'no-rsa', 'no-des', 'no-dh', 'no-dsa', etc.",
      rationale: "Bitcoin v0.01 only required SHA-256 for hashing and secp256k1 for ECDSA signatures. By disabling all other ciphers and algorithms, Satoshi drastically reduced the OpenSSL binary size and minimized the attack surface. This was crucial for a lean, focused client and avoided distributing unnecessary cryptographic bloat."
    },
    {
      flag: "Patch engines\\e_gmp.c",
      meaning: "Wrapping `#include <openssl/rsa.h>` with `#ifndef OPENSSL_NO_RSA`",
      rationale: "Even after disabling RSA with the 'no-rsa' flag in the build script, some OpenSSL engine files (like `e_gmp.c`) might still implicitly include `rsa.h`. This patch conditionally compiles the include directive, ensuring it's only processed if RSA *is* enabled, preventing compilation errors in a stripped-down build."
    },
    {
      flag: "Patch crypto\\err\\err_all.c",
      meaning: "Adding a stub for `ERR_load_RSA_strings()`",
      rationale: "When RSA was disabled via `no-rsa`, the `ERR_load_RSA_strings()` function (used for error message registration) would be omitted from the OpenSSL library. However, other parts of OpenSSL's error handling system might still try to call this function, leading to 'undefined reference' linker errors. Adding a minimal, empty stub function allowed the project to link successfully without re-enabling full RSA support."
    }
  ],
  pitfalls: [
    {
      title: "The libeay32.dll Race Condition",
      description: "The original build script (mingw32.bat) had a bug where it would stop on errors before generating the DLL, but sometimes leave partial files that caused phantom linkage errors."
    },
    {
      title: "Boost Version Hell",
      description: "Boost 1.35 was required for MSVC 6.0. Using newer 1.37+ versions led to template expansion errors that the 1998-era compiler couldn't handle."
    },
    {
      title: "Berkeley DB C++ Wrapper",
      description: "Forgetting --enable-cxx would build the C library but omit the C++ classes Bitcoin's db.cpp relied on, leading to 'undefined reference' errors during final linking."
    }
  ]
};
