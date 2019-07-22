const assert = require('assert');

describe('database', function() {
  describe('db', function() {
    it('db should exist', function() {
      assert.equal(true, true);
    });
  });
});

describe('database', function() {
  describe('#db.saveMessage()', function() {
    it('should save one message to the database', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('database', function() {
  describe('#db.saveUser()', function() {
    it('should save one user to the database', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('database', function() {
  describe('#db.getAllMessages()', function() {
    it('should get all messages from the database', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('database', function() {
  describe('#db.saveFamily()', function() {
    it('should save one family to the database', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('database', function() {
  describe('#db.getAllUsers()', function() {
    it('should get all users from the database', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
