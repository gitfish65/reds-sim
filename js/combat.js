import { randInt } from "./rng.js";

export function calcMeleeMaxHit(player) {
  const strLvl = 99;
  const melBoost = 19;
  const strPrayerBoost = 1.23;

  const effectiveStrength = Math.floor((strLvl + melBoost) * strPrayerBoost + 3 + 8);
  const maxHit = Math.floor(0.5 + effectiveStrength * ((player.str_bonus + 64) / 640));

  return maxHit;
}

export function calcMeleeAttackRoll(player) {
  const atkLvl = 99;
  const melBoost = 19;
  const atkPrayerBoost = 1.20;

  const effectiveAttack = Math.floor((atkLvl + melBoost) * atkPrayerBoost + 8);
  const attackRoll = Math.floor(effectiveAttack * (player.melee_acc_bonus + 64));

  return attackRoll;
}

export function calcMeleeDefenceRoll(defLevel, defBonus) {
  return (defLevel + 9) * (defBonus + 64);
}

export function calcMeleeHitChance(player, defLevel, defBonus) {
  const defRoll = calcMeleeDefenceRoll(defLevel, defBonus);
  const atkRoll = calcMeleeAttackRoll(player);

  if (atkRoll > defRoll) {
    return 1 - ((defRoll + 2) / (2 * (atkRoll + 1)));
  } else {
    return atkRoll / (2 * (defRoll + 1));
  }
}

export function calcRangedAttackRoll(player) {
  const rangedLvl = 99;
  const rangedBoost = 13;
  const rangedPrayerBoost = 1.20;
  let voidModifier = 1.0;
  const gearBonus = 1.0;

  if (player.wearing_void) {
    voidModifier = 1.1;
  }

  const atkStyle = 0;

  const effectiveRangedAttack = Math.floor(
    (Math.floor((rangedLvl + rangedBoost) * rangedPrayerBoost) + atkStyle + 8) * voidModifier
  );

  const atkRoll = Math.floor(effectiveRangedAttack * (player.ranged_acc_bonus + 64) * gearBonus);
  return atkRoll;
}

export function calcRangedDefenceRoll(defLevel, defBonus) {
  return (defLevel + 9) * (defBonus + 64);
}

export function calcRangedHitChance(player, defLvl, defBonus) {
  const atkRoll = calcRangedAttackRoll(player);
  const defRoll = calcRangedDefenceRoll(defLvl, defBonus);

  if (atkRoll > defRoll) {
    return 1 - ((defRoll + 2) / (2 * (atkRoll + 1)));
  } else {
    return atkRoll / (2 * (defRoll + 1));
  }
}

export function calcShadowMax(player) {
  const magicLvl = 99;
  const magicBoost = 13;
  const prayerBoost = 0.04;
  const effectiveMageLevel = magicLvl + magicBoost;

  let maxHit = Math.floor(effectiveMageLevel / 3 + 1);
  let magicDamageBonus = player.magic_strength * 10;
  magicDamageBonus = magicDamageBonus + prayerBoost * 1000;

  const addend = Math.floor(maxHit * (magicDamageBonus / 1000));
  maxHit = maxHit + addend;

  return maxHit;
}

export function calcMagicAttackRoll(player) {
  const magicLvl = 99;
  const magicBoost = 13;
  const prayerBoost = 1.25;

  const effectiveMageLevel = Math.floor((magicLvl + magicBoost + 9) * prayerBoost);
  const attackRoll = effectiveMageLevel * (player.magic_acc_bonus + 64);

  return attackRoll;
}

export function calcMagicDefenceRoll(mageLevel, defBonus) {
  return (mageLevel + 9) * (defBonus + 64);
}

export function calcMagicHitChance(player, mageLevel, defBonus) {
  const defRoll = calcMagicDefenceRoll(mageLevel, defBonus);
  const atkRoll = calcMagicAttackRoll(player);

  if (atkRoll > defRoll) {
    return 1 - ((defRoll + 2) / (2 * (atkRoll + 1)));
  } else {
    return atkRoll / (2 * (defRoll + 1));
  }
}

