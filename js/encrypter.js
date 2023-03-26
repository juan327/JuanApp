// Función para generar la clave a partir de una contraseña
function generateKey(password) {
    const salt = 'MySaltValue'; // Valor de sal fijo
    const iterations = 10000; // Número de iteraciones
    const keySize = 256 / 32; // Tamaño de la clave en palabras de 32 bits

    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: keySize,
        iterations: iterations,
        hasher: CryptoJS.algo.SHA256
    });

    return key;
}

// Función para encriptar un texto con AES y una clave dada en modo ECB
function Encrypt(password, text) {
    const salt = generateKey(password);
    const key256Bits = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32 }); // Generar una clave de 256 bits utilizando PBKDF2
    const cipherText = CryptoJS.AES.encrypt(text, key256Bits, {
      mode: CryptoJS.mode.ECB, // Modo de cifrado ECB
      padding: CryptoJS.pad.Pkcs7, // Relleno PKCS#7 (por defecto)
      iv: '' // Desactivar el vector de inicialización aleatorio
    }).toString();
    return cipherText;
}
  
// Función para desencriptar un texto cifrado con AES y una clave dada en modo ECB
function Decrypt(password, cipherText) {
    const salt = generateKey(password);
    const key256Bits = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32 }); // Generar una clave de 256 bits utilizando PBKDF2
    const decryptedText = CryptoJS.AES.decrypt(cipherText, key256Bits, {
      mode: CryptoJS.mode.ECB, // Modo de cifrado ECB
      padding: CryptoJS.pad.Pkcs7, // Relleno PKCS#7 (por defecto)
      iv: '' // Desactivar el vector de inicialización aleatorio
    }).toString(CryptoJS.enc.Utf8);
    return decryptedText;
}
  
