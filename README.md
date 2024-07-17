# to-inches

The convertor from metric to imperial measurements with fractions

### features

🔥 Different types of result representation: string, object, array, html  
🚀 Widely customizable  
📏 Adjustable input scale  
⭐️ Once-customized formatter generation

## Installation

npm:

```shell
npm install to-inches --save
```

or yarn:

```shell
yarn add to-inches
```

or in browser:

```js
const { toInches } = await import('https://unpkg.com/to-inches')
```

## Usage

The most common way to use converter is the default exported function `toInches`. It expects millimeters as input and returns object, that has `minus`, `miles`, `yards`, `feet`, `inches`, and `fraction` properties.

Example:

```js
import toInches from 'to-inches'

const result = toInches(1024)
console.log(result)
// { minus: false, miles: 0, yards: 1, feet: 0, inches: 4, fraction: "5/16" }

console.log(`1024mm equals to ${result}`)
// 1024mm equals to 1 yd 4 5/16 in
```

### Function signature

The function accepts two parameters: numerical `mm` and `options` object. You can achieve different results combining it:

- Convert with default settings by passing the only number;
- Convert with specific settings by passing number and object;
- Get the object with pre-configured formatter function by passing the only options object.

```js
let result = String(toInches(1024))
// 1 yd 4 5/16 in

result = String(toInches(1024, { input: 'm' }))
// 1119 yd 2 ft 6 15/16 in

const { format } = toInches({ input: 'm' })
String(format(1))
// 1 yd 3 3/8 in

String(format(1024))
// 1119 yd 2 ft 6 15/16 in
```

## Result object

The result object has the following properties:

- `minus` - boolean, true if the input is negative
- `miles` - number, the integer part of the miles
- `yards` - number, the integer part of the yards
- `feet` - number, the integer part of the feet
- `inches` - number, the integer part of the inches
- `fraction` - string, the fraction part, according to the settings, inches by default, or empty string

## Other formats

### String

The result object has built-in `toString()` method, that returns a string representation of the result. Because of that, you can just use the object in string context and get the ready string.

```js
const result = toInches(1024)

console.log(`1024mm equals to ${result}`)
// 1024mm equals to 1 yd 4 5/16 in
```

### .html()

The result object has also built-in `html()` method, that returns a string representation of the result in HTML format. It wraps the result in a `<span>` tag with classes for each part of the result.

```js
console.log(result.html())
// <span class="yd">1 yd</span> <span class="in">4 <span class="fraction"><sup>5</sup>/<sub>16</sub></span> in</span>
```

### .parts()

The `parts()` method, is the configurable way to get the result as an array of parts. By default it returns an array of units and it values.

```js
console.log(result.parts())
// [1, "yd", 4, "5/16", "in"]
```

### .items()

Single non-configurable method, that returns each part as an object with `type` and `value` properties. If unit has fraction, it will ba also added to the object.

```js
const result = toInches(-2048, { input: 'm' })
console.log(result.items())
/*
[
    { type: 'sign', value: '-' },
    { type: 'mi', value: 1 },
    { type: 'yd', value: 479 },
    { type: 'ft', value: 2 },
    { type: 'in', value: 1, fraction: '15/16' }
]
*/
```

### `precise` property

The `precise` property contains each unit calculated separately and represetnts tha amount of each unit in the input value.

```js
const result = toInches(2048, { input: 'm' })
console.log(result.precise)
/*
{
  miles: 1.2725682017020599,
  yards: 2239.7200349956256,
  feet: 6719.160104986877,
  inches: 80629.92125984252
}
*/
```

### `reminders` property

While the result object contains integer parts of the units, the `reminders` property contains the rest of each unit, that was processed with a lower units.

```js
console.log(result.reminders)
/*
    {
  miles: 0.2725682017020601,
  yards: 0.7200349956256105,
  feet: 0.1601049868768314,
  inches: 0.9212598425219767
}
*/
```

### `mm` property

Helper property, that contains the input value in millimeters.

```js
const result = toInches(8, { input: 'yd' })
console.log(result.mm)
// 7315.2
```

## Customization

The `toInches` function accepts the second argument, that is an object with settings. The settings object can contain the following properties:

