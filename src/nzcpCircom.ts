import { DID_DOCUMENTS, verifyPassURIOffline } from "@vaxxnz/nzcp";
import { encodeToBeSigned } from "./nzcp";

export function prepareToBeSigned(input: Uint8Array, maxLen: number) {
  const bytes = new Uint8Array(maxLen);
  for (let i = 0; i < input.length; i++) {
    bytes[i] = input[i];
  }
  const bytesLen = input.length;
  return { bytes, bytesLen };
}

export function getNZCPPubIdentity(passURI: string, isLive: boolean) {
  const verificationResult = verifyPassURIOffline(passURI, { didDocument: isLive ? DID_DOCUMENTS.MOH_LIVE : DID_DOCUMENTS.MOH_EXAMPLE })
  if (!verificationResult.success) {
    throw new Error('Invalid COVID pass')
  }
  const credentialSubject = verificationResult.credentialSubject
  const { givenName, familyName, dob } = credentialSubject;
  const credSubjConcat = `${givenName},${familyName},${dob}`
  const toBeSignedByteArray = encodeToBeSigned(passURI)
  const credSubjHash = crypto.subtle.digest("SHA-256", new TextEncoder().encode(credSubjConcat))
  const toBeSignedHash = crypto.subtle.digest("SHA-256", toBeSignedByteArray)
  const exp = verificationResult.raw.exp
  const pubIdentity = { credSubjHash, toBeSignedHash, exp };
  console.log('credSubjConcat', credSubjConcat);
  console.log('pubIdentity', pubIdentity);
  return pubIdentity;
}
