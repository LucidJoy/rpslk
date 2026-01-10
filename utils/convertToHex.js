export function convertToHex(bytes) {
  const data = bytes.slice(2);
  const hex = "0x" + data;
  return hex;
}
