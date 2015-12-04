import "std.sol";

contract RandomBabel is named("RandomBabel") {
    
    struct Brick {
        address from;
        // string message;
        uint    value;
        int32   offset;
    }
    
    Brick[] public bricks;
    int32   public brickD;
    int32          brickR;
    
    uint    public count;
    
    mapping(address => uint) accounts;
    
    event AddBrick(address indexed from, uint indexed height, uint indexed count, int32 offset);
    event Collapse(uint indexed collapsedAt, address indexed account, uint indexed amount);
    event Dividend();
    
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
        
        settle();
    }
    
    function settle() internal {
        int32 offset = 0;
        uint top = bricks.length - 1;
        uint collapsed_at = top;
        

        for(uint i = top; i > 0; i--) { // block at 0 never collapse
            var brick = bricks[i];
            
            if (i == top) {
                offset = brick.offset;
            } else {
                if (abs(offset - brick.offset) > brickR) {
                    collapsed_at = i;
                    break;
                } else {
                    offset = int32((int(offset)*int(i) + int(brick.offset)) / int(i+1)); // possible overflow!
                }
            }
        }
        
        if(collapsed_at < top) {
            collapse(collapsed_at);
        } else {
            dividend();
        }
    }
    
    function collapse(uint i) internal {
        address receiver = bricks[bricks.length-1].from;
        
        uint amount;
        for(uint j = i+1; j < bricks.length; j++) {
            amount += bricks[j].value;
        }
        accounts[receiver] = amount;

        bricks.length = i+1; // make i the top brick
        
        Collapse(i, receiver, amount);
    }
    
    function dividend() internal {
        Dividend();
    }
    
    // todo: take last 10 blockhash?
    function randOffset(int32 base) returns (int32 offset) {
        var lastHash = block.blockhash(block.number-1);
        offset = base + int32(lastHash) % brickR;
    }
    
    function abs(int32 x) internal returns (int32 y) {
        if (x > 0 ) {
            y = x;
        } else {
            y = -x;
        }
    }
    
    function () { // prevent accidental tx
        throw;
    }
}