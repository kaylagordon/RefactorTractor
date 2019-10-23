const chai = require('chai');
const expect = chai.expect;

import ActionRepository from '../src/Action-Repository';
import hydrationTestData from '../test-data/hydration-test-data';
import sleepTestData from '../test-data/sleep-test-data';
import activityTestData from '../test-data/activity-test-data';

describe('ActionRepository', function() {
  let actionRepository1;
  let actionRepository2;
  let actionRepository3;
  beforeEach(() => {
    actionRepository1 = new ActionRepository(hydrationTestData);
    actionRepository2 = new ActionRepository(sleepTestData);
    actionRepository3 = new ActionRepository(activityTestData);
  });
  it('should be a function', function() {
    expect(ActionRepository).to.be.a('function');
  });
  it('should hold data', function() {
    expect(actionRepository1.data).to.deep.equal(hydrationTestData);
  });
  it('should find user data by user id', function() {
    expect(actionRepository1.findCurrentUserData(1).length).to.equal(9);
  });
  it('should find specific user action on specific date', function() {
    expect(actionRepository2.returnActionByDate(3, '2019/06/15', 'hoursSlept')).to.equal(10.8);
  });
  it('should find specific user action over week', function() {
    expect(actionRepository3.returnActionByWeek(1, '2019/06/15', 'minutesActive').length).to.equal(6);
    expect(actionRepository3.returnActionByWeek(1, '2019/06/15', 'minutesActive')[0]).to.equal(175);
  });
});
