export function dispatch(eventName, target = null, cancelable = false) {
  const event = document.createEvent('Events')
  event.initEvent(eventName, true, cancelable === true)

  if (event.cancelable && !preventDefaultSupported) {
    const { preventDefault } = event
    event.preventDefault = function () {
      if (!this.defaultPrevented) {
        Object.defineProperty(this, 'defaultPrevented', () => true)
        preventDefault.call(this)
      }
    }
  }

  (target || document).dispatchEvent(event)
  return event
}

const preventDefaultSupported = (() => {
  const event = document.createEvent('Events')
  event.initEvent('test', true, true)
  event.preventDefault()
  return event.defaultPrevented
})()