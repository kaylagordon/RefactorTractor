import $ from 'jquery';
import User from './User';
import UserRepository from './User-repository';
import Activity from './Activity-Repository';
import Hydration from './Hydration-Repository';
import Sleep from './Sleep-Repository';


// import userData from '../data/users';
// import sleepData from '../data/sleep';
// import hydrationData from '../data/hydration';
// import activityData from '../data/activity';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/building.svg'
import './images/coffin.svg'
import './images/ghost (1).svg'
import './images/ghost-happy.svg'
import './images/ghost-sad.svg'
import './images/glass-empty.svg'
import './images/glass-full.svg'
// import { promises } from 'dns';
let userIdNum;
let currentDate;
let user;
let userRepo;
let newUser;
let hydration;
let sleep;
let activity; 
let friendNames;
let friendSteps;
let stepsTrend;

let userData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData').then(function(response) {
  return response.json()
});
let sleepData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData').then(function(response) {
  return response.json()
});
let hydrationData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData').then(function(response) {
  return response.json()
});
let activityData = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData').then(function(response) {
  return response.json()
})

let combinedData = {
  "userData": {},
  "sleepData":{},
  "hydrationData":{},
  "activityData":{}
};

Promise.all([ userData, sleepData, hydrationData, activityData ]).then(function (values) {
  combinedData["userData"] = values[0].userData;
  combinedData["sleepData"] = values[1].sleepData;
  combinedData["hydrationData"] = values[2].hydrationData;
  combinedData["activityData"] = values[3].activityData;
  }).then(() => {
    doAllThings(combinedData);
    allGraphs();
  });

function doAllThings(data) {
userIdNum = generateRandomUserId();
currentDate = '2019/06/30';
userRepo = new UserRepository(data.userData);
user = userRepo.returnUserData(userIdNum);
newUser = new User(user);
hydration = new Hydration(data.hydrationData);
sleep = new Sleep(data.sleepData);
activity = new Activity(data.activityData);
friendNames = returnFriendListNames();
friendSteps = returnFriendListSteps();
stepsTrend = (activity.returnThreeDayStepStreak(user.id)[0]);

$('#user-name').text(newUser.returnUserFirstName());
$('#current-date').text(currentDate);
$('#user-info-name').text(newUser.name);
$('#user-info-email').text(newUser.email);
$('#user-info-address').text(newUser.address);
$('#user-info-step-goal').text(newUser.dailyStepGoal);
$('#average-step-goal-all-users').text(userRepo.returnAllUsersAverageStepGoal());
$('#user-water-by-day').text(hydration.returnFluidOzByDate(user.id, currentDate));
$('#user-sleep-by-day').text(sleep.returnAmountSlept(user.id, currentDate));
$('#user-sleep-quality-by-day').text(sleep.returnSleepQuality(user.id, currentDate));
$('#user-sleep-by-week').text(sleep.returnSleepByWeek(user.id, currentDate));
$('#user-sleep-quality-by-week').text(sleep.returnSleepQualityByWeek(user.id, currentDate));
$('#user-average-sleep-quality').text(sleep.returnAverageSleepQuality(user.id));
$('#user-average-hours-slept').text(sleep.returnAverageSleep(user.id));
$('#user-current-step-count').text(activity.returnNumberOfStepsByDate(user.id, currentDate));
$('#user-rested').text(displaySleepStatus());
$('#user-current-mins-active').text(activity.returnActiveMinutesByDate(user.id, currentDate));
$('#user-current-miles-walked').text(activity.returnMilesWalkedByDate(user, currentDate));
$('#user-current-step-count-vs-average').text(activity.returnNumberOfStepsByDate(user.id, currentDate));
$('#all-users-average-step-count').text(activity.returnAvgStepsTakenAllUsersByDate(currentDate));
$('#user-current-stairs-climbed').text(activity.returnStairsClimbedByDate(user.id, currentDate));
$('#all-users-average-stairs-climbed').text(activity.returnAvgStairsClimbedAllUsersByDate(currentDate));
$('#user-current-active-mins').text(activity.returnActiveMinutesByDate(user.id, currentDate));
$('#all-users-average-active-mins').text(activity.returnAvgActiveMinutesAllUsersByDate(currentDate));
$('#user-step-count-by-week').text(activity.returnNumberOfStepsByWeek(user.id, currentDate))
$('#user-stairs-climbed-by-week').text(activity.returnStairsClimbedByWeek(user.id, currentDate))
$('#user-mins-active-by-week').text(activity.returnActiveMinutesByWeek(user.id, currentDate))
$('#winner-name').text(returnFriendChallengeWinner(friendNames))
$('#user-water-trend-week').text(displayWaterStatus());
$('#republic-plaza-challenge').text(activity.republicPlazaChallenge(user.id))
}

