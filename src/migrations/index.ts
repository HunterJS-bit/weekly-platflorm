import * as migration_20261031_011232_initial from './20261031_011232_initial';

export const migrations = [
  {
    up: migration_20261031_011232_initial.up,
    down: migration_20261031_011232_initial.down,
    name: '20261031_011232_initial'
  },
];
