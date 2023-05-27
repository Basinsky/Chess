(function () {    
    var self; 
    var boardID;   
    var props;
    var searchPosition;
    var searchLocation;
    var boardFound = false;
    var currentfield;
    var piecetype;
    var piececolor;
    var pieceIdentifier;    
    var triggerState = false;
    var TRIGGER_CONTROLS = [
        Controller.Standard.LT,
        Controller.Standard.RT
    ];
    var SEARCH_RADIUS = 20;
    var LOCATION_ROOT_URL = Script.resolvePath(".");   
    this.selectsound = SoundCache.getSound(LOCATION_ROOT_URL + "113218__satrebor__click.wav");

    function triggerPulled(hand) {        
        //  Return true if the trigger has just been pulled
        var triggerValue = Controller.getValue(TRIGGER_CONTROLS[hand]);
        var oldTriggerState = triggerState;
        var TRIGGER_PULL_THRESHOLD = 0.9;
        var TRIGGER_RELEASE_THRESHOLD = 0.8;
        if (triggerValue > TRIGGER_PULL_THRESHOLD) {
            triggerState = true;
        } else if (triggerValue < TRIGGER_RELEASE_THRESHOLD) {
            triggerState = false;
        }
        return (triggerState && (oldTriggerState !== triggerState)); 
    }
 

    this.preload = function (entityID) {
        this.entityID = entityID;              
        pieceIdentifier = Entities.getEntityProperties(this.entityID, 'description').description;
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
    
    function getpieceInfo() {
        var descriptionSplit = pieceIdentifier.split(":");
        currentfield = descriptionSplit[0];
        piecetype = descriptionSplit[1];
        piececolor = descriptionSplit[2];               
        return;        
    } 

    function sendDataToChessboard() {        
        getpieceInfo();        
        if (boardID) {
            Entities.callEntityServerMethod(             
                boardID, 
                "receiveDataFromPiece",
                [self,currentfield,piecetype,piececolor,"Selected",MyAvatar.displayName]
            );
            print(JSON.stringify("Try to send ..... " + currentfield + piecetype));
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

    function handletrigger() {
        if (triggerPulled) {
            if (!boardFound) {
                findBoard();
                boardFound =true;
            }           
            Audio.playSound(this.selectsound, {
                position: MyAvatar.position,
                volume: 0.5});            
            sendDataToChessboard();                 
        }
    }  
    this.startNearTrigger = handletrigger;
    this.startFarTrigger = handletrigger;
    this.clickDownOnEntity = click;        
});
