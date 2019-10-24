class ActionRepository {
  constructor(data) {
    this.data = data;
  }
  findCurrentUserData(userId) {
    return this.data.filter((activityObj) => activityObj.userID === userId);
  }
  returnActionByDate(userId, date, action) {
    return this.findCurrentUserData(userId).find(user => {
      return user.date === date;
    })[action];
  }
  returnActionByWeek(userId, date, action) {
    let index = this.findCurrentUserData(userId).findIndex((actionObj) => actionObj.date === date);
    return this.findCurrentUserData(userId).map(actionObj => actionObj[action]).splice(index - 6, 7);
  }
}

export default ActionRepository;
