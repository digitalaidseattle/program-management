export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }


export function shuffle<T>(array: T[]): T[] {
    const result = [...array]; // make a copy (avoid mutating original)
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index
        [result[i], result[j]] = [result[j], result[i]]; // swap
    }
    return result;
}
