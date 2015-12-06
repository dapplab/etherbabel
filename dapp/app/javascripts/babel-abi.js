window.babelABI = [
    {
      "type" : "function",
      "outputs" : [
         {
            "type" : "address",
            "name" : ""
         }
      ],
      "name" : "nameRegAddress",
      "constant" : false,
      "inputs" : []
   },
   {
      "type" : "function",
      "outputs" : [
         {
            "name" : "",
            "type" : "uint256"
         }
      ],
      "name" : "count",
      "constant" : true,
      "inputs" : []
   },
   {
      "inputs" : [],
      "name" : "disable",
      "constant" : false,
      "outputs" : [],
      "type" : "function"
   },
   {
      "outputs" : [
         {
            "name" : "",
            "type" : "int32"
         }
      ],
      "type" : "function",
      "inputs" : [],
      "name" : "stablizer",
      "constant" : true
   },
   {
      "outputs" : [],
      "type" : "function",
      "inputs" : [],
      "name" : "top18",
      "constant" : false
   },
   {
      "type" : "function",
      "outputs" : [],
      "constant" : false,
      "name" : "kill",
      "inputs" : []
   },
   {
      "type" : "function",
      "outputs" : [
         {
            "type" : "int32[1024]",
            "name" : "offset"
         }
      ],
      "name" : "getOffsets",
      "constant" : false,
      "inputs" : []
   },
   {
      "name" : "bricks",
      "constant" : true,
      "inputs" : [
         {
            "name" : "",
            "type" : "uint256"
         }
      ],
      "type" : "function",
      "outputs" : [
         {
            "name" : "id",
            "type" : "uint256"
         },
         {
            "type" : "address",
            "name" : "from"
         },
         {
            "name" : "value",
            "type" : "uint256"
         },
         {
            "type" : "int32",
            "name" : "offset"
         },
         {
            "name" : "message",
            "type" : "string"
         }
      ]
   },
   {
      "name" : "brickV",
      "constant" : true,
      "inputs" : [],
      "type" : "function",
      "outputs" : [
         {
            "type" : "uint256",
            "name" : ""
         }
      ]
   },
   {
      "outputs" : [],
      "type" : "function",
      "inputs" : [
         {
            "name" : "m",
            "type" : "string"
         }
      ],
      "constant" : false,
      "name" : "addBrick"
   },
   {
      "constant" : true,
      "name" : "accumCount",
      "inputs" : [],
      "type" : "function",
      "outputs" : [
         {
            "name" : "",
            "type" : "uint256"
         }
      ]
   },
   {
      "outputs" : [
         {
            "name" : "",
            "type" : "address"
         }
      ],
      "type" : "function",
      "inputs" : [
         {
            "name" : "name",
            "type" : "bytes32"
         }
      ],
      "name" : "named",
      "constant" : false
   },
   {
      "outputs" : [],
      "type" : "function",
      "inputs" : [
         {
            "type" : "address",
            "name" : "newOwner"
         }
      ],
      "name" : "changeOwner",
      "constant" : false
   },
   {
      "outputs" : [
         {
            "name" : "",
            "type" : "int32"
         }
      ],
      "type" : "function",
      "inputs" : [],
      "name" : "brickD",
      "constant" : true
   },
   {
      "constant" : false,
      "name" : "addBrick",
      "inputs" : [],
      "type" : "function",
      "outputs" : []
   },
   {
      "type" : "function",
      "outputs" : [
         {
            "type" : "uint256",
            "name" : ""
         }
      ],
      "name" : "clearThreshold",
      "constant" : true,
      "inputs" : []
   },
   {
      "inputs" : [],
      "type" : "constructor"
   },
   {
      "type" : "event",
      "anonymous" : false,
      "name" : "AddBrick",
      "inputs" : [
         {
            "type" : "uint256",
            "indexed" : true,
            "name" : "id"
         },
         {
            "type" : "address",
            "indexed" : true,
            "name" : "from"
         },
         {
            "type" : "uint256",
            "indexed" : true,
            "name" : "height"
         },
         {
            "type" : "int32",
            "indexed" : false,
            "name" : "offset"
         },
         {
            "name" : "message",
            "indexed" : false,
            "type" : "string"
         }
      ]
   },
   {
      "anonymous" : false,
      "type" : "event",
      "name" : "Collapse",
      "inputs" : [
         {
            "indexed" : true,
            "type" : "uint256",
            "name" : "id"
         },
         {
            "type" : "uint256",
            "indexed" : true,
            "name" : "collapsedAt"
         },
         {
            "type" : "address",
            "indexed" : true,
            "name" : "account"
         },
         {
            "indexed" : false,
            "type" : "uint256",
            "name" : "amount"
         },
         {
            "indexed" : false,
            "type" : "uint256",
            "name" : "height"
         }
      ]
   },
   {
      "type" : "event",
      "anonymous" : false,
      "name" : "Accumulate",
      "inputs" : [
         {
            "name" : "count",
            "type" : "uint256",
            "indexed" : true
         }
      ]
   },
   {
      "name" : "Clearing",
      "inputs" : [
         {
            "indexed" : true,
            "type" : "uint256",
            "name" : "id"
         },
         {
            "indexed" : true,
            "type" : "address",
            "name" : "receiver"
         },
         {
            "name" : "amount",
            "indexed" : true,
            "type" : "uint256"
         }
      ],
      "anonymous" : false,
      "type" : "event"
   },
   {
      "inputs" : [
         {
            "name" : "receiver",
            "indexed" : true,
            "type" : "address"
         },
         {
            "name" : "amount",
            "type" : "uint256",
            "indexed" : true
         }
      ],
      "name" : "Withdraw",
      "type" : "event",
      "anonymous" : false
   },
   {
      "anonymous" : false,
      "type" : "event",
      "inputs" : [
         {
            "name" : "values",
            "type" : "uint256[18]",
            "indexed" : false
         }
      ],
      "name" : "Top18"
   }
]
