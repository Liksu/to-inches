import { describe, expect, it, test } from '@jest/globals'
import toInches, { Inch } from './to-inches'
import { ItemsData, OptionParams } from './interfaces'

type Suitcase = [
    number,
    { obj: object, string: string, html: string, parts: Array<number | string>, items: ItemsData, mm: number },
    OptionParams
]

const suitcases: Array<Suitcase> = [
    [ 3048, {
        obj: { minus: false, miles: 0, yards: 0, feet: 10, inches: 0, fraction: '' },
        string: '10 ft',
        html: '<span class="ft">10 ft</span>',
        parts: [10, 'ft'],
        items: [{ type: 'ft', value: 10 }],
        mm: 3048,
    }, { yards: false }],
    [ 9144, {
        obj: { minus: false, miles: 0, yards: 0, feet: 30, inches: 0, fraction: '' },
        string: '30 ft',
        html: '<span class="ft">30 ft</span>',
        parts: [30, 'ft'],
        items: [{ type: 'ft', value: 30 }],
        mm: 9144,
    }, { yards: false }],
    [ 3050, {
        obj: { minus: false, miles: 0, yards: 0, feet: 10, inches: 0, fraction: '1/16' },
        string: '10 ft 1/16 in',
        html: '<span class="ft">10 ft</span> <span class="in"><span class="fraction"><sup>1</sup>/<sub>16</sub></span> in</span>',
        parts: [10, 'ft', '1/16', 'in'],
        items: [{ type: 'ft', value: 10 }, { type: 'in', value: 0, fraction: '1/16' }],
        mm: 3050,
    }, { yards: false }],
    [ 3080, {
        obj: { minus: false, miles: 0, yards: 0, feet: 10, inches: 1, fraction: '1/4' },
        html: '<span class="ft">10 ft</span> <span class="in">1 <span class="fraction"><sup>1</sup>/<sub>4</sub></span> in</span>',
        string: '10 ft 1 1/4 in',
        parts: [10, 'ft', 1, '1/4', 'in'],
        items: [{ type: 'ft', value: 10 }, { type: 'in', value: 1, fraction: '1/4' }],
        mm: 3080,
    }, { yards: false }],
    [ 3080, {
        obj: { minus: false, miles: 0, yards: 3, feet: 1, inches: 1, fraction: '1/4' },
        html: '<span class="yd">3 yd</span> <span class="ft">1 ft</span> <span class="in">1 <span class="fraction"><sup>1</sup>/<sub>4</sub></span> in</span>',
        string: '3 yd 1 ft 1 1/4 in',
        parts: [3, 'yd', 1, 'ft', 1, '1/4', 'in'],
        items: [{ type: 'yd', value: 3 }, { type: 'ft', value: 1 }, { type: 'in', value: 1, fraction: '1/4' }],
        mm: 3080,
    }, { yards: true }],
    [ -1641189, {
        obj: { minus: true, miles: 1, yards: 34, feet: 2, inches: 5, fraction: '3/4' },
        html: '&minus;<span class="mi">1 mi</span> <span class="yd">34 yd</span> <span class="ft">2 ft</span> <span class="in">5 <span class="fraction"><sup>3</sup>/<sub>4</sub></span> in</span>',
        string: '-1 mi 34 yd 2 ft 5 3/4 in',
        parts: ['-', 1, 'mi', 34, 'yd', 2, 'ft', 5, '3/4', 'in'],
        items: [{ type: 'sign', value: '-' }, { type: 'mi', value: 1 }, { type: 'yd', value: 34 }, { type: 'ft', value: 2 }, { type: 'in', value: 5, fraction: '3/4' }],
        mm: -1641189,
    }, { }],
    [ 8, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 3, fraction: '1/8' },
        string: '3 1/8 in',
        html: '<span class="in">3 <span class="fraction"><sup>1</sup>/<sub>8</sub></span> in</span>',
        parts: [3, '1/8', 'in'],
        items: [{ type: 'in', value: 3, fraction: '1/8' }],
        mm: 80,
    }, { input: 'cm' }],
    [ -80, {
        obj: { minus: true, miles: 0, yards: 0, feet: 0, inches: 3, fraction: '1/8' },
        string: '-3 1/8 in',
        html: '&minus;<span class="in">3 <span class="fraction"><sup>1</sup>/<sub>8</sub></span> in</span>',
        parts: ['-', 3, '1/8', 'in'],
        items: [{ type: 'sign', value: '-' }, { type: 'in', value: 3, fraction: '1/8' }],
        mm: -80,
    }, {}],
    [ 254, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 10, fraction: '' },
        string: '10 in',
        html: '<span class="in">10 in</span>',
        parts: [10, 'in'],
        items: [{ type: 'in', value: 10 }],
        mm: 254,
    }, {}],
    [ 508, {
        obj: { minus: false, miles: 0, yards: 0, feet: 1, inches: 8, fraction: '' },
        string: '1 ft 8 in',
        html: '<span class="ft">1 ft</span> <span class="in">8 in</span>',
        parts: [1, 'ft', 8, 'in'],
        items: [{ type: 'ft', value: 1 }, { type: 'in', value: 8 }],
        mm: 508,
    }, {}],
    [ 0, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '' },
        string: '0 in',
        html: '<span class="in">0 in</span>',
        parts: [0, 'in'],
        items: [{ type: 'in', value: 0 }],
        mm: 0,
    }, {}],
    [ 0, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '' },
        string: '0 mi',
        html: '<span class="mi">0 mi</span>',
        parts: [0, 'mi'],
        items: [{ type: 'mi', value: 0 }],
        mm: 0,
    }, { inches: false, feet: false, yards: false }],
    [ 1, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '1/16' },
        string: '1/16 in',
        html: '<span class="in"><span class="fraction"><sup>1</sup>/<sub>16</sub></span> in</span>',
        parts: ['1/16', 'in'],
        items: [{ type: 'in', value: 0, fraction: '1/16' }],
        mm: 1,
    }, { }],
    [ 1, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '1/32' },
        string: '1/32 in',
        html: '<span class="in"><span class="fraction"><sup>1</sup>/<sub>32</sub></span> in</span>',
        parts: ['1/32', 'in'],
        items: [{ type: 'in', value: 0, fraction: '1/32' }],
        mm: 1,
    }, { denominator: 32 }],
    [ 13, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '1/2' },
        string: '1/2 in',
        html: '<span class="in"><span class="fraction"><sup>1</sup>/<sub>2</sub></span> in</span>',
        parts: ['1/2', 'in'],
        items: [{ type: 'in', value: 0, fraction: '1/2' }],
        mm: 13,
    }, { }],
    [ 19, {
        obj: { minus: false, miles: 0, yards: 0, feet: 0, inches: 0, fraction: '3/4' },
        string: '3/4 in',
        html: '<span class="in"><span class="fraction"><sup>3</sup>/<sub>4</sub></span> in</span>',
        parts: ['3/4', 'in'],
        items: [{ type: 'in', value: 0, fraction: '3/4' }],
        mm: 19,
    }, { }],
    [ 12573, {
        obj: { minus: false, miles: 7812, yards: 0, feet: 0, inches: 0, fraction: '1/2' },
        string: '7812 1/2 miles',
        html: '<span class="distance">7812 <span><sup>1</sup>/<sub>2</sub></span> miles</span>',
        parts: [7812, '1/2', 'miles'],
        items: [{ type: 'miles', value: 7812, fraction: '1/2' }],
        mm: 12_573_000_000,
    }, { input: 'km', milesFraction: 'fraction', milesTitle: 'miles', milesClass: 'distance', fractionClass: null }],
    [ 16764, {
        obj: { minus: false, miles: 10416, yards: 0, feet: 0, inches: 0, fraction: '11/16' },
        string: '10416 11/16 miles',
        html: '<span class="distance">10416 <span><sup>11</sup>/<sub>16</sub></span> miles</span>',
        parts: [10416, '11/16', 'miles'],
        items: [{ type: 'miles', value: 10416, fraction: '11/16' }],
        mm: 16_764_000_000,
    }, { input: 'km', milesFraction: 'fraction', milesTitle: 'miles', milesClass: 'distance', fractionClass: null }],
    [ 16764, {
        obj: { minus: false, miles: 10416, yards: 0, feet: 0, inches: 0, fraction: '2/3' },
        string: '10416 2/3 miles',
        html: '<span>10416 <span><sup>2</sup>/<sub>3</sub></span> miles</span>',
        parts: [10416, '2/3', 'miles'],
        items: [{ type: 'miles', value: 10416, fraction: '2/3' }],
        mm: 16_764_000_000,
    }, { input: 'km', milesFraction: 'fraction', milesTitle: 'miles', milesClass: null, fractionClass: null, denominator: 3 }],
    [ 76.2, {
        obj: { minus: false, miles: 0, yards: 0, feet: 2, inches: 0, fraction: '1/2' },
        string: '2 1/2 feet',
        html: '<span>2 <span><sup>1</sup>/<sub>2</sub></span> feet</span>',
        parts: [2, '1/2', 'feet'],
        items: [{ type: 'feet', value: 2, fraction: '1/2' }],
        mm: 762,
    }, { input: 'cm', feetFraction: 'fraction', feetTitle: 'feet', feetClass: null, fractionClass: null, denominator: 1024 }],
    [ 16.764, {
        obj: { minus: false, miles: 0, yards: 18, feet: 0, inches: 0, fraction: '1/3' },
        string: '18 1/3 yards',
        html: '<span>18 <span><sup>1</sup>/<sub>3</sub></span> yards</span>',
        parts: [18, '1/3', 'yards'],
        items: [{ type: 'yards', value: 18, fraction: '1/3' }],
        mm: 16764,
    }, { input: 'm', yardsFraction: 'fraction', yardsTitle: 'yards', yardsClass: null, fractionClass: null, denominator: 3 }],
    [ -1641189, {
        obj: { minus: true, miles: 1, yards: 34, feet: 2, inches: 5, fraction: '3/4' },
        string: 'minus1::::mi*34::::yd*2::::ft*5::4#3::in',
        html: '&minus;mi::1::::mi::3::4::− yd::34::::yd::3::4::− ft::2::::ft::3::4::− in::5::<span class="fraction"><sup>3</sup>/<sub>4</sub></span>::in::3::4::−',
        parts: ['-', 1, 34, 2, 5],
        items: [{type: 'sign', value: '-'}, { type: 'mi', value: 1 }, { type: 'yd', value: 34 }, { type: 'ft', value: 2 }, { type: 'in', value: 5, fraction: '3/4' }],
        mm: -1641189,
    }, { 
        templates: {
            html: {
                itemTemplate: '{{class}}::{{value}}::{{fraction}}::{{title}}::{{numerator}}::{{denominator}}::{{minus}}',
            },
            parts: {
                itemTemplate: ['{{value}}'],
            },
            string: {
                itemTemplate: '{{value}}::{{fraction}}::{{title}}',
                fractionTemplate: '{{denominator}}#{{numerator}}',
                joiner: '*',
                minus: 'minus',
            },
        }
    }],
]

