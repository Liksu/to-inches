import { Inch } from './to-inches'

export interface Length {
    miles: number
    yards: number
    feet: number
    inches: number
}

type fractionKey = `${keyof Length}Fraction`
type titleKey = `${keyof Length}Title`
type classKey = `${keyof Length}Class`

export interface Options extends
    Omit<Record<fractionKey, boolean | number>, 'inchesFraction'>,
    Record<titleKey | classKey, string>,
    Record<keyof Length, boolean>
{
    denominator: number
    input: 'mm' | 'cm' | 'm' | 'km'
    inchesFraction: boolean | number | 'fraction'
}

export type Calculated = {
    accurate: Length,
    fraction: string,
    precise: Length,
    reminders: Length,
    sizes: Array<[keyof Length, number]>
}

export type Formatter = {
    format: (mm: number) => Inch
}
