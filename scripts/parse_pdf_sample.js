const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('assets/ANDHRA KRISTHAVA KEERTHANALU.pdf');

// Proper usage is usually: 
// const pdf = require('pdf-parse');
// then pdf(dataBuffer).then(...)

// If `pdf` itself is not the function, let's try logging what pdf is
// or usage according to documentation (usually it is the default export)
// In some cases it might be .default
// Or the user's Node environment might behave differently.

// Let's retry with a safer approach to check export
// But typically require('pdf-parse') returns the function directly.
// The error "pdf is not a function" suggests maybe it got imported as an object.

try {
    // If it's an object with default export
    let parseFunc = pdf;
    if (typeof pdf !== 'function' && pdf.default) {
        parseFunc = pdf.default;
    }

    if (typeof parseFunc !== 'function') {
        console.error("Could not find PDF parse function. Library structure:", pdf);
    } else {
        parseFunc(dataBuffer).then(function (data) {
            console.log("PDF TEXT START >>>");
            console.log(data.text.substring(0, 3000));
            console.log("<<< PDF TEXT END");
        }).catch(err => console.error("Parse Error:", err));
    }

} catch (e) {
    console.error("Error:", e);
}
