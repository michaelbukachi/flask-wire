const {DomUtils} = require("../index");

test('DomUtils selectElementsWithAttribute - no regex', () => {
  const element = DomUtils.stringToElement('<div class="parent"><div wire:loader></div></div>')
  const elements = DomUtils.selectElementsWithAttribute(element, 'wire:loader')
  expect(elements.length).toBe(1)
})

test('DomUtils selectElementsWithAttribute - regex', () => {
  const element = DomUtils.stringToElement('<div class="parent"><div wire:loader.flex></div></div>')
  const elements = DomUtils.selectElementsWithAttribute(element, 'wire:loader.*')
  expect(elements.length).toBe(1)
})

test('DomUtils getModifiers', () => {
  let modifiers = DomUtils.getModifiers('wire:loader.grid')
  expect(modifiers).toStrictEqual(['grid'])
  modifiers = DomUtils.getModifiers('wire:loader')
  expect(modifiers).toStrictEqual([])
})

test('DomUtils getAttributeNames', () => {
  const element = DomUtils.stringToElement('<div wire:loader.flex></div>')
  const attributeNames = DomUtils.getAttributeNames(element)
  expect(attributeNames).toStrictEqual(['wire:loader.flex'])
})
