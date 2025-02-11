const getRandomUserNickname = (prefix = "익명", length = 8) => {
  return `${prefix}${Math.random()
    .toString(36)
    .substring(2, Math.max(2, length - prefix.length + 2))}`;
};

export default getRandomUserNickname;
