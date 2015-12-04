var Web3 = require('web3');

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

var sandboxId = "0637d8ec6c714548bdab30710e3e6610346a4e1b";
var babelAddress = '0x17956ba5f4291844bc25aedb27e69bc11b5bda39';
var gamerAddress = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

var web3 = setupWeb3(sandboxId);
var babel = setupBabel(web3, babelAddress, window.babelABI);
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