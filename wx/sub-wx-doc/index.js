const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');
const {timeoutFunc, getBody} = require('./util/index')
/**
 * 每小时轮询一次
 */
timeoutFunc({
    interval: 1, //间隔天数，间隔为整数
    runNow: true, //是否立即运行
    time: "10:00:00" //执行的时间点 时在0~23之间
}, secondNotice)


/**
 * 消息推送
 */
function secondNotice() {
    axios({
        method: 'GET',
        url: 'https://developers.weixin.qq.com/miniprogram/dev/framework/release/',
    }).then(res => {
        const $ = cheerio.load(getBody(res.data));
        const serverVision = $('.content h2:eq(0)').text()
        fs.readFile('./index.txt', function (err, data) {
            if (!err) {
                const buffer = Buffer.from(data)
                const localVision = buffer.toString('utf8')

                if (localVision !== serverVision) {
                    axios({
                        method: 'POST',
                        url: 'https://xizhi.qqoq.net/XZ7c550af60ed56090c6ba970877a85ab2.channel',
                        data: {
                            title: '微信文档更新啦~',
                            content: `版本${serverVision}\n[更新内容](https://developers.weixin.qq.com/miniprogram/dev/framework/release/)`
                        }
                    }).then(res => {
                        console.log('消息通知发送成功');
                        fs.writeFileSync('./index.txt', serverVision)
                    })
                }

            };

        })
    })
}