export function rollShadow(player, npcMageLevel, defBonus) {
  const accuracy = calcMagicHitChance(player, npcMageLevel, defBonus);
  const maxHit = calcShadowMax(player);

  let damage;
  if (Math.random() > accuracy) {
    damage = 0;
  } else {
    damage = randInt(0, maxHit + 1);
    if (damage === 0) {
      damage = 1;
    }
  }

  return damage;
}

export function rollZcbSpec(player, defLevel, defBonus) {
  const accuracy = calcRangedHitChance(player, defLevel, defBonus) * 2;

  let damage;
  if (Math.random() < 0.066) {
    damage = 110;
  } else if (Math.random() > accuracy) {
    damage = 0;
  } else {
    damage = 110;
  }

  return damage;
}

export function rollScy(scy, defLevel, defBonus) {
  const accuracy = calcMeleeHitChance(scy, defLevel, defBonus);
  const max1 = calcMeleeMaxHit(scy);
  const max2 = Math.floor(max1 / 2);
  const max3 = Math.floor(max2 / 2);

  let hit1, hit2, hit3;

  if (Math.random() > accuracy) {
    hit1 = 0;
  } else {
    hit1 = randInt(0, max1 + 1);
    if (hit1 === 0) hit1 = 1;
  }

  if (Math.random() > accuracy) {
    hit2 = 0;
  } else {
    hit2 = randInt(0, max2 + 1);
    if (hit2 === 0) hit2 = 1;
  }

  if (Math.random() > accuracy) {
    hit3 = 0;
  } else {
    hit3 = randInt(0, max3 + 1);
    if (hit3 === 0) hit3 = 1;
  }

  return hit1 + hit2 + hit3;
}

export function rollClaw(claw, defLevel, defBonus) {
  const maxHit = Math.floor(calcMeleeMaxHit(claw));
  const accuracy = calcMeleeHitChance(claw, defLevel, defBonus);

  let claw1 = 0;
  let claw2 = 0;
  let claw3 = 0;
  let claw4 = 0;

  if (Math.random() < accuracy) {
    const minHit = Math.floor(maxHit / 2);
    claw1 = randInt(minHit, maxHit);
    claw2 = Math.floor(claw1 / 2);
    claw3 = Math.floor(claw2 / 2);
    claw4 = claw3 + 1;
  } else if (Math.random() < accuracy) {
    const minHit = Math.floor(0.375 * maxHit);
    const tempMaxHit = Math.floor(0.875 * maxHit);
    claw2 = randInt(minHit, tempMaxHit + 1);
    claw3 = Math.floor(claw2 / 2);
    claw4 = claw3 + 1;
  } else if (Math.random() < accuracy) {
    const minHit = Math.floor(0.25 * maxHit);
    const tempMaxHit = Math.floor(0.75 * maxHit);
    claw3 = randInt(minHit, tempMaxHit + 1);
    claw4 = claw3 + 1;
  } else if (Math.random() < accuracy) {
    const minHit = Math.floor(0.25 * maxHit);
    const tempMaxHit = Math.floor(1.25 * maxHit);
    claw4 = randInt(minHit, tempMaxHit + 1);
  } else if (Math.random() < 0.5) {
    claw3 = 1;
    claw4 = 1;
  }

  return claw1 + claw2 + claw3 + claw4;
}

export function rollHornClaw(claw, defLevel, defBonus) {
  const maxHit = Math.floor(calcMeleeMaxHit(claw));

  const minHit = Math.floor(maxHit / 2);
  const claw1 = randInt(minHit, maxHit);
  const claw2 = Math.floor(claw1 / 2);
  const claw3 = Math.floor(claw2 / 2);
  const claw4 = claw3 + 1;

  return claw1 + claw2 + claw3 + claw4;
}