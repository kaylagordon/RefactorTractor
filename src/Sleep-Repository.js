import ActionRepository from './Action-Repository';

class Sleep extends ActionRepository {
  constructor(data) {
    super(data);
    this.isRested = false;
  }

  returnAverageSleepInfo(userID, information) {
    let userSleepData = this.findCurrentUserData(userID);
    let totalSleep = userSleepData.reduce((acc, element) => {
      acc += element[information];
      return acc;
    }, 0);
    return parseFloat((totalSleep / userSleepData.length).toFixed(1))
  }

  returnAllUsersAverageSleepQuality() {
    let totalSleepQuality = this.data.reduce((acc, element) => {
      acc += element.sleepQuality;
      return acc;
    }, 0);
    return parseFloat((totalSleepQuality / this.data.length).toFixed(1));
  }

  returnSleepQualityGreaterThanThree(date) {
    let usersWithHighestQualitySleep = [];
    let userIDList = this.data.reduce((acc, element) => {
      if (!acc.includes(element.userID)) {
        acc.push(element.userID)
      }
      return acc
    }, []);
    userIDList.forEach(id => {
      if ((this.returnActionByWeek(id, date, 'sleepQuality').reduce((acc, elem) => {
        acc += elem;
        return acc;
      }, 0) / 7) >= 3) {
        usersWithHighestQualitySleep.push(id)
      }
    })
    return usersWithHighestQualitySleep;
  }

  returnUserWithMostSleep(date) {
    let sleepByDay = this.data.filter(elem => {
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
