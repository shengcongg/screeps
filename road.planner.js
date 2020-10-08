// build road where is frequently routed through.



// 1. record positions and frequency of being stepped to sort against.

const roadPlanner = {
    plan() {
        let potentialRoadSites = getRoadSites()
        let index = _.sortedIndexBy(potentialRoadSites, { score: 2 }, 'score')
        let readySites = potentialRoadSites.splice(index, potentialRoadSites.length - index);
        readySites.forEach(pos => {
            let roomPosition = new RoomPosition(pos.x, pos.y, pos.roomName);
            roomPosition.createConstructionSite(STRUCTURE_ROAD);
        });
    },
    recordOnPathPlanned(path) {
        if (!Memory.sortedRoadSites) {
            Memory.sortedRoadSites = []
        }
        let roadSites = _.map(path, (n) => {
            return {
                pos: n.pos,
                score: 1
            }
        })
    },
    recordOnPosStepped(roomPosition) {
        if (roomPosition.lookFor(LOOK_CONSTRUCTION_SITES).length > 0 || roomPosition.lookFor(LOOK_STRUCTURES).length > 0) {
            return
        }
        let sortedRoadSites = getRoadSites()

        let roadSite = {
            pos: roomPosition,
            score: 1
        }
        let index = _.sortedIndexBy(sortedRoadSites, roadSite, 'score')
        if (areSamePos(sortedRoadSites[index].pos, position)) {
            sortedRoadSites[index].pos.x += roadSite.x
            sortedRoadSites[index].pos.y += roadSite.y
        } else {
            sortedRoadSites = sortedRoadSites.splice(index, 0, roadSite)
        }
    },

}


const areSamePos = (pos1, pos2) => {
    return pos1.x === pos2.x && pos1.y === pos2.y && pos1.roomName === pos2.roomName
}


const getRoadSites = () => {
    let sortedRoadSites = Memory.sortedRoadSites
    if (!sortedRoadSites) {
        sortedRoadSites = []
    }
    return sortedRoadSites.splice(-3, 3)
}



module.exports = roadPlanner;



