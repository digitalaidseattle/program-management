/**
 *  StringUtils.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

export class StringUtils {

    static capitalize(s: string) {
        return s[0].toUpperCase() + s.slice(1);
    }
}