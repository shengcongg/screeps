var roleHarvester = require('./role.harvester');
var roleUpgrader = require('./role.upgrader');
var roleBuilder = require('./role.builder');
var roadPlanner = require('./road.planner');

module.exports.loop = function () {
    // clear memory
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // checking energy in each room
    for (const name in Game.rooms) {
        // if (Game.rooms.hasOwnProperty(name)) {
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
        // }
    }


    // ===========================================
    // Plan road
    // ===========================================
    roadPlanner.plan();

    // ===========================================
    // TOWER
    // ===========================================
    // tower attacking

    const tower = Game.getObjectById('');
    if (tower) {
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }

        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax
        })
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure)
        }
    }

    // counting number of harvesters
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')
    console.log('Harvesters: ' + harvesters.length);
    
    // auto spawning
    if (harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {
            role: 'harvester'
        }})
    }

    // counting number of upgraders
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')
    console.log('Upgraders: ' + upgraders.length);
    
    // auto spawning
    if (upgraders.length < 2) {
        const newName = 'Upgraders' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {
            role: 'upgrader'
        }})
    }

    // counting number of builder
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder')
    console.log('Builders: ' + builders.length);
    
    // auto spawning
    if (builders.length < 2) {
        const newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {
            role: 'builder'
        }})
    }


    if (Game.spawns['Spawn1'].spawning) {
        const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for (const name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        roadPlanner.recordOnPosStepped(Game.creeps[name].pos)
    }
}