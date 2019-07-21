const assert = require('assert');
const db = require('../db/index.js');
// console.log('fool', db.saveMessage)
describe('Array', function() {
  describe('#db.saveMessage()', function() {
    it('should save one message to the database', function() {
      let resultArray = [];
      assert.equal(db.saveMessage('1', '1', 'This is text'), 1)
    })
  })
})
//create test to check for exist;

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});