const Users = require("./models/users");
// const users = [];

//join user to chat

async function userJoin(id, username, room) {
  const user = new Users({ id, username, room });
  // console.log(user);
  try {
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    console.log(error);
  }
}

//get current user

async function getCurrentUser(id) {
  try {
    const user = await Users.findOne({ id });
    return user;
  } catch (error) {
    console.log(error);
  }
}

//remove user when leave
async function userLeave(id) {
  try {
    const user = await Users.find({ id: id });
    const userLeaved = await Users.deleteOne({ id: id });
    console.log("user leaving", user);
    return user;
  } catch (error) {
    console.log(error);
  }
  //   const index = users.findIndex((user) => user.id === id);
  //   if (index !== -1) {
  //     return users.splice(index, 1)[0];
  //   }
}

//get room users

async function getRoomUsers(room) {
  try {
    const users = await Users.find({ room });
    return users;
  } catch (error) {
    console.log(errors);
  }
  //   return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
