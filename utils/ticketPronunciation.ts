export const indonesianDigits: Record<string, string> = {
    0: 'kosong', 1: 'satu', 2: 'dua', 3: 'tiga', 4: 'empat',
    5: 'lima', 6: 'enam', 7: 'tujuh', 8: 'delapan', 9: 'sembilan',
};

export const indonesianLetters: Record<string, string> = {
    A: 'a', B: 'b', C: 'c', D: 'd', E: 'e', F: 'f', G: 'g',
    H: 'h', I: 'i', J: 'j', K: 'k', L: 'l', M: 'm', N: 'n',
    O: 'o', P: 'p', Q: 'q', R: 'r', S: 's', T: 't', U: 'u',
    V: 'v', W: 'w', X: 'x', Y: 'y', Z: 'z',
};

export const spokenTicketCharacters = (ticketNumber: string, speakZeroDigits = true): string[] => {
    return String(ticketNumber ?? '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .split('')
        .filter((character) => speakZeroDigits || character !== '0'); //[cite: 8]
};

export const formatTicketNumberForSpeech = (ticketNumber: string, speakZeroDigits = true): string => {
    return spokenTicketCharacters(ticketNumber, speakZeroDigits)
        .map((character) => indonesianDigits[character] ?? indonesianLetters[character] ?? character)
        .join(', '); //[cite: 8]
};