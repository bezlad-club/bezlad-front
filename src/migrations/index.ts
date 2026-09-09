import * as migration_20260907_170406_init_schema from './20260907_170406_init_schema';
import * as migration_20260909_203349_slotted_services from './20260909_203349_slotted_services';

export const migrations = [
  {
    up: migration_20260907_170406_init_schema.up,
    down: migration_20260907_170406_init_schema.down,
    name: '20260907_170406_init_schema',
  },
  {
    up: migration_20260909_203349_slotted_services.up,
    down: migration_20260909_203349_slotted_services.down,
    name: '20260909_203349_slotted_services'
  },
];
