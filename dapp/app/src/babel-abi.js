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

export default babelABI;
