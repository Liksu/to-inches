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

The most common way to use converter if default exported function `toInches`. It expects millimeters as input and returns object, that has `minus`, `miles`, `yards`, `feet`, `inches`, and `fraction` properties.

Example:

```js
const result = toInches()
```
