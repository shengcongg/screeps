// build road where is frequently routed through.



// 1. record positions and frequency of being stepped to sort against.
const roadPlanner = {
    plan() {
        let potentialRoadSites = getRoadSites()
        let index = _.sortedIndex(potentialRoadSites, { score: 5 }, 'score')
        let readySites = potentialRoadSites.splice(index, potentialRoadSites.length - index);
        console.log(readySites)
        _.forEach(readySites, site => {
            let roomPosition = new RoomPosition(site.pos.x, site.pos.y, site.pos.roomName);
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
        console.log(roomPosition)
        if (roomPosition.lookFor(LOOK_CONSTRUCTION_SITES).length > 0 || roomPosition.lookFor(LOOK_STRUCTURES).length > 0) {
            console.log("not plain")
            return
        }
        let sortedRoadSites = getRoadSites()

        let roadSite = {
            pos: roomPosition,
            score: 1
        }
        let temp
        let indexExisted = sortedRoadSites.findIndex(o => o.pos.x == roadSite.pos.x && o.pos.y == roadSite.pos.y) 
        if (indexExisted >= 0) {
            temp = sortedRoadSites.splice(indexExisted, 1)
            roadSite.score += temp.score
        }
        let indexNew = _.sortedIndex(sortedRoadSites, roadSite, 'score')
        if (sortedRoadSites[indexNew] && areSamePos(sortedRoadSites[indexNew].pos, roadSite.pos)) {
            sortedRoadSites[indexNew].score += roadSite.score
        } else {
            sortedRoadSites = sortedRoadSites.splice(indexNew, 0, roadSite)
        }
    }
}


const areSamePos = (pos1, pos2) => {
    return pos1.x === pos2.x && pos1.y === pos2.y && pos1.roomName === pos2.roomName
}

const getRoadSites = () => {
    if (!Memory.sortedRoadSites) {
        Memory.sortedRoadSites = []
    }
    return Memory.sortedRoadSites
}



module.exports = roadPlanner;



