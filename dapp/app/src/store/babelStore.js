import Web3               from 'web3';
import babelABI           from './../babel-abi';

const BabelConfig = {
  sandboxId: "ad4d13f2bb42be973245d513b0b10a4fbdd95677",
  babelAddress: '0x17956ba5f4291844bc25aedb27e69bc11b5bda39',
  gamerAddress: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
  providerUrl: 'http://babel.on.ether.camp:8555/sandbox/'
}

export default class BabelStore {
  constructor(props) {
    let web3 = this.setupWeb3();
    let babel = this.setupBabel(web3);
    this.setupFilters(babel);

    this.web3 = web3;
    this.babel = babel;
    this.brickPrice = web3.toWei('1', 'ether');
  }

  setupWeb3() {
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(BabelConfig.providerUrl + BabelConfig.sandboxId));

    return web3;
  }

  setupBabel(web3) {
    var Babel = web3.eth.contract(babelABI);
    var babel = Babel.at(BabelConfig.babelAddress);
    console.log("babel initalized.", babel);

    return babel;
  }

  setupFilters(babel) {
    babel.AddBrick('latest', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var obj = formatBrick(result.args);
            // addBrick(obj);
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
        // collapse(obj);
      }
    });
  }

  getBricks() {
    var bricks = [];

    var i = 0;
    while(true) {
      var brick = this.formatBrick(this.babel.bricks(i, { from: BabelConfig.gamerAddress }));

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

  formatBrick(brick) {
    if (Array.isArray(brick)) { // Init
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

}// class end