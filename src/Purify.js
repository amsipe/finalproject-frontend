import purifycss from "purify-css";
const purifycss = require("purify-css");

let content = ['**/src/*.js','**/src/*.html']
let css = ['**/src/*.css']
let options = {
    output: "./output.css",
    reject: true
}
purify(content, css, options)