describe('to inches conversion', () => {
    for (const [originalMM, { obj, string, html, mm, parts, items }, options] of suitcases) {
        describe(`should convert ${originalMM} ${options?.input ?? 'mm'} to ${string}`, () => {
            const result = toInches(originalMM, options)

            test('object', () => expect(result).toEqual(obj))
            test('string', () => expect(String(result)).toEqual(string))
            test('parts', () => expect(result.parts()).toEqual(parts))
            test('html', () => expect(result.html()).toEqual(html))
            test('items', () => expect(result.items()).toEqual(items))
            test('mm', () => expect(result.mm).toBeCloseTo(mm))
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

describe('rounding', () => {
    it('should rounds to 3 decimals', () => {
        expect(Inch.round(1.234321, 3)).toEqual(1.234)
    })
    
    it('should rounds to 2 decimals', () => {
        expect(Inch.round(1.987654, 2)).toEqual(1.99)
    })
    
    it('should floor if 0 precision passed', () => {
        expect(Inch.round(1.987654, 0)).toEqual(1)
    })

    it('should round to 0 decimals if no precision passed', () => {
        expect(Inch.round(1.987654)).toEqual(2)
    })

    it('should round to 1/3', () => {
        expect(Inch.round(0.55, 0.3)).toBeCloseTo(2/3)
        expect(Inch.round(0.49, 0.3)).toBeCloseTo(1/3)
    })
    
    it('should round to 1/4', () => {
        expect(Inch.round(0.55, 0.4)).toBeCloseTo(2/4)
        expect(Inch.round(0.65, 0.4)).toBeCloseTo(3/4)
    })

    it('should round integers', () => {
        expect(Inch.round(123456789, -3)).toEqual(123457000)
        expect(Inch.round(123456289, -3)).toEqual(123456000)
    })
})