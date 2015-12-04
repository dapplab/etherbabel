var babelABI = [{
    "constant": false,
    "inputs": [],
    "name": "nameRegAddress",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "count",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "top18",
    "outputs": [],
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "uint256"
    }],
    "name": "bricks",
    "outputs": [{
        "name": "id",
        "type": "uint256"
    }, {
        "name": "from",
        "type": "address"
    }, {
        "name": "value",
        "type": "uint256"
    }, {
        "name": "offset",
        "type": "int32"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "brickV",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "accumCount",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "name",
        "type": "bytes32"
    }],
    "name": "named",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "newOwner",
        "type": "address"
    }],
    "name": "changeOwner",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "brickD",
    "outputs": [{
        "name": "",
        "type": "int32"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "addBrick",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "clearThreshold",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "type": "function"
}, {
    "inputs": [],
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "id",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "height",
        "type": "uint256"
    }, {
        "indexed": false,
        "name": "offset",
        "type": "int32"
    }],
    "name": "AddBrick",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "id",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "collapsedAt",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "account",
        "type": "address"
    }, {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
    }, {
        "indexed": false,
        "name": "height",
        "type": "uint256"
    }],
    "name": "Collapse",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "count",
        "type": "uint256"
    }],
    "name": "Accumulate",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "id",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "receiver",
        "type": "address"
    }, {
        "indexed": true,
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Clearing",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "receiver",
        "type": "address"
    }, {
        "indexed": true,
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Withdraw",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "values",
        "type": "uint256[18]"
    }],
    "name": "Top18",
    "type": "event"
}];


var Web3 = require('web3');

function setupWeb3(sandboxId) {
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider("http://babel.on.ether.camp:8555/sandbox/" + sandboxId));

    return web3;
}

function setupContract(web3, address) {
    var Babel = web3.eth.contract(babelABI);
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

var sandboxId = "0637d8ec6c714548bdab30710e3e6610346a4e1b";
var babelAddress = '0x17956ba5f4291844bc25aedb27e69bc11b5bda39';
var gamerAddress = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

var web3 = setupWeb3(sandboxId);
var babel = setupContract(web3, babelAddress);
setupFilters(babel);

var brickPrice = web3.toWei('1', 'ether');

window.web3 = web3;
window.babel = babel;

$(function() {
    $('#add-brick').on('click', function() {
        babel.addBrick({
            from: gamerAddress,
            value: brickPrice,
        });
        console.log('add brick.');
    })
});