import getLastEvents from '../utils/getLastEvents'
import getSelector from '../utils/getSlector'
import tracker from '../utils/tracker'


export function injectJsError () {
  window.addEventListener('error', (event) => { // 监听错误对象
    const lastEvent = getLastEvents()
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
  })

  function getLines (stack) {
    return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, '')).join('^')
  }

}