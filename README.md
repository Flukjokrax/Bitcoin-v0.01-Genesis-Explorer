# Bitcoin v0.01 Genesis Explorer

## Overview

A retro-themed historical explorer for the original Bitcoin v0.01 source code instructions by Satoshi Nakamoto. This application features an AI-powered code historian to explain 2009-era blockchain architecture and challenges.

## Project Details

*   **Version:** `v0.01 ALPHA` (Original Bitcoin Client)
*   **Copyright:** `Copyright (c) 2009 Satoshi Nakamoto`
*   **License:** `MIT/X11 Software License`
    *   [License Details](http://www.opensource.org/licenses/mit-license.php)
*   **Author:** Satoshi Nakamoto
*   **Original Client Language (UI):** Thai (Reconstructed from original UI elements and instructions)

## Introduction (บทนำ)

บิตคอยน์เป็นระบบเงินอิเล็กทรอนิกส์ที่ใช้เครือข่ายแบบบุคคลต่อบุคคลเพื่อป้องกันการใช้จ่ายซ้ำซ้อน เป็นระบบกระจายศูนย์อย่างสมบูรณ์โดยไม่มีเซิร์ฟเวอร์หรือหน่วยงานกลาง

*Bitcoin is an electronic cash system that uses a person-to-person network to prevent double-spending. It is a completely decentralized system with no central server or authority.*

## Setup and Usage (การตั้งค่าและการใช้งาน)

### Supported Operating Systems
*   Windows NT/2000/XP (และอาจรวมถึง Vista)

### Steps to Run (Original Client - Conceptual)
1.  แตกไฟล์ลงในโฟลเดอร์แล้วเรียกใช้ bitcoin.exe
    *   _Extract files to a folder and run bitcoin.exe._
2.  ซอฟต์แวร์จะค้นหาโหนดอื่นเพื่อเชื่อมต่อโดยอัตโนมัติ
    *   _The software will automatically search for other nodes to connect to._
3.  ตั้งค่าไฟร์วอลล์ของคุณให้ส่งต่อพอร์ต 8333 ไปยังคอมพิวเตอร์ของคุณ
    *   _Configure your firewall to forward port 8333 to your computer._
4.  หากต้องการสนับสนุนเครือข่าย ให้ไปที่: ตัวเลือก -> สร้างเหรียญ (Generate Coins)
    *   _To support the network, go to: Options -> Generate Coins._
5.  โปรแกรมจะทำงานในสถานะว่าง (Idle) เพื่อแก้ปัญหาการคำนวณที่ยากมาก
    *   _The program will run in an idle state to solve very difficult computational problems._

## Dependencies (Required Libraries - 2009 Stack)

The original Bitcoin v0.01 client relied on several external libraries:

*   **wxWidgets**
    *   **Description:** The original Graphical User Interface framework used for the Bitcoin wallet.
    *   **License:** LGPL 2.1
    *   [Download Source](http://www.wxwidgets.org/downloads/)
*   **OpenSSL**
    *   **Description:** Used for elliptic curve cryptography (secp256k1) and hashing (SHA-256).
    *   **License:** Old BSD
    *   [Download Source](http://www.openssl.org/source/)
*   **Berkeley DB**
    *   **Description:** The primary key-value storage system for blocks and transactions before LevelDB.
    *   **License:** Sleepycat (Open Source)
    *   [Download Source](http://www.oracle.com/technology/software/products/berkeley-db/index.html)
*   **Boost**
    *   **Description:** C++ libraries for networking, multi-threading, and general utilities.
    *   **License:** Boost Software License (MIT-like)
    *   [Download Source](http://www.boost.org/users/download/)

## Bitcoin v0.01 Build Process (Conceptual)

Compiling Bitcoin v0.01 in 2009 involved specific steps and considerations due to the era's toolchains and library versions. This explorer includes an interactive simulation of the build process, demonstrating each step and its potential outcome.

### Build Steps Examples

*   **OpenSSL (Modified)**
    *   Edit `engines\e_gmp.c` to wrap `rsa.h` in `#ifndef OPENSSL_NO_RSA`
    *   Edit `crypto\err\err_all.c` to add `ERR_load_RSA_strings` stub
    *   Modify `ms\mingw32.bat` to disable unnecessary crypto modules (e.g., `no-aes`, `no-rsa`)
    *   **Command:** `ms\mingw32.bat`
*   **Berkeley DB**
    *   Navigate to `\DB\build_unix`
    *   Run configure with mingw and cxx flags
    *   Execute make command
    *   **Command:** `sh ../dist/configure --enable-mingw --enable-cxx && make`

### Technical Analysis Highlights

*   **Compilers:**
    *   **MinGW GCC 3.4.5:** Standard for Windows/MinGW porting in 2009.
    *   **MSVC 6.0 SP6:** A decade-old compiler by 2009, chosen for its lightweight runtime requirements.
*   **OpenSSL Patches:** Critical modifications were made to OpenSSL to drastically reduce binary size and attack surface by disabling all cryptographic modules not essential to Bitcoin (keeping only SHA-256 and secp256k1). This involved conditional includes and stub functions to ensure a minimal build without compilation errors.
*   **Common Build Pitfalls:**
    *   **`libeay32.dll` Race Condition:** Build script bug leading to phantom linkage errors from partial DLL files.
    *   **Boost Version Hell:** Required Boost 1.35 for compatibility with MSVC 6.0; newer versions caused template expansion errors.
    *   **Berkeley DB C++ Wrapper:** Forgetting `--enable-cxx` during Berkeley DB compilation would omit C++ classes, leading to "undefined reference" errors.

For more in-depth technical details, explore the "Deep Dive" section within the application.

## AI Blockchain Archeologist

This application integrates an AI-powered historian designed to answer your queries about the Bitcoin v0.01 source code, its design choices, and the historical context of its development. Ask about compilers, cryptographic libraries, network philosophy, and more!

## Aesthetics

The explorer is designed with a retro-themed, CRT-like interface, evoking the feel of early 2000s computing and command-line interfaces.
