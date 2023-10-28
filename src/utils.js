import { users, champions } from "./assets.js";

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  export function generateGroups() {
    const newNames = shuffleArray(users);
    return [newNames.slice(0, 3), newNames.slice(3, 6)];
  }
  
  export function getChampions() {
    const championList = shuffleArray(champions);
    return [championList.slice(0, 10), championList.slice(10, 20)];
  }
  