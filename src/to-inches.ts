import { Calculated, Formatter, Length, Options } from './interfaces'
import { DefaultOptions, InputMultiplayer } from './constants'

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

    constructor(mm: number, options?: Partial<Options>) {
        Object.assign(this.#options, options ?? {})

        mm *= InputMultiplayer[this.#options.input]

        this.minus = mm < 0
        this.#sign = this.minus ? '-' : '+'
        this.#mm = mm
        this.#calculated = this.#calculate(mm)
        this.fraction = this.#calculated.fraction
        Object.assign(this, this.#calculated.accurate)
    }


    #calculate(mm: number): Calculated {
        let raw = Math.abs(mm) / 25.4

        const sizes: Array<[keyof Length, number]> = []
        if (this.#options.miles) sizes.push(['miles', 63360])
        if (this.#options.yards) sizes.push(['yards', 36])
        if (this.#options.feet) sizes.push(['feet', 12])
        if (this.#options.inches) sizes.push(['inches', 1])

        const precise: Length = { miles: mm / 1609344, yards: mm / 914.4, feet: mm / 304.8, inches: mm / 25.4 }
        const accurate: Length = { miles: 0, yards: 0, feet: 0, inches: 0 }
        const reminders: Length = { miles: 0, yards: 0, feet: 0, inches: 0 }

        for (const [name, size] of sizes) {
            if (raw === 0) break
            const value = raw / size

            const fractionOption = this.#options[`${name}Fraction`]
            const int = !fractionOption
                ? Math.floor(value)
                : fractionOption === true
                    ? value
                    : this.#round(value, fractionOption === 'fraction' ? 0 : fractionOption)

            accurate[name] = int
            reminders[name] = value - int

            raw -= int * size
            if (raw < 1e-15) raw = 0
        }

        let fraction = ''
        if (this.#options.inches && this.#options.inchesFraction === 'fraction') fraction = this.#calculateFraction(reminders.inches)

        sizes.forEach(([name], index) => {
            sizes[index][1] = accurate[name]
        })

        return { precise, accurate, reminders, fraction, sizes }
    }

    #round(value: number, precision: number): number {
        const multiplier = precision >= 1 || precision <= 0 ? 10 ** precision : Number(String(precision).slice(2))
        return Math.round(value * multiplier) / multiplier
    }

    #gcd(a: number, b: number): number {
        return b ? this.#gcd(b, a % b) : a
    }

    #calculateFraction(fractionPart: number): string {
        const denominator = this.#options.denominator
        let numerator = Math.round(fractionPart * denominator) // Convert to nearest 1/denominator

        const commonDivisor = this.#gcd(numerator, denominator)
        numerator /= commonDivisor
        const reducedDenominator = denominator / commonDivisor

        if (numerator === 0) return ''
        if (numerator === reducedDenominator) return '1'
        return `${numerator}/${reducedDenominator}`
    }

    #getMinimal(): {index: number, key: string, title: string, class: string} {
        const index = this.#calculated.sizes.length - 1
        const key = this.#calculated.sizes[index]?.[0] ?? 'inches'
        return {
            index,
            key,
            title: this.#options[`${key}Title`],
            class: this.#options[`${key}Class`],
        }
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

    toString() {
        const miString = this.miles ? `${this.miles} ${this.#options.milesTitle}` : ''
        const ydString = this.yards ? `${this.yards} ${this.#options.yardsTitle}` : ''
        const ftString = this.feet ? `${this.feet} ${this.#options.feetTitle}` : ''
        const inchRaw = [this.inches, this.fraction].filter(Boolean).join(' ')
        const inchString = inchRaw ? `${inchRaw} ${this.#options.inchesTitle}` : ''
        let value = [miString, ydString, ftString, inchString].filter(Boolean).join(' ')

        if (!value) value = `0 ${this.#getMinimal().title}`
        return (this.minus ? '-' : '') + value
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

    parts() {
        const result = []
        if (this.minus) result.push('-')
        if (this.miles) result.push(this.miles, this.#options.milesTitle)
        if (this.yards) result.push(this.yards, this.#options.yardsTitle)
        if (this.feet) result.push(this.feet, this.#options.feetTitle)
        if (this.inches) result.push(this.inches)
        if (this.fraction) result.push(this.fraction)
        if (this.inches || this.fraction) result.push(this.#options.inchesTitle)
        if (!result.length) result.push(0, this.#getMinimal().title)
        return result
    }

    html() {
        const miString = this.miles ? `<span class="${this.#options.milesClass}">${this.miles} ${this.#options.milesTitle}</span>` : ''
        const ydString = this.yards ? `<span class="${this.#options.yardsClass}">${this.yards} ${this.#options.yardsTitle}</span>` : ''
        const ftString = this.feet ? `<span class="${this.#options.feetClass}">${this.feet} ${this.#options.feetTitle}</span>` : ''

        let fractionString = ''
        if (this.fraction) {
            const fractionHTML = this.fraction.split('/')
                .map((n, i) => [n, i ? 'sub' : 'sup'])
                .map(([n, tag]) => `<${tag}>${n}</${tag}>`)
                .join('/')

            fractionString = `<span class="fraction">${fractionHTML}</span>`
        }

        const inchRaw = [this.inches, fractionString].filter(Boolean).join(' ')
        const inchString = inchRaw ? `<span class="${this.#options.inchesClass}">${inchRaw} ${this.#options.inchesTitle}</span>` : ''
        let value = [miString, ydString, ftString, inchString].filter(Boolean).join(' ')
        if (!value) {
            const minimal = this.#getMinimal()
            value = `<span class="${minimal.class}">0 ${minimal.title}</span>`
        }

        return (this.minus ? '&minus;' : '') + value
    }
}

export default function toInches(options: Partial<Options>): Formatter
export default function toInches(mm: number, options?: Partial<Options>): Inch
export default function toInches(mm: number | Partial<Options>, options?: Partial<Options>): Inch | Formatter {
    if (typeof mm === 'object') {
        const options = mm
        return { format: (mm: number) => new Inch(mm, options) }
    }

    return new Inch(mm, options)
}
