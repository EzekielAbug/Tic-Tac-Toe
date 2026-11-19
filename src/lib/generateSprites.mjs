import fs from 'fs';
import path from 'path';

// Refined 24x24 Pixel Art for Zombie
const zombieMap = [
  "________________________",
  "________H___H___________",
  "_______HH__HHH__________",
  "______KKKKKKKKKK________",
  "_____KggGGGGGGGGK_______",
  "_____KgGGGGGGGGGK_______",
  "____KKKKKKKKKKKKKK______",
  "____KDWWWDKKDWWWDK______",
  "____KWWPWDKKWPWWDK______",
  "____KDWWWDKKDWWWDK______",
  "____KGGGGGKKGGGGGK______",
  "____KGGGGDPPDGGGGK______",
  "____KMMMMMMMMMMMMK______",
  "____KMYYMMMMMMMMMK______",
  "____KMMMMMMMYYMMMK______",
  "____KKMMMMMMMMMMKK______",
  "_____KKKKKKKKKKKK_______",
  "______KGGGGGGGGK________",
  "_____KKSSSSKTSSKKK______",
  "____KCCCSSS TTSSCCCK____",
  "___KCCCCCCC KTCCCCCCK___",
  "___KCCCCCCC tTCCCCCCK___",
  "___KCCccCCC  TCCCccCK___",
  "___KKKKKKKK  KKKKKKKK___"
];

const zombieColors = {
  K: "#182016", // crisp dark outline
  H: "#2e3b28", // messy undead hair
  G: "#749c66", // zombie green skin
  g: "#95bd87", // skin highlight
  D: "#4f6e45", // eye socket shadow
  W: "#f5f6e2", // eye sclera (yellowed white)
  P: "#1a2217", // pupil / nostrils
  Y: "#f7e899", // yellow crooked teeth
  M: "#2d161d", // dark gaping mouth
  T: "#c92a2a", // crimson tie
  t: "#8f1b1b", // tie shadow
  S: "#dad5c5", // ragged shirt collar
  C: "#543e2e", // tattered brown coat
  c: "#3b2a1e"  // coat shadow
};

// Refined 24x24 Pixel Art for Plant (Friendly Sunflower / Peashooter)
const plantMap = [
  "_________YYYY___________",
  "____YY__YYYYYY__YY______",
  "___YYYYYYYYYYYYYYYY_____",
  "____YYYYGGGGGGYYYY______",
  "__YY__YGGggggGGY__YY____",
  "_YYYYYGGggggggGGYYYYY___",
  "_YYYYGGggggggggGGYYYY___",
  "__YY_KGGgWWggWWgGK_YY___",
  "____KKGggWPggWPggKK_____",
  "____KKGggWWggWWggKK_____",
  "____KKGggggggggggKK_____",
  "____KKGGgMKKMMgGGKK_____",
  "_____KKGGMMMMGGKK_______",
  "______KKKGGGGKKK________",
  "________KGGGGK__________",
  "_______KKGGGGKK_________",
  "__LL__KKKGGGGKKK__LL____",
  "_LLLLKKKKGGGGKKKKLLLL___",
  "_LLLLLLKKGGGGKKLLLLLL___",
  "__LLLLLL_KKKK_LLLLLL____",
  "___LLLL________LLLL_____",
  "________________________",
  "________________________",
  "________________________"
];

const plantColors = {
  Y: "#ffc107", // sunflower yellow petals
  G: "#4caf50", // leaf/head green
  g: "#81c784", // light green highlight
  K: "#1b5e20", // dark green outline
  W: "#ffffff", // bright white eyes
  P: "#0d330f", // dark green pupils
  M: "#e91e63", // happy mouth
  L: "#2e7d32"  // dark green stem & leaves
};

function generateSvg(map, colors) {
  const rects = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const ch = map[y][x];
      if (ch !== "_" && ch !== " " && colors[ch]) {
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${colors[ch]}" />`);
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" shape-rendering="crispEdges">
  ${rects.join("\n  ")}
</svg>`;
}

const zombieSvg = generateSvg(zombieMap, zombieColors);
const plantSvg = generateSvg(plantMap, plantColors);

fs.writeFileSync(path.resolve('public/sprites/zombies/zombie.svg'), zombieSvg);
fs.writeFileSync(path.resolve('public/sprites/plants/plant.svg'), plantSvg);

console.log('Regenerated zombie.svg and plant.svg successfully!');
