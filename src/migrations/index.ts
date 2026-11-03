import * as migration_20261031_011232_initial from './20261031_011232_initial';
import * as migration_20261102_234949 from './20261102_234949';
import * as migration_20261102_235855 from './20261102_235855';

export const migrations = [
  {
    up: migration_20261031_011232_initial.up,
    down: migration_20261031_011232_initial.down,
    name: '20261031_011232_initial',
  },
  {
    up: migration_20261102_234949.up,
    down: migration_20261102_234949.down,
    name: '20261102_234949',
  },
  {
    up: migration_20261102_235855.up,
    down: migration_20261102_235855.down,
    name: '20261102_235855'
  },
];
