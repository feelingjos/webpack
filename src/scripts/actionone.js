//export default (function(){

class Student {

    constructor(name,classes,cardNameber){
        this.name = name
        this.classes = classes
        this.cardNameber = cardNameber
        this.toString()
    }

    toString(){
        return `name: ${this.name};classes: ${this.classes}; cardNameber: ${this.cardNameber}`
    }

    static findstatic(){
        console.log('Student.findstatic()')
        return "findstatic---"

    }

}

class Persion {
    constructor(name,age,sexs){
        this.name = name
        this.age = age
        this.sexs = sexs
        this.toString()
    }

    toString(){
        return `name: ${this.name}; age: ${this.age}; sexs: ${this.sexs}`
    }

}

export {
    Student,
    Persion
}
