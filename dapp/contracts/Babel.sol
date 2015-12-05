import "std.sol";

contract Babel is mortal, named("Babel") {
    
    struct Brick {
        uint    id;
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
    
    uint    public clearThreshold;
    int32   public stablizer;
    
    mapping(address => uint) accounts;
    
    event AddBrick(uint indexed id, address indexed from, uint indexed height, int32 offset);
    event Collapse(uint indexed id, uint indexed collapsedAt, address indexed account, uint amount, uint height);
    event Accumulate(uint indexed count);
    event Clearing(uint indexed id, address indexed receiver, uint indexed amount);
    event Withdraw(address indexed receiver, uint indexed amount);
    event Top18(uint[18] values);
    
    function Babel() {
        brickV = 1 ether;
        brickD = 2**30;
        brickR = brickD / 2;
        bricks.push(Brick(0, msg.sender, 0, 0)); // default first brick, never collapse
        
        count = 1;
        accumCount = 9;
        clearThreshold = 10;
        stablizer = 50;
        
        if(clearThreshold < accumCount) {
            throw; // otherwise someone may not be able to clear
        }
    }
    
    function addBrick() external check_deposit {
        var offset = randOffset(bricks[bricks.length-1].offset);
        bricks.push(Brick(count, msg.sender, brickV, offset));
        
        AddBrick(count, msg.sender, bricks.length, offset);
        count += 1;
        
        collapseCheck();
    }
    
    function collapseCheck() internal {
        uint top = bricks.length - 1;
        int32 offset = bricks[top].offset;
        uint collapsed_at = top;
        

        for(uint i = top - 1; i > 0; i--) { // block at 0 never collapse
            var brick = bricks[i];
            
            if (abs(offset - brick.offset) > brickR) {
                collapsed_at = i;
                break;
            } else {
                offset = int32((int(offset) * int(top - i) + int(brick.offset)) / int(top - i + 1)); // possible overflow!
            }
        }
        
        if(collapsed_at < top) {
            collapse(collapsed_at);
        } else {
            accumulate();
        }
    }
    
    function collapse(uint i) internal {
        var top = bricks[bricks.length-1];
        
        uint amount;
        for(uint j = i+1; j < bricks.length; j++) {
            amount += bricks[j].value;
        }
        accounts[top.from] += amount;

        Collapse(top.id, i, top.from, amount, bricks.length);
        
        bricks.length = i+1; // make i the top brick
        // top18();
    }
    
    // distribute value of top brick to lower bricks
    function accumulate() internal {
        uint keep = 0;
        uint remnant = 0;
        uint top = bricks.length - 1;
        
        for(uint i=0; i < accumCount; i++) {
            if (top < i) break;
            
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
        }
        
        // top18();
        Accumulate(i);
        
        clear();
    }
        
    function clear() internal {
        if(bricks.length > clearThreshold) {
            var brick = bricks[bricks.length - 1 - clearThreshold];
            if (brick.value > 1 ether) {
                var amount = brick.value - 1 ether;
                accounts[brick.from] += amount;
                brick.value = 1 ether;
                Clearing(brick.id, brick.from, amount);
            }
            
            withdraw();
        }
    }
    
    function withdraw() internal {
        var receiver = msg.sender;
        if (accounts[receiver] > 0) {
            Withdraw(receiver, accounts[receiver]);
            
            receiver.send(accounts[receiver]);
            accounts[receiver] = 0;
        }
    }
    
    function top18() {
        uint[18] memory values;
        for(uint i=0; i<accumCount && i<bricks.length; i++) {
            var brick = bricks[bricks.length-1-i];
            values[i] = brick.value;
        }
        Top18(values);
    }
    
    function randOffset(int32 base) internal returns (int32 offset) {
        bytes32 lastHash = block.blockhash(block.number-1);
        int32 rand = int32(sha256(lastHash, tx.origin, count));
        offset = base + (stablizer * (rand % brickR) / 100);
    }
    
    function abs(int32 x) internal returns (int32 y) {
        if (x > 0 ) {
            y = x;
        } else {
            y = -x;
        }
    }
    
    modifier check_deposit {
        var rvalue = uint256(0);
        if(msg.value < 1 ether) {
            rvalue = msg.value;
        } else {
            rvalue = msg.value - 1 ether;
            _
        }

        refund(rvalue);
    }  
    
    function refund (uint rvalue) private {
        if(rvalue > txfee()){
            tx.origin.send(rvalue - txfee());
        }
    }

    function txfee () private returns (uint96 fee) {
        return uint96(100 * tx.gasprice);
    }



    
    function () { // prevent accidental tx
        throw;
    }
}