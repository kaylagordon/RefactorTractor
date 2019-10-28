import $ from 'jquery';

import User from './User';
import UserRepository from './User-repository';
import Activity from './Activity-Repository';
import Hydration from './Hydration-Repository';
import Sleep from './Sleep-Repository';

// An example of how you tell webpack to use a CSS (SCSS) file

import './css/styles.scss';

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
    populateData(combinedData);
    populateGraphs();
  });

function populateData(data, userId) {
userIdNum = userId || generateRandomUserId();
currentDate = getDate();
userRepo = new UserRepository(data.userData);
user = userRepo.returnUserData(userIdNum);
newUser = new User(user);
hydration = new Hydration(data.hydrationData);
sleep = new Sleep(data.sleepData);
activity = new Activity(data.activityData);
friendNames = returnFriendInfo('name');
friendSteps = returnFriendInfo('steps');
stepsTrend = (activity.returnThreeDayStepStreak(user.id)[0]);

$('#user-name').text(newUser.returnUserFirstName());
$('#current-date').text(currentDate);
$('#user-info-name').text(newUser.name);
$('#user-info-email').text(newUser.email);
$('#user-info-address').text(newUser.address);
$('#user-info-step-goal').text(newUser.dailyStepGoal);
$('#average-step-goal-all-users').text(userRepo.returnAllUsersAverageStepGoal());
$('#user-water-by-day').text(hydration.returnActionByDate(user.id, currentDate, 'numOunces'));
$('#user-sleep-by-day').text(sleep.returnActionByDate(user.id, currentDate, 'hoursSlept'));
$('#user-sleep-quality-by-day').text(sleep.returnActionByDate(user.id, currentDate, 'sleepQuality'));
$('#user-sleep-by-week').text(sleep.returnActionByWeek(user.id, currentDate, 'hoursSlept'));
$('#user-sleep-quality-by-week').text(sleep.returnActionByDate(user.id, currentDate, 'sleepQuality'));
$('#user-average-sleep-quality').text(sleep.returnAverageSleepInfo(user.id, 'sleepQuality'));
$('#user-average-hours-slept').text(sleep.returnAverageSleepInfo(user.id, 'hoursSlept'));
$('#user-current-step-count').text(activity.returnActionByDate(user.id, currentDate, 'numSteps'));
$('#user-rested').text(displayStatus(sleep.isRested, '#sleep-status', '#sleep-comment', '../images/ghost-happy.svg', '../images/ghost-sad.svg', 'You\'ve been getting enough sleep!', 'Getting 8 hours of sleep will make you more productive!'));
$('#user-current-mins-active').text(activity.returnActionByDate(user.id, currentDate, 'minutesActive'));
$('#user-current-miles-walked').text(activity.returnMilesWalkedByDate(user, currentDate));
$('#user-current-step-count-vs-average').text(activity.returnActionByDate(user.id, currentDate, 'numSteps'));
$('#all-users-average-step-count').text(activity.returnAvgActivityAllUsersByDate(currentDate, 'numSteps'));
$('#user-current-stairs-climbed').text(activity.returnActionByDate(user.id, currentDate, 'flightsOfStairs'));
$('#all-users-average-stairs-climbed').text(activity.returnAvgActivityAllUsersByDate(currentDate, 'flightsOfStairs'));
$('#user-current-active-mins').text(activity.returnActionByDate(user.id, currentDate, 'minutesActive'));
$('#all-users-average-active-mins').text(activity.returnAvgActivityAllUsersByDate(currentDate, 'minutesActive'));
$('#user-step-count-by-week').text(activity.returnActionByWeek(user.id, currentDate, 'numSteps'))
$('#user-stairs-climbed-by-week').text(activity.returnActionByWeek(user.id, currentDate, 'flightsOfStairs'))
$('#user-mins-active-by-week').text(activity.returnActionByWeek(user.id, currentDate, 'minutesActive'))
$('#winner-name').text(returnFriendChallengeWinner(friendNames))
$('#user-water-trend-week').text(displayStatus(hydration.returnDidUserDrinkEnoughWater(user.id, currentDate), '#water-status', '#water-comment', '../images/glass-full.svg', '../images/glass-empty.svg', 'Keep up the good work! You\'ve averaged more than 64 ounces per day this week', 'You need more water. Make sure you\'re staying hydrated!'));
$('#republic-plaza-challenge').text(activity.republicPlazaChallenge(user.id))
}

$('#change-user-button').click(function() {
  changeFormDisplay($('#user-id-form'))
})

$('#update-steps-button').click(function() {
  changeFormDisplay($('#update-steps-form'))
})

$('#update-hydration-button').click(function() {
  changeFormDisplay($('#update-hydration-form'))
})

$('#update-sleep-button').click(function() {
  changeFormDisplay($('#update-sleep-form'))
})

$('#submit-user-button').click(function() {
  changeUser();
  closeForm('#submit-user-button');
})

$('#user-id-input').keyup(function() {
  enableButton(0 < $(this).val() && $(this).val() < 51, '#submit-user-button');
  showError(0 < $(this).val() && $(this).val() < 51, '#user-id-error');
})

$('#hydration-input').keyup(function() {
  enableButton(0 < $(this).val(), '#submit-hydration-button');
  showError(0 < $(this).val(), '#hydration-error');
})

$('#steps-input').keyup(function() {
  enableButton(0 < $(this).val() && 0 < $('#stairs-input').val() && 0 < $('#active-minutes-input').val() && $('#active-minutes-input').val() <= 1440, '#submit-steps-button');
  showError(0 < $(this).val(), '#steps-error');
});

