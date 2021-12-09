const c_users = [];

function check_User (p_user) {
  const duplicate = get_Current_User(p_user.id)
  if (!duplicate) {
    return true;
  }
  if (duplicate.room !== p_user.room) {
    return true;
  }
  return false;
}

function join_User(id, username, room, avaurl) {
  const p_user = { id, username, room, avaurl };
  if (check_User(p_user)) {
    c_users.push(p_user);
    console.log(c_users, "users");
  
    return p_user;
  }
  return
  
}

console.log("user out", c_users);


function get_Current_User(id) {
  return c_users.find((p_user) => p_user.id === id);
}


function user_Disconnect(id) {
  const index = c_users.findIndex((p_user) => p_user.id === id);

  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  if (c_users.length === 0) {
    return [];
  }
  const users = []
  c_users.map((item)=> {
    if (item.room === room) {
      user = {username: item.username, avaurl: item.avaurl}
      users.push(user)
    }}
  )
  return users
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
  getRoomUsers
};
