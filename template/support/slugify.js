import _toString from "lodash-es/toString.js"
import _words from "lodash-es/words.js"

function slugify(string) {
    return _words(
        _toString(string.normalize("NFD"))
            .replace(/["\u0300-\u036f]/g, "")
            .replace(/["\u2019+:+/]/g, ""),
        /[\w]+/g
    ).reduce((result, word, index) => result + (index ? "-" : "") + word.toLowerCase(), "")
}

export default slugify
