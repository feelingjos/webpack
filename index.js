//es module
//import sun from './src/scripts/sun.js'
import '@babel/polyfill'
//import es6 from './src/scripts/es6.js'

//commonjs
//var minus = require('./src/scripts/minus')

/*
require(['./src/scripts/muti'],function (muti) {
    console.log('muti(2,3)',muti(2,3))
})

console.log('sun(23,24)',sun(23,24))
console.log('minus(24,17)',minus(24,17))
*/

console.log("Hello World from y main file!")


let func = () => {}
const NUM = 45
let arr = [1,2,4]
let arrB = arr.map(item => item * 2)

arr.includes(8)

console.log(new Set(arrB))
