import 'whatwg-fetch'
import {fetch} from "whatwg-fetch";

class WireFrame {
  constructor(id, element, initial = null, events = null) {
    this.id = id
    this.element = element
    this.initial = initial
    this.source = null
    this.events = events === null ? [] : events
  }

  updateBody(body) {
    this.element.innerHTML = body
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
    fetch(source).then((response) => {
      return response.text()
    }).then((body) => {
      this.updateBody(body)
      this.source = source

      if (onDone !== null) {
        const element = this.stringToElement(body)
        onDone(element)
      }
    }).catch(function (e) {
      console.log(e)
    })
  }

  handleEvent(event) {
    if (this.events.map(e => e.name).includes(event)) {
      if (this.source !== null) {
        this.updateSource(this.source)
      }
    }
  }
}

class WireEvent {
  constructor(name) {
    this.name = name
  }
}

class WireManager {
  constructor() {
    this.frames = {}
  }

  load() {
    this.loadFrames()
    this.prepareTriggers()
    this.setupDocumentListeners()
  }

  loadFrames(doc = document) {
    this.getAllWireFrames(doc).forEach(element => {
      const id = element.getAttribute('wire:frame')
      const initial = element.getAttribute('wire:init')
      const events = element.getAttribute('wire:on-event')
      let eventsList = null

      if (events !== null) {
        eventsList = events.split(',').map(event => new WireEvent(event))
      }
      if (!(id in this.frames)) {
        this.frames[id] = new WireFrame(id, element, initial, eventsList)
        if (initial !== null) {
          this.frames[id].updateSource(initial, (doc) => {
            this.loadFrames(doc)
            this.prepareTriggers(doc)
          })
        }
      }
    })
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

  fireEvents(events) {
    for (let event of events) {
      for (let frameId of Object.keys(this.frames)) {
        this.frames[frameId].handleEvent(event)
      }
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