$('#stairs-input').keyup(function() {
  enableButton(0 < $(this).val() && 0 < $('#steps-input').val() && 0 < $('#active-minutes-input').val() && $('#active-minutes-input').val() <= 1440, '#submit-steps-button');
  showError(0 < $(this).val(), '#stairs-error');
});

$('#active-minutes-input').keyup(function() {
  enableButton(0 < $(this).val() && $(this).val() <= 1440 && 0 < $('#stairs-input').val() && 0 < $('#steps-input').val(), '#submit-steps-button');
  showError(0 < $(this).val() && $(this).val() <= 1440, '#active-minutes-error');
});

$('#sleep-hours-input').keyup(function() {
  enableButton(0 < $(this).val() && $(this).val() <= 24 && 0 < $('#sleep-quality-input').val() && $('#sleep-quality-input').val() <= 5, '#submit-sleep-button');
  showError(0 < $(this).val() && $(this).val() <= 24, '#sleep-hours-error');
});

$('#sleep-quality-input').keyup(function() {
  enableButton(0 < $(this).val() && $(this).val() <= 5 && 0 < $('#sleep-hours-input').val() && $('#sleep-hours-input').val() <= 24, '#submit-sleep-button');
  showError(0 < $(this).val() && $(this).val() <= 5, '#sleep-quality-error');
});

$('#submit-steps-button').click(function() {
  let dataToPost = {
    userID: userIdNum,
    date: currentDate,
    numSteps: $('#steps-input').val(),
    minutesActive: $('#active-minutes-input').val(),
    flightsOfStairs: $('#stairs-input').val()
  }
  postData('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData', dataToPost);
  closeForm('#submit-steps-button');
})

function postData(destination, data) {
  fetch(destination, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(() => showStatus('#success-message'))
  .catch(() => showStatus('#failure-message'));
}

function showStatus(message) {
  $(message).removeClass('hide');
  setTimeout(() => $(message).addClass('hide'), 2000)
}

$('#submit-hydration-button').click(function() {
  let dataToPost = {
    userID: userIdNum,
    date: currentDate,
    numOunces: $('#hydration-input').val()
  }
  postData('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData', dataToPost);
  closeForm('#submit-hydration-button');
})

$('#submit-sleep-button').click(function() {
  let dataToPost = {
    userID: userIdNum,
    date: currentDate,
    hoursSlept: $('#sleep-hours-input').val(),
    sleepQuality: $('#sleep-quality-input').val()
  }
  postData('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData', dataToPost);
  closeForm('#submit-sleep-button');
})

$('.cancel-button').click(function() {
  closeForm(event.target.nextElementSibling);
})

function enableButton(condition, submitButton) {
  if (condition) {
    $(submitButton).prop('disabled', false);
  } else {
    $(submitButton).prop('disabled', true);
  }
}

function showError(condition, errorMessage) {
  if (condition) {
    $(errorMessage).addClass('hide');
  } else {
    $(errorMessage).removeClass('hide');
  }
}

function closeForm(submitButton) {
  changeFormDisplay($(event.target).closest('form'))
  $(event.target).closest('form')[0].reset();
  $(submitButton).prop('disabled', true);
};

function changeUser() {
  let newUserId = parseInt($('#user-id-input').val());
  populateData(combinedData, newUserId);
  populateGraphs();
}

function changeFormDisplay(element) {
  element.toggleClass('hide');
  $('.cover').toggleClass('hide');
}

function getDate() {
  var m = new Date();
  var dateString =
    m.getUTCFullYear() + "/" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    ("0" + m.getUTCDate()).slice(-2)
    return dateString
}

function generateRandomUserId() {
  let randomNumOneToFifty = (Math.random() * 50);
  return Math.ceil(randomNumOneToFifty);
}

function displayStatus(condition, status, commentLocation, trueImage, falseImage, trueComment, falseComment) {
  if (status === '#sleep-status') {
    sleep.checkUserRestedByDate(user.id, currentDate)
  }
  if (condition === true) {
    $(status).attr('src', trueImage);
    $(commentLocation).text(trueComment);
  } else {
    $(status).attr('src', falseImage);
    $(commentLocation).text(falseComment);
  }
}

function populateFriends(userFriends) {
  let friends = userFriends.map(friend => {
  let userFriend = new User(userRepo.returnUserData(friend))
  return ({
    id: userFriend.id,
    name: userFriend.returnUserFirstName(),
    steps: (activity.returnActionByWeek(userFriend.id, currentDate, 'numSteps')).reduce((acc, day) => acc += day)})
  });
  friends.push({
    id: user.id,
    name: newUser.returnUserFirstName(),
    steps: activity.returnActionByWeek(user.id, currentDate, 'numSteps')
      .reduce((acc, day) => acc += day)
  });
  return friends.sort((userA, userB) => userB.steps - userA.steps);
}

function returnFriendInfo(information) {
  let friendObjs = populateFriends(user.friends);
  return friendObjs.map(friend => friend[information]);
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
function populateGraphs() {
Chart.defaults.global.defaultFontColor = 'white';
var ctx = $('#user-water-by-week');
var hydrationByWeek = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'ounces',
      data: hydration.returnActionByWeek(user.id, currentDate, 'numOunces'),
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
      data: sleep.returnActionByWeek(user.id, currentDate, 'hoursSlept'),
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
      data: sleep.returnActionByWeek(user.id, currentDate, 'sleepQuality'),
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
      data: activity.returnActionByWeek(user.id, currentDate, 'numSteps'),
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
      data: activity.returnActionByWeek(user.id, currentDate, 'minutesActive'),
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
      data: activity.returnActionByWeek(user.id, currentDate, 'flightsOfStairs'),
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
