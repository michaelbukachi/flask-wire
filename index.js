import 'whatwg-fetch'
import {fetch} from "whatwg-fetch";

class WireFrame {
  constructor(id, element, initial = null) {
    this.id = id
    this.initial = initial
    this.source = null
    this.element = null
    this.errorBody = null
    this.loader = null
    this.body = null

    this.init(element)
  }

  init(element) {
    if (element.children.length) {
      this.body = element.querySelector("[wire\\:body]")
      this.errorBody = element.querySelector("[wire\\:error-body]")
      this.loader = element.querySelector("[wire\\:loader]")
    }

    this.hideLoader()
    this.hideError()

    this.element = element
  }

  updateBody(body) {
    if (this.body) {
      this.body.innerHTML = body
    }
  }

  updateSource(source, onSourceDataFetched = null) {
    this.fetchDataFromSource(source, onSourceDataFetched)
  }

  stringToElement(string) {
    const template = document.createElement('template')
    template.innerHTML = string.trim()
    return template.content.firstChild
  }

  fetchDataFromSource(source, target, onDone = null) {
    this.hideError()
    this.showLoader()

    fetch(source)
      .then(this.checkStatus)
      .then((response) => {
        return response.text()
      })
      .then((body) => {
        this.updateBody(body)
        this.source = source

        if (onDone !== null) {
          const element = this.stringToElement(body)
          onDone(element)
        }
      })
      .catch((e) => {
        console.log(e)
        this.showError()
      }).finally(() => {
      this.hideLoader()
    })
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 400) {
      return response
    } else {
      const error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  hideLoader() {
    if (this.loader) {
      this.loader.style.display = 'none'
    }
  }

  showLoader() {
    if (this.loader) {
      this.loader.style.display = 'block'
    }
  }

  hideError() {
    if (this.errorBody) {
      this.errorBody.style.display = 'none'
    }
  }

  showError() {
    if (this.errorBody) {
      this.errorBody.style.display = 'block'
    }
  }

  refresh() {
    if (this.source !== null) {
      this.updateSource(this.source)
    }
  }
}

class WireEvent {
  constructor(name) {
    this.name = name
    this.listeners = {}
  }

  addListener(listener) {
    if (!(listener.id in this.listeners)) {
      this.listeners[listener.id] = listener
    }
  }

  removeListener(listenerId) {
    if (listenerId in this.listeners) {
      delete this.listeners[listenerId]
    }
  }

  fire() {
    Object.keys(this.listeners).forEach(key => this.listeners[key].refresh())
  }
}

class WireManager {
  constructor() {
    this.frames = {}
    this.events = {}
  }

  load() {
    this.loadFrames()
    this.prepareTriggers()
    this.setupDocumentListeners()
  }

  registerForEvent(eventName, listener) {
    if (!(eventName in this.events)) {
      this.events[eventName] = new WireEvent(eventName)
    }

    this.events[eventName].addListener(listener)
  }

  fireEvents(events) {
    for (let event of events) {
      if (event in this.events) {
        this.events[event].fire()
      }
    }
  }

  loadFrames(doc = document) {
    this.getAllWireFrames(doc).forEach(element => {
      const id = element.getAttribute('wire:frame')
      const initial = element.getAttribute('wire:init')
      const events = element.getAttribute('wire:on-event')

      if (!(id in this.frames)) {
        this.frames[id] = new WireFrame(id, element, initial)

        if (events !== null) {
          events.split(',').forEach(event => this.registerForEvent(event, this.frames[id]))
        }
        if (initial !== null) {
          this.frames[id].updateSource(initial, (doc) => {
            this.loadFrames(doc)
            this.prepareTriggers(doc)
          })
        }
      }
    })

    this.doCleanup()
  }

  prepareTriggers(doc = document) {
    this.getAllWireTriggers(doc).forEach(element => {
      const target = element.getAttribute('wire:target')
      if (target === null) {
        throw Error('All wire triggers must have a "wire:target" attribute.')
      } else {
        if (element.tagName === 'A') {
          // We don't want our triggers to cause a page reload
          element.setAttribute('href', 'javascript:')
        }
      }
    })
  }

  interceptClickEvent() {
    const self = this
    const clickHandler = (e) => {
      const element = e.target
      if (element.tagName === 'A') {
        const source = element.getAttribute('wire:source')
        const target = element.getAttribute('wire:target')

        if (source === null) {
          throw Error(`Trigger is missing the 'wire:source' attribute`)
        } else {
          if (target in self.frames) {
            self.frames[target].updateSource(source)
          }
        }
      }
    }

    if (document.addEventListener) {
      document.addEventListener('click', clickHandler)
    } else if (document.attachEvent) {
      document.attachEvent('onclick', clickHandler)
    }
  }

  interceptSubmitEvent() {
    const self = this
    const submitHandler = (e) => {
      const element = e.target
      if (element.tagName === 'FORM') {
        if (element.getAttribute('wire:mutate') !== null) {
          const eventsToFire = element.getAttribute('wire:event')

          if (e.preventDefault) {
            e.preventDefault()
          }

          const url = element.getAttribute('action') || window.location.pathname
          const method = element.getAttribute('method') || 'POST'
          const data = new FormData(element)

          this.performMutation(url, data, method, () => {
            if (eventsToFire !== null) {
              const events = eventsToFire.split(',')
              self.fireEvents(events)
            }
          })

          return false

        }
      }
    }

    if (document.addEventListener) {
      document.addEventListener('submit', submitHandler)
    } else if (document.attachEvent) {
      document.attachEvent('submit', submitHandler)
    }
  }

  performMutation(url, data, method, eventsHandler = null) {
    fetch(url, {
      method: method,
      body: data
    }).then(function (response) {
      if (eventsHandler !== null) {
        eventsHandler()
      }
    }).catch(function (e) {
      console.log(e)
    })
  }

  doCleanup() {
    const storedFrameIds = new Set(Object.keys(this.frames))
    const presentFrameIds = new Set(this.getAllWireFrames().map(element => element.getAttribute('wire:frame')))
    const expiredFrameIds = [...storedFrameIds].filter(id => !presentFrameIds.has(id))
    expiredFrameIds.forEach(id => {
      Object.values(this.events).forEach(event => event.removeListener(id)) // Remove frame from event
      delete this.frames[id] // Remove frame
    })
  }

  setupDocumentListeners() {
    // Monitor click events
    this.interceptClickEvent()

    // Monitor form submissions
    this.interceptSubmitEvent()
  }

  getElementsWithAttribute(doc, attr) {
    return [].filter.call(doc.getElementsByTagName('*'), el => el.getAttribute(attr) !== null)
  }

  getAllWireFrames(doc = document) {
    return this.getElementsWithAttribute(doc, 'wire:frame')
  }

  getAllWireTriggers(doc = document) {
    return this.getElementsWithAttribute(doc, 'wire:trigger')
  }
}


window.addEventListener('DOMContentLoaded', function () {
  const wireManager = new WireManager()
  wireManager.load()
})