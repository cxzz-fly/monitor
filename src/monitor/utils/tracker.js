
const host = 'cn-shanghai.log.aliyuncs.com'
const project = 'cxzmonitor'
const logstoreName = 'cxzmonitor-store'
const userAgent = require('user-agent')

function getExtraData () {
    return {
        title: document.title,
        url: location.href,
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent).name
    }
}
class SendTracker {
    constructor() {
        this.url = `http://${project}.${host}/logstores/${logstoreName}/track`; //上报的路径
        this.xhr = new XMLHttpRequest;
    }
    send (data) {
        let extraData = getExtraData();
        let log = { ...data, ...extraData };
        // 对象的value不能是数字
        for (const key in log) {
            if (log.hasOwnProperty(key)) {
                if (typeof log[key] === 'number') {
                    log[key] = `${log[key]}`
                }
            }
        }
        // const body = JSON.stringify(log)
        const body = JSON.stringify({
            __logs__: [log]
        })
        this.xhr.open('POST', this.url, true)
        this.xhr.setRequestHeader('Content-Type', 'application/json')
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0')
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length)
        // this.xhr.onload(res => {
        //     console.log(res);
        // })
        // this.xhr.onerror(err => {
        // console.error(err)
        // })
        this.xhr.send(body)
    }
}

export default new SendTracker();