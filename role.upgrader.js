const roleUpgrader = {
    run(creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }
        if (creep.memory.upgrading) {
            if (creep.pos.inRangeTo(creep.room.controller, 1)) {
                creep.upgradeController(creep.room.controller)
            } else {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = roleUpgrader