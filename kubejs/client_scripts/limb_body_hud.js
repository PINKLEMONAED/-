const $Minecraft = Java.loadClass('net.minecraft.client.Minecraft')
const $InventoryScreen = Java.loadClass('net.minecraft.client.gui.screens.inventory.InventoryScreen')
const $CreativeModeInventoryScreen = Java.loadClass('net.minecraft.client.gui.screens.inventory.CreativeModeInventoryScreen')
const $CapabilityUtil = Java.loadClass('sfiomn.legendarysurvivaloverhaul.util.CapabilityUtil')
const $BodyPartEnum = Java.loadClass('sfiomn.legendarysurvivaloverhaul.api.bodydamage.BodyPartEnum')

const LSO_LIMB_HUD_PREFIX = 'lso_limb_hud_'
const LSO_LIMB_HUD_UPDATE_TICK = 4

const LSO_LIMB_PARTS = [
  { key: 'head', part: $BodyPartEnum.HEAD, label: '头部' },
  { key: 'chest', part: $BodyPartEnum.CHEST, label: '胸部' },
  { key: 'left_arm', part: $BodyPartEnum.LEFT_ARM, label: '左臂' },
  { key: 'right_arm', part: $BodyPartEnum.RIGHT_ARM, label: '右臂' },
  { key: 'left_leg', part: $BodyPartEnum.LEFT_LEG, label: '左腿' },
  { key: 'right_leg', part: $BodyPartEnum.RIGHT_LEG, label: '右腿' },
  { key: 'left_foot', part: $BodyPartEnum.LEFT_FOOT, label: '左脚' },
  { key: 'right_foot', part: $BodyPartEnum.RIGHT_FOOT, label: '右脚' }
]

var lsoLimbHudInit = false
var lsoLimbHudLastVisible = false

function lsoIsInventoryScreen(screen) {
  if (screen == null) return false
  try {
    if (screen instanceof $InventoryScreen) return true
  } catch (e1) {}
  try {
    if (screen instanceof $CreativeModeInventoryScreen) return true
  } catch (e2) {}
  return false
}

function lsoRound1(v) {
  return Math.round(v * 10.0) / 10.0
}

function lsoPct(cur, max) {
  if (max <= 0) return 0
  return Math.max(0, Math.min(1, cur / max))
}

function lsoBarColor(ratio) {
  if (ratio >= 0.75) return '#55ff55'
  if (ratio >= 0.45) return '#ffaa00'
  if (ratio >= 0.2) return '#ff5555'
  return '#aa0000'
}

function lsoEnsureHud(player) {
  if (lsoLimbHudInit) return
  if (!player || typeof player.paint !== 'function') return

  var obj = {}
  obj[LSO_LIMB_HUD_PREFIX + 'bg'] = {
    type: 'rectangle',
    x: 8,
    y: -152,
    w: 138,
    h: 144,
    alignX: 'left',
    alignY: 'bottom',
    color: '#88000000',
    draw: 'gui',
    visible: false
  }
  obj[LSO_LIMB_HUD_PREFIX + 'title'] = {
    type: 'text',
    x: 14,
    y: -146,
    alignX: 'left',
    alignY: 'bottom',
    scale: 1.0,
    shadow: true,
    color: '#ffffff',
    text: '肢体状态',
    draw: 'gui',
    visible: false
  }

  for (var i = 0; i < LSO_LIMB_PARTS.length; i++) {
    var p = LSO_LIMB_PARTS[i]
    var rowY = -130 + (i * 16)
    obj[LSO_LIMB_HUD_PREFIX + p.key + '_label'] = {
      type: 'text',
      x: 14,
      y: rowY,
      alignX: 'left',
      alignY: 'bottom',
      scale: 0.85,
      shadow: true,
      color: '#e0e0e0',
      text: p.label + ': 0 / 0',
      draw: 'gui',
      visible: false
    }
    obj[LSO_LIMB_HUD_PREFIX + p.key + '_bar_bg'] = {
      type: 'rectangle',
      x: 103,
      y: rowY + 1,
      w: 36,
      h: 6,
      alignX: 'left',
      alignY: 'bottom',
      color: '#44000000',
      draw: 'gui',
      visible: false
    }
    obj[LSO_LIMB_HUD_PREFIX + p.key + '_bar_fill'] = {
      type: 'rectangle',
      x: 103,
      y: rowY + 1,
      w: 0,
      h: 6,
      alignX: 'left',
      alignY: 'bottom',
      color: '#55ff55',
      draw: 'gui',
      visible: false
    }
  }

  player.paint(obj)
  lsoLimbHudInit = true
}

