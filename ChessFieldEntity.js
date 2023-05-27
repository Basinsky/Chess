(function () {      
    var self; 
    var boardID;
    var descriptionData;
    var fieldName;    
    var props;
    var searchPosition;
    var searchLocation;
    var boardFound = false;
    var SEARCH_RADIUS = 20;
    var LOCATION_ROOT_URL = Script.resolvePath(".");   
    this.selectsound = SoundCache.getSound(LOCATION_ROOT_URL + "113218__satrebor__click.wav");

    this.preload = function (entityID) {
        this.entityID = entityID;
        this.selectlocation = this.entityID.position;       
        descriptionData = Entities.getEntityProperties(this.entityID, 'description').description;
        searchPosition = Entities.getEntityProperties(this.entityID, 'position').position;
        searchLocation = {x: searchPosition.x,y: searchPosition.y,z: searchPosition.z};
        self = entityID;            
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
    
    function getFieldInfo() {
        var descriptionDataSplit = descriptionData.split(":");
        fieldName = descriptionDataSplit[0];               
        return fieldName;        
    } 

    function sendDataToChessboard() {        
        var fieldInfo = getFieldInfo();        
        if (boardID) {
            Entities.callEntityServerMethod(             
                boardID, 
                "receiveDataFromField",
                [self,fieldInfo,"Selected",MyAvatar.displayName]
            );
            print(JSON.stringify("Try to send ..... " + fieldInfo));
        }    
    }

    function click() {        
        if (!boardFound) {
            findBoard();
            boardFound =true;
        }             
             
        Audio.playSound(this.selectsound, {
            position: MyAvatar.position,
            volume: 0.5});                
        sendDataToChessboard();                
    }
    
    this.startNearTrigger = click;
    this.startFarTrigger = click;
    this.clickDownOnEntity = click;
});