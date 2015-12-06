var Web3 = require('web3');

var canvasWidth = 680;
var canvasHeight = 720;

var brickWidth = 120;
var brickHeight = 30;
var brickBorder = 1;
var brickFullHeight = brickHeight + brickBorder*2;
var brickHalfWidth = brickWidth / 2;

var brickD = 1073741824.0; // 2**30;
var brickR = brickD / 2;

var centralBrickLeft = canvasWidth/2 - brickWidth/2;

function formatBrick(brick) {
    if ($.isArray(brick)) { // Init
        return {
            id: brick[0].toString(),
            from: brick[1],
            value: brick[2].toString(),
            offset: brick[3].toString()
        }
    } else { // Event
        return {
            id: brick.id.toString(),
            from: brick.from,
            height: brick.height.toString(),
            offset: brick.offset.toString()
        };
    }
}

function clearCanvas() {
    $('#canvas').remove();
    $('body').append("<div id='canvas'></div>");
}

function addBrickToCanvas(level, brick) {
    $('#canvas').append('<div class="brick" data-offset="' + brick.offset + '" data-level="'+ level + '">' + level + '</div>');
}

function renderDemo(bricks) {
    clearCanvas();
    $.each(bricks, addBrickToCanvas);

    $('#canvas .brick').each(function(i, el) {
        var level = $(el).data('level');
        var offset = parseInt($(el).data('offset'));
        var left = centralBrickLeft + brickHalfWidth * offset / brickR;
        $(el).css('bottom', level*brickFullHeight);
        $(el).css('left', left);
    });
}

function addBrick(brick) {
    window.bricks.push(brick);
    renderDemo(window.bricks);
    console.log("AddBrick", brick);
}

function collapse(obj) {
    window.bricks = window.bricks.slice(0, obj.collapsedAt+1);
    renderDemo(window.bricks);
    console.log("Collapsed!", obj);
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
        } else {
            var obj = formatBrick(result.args);
            addBrick(obj);
        }
    });

    babel.Collapse('latest', function(err, result) {
      if (err) {
        console.log(err);
      } else {
        var obj = {
          id: result.args.id.toNumber(),
          collapsedAt: result.args.collapsedAt.toNumber(),
          account: result.args.account,
          amount: result.args.amount.toString(),
          height: result.args.height.toNumber
        };
        collapse(obj);
      }
    });
}

function getBricks() {
    var bricks = [];

    var i = 0;
    while(true) {
        var brick = formatBrick(babel.bricks(i, { from: gamerAddress }));

        if(brick.from === '0x') {
            break;
        } else {
            bricks.push(brick);
            console.log("Load brick", brick);
        }

        i++;
    }

    return bricks;
}

function init() {
    window.bricks = getBricks();
    console.log("Bricks loaded.");

    renderDemo(window.bricks);
}

var sandboxId = "75963edba9e7f7a6a8760ea6f8f62f5c532b5324";
var babelAddress = '0x17956ba5f4291844bc25aedb27e69bc11b5bda39';
var gamerAddress = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

var web3 = setupWeb3(sandboxId);
var babel = setupBabel(web3, babelAddress, window.babelABI);
setupFilters(babel);

var brickPrice = web3.toWei('1', 'ether');

window.web3 = web3;
window.babel = babel;

$(function() {
    init();

    $('#add-brick').on('click', function() {
        babel.addBrick({
            from: gamerAddress,
            value: brickPrice,
        });
        console.log('add brick. yeah!');
    })
});
