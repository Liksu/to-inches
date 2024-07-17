import { Inch } from './to-inches'

export interface Length {
    miles: number
    yards: number
    feet: number
    inches: number
}

export type FractionKey = `${keyof Length}Fraction`
type TitleKey = `${keyof Length}Title`
type ClassKey = `${keyof Length}Class`

type FractionValue = boolean | number | 'fraction'
type StringValue = string | null
export type Sizes = Array<{key: keyof Length, value: number}>

export type Template<I> = {
    itemTemplate: I
    fractionTemplate?: string
    minus?: string
    joiner?: string
}

export interface Templates {
    string: Template<string>
    parts: Template<Array<string>>
    html: Template<string>
}

export type Options = 
    Record<FractionKey, FractionValue> &
    Record<TitleKey | ClassKey, StringValue> &
    Record<keyof Length, boolean> &
    {
        denominator: number
        input: 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi'
        fractionClass: string | null
        templates: Templates
    }
    
export type OptionParams = Omit<Partial<Options>, 'templates'> & {
    templates?: Partial<Templates>
}

export type Calculated = {
    accurate: Length,
    fraction: string,
    precise: Length,
    reminders: Length,
    sizes: Sizes
}

export interface KeyInfo {
    key: keyof Length
    index: number
    isLast: boolean
    hasFraction: boolean
    value: number
    title: StringValue
    class: StringValue
    fraction: FractionValue
}

export type ItemsData = Array<{ type: string, value: number, fraction?: string } | { type: 'sign', value: string }>

export type Formatter = {
    format: (mm: number) => Inch
}
