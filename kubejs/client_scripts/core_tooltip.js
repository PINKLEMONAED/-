// priority: 0

ItemEvents.tooltip(event => {
    event.add('kubejs:player_core', tooltip => {
        let nbt = tooltip.itemStack.nbt;

        // 如果没有 NBT，说明还没初始化
        if (!nbt || !nbt.contains('AbilityType')) {
            tooltip.add(Text.gray('§o待觉醒... (请等待感染异变)'));
            return;
        }

        // 汉化映射
        let typeMap = {
            'Metal': '§e金 (Metal)',
            'Wood': '§a木 (Wood)',
            'Water': '§b水 (Water)',
            'Fire': '§c火 (Fire)',
            'Earth': '§6土 (Earth)'
        };

        let type = nbt.getString('AbilityType');
        let displayType = typeMap[type] || type;
        
        let level = nbt.getInt('AbilityLevel');
        let exp = nbt.getInt('AbilityExp');
        let maxExp = nbt.getInt('MaxExp');
        let owner = nbt.getString('Owner');

        // 绘制面板
        tooltip.add(Text.darkGray('===================='));
        tooltip.add(Text.of('⚡ 异能属性: ').gold().append(Text.of(displayType)));
        tooltip.add(Text.of(`▲ 当前等级: Lv.${level}`).green());
        tooltip.add(Text.of(`◈ 经验进度: ${exp} / ${maxExp}`).aqua());
        tooltip.add(Text.darkGray('--------------------'));
        tooltip.add(Text.of(`灵魂绑定: ${owner}`).gray());
        tooltip.add(Text.darkGray('===================='));
    });
});