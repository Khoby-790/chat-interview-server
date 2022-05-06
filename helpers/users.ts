import { v4 } from "uuid";
type User = {
  id: string;
  sub: string;
  name: string;
};

const users: User[] = [];

const blockList: Record<string, string[]> = {};

export const newUser = (user: any): User => {
  //update user with id if it exists
  const existingUser = users.find((u) => u.sub === user.sub);
  if (existingUser) {
    existingUser.name = user.name;
    return existingUser;
  }
  users.push(user);
  return {
    id: user.id,
    sub: v4(),
    name: user.name,
  };
};

export const getUsers = (excpet?: string): User[] => {
  return excpet ? users?.filter((el) => el.sub === excpet) : users;
};

export const getUser = (sub: string): User | undefined => {
  return users.find((u) => u.sub === sub);
};

export const deleteUser = (sub: string): void => {
  const userIndex = users.findIndex((u) => u.id === sub);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }
};

export const blockUser = (sub: string, id: string): void => {
  if (!blockList[id]) {
    blockList[id] = [sub];
  }
  blockList[id].push(sub);
};

export const getBlockList = (id: string): string[] => {
  return blockList[id];
};
