var roleHarvester = {
    /** @param {Creep} creep **/
    run(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            // var sources = creep.room.find(FIND_SOURCES);
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER].includes(structure.structureType) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length) {
                if (creep.pos.inRangeTo(targets[0], 1)) {
                    creep.transfer(targets[0], RESOURCE_ENERGY)
                } else {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;