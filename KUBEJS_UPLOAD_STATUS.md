# kubejs(2).zip upload status

ChatGPT inspected the uploaded archive `kubejs(2).zip`.

## Archive summary

- Zip size: 34,038,707 bytes
- Entries: 802
- Files: 705
- Directories: 97
- Uncompressed total: 215,549,451 bytes

## File type summary

- `.nbt`: 320 files, 6,927,430 bytes
- `.js`: 165 files, 746,754 bytes
- `.ts`: 131 files, 191,537,530 bytes
- `.json`: 44 files, 9,301,692 bytes
- `.png`: 36 files, 6,975,275 bytes
- `.txt`: 3 files, 5,037 bytes
- `.mcmeta`: 2 files, 99 bytes
- `.properties`: 2 files, 730 bytes
- `.ogg`: 1 file, 54,899 bytes
- no extension: 1 file, 5 bytes

## Important limitation

The current ChatGPT GitHub connector can reliably create or update UTF-8 text files. It is not a good path for uploading binary files directly, such as `.nbt`, `.png`, and `.ogg`, because those need binary-safe GitHub Contents API handling. Text files such as `.js`, `.json`, `.txt`, `.properties`, and `.mcmeta` can be uploaded through this connector.

## Recommended upload strategy

1. Upload the file tree/index first so ChatGPT can see the whole structure.
2. Upload high-value text files next: `server_scripts`, `startup_scripts`, `client_scripts`, and `config` JSON files.
3. Upload binary assets and structures through GitHub web upload, GitHub Desktop, or git command-line, especially:
   - `data/dc_hope/structures/**/*.nbt`
   - `assets/**/*.png`
   - `assets/**/*.ogg`

## Useful paths detected

- `server_scripts/dc_hope_hq_region_test_v4.js`
- `server_scripts/dc_camp_factions_behavior.js`
- `server_scripts/dc_camp_npc_spawns.js`
- `server_scripts/dc_camp_monster_aggro.js`
- `server_scripts/dc_named_npc_combat_shouts.js`
- `server_scripts/dc_named_npc_context_combat.js`
- `server_scripts/dc_named_npc_abilities.js`
- `server_scripts/dc_stealth_system.js`
- `server_scripts/dc_limb_hud.js`
- `config/dc_named_npc_dialogues.json`
- `config/dc_hope_hq_structure_manifest_v4.json`
- `config/dc_hope_hq_npc_spawns_v4_6.json`
- `startup_scripts/entity/attribute.js`

This file was uploaded by ChatGPT to verify repository write access and record the archive inspection result.
