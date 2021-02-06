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

  static getAttribute(element, attrName) {
    const regex = RegExp(attrName)

    const attributes = element.attributes

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i]
      if (regex.test(attr.name)) {
        return attr
      }
    }

    return null
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