const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');
const {timeoutFunc, getBody} = require('./util/index')
const { ssr } = require('./config');

/**
 * 定时检测
 */
timeoutFunc({
    interval: 1, //间隔天数，间隔为整数
    runNow: false, //是否立即运行
    time: "10:00:00" //执行的时间点 时在0~23之间
}, checkVersion)


function checkVersion() {
    secondNoticeBaseLib();
    secondNoticeNewAbility();
    secondNoticeNews();
}
/**
 * 基础库更新提醒
 * 消息推送
 */
function secondNoticeBaseLib() {
    axios({
        method: 'GET',
        url: 'https://developers.weixin.qq.com/miniprogram/dev/framework/release/',
    }).then(res => {
        const $ = cheerio.load(getBody(res.data));
        const serverVision = $('.content h2:eq(0)').text()
        fs.readFile('./version.txt', function (err, data) {
            if (!err) {
                const buffer = Buffer.from(data)
                let text = buffer.toString('utf8')
                const localVision = text.split('\n')[0]
                console.log('localVisionn', localVision);
                console.log('localVisionn', serverVision);
                console.log('localVisionn', localVision !== serverVision);
                

                if (localVision !== serverVision) {
                    axios({
                        method: 'POST',
                        url: ssr,
                        data: {
                            title: '基础库更新',
                            content: `版本${serverVision}\n[更新内容](https://developers.weixin.qq.com/miniprogram/dev/framework/release/)`
                        }
                    }).then(res => {
                        console.log('【通知发送成功】基础库更新');
                        fs.writeFileSync('./version.txt', serverVision + '\n' + text.split('\n')[1] + '\n' + text.split('\n')[2])
                    })
                }

            };

        })
    })
}
/**
 * 新能力更新提醒
 * 消息推送
 */
function secondNoticeNewAbility() {
    axios({
        method: 'GET',
        url: 'https://developers.weixin.qq.com/community/business/course/0004ca93454498f68aac5faa25b80d',
    }).then(res => {
        const $ = cheerio.load(getBody(res.data));
        const serverVision = $('.course-container .course-content_part .sub-title:eq(0)').text()
        const serverVisionLink = 'https://developers.weixin.qq.com' + $('.course-content_part_list a:eq(0)').attr('href')
        
        
        fs.readFile('./version.txt', function (err, data) {
            if (!err) {
                const buffer = Buffer.from(data)
                let text = buffer.toString('utf8')
                const localVision = text.split('\n')[1]
                console.log('localVisionn', localVision);
                console.log('serverVision', serverVision);
                console.log('localVisionn', localVision !== serverVision);
                
                
                if (localVision !== serverVision) {
                    axios({
                        method: 'POST',
                        url: ssr,
                        data: {
                            title: '小程序开发新能力',
                            content: `${serverVision}\n[更新内容](${serverVisionLink})`
                        }
                    }).then(res => {
                        console.log('【通知发送成功】新能力更新提醒');
                        fs.writeFileSync('./version.txt', text.split('\n')[0] + '\n' + serverVision + '\n' + text.split('\n')[2])
                    })
                }

            };

        })
    })
}
/**
 * 官方公告
 * 消息推送
 */
 function secondNoticeNews() {
    axios({
        method: 'GET',
        url: 'https://developers.weixin.qq.com/community/develop/list/2',
    }).then(res => {
        const $ = cheerio.load(getBody(res.data));
        const serverVision = $('#article_frame .post_list .post_time:eq(0)').text()
        const serverVisionLink = 'https://developers.weixin.qq.com' + $('#article_frame .post_list a:eq(0)').attr('href')
        const serverVisionContent= $('#article_frame .post_list meta:eq(0)').attr('content')
        console.log('localVisionn', serverVisionLink);
        console.log('serverVision', serverVision);
        console.log('serverVision', serverVisionContent);
   
        
        fs.readFile('./version.txt', function (err, data) {
            if (!err) {
                const buffer = Buffer.from(data)
                let text = buffer.toString('utf8')
                const localVision = text.split('\n')[2]
                console.log('localVisionn', localVision);
                console.log('serverVision', serverVision);
                console.log('localVisionn', localVision !== serverVision);
                
                
                if (localVision !== serverVision) {
                    axios({
                        method: 'POST',
                        url: ssr,
                        data: {
                            title: '官方公告更新',
                            content: `${serverVisionContent}\n[查看详情](${serverVisionLink})`
                        }
                    }).then(res => {
                        console.log('【通知发送成功】官方公告更新');
                        fs.writeFileSync('./version.txt', text.split('\n')[0] + '\n' + text.split('\n')[1] + '\n' + serverVision)
                    })
                }

            };

        })
    })
}
