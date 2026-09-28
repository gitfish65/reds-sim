import { PlayerStats } from "./playerStats.js";
import { randInt } from "./rng.js";
import { rollScy, rollClaw, rollShadow } from "./combat.js";

export const MAX_VERZIK_HP = 2625;
export const VERZIK_DEF = 200;
export const VERZIK_SLASH_DEF = 60;
export const VERZIK_MAGIC_DEFENCE = 70;
export const VERZIK_RANGED_DEF = 250;

export const scythe = new PlayerStats(141, 203, 0, 0, 0, false);
export const claw = new PlayerStats(122, 135, 0, 0, 0, false);
export const shadow = new PlayerStats(0, 0, 75, 486, 0, false);

export const STRATEGIES = {
  "3claw1shadow": { name: "3 Claw 1 Shadow", numScythes: 10, numClaws: 3, numShadows: 1 },
  "4claw": { name: "4 Claw", numScythes: 10, numClaws: 4, numShadows: 0 },
};

export function runSim(trials, hpPercentage, numScythes, numClaws, numShadows) {
  let successfulTrials = 0;
  const currentVerzikHp = MAX_VERZIK_HP * hpPercentage;

  for (let i = 0; i < trials; i++) {
    let totalDamage = 0;
    let scytheDamage = 0;
    let clawDamage = 0;
    let thrallDamage = 0;
    let shadowDamage = 0;

    const thrallHits = 14;

    for (let j = 0; j < numScythes; j++) {
      scytheDamage += rollScy(scythe, VERZIK_DEF, VERZIK_SLASH_DEF);
    }

    for (let j = 0; j < numClaws; j++) {
      clawDamage += rollClaw(claw, VERZIK_DEF, VERZIK_SLASH_DEF);
    }

    for (let j = 0; j < numShadows; j++) {
      shadowDamage += rollShadow(shadow, VERZIK_DEF, VERZIK_MAGIC_DEFENCE);
    }

    for (let j = 0; j < thrallHits; j++) {
      thrallDamage += randInt(0, 4);
    }

    totalDamage += scytheDamage + clawDamage + shadowDamage + thrallDamage;

    if (totalDamage >= currentVerzikHp) {
      successfulTrials++;
    }

    //console.log("Claw damage:", clawDamage);
    //console.log("Scythe damage:", scytheDamage);
    //console.log("Shadow damage:", shadowDamage);
    //console.log("Thrall damage:", thrallDamage);
    //console.log("Total damage:", totalDamage);
  }

  return successfulTrials / trials;
}

export function runBatchSim(trials, numScythes, numClaws, numShadows, hpList = [17, 18, 19, 20, 21, 22, 23, 24, 25]) {
  return hpList.map((hp) => ({
    hp,
    probability: runSim(trials, hp / 100, numScythes, numClaws, numShadows),
  }));
}