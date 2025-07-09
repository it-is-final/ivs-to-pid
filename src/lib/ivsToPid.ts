/*
 * This file is part of ivs-to-pid.
 * © 2025 Luong "final" Truong
 * © 2017-2024 by Admiral_Fish, bumba, and EzPzStreamz
 *
 * ivs-to-pid is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ivs-to-pid is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ivs-to-pid. If not, see <https://www.gnu.org/licenses/>.
 */

export const stats = [
    "hp",
    "attack",
    "defense",
    "specialAttack",
    "specialDefense",
    "speed",
] as const;
export type Stat = (typeof stats)[number];

export const rngMethods = [
    "Method 1",
    "Reverse Method 1",
    "Method 2",
    "Method 4",
] as const;
export type RngMethod = (typeof rngMethods)[number];

export const genders = ["Gender unknown", "Male", "Female"] as const;
export type Gender = (typeof genders)[number];

export const genderRatios = [
    "U",
    "M",
    "7M-1F",
    "3M-1F",
    "1M-1F",
    "1M-3F",
    "F",
] as const;
export type GenderRatio = (typeof genderRatios)[number];

export const natures = [
    "Hardy",
    "Lonely",
    "Brave",
    "Adamant",
    "Naughty",
    "Bold",
    "Docile",
    "Relaxed",
    "Impish",
    "Lax",
    "Timid",
    "Hasty",
    "Serious",
    "Jolly",
    "Naive",
    "Modest",
    "Mild",
    "Quiet",
    "Bashful",
    "Rash",
    "Calm",
    "Gentle",
    "Sassy",
    "Careful",
    "Quirky",
] as const;
export type Nature = (typeof natures)[number];

const genderRatioNumbers = {
    "M": 0,
    "7M-1F": 31,
    "3M-1F": 63,
    "1M-1F": 127,
    "1M-3F": 191,
    "F": 254,
    "U": 255,
} as const;

class PokeRngR {
    state: number;

    constructor(seed: number) {
        this.state = seed >>> 0;
    }

    next32(advances = 1) {
        for (let i = 0; i < advances; i++) {
            this.state =
                (Math.imul(this.state, 0xeeb9eb65 | 0) + 0xa3561a1) >>> 0;
        }
        return this.state;
    }

    next16(advances = 1) {
        return this.next32(advances) >>> 16;
    }
}

function recoverIvSeed(
    hp: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number,
    ivInterrupt: boolean,
): number[] {
    // All of the extra bitwise operations (`|0` or `>>>0`)
    // is used to cast all of the numbers as 32-bit integers to (hopefully)
    // 'improve' performance. Also Math.imul is used so that the multiplication
    // operations work correctly without needing to use BigInteger
    // Also this uses (mostly) signed numbers for calculating part of the recovered IV seed
    // as `|0` is much more consise than `>>> 0` (unsigned), so it is used as much as possible.
    // Signed and unsigned would only differ with the % operation.
    const add = ivInterrupt ? 0xe97e7b6a | 0 : 0x6073 | 0;
    const mul = ivInterrupt ? 0xc2a29a69 | 0 : 0x41c64e6d | 0;
    const mod = ivInterrupt ? 0x3a89 | 0 : 0x67d3 | 0;
    const pat = ivInterrupt ? 0x2e4c | 0 : 0xd3e | 0;
    const inc = ivInterrupt ? 0x5831 | 0 : 0x4034 | 0;
    const seeds: number[] = [];
    const ivs1 = ((hp << 0) | (attack << 5) | (defense << 10)) << 16;
    const ivs2 =
        ((speed << 0) | (specialAttack << 5) | (specialDefense << 10)) << 16;
    const diff =
        (ivs2 - ((Math.imul(ivs1, mul) + (ivInterrupt ? add : 0 | 0)) | 0)) >>>
        16;
    const start1 =
        (Math.imul((Math.imul(diff, mod) + inc) >>> 16, pat) >>> 0) % mod | 0;
    const start2 =
        (Math.imul((Math.imul(diff ^ 0x8000, mod) + inc) >>> 16, pat) >>> 0) %
            mod |
        0;
    for (const start of [start1, start2]) {
        for (let low = start; low < 0x10000; low += mod) {
            const seed = ivs1 | low;
            if (((Math.imul(seed, mul) + add) & 0x7fff0000) === ivs2) {
                seeds.push(seed >>> 0);
                seeds.push((seed ^ 0x80000000) >>> 0);
            }
        }
    }
    return seeds;
}

export interface IvToPidState {
    readonly seed: number;
    readonly pid: number;
    readonly method: RngMethod;
}

function getPidAndOriginSeedFromIvSeed(
    ivSeed: number,
    method: RngMethod,
): IvToPidState {
    const rng = new PokeRngR(ivSeed);
    if (method === "Method 2") {
        rng.next32();
    }
    const b = rng.next16();
    const a = rng.next16();
    const seed = rng.next32();
    let pid;
    if (method === "Reverse Method 1") {
        pid = ((b << 0) | (a << 16)) >>> 0;
    } else {
        pid = ((a << 0) | (b << 16)) >>> 0;
    }
    return {
        seed: seed,
        pid: pid,
        method: method,
    } as const;
}

export function recoverPokemonOriginSeedsFromIvs(
    hp: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number,
): readonly IvToPidState[] {
    const results: IvToPidState[] = [];
    const ivSeedsMethod12 = recoverIvSeed(
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        false,
    );
    const ivSeedsMethod4 = recoverIvSeed(
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        true,
    );
    for (const ivSeed of ivSeedsMethod12) {
        results.push(getPidAndOriginSeedFromIvSeed(ivSeed, "Method 1"));
        results.push(getPidAndOriginSeedFromIvSeed(ivSeed, "Reverse Method 1"));
        results.push(getPidAndOriginSeedFromIvSeed(ivSeed, "Method 2"));
    }
    for (const ivSeed of ivSeedsMethod4) {
        results.push(getPidAndOriginSeedFromIvSeed(ivSeed, "Method 4"));
    }
    return results;
}

function getPidGender(pid: number, genderRatio: GenderRatio): Gender {
    switch (genderRatio) {
        case "M": {
            return "Male";
        }
        case "F": {
            return "Female";
        }
        case "U": {
            return "Gender unknown";
        }
    }
    if ((pid & 0xff) >= genderRatioNumbers[genderRatio]) {
        return "Male";
    } else {
        return "Female";
    }
}

export function ivToPidResultFilter(
    nature: Nature | null,
    gender: Gender,
    genderRatio: GenderRatio,
    ability: 0 | 1 | null,
    result: IvToPidState,
): boolean {
    const pid = result.pid;
    if (nature !== null && natures[pid % 25] !== nature) {
        return false;
    }
    if (getPidGender(pid, genderRatio) !== gender) {
        return false;
    }
    if (ability !== null && (pid & 1) !== ability) {
        return false;
    }
    return true;
}
