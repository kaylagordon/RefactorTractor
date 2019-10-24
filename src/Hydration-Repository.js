import ActionRepository from './Action-Repository';

class Hydration extends ActionRepository {
  constructor(data) {
    super(data);
  }

  returnAvgFluidOzPerDayAllTime(userId) {
    return this.findCurrentUserData(userId).reduce((totalOunces, hydrationObj) => {
      return totalOunces += hydrationObj.numOunces;
    }, 0);
  }

  returnDidUserDrinkEnoughWater(userId, date) {
    let waterDatas = this.returnActionByWeek(userId, date, 'numOunces');
    let avgWaterPerDay = (waterDatas.reduce((acc, day) => {
      acc += day;
      return acc;
    }, 0) / 7);
    if (avgWaterPerDay > 64) {
      return true;
    }
    return false;
  }
}

export default Hydration;
