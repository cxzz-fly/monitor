

export function injectJsError () {
  window.addEventListener('error', (event) => { // 监听错误对象
    console.log('event', event)
    const { message, filename, lineno, colno, error: { stack } } = event
    let log = {
      kind: 'stability', // 监控指标大类
      type: 'error', // 小类 
      errorType: 'jsError', // js执行错误 
      url: '',
      message,
      filename,
      position: `${lineno}:${colno}`,
      stack: getLines(stack)

    }
  })

  function getLines (stack) {
    return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, '').join('^'))
  }

}