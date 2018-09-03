const fs = require('fs');
const expect = require('chai').expect;
const parserJSON = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath).toString());
};

const getDiffs = require('./index.js');

describe('getDiffs', function() {
  let notifier;
  const diff1 = parserJSON('./tests/fixtures/obj-diff-1.json');
  const diff2 = parserJSON('./tests/fixtures/obj-diff-2.json');

  describe('when there are two objects', function() {
    it('return all diffs from two objects', function() {
      expect(getDiffs(diff1, diff2)).to.be.deep.equals([
        'Children.1.MetaInfo.MissingFields.0.Field',
        'Children.1.MetaInfo.SMIRFs.0.Field',
        'Children.1.Notes.0.Text',
        'Children.0.SecondaryType',
        'Children.0.MetaInfo.MissingFields.1.Field',
        'Children.0.MetaInfo.MissingFields.1.Other',
        'Children.0.MetaInfo.MissingFields.0.Field',
        'Children.0.Status',
        'Children.0.AssignedTo',
      ]);
    });
  });

  describe('when there are no old value', function() {
    it('return all diffs from two objects', function() {
      expect(getDiffs(null, diff2)).to.be.deep.equals([
        '_id',
        'CaseId',
        'OrderId',
        'Children.0.OrderId',
        'Children.0.PrimaryType',
        'Children.0.MetaInfo.MissingFields.0.Field',
        'Children.0.MetaInfo.MissingFields.1.Field',
        'Children.0.MetaInfo.MissingFields.1.Other',
        'Children.0.SubCaseId',
        'Children.0.Status',
        'Children.0.Resolution',
        'Children.0.AssignedTo',
        'Children.0.CreatedBy',
        'Children.0.CreatedAt',
        'Children.0.Notes',
        'Children.1.OrderId',
        'Children.1.PrimaryType',
        'Children.1.SubCaseId',
        'Children.1.Status',
        'Children.1.CreatedBy',
        'Children.1.CreatedAt',
        'Children.1.Notes.0.Type',
        'Children.1.Notes.0.Text',
        'Children.1.Notes.0.Attachments',
        'Children.1.Notes.0.NoteId',
        'Children.1.Notes.0.CreatedBy',
        'Children.1.Notes.0.CreatedAt',
        'Children.1.Notes.0.ModifiedBy',
        'Children.1.Notes.0.ModifiedAt',
        'Children.1.ModifiedBy',
        "Children.1.ModifiedAt",
        'Children.1.FollowUp',
        'CreatedBy',
        'CreatedAt',
        'LockedBy',
        'LockedAt',
      ]);
    });
  });

  describe('ignroe white list', function() {
    it('return all diffs from two objects withou filds from whitelist', function() {
      const whiteList = ['_id', 'CreatedAt', 'ModifiedAt', 'ModifiedBy', 'CreatedBy', 'LockedAt', 'LockedBy'];
      expect(getDiffs(null, diff2, { whiteList })).to.be.deep.equals([
        'CaseId',
        'OrderId',
        'Children.0.OrderId',
        'Children.0.PrimaryType',
        'Children.0.MetaInfo.MissingFields.0.Field',
        'Children.0.MetaInfo.MissingFields.1.Field',
        'Children.0.MetaInfo.MissingFields.1.Other',
        'Children.0.SubCaseId',
        'Children.0.Status',
        'Children.0.Resolution',
        'Children.0.AssignedTo',
        'Children.0.Notes',
        'Children.1.OrderId',
        'Children.1.PrimaryType',
        'Children.1.SubCaseId',
        'Children.1.Status',
        'Children.1.Notes.0.Type',
        'Children.1.Notes.0.Text',
        'Children.1.Notes.0.Attachments',
        'Children.1.Notes.0.NoteId',
        'Children.1.FollowUp',
      ]);
    });
  });
});
