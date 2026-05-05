// kubejs/client_scripts/ps_skill_tooltips.js
// 医疗物品与料理强化的客户端 tooltip。不要放进 server_scripts。

var PS_TOOLTIP_POWDERS = {
  'mekanism:dust_iron': { key: 'resistance', label: '铁粉' },
  'mekanism:dust_gold': { key: 'absorption', label: '金粉' },
  'mekanism:dust_sulfur': { key: 'fire_resistance', label: '硫粉' },
  'mekanism:dust_diamond': { key: 'rating_up_1', label: '钻石粉' },
  'mekanism:dust_netherite': { key: 'rating_up_2', label: '下界合金粉' },
  'mekanism:dust_redstone': { key: 'speed', label: '红石粉' },
  'mekanism:dust_lapis_lazuli': { key: 'night_vision', label: '青金石粉' },
  'mekanism:dust_emerald': { key: 'luck', label: '绿宝石粉' },
  'mekanism:dust_obsidian': { key: 'resistance', label: '黑曜石粉' },
  'mekanism:dust_refined_obsidian': { key: 'resistance', label: '精炼黑曜石粉' },
  'mekanism:dust_osmium': { key: 'strength', label: '锇粉' },
  'mekanism:dust_copper': { key: 'jump_boost', label: '铜粉' },
  'mekanism:dust_tin': { key: 'water_breathing', label: '锡粉' },
  'mekanism:dust_lead': { key: 'knockback_resistance', label: '铅粉' },
  'mekanism:dust_quartz': { key: 'haste', label: '石英粉' },
  'mekanism:dust_coal': { key: 'haste', label: '煤粉' },
  'mekanism:dust_charcoal': { key: 'haste', label: '木炭粉' },
  'mekanism:dust_bronze': { key: 'saturation', label: '青铜粉' },
  'mekanism:dust_steel': { key: 'resistance', label: '钢粉' },
  'mekanism:dust_refined_glowstone': { key: 'regeneration', label: '精炼荧石粉' },
  'mekanism:dust_fluorite': { key: 'glowing', label: '萤石粉' },
  'mekanism:dust_lithium': { key: 'slow_falling', label: '锂粉' },
  'mekanism:dust_uranium': { key: 'glowing', label: '铀粉' }
}

ItemEvents.tooltip(function(event) {
  var st = event.itemStack
  if (!st || !st.nbt || !st.nbt.kjsSkill) return

  if (st.nbt.kjsSkill.medical) {
    var med = st.nbt.kjsSkill.medical
    event.add(Text.of('§b[医护强化]'))
    event.add(Text.of('§7处理者：§f' + String(med.medic || '未知')))
    event.add(Text.of('§7强化层数：§f' + String(med.tier || 0)))
    if (String(med.kind) == 'medkit') {
      event.add(Text.of('§7额外恢复：§f全体肢体 +' + String(med.extra || 0) + ' 倍'))
    } else {
      event.add(Text.of('§7额外恢复：§f额外恢复 ' + String(med.extra || 0) + ' 个肢体'))
    }
  }

  if (st.nbt.kjsSkill.cooking) {
    var data = st.nbt.kjsSkill.cooking
    event.add(Text.of('§6[料理强化]'))
    event.add(Text.of('§7料理评级：§f' + String(data.rating || 0) + ' / 10'))
    var powders = data.powders || {}
    for (var id in powders) {
      var cfg = PS_TOOLTIP_POWDERS[id]
      var label = cfg ? cfg.label : id
      var count = Number(powders[id] || 0)
      if (cfg && cfg.key == 'rating_up_1') event.add(Text.of('§7' + label + '：§f评级 +1，层数 ' + count))
      else if (cfg && cfg.key == 'rating_up_2') event.add(Text.of('§7' + label + '：§f评级 +2，层数 ' + count))
      else event.add(Text.of('§7' + label + '：§f层数 ' + count + '（层数决定持续时间）'))
    }
  }
})
