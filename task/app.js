function solve() {
  'use strict';

  const ERROR_MESSAGES = {
    INVALID_NAME_TYPE: 'Name must be string!',
    INVALID_NAME_LENGTH: 'Name must be between between 2 and 20 symbols long!',
    INVALID_NAME_SYMBOLS:
      'Name can contain only latin symbols and whitespaces!',
    INVALID_MANA: 'Mana must be a positive integer number!',
    INVALID_EFFECT: 'Effect must be a function with 1 parameter!',
    INVALID_DAMAGE: 'Damage must be a positive number that is at most 100!',
    INVALID_HEALTH: 'Health must be a positive number that is at most 200!',
    INVALID_SPEED: 'Speed must be a positive number that is at most 100!',
    INVALID_COUNT: 'Count must be a positive integer number!',
    INVALID_SPELL_OBJECT: 'Passed objects must be Spell-like objects!',
    NOT_ENOUGH_MANA: 'Not enough mana!',
    TARGET_NOT_FOUND: 'Target not found!',
    INVALID_BATTLE_PARTICIPANT: 'Battle participants must be ArmyUnit-like!',
    INVALID_ALIGNMENT: 'Alignment must be good, neutral or evil!',
  };

  const VALIDATOR = {
    isString(x) {
      if (typeof x !== 'string') {
        throw Error(ERROR_MESSAGES.INVALID_NAME_TYPE);
      }
    },
    isInRange(x, min, max, err) {
      if (Number.isNaN(x) || x < min || x > max) {
        throw Error(err);
      }
    },
    isLengthInRange(x) {
      this.isInRange(x.length, 2, 20, ERROR_MESSAGES.INVALID_NAME_LENGTH);
    },
    isConsistedOfValidSymbols(x) {
      if (x.match(/[^a-zA-Z ]/)) {
        throw Error(ERROR_MESSAGES.INVALID_NAME_SYMBOLS);
      }
    },
    isValidMana(x) {
      if (typeof x !== 'number' || x <= 0 || Number.isNaN(x)) {
        throw Error(ERROR_MESSAGES.INVALID_MANA);
      }
    },
    isValidEffect(x) {
      if (typeof x !== 'function' || x.length !== 1) {
        throw Error(ERROR_MESSAGES.INVALID_EFFECT);
      }
    },
    isValidAlignment: (() => {
      const validAlignments = ['good', 'neutral', 'evil'];
      return (x) => {
        if (validAlignments.indexOf(x) < 0) {
          throw Error(ERROR_MESSAGES.INVALID_ALIGNMENT);
        }
      };
    })(),
    isValidDamage(x) {
      this.isInRange(x, 0, 100, ERROR_MESSAGES.INVALID_DAMAGE);
    },
    isValidHealth(x) {
      this.isInRange(x, 0, 200, ERROR_MESSAGES.INVALID_HEALTH);
    },
    isValidCount(x) {
      if (typeof x !== 'number' || x < 0 || (x | 0) !== x || Number.isNaN(x)) {
        throw Error(ERROR_MESSAGES.INVALID_COUNT);
      }
    },
    isValidSpeed(x) {
      this.isInRange(x, 0, 100, ERROR_MESSAGES.INVALID_SPEED);
    },
  };

  const getNextId = (() => {
    let counter = 0;
    return () => {
      counter += 1;
      return counter;
    };
  })();
  class Spell {
    constructor(name, manaCost, effect) {
      this.name = name;
      this.manaCost = manaCost;
      this.effect = effect;
    }

    get name() {
      return this._name;
    }
    set name(x) {
      VALIDATOR.isString(x);
      VALIDATOR.isLengthInRange(x);
      VALIDATOR.isConsistedOfValidSymbols(x);
      this._name = x;
    }
    get manaCost() {
      return this._manaCost;
    }
    set manaCost(x) {
      VALIDATOR.isValidMana(x);
      this._manaCost = x;
    }
    get effect() {
      return this._effect;
    }
    set effect(x) {
      VALIDATOR.isValidEffect(x);
      this._effect = x;
    }
  }

  class Unit {
    constructor(name, alignment) {
      this.name = name;
      this.alignment = alignment;
    }

    get name() {
      return this._name;
    }
    set name(x) {
      VALIDATOR.isString(x);
      VALIDATOR.isLengthInRange(x);
      VALIDATOR.isConsistedOfValidSymbols(x);
      this._name = x;
    }
    get alignment() {
      return this._alignment;
    }
    set alignment(x) {
      VALIDATOR.isValidAlignment(x);
      this._alignment = x;
    }
  }

  class ArmyUnit extends Unit {
    constructor(name, alignment, damage, health, count, speed) {
      super(name, alignment);
      this._id = getNextId();
      this.damage = damage;
      this.health = health;
      this.count = count;
      this.speed = speed;
    }

    get id() {
      return this._id;
    }
    get damage() {
      return this._damage;
    }

    set damage(x) {
      VALIDATOR.isValidDamage(x);
      this._damage = x;
    }
    get health() {
      return this._health;
    }

    set health(x) {
      VALIDATOR.isValidHealth(x);
      this._health = x;
    }
    get count() {
      return this._count;
    }

    set count(x) {
      VALIDATOR.isValidCount(x);
      this._count = x;
    }
    get speed() {
      return this._speed;
    }

    set speed(x) {
      VALIDATOR.isValidSpeed(x);
      this._speed = x;
    }
  }

  class Commander extends Unit {
    constructor(name, alignment, mana) {
      super(name, alignment);
      this.mana = mana;
      this.spellbook = [];
      this.army = [];
    }

    get mana() {
      return this._mana;
    }
    set mana(x) {
      VALIDATOR.isValidMana(x);
      this._mana = x;
    }
  }

  class Battlemanager {
    constructor() {
      this._commanders = [];
      this._army_units = [];
    }
    getCommander(name, alignment, mana) {
      return new Commander(name, alignment, mana);
    }
    getArmyUnit(options) {
      // destructuring assignment
      // const { name, alignment, damage, health, count, speed } = options;
      // return new ArmyUnit(name, alignment, damage, health, count, speed);

      return new ArmyUnit(
        options.name,
        options.alignment,
        options.damage,
        options.health,
        options.count,
        options.speed
      );
    }
    getSpell(name, manaCost, effect) {
      return new Spell(name, manaCost, effect);
    }
    addCommanders(...commanders) {
      this._commanders.push(...commanders);
      return this;
    }
    addArmyUnitTo(commanderName, armyUnit) {
      this._commanders
        .find((commander) => commander.name === commanderName)
        .army.push(armyUnit);
      // ATTENTION
      if (this._commanders === undefined) {
        throw Error(`No such commander`);
      }

      this._army_units.push(armyUnit);
      return this;
    }
    addSpellsTo(commanderName, ...spells) {
      this._commanders
        .find((commander) => commander.name === commanderName)
        .spellbook.push(...spells);
      // ATTENTION
      if (this._commanders === undefined) {
        throw Error(`No such commander`);
      }
      return this;
    }
    findCommanders(query) {
      return this._commanders.filter((commander) =>
        Object.keys(query).every((prop) => query[prop] === commander[prop])
      );
    }
    findArmyUnitById(id) {
      return this._army_units.find((unit) => unit.id === id);
    }
    findArmyUnits(query) {
      return this._army_units
        .filter((unit) =>
          Object.keys(query).every((prop) => query[prop] === unit[prop])
        )
        .sort((x, y) => {
          const compare = y.speed - x.speed;
          if (compare === 0) {
            return x.name.localeCompare(y.name);
          }
          return compare;
        });
    }
    spellcast(casterName, spellName, targetUnitId) {
      let commander = this._commanders.find(
        (commander) => commander.name === casterName
      );
      if (commander === undefined) {
        throw Error(`Can't cast with non-existant commander ${casterName}!`);
      }

      let spell = commander.spellbook.find((spell) => spell.name === spellName);
      if (spell === undefined) {
        throw Error(`${casterName} doesn't know ${spellName}`);
      }
      if (commander.mana < spell.manaCost) {
        throw Error(ERROR_MESSAGES.NOT_ENOUGH_MANA);
      }

      let unit = this._army_units.find((unit) => unit.id === targetUnitId);
      if (unit === undefined) {
        throw Error(ERROR_MESSAGES.TARGET_NOT_FOUND);
      }
      commander.mana -= spell.manaCost;
      spell.effect(unit);
      return this;
    }
    battle(attacker, defender) {
      const properties = [
        'name',
        'alignment',
        'damage',
        'health',
        'count',
        'speed',
      ];
      [attacker, defender].forEach((unit) =>
        properties.forEach((property) => {
          if (unit[property] === undefined) {
            throw Error(ERROR_MESSAGES.INVALID_BATTLE_PARTICIPANT);
          }
        })
      );
      let totalDamage = attacker.damage * attacker.count;
      let totalHealth = defender.health * defender.count;
      totalHealth -= totalDamage;
      let newCount = Math.ceil(totalHealth / defender.health);

      if (newCount < 0) {
        defender.count = 0;
      } else {
        defender.count = newCount;
      }
      // defender.count = newCount < 0 ? 0 : newCount;
      return this;
    }
  }

  return new Battlemanager();
}

export { solve };
