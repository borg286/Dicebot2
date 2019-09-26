var books = require('../5eTools/data/books.json');

class tags {
    constructor(input) {
        this.input = replaceStupidFilters(input.toString());
    }
    removeFilters(){
        this.input = filterFunc("filter", this.input, false)
        return this;
    }
    removeBooks(){
        this.input = filterFunc("book", this.input, false)
        return this;
    }
    removeSpells(){
        this.input = filterFunc("spell", this.input, true)
        return this;
    }
    removeConditions(){
        this.input = filterFunc("condition", this.input, true)
        return this;
    }
    removeItems(){
        this.input = filterFunc("item", this.input, false)
        return this;
    }
    removeDice(){
        this.input = filterFunc("dice", this.input, true)
        return this;
    }
    removeClass(){
        this.input = filterFunc("class", this.input, false)
        return this;
    }
    removeDamage(){
        this.input = filterFunc("damage", this.input, true)
        return this
    }
    removeDC(){
        this.input = filterFunc("dc", this.input, true)
        return this
    }
    removeSkill(){
        this.input = filterFunc("skill", this.input, true)
        return this
    }
    removeToHit(){
        this.input = filterFunc("hit", this.input, true)
        return this
    }
    removeAttack(){
        this.input = filterFunc("atk", this.input, true)
        return this
    }
    removeRecharge(){
        this.input = filterFunc("recharge", this.input, true)
        return this
    }
    toString(){
        return this.input;
    }
}

exports.removeTags = function(input){
    return new tags(input).removeFilters()
                          .removeBooks()
                          .removeSpells()
                          .removeConditions()
                          .removeItems()
                          .removeDice()
                          .removeClass()
                          .removeDamage()
                          .removeDC()
                          .removeToHit()
                          .removeSkill()
                          .removeAttack()
                          .removeRecharge()
                          .toString();
}
exports.parseSources = function(source){
    let bookName = source;
    books.book.forEach(book=>{
        if(source == book.id){
            bookName = book.name;
        }
    })
    return bookName;
}
exports.parseTable = function(tableObject){
    let description = "";
    for(let i in tableObject.colLabels){
        if(i == tableObject.colLabels.length - 1)
            description += `__${tableObject.colLabels[i]}__\n`;
        else description += `__${tableObject.colLabels[i]}__ | `;
    }
    for(let i in tableObject.rows){
        for(let j = 0; j < tableObject.colLabels.length; j++){
            if(j == tableObject.colLabels.length - 1)
                description += `${tableObject.rows[i][j]}\n`
            else description += `**${tableObject.rows[i][j]}** | `
        }
    }
    return description;
}
exports.handleLongMessage = function(input, message, title){
    let output = input.split("\n"), count = 0, acc = "";
    for(let i = 0; i < output.length; i++){
        if((acc + output[i]).length < 1024) acc += `\n${output[i]}`
        else{
            if(count == 0) message.addField(title, acc)
            else message.addField("_​_", acc)
            count++
            acc = output[i];
        }
        if(i == output.length-1 && acc != "") (count == 0) ? message.addField(title, acc) : message.addField("_​_", acc)
    }
    return output;
}
function filterFunc(regex, input, isSimple){
    let description = input.toString(), filteredMessage = "";
    var fullRegex = new RegExp("{@" + regex + ".*}"),
        lookaheadRegex = new RegExp("(?=\\{@" + regex + ".*})"),
        firstRegex = new RegExp("{@" + regex + ".*?}"),
        partialRegex = new RegExp("{@" + regex + " ");
    if(description.match(fullRegex)){
        description.split(lookaheadRegex).forEach(filter=>{
            if(filter.match(firstRegex)){
                let filteredArray
                if(!isSimple) filteredArray = jsplit(filter.split(partialRegex)[1], /\|.*?}/g, 1);
                else filteredArray = jsplit(filter.split(partialRegex)[1], /}/g, 1);
                filteredArray.forEach(piece =>{ 
                    filteredMessage += piece; 
                })
            } else filteredMessage += filter;
        })
    } else return input;
    return filteredMessage;
}
function replaceStupidFilters(input){
    let output = input;
    output = output.replace(/{@dc/g, "{@dc DC")
                   .replace(/{@hit /g, "{@hit +")
                   .replace(/{@h/g, "{@hit *Hit*: ")
                   .replace(/{@atk mw}/g, "{@atk *Melee Weapon Attack*:} ")
                   .replace(/{@atk rw}/g, "{@atk *Ranged Weapon Attack*:} ")
                   .replace(/{@atk mw,rw}/g, "{@atk *Melee or Ranged Weapon Attack*:} ")
                   .replace(/{@recharge/g, "{@recharge Recharge")

    return output
}
function jsplit(str, sep, n) {
    var out = [];
    while(n--) out.push(str.slice(sep.lastIndex, sep.exec(str).index));
    out.push(str.slice(sep.lastIndex));
    return out;
}