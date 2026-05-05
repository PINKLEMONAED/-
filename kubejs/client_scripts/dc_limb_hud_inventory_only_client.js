// DeceasedCraft - LSO 肢体生命 HUD 客户端背包检测
// 放入：kubejs/client_scripts/dc_limb_hud_inventory_only_client.js
// 只检测当前是否为“原版玩家背包界面”，然后通知服务端显示/隐藏。
// 不再直接 paint 元素，避免把 Painter 元素字段覆盖成 null。

var $Minecraft = Java.loadClass('net.minecraft.client.Minecraft')
var $InventoryScreen = Java.loadClass('net.minecraft.client.gui.screens.inventory.InventoryScreen')

var DC_LIMB_CLIENT_LAST_SHOW = false
var DC_LIMB_CLIENT_LAST_SEND_TICK = 0

function dcLimbClientIsPlayerInventory() {
  try {
    var mc = $Minecraft.getInstance()
    if (mc == null || mc.screen == null) return false
    var screen = mc.screen

    try {
      if (!(screen instanceof $InventoryScreen)) return false
    } catch (e1) {
      return false
    }

    // 只允许原版玩家背包。精妙背包、技能树、箱子、机器、ESC 菜单都不应该匹配。
    try {
      var name = String(screen.getClass().getName())
      return name === 'net.minecraft.client.gui.screens.inventory.InventoryScreen'
    } catch (e2) {
      return true
    }
  } catch (e3) {
    return false
  }
}

function dcLimbClientSendState(show) {
  try {
    if (!Client.player) return
    Client.player.sendData('dc_limb_hud_inventory_open', { open: !!show })
  } catch (e1) {}
}

ClientEvents.tick(function (event) {
  var show = dcLimbClientIsPlayerInventory()

  if (show !== DC_LIMB_CLIENT_LAST_SHOW) {
    DC_LIMB_CLIENT_LAST_SHOW = show
    dcLimbClientSendState(show)
    DC_LIMB_CLIENT_LAST_SEND_TICK = 0
    return
  }

  // 背包打开时偶尔补发一次状态，避免脚本重载或网络包丢失后服务端不知道当前已打开。
  if (show) {
    try {
      var age = Client.player ? Client.player.age : 0
      if (age - DC_LIMB_CLIENT_LAST_SEND_TICK >= 40) {
        DC_LIMB_CLIENT_LAST_SEND_TICK = age
        dcLimbClientSendState(true)
      }
    } catch (e1) {}
  }
})

ClientEvents.loggedOut(function (event) {
  dcLimbClientSendState(false)
  DC_LIMB_CLIENT_LAST_SHOW = false
  DC_LIMB_CLIENT_LAST_SEND_TICK = 0
})
