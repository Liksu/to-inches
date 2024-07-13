import { Options } from './interfaces'

export const InputMultiplayer: Record<Options['input'], number> = {
    mm: 1,
    cm: 10,
    m: 1000,
    km: 1000000,
}

export const DefaultOptions: Options = {
    denominator: 16,
    input: 'mm',
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
}
