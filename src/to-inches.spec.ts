import { describe, expect, it } from '@jest/globals'
import toInches from './to-inches'
import { Options } from './interfaces'

const suitcases: Array<[number, {obj: object, string: string, html: string, parts: Array<number | string>, mm: number}, Partial<Options>]> = [
    [ 3048, {
        obj: { minus: false, miles: 0, yards: 0, feet: 10, inches: 0, fraction: '' },
        string: '10 ft',
        html: '<span class="ft">10 ft</span>',
        parts: [10, 'ft'],
        mm: 3048,
    }, { yards: false }],
    [ 9144, {
        obj: { minus: false, miles: 0, yards: 0, feet: 30, inches: 0, fraction: '' },
        string: '30 ft',
        html: '<span class="ft">30 ft</span>',
        parts: [30, 'ft'],
        mm: 9144,
    }, { yards: false }],
    [ 3050, {
        obj: { minus: false, miles: 0, yards: 0, feet: 10, inches: 0, fraction: '1/16' },
        string: '10 ft 1/16 in',
        html: '<span class="ft">10 ft</span> <span class="in"><span class="fraction"><sup>1</sup>/<sub>16</sub></span> in</span>',
        parts: [10, 'ft', '1/16', 'in'],
        mm: 3050,
    }, { yards: false }],
    [ 3080, {
        obj: { minus: false, miles: 0, yards: 0, feet: 10, inches: 1, fraction: '1/4' },
        html: '<span class="ft">10 ft</span> <span class="in">1 <span class="fraction"><sup>1</sup>/<sub>4</sub></span> in</span>',
        string: '10 ft 1 1/4 in',
        parts: [10, 'ft', 1, '1/4', 'in'],
        mm: 3080,
    }, { yards: false }],
    [ 3080, {
        obj: { minus: false, miles: 0, yards: 3, feet: 1, inches: 1, fraction: '1/4' },
        html: '<span class="yd">3 yd</span> <span class="ft">1 ft</span> <span class="in">1 <span class="fraction"><sup>1</sup>/<sub>4</sub></span> in</span>',
        string: '3 yd 1 ft 1 1/4 in',
        parts: [3, 'yd', 1, 'ft', 1, '1/4', 'in'],
        mm: 3080,
    }, { yards: true }],
    [ 8, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 3, fraction: '1/8' },
        string: '3 1/8 in',
        html: '<span class="in">3 <span class="fraction"><sup>1</sup>/<sub>8</sub></span> in</span>',
        parts: [3, '1/8', 'in'],
        mm: 80,
    }, { input: 'cm' }],
    [ -80, {
        obj: { minus: true, miles: 0, yards: 0, feet: 0, inches: 3, fraction: '1/8' },
        string: '-3 1/8 in',
        html: '&minus;<span class="in">3 <span class="fraction"><sup>1</sup>/<sub>8</sub></span> in</span>',
        parts: ['-', 3, '1/8', 'in'],
        mm: -80,
    }, {}],
    [ 254, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 10, fraction: '' },
        string: '10 in',
        html: '<span class="in">10 in</span>',
        parts: [10, 'in'],
        mm: 254,
    }, {}],
    [ 508, {
        obj: { minus: false, miles: 0, yards: 0, feet: 1, inches: 8, fraction: '' },
        string: '1 ft 8 in',
        html: '<span class="ft">1 ft</span> <span class="in">8 in</span>',
        parts: [1, 'ft', 8, 'in'],
        mm: 508,
    }, {}],
    [ 0, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '' },
        string: '0 in',
        html: '<span class="in">0 in</span>',
        parts: [0, 'in'],
        mm: 0,
    }, {}],
    [ 0, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '' },
        string: '0 mi',
        html: '<span class="mi">0 mi</span>',
        parts: [0, 'mi'],
        mm: 0,
    }, { inches: false, feet: false, yards: false }],
    [ 1, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '1/16' },
        string: '1/16 in',
        html: '<span class="in"><span class="fraction"><sup>1</sup>/<sub>16</sub></span> in</span>',
        parts: ['1/16', 'in'],
        mm: 1,
    }, { }],
    [ 1, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '1/32' },
        string: '1/32 in',
        html: '<span class="in"><span class="fraction"><sup>1</sup>/<sub>32</sub></span> in</span>',
        parts: ['1/32', 'in'],
        mm: 1,
    }, { denominator: 32 }],
]

describe('to inches conversion', () => {
    for (const [originalMM, { obj, string, html, mm, parts }, options] of suitcases) {
        it(`should convert ${originalMM} ${options?.input ?? 'mm'} to ${string}`, () => {
            const result = toInches(originalMM, options)
            expect(result).toEqual(obj)
            expect(String(result)).toEqual(string)
            expect(result.parts()).toEqual(parts)
            expect(result.html()).toEqual(html)
            expect(result.mm).toBeCloseTo(mm)
        })
    }

    it('should not fail on no mm passed', () => {
        // @ts-ignore
        expect(toInches()).toEqual({ minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '' })
    })
})

describe('formatter', () => {
    it('should return formatter', () => {
        const formatter = toInches({ input: 'km', inches: false, feet: false }).format
        expect(String(formatter(1.61))).toEqual('1 mi')
        expect(String(formatter(1.62))).toEqual('1 mi 11 yd')
    })
})
