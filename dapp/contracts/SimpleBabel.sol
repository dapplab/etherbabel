import "std.sol";

contract SimpleBabel is named("SimpleBabel") {
    
    struct Brick {
        address from;
        string message;
        uint256 value;
    }
    
    Brick[] public bricks;
    
    uint256 public base = 100 finney; // 0.1 ether
    uint256 public rate = 10 finney; // 0.01 ether
    
    event AddBrick(address indexed from, uint256 indexed value, uint256 indexed size, uint256 fee, uint256 height);
    
    function SimpleBabel() {
    }
    
    function addBrick(string message) returns (uint256) {
        var size = bytes(message).length;
        var fee = calculateFee(size);
        
        if (msg.value < fee) {
            throw;
        }

        bricks.push(Brick(msg.sender, message, msg.value));
        AddBrick(msg.sender, msg.value, size, fee, bricks.length);
        
        return bricks.length;
    }
    
    function calculateFee(uint256 size) returns (uint256 fee) {
        fee = base + rate * size;
    }
    
    function height() returns (uint256 height) {
        height = bricks.length;
    }
}