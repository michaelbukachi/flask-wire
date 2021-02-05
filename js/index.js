import 'whatwg-fetch'
import {fetch} from "whatwg-fetch";

export class DomUtils {

  static selectElementsWithAttribute(doc, attr) {
    const regex = new RegExp(attr)
    const elements = []
    const children = doc.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.hasAttributes()) {
        for (let j = 0; j < child.attributes.length; j++) {
          if (regex.test(child.attributes[j].name)) {
            elements.push(child)
            break
          }
        }
      }
    }
    return elements
  }

  static selectFirstElementWithAttribute(doc, attr) {
    const elements = DomUtils.selectElementsWithAttribute(doc, attr)
    return elements.length ? elements[0] : null
  }

  static stringToElement(string) {
    const template = document.createElement('template')
    template.innerHTML = string.trim()
    return template.content.firstChild
  }

  static getAttributeNames(element) {
    if (!element.hasAttributes()) {
      return []
    }
    const attributeNames = []
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i]
      attributeNames.push(attr.name)
    }
    return attributeNames
  }

  static getModifiers(attr) {
    const tokens = attr.split('.')
    if (tokens.length === 1) {
      return []
    } else {
      return tokens.slice(1)
    }
  }
}

class WireFrame {
  constructor(id, element, initial = null) {
    this.id = id
    this.initial = initial
    this.source = null
    this.element = null
    this.errorBody = null
    this.loader = null
    this.loaderDisplayType = 'block'
    this.body = null

    this.init(element)
  }

  init(element) {
    if (element.children.length) {
      this.body = DomUtils.selectFirstElementWithAttribute(element, 'wire:body')
      this.errorBody = DomUtils.selectFirstElementWithAttribute(element, 'wire:error-body')
      this.loader = DomUtils.selectFirstElementWithAttribute(element, 'wire:loader.*')
    }

    this.prepareLoader()
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

  prepareLoader() {
    const displayModifiers = ['flex', 'inline-flex', 'grid', 'inline', 'inline-block', 'table']
    if (this.loader !== null) {
      const attributeNames = DomUtils.getAttributeNames(this.loader)
      const loaderAttr = attributeNames.find(name => name.startsWith('wire:loader'))
      const modifiers = DomUtils.getModifiers(loaderAttr)
      if (modifiers.length) {
        for (let mod of modifiers) {
          if (displayModifiers.includes(mod)) {
            this.loaderDisplayType = mod
            break
          }
        }
      }
    }
  }

  hideLoader() {
    if (this.loader) {
      this.loader.style.display = 'none'
    }
  }

  showLoader() {
    if (this.loader) {
      this.loader.style.display = this.loaderDisplayType
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
          const target = element.getAttribute('wire:target')
          const eventsToFire = element.getAttribute('wire:event')

          if (e.preventDefault) {
            e.preventDefault()
          }

          const url = element.getAttribute('action') || window.location.pathname
          const method = element.getAttribute('method') || 'POST'
          const data = new FormData(element)

          this.performMutation(url, data, method, () => {
            // Either the specified target is refreshed or
            // the list of events are fired
            if (target !== null) {
              const source = element.getAttribute('wire:source')
              if (source === null) {
                throw Error(`Trigger is missing the 'wire:source' attribute`)
              } else {
                if (target in self.frames) {
                  self.frames[target].updateSource(source)
                }
              }
            } else if (eventsToFire !== null) {
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