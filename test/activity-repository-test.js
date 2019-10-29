const chai = require('chai');
const expect = chai.expect;

import Activity from '../src/Activity-Repository';
import User from '../src/User';
import activityTestData from '../test-data/activity-test-data';
import userTestData from '../test-data/user-test-data.js';

describe('Activity', () => {
  let activity, user1, user3;
  beforeEach(() => {
    activity = new Activity(activityTestData);
    user1 = new User(userTestData[0]);
    user3 = new User(userTestData[2]);
  });

  it('should be a function', function () {
    expect(Activity).to.be.a('function');
  });

  it('should calculate average stairs climbed for all users on a given day', function () {
    expect(activity.returnAvgActivityAllUsersByDate('2019/06/15', 'flightsOfStairs')).to.equal(19);
  });

  it('should return how many minutes active a specified user was on a specific date', () => {
    expect(activity.returnActivityByDate(2, '2019/06/16', 'minutesActive')).to.equal(220);
  })

  it('should return a boolean based on whether a user achieved their step goal an a specific day', () => {
    expect(activity.checkStepGoalMetByDate(user3, '2019/06/15')).to.equal(true);
  })

  it('should return for a specific user their all time stair climbing record', () => {
    expect(activity.returnStairClimbingRecord(2)).to.equal(44)
  })

  it('should calculate average steps taken for all users on a given day', function () {
    expect(activity.returnAvgActivityAllUsersByDate('2019/06/16', 'numSteps')).to.equal(7684);
  });

  it('should calculate average minutes active for all users on a given day', function () {
    expect(activity.returnAvgActivityAllUsersByDate('2019/06/16', 'minutesActive')).to.equal(182);
  });

  it('should find all of the days the user met their step goal', function () {
    let days = ['2019/06/17', '2019/06/20']
    expect(activity.returnAllDaysStepGoalExceeded(user1, '2019/06/16')).to.deep.eql(days);
  });

  it('should calculate a user\'s miles walked on a given day', function () {
    expect(activity.returnMilesWalkedByDate(user1, '2019/06/16')).to.equal(5);
  });

  it('should calculate a user\'s average active minutes per week', function () {
    expect(activity.returnAvgActiveMinutesByWeek(1, '2019/06/15')).to.equal(151);
  });

  it('should calculate a user\'s active minutes per week', function () {
    expect(activity.returnActivityByWeek(1, '2019/06/21', 'minutesActive')).to.deep.eql([140, 175, 168, 165, 275, 140, 135]);
  });

  it('should calculate a user\'s number of steps per week', function () {
    expect(activity.returnActivityByWeek(1, '2019/06/21', 'numSteps')).to.deep.eql([3577, 6637, 14329, 4419, 8429, 14478, 6760]);
  });

  it('should calculate a user\'s stairs climbed per week', function () {
    expect(activity.returnActivityByWeek(1, '2019/06/21', 'flightsOfStairs')).to.deep.eql([16, 36, 18, 33, 2, 12, 6]);
  });

  it('should determine a user\'s activity status for a given day', function () {
    expect(activity.checkUserActivityStatusByDate(1, '2019/06/15')).to.equal(true);
  });

  it('should calculate a user\'s number of steps for a given day', function () {
    expect(activity.returnActivityByDate(1, '2019/06/15', 'numSteps')).to.equal(3577);
  });

  it('should calculate a user\'s flights of stairs for a given day', function () {
    expect(activity.returnActivityByDate(1, '2019/06/15', 'flightsOfStairs')).to.equal(16);
  });

  it('should be able to find streaks of three days where steps increased for each day', () => {
    expect(activity.returnThreeDayStepStreak(1)).to.eql([{
      "2019/06/15": 3577,
      "2019/06/16": 6637,
      "2019/06/17": 14329
    },
    {
      "2019/06/18": 4419,
      "2019/06/19": 8429,
      "2019/06/20": 14478
    }
    ]);
  });

  it('should return the number of times the user has climbed the equivelant of Republic Plaza', () => {
    expect(activity.republicPlazaChallenge(1)).to.equal(2);
  })

});
