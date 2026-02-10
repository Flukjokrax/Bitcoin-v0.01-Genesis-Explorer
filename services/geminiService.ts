import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a world-class blockchain archeologist and C++ expert specialized in the original Bitcoin v0.01 source code released by Satoshi Nakamoto in 2009. 
Your goal is to explain the historical significance, technical architecture, and challenges of the v0.01 codebase.

Key Technical Context for your responses:
- Philosophy: Bitcoin is a decentralized electronic cash system using peer-to-peer networking to prevent double-spending without central authority.
- Generate Coins: Users could mine by selecting "Options -> Generate Coins" (ตัวเลือก -> สร้างเหรียญ). It runs in idle time.
- Rewards: Blocks initially rewarded 50 BTC.
- Compilers: MinGW GCC 3.4.5 and MSVC 6.0 SP6. 
- MSVC Flags: 
  * /GX: Exception Handling.
  * /O2: Speed optimization.
  * /D 'WIN32': Target platform.
- OpenSSL 0.9.8h Patches:
  * "no-everything" flag: Drastically reduced binary size and attack surface by disabling most crypto (keeping only SHA-256, secp256k1).
  * 'e_gmp.c' patch: Wrapped 'rsa.h' include in '#ifndef OPENSSL_NO_RSA' to prevent errors when RSA was disabled.
  * 'err_all.c' patch: Added a stub for 'ERR_load_RSA_strings()' to resolve linker errors when RSA was disabled.
- Berkeley DB: Versions must be compiled with --enable-cxx.
- Port: 8333 is the primary network port.

Answer in the language the user uses (Thai or English). 
Be professional, technical, and slightly mysterious, fitting the cypherpunk theme. When asked about mining in v0.01, emphasize that it was built directly into the client as a CPU-only task.`;

export async function askSatoshi(prompt: string): Promise<string> {
  // Fix for "Uncaught SyntaxError: Missing initializer in const declaration"
  // Ensures that the API key is always a valid string literal, even if process.env.API_KEY
  // is undefined during esm.sh's transformation, preventing syntax errors.
  const ai = new GoogleGenAI({ apiKey: `${process.env.API_KEY || ''}` }); 
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    // Extract the text content using the .text property
    return response.text || "Connection to the 2009 network timed out...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Could not retrieve data from the genesis block.";
  }
}

/**
 * Queries Gemini for a deeper explanation of a specific technical detail.
 * @param title The title of the technical concept.
 * @param content The existing description of the technical concept.
 * @returns A promise that resolves to the AI's explanation.
 */
export async function explainTechnicalDetail(title: string, content: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: `${process.env.API_KEY || ''}` });

  const prompt = `Provide a concise yet detailed explanation for the following technical concept from the Bitcoin v0.01 codebase. Focus on its historical significance, technical architecture, and challenges related to v0.01. The concept is: **${title}**. Its static description is: **${content}**. Elaborate further as if explaining to a seasoned C++ developer in 2009.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Use Flash for faster responses for focused explanations
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "Further analysis from the archive node timed out.";
  } catch (error) {
    console.error("Gemini Technical Explanation Error:", error);
    return "Error: Deep dive analysis failed. The quantum entanglement with 2009 is unstable.";
  }
}