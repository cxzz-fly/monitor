import getLastEvents from '../utils/getLastEvents'
import getSelector from '../utils/getSlector'
import tracker from '../utils/tracker'


export function injectJsError () {
  window.addEventListener('error', (event) => { // 监听错误对象
    const lastEvent = getLastEvents()
    if (event.target && (event.target.src || event.target.href)) {
      //脚本加载错误
      let log = {
        kind: 'stability', // 监控指标大类
        type: 'error', // 小类 
        errorType: 'resourceError', // js执行错误 
        filename: event.target.src || event.target.href,
        tagName: event.target.tagName,
        slector: getSelector(event.target)
      }
      tracker.send(log)
    } else {
      const { message, filename, lineno, colno, error: { stack } } = event
      let log = {
        kind: 'stability', // 监控指标大类
        type: 'error', // 小类 
        errorType: 'jsError', // js执行错误 
        message,
        filename,
        position: `${lineno}:${colno}`,
        stack: getLines(stack),
        slector: lastEvent ? getSelector(lastEvent.path) : ''//最后操作的一个元素
      }
      tracker.send(log)
    }
  }, true)

  function getLines (stack) {
    return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, '')).join('^')
  }


  window.addEventListener('unhandledrejection', event => {
    console.log(event)
    let lastEvent = getLastEvents();
    let message;
    let filename;
    let line;
    let column;
    let stack;
    let reason = event.reason;
    if (typeof reason === 'string') {
      message = reason;
    } else if (typeof reason === 'object') {
      //at http://localhost:8080/:24:36
      if (reason.stack) {
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1]
        line = matchResult[2]
        column = matchResult[3]
      }
      message = reason.message
      stack = getLines(reason.stack)
    }
    let log = {
      kind: 'stability', // 监控指标大类
      type: 'error', // 小类 
      errorType: 'PromiseError', // js执行错误 
      message,
      filename,
      position: `${line}:${column}`,
      stack,
      slector: lastEvent ? getSelector(lastEvent.path) : ''//最后操作的一个元素
    }
    tracker.send(log)
  }, true)

}