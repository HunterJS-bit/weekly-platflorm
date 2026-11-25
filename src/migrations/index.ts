import * as migration_20261031_011232_initial from './20261031_011232_initial';
import * as migration_20261102_234949 from './20261102_234949';
import * as migration_20261102_235855 from './20261102_235855';
import * as migration_20261103_134035 from './20261103_134035';
import * as migration_20261103_150634 from './20261103_150634';
import * as migration_20261104_120209 from './20261104_120209';
import * as migration_20261104_203919 from './20261104_203919';
import * as migration_20261106_002259 from './20261106_002259';
import * as migration_20261107_175308_seo_fields from './20261107_175308_seo_fields';
import * as migration_20261122_173100_add_comment_guest_fields from './20261122_173100_add_comment_guest_fields';
import * as migration_20261125_145000_fix_comment_guest_schema from './20261125_145000_fix_comment_guest_schema';

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
    name: '20261102_235855',
  },
  {
    up: migration_20261103_134035.up,
    down: migration_20261103_134035.down,
    name: '20261103_134035',
  },
  {
    up: migration_20261103_150634.up,
    down: migration_20261103_150634.down,
    name: '20261103_150634',
  },
  {
    up: migration_20261104_120209.up,
    down: migration_20261104_120209.down,
    name: '20261104_120209',
  },
  {
    up: migration_20261104_203919.up,
    down: migration_20261104_203919.down,
    name: '20261104_203919',
  },
  {
    up: migration_20261106_002259.up,
    down: migration_20261106_002259.down,
    name: '20261106_002259',
  },
  {
    up: migration_20261107_175308_seo_fields.up,
    down: migration_20261107_175308_seo_fields.down,
    name: '20261107_175308_seo_fields'
  },
  {
    up: migration_20261122_173100_add_comment_guest_fields.up,
    down: migration_20261122_173100_add_comment_guest_fields.down,
    name: '20261122_173100_add_comment_guest_fields'
  },
  {
    up: migration_20261125_145000_fix_comment_guest_schema.up,
    down: migration_20261125_145000_fix_comment_guest_schema.down,
    name: '20261125_145000_fix_comment_guest_schema'
  },
];
