export const encodeBase64 = (str: string) => {
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
};


export const decodeBase64 = (base64: string) => {
    try {
        const utf8Bytes = atob(base64).split('').map(char => char.charCodeAt(0));
        return new TextDecoder().decode(new Uint8Array(utf8Bytes));
    } catch (e) {
        console.error('Decoding failed:', e);
        return '';
    }
};
