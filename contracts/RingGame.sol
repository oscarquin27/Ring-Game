pragma solidity ^0.4.23;


contract RingGame {
    
    uint public time;
    uint randomNum;
    uint256 nextRoundInterval = time;
    address owner;
    bool allowed;
    uint two = 2;
    uint three = 3;
    uint five = 5;
    uint fifty = 50;
    uint public random;
    uint public length;
    struct Bet {
        uint betType;
        address player;
        uint value;
    }
    
    Bet[] public bets;
    
    event NewBetTwo(address player, uint amount);
    event NewBetThree(address player, uint amount);
    event NewBetFive(address player, uint amount);
    event NewBetFifty(address player, uint amount);
    event PlayGame(uint time);
    event StopGame(uint time);
    
    modifier OnlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    constructor() public {
        time = now;
        owner = msg.sender;
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
        
    }
    
    function play() public OnlyOwner returns (uint) {
        random = uint8(uint256(keccak256(block.timestamp, block.difficulty))%55);
        emit PlayGame(random);
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
    
}