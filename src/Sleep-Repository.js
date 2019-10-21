class Sleep {
  constructor(sleepData) {
    this.sleepData = sleepData;
    this.isRested = false;
  }

  findCurrentUserData(userID) {
    return this.sleepData.filter((currentElement) => {
      return currentElement.userID === userID;
    });
  }

  returnAverageSleepInfo(userID, information) {
    let userSleepData = this.findCurrentUserData(userID);
    let totalSleep = userSleepData.reduce((acc, element) => {
      acc += element[information];
      return acc;
    }, 0);
    return parseFloat((totalSleep / userSleepData.length).toFixed(1))
  }

  returnSleepInfo(userID, date, information) {
    let userSleepData = this.findCurrentUserData(userID);
    return userSleepData.find((element) => {
      return element.date === date
    })[information]
  }

  returnSleepInfoByWeek(userID, date, information) {
    let userSleepData = this.findCurrentUserData(userID);
    let startDay = userSleepData.findIndex((element) => {
      return element.date === date;
    });
    return userSleepData.map(sleepObj => {
      return sleepObj[information]
    }).splice(startDay - 6, 7);
  }

  returnAllUsersAverageSleepQuality() {
    let totalSleepQuality = this.sleepData.reduce((acc, element) => {
      acc += element.sleepQuality;
      return acc;
    }, 0);
    return parseFloat((totalSleepQuality / this.sleepData.length).toFixed(1));
  }

  returnSleepQualityGreaterThanThree(date) {
    let usersWithHighestQualitySleep = [];
    let userIDList = this.sleepData.reduce((acc, element) => {
      if (!acc.includes(element.userID)) {
        acc.push(element.userID)
      }
      return acc
    }, []);
    userIDList.forEach(id => {
      if ((this.returnSleepQualityByWeek(id, date).reduce((acc, elem) => {
        acc += elem;
        return acc;
      }, 0) / 7) >= 3) {
        usersWithHighestQualitySleep.push(id)
      }
    })
    return usersWithHighestQualitySleep;
  }

  returnUserWithMostSleep(date) {
    let sleepByDay = this.sleepData.filter(elem => {
      return elem.date === date;
    })
    sleepByDay.sort((firstElem, secondElem) => {
      return secondElem.hoursSlept - firstElem.hoursSlept
    })
    return sleepByDay.filter(elem => {
      return sleepByDay[0].hoursSlept === elem.hoursSlept
    }).map(elem => elem.userID);
  }

  checkUserRestedByDate(userID, date) {
    if ((this.findCurrentUserData(userID).find(day => {
      return day.date === date;
    }).hoursSlept) >= (8)) {
      return this.isRested = true;
    }
  }
}

export default Sleep;
