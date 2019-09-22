/*
//es module
import sun from './src/scripts/sun.js'
//import '@babel/polyfill'
//import es6 from './src/scripts/es6.js'

//commonjs
//var minus = require('./src/scripts/minus')

/!*
require(['./src/scripts/muti'],function (muti) {
    console.log('muti(2,3)',muti(2,3))
})

console.log('sun(23,24)',sun(23,24))
console.log('minus(24,17)',minus(24,17))
*!/

console.log('sun(23,24)',sun(23,24))

console.log("Hello World from y main file!")


let funcs = () => {}
const NUM = 45
let arr = [1,2,4]
let arrB = arr.map(item => item * 2)

//arr.includes(8)

console.log(new Set(arrB))/!**!/

//-----------------------------

const func = () => {
    console.log('hello webpack')
}
func()

function annotation(target) {
    target.annotated = true
}

@annotation
class User {
    constructor() {
        console.log('new User')
    }
}

const user = new User()

console.log('装饰器', user.annotated)

new Promise(resolve => console.log('promise'))

Array.from('foo')*/

//import './src/css/base.css'
import base from './src/css/base.css'

//base.use()

/*
var flag = false;

setInterval(function(){
    if(flag){
        base.unuse()
    }else{
        base.use()
    }
    flag = !flag
},500)*/

import './src/less/base.less'
import { a } from './src/common/util'

console.log(a());

