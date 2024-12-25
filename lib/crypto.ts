import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || 'your-fallback-secret-key'

export function encryptData(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

export function decryptData(encryptedData: string): any {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    return null
  }
} 