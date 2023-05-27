
var LOCATION_ROOT_URL = Script.resolvePath(".");
print (LOCATION_ROOT_URL);        
var boardID = Entities.addEntity({
    type: "Shape",
    shape: "Cube",
    name: "BasinskyChessBoard",
    serverScripts: LOCATION_ROOT_URL + "Chess-Server.js?"+ Date.now(),    
    color: {red: 0 ,green: 0,blue: 50},
    position: Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: -1, z: -5 })),       
    dimensions: { x: 10, y: 0.4, z: 10 },
    lifetime: -1,
    userData: "{ \"grabbableKey\": { \"grabbable\": false} }"
});
Script.stop();