function generateRandomUserId() {
  let randomNumOneToFifty = (Math.random() * 50);
  return Math.ceil(randomNumOneToFifty);
}

function displaySleepStatus() {
  sleep.checkUserRestedByDate(user.id, currentDate)
  if (sleep.isRested === true) {
    $('#sleep-status').attr('src', '../images/ghost-happy.svg');
    $('#sleep-comment').text('You\'ve been getting enough sleep!');
  } else {
    $('#sleep-status').attr('src', '../images/ghost-sad.svg');
    $('#sleep-comment').text('Getting 8 hours of sleep will make you more productive!');
  }
}

function displayWaterStatus() {
  let checkWater = hydration.returnDidUserDrinkEnoughWater(user.id, currentDate)
  if (checkWater === true) {
    $('#water-status').attr('src', '../images/glass-full.svg');
    $('#water-comment').text('Keep up the good work! You\'ve averaged more than 64 ounces per day this week');
  } else {
    $('#water-status').attr('src', '../images/glass-empty.svg');
    $('#water-comment').text('You need more water. Make sure you\'re staying hydrated!');
  }
}

function populateFriends(userFriends) {
  let friends = userFriends.map(friend => {
    let userFriend = new User(userRepo.returnUserData(friend))
    return ({
      id: userFriend.id, 
      name: userFriend.returnUserFirstName(),
      steps: (activity.returnNumberOfStepsByWeek(userFriend.id, currentDate)).reduce((acc, day) => acc += day)})
  });
  friends.push(populateUserDataForFriendChallenge());
  return friends.sort((userA, userB) => userB.steps - userA.steps);
}

function populateUserDataForFriendChallenge() {
  return {
    id: user.id,
    name: newUser.returnUserFirstName(),
    steps: activity.returnNumberOfStepsByWeek(user.id,currentDate)
      .reduce((acc, day) => acc += day)
  }
}

function returnFriendListNames() {
  let friendObjs = populateFriends(user.friends);
  return friendObjs.map(friend => friend.name);
}

function returnFriendListSteps() {
  let friendObjs = populateFriends(user.friends);
  return friendObjs.map(friend => friend.steps);
}

function returnFriendChallengeWinner(friendNames) {
  if (friendNames[0] === newUser.returnUserFirstName()) {
    return `You win!!`;
  }
  return `${friendNames[0]} is the Winner!`
}

function returnDatesOfWeek(userId, date) {
  let userData = activity.findCurrentUserData(userId);
  let index = userData.findIndex((data) => data.date === date);
  return userData.splice(index - 6, 7).map(day => day.date);
}
function allGraphs() {
Chart.defaults.global.defaultFontColor = 'white';
var ctx = $('#user-water-by-week');
var hydrationByWeek = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'ounces',
      data: hydration.returnFluidOzByWeek(user.id, currentDate),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgb(221, 160, 221, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(192, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#user-sleep-by-week');
var sleepQualityHrsByWeek = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'hours',
      data: sleep.returnSleepByWeek(user.id, currentDate),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgb(221, 160, 221, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(192, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    },
    {
      label: 'quality score',
      data: sleep.returnSleepQualityByWeek(user.id, currentDate),
      backgroundColor: [
        'rgb(221, 160, 221, 0.2)',
       
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
      type: 'line',
    }]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#user-step-count-by-week');
var stepsByWeek = new Chart(ctx, {
  type: 'line',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'steps',
      data: activity.returnNumberOfStepsByWeek(user.id, currentDate),
      backgroundColor: [
        'rgba(221, 160, 221, 0.2)',
      ],
      borderColor: [
        'rgba(221, 160, 221, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    },
  ]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#user-mins-active-by-week');
var activityByWeek = new Chart(ctx, {
  type: 'line',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'active minutes',
      data: activity.returnActiveMinutesByWeek(user.id, currentDate),
      backgroundColor: [
        'rgb(221, 160, 221, 0.2)',
      ],
      borderColor: [
        'rgba(221, 160, 221, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#user-stairs-climbed-by-week');
var stairsByWeek = new Chart(ctx, {
  type: 'line',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'stairs climbed',
      data: activity.returnStairsClimbedByWeek(user.id, currentDate),
      backgroundColor: [
        'rgb(221, 160, 221, 0.2)',
      ],
      borderColor: [
        'rgba(221, 160, 221, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#friend-info');
var friendStepChallenge = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: friendNames,
    datasets: [{
      label: 'steps',
      data: friendSteps,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgb(221, 160, 221, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(192, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {},
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#step-trend');
var stepTrend = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Object.keys(stepsTrend).reverse(),
    datasets: [{
      label: 'steps',
      data: Object.values(stepsTrend).reverse(),
      backgroundColor: [
        'rgb(221, 160, 221, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(192, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(221, 160, 221, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {},
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
})
}