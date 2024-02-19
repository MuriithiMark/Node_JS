const http = require("node:http");

/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {string} templatePath 
 * @returns {http.IncomingMessage}
 */
const reqUtils = (req, templatePath) => {
    const pathTemplateSubStrings = templatePath.split('/');
    const realPathSubStrings = req.url.split('/');
    req.params = {}
    pathTemplateSubStrings.forEach((portion, index) => {
        if (portion.startsWith(':')) {
            req.params[portion.substring(1)] = realPathSubStrings[index]
        }
    })

    return req
}


module.exports  = reqUtils

