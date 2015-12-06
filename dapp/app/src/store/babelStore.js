import Web3               from 'web3';
import babelABI           from './../babel-abi';

const BabelConfig = {
  sandboxId: "151d8b972335fc65ddd1abdf87854b63dea076ca",
  babelAddress: '0x17956ba5f4291844bc25aedb27e69bc11b5bda39',
  gamerAddress: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
  providerUrl: 'http://babel.on.ether.camp:8555/sandbox/'
}

export default class BabelStore {
  constructor(props) {
    let web3 = this.setupWeb3();
    let babel = this.setupBabel(web3);

    this.web3 = web3;
    this.babel = babel;
    this.brickPrice = web3.toWei('1', 'ether');
    this.coinbase = web3.eth.coinbase;
    this.gamerAddress = BabelConfig.gamerAddress;
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

  getBricksFromOffsets(callback) {
    var bricks = [];

    var length = this.babel.getHeight({ from: BabelConfig.gamerAddress }).toNumber();
    var offsets = this.babel.getOffsets({ from: BabelConfig.gamerAddress });
    for(var i=0; i < length; i++) {
        bricks.push({
            id: '-1',
            from: '0x',
            value: '-1',
            offset: offsets[i].toNumber()
        });
    }
    console.log(length + " bricks loaded.");

    if (callback && typeof(callback) === "function") {
      callback.call(this, bricks);
    }

    return bricks;
  }

  getBricks(callback) {

    var bricks = [];

    //bricks = [
      //{id: "0", from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392", value: "1000000000000000000", offset: "0", donated: true},
      //{id: "1", from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392", value: "1000000000000000000", offset: "-84753978", donated: true},
      //{id: "2", from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392", value: "1000000000000000000", offset: "-101533667", donated: true},
      //{id: "5", from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392", value: "1000000000000000000", offset: "-83289209", donated: true},
      //{id: "149", from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392", value: "1000000000000000000", offset: "-59276098", donated: true},
      //{id: "149", from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392", value: "1000000000000000000", offset: "-59276098", donated: true}
    //];
    //if (callback && typeof(callback) === "function") {
      //callback.call(this, bricks);
    //}
    //return bricks;

    var i = 0;
    while(true) {
      var brick = this.formatBrick(this.babel.bricks(i, { from: BabelConfig.gamerAddress }));

      if(brick.from === '0x') {
        break;
      } else {
        bricks.push(brick);
        //console.log("Load brick", brick);
      }
      callback.call(this, brick, i);

      i++;
    }
    //if (callback && typeof(callback) === "function") {
      //callback.call(this, bricks);
    //}
    return bricks;
  }

  formatBrick(brick) {
    if (Array.isArray(brick)) { // Init
      return {
        id: brick[0].toString(),
        from: brick[1],
        value: brick[2].toString(),
        offset: brick[3].toString(),
        donated: this.donatedByU(brick[1])
      }
    } else { // Event
      return {
        id: brick.id.toString(),
        from: brick.from,
        height: brick.height.toString(),
        offset: brick.offset.toString(),
        donated: this.donatedByU(brick.from)
      };
    }
  }

  donatedByU(brickFrom) {
    return brickFrom === BabelConfig.gamerAddress;
  }

}// class end
