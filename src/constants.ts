import { Length, Options } from './interfaces'

export const Order: Array<keyof Length> = ['miles', 'yards', 'feet', 'inches'] as const

export const InputMultiplayer: Record<Options['input'], number> = {
    mm: 1,
    cm: 10,
    m: 1000,
    km: 1000000,
    in: 25.4,
    ft: 304.8,
    yd: 914.4,
    mi: 1609344,
} as const

export const RawDividers: Record<keyof Length, number> = {
    miles: 63360,
    yards: 36,
    feet: 12,
    inches: 1,
} as const

export const DefaultOptions: Options = {
    denominator: 16,
    input: 'mm',
    fractionClass: 'fraction',
    
    miles: true,
    milesFraction: false,
    milesTitle: 'mi',
    milesClass: 'mi',
    
    yards: true,
    yardsFraction: false,
    yardsTitle: 'yd',
    yardsClass: 'yd',
    
    feet: true,
    feetFraction: false,
    feetTitle: 'ft',
    feetClass: 'ft',
    
    inches: true,
    inchesFraction: 'fraction',
    inchesTitle: 'in',
    inchesClass: 'in',
    
    templates: {
        string: {
            itemTemplate: '{{value}}{{fraction?{{value? :}}{{fraction}}:}}{{title? {{title}}:}}',
            minus: '-',
            joiner: ' ',
        },
        parts: {
            itemTemplate: ['{{value}}', '{{fraction}}', '{{title}}'],
            minus: '-',
        },
        html: {
            itemTemplate: '<span{{class? class="{{class}}":}}>{{value}}{{fraction?{{value? :}}{{fraction}}:}}{{title? {{title}}:}}</span>',
            fractionTemplate: `<span{{fractionClass? class="{{fractionClass}}":}}><sup>{{numerator}}</sup>&frasl;<sub>{{denominator}}</sub></span>`,
            minus: '&minus;',
            joiner: ' ',
        },
    }
}
