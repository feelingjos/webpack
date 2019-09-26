import {a} from './src/scripts/table.js'
import './src/styles/divbackgroad.scss'
import './src/styles/fonticon.scss'
import {Persion,Student} from './src/scripts/actionone.js'

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

Array.from('foo')

console.log("方法引用")

console.log(a(10,1))

console.log(new Persion('吴华豪',10,'男'))
console.log(new Student('吴华豪','计算机专业','123456789'))
