const lowercaseConnectors = new Set([
  'atau',
  'bagi',
  'dalam',
  'dari',
  'di',
  'dengan',
  'for',
  'ke',
  'of',
  'on',
  'pada',
  'per',
  'tanpa',
  'to',
  'untuk',
  'yang',
]);

const preservedTokens: Record<string, string> = {
  api: 'API',
  apt: 'apt',
  ble: 'BLE',
  bmhp: 'BMHP',
  bb: 'BB',
  bpjs: 'BPJS',
  cppt: 'CPPT',
  cogs: 'COGS',
  dr: 'dr',
  ed: 'ED',
  emr: 'EMR',
  fefo: 'FEFO',
  fhir: 'FHIR',
  his: 'HIS',
  icd: 'ICD',
  id: 'ID',
  idr: 'IDR',
  ihs: 'IHS',
  imt: 'IMT',
  iv: 'IV',
  jkn: 'JKN',
  jpeg: 'JPEG',
  jpg: 'JPG',
  kfa: 'KFA',
  kptl: 'KPTL',
  ktp: 'KTP',
  mna: 'MNA',
  must: 'MUST',
  nik: 'NIK',
  no: 'No',
  nrs: 'NRS',
  ns: 'Ns',
  ppn: 'PPN',
  qris: 'QRIS',
  rm: 'RM',
  rt: 'RT',
  rw: 'RW',
  sdmk: 'SDMK',
  satusehat: 'SATUSEHAT',
  sf: 'SF',
  sip: 'SIP',
  sipa: 'SIPA',
  simkt: 'SIMKT',
  sku: 'SKU',
  snomed: 'SNOMED',
  sop: 'SOP',
  str: 'STR',
  tb: 'TB',
  tv: 'TV',
  usb: 'USB',
  who: 'WHO',
  wib: 'WIB',
};

/**
 * Formats static UI labels only. Do not use for descriptions, clinical content,
 * database values, external data, codes, or user-entered text.
 */
export function standardizeUiLabel(value: string): string {
  const normalizedEntities = value.replace(/&amp;?(?![\p{L}\p{N}])/giu, '&amp;');
  const withAmpersands = normalizedEntities.replace(/\bdan\b/giu, '&');
  let wordIndex = 0;

  return withAmpersands.replace(/&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]*);|[\p{L}\p{M}]+/giu, (token) => {
    if (token.startsWith('&') && token.endsWith(';')) return token;
    const lower = token.toLocaleLowerCase('id-ID');
    const preserved = preservedTokens[lower];
    const isFirstWord = wordIndex === 0;
    wordIndex += 1;

    if (preserved) return preserved;
    if (!isFirstWord && lowercaseConnectors.has(lower)) return lower;
    return `${lower.charAt(0).toLocaleUpperCase('id-ID')}${lower.slice(1)}`;
  });
}