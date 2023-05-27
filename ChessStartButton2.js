(function () {
    var SEARCH_RADIUS = 20;    
    var LOCATION_ROOT_URL = Script.resolvePath(".");   
    this.selectsound = SoundCache.getSound(LOCATION_ROOT_URL + "234525__foolboymedia__announcement-begin.wav");
    var boardID;   
    var avatarName;    
    var props;
    var searchPosition;
    var searchLocation;
    var boardFound = false;
    

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
        avatarName = MyAvatar.displayName;      
        if (boardID) {
            Entities.callEntityServerMethod(             
                boardID, 
                "player2Select",
                [avatarName,MyAvatar.sessionUUID]
            );
            print(JSON.stringify("Try to send ..... " + avatarName));
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