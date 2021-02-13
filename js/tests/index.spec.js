const {checkStatus} = require("../index");

test('checkStatus logic', () => {
  const goodResponse = { status: 201 }
  const badResponse =  { status: 400, statusText: 'Bad request' }
  expect(checkStatus(goodResponse)).toStrictEqual(goodResponse)
  expect(() => { checkStatus(badResponse) }).toThrow('Bad request')
})