- `denominator` - _number_, the denominator of the fraction, `16` by default
- `input` - _string_, the input unit, `'mm'` by default, possible values: `'mm'`, `'cm'`, `'m'`, `'km'`, `'in'`, `'ft'`, `'yd'`, `'mi'`
- `fractionClass` - _string_, the class name for the fraction part in the HTML format, `'fraction'` by default


- `miles` - _boolean_, `true` if the miles should be included in the result, `true` by default
- `milesFraction` - _boolean or `'fraction'`_, `true` if the miles should have a numeric reminder part, `'fraction'` if miles should have a string fraction. `false` by default (false means no fraction calculation for miles and process them via yards)
- `milesTitle` - _string_, the title of the miles unit, `'mi'` by default
- `milesClass` - _string_, the class name for the miles part in the HTML format, `'mi'` by default


- same for yards: `yards`, `yardsFraction`, `yardsTitle`, `yardsClass`
- same for feet: `feet`, `feetFraction`, `feetTitle`, `feetClass`
- same for inches: `inches`, `inchesFraction` (`fraction` by default), `inchesTitle`, `inchesClass`

The `templates` property contains the templates for each format. Each template has the following properties:

#### `templates.string` object

- `itemTemplate` - _string_, the template for each unit
- `fractionTemplate` - _string_, the template for the fraction part. If empty, the plain string like `'5/16'` will be returned
- `minus` - _string_, the minus sign, `'-'` by default
- `joiner` - _string_, the joiner between the units, `' '` by default

#### `templates.parts` object

- `itemTemplate` - _array of strings_, the template of values returned for each unit
- `fractionTemplate` - the same as for the `string` format
- `minus` - the same as for the `string` format
- `joiner` - not used for this format

#### `templates.html` object

The same structure as for `string`, but has predefined template for HTML.

## Calculation

One important note here: if the higher unit has a fraction, all rest units will be zero.

```js
const result = toInches(2048, { input: 'm' })
console.log(result.toString())
// 1 mi 479 yd 2 ft 1 15/16 in

const result = toInches(2048, { input: 'm', milesFraction: 'fraction' })
console.log(result.toString())
// 1 1/4 mi

const result = toInches(2048, { input: 'm', milesFraction: true })
console.log(result.toString())
// 1.27256820170206 mi
```

In case if some units are not needed, they will be skipped.

```js
const result = toInches(2048, { input: 'm', miles: false, yards: false, feet: false })
console.log(result.toString())
// 80629 15/16 in

const result = toInches(2048, { input: 'm', miles: false, yards: false, feet: false, inchesFraction: false })
console.log(result.toString())
// 80629 in
```

## Templates

### Placeholders

The templates are the strings with placeholders, that will be replaced with the actual values. The placeholder's context has such properties to replace: `minus`, `value`, `title`, `class`, `fraction`, `numerator`, `denominator`, `fractionClass`.

Placeholder is a string, that starts with `{{` and ends with `}}`. Additional spaces are not allowed, to keep ability to use spaces as part of the conditional placeholder's content.

```js
const result = toInches(1024, {
    templates: {
        string: {
            itemTemplate: '"{{value}}\xA0{{title}}"',
            joiner: ', '
        }
    }
})

console.log(result.toString())
// "1 yd", "4 in"
```

### Conditional placeholders

The conditional placeholders are the placeholders, that have the ternary operator inside. The condition is the first part of the placeholder, then the `?` sign, the second part is the value, that will be returned if the condition is true, the `:` sign, and the third part is the value, that will be returned if the condition is false. True and false parts can be empty. All space in this parts will be returned as-is.

Pay attention, that condition is just a placeholder from the context that can be falsy or not, it is not evaluated.

Placeholder can be nested, and it will be processed from the inner to the outer.

```js
const result = toInches(1024, {
    yardsTitle: 'yards',
    inchesTitle: 'inches',
    templates: {
        string: {
            itemTemplate: '{{value}} {{title}}{{fraction? with fraction equals to {{fraction}}:}}',
            fractionTemplate: '{{numerator}} over {{denominator}}'
        }
    }
})
console.log(result.toString())
// 1 yards 4 inches with fraction equals to 5 over 16
```

In this example you can see, that the `fraction` part will be added to the result only if the fraction is not empty. Otherwise, it will be skipped, because false part is empty. Also, the leading space after the `?` sign allows to separate the title and the fraction part.
