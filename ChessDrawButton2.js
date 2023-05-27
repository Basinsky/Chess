(function () {
    var boardID;       
    var props;
    var searchPosition;
    var searchLocation;
    var boardFound = false;
    var SEARCH_RADIUS = 20;
    var LOCATION_ROOT_URL = Script.resolvePath(".");   
    this.selectsound = SoundCache.getSound(LOCATION_ROOT_URL + "345297__scrampunk__itemize.wav");
 
    this.preload = function (entityID) {
        this.entityID = entityID;
        this.selectlocation = this.entityID.position;       
        searchPosition = Entities.getEntityProperties(this.entityID, 'position').position;
        searchLocation = {x: searchPosition.x,y: searchPosition.y,z: searchPosition.z};            
    };     
  
    function findBoard() {
        var entities = Entities.findEntities(searchLocation, SEARCH_RADIUS);
        for (var i in entities) {
            props = Entities.getEntityProperties(entities[i]);                  
            if (props.name === "BasinskyChessBoard") {
                boardID = props.id;                     
            }
        }        
    }
    
    function sendDataToChessboard() {             
        if (boardID) {
            Entities.callEntityServerMethod(             
                boardID, 
                "player2DrawRequest",
                ["player2 draw request",MyAvatar.displayName]
            );
            print(JSON.stringify("Try to send ..... player2 draw request"));
        }    
    }

    function click() {        
        if (!boardFound) {
            findBoard();
            boardFound =true;
        }
        sendDataToChessboard(); 
       
        Audio.playSound(this.selectsound, {
            position: MyAvatar.position,
            volume: 0.2});               
    }

    this.startNearTrigger = click;
    this.startFarTrigger = click;
    this.clickDownOnEntity = click;
});