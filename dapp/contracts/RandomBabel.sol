import "std.sol";

contract RandomBabel is named("RandomBabel") {
    
    struct Brick {
        address from;
        // string message;
        uint32 value;
        int32  offset;
    }
    
    Brick[] public bricks;
    int32   public brickD;
    int32          brickR;
    
    uint256 public count;
    
    event AddBrick(address indexed from, uint256 indexed height, uint256 indexed count, int32 offset);
    
    // function RandomBabel(uint64 _brickWidth) {
    //     brickWidth = _brickWidth;
    // }
    
    function RandomBabel() {
        brickD = 101;
        brickR = brickD / 2;
        
        bricks.push(Brick(0, 0, 0)); // default first brick. should we set address other than 0?
        count = 1;
    }
    
    function addBrick() {
        count += 1;
        
        var offset = randOffset(bricks[bricks.length-1].offset);
        bricks.push(Brick(msg.sender, 1, offset));
        
        AddBrick(msg.sender, bricks.length, count, offset);
    }
    
    // todo: take last 10 blockhash?
    function randOffset(int32 base) returns (int32 offset) {
        var lastHash = block.blockhash(block.number-1);
        offset = base + int32(lastHash) % brickR;
    }
    
    function () { // prevent accidental tx
        throw;
    }
}