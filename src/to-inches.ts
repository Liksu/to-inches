import {
    Calculated,
    Formatter,
    FractionKey,
    Length,
    KeyInfo,
    Options,
    Sizes,
    ItemsData,
    Templates,
    OptionParams
} from './interfaces'
import { DefaultOptions, InputMultiplayer, Order, RawDividers } from './constants'

const simpleRe = /{{(\w+)}}/g
const conditionalRe = /{{(\w+)(?:\?((?:\\:|[^:{])*?):([^{]*?))?}}/gm

export class Inch {
    readonly #options: Options = { ...DefaultOptions }
    readonly #sign: string
    readonly #mm: number
    readonly #calculated: Calculated

    public minus!: boolean
    public miles!: number
    public yards!: number
    public feet!: number
    public inches!: number
    public fraction: string

    constructor(mm: number, options?: OptionParams) {
        this.#options = {
            ...this.#options,
            ...options,
            templates: {
                string: {
                    ...this.#options.templates.string,
                    ...options?.templates?.string
                },
                parts: {
                    ...this.#options.templates.parts,
                    ...options?.templates?.parts
                },
                html: {
                    ...this.#options.templates.html,
                    ...options?.templates?.html
                }
            }
        }

        mm ??= 0
        mm *= InputMultiplayer[this.#options.input]

        this.minus = mm < 0
        this.#sign = this.minus ? '-' : '+'
        this.#mm = mm
        this.#calculated = this.#calculate(mm)
        this.fraction = this.#calculated.fraction
        Object.assign(this, this.#calculated.accurate)
    }

    /**
     * Rounds a number to a specified precision.
     * If precision greater than 1 or less than 0, it will be treated as a number of decimal places.
     * If precision is between 0 and 1, the decimals will be treated as a multiplier.
     * Pay attention: to round to 1/4, you should pass 0.4, not 0.25.
     * If precision is 0, the number will be rounded down.
     * If precision is not specified, the number will be rounded.
     * Negative precision can help with rounding integers. For example: round(123456789, -3) returns 123457000.
     */
    static round(value: number, precision?: number): number {
        if (precision === 0) return Math.floor(value)
        if (!precision) return Math.round(value)
        const multiplier = precision >= 1 || precision < 0 ? 10 ** precision : Number(String(Math.abs(precision)).slice(2))
        return Math.round(value * multiplier) / multiplier
    }

    /**
     * Returns the greatest common divisor of two numbers.
     */
    static gcd(a: number, b: number): number {
        return b ? Inch.gcd(b, a % b) : a
    }

    #calculate(mm: number): Calculated {
        let raw = Math.abs(mm) / 25.4

        const sizes = this.#getSizes()
        
        const precise: Length = { miles: mm / 1609344, yards: mm / 914.4, feet: mm / 304.8, inches: mm / 25.4 }
        const accurate: Length = { miles: 0, yards: 0, feet: 0, inches: 0 }
        const reminders: Length = { miles: 0, yards: 0, feet: 0, inches: 0 }

        for (const {key, value: size} of sizes) {
            if (raw === 0) break
            const value = raw / size

            const fractionOption = this.#options[`${key}Fraction`]
            const int = !fractionOption
                ? Math.floor(value)
                : fractionOption === true
                    ? value
                    : Inch.round(value, fractionOption === 'fraction' ? 0 : fractionOption)

            accurate[key] = int
            reminders[key] = value - int

            raw -= int * size
            if (raw < 1e-15) raw = 0
        }

        let fraction = ''
        const minimal = this.#getMinimal(sizes)
        if (this.#options[minimal.key] && minimal.fraction === 'fraction') fraction = this.#calculateFraction(reminders[minimal.key])

        sizes.forEach(({key}, index) => {
            sizes[index].value = accurate[key]
        })

        return { precise, accurate, reminders, fraction, sizes }
    }

    #getSizes(): Sizes {
        const sizes = [] as Sizes

        let hasSense = true
        const order = [...Order]
        while (hasSense && order.length) {
            const key = order.shift()! as keyof Length
            if (this.#options[key]) sizes.push({key, value: RawDividers[key]})
            if (this.#options[key + 'Fraction' as FractionKey]) hasSense = false
        }

        return sizes
    }
    
    #getInfo(key: keyof Length, sizes = this.#calculated.sizes): KeyInfo | null {
        const index = sizes.findIndex(info => info.key === key)
        if (index < 0) return null
        
        const isLast = sizes.length - 1 === index
        const fraction = this.#options[`${key}Fraction`]
        return {
            key,
            index,
            isLast,
            hasFraction: Boolean(fraction && isLast && this.fraction),
            value: this[key],
            title: this.#options[`${key}Title`],
            class: this.#options[`${key}Class`],
            fraction,
        }
    }

    #getMinimal(sizes = this.#calculated.sizes): KeyInfo {
        const key = sizes.at(-1)?.key ?? Order.at(-1) as keyof Length
        const info = this.#getInfo(key, sizes)
        if (info === null) throw new Error('No minimal value found')
        return info
    }

    #calculateFraction(fractionPart: number): string {
        const denominator = this.#options.denominator
        let numerator = Math.round(fractionPart * denominator) // Convert to nearest 1/denominator

        const commonDivisor = Inch.gcd(numerator, denominator)
        numerator /= commonDivisor
        const reducedDenominator = denominator / commonDivisor

        if (numerator === 0) return ''
        if (numerator === reducedDenominator) return '1'
        return `${numerator}/${reducedDenominator}`
    }

    get mm() {
        return this.#mm
    }

    get precise() {
        return this.#calculated.precise
    }

    get reminders() {
        return this.#calculated.reminders
    }

    #processTemplate(template: string, context: Record<string, string | number>): string {
        do {
            template = template
                .replace(simpleRe, (_, key) => String(context[key] ?? ''))
                .replace(conditionalRe, (_, key, truthy, falsy) => context[key] ? truthy : falsy)
        } while (simpleRe.test(template) || conditionalRe.test(template))
        
        return template
    }
    
    #render(info: KeyInfo & {required?: true} | null, itemTemplate: string, fractionTemplate?: string): string
    #render(info: KeyInfo & {required?: true} | null, itemTemplate: Array<string>, fractionTemplate?: string): Array<string>
    #render(info: KeyInfo & {required?: true} | null, itemTemplate: Array<string> | string, fractionTemplate?: string): Array<string> | string {
        const isArray = Array.isArray(itemTemplate)
        
        if (!info) return isArray ? [] : ''
        if (!info.value && !(info.hasFraction && this.fraction) && !info.required) return isArray ? [] : ''

        let fraction = ''
        const [numerator, denominator] = this.fraction.split('/')
        let context: Record<string, string | number> = {
            minus: this.minus ? '−' : '',
            value: info.required ? info.value : (info.value || ''),
            title: info.title ?? '',
            class: info.class ?? '',
            fractionClass: this.#options.fractionClass ?? '',
            numerator,
            denominator,
            fraction,
        }

        if (info.hasFraction) {
            context.fraction = fractionTemplate
                ? this.#processTemplate(fractionTemplate, { ...context, numerator, denominator, fraction: this.fraction })
                : this.fraction
        }
        
        return isArray
            ? itemTemplate.map(template => this.#processTemplate(template, context))
            : this.#processTemplate(itemTemplate, context)
    }

    #renderSizes(type: keyof Templates): string {
        const { itemTemplate, fractionTemplate, minus, joiner } = this.#options.templates[type]
        let values = this.#calculated.sizes
            .map(({ key }) => this.#render(this.#getInfo(key), itemTemplate as string, fractionTemplate))
            .filter(Boolean)
            .join(joiner ?? ' ')
        
        if (!values) {
            values = this.#render({ ...this.#getMinimal(), required: true }, itemTemplate as string, fractionTemplate)
        }

        return (this.minus ? (minus ?? '-') : '') + values
    }
    
    toString(): string {
        return this.#renderSizes('string')
    }

    toJSON() {
        return {
            minus: this.minus,
            miles: this.miles,
            yards: this.yards,
            feet: this.feet,
            inches: this.inches,
            fraction: this.fraction,
        }
    }

    parts(): Array<string | number> {
        const { itemTemplate, minus } = this.#options.templates.parts
        const clean = (array: Array<string | number>) => array.filter(Boolean).map(value => isNaN(Number(value)) ? value : Number(value))
        const result: Array<string | number> = []
        if (this.minus) result.push(minus ?? '-')
        
        this.#calculated.sizes.forEach(({ key }) => {
            const values = clean(this.#render(this.#getInfo(key), itemTemplate))
            result.push(...values)
        })
        
        if (!result.length) {
            const values = clean(this.#render({...this.#getMinimal(), required: true}, itemTemplate))
            result.push(...values)
        }
        
        return result
    }
    
    items(): ItemsData {
        const items: ItemsData = this.#calculated.sizes
            .map(({ key }) => this.#getInfo(key))
            .filter((info): info is KeyInfo => info != null)
            .filter(info => info.value || (info.hasFraction && this.fraction))
            .map(info => {
                const data: ItemsData[0] = { type: info.title ?? info.key, value: info.value }
                if (info.hasFraction) data.fraction = this.fraction
                return data
            })
        
        if (!items.length) {
            const minimal = this.#getMinimal()
            items.unshift({ type: minimal.title ?? minimal.key, value: 0 })
        }
        
        if (this.minus) items.unshift({ type: 'sign', value: '-' })
        
        return items
    }

    html() {
        return this.#renderSizes('html')
    }
}

export function toInches(options: OptionParams): Formatter
export function toInches(mm: number, options?: OptionParams): Inch
export function toInches(mm: number | OptionParams, options?: OptionParams): Inch | Formatter {
    if (typeof mm === 'object') {
        const options = mm
        return { format: (mm: number) => new Inch(mm, options) }
    }

    return new Inch(mm, options)
}

export default toInches
