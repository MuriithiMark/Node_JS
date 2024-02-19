const retriveParams = (realPath, templatePath) => {
    const pathTemplateSubStrings = templatePath.split('/');
    const realPathSubStrings = realPath.split('/');
    const paramToValueMap = new Map();
    pathTemplateSubStrings.forEach((portion, index) => {
        if(portion.startsWith(':')) {
            paramToValueMap.set(portion.substring(1), realPathSubStrings[index])
        }
    })

    return paramToValueMap
}

module.exports = retriveParams;