/**
 * 定时器
 * @param {Object} config 
 * @param {String} func 
 */
function timeoutFunc(config, func) {
    config.runNow && func()
    let nowTime = new Date().getTime()
    let timePoints = config.time.split(':').map(i => parseInt(i))
    let recent = new Date().setHours(...timePoints)
    recent >= nowTime || (recent += 24 * 3600000)
    setTimeout(() => {
        func()
        setInterval(func, config.interval * 3600000)
    }, recent - nowTime)
}


/**
 * 正则匹配body
 * @param {String} content 
 * @returns 
 */
function getBody(content) {
    var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
    var result = REG_BODY.exec(content);
    if (result && result.length === 2)
        return result[1];
    return content;
}


module.exports = {
    timeoutFunc,
    getBody
}