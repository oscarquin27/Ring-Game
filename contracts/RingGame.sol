pragma solidity ^0.4.23;


contract RingGame {
    
    uint public time;
    address owner;
    bool allowed;
    uint two = 2;
    uint three = 3;
    uint five = 5;
    uint fifty = 50;
    uint public random;
    uint public length;
    string secretKey = "8vQ3X5StoY";
    bytes32 public hashval;
    bytes32 public salt;
    mapping(address => MyBets[]) public myBets;
    mapping(uint256 => PreviousGames) public previous;
    mapping(uint256 => Message) public messages;
    mapping(address => User) public users;
    uint256 public messageCount = 0;
    uint256 public previousCount = 0;

    struct Bet {
        uint betType;
        address player;
        uint value;
    }
    struct MyBets {
        uint betType;
        uint value;
        uint256 timestamp;
        uint256 round;
    }
    
    struct PreviousGames{
        uint random;
        bytes32 salt;
        uint256 round;
    }

    struct Message{
        address sender;
        string message;
    }

    struct User {
        string username;
        string image;
    }
    
    Bet[] public bets;
    
    event NewBetTwo(address player, uint amount);
    event NewBetThree(address player, uint amount);
    event NewBetFive(address player, uint amount);
    event NewBetFifty(address player, uint amount);
    event PlayGame(uint time);
    event StopGame(uint time);
    event MessageSent(address sender, string message);
    
    modifier OnlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    constructor() public {
        time = now;
        owner = msg.sender;
    }

     function setUsername(string username) public {
        users[msg.sender].username = username;
    }
    
     function setAvatar(string avatar) public {
        users[msg.sender].image = avatar;
    }
    
    function betTwo() public payable {
        require(msg.value >= 10 trx);
        bets.push(Bet({
            betType : 2,
            player : msg.sender,
            value : msg.value
        }));
        owner.transfer(msg.value);
        emit NewBetTwo(msg.sender, msg.value);
        myBets[msg.sender].push(MyBets({
            betType: 2,
            value: msg.value,
            timestamp: now,
            round: previousCount
        }));
    }
    
     function betThree() public payable {
        require(msg.value >= 10 trx);
        bets.push(Bet({
            betType : 3,
            player : msg.sender,
            value : msg.value
        }));
        owner.transfer(msg.value);
        emit NewBetThree(msg.sender, msg.value);
        myBets[msg.sender].push(MyBets({
            betType: 3,
            value: msg.value,
            timestamp: now,
            round: previousCount
        }));
        
    }
    
     function betFive() public payable {
        require(msg.value >= 10 trx);
        bets.push(Bet({
            betType : 5,
            player : msg.sender,
            value : msg.value
        }));
        owner.transfer(msg.value);
        emit NewBetFive(msg.sender, msg.value);
        myBets[msg.sender].push(MyBets({
            betType: 5,
            value: msg.value,
            timestamp: now,
            round: previousCount
        }));
        
    }
    
     function betFifty() public payable {
        require(msg.value >= 10 trx);
        bets.push(Bet({
            betType : 50,
            player : msg.sender,
            value : msg.value
        }));
        owner.transfer(msg.value);
        
        emit NewBetFifty(msg.sender, msg.value);
        myBets[msg.sender].push(MyBets({
            betType: 50,
            value: msg.value,
            timestamp: now,
            round: previousCount
        }));
        
    }
    
    function play() public OnlyOwner returns (uint) {
        uint256 diff = block.difficulty;
        uint256 timestamp = now;
       
        random = uint8(uint256(keccak256(abi.encodePacked(timestamp,diff, secretKey)))%54);
        random += 1;
        salt = keccak256(abi.encodePacked(timestamp,diff, secretKey));
        hashval = sha256(abi.encodePacked(salt,random));
        previousCount += 1;
        emit PlayGame(random);
        previous[previousCount] = PreviousGames(random, salt, previousCount);
        return random;
   }

   function betLenght() public view returns (uint){
       return bets.length;
   }


    function stop(uint _type) public payable OnlyOwner{
        for(uint256 i = 0; i < bets.length; i++){
           if(bets[i].betType == _type){
               bets[i].player.transfer(bets[i].value*bets[i].betType);
           } 
        }
        
        bets.length = 0;
        time = now;
        emit StopGame(time);
    }

    function getLength(address user) public view returns(uint256){
        return myBets[user].length;
    }
    
    function sendMessage(string b) public {
        messageCount += 1;
        messages[messageCount] = Message(msg.sender, b);
        emit MessageSent(msg.sender, b);
    }

}