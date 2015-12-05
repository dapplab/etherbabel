var Web3 = require('web3');

var canvasWidth = 680;
var canvasHeight = 720;

var brickWidth = 120;
var brickHeight = 30;
var brickBorder = 1;
var brickFullHeight = brickHeight + brickBorder*2;

var centralBrickLeft = canvasWidth/2 - brickWidth/2;

function renderDemo() {
    $('#canvas .brick').each(function(i, el) {
        var level = $(el).data('level');
        $(el).css('bottom', level*brickFullHeight);
        $(el).css('left', centralBrickLeft);
    });
}

function setupWeb3(sandboxId) {
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider("http://babel.on.ether.camp:8555/sandbox/" + sandboxId));

    return web3;
}

function setupBabel(web3, address, abi) {
    var Babel = web3.eth.contract(abi);
    var babel = Babel.at(address);
    console.log("babel initalized.", babel);

    return babel;
}

function setupFilters(babel) {
    babel.AddBrick('latest', function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            var obj = {
                id: result.args.id.toString(),
                from: result.args.from,
                height: result.args.height.toString(),
                offset: result.args.offset.toString()
            }
            console.log("AddBrick", obj);
        }
    });
}

function initTower() {
    var bricks = [];

    var i = 0;
    while(true) {
        var brick = babel.bricks(i, {
            from: gamerAddress
        });

        console.log("Load brick", brick);
        if(brick[1] === '0x') {
            break;
        } else {
            bricks.push(brick);
        }

        i++;
    }

    console.log("Bricks loaded.");
}

var sandboxId = "0880bf1eba692f18ba3f5be5438324ebace5fd15";
var babelAddress = '0x17956ba5f4291844bc25aedb27e69bc11b5bda39';
var gamerAddress = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

var web3 = setupWeb3(sandboxId);
var babel = setupBabel(web3, babelAddress, window.babelABI);
setupFilters(babel);

var brickPrice = web3.toWei('1', 'ether');

window.web3 = web3;
window.babel = babel;

$(function() {
    initTower();

    $('#add-brick').on('click', function() {
        babel.addBrick({
            from: gamerAddress,
            value: brickPrice,
        });
        console.log('add brick. yeah!');
        renderDemo();
    })
});