function lsoHideHud(player) {
  if (!player || typeof player.paint !== 'function') return
  var obj = {}
  obj[LSO_LIMB_HUD_PREFIX + 'bg'] = { visible: false }
  obj[LSO_LIMB_HUD_PREFIX + 'title'] = { visible: false }
  for (var i = 0; i < LSO_LIMB_PARTS.length; i++) {
    var p = LSO_LIMB_PARTS[i]
    obj[LSO_LIMB_HUD_PREFIX + p.key + '_label'] = { visible: false }
    obj[LSO_LIMB_HUD_PREFIX + p.key + '_bar_bg'] = { visible: false }
    obj[LSO_LIMB_HUD_PREFIX + p.key + '_bar_fill'] = { visible: false }
  }
  player.paint(obj)
}

function lsoUpdateHud(player) {
  if (!player || typeof player.paint !== 'function') return

  var cap = null
  try {
    cap = $CapabilityUtil.getBodyDamageCapability(player)
  } catch (e1) {
    cap = null
  }
  if (cap == null) {
    lsoHideHud(player)
    return
  }

  var obj = {}
  obj[LSO_LIMB_HUD_PREFIX + 'bg'] = { visible: true }
  obj[LSO_LIMB_HUD_PREFIX + 'title'] = { visible: true }

  for (var i = 0; i < LSO_LIMB_PARTS.length; i++) {
    var p = LSO_LIMB_PARTS[i]
    var max = 0
    var dmg = 0
    try { max = Number(cap.getBodyPartMaxHealth(p.part)) } catch (e2) { max = 0 }
    try { dmg = Number(cap.getBodyPartDamage(p.part)) } catch (e3) { dmg = 0 }
    if (max < 0) max = 0
    if (dmg < 0) dmg = 0
    var cur = max - dmg
    if (cur < 0) cur = 0
    var ratio = lsoPct(cur, max)
    var fill = Math.max(0, Math.floor(36 * ratio))
    var color = lsoBarColor(ratio)
    var txt = p.label + ': ' + lsoRound1(cur) + ' / ' + lsoRound1(max)

    obj[LSO_LIMB_HUD_PREFIX + p.key + '_label'] = {
      visible: true,
      text: txt,
      color: '#e0e0e0'
    }
    obj[LSO_LIMB_HUD_PREFIX + p.key + '_bar_bg'] = { visible: true }
    obj[LSO_LIMB_HUD_PREFIX + p.key + '_bar_fill'] = {
      visible: true,
      w: fill,
      color: color
    }
  }

  player.paint(obj)
}

ClientEvents.tick(function (event) {
  var mc = null
  try {
    mc = $Minecraft.getInstance()
  } catch (e1) {
    return
  }
  if (mc == null) return

  var player = mc.player
  if (player == null) return
  if (typeof player.paint !== 'function') return

  lsoEnsureHud(player)

  var screen = mc.screen
  var show = lsoIsInventoryScreen(screen)

  if (!show) {
    if (lsoLimbHudLastVisible) {
      lsoHideHud(player)
      lsoLimbHudLastVisible = false
    }
    return
  }

  lsoLimbHudLastVisible = true

  try {
    if ((player.tickCount % LSO_LIMB_HUD_UPDATE_TICK) !== 0) return
  } catch (e2) {}

  lsoUpdateHud(player)
})

ClientEvents.loggedOut(function (event) {
  try {
    lsoHideHud(event.player)
  } catch (e1) {}
  lsoLimbHudInit = false
  lsoLimbHudLastVisible = false
})
