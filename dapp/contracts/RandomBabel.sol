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
    uint    public brickV;
    
    uint    public count;
    uint    public accumCount;
    
    mapping(address => uint) accounts;
    
    event AddBrick(address indexed from, uint indexed height, uint indexed count, int32 offset);
    event Collapse(uint indexed collapsedAt, address indexed account, uint indexed amount);
    event Accumulate(uint indexed count);
    event Top18(uint[18] values); //, uint t5, uint t6, uint t7, uint t8, uint t9);
    
    // function RandomBabel(uint64 _brickWidth) {
    //     brickWidth = _brickWidth;
    // }
    
    function RandomBabel() {
        brickV = 1 ether;
        brickD = 101;
        brickR = brickD / 2;
        bricks.push(Brick(0, 0, 0)); // default first brick. should we set address other than 0?
        
        count = 1;
        accumCount = 18;
    }
    
    function addBrick() {
        count += 1;
        
        var offset = randOffset(bricks[bricks.length-1].offset);
        bricks.push(Brick(msg.sender, brickV, offset));
        
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
            accumulate();
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
    
    // distribute value of top brick to lower bricks
    function accumulate() internal {
        uint keep = 0;
        uint remnant = 0;
        uint top = bricks.length - 1;
        
        uint[18] memory values;
        for(uint i=0; i < accumCount; i++) {
            if (top < i) {
                break; // should never happen
            }
            
            var brick = bricks[top-i];
            if (top == i) { // when we're at bottom
                brick.value += remnant;
            } else {
                if (i == 0) { // clear top brick
                    remnant = brick.value;
                    brick.value = 0;
                } else { // keep half, pass on half
                    keep = remnant / 2;
                    brick.value += keep;
                    remnant -= keep;
                } 
            }
            values[i] = brick.value;
        }
        
        Top18(values);
        Accumulate(i);
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