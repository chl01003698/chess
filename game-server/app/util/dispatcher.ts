import * as crc from 'crc'

export function dispatcher(uid: String, connectors: any) {
  let index = Math.abs(crc.crc32(uid)) % connectors.length
  return connectors[index]
}