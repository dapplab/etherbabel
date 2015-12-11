webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(161);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory();
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define([], factory);
		}
		else {
			// Global (browser)
			root.CryptoJS = factory();
		}
	}(this, function () {
	
		/**
		 * CryptoJS core components.
		 */
		var CryptoJS = CryptoJS || (function (Math, undefined) {
		    /**
		     * CryptoJS namespace.
		     */
		    var C = {};
	
		    /**
		     * Library namespace.
		     */
		    var C_lib = C.lib = {};
	
		    /**
		     * Base object for prototypal inheritance.
		     */
		    var Base = C_lib.Base = (function () {
		        function F() {}
	
		        return {
		            /**
		             * Creates a new object that inherits from this object.
		             *
		             * @param {Object} overrides Properties to copy into the new object.
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         field: 'value',
		             *
		             *         method: function () {
		             *         }
		             *     });
		             */
		            extend: function (overrides) {
		                // Spawn
		                F.prototype = this;
		                var subtype = new F();
	
		                // Augment
		                if (overrides) {
		                    subtype.mixIn(overrides);
		                }
	
		                // Create default initializer
		                if (!subtype.hasOwnProperty('init')) {
		                    subtype.init = function () {
		                        subtype.$super.init.apply(this, arguments);
		                    };
		                }
	
		                // Initializer's prototype is the subtype object
		                subtype.init.prototype = subtype;
	
		                // Reference supertype
		                subtype.$super = this;
	
		                return subtype;
		            },
	
		            /**
		             * Extends this object and runs the init method.
		             * Arguments to create() will be passed to init().
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var instance = MyType.create();
		             */
		            create: function () {
		                var instance = this.extend();
		                instance.init.apply(instance, arguments);
	
		                return instance;
		            },
	
		            /**
		             * Initializes a newly created object.
		             * Override this method to add some logic when your objects are created.
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         init: function () {
		             *             // ...
		             *         }
		             *     });
		             */
		            init: function () {
		            },
	
		            /**
		             * Copies properties into this object.
		             *
		             * @param {Object} properties The properties to mix in.
		             *
		             * @example
		             *
		             *     MyType.mixIn({
		             *         field: 'value'
		             *     });
		             */
		            mixIn: function (properties) {
		                for (var propertyName in properties) {
		                    if (properties.hasOwnProperty(propertyName)) {
		                        this[propertyName] = properties[propertyName];
		                    }
		                }
	
		                // IE won't copy toString using the loop above
		                if (properties.hasOwnProperty('toString')) {
		                    this.toString = properties.toString;
		                }
		            },
	
		            /**
		             * Creates a copy of this object.
		             *
		             * @return {Object} The clone.
		             *
		             * @example
		             *
		             *     var clone = instance.clone();
		             */
		            clone: function () {
		                return this.init.prototype.extend(this);
		            }
		        };
		    }());
	
		    /**
		     * An array of 32-bit words.
		     *
		     * @property {Array} words The array of 32-bit words.
		     * @property {number} sigBytes The number of significant bytes in this word array.
		     */
		    var WordArray = C_lib.WordArray = Base.extend({
		        /**
		         * Initializes a newly created word array.
		         *
		         * @param {Array} words (Optional) An array of 32-bit words.
		         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.create();
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
		         */
		        init: function (words, sigBytes) {
		            words = this.words = words || [];
	
		            if (sigBytes != undefined) {
		                this.sigBytes = sigBytes;
		            } else {
		                this.sigBytes = words.length * 4;
		            }
		        },
	
		        /**
		         * Converts this word array to a string.
		         *
		         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
		         *
		         * @return {string} The stringified word array.
		         *
		         * @example
		         *
		         *     var string = wordArray + '';
		         *     var string = wordArray.toString();
		         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
		         */
		        toString: function (encoder) {
		            return (encoder || Hex).stringify(this);
		        },
	
		        /**
		         * Concatenates a word array to this word array.
		         *
		         * @param {WordArray} wordArray The word array to append.
		         *
		         * @return {WordArray} This word array.
		         *
		         * @example
		         *
		         *     wordArray1.concat(wordArray2);
		         */
		        concat: function (wordArray) {
		            // Shortcuts
		            var thisWords = this.words;
		            var thatWords = wordArray.words;
		            var thisSigBytes = this.sigBytes;
		            var thatSigBytes = wordArray.sigBytes;
	
		            // Clamp excess bits
		            this.clamp();
	
		            // Concat
		            if (thisSigBytes % 4) {
		                // Copy one byte at a time
		                for (var i = 0; i < thatSigBytes; i++) {
		                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
		                }
		            } else {
		                // Copy one word at a time
		                for (var i = 0; i < thatSigBytes; i += 4) {
		                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
		                }
		            }
		            this.sigBytes += thatSigBytes;
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Removes insignificant bits.
		         *
		         * @example
		         *
		         *     wordArray.clamp();
		         */
		        clamp: function () {
		            // Shortcuts
		            var words = this.words;
		            var sigBytes = this.sigBytes;
	
		            // Clamp
		            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
		            words.length = Math.ceil(sigBytes / 4);
		        },
	
		        /**
		         * Creates a copy of this word array.
		         *
		         * @return {WordArray} The clone.
		         *
		         * @example
		         *
		         *     var clone = wordArray.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone.words = this.words.slice(0);
	
		            return clone;
		        },
	
		        /**
		         * Creates a word array filled with random bytes.
		         *
		         * @param {number} nBytes The number of random bytes to generate.
		         *
		         * @return {WordArray} The random word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.random(16);
		         */
		        random: function (nBytes) {
		            var words = [];
	
		            var r = (function (m_w) {
		                var m_w = m_w;
		                var m_z = 0x3ade68b1;
		                var mask = 0xffffffff;
	
		                return function () {
		                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
		                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
		                    var result = ((m_z << 0x10) + m_w) & mask;
		                    result /= 0x100000000;
		                    result += 0.5;
		                    return result * (Math.random() > .5 ? 1 : -1);
		                }
		            });
	
		            for (var i = 0, rcache; i < nBytes; i += 4) {
		                var _r = r((rcache || Math.random()) * 0x100000000);
	
		                rcache = _r() * 0x3ade67b7;
		                words.push((_r() * 0x100000000) | 0);
		            }
	
		            return new WordArray.init(words, nBytes);
		        }
		    });
	
		    /**
		     * Encoder namespace.
		     */
		    var C_enc = C.enc = {};
	
		    /**
		     * Hex encoding strategy.
		     */
		    var Hex = C_enc.Hex = {
		        /**
		         * Converts a word array to a hex string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The hex string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var hexChars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                hexChars.push((bite >>> 4).toString(16));
		                hexChars.push((bite & 0x0f).toString(16));
		            }
	
		            return hexChars.join('');
		        },
	
		        /**
		         * Converts a hex string to a word array.
		         *
		         * @param {string} hexStr The hex string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
		         */
		        parse: function (hexStr) {
		            // Shortcut
		            var hexStrLength = hexStr.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < hexStrLength; i += 2) {
		                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
		            }
	
		            return new WordArray.init(words, hexStrLength / 2);
		        }
		    };
	
		    /**
		     * Latin1 encoding strategy.
		     */
		    var Latin1 = C_enc.Latin1 = {
		        /**
		         * Converts a word array to a Latin1 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The Latin1 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var latin1Chars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                latin1Chars.push(String.fromCharCode(bite));
		            }
	
		            return latin1Chars.join('');
		        },
	
		        /**
		         * Converts a Latin1 string to a word array.
		         *
		         * @param {string} latin1Str The Latin1 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
		         */
		        parse: function (latin1Str) {
		            // Shortcut
		            var latin1StrLength = latin1Str.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < latin1StrLength; i++) {
		                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
		            }
	
		            return new WordArray.init(words, latin1StrLength);
		        }
		    };
	
		    /**
		     * UTF-8 encoding strategy.
		     */
		    var Utf8 = C_enc.Utf8 = {
		        /**
		         * Converts a word array to a UTF-8 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-8 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            try {
		                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		            } catch (e) {
		                throw new Error('Malformed UTF-8 data');
		            }
		        },
	
		        /**
		         * Converts a UTF-8 string to a word array.
		         *
		         * @param {string} utf8Str The UTF-8 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
		         */
		        parse: function (utf8Str) {
		            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
		        }
		    };
	
		    /**
		     * Abstract buffered block algorithm template.
		     *
		     * The property blockSize must be implemented in a concrete subtype.
		     *
		     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
		     */
		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
		        /**
		         * Resets this block algorithm's data buffer to its initial state.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm.reset();
		         */
		        reset: function () {
		            // Initial values
		            this._data = new WordArray.init();
		            this._nDataBytes = 0;
		        },
	
		        /**
		         * Adds new data to this block algorithm's buffer.
		         *
		         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm._append('data');
		         *     bufferedBlockAlgorithm._append(wordArray);
		         */
		        _append: function (data) {
		            // Convert string to WordArray, else assume WordArray already
		            if (typeof data == 'string') {
		                data = Utf8.parse(data);
		            }
	
		            // Append
		            this._data.concat(data);
		            this._nDataBytes += data.sigBytes;
		        },
	
		        /**
		         * Processes available data blocks.
		         *
		         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
		         *
		         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
		         *
		         * @return {WordArray} The processed data.
		         *
		         * @example
		         *
		         *     var processedData = bufferedBlockAlgorithm._process();
		         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
		         */
		        _process: function (doFlush) {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
		            var dataSigBytes = data.sigBytes;
		            var blockSize = this.blockSize;
		            var blockSizeBytes = blockSize * 4;
	
		            // Count blocks ready
		            var nBlocksReady = dataSigBytes / blockSizeBytes;
		            if (doFlush) {
		                // Round up to include partial blocks
		                nBlocksReady = Math.ceil(nBlocksReady);
		            } else {
		                // Round down to include only full blocks,
		                // less the number of blocks that must remain in the buffer
		                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
		            }
	
		            // Count words ready
		            var nWordsReady = nBlocksReady * blockSize;
	
		            // Count bytes ready
		            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
	
		            // Process blocks
		            if (nWordsReady) {
		                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
		                    // Perform concrete-algorithm logic
		                    this._doProcessBlock(dataWords, offset);
		                }
	
		                // Remove processed words
		                var processedWords = dataWords.splice(0, nWordsReady);
		                data.sigBytes -= nBytesReady;
		            }
	
		            // Return processed words
		            return new WordArray.init(processedWords, nBytesReady);
		        },
	
		        /**
		         * Creates a copy of this object.
		         *
		         * @return {Object} The clone.
		         *
		         * @example
		         *
		         *     var clone = bufferedBlockAlgorithm.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone._data = this._data.clone();
	
		            return clone;
		        },
	
		        _minBufferSize: 0
		    });
	
		    /**
		     * Abstract hasher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
		     */
		    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
		        /**
		         * Configuration options.
		         */
		        cfg: Base.extend(),
	
		        /**
		         * Initializes a newly created hasher.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
		         *
		         * @example
		         *
		         *     var hasher = CryptoJS.algo.SHA256.create();
		         */
		        init: function (cfg) {
		            // Apply config defaults
		            this.cfg = this.cfg.extend(cfg);
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this hasher to its initial state.
		         *
		         * @example
		         *
		         *     hasher.reset();
		         */
		        reset: function () {
		            // Reset data buffer
		            BufferedBlockAlgorithm.reset.call(this);
	
		            // Perform concrete-hasher logic
		            this._doReset();
		        },
	
		        /**
		         * Updates this hasher with a message.
		         *
		         * @param {WordArray|string} messageUpdate The message to append.
		         *
		         * @return {Hasher} This hasher.
		         *
		         * @example
		         *
		         *     hasher.update('message');
		         *     hasher.update(wordArray);
		         */
		        update: function (messageUpdate) {
		            // Append
		            this._append(messageUpdate);
	
		            // Update the hash
		            this._process();
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Finalizes the hash computation.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
		         *
		         * @return {WordArray} The hash.
		         *
		         * @example
		         *
		         *     var hash = hasher.finalize();
		         *     var hash = hasher.finalize('message');
		         *     var hash = hasher.finalize(wordArray);
		         */
		        finalize: function (messageUpdate) {
		            // Final message update
		            if (messageUpdate) {
		                this._append(messageUpdate);
		            }
	
		            // Perform concrete-hasher logic
		            var hash = this._doFinalize();
	
		            return hash;
		        },
	
		        blockSize: 512/32,
	
		        /**
		         * Creates a shortcut function to a hasher's object interface.
		         *
		         * @param {Hasher} hasher The hasher to create a helper for.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
		         */
		        _createHelper: function (hasher) {
		            return function (message, cfg) {
		                return new hasher.init(cfg).finalize(message);
		            };
		        },
	
		        /**
		         * Creates a shortcut function to the HMAC's object interface.
		         *
		         * @param {Hasher} hasher The hasher to use in this HMAC helper.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
		         */
		        _createHmacHelper: function (hasher) {
		            return function (message, key) {
		                return new C_algo.HMAC.init(hasher, key).finalize(message);
		            };
		        }
		    });
	
		    /**
		     * Algorithm namespace.
		     */
		    var C_algo = C.algo = {};
	
		    return C;
		}(Math));
	
	
		return CryptoJS;
	
	}));

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Cipher core components.
		 */
		CryptoJS.lib.Cipher || (function (undefined) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var WordArray = C_lib.WordArray;
		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
		    var C_enc = C.enc;
		    var Utf8 = C_enc.Utf8;
		    var Base64 = C_enc.Base64;
		    var C_algo = C.algo;
		    var EvpKDF = C_algo.EvpKDF;
	
		    /**
		     * Abstract base cipher template.
		     *
		     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
		     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
		     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
		     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
		     */
		    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {WordArray} iv The IV to use for this operation.
		         */
		        cfg: Base.extend(),
	
		        /**
		         * Creates this cipher in encryption mode.
		         *
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {Cipher} A cipher instance.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
		         */
		        createEncryptor: function (key, cfg) {
		            return this.create(this._ENC_XFORM_MODE, key, cfg);
		        },
	
		        /**
		         * Creates this cipher in decryption mode.
		         *
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {Cipher} A cipher instance.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
		         */
		        createDecryptor: function (key, cfg) {
		            return this.create(this._DEC_XFORM_MODE, key, cfg);
		        },
	
		        /**
		         * Initializes a newly created cipher.
		         *
		         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @example
		         *
		         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
		         */
		        init: function (xformMode, key, cfg) {
		            // Apply config defaults
		            this.cfg = this.cfg.extend(cfg);
	
		            // Store transform mode and key
		            this._xformMode = xformMode;
		            this._key = key;
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this cipher to its initial state.
		         *
		         * @example
		         *
		         *     cipher.reset();
		         */
		        reset: function () {
		            // Reset data buffer
		            BufferedBlockAlgorithm.reset.call(this);
	
		            // Perform concrete-cipher logic
		            this._doReset();
		        },
	
		        /**
		         * Adds data to be encrypted or decrypted.
		         *
		         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
		         *
		         * @return {WordArray} The data after processing.
		         *
		         * @example
		         *
		         *     var encrypted = cipher.process('data');
		         *     var encrypted = cipher.process(wordArray);
		         */
		        process: function (dataUpdate) {
		            // Append
		            this._append(dataUpdate);
	
		            // Process available blocks
		            return this._process();
		        },
	
		        /**
		         * Finalizes the encryption or decryption process.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
		         *
		         * @return {WordArray} The data after final processing.
		         *
		         * @example
		         *
		         *     var encrypted = cipher.finalize();
		         *     var encrypted = cipher.finalize('data');
		         *     var encrypted = cipher.finalize(wordArray);
		         */
		        finalize: function (dataUpdate) {
		            // Final data update
		            if (dataUpdate) {
		                this._append(dataUpdate);
		            }
	
		            // Perform concrete-cipher logic
		            var finalProcessedData = this._doFinalize();
	
		            return finalProcessedData;
		        },
	
		        keySize: 128/32,
	
		        ivSize: 128/32,
	
		        _ENC_XFORM_MODE: 1,
	
		        _DEC_XFORM_MODE: 2,
	
		        /**
		         * Creates shortcut functions to a cipher's object interface.
		         *
		         * @param {Cipher} cipher The cipher to create a helper for.
		         *
		         * @return {Object} An object with encrypt and decrypt shortcut functions.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
		         */
		        _createHelper: (function () {
		            function selectCipherStrategy(key) {
		                if (typeof key == 'string') {
		                    return PasswordBasedCipher;
		                } else {
		                    return SerializableCipher;
		                }
		            }
	
		            return function (cipher) {
		                return {
		                    encrypt: function (message, key, cfg) {
		                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
		                    },
	
		                    decrypt: function (ciphertext, key, cfg) {
		                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
		                    }
		                };
		            };
		        }())
		    });
	
		    /**
		     * Abstract base stream cipher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
		     */
		    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
		        _doFinalize: function () {
		            // Process partial blocks
		            var finalProcessedBlocks = this._process(!!'flush');
	
		            return finalProcessedBlocks;
		        },
	
		        blockSize: 1
		    });
	
		    /**
		     * Mode namespace.
		     */
		    var C_mode = C.mode = {};
	
		    /**
		     * Abstract base block cipher mode template.
		     */
		    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
		        /**
		         * Creates this mode for encryption.
		         *
		         * @param {Cipher} cipher A block cipher instance.
		         * @param {Array} iv The IV words.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
		         */
		        createEncryptor: function (cipher, iv) {
		            return this.Encryptor.create(cipher, iv);
		        },
	
		        /**
		         * Creates this mode for decryption.
		         *
		         * @param {Cipher} cipher A block cipher instance.
		         * @param {Array} iv The IV words.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
		         */
		        createDecryptor: function (cipher, iv) {
		            return this.Decryptor.create(cipher, iv);
		        },
	
		        /**
		         * Initializes a newly created mode.
		         *
		         * @param {Cipher} cipher A block cipher instance.
		         * @param {Array} iv The IV words.
		         *
		         * @example
		         *
		         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
		         */
		        init: function (cipher, iv) {
		            this._cipher = cipher;
		            this._iv = iv;
		        }
		    });
	
		    /**
		     * Cipher Block Chaining mode.
		     */
		    var CBC = C_mode.CBC = (function () {
		        /**
		         * Abstract base CBC mode.
		         */
		        var CBC = BlockCipherMode.extend();
	
		        /**
		         * CBC encryptor.
		         */
		        CBC.Encryptor = CBC.extend({
		            /**
		             * Processes the data block at offset.
		             *
		             * @param {Array} words The data words to operate on.
		             * @param {number} offset The offset where the block starts.
		             *
		             * @example
		             *
		             *     mode.processBlock(data.words, offset);
		             */
		            processBlock: function (words, offset) {
		                // Shortcuts
		                var cipher = this._cipher;
		                var blockSize = cipher.blockSize;
	
		                // XOR and encrypt
		                xorBlock.call(this, words, offset, blockSize);
		                cipher.encryptBlock(words, offset);
	
		                // Remember this block to use with next block
		                this._prevBlock = words.slice(offset, offset + blockSize);
		            }
		        });
	
		        /**
		         * CBC decryptor.
		         */
		        CBC.Decryptor = CBC.extend({
		            /**
		             * Processes the data block at offset.
		             *
		             * @param {Array} words The data words to operate on.
		             * @param {number} offset The offset where the block starts.
		             *
		             * @example
		             *
		             *     mode.processBlock(data.words, offset);
		             */
		            processBlock: function (words, offset) {
		                // Shortcuts
		                var cipher = this._cipher;
		                var blockSize = cipher.blockSize;
	
		                // Remember this block to use with next block
		                var thisBlock = words.slice(offset, offset + blockSize);
	
		                // Decrypt and XOR
		                cipher.decryptBlock(words, offset);
		                xorBlock.call(this, words, offset, blockSize);
	
		                // This block becomes the previous block
		                this._prevBlock = thisBlock;
		            }
		        });
	
		        function xorBlock(words, offset, blockSize) {
		            // Shortcut
		            var iv = this._iv;
	
		            // Choose mixing block
		            if (iv) {
		                var block = iv;
	
		                // Remove IV for subsequent blocks
		                this._iv = undefined;
		            } else {
		                var block = this._prevBlock;
		            }
	
		            // XOR blocks
		            for (var i = 0; i < blockSize; i++) {
		                words[offset + i] ^= block[i];
		            }
		        }
	
		        return CBC;
		    }());
	
		    /**
		     * Padding namespace.
		     */
		    var C_pad = C.pad = {};
	
		    /**
		     * PKCS #5/7 padding strategy.
		     */
		    var Pkcs7 = C_pad.Pkcs7 = {
		        /**
		         * Pads data using the algorithm defined in PKCS #5/7.
		         *
		         * @param {WordArray} data The data to pad.
		         * @param {number} blockSize The multiple that the data should be padded to.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
		         */
		        pad: function (data, blockSize) {
		            // Shortcut
		            var blockSizeBytes = blockSize * 4;
	
		            // Count padding bytes
		            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
	
		            // Create padding word
		            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;
	
		            // Create padding
		            var paddingWords = [];
		            for (var i = 0; i < nPaddingBytes; i += 4) {
		                paddingWords.push(paddingWord);
		            }
		            var padding = WordArray.create(paddingWords, nPaddingBytes);
	
		            // Add padding
		            data.concat(padding);
		        },
	
		        /**
		         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
		         *
		         * @param {WordArray} data The data to unpad.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
		         */
		        unpad: function (data) {
		            // Get number of padding bytes from last byte
		            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
	
		            // Remove padding
		            data.sigBytes -= nPaddingBytes;
		        }
		    };
	
		    /**
		     * Abstract base block cipher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
		     */
		    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {Mode} mode The block mode to use. Default: CBC
		         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
		         */
		        cfg: Cipher.cfg.extend({
		            mode: CBC,
		            padding: Pkcs7
		        }),
	
		        reset: function () {
		            // Reset cipher
		            Cipher.reset.call(this);
	
		            // Shortcuts
		            var cfg = this.cfg;
		            var iv = cfg.iv;
		            var mode = cfg.mode;
	
		            // Reset block mode
		            if (this._xformMode == this._ENC_XFORM_MODE) {
		                var modeCreator = mode.createEncryptor;
		            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
		                var modeCreator = mode.createDecryptor;
	
		                // Keep at least one block in the buffer for unpadding
		                this._minBufferSize = 1;
		            }
		            this._mode = modeCreator.call(mode, this, iv && iv.words);
		        },
	
		        _doProcessBlock: function (words, offset) {
		            this._mode.processBlock(words, offset);
		        },
	
		        _doFinalize: function () {
		            // Shortcut
		            var padding = this.cfg.padding;
	
		            // Finalize
		            if (this._xformMode == this._ENC_XFORM_MODE) {
		                // Pad data
		                padding.pad(this._data, this.blockSize);
	
		                // Process final blocks
		                var finalProcessedBlocks = this._process(!!'flush');
		            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
		                // Process final blocks
		                var finalProcessedBlocks = this._process(!!'flush');
	
		                // Unpad data
		                padding.unpad(finalProcessedBlocks);
		            }
	
		            return finalProcessedBlocks;
		        },
	
		        blockSize: 128/32
		    });
	
		    /**
		     * A collection of cipher parameters.
		     *
		     * @property {WordArray} ciphertext The raw ciphertext.
		     * @property {WordArray} key The key to this ciphertext.
		     * @property {WordArray} iv The IV used in the ciphering operation.
		     * @property {WordArray} salt The salt used with a key derivation function.
		     * @property {Cipher} algorithm The cipher algorithm.
		     * @property {Mode} mode The block mode used in the ciphering operation.
		     * @property {Padding} padding The padding scheme used in the ciphering operation.
		     * @property {number} blockSize The block size of the cipher.
		     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
		     */
		    var CipherParams = C_lib.CipherParams = Base.extend({
		        /**
		         * Initializes a newly created cipher params object.
		         *
		         * @param {Object} cipherParams An object with any of the possible cipher parameters.
		         *
		         * @example
		         *
		         *     var cipherParams = CryptoJS.lib.CipherParams.create({
		         *         ciphertext: ciphertextWordArray,
		         *         key: keyWordArray,
		         *         iv: ivWordArray,
		         *         salt: saltWordArray,
		         *         algorithm: CryptoJS.algo.AES,
		         *         mode: CryptoJS.mode.CBC,
		         *         padding: CryptoJS.pad.PKCS7,
		         *         blockSize: 4,
		         *         formatter: CryptoJS.format.OpenSSL
		         *     });
		         */
		        init: function (cipherParams) {
		            this.mixIn(cipherParams);
		        },
	
		        /**
		         * Converts this cipher params object to a string.
		         *
		         * @param {Format} formatter (Optional) The formatting strategy to use.
		         *
		         * @return {string} The stringified cipher params.
		         *
		         * @throws Error If neither the formatter nor the default formatter is set.
		         *
		         * @example
		         *
		         *     var string = cipherParams + '';
		         *     var string = cipherParams.toString();
		         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
		         */
		        toString: function (formatter) {
		            return (formatter || this.formatter).stringify(this);
		        }
		    });
	
		    /**
		     * Format namespace.
		     */
		    var C_format = C.format = {};
	
		    /**
		     * OpenSSL formatting strategy.
		     */
		    var OpenSSLFormatter = C_format.OpenSSL = {
		        /**
		         * Converts a cipher params object to an OpenSSL-compatible string.
		         *
		         * @param {CipherParams} cipherParams The cipher params object.
		         *
		         * @return {string} The OpenSSL-compatible string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
		         */
		        stringify: function (cipherParams) {
		            // Shortcuts
		            var ciphertext = cipherParams.ciphertext;
		            var salt = cipherParams.salt;
	
		            // Format
		            if (salt) {
		                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
		            } else {
		                var wordArray = ciphertext;
		            }
	
		            return wordArray.toString(Base64);
		        },
	
		        /**
		         * Converts an OpenSSL-compatible string to a cipher params object.
		         *
		         * @param {string} openSSLStr The OpenSSL-compatible string.
		         *
		         * @return {CipherParams} The cipher params object.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
		         */
		        parse: function (openSSLStr) {
		            // Parse base64
		            var ciphertext = Base64.parse(openSSLStr);
	
		            // Shortcut
		            var ciphertextWords = ciphertext.words;
	
		            // Test for salt
		            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
		                // Extract salt
		                var salt = WordArray.create(ciphertextWords.slice(2, 4));
	
		                // Remove salt from ciphertext
		                ciphertextWords.splice(0, 4);
		                ciphertext.sigBytes -= 16;
		            }
	
		            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
		        }
		    };
	
		    /**
		     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
		     */
		    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
		         */
		        cfg: Base.extend({
		            format: OpenSSLFormatter
		        }),
	
		        /**
		         * Encrypts a message.
		         *
		         * @param {Cipher} cipher The cipher algorithm to use.
		         * @param {WordArray|string} message The message to encrypt.
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {CipherParams} A cipher params object.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
		         */
		        encrypt: function (cipher, message, key, cfg) {
		            // Apply config defaults
		            cfg = this.cfg.extend(cfg);
	
		            // Encrypt
		            var encryptor = cipher.createEncryptor(key, cfg);
		            var ciphertext = encryptor.finalize(message);
	
		            // Shortcut
		            var cipherCfg = encryptor.cfg;
	
		            // Create and return serializable cipher params
		            return CipherParams.create({
		                ciphertext: ciphertext,
		                key: key,
		                iv: cipherCfg.iv,
		                algorithm: cipher,
		                mode: cipherCfg.mode,
		                padding: cipherCfg.padding,
		                blockSize: cipher.blockSize,
		                formatter: cfg.format
		            });
		        },
	
		        /**
		         * Decrypts serialized ciphertext.
		         *
		         * @param {Cipher} cipher The cipher algorithm to use.
		         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {WordArray} The plaintext.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
		         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
		         */
		        decrypt: function (cipher, ciphertext, key, cfg) {
		            // Apply config defaults
		            cfg = this.cfg.extend(cfg);
	
		            // Convert string to CipherParams
		            ciphertext = this._parse(ciphertext, cfg.format);
	
		            // Decrypt
		            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
	
		            return plaintext;
		        },
	
		        /**
		         * Converts serialized ciphertext to CipherParams,
		         * else assumed CipherParams already and returns ciphertext unchanged.
		         *
		         * @param {CipherParams|string} ciphertext The ciphertext.
		         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
		         *
		         * @return {CipherParams} The unserialized ciphertext.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
		         */
		        _parse: function (ciphertext, format) {
		            if (typeof ciphertext == 'string') {
		                return format.parse(ciphertext, this);
		            } else {
		                return ciphertext;
		            }
		        }
		    });
	
		    /**
		     * Key derivation function namespace.
		     */
		    var C_kdf = C.kdf = {};
	
		    /**
		     * OpenSSL key derivation function.
		     */
		    var OpenSSLKdf = C_kdf.OpenSSL = {
		        /**
		         * Derives a key and IV from a password.
		         *
		         * @param {string} password The password to derive from.
		         * @param {number} keySize The size in words of the key to generate.
		         * @param {number} ivSize The size in words of the IV to generate.
		         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
		         *
		         * @return {CipherParams} A cipher params object with the key, IV, and salt.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
		         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
		         */
		        execute: function (password, keySize, ivSize, salt) {
		            // Generate random salt
		            if (!salt) {
		                salt = WordArray.random(64/8);
		            }
	
		            // Derive key and IV
		            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
	
		            // Separate key and IV
		            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
		            key.sigBytes = keySize * 4;
	
		            // Return params
		            return CipherParams.create({ key: key, iv: iv, salt: salt });
		        }
		    };
	
		    /**
		     * A serializable cipher wrapper that derives the key from a password,
		     * and returns ciphertext as a serializable cipher params object.
		     */
		    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
		         */
		        cfg: SerializableCipher.cfg.extend({
		            kdf: OpenSSLKdf
		        }),
	
		        /**
		         * Encrypts a message using a password.
		         *
		         * @param {Cipher} cipher The cipher algorithm to use.
		         * @param {WordArray|string} message The message to encrypt.
		         * @param {string} password The password.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {CipherParams} A cipher params object.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
		         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
		         */
		        encrypt: function (cipher, message, password, cfg) {
		            // Apply config defaults
		            cfg = this.cfg.extend(cfg);
	
		            // Derive key and other params
		            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);
	
		            // Add IV to config
		            cfg.iv = derivedParams.iv;
	
		            // Encrypt
		            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
	
		            // Mix in derived params
		            ciphertext.mixIn(derivedParams);
	
		            return ciphertext;
		        },
	
		        /**
		         * Decrypts serialized ciphertext using a password.
		         *
		         * @param {Cipher} cipher The cipher algorithm to use.
		         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
		         * @param {string} password The password.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {WordArray} The plaintext.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
		         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
		         */
		        decrypt: function (cipher, ciphertext, password, cfg) {
		            // Apply config defaults
		            cfg = this.cfg.extend(cfg);
	
		            // Convert string to CipherParams
		            ciphertext = this._parse(ciphertext, cfg.format);
	
		            // Derive key and other params
		            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);
	
		            // Add IV to config
		            cfg.iv = derivedParams.iv;
	
		            // Decrypt
		            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
	
		            return plaintext;
		        }
		    });
		}());
	
	
	}));

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/**
	 * @file utils.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	/**
	 * Utils
	 *
	 * @module utils
	 */
	
	/**
	 * Utility functions
	 *
	 * @class [utils] utils
	 * @constructor
	 */
	
	
	var BigNumber = __webpack_require__(45);
	var utf8 = __webpack_require__(349);
	
	var unitMap = {
	    'wei':          '1',
	    'kwei':         '1000',
	    'ada':          '1000',
	    'femtoether':   '1000',
	    'mwei':         '1000000',
	    'babbage':      '1000000',
	    'picoether':    '1000000',
	    'gwei':         '1000000000',
	    'shannon':      '1000000000',
	    'nanoether':    '1000000000',
	    'nano':         '1000000000',
	    'szabo':        '1000000000000',
	    'microether':   '1000000000000',
	    'micro':        '1000000000000',
	    'finney':       '1000000000000000',
	    'milliether':    '1000000000000000',
	    'milli':         '1000000000000000',
	    'ether':        '1000000000000000000',
	    'kether':       '1000000000000000000000',
	    'grand':        '1000000000000000000000',
	    'einstein':     '1000000000000000000000',
	    'mether':       '1000000000000000000000000',
	    'gether':       '1000000000000000000000000000',
	    'tether':       '1000000000000000000000000000000'
	};
	
	/**
	 * Should be called to pad string to expected length
	 *
	 * @method padLeft
	 * @param {String} string to be padded
	 * @param {Number} characters that result string should have
	 * @param {String} sign, by default 0
	 * @returns {String} right aligned string
	 */
	var padLeft = function (string, chars, sign) {
	    return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
	};
	
	/**
	 * Should be called to pad string to expected length
	 *
	 * @method padRight
	 * @param {String} string to be padded
	 * @param {Number} characters that result string should have
	 * @param {String} sign, by default 0
	 * @returns {String} right aligned string
	 */
	var padRight = function (string, chars, sign) {
	    return string + (new Array(chars - string.length + 1).join(sign ? sign : "0"));
	};
	
	/**
	 * Should be called to get utf8 from it's hex representation
	 *
	 * @method toUtf8
	 * @param {String} string in hex
	 * @returns {String} ascii string representation of hex value
	 */
	var toUtf8 = function(hex) {
	// Find termination
	    var str = "";
	    var i = 0, l = hex.length;
	    if (hex.substring(0, 2) === '0x') {
	        i = 2;
	    }
	    for (; i < l; i+=2) {
	        var code = parseInt(hex.substr(i, 2), 16);
	        if (code === 0)
	            break;
	        str += String.fromCharCode(code);
	    }
	
	    return utf8.decode(str);
	};
	
	/**
	 * Should be called to get ascii from it's hex representation
	 *
	 * @method toAscii
	 * @param {String} string in hex
	 * @returns {String} ascii string representation of hex value
	 */
	var toAscii = function(hex) {
	// Find termination
	    var str = "";
	    var i = 0, l = hex.length;
	    if (hex.substring(0, 2) === '0x') {
	        i = 2;
	    }
	    for (; i < l; i+=2) {
	        var code = parseInt(hex.substr(i, 2), 16);
	        str += String.fromCharCode(code);
	    }
	
	    return str;
	};
	
	/**
	 * Should be called to get hex representation (prefixed by 0x) of utf8 string
	 *
	 * @method fromUtf8
	 * @param {String} string
	 * @param {Number} optional padding
	 * @returns {String} hex representation of input string
	 */
	var fromUtf8 = function(str) {
	    str = utf8.encode(str);
	    var hex = "";
	    for(var i = 0; i < str.length; i++) {
	        var code = str.charCodeAt(i);
	        if (code === 0)
	            break;
	        var n = code.toString(16);
	        hex += n.length < 2 ? '0' + n : n;
	    }
	
	    return "0x" + hex;
	};
	
	/**
	 * Should be called to get hex representation (prefixed by 0x) of ascii string
	 *
	 * @method fromAscii
	 * @param {String} string
	 * @param {Number} optional padding
	 * @returns {String} hex representation of input string
	 */
	var fromAscii = function(str) {
	    var hex = "";
	    for(var i = 0; i < str.length; i++) {
	        var code = str.charCodeAt(i);
	        var n = code.toString(16);
	        hex += n.length < 2 ? '0' + n : n;
	    }
	
	    return "0x" + hex;
	};
	
	/**
	 * Should be used to create full function/event name from json abi
	 *
	 * @method transformToFullName
	 * @param {Object} json-abi
	 * @return {String} full fnction/event name
	 */
	var transformToFullName = function (json) {
	    if (json.name.indexOf('(') !== -1) {
	        return json.name;
	    }
	
	    var typeName = json.inputs.map(function(i){return i.type; }).join();
	    return json.name + '(' + typeName + ')';
	};
	
	/**
	 * Should be called to get display name of contract function
	 *
	 * @method extractDisplayName
	 * @param {String} name of function/event
	 * @returns {String} display name for function/event eg. multiply(uint256) -> multiply
	 */
	var extractDisplayName = function (name) {
	    var length = name.indexOf('(');
	    return length !== -1 ? name.substr(0, length) : name;
	};
	
	/// @returns overloaded part of function/event name
	var extractTypeName = function (name) {
	    /// TODO: make it invulnerable
	    var length = name.indexOf('(');
	    return length !== -1 ? name.substr(length + 1, name.length - 1 - (length + 1)).replace(' ', '') : "";
	};
	
	/**
	 * Converts value to it's decimal representation in string
	 *
	 * @method toDecimal
	 * @param {String|Number|BigNumber}
	 * @return {String}
	 */
	var toDecimal = function (value) {
	    return toBigNumber(value).toNumber();
	};
	
	/**
	 * Converts value to it's hex representation
	 *
	 * @method fromDecimal
	 * @param {String|Number|BigNumber}
	 * @return {String}
	 */
	var fromDecimal = function (value) {
	    var number = toBigNumber(value);
	    var result = number.toString(16);
	
	    return number.lessThan(0) ? '-0x' + result.substr(1) : '0x' + result;
	};
	
	/**
	 * Auto converts any given value into it's hex representation.
	 *
	 * And even stringifys objects before.
	 *
	 * @method toHex
	 * @param {String|Number|BigNumber|Object}
	 * @return {String}
	 */
	var toHex = function (val) {
	    /*jshint maxcomplexity: 8 */
	
	    if (isBoolean(val))
	        return fromDecimal(+val);
	
	    if (isBigNumber(val))
	        return fromDecimal(val);
	
	    if (isObject(val))
	        return fromUtf8(JSON.stringify(val));
	
	    // if its a negative number, pass it through fromDecimal
	    if (isString(val)) {
	        if (val.indexOf('-0x') === 0)
	            return fromDecimal(val);
	        else if(val.indexOf('0x') === 0)
	            return val;
	        else if (!isFinite(val))
	            return fromAscii(val);
	    }
	
	    return fromDecimal(val);
	};
	
	/**
	 * Returns value of unit in Wei
	 *
	 * @method getValueOfUnit
	 * @param {String} unit the unit to convert to, default ether
	 * @returns {BigNumber} value of the unit (in Wei)
	 * @throws error if the unit is not correct:w
	 */
	var getValueOfUnit = function (unit) {
	    unit = unit ? unit.toLowerCase() : 'ether';
	    var unitValue = unitMap[unit];
	    if (unitValue === undefined) {
	        throw new Error('This unit doesn\'t exists, please use the one of the following units' + JSON.stringify(unitMap, null, 2));
	    }
	    return new BigNumber(unitValue, 10);
	};
	
	/**
	 * Takes a number of wei and converts it to any other ether unit.
	 *
	 * Possible units are:
	 *   SI Short   SI Full        Effigy       Other
	 * - kwei       femtoether     ada
	 * - mwei       picoether      babbage
	 * - gwei       nanoether      shannon      nano
	 * - --         microether     szabo        micro
	 * - --         milliether     finney       milli
	 * - ether      --             --
	 * - kether                    einstein     grand
	 * - mether
	 * - gether
	 * - tether
	 *
	 * @method fromWei
	 * @param {Number|String} number can be a number, number string or a HEX of a decimal
	 * @param {String} unit the unit to convert to, default ether
	 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
	*/
	var fromWei = function(number, unit) {
	    var returnValue = toBigNumber(number).dividedBy(getValueOfUnit(unit));
	
	    return isBigNumber(number) ? returnValue : returnValue.toString(10);
	};
	
	/**
	 * Takes a number of a unit and converts it to wei.
	 *
	 * Possible units are:
	 *   SI Short   SI Full        Effigy       Other
	 * - kwei       femtoether     ada
	 * - mwei       picoether      babbage
	 * - gwei       nanoether      shannon      nano
	 * - --         microether     szabo        micro
	 * - --         milliether     finney       milli
	 * - ether      --             --
	 * - kether                    einstein     grand
	 * - mether
	 * - gether
	 * - tether
	 *
	 * @method toWei
	 * @param {Number|String|BigNumber} number can be a number, number string or a HEX of a decimal
	 * @param {String} unit the unit to convert from, default ether
	 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
	*/
	var toWei = function(number, unit) {
	    var returnValue = toBigNumber(number).times(getValueOfUnit(unit));
	
	    return isBigNumber(number) ? returnValue : returnValue.toString(10);
	};
	
	/**
	 * Takes an input and transforms it into an bignumber
	 *
	 * @method toBigNumber
	 * @param {Number|String|BigNumber} a number, string, HEX string or BigNumber
	 * @return {BigNumber} BigNumber
	*/
	var toBigNumber = function(number) {
	    /*jshint maxcomplexity:5 */
	    number = number || 0;
	    if (isBigNumber(number))
	        return number;
	
	    if (isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
	        return new BigNumber(number.replace('0x',''), 16);
	    }
	
	    return new BigNumber(number.toString(10), 10);
	};
	
	/**
	 * Takes and input transforms it into bignumber and if it is negative value, into two's complement
	 *
	 * @method toTwosComplement
	 * @param {Number|String|BigNumber}
	 * @return {BigNumber}
	 */
	var toTwosComplement = function (number) {
	    var bigNumber = toBigNumber(number);
	    if (bigNumber.lessThan(0)) {
	        return new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(bigNumber).plus(1);
	    }
	    return bigNumber;
	};
	
	/**
	 * Checks if the given string is strictly an address
	 *
	 * @method isStrictAddress
	 * @param {String} address the given HEX adress
	 * @return {Boolean}
	*/
	var isStrictAddress = function (address) {
	    return /^0x[0-9a-f]{40}$/i.test(address);
	};
	
	/**
	 * Checks if the given string is an address
	 *
	 * @method isAddress
	 * @param {String} address the given HEX adress
	 * @return {Boolean}
	*/
	var isAddress = function (address) {
	    return /^(0x)?[0-9a-f]{40}$/i.test(address);
	};
	
	/**
	 * Transforms given string to valid 20 bytes-length addres with 0x prefix
	 *
	 * @method toAddress
	 * @param {String} address
	 * @return {String} formatted address
	 */
	var toAddress = function (address) {
	    if (isStrictAddress(address)) {
	        return address;
	    }
	
	    if (/^[0-9a-f]{40}$/.test(address)) {
	        return '0x' + address;
	    }
	
	    return '0x' + padLeft(toHex(address).substr(2), 40);
	};
	
	/**
	 * Returns true if object is BigNumber, otherwise false
	 *
	 * @method isBigNumber
	 * @param {Object}
	 * @return {Boolean}
	 */
	var isBigNumber = function (object) {
	    return object instanceof BigNumber ||
	        (object && object.constructor && object.constructor.name === 'BigNumber');
	};
	
	/**
	 * Returns true if object is string, otherwise false
	 *
	 * @method isString
	 * @param {Object}
	 * @return {Boolean}
	 */
	var isString = function (object) {
	    return typeof object === 'string' ||
	        (object && object.constructor && object.constructor.name === 'String');
	};
	
	/**
	 * Returns true if object is function, otherwise false
	 *
	 * @method isFunction
	 * @param {Object}
	 * @return {Boolean}
	 */
	var isFunction = function (object) {
	    return typeof object === 'function';
	};
	
	/**
	 * Returns true if object is Objet, otherwise false
	 *
	 * @method isObject
	 * @param {Object}
	 * @return {Boolean}
	 */
	var isObject = function (object) {
	    return typeof object === 'object';
	};
	
	/**
	 * Returns true if object is boolean, otherwise false
	 *
	 * @method isBoolean
	 * @param {Object}
	 * @return {Boolean}
	 */
	var isBoolean = function (object) {
	    return typeof object === 'boolean';
	};
	
	/**
	 * Returns true if object is array, otherwise false
	 *
	 * @method isArray
	 * @param {Object}
	 * @return {Boolean}
	 */
	var isArray = function (object) {
	    return object instanceof Array;
	};
	
	/**
	 * Returns true if given string is valid json object
	 *
	 * @method isJson
	 * @param {String}
	 * @return {Boolean}
	 */
	var isJson = function (str) {
	    try {
	        return !!JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	};
	
	module.exports = {
	    padLeft: padLeft,
	    padRight: padRight,
	    toHex: toHex,
	    toDecimal: toDecimal,
	    fromDecimal: fromDecimal,
	    toUtf8: toUtf8,
	    toAscii: toAscii,
	    fromUtf8: fromUtf8,
	    fromAscii: fromAscii,
	    transformToFullName: transformToFullName,
	    extractDisplayName: extractDisplayName,
	    extractTypeName: extractTypeName,
	    toWei: toWei,
	    fromWei: fromWei,
	    toBigNumber: toBigNumber,
	    toTwosComplement: toTwosComplement,
	    toAddress: toAddress,
	    isBigNumber: isBigNumber,
	    isStrictAddress: isStrictAddress,
	    isAddress: isAddress,
	    isFunction: isFunction,
	    isString: isString,
	    isObject: isObject,
	    isBoolean: isBoolean,
	    isArray: isArray,
	    isJson: isJson
	};


/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file formatters.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var BigNumber = __webpack_require__(45);
	var utils = __webpack_require__(8);
	var c = __webpack_require__(59);
	var SolidityParam = __webpack_require__(158);
	
	
	/**
	 * Formats input value to byte representation of int
	 * If value is negative, return it's two's complement
	 * If the value is floating point, round it down
	 *
	 * @method formatInputInt
	 * @param {String|Number|BigNumber} value that needs to be formatted
	 * @returns {SolidityParam}
	 */
	var formatInputInt = function (value) {
	    BigNumber.config(c.ETH_BIGNUMBER_ROUNDING_MODE);
	    var result = utils.padLeft(utils.toTwosComplement(value).round().toString(16), 64);
	    return new SolidityParam(result);
	};
	
	/**
	 * Formats input bytes
	 *
	 * @method formatInputBytes
	 * @param {String}
	 * @returns {SolidityParam}
	 */
	var formatInputBytes = function (value) {
	    var result = utils.toHex(value).substr(2);
	    var l = Math.floor((result.length + 63) / 64);
	    result = utils.padRight(result, l * 64);
	    return new SolidityParam(result);
	};
	
	/**
	 * Formats input bytes
	 *
	 * @method formatDynamicInputBytes
	 * @param {String}
	 * @returns {SolidityParam}
	 */
	var formatInputDynamicBytes = function (value) {
	    var result = utils.toHex(value).substr(2);
	    var length = result.length / 2;
	    var l = Math.floor((result.length + 63) / 64);
	    result = utils.padRight(result, l * 64);
	    return new SolidityParam(formatInputInt(length).value + result);
	};
	
	/**
	 * Formats input value to byte representation of string
	 *
	 * @method formatInputString
	 * @param {String}
	 * @returns {SolidityParam}
	 */
	var formatInputString = function (value) {
	    var result = utils.fromUtf8(value).substr(2);
	    var length = result.length / 2;
	    var l = Math.floor((result.length + 63) / 64);
	    result = utils.padRight(result, l * 64);
	    return new SolidityParam(formatInputInt(length).value + result);
	};
	
	/**
	 * Formats input value to byte representation of bool
	 *
	 * @method formatInputBool
	 * @param {Boolean}
	 * @returns {SolidityParam}
	 */
	var formatInputBool = function (value) {
	    var result = '000000000000000000000000000000000000000000000000000000000000000' + (value ?  '1' : '0');
	    return new SolidityParam(result);
	};
	
	/**
	 * Formats input value to byte representation of real
	 * Values are multiplied by 2^m and encoded as integers
	 *
	 * @method formatInputReal
	 * @param {String|Number|BigNumber}
	 * @returns {SolidityParam}
	 */
	var formatInputReal = function (value) {
	    return formatInputInt(new BigNumber(value).times(new BigNumber(2).pow(128)));
	};
	
	/**
	 * Check if input value is negative
	 *
	 * @method signedIsNegative
	 * @param {String} value is hex format
	 * @returns {Boolean} true if it is negative, otherwise false
	 */
	var signedIsNegative = function (value) {
	    return (new BigNumber(value.substr(0, 1), 16).toString(2).substr(0, 1)) === '1';
	};
	
	/**
	 * Formats right-aligned output bytes to int
	 *
	 * @method formatOutputInt
	 * @param {SolidityParam} param
	 * @returns {BigNumber} right-aligned output bytes formatted to big number
	 */
	var formatOutputInt = function (param) {
	    var value = param.staticPart() || "0";
	
	    // check if it's negative number
	    // it it is, return two's complement
	    if (signedIsNegative(value)) {
	        return new BigNumber(value, 16).minus(new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)).minus(1);
	    }
	    return new BigNumber(value, 16);
	};
	
	/**
	 * Formats right-aligned output bytes to uint
	 *
	 * @method formatOutputUInt
	 * @param {SolidityParam}
	 * @returns {BigNumeber} right-aligned output bytes formatted to uint
	 */
	var formatOutputUInt = function (param) {
	    var value = param.staticPart() || "0";
	    return new BigNumber(value, 16);
	};
	
	/**
	 * Formats right-aligned output bytes to real
	 *
	 * @method formatOutputReal
	 * @param {SolidityParam}
	 * @returns {BigNumber} input bytes formatted to real
	 */
	var formatOutputReal = function (param) {
	    return formatOutputInt(param).dividedBy(new BigNumber(2).pow(128)); 
	};
	
	/**
	 * Formats right-aligned output bytes to ureal
	 *
	 * @method formatOutputUReal
	 * @param {SolidityParam}
	 * @returns {BigNumber} input bytes formatted to ureal
	 */
	var formatOutputUReal = function (param) {
	    return formatOutputUInt(param).dividedBy(new BigNumber(2).pow(128)); 
	};
	
	/**
	 * Should be used to format output bool
	 *
	 * @method formatOutputBool
	 * @param {SolidityParam}
	 * @returns {Boolean} right-aligned input bytes formatted to bool
	 */
	var formatOutputBool = function (param) {
	    return param.staticPart() === '0000000000000000000000000000000000000000000000000000000000000001' ? true : false;
	};
	
	/**
	 * Should be used to format output bytes
	 *
	 * @method formatOutputBytes
	 * @param {SolidityParam} left-aligned hex representation of string
	 * @returns {String} hex string
	 */
	var formatOutputBytes = function (param) {
	    return '0x' + param.staticPart();
	};
	
	/**
	 * Should be used to format output bytes
	 *
	 * @method formatOutputDynamicBytes
	 * @param {SolidityParam} left-aligned hex representation of string
	 * @returns {String} hex string
	 */
	var formatOutputDynamicBytes = function (param) {
	    var length = (new BigNumber(param.dynamicPart().slice(0, 64), 16)).toNumber() * 2;
	    return '0x' + param.dynamicPart().substr(64, length);
	};
	
	/**
	 * Should be used to format output string
	 *
	 * @method formatOutputString
	 * @param {SolidityParam} left-aligned hex representation of string
	 * @returns {String} ascii string
	 */
	var formatOutputString = function (param) {
	    var length = (new BigNumber(param.dynamicPart().slice(0, 64), 16)).toNumber() * 2;
	    return utils.toUtf8(param.dynamicPart().substr(64, length));
	};
	
	/**
	 * Should be used to format output address
	 *
	 * @method formatOutputAddress
	 * @param {SolidityParam} right-aligned input bytes
	 * @returns {String} address
	 */
	var formatOutputAddress = function (param) {
	    var value = param.staticPart();
	    return "0x" + value.slice(value.length - 40, value.length);
	};
	
	module.exports = {
	    formatInputInt: formatInputInt,
	    formatInputBytes: formatInputBytes,
	    formatInputDynamicBytes: formatInputDynamicBytes,
	    formatInputString: formatInputString,
	    formatInputBool: formatInputBool,
	    formatInputReal: formatInputReal,
	    formatOutputInt: formatOutputInt,
	    formatOutputUInt: formatOutputUInt,
	    formatOutputReal: formatOutputReal,
	    formatOutputUReal: formatOutputUReal,
	    formatOutputBool: formatOutputBool,
	    formatOutputBytes: formatOutputBytes,
	    formatOutputDynamicBytes: formatOutputDynamicBytes,
	    formatOutputString: formatOutputString,
	    formatOutputAddress: formatOutputAddress
	};
	


/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityParam = __webpack_require__(158);
	
	/**
	 * SolidityType prototype is used to encode/decode solidity params of certain type
	 */
	var SolidityType = function (config) {
	    this._inputFormatter = config.inputFormatter;
	    this._outputFormatter = config.outputFormatter;
	};
	
	/**
	 * Should be used to determine if this SolidityType do match given name
	 *
	 * @method isType
	 * @param {String} name
	 * @return {Bool} true if type match this SolidityType, otherwise false
	 */
	SolidityType.prototype.isType = function (name) {
	    throw "this method should be overrwritten for type " + name;
	};
	
	/**
	 * Should be used to determine what is the length of static part in given type
	 *
	 * @method staticPartLength
	 * @param {String} name
	 * @return {Number} length of static part in bytes
	 */
	SolidityType.prototype.staticPartLength = function (name) {
	    throw "this method should be overrwritten for type: " + name;
	};
	
	/**
	 * Should be used to determine if type is dynamic array
	 * eg: 
	 * "type[]" => true
	 * "type[4]" => false
	 *
	 * @method isDynamicArray
	 * @param {String} name
	 * @return {Bool} true if the type is dynamic array 
	 */
	SolidityType.prototype.isDynamicArray = function (name) {
	    var nestedTypes = this.nestedTypes(name);
	    return !!nestedTypes && !nestedTypes[nestedTypes.length - 1].match(/[0-9]{1,}/g);
	};
	
	/**
	 * Should be used to determine if type is static array
	 * eg: 
	 * "type[]" => false
	 * "type[4]" => true
	 *
	 * @method isStaticArray
	 * @param {String} name
	 * @return {Bool} true if the type is static array 
	 */
	SolidityType.prototype.isStaticArray = function (name) {
	    var nestedTypes = this.nestedTypes(name);
	    return !!nestedTypes && !!nestedTypes[nestedTypes.length - 1].match(/[0-9]{1,}/g);
	};
	
	/**
	 * Should return length of static array
	 * eg. 
	 * "int[32]" => 32
	 * "int256[14]" => 14
	 * "int[2][3]" => 3
	 * "int" => 1
	 * "int[1]" => 1
	 * "int[]" => 1
	 *
	 * @method staticArrayLength
	 * @param {String} name
	 * @return {Number} static array length
	 */
	SolidityType.prototype.staticArrayLength = function (name) {
	    var nestedTypes = this.nestedTypes(name);
	    if (nestedTypes) {
	       return parseInt(nestedTypes[nestedTypes.length - 1].match(/[0-9]{1,}/g) || 1);
	    }
	    return 1;
	};
	
	/**
	 * Should return nested type
	 * eg.
	 * "int[32]" => "int"
	 * "int256[14]" => "int256"
	 * "int[2][3]" => "int[2]"
	 * "int" => "int"
	 * "int[]" => "int"
	 *
	 * @method nestedName
	 * @param {String} name
	 * @return {String} nested name
	 */
	SolidityType.prototype.nestedName = function (name) {
	    // remove last [] in name
	    var nestedTypes = this.nestedTypes(name);
	    if (!nestedTypes) {
	        return name;
	    }
	
	    return name.substr(0, name.length - nestedTypes[nestedTypes.length - 1].length);
	};
	
	/**
	 * Should return true if type has dynamic size by default
	 * such types are "string", "bytes"
	 *
	 * @method isDynamicType
	 * @param {String} name
	 * @return {Bool} true if is dynamic, otherwise false
	 */
	SolidityType.prototype.isDynamicType = function () {
	    return false;
	};
	
	/**
	 * Should return array of nested types
	 * eg.
	 * "int[2][3][]" => ["[2]", "[3]", "[]"]
	 * "int[] => ["[]"]
	 * "int" => null
	 *
	 * @method nestedTypes
	 * @param {String} name
	 * @return {Array} array of nested types
	 */
	SolidityType.prototype.nestedTypes = function (name) {
	    // return list of strings eg. "[]", "[3]", "[]", "[2]"
	    return name.match(/(\[[0-9]*\])/g);
	};
	
	/**
	 * Should be used to encode the value
	 *
	 * @method encode
	 * @param {Object} value 
	 * @param {String} name
	 * @return {String} encoded value
	 */
	SolidityType.prototype.encode = function (value, name) {
	    var self = this;
	    if (this.isDynamicArray(name)) {
	
	        return (function () {
	            var length = value.length;                          // in int
	            var nestedName = self.nestedName(name);
	
	            var result = [];
	            result.push(f.formatInputInt(length).encode());
	            
	            value.forEach(function (v) {
	                result.push(self.encode(v, nestedName));
	            });
	
	            return result;
	        })();
	
	    } else if (this.isStaticArray(name)) {
	
	        return (function () {
	            var length = self.staticArrayLength(name);          // in int
	            var nestedName = self.nestedName(name);
	
	            var result = [];
	            for (var i = 0; i < length; i++) {
	                result.push(self.encode(value[i], nestedName));
	            }
	
	            return result;
	        })();
	
	    }
	
	    return this._inputFormatter(value, name).encode();
	};
	
	/**
	 * Should be used to decode value from bytes
	 *
	 * @method decode
	 * @param {String} bytes
	 * @param {Number} offset in bytes
	 * @param {String} name type name
	 * @returns {Object} decoded value
	 */
	SolidityType.prototype.decode = function (bytes, offset, name) {
	    var self = this;
	
	    if (this.isDynamicArray(name)) {
	
	        return (function () {
	            var arrayOffset = parseInt('0x' + bytes.substr(offset * 2, 64)); // in bytes
	            var length = parseInt('0x' + bytes.substr(arrayOffset * 2, 64)); // in int
	            var arrayStart = arrayOffset + 32; // array starts after length; // in bytes
	
	            var nestedName = self.nestedName(name);
	            var nestedStaticPartLength = self.staticPartLength(nestedName);  // in bytes
	            var roundedNestedStaticPartLength = Math.floor((nestedStaticPartLength + 31) / 32) * 32;
	            var result = [];
	
	            for (var i = 0; i < length * roundedNestedStaticPartLength; i += roundedNestedStaticPartLength) {
	                result.push(self.decode(bytes, arrayStart + i, nestedName));
	            }
	
	            return result;
	        })();
	
	    } else if (this.isStaticArray(name)) {
	
	        return (function () {
	            var length = self.staticArrayLength(name);                      // in int
	            var arrayStart = offset;                                        // in bytes
	
	            var nestedName = self.nestedName(name);
	            var nestedStaticPartLength = self.staticPartLength(nestedName); // in bytes
	            var roundedNestedStaticPartLength = Math.floor((nestedStaticPartLength + 31) / 32) * 32;
	            var result = [];
	
	            for (var i = 0; i < length * roundedNestedStaticPartLength; i += roundedNestedStaticPartLength) {
	                result.push(self.decode(bytes, arrayStart + i, nestedName));
	            }
	
	            return result;
	        })();
	    } else if (this.isDynamicType(name)) {
	        
	        return (function () {
	            var dynamicOffset = parseInt('0x' + bytes.substr(offset * 2, 64));      // in bytes
	            var length = parseInt('0x' + bytes.substr(dynamicOffset * 2, 64));      // in bytes
	            var roundedLength = Math.floor((length + 31) / 32);                     // in int
	        
	            return self._outputFormatter(new SolidityParam(bytes.substr(dynamicOffset * 2, ( 1 + roundedLength) * 64), 0));
	        })();
	    }
	
	    var length = this.staticPartLength(name);
	    return this._outputFormatter(new SolidityParam(bytes.substr(offset * 2, length * 2)));
	};
	
	module.exports = SolidityType;


/***/ },
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file formatters.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @author Fabian Vogelsteller <fabian@ethdev.com>
	 * @date 2015
	 */
	
	var utils = __webpack_require__(8);
	var config = __webpack_require__(59);
	var Iban = __webpack_require__(62);
	
	/**
	 * Should the format output to a big number
	 *
	 * @method outputBigNumberFormatter
	 * @param {String|Number|BigNumber}
	 * @returns {BigNumber} object
	 */
	var outputBigNumberFormatter = function (number) {
	    return utils.toBigNumber(number);
	};
	
	var isPredefinedBlockNumber = function (blockNumber) {
	    return blockNumber === 'latest' || blockNumber === 'pending' || blockNumber === 'earliest';
	};
	
	var inputDefaultBlockNumberFormatter = function (blockNumber) {
	    if (blockNumber === undefined) {
	        return config.defaultBlock;
	    }
	    return inputBlockNumberFormatter(blockNumber);
	};
	
	var inputBlockNumberFormatter = function (blockNumber) {
	    if (blockNumber === undefined) {
	        return undefined;
	    } else if (isPredefinedBlockNumber(blockNumber)) {
	        return blockNumber;
	    }
	    return utils.toHex(blockNumber);
	};
	
	/**
	 * Formats the input of a transaction and converts all values to HEX
	 *
	 * @method inputCallFormatter
	 * @param {Object} transaction options
	 * @returns object
	*/
	var inputCallFormatter = function (options){
	
	    options.from = options.from || config.defaultAccount;
	
	    if (options.from) {
	        options.from = inputAddressFormatter(options.from);
	    }
	
	    if (options.to) { // it might be contract creation
	        options.to = inputAddressFormatter(options.to);
	    }
	
	    ['gasPrice', 'gas', 'value', 'nonce'].filter(function (key) {
	        return options[key] !== undefined;
	    }).forEach(function(key){
	        options[key] = utils.fromDecimal(options[key]);
	    });
	
	    return options; 
	};
	
	/**
	 * Formats the input of a transaction and converts all values to HEX
	 *
	 * @method inputTransactionFormatter
	 * @param {Object} transaction options
	 * @returns object
	*/
	var inputTransactionFormatter = function (options){
	
	    options.from = options.from || config.defaultAccount;
	    options.from = inputAddressFormatter(options.from);
	
	    if (options.to) { // it might be contract creation
	        options.to = inputAddressFormatter(options.to);
	    }
	
	    ['gasPrice', 'gas', 'value', 'nonce'].filter(function (key) {
	        return options[key] !== undefined;
	    }).forEach(function(key){
	        options[key] = utils.fromDecimal(options[key]);
	    });
	
	    return options; 
	};
	
	/**
	 * Formats the output of a transaction to its proper values
	 * 
	 * @method outputTransactionFormatter
	 * @param {Object} tx
	 * @returns {Object}
	*/
	var outputTransactionFormatter = function (tx){
	    if(tx.blockNumber !== null)
	        tx.blockNumber = utils.toDecimal(tx.blockNumber);
	    if(tx.transactionIndex !== null)
	        tx.transactionIndex = utils.toDecimal(tx.transactionIndex);
	    tx.nonce = utils.toDecimal(tx.nonce);
	    tx.gas = utils.toDecimal(tx.gas);
	    tx.gasPrice = utils.toBigNumber(tx.gasPrice);
	    tx.value = utils.toBigNumber(tx.value);
	    return tx;
	};
	
	/**
	 * Formats the output of a transaction receipt to its proper values
	 * 
	 * @method outputTransactionReceiptFormatter
	 * @param {Object} receipt
	 * @returns {Object}
	*/
	var outputTransactionReceiptFormatter = function (receipt){
	    if(receipt.blockNumber !== null)
	        receipt.blockNumber = utils.toDecimal(receipt.blockNumber);
	    if(receipt.transactionIndex !== null)
	        receipt.transactionIndex = utils.toDecimal(receipt.transactionIndex);
	    receipt.cumulativeGasUsed = utils.toDecimal(receipt.cumulativeGasUsed);
	    receipt.gasUsed = utils.toDecimal(receipt.gasUsed);
	
	    if(utils.isArray(receipt.logs)) {
	        receipt.logs = receipt.logs.map(function(log){
	            return outputLogFormatter(log);
	        });
	    }
	
	    return receipt;
	};
	
	/**
	 * Formats the output of a block to its proper values
	 *
	 * @method outputBlockFormatter
	 * @param {Object} block 
	 * @returns {Object}
	*/
	var outputBlockFormatter = function(block) {
	
	    // transform to number
	    block.gasLimit = utils.toDecimal(block.gasLimit);
	    block.gasUsed = utils.toDecimal(block.gasUsed);
	    block.size = utils.toDecimal(block.size);
	    block.timestamp = utils.toDecimal(block.timestamp);
	    if(block.number !== null)
	        block.number = utils.toDecimal(block.number);
	
	    block.difficulty = utils.toBigNumber(block.difficulty);
	    block.totalDifficulty = utils.toBigNumber(block.totalDifficulty);
	
	    if (utils.isArray(block.transactions)) {
	        block.transactions.forEach(function(item){
	            if(!utils.isString(item))
	                return outputTransactionFormatter(item);
	        });
	    }
	
	    return block;
	};
	
	/**
	 * Formats the output of a log
	 * 
	 * @method outputLogFormatter
	 * @param {Object} log object
	 * @returns {Object} log
	*/
	var outputLogFormatter = function(log) {
	    if(log.blockNumber !== null)
	        log.blockNumber = utils.toDecimal(log.blockNumber);
	    if(log.transactionIndex !== null)
	        log.transactionIndex = utils.toDecimal(log.transactionIndex);
	    if(log.logIndex !== null)
	        log.logIndex = utils.toDecimal(log.logIndex);
	
	    return log;
	};
	
	/**
	 * Formats the input of a whisper post and converts all values to HEX
	 *
	 * @method inputPostFormatter
	 * @param {Object} transaction object
	 * @returns {Object}
	*/
	var inputPostFormatter = function(post) {
	
	    post.payload = utils.toHex(post.payload);
	    post.ttl = utils.fromDecimal(post.ttl);
	    post.workToProve = utils.fromDecimal(post.workToProve);
	    post.priority = utils.fromDecimal(post.priority);
	
	    // fallback
	    if (!utils.isArray(post.topics)) {
	        post.topics = post.topics ? [post.topics] : [];
	    }
	
	    // format the following options
	    post.topics = post.topics.map(function(topic){
	        return utils.fromUtf8(topic);
	    });
	
	    return post; 
	};
	
	/**
	 * Formats the output of a received post message
	 *
	 * @method outputPostFormatter
	 * @param {Object}
	 * @returns {Object}
	 */
	var outputPostFormatter = function(post){
	
	    post.expiry = utils.toDecimal(post.expiry);
	    post.sent = utils.toDecimal(post.sent);
	    post.ttl = utils.toDecimal(post.ttl);
	    post.workProved = utils.toDecimal(post.workProved);
	    post.payloadRaw = post.payload;
	    post.payload = utils.toUtf8(post.payload);
	
	    if (utils.isJson(post.payload)) {
	        post.payload = JSON.parse(post.payload);
	    }
	
	    // format the following options
	    if (!post.topics) {
	        post.topics = [];
	    }
	    post.topics = post.topics.map(function(topic){
	        return utils.toUtf8(topic);
	    });
	
	    return post;
	};
	
	var inputAddressFormatter = function (address) {
	    var iban = new Iban(address);
	    if (iban.isValid() && iban.isDirect()) {
	        return '0x' + iban.address();
	    } else if (utils.isStrictAddress(address)) {
	        return address;
	    } else if (utils.isAddress(address)) {
	        return '0x' + address;
	    }
	    throw 'invalid address';
	};
	
	
	var outputSyncingFormatter = function(result) {
	
	    result.startingBlock = utils.toDecimal(result.startingBlock);
	    result.currentBlock = utils.toDecimal(result.currentBlock);
	    result.highestBlock = utils.toDecimal(result.highestBlock);
	
	    return result;
	};
	
	module.exports = {
	    inputDefaultBlockNumberFormatter: inputDefaultBlockNumberFormatter,
	    inputBlockNumberFormatter: inputBlockNumberFormatter,
	    inputCallFormatter: inputCallFormatter,
	    inputTransactionFormatter: inputTransactionFormatter,
	    inputAddressFormatter: inputAddressFormatter,
	    inputPostFormatter: inputPostFormatter,
	    outputBigNumberFormatter: outputBigNumberFormatter,
	    outputTransactionFormatter: outputTransactionFormatter,
	    outputTransactionReceiptFormatter: outputTransactionReceiptFormatter,
	    outputBlockFormatter: outputBlockFormatter,
	    outputLogFormatter: outputLogFormatter,
	    outputPostFormatter: outputPostFormatter,
	    outputSyncingFormatter: outputSyncingFormatter
	};
	


/***/ },
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var C_enc = C.enc;
	
		    /**
		     * Base64 encoding strategy.
		     */
		    var Base64 = C_enc.Base64 = {
		        /**
		         * Converts a word array to a Base64 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The Base64 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
		            var map = this._map;
	
		            // Clamp excess bits
		            wordArray.clamp();
	
		            // Convert
		            var base64Chars = [];
		            for (var i = 0; i < sigBytes; i += 3) {
		                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
		                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
		                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
	
		                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;
	
		                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
		                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
		                }
		            }
	
		            // Add padding
		            var paddingChar = map.charAt(64);
		            if (paddingChar) {
		                while (base64Chars.length % 4) {
		                    base64Chars.push(paddingChar);
		                }
		            }
	
		            return base64Chars.join('');
		        },
	
		        /**
		         * Converts a Base64 string to a word array.
		         *
		         * @param {string} base64Str The Base64 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
		         */
		        parse: function (base64Str) {
		            // Shortcuts
		            var base64StrLength = base64Str.length;
		            var map = this._map;
	
		            // Ignore padding
		            var paddingChar = map.charAt(64);
		            if (paddingChar) {
		                var paddingIndex = base64Str.indexOf(paddingChar);
		                if (paddingIndex != -1) {
		                    base64StrLength = paddingIndex;
		                }
		            }
	
		            // Convert
		            var words = [];
		            var nBytes = 0;
		            for (var i = 0; i < base64StrLength; i++) {
		                if (i % 4) {
		                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
		                    var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
		                    words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
		                    nBytes++;
		                }
		            }
	
		            return WordArray.create(words, nBytes);
		        },
	
		        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
		    };
		}());
	
	
		return CryptoJS.enc.Base64;
	
	}));

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(69), __webpack_require__(68));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./sha1", "./hmac"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var WordArray = C_lib.WordArray;
		    var C_algo = C.algo;
		    var MD5 = C_algo.MD5;
	
		    /**
		     * This key derivation function is meant to conform with EVP_BytesToKey.
		     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
		     */
		    var EvpKDF = C_algo.EvpKDF = Base.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
		         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
		         * @property {number} iterations The number of iterations to perform. Default: 1
		         */
		        cfg: Base.extend({
		            keySize: 128/32,
		            hasher: MD5,
		            iterations: 1
		        }),
	
		        /**
		         * Initializes a newly created key derivation function.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
		         *
		         * @example
		         *
		         *     var kdf = CryptoJS.algo.EvpKDF.create();
		         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
		         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
		         */
		        init: function (cfg) {
		            this.cfg = this.cfg.extend(cfg);
		        },
	
		        /**
		         * Derives a key from a password.
		         *
		         * @param {WordArray|string} password The password.
		         * @param {WordArray|string} salt A salt.
		         *
		         * @return {WordArray} The derived key.
		         *
		         * @example
		         *
		         *     var key = kdf.compute(password, salt);
		         */
		        compute: function (password, salt) {
		            // Shortcut
		            var cfg = this.cfg;
	
		            // Init hasher
		            var hasher = cfg.hasher.create();
	
		            // Initial values
		            var derivedKey = WordArray.create();
	
		            // Shortcuts
		            var derivedKeyWords = derivedKey.words;
		            var keySize = cfg.keySize;
		            var iterations = cfg.iterations;
	
		            // Generate key
		            while (derivedKeyWords.length < keySize) {
		                if (block) {
		                    hasher.update(block);
		                }
		                var block = hasher.update(password).finalize(salt);
		                hasher.reset();
	
		                // Iterations
		                for (var i = 1; i < iterations; i++) {
		                    block = hasher.finalize(block);
		                    hasher.reset();
		                }
	
		                derivedKey.concat(block);
		            }
		            derivedKey.sigBytes = keySize * 4;
	
		            return derivedKey;
		        }
		    });
	
		    /**
		     * Derives a key from a password.
		     *
		     * @param {WordArray|string} password The password.
		     * @param {WordArray|string} salt A salt.
		     * @param {Object} cfg (Optional) The configuration options to use for this computation.
		     *
		     * @return {WordArray} The derived key.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var key = CryptoJS.EvpKDF(password, salt);
		     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
		     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
		     */
		    C.EvpKDF = function (password, salt, cfg) {
		        return EvpKDF.create(cfg).compute(password, salt);
		    };
		}());
	
	
		return CryptoJS.EvpKDF;
	
	}));

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Constants table
		    var T = [];
	
		    // Compute constants
		    (function () {
		        for (var i = 0; i < 64; i++) {
		            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
		        }
		    }());
	
		    /**
		     * MD5 hash algorithm.
		     */
		    var MD5 = C_algo.MD5 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init([
		                0x67452301, 0xefcdab89,
		                0x98badcfe, 0x10325476
		            ]);
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Swap endian
		            for (var i = 0; i < 16; i++) {
		                // Shortcuts
		                var offset_i = offset + i;
		                var M_offset_i = M[offset_i];
	
		                M[offset_i] = (
		                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
		                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
		                );
		            }
	
		            // Shortcuts
		            var H = this._hash.words;
	
		            var M_offset_0  = M[offset + 0];
		            var M_offset_1  = M[offset + 1];
		            var M_offset_2  = M[offset + 2];
		            var M_offset_3  = M[offset + 3];
		            var M_offset_4  = M[offset + 4];
		            var M_offset_5  = M[offset + 5];
		            var M_offset_6  = M[offset + 6];
		            var M_offset_7  = M[offset + 7];
		            var M_offset_8  = M[offset + 8];
		            var M_offset_9  = M[offset + 9];
		            var M_offset_10 = M[offset + 10];
		            var M_offset_11 = M[offset + 11];
		            var M_offset_12 = M[offset + 12];
		            var M_offset_13 = M[offset + 13];
		            var M_offset_14 = M[offset + 14];
		            var M_offset_15 = M[offset + 15];
	
		            // Working varialbes
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
	
		            // Computation
		            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
		            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
		            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
		            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
		            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
		            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
		            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
		            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
		            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
		            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
		            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
		            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
		            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
		            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
		            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
		            b = FF(b, c, d, a, M_offset_15, 22, T[15]);
	
		            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
		            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
		            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
		            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
		            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
		            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
		            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
		            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
		            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
		            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
		            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
		            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
		            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
		            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
		            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
		            b = GG(b, c, d, a, M_offset_12, 20, T[31]);
	
		            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
		            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
		            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
		            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
		            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
		            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
		            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
		            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
		            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
		            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
		            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
		            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
		            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
		            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
		            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
		            b = HH(b, c, d, a, M_offset_2,  23, T[47]);
	
		            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
		            d = II(d, a, b, c, M_offset_7,  10, T[49]);
		            c = II(c, d, a, b, M_offset_14, 15, T[50]);
		            b = II(b, c, d, a, M_offset_5,  21, T[51]);
		            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
		            d = II(d, a, b, c, M_offset_3,  10, T[53]);
		            c = II(c, d, a, b, M_offset_10, 15, T[54]);
		            b = II(b, c, d, a, M_offset_1,  21, T[55]);
		            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
		            d = II(d, a, b, c, M_offset_15, 10, T[57]);
		            c = II(c, d, a, b, M_offset_6,  15, T[58]);
		            b = II(b, c, d, a, M_offset_13, 21, T[59]);
		            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
		            d = II(d, a, b, c, M_offset_11, 10, T[61]);
		            c = II(c, d, a, b, M_offset_2,  15, T[62]);
		            b = II(b, c, d, a, M_offset_9,  21, T[63]);
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	
		            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
		            var nBitsTotalL = nBitsTotal;
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
		                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
		            );
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
		                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
		            );
	
		            data.sigBytes = (dataWords.length + 1) * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Shortcuts
		            var hash = this._hash;
		            var H = hash.words;
	
		            // Swap endian
		            for (var i = 0; i < 4; i++) {
		                // Shortcut
		                var H_i = H[i];
	
		                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
		                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
		            }
	
		            // Return final computed hash
		            return hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    function FF(a, b, c, d, x, s, t) {
		        var n = a + ((b & c) | (~b & d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function GG(a, b, c, d, x, s, t) {
		        var n = a + ((b & d) | (c & ~d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function HH(a, b, c, d, x, s, t) {
		        var n = a + (b ^ c ^ d) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function II(a, b, c, d, x, s, t) {
		        var n = a + (c ^ (b | ~d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.MD5('message');
		     *     var hash = CryptoJS.MD5(wordArray);
		     */
		    C.MD5 = Hasher._createHelper(MD5);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacMD5(message, key);
		     */
		    C.HmacMD5 = Hasher._createHmacHelper(MD5);
		}(Math));
	
	
		return CryptoJS.MD5;
	
	}));

/***/ },
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */
/***/ function(module, exports) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file errors.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	module.exports = {
	    InvalidNumberOfParams: function () {
	        return new Error('Invalid number of input parameters');
	    },
	    InvalidConnection: function (host){
	        return new Error('CONNECTION ERROR: Couldn\'t connect to node '+ host +'.');
	    },
	    InvalidProvider: function () {
	        return new Error('Provider not set or invalid');
	    },
	    InvalidResponse: function (result){
	        var message = !!result && !!result.error && !!result.error.message ? result.error.message : 'Invalid JSON RPC response: ' + JSON.stringify(result);
	        return new Error(message);
	    }
	};
	


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/**
	 * @file method.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var utils = __webpack_require__(8);
	var errors = __webpack_require__(41);
	
	var Method = function (options) {
	    this.name = options.name;
	    this.call = options.call;
	    this.params = options.params || 0;
	    this.inputFormatter = options.inputFormatter;
	    this.outputFormatter = options.outputFormatter;
	    this.requestManager = null;
	};
	
	Method.prototype.setRequestManager = function (rm) {
	    this.requestManager = rm;
	};
	
	/**
	 * Should be used to determine name of the jsonrpc method based on arguments
	 *
	 * @method getCall
	 * @param {Array} arguments
	 * @return {String} name of jsonrpc method
	 */
	Method.prototype.getCall = function (args) {
	    return utils.isFunction(this.call) ? this.call(args) : this.call;
	};
	
	/**
	 * Should be used to extract callback from array of arguments. Modifies input param
	 *
	 * @method extractCallback
	 * @param {Array} arguments
	 * @return {Function|Null} callback, if exists
	 */
	Method.prototype.extractCallback = function (args) {
	    if (utils.isFunction(args[args.length - 1])) {
	        return args.pop(); // modify the args array!
	    }
	};
	
	/**
	 * Should be called to check if the number of arguments is correct
	 * 
	 * @method validateArgs
	 * @param {Array} arguments
	 * @throws {Error} if it is not
	 */
	Method.prototype.validateArgs = function (args) {
	    if (args.length !== this.params) {
	        throw errors.InvalidNumberOfParams();
	    }
	};
	
	/**
	 * Should be called to format input args of method
	 * 
	 * @method formatInput
	 * @param {Array}
	 * @return {Array}
	 */
	Method.prototype.formatInput = function (args) {
	    if (!this.inputFormatter) {
	        return args;
	    }
	
	    return this.inputFormatter.map(function (formatter, index) {
	        return formatter ? formatter(args[index]) : args[index];
	    });
	};
	
	/**
	 * Should be called to format output(result) of method
	 *
	 * @method formatOutput
	 * @param {Object}
	 * @return {Object}
	 */
	Method.prototype.formatOutput = function (result) {
	    return this.outputFormatter && result ? this.outputFormatter(result) : result;
	};
	
	/**
	 * Should create payload from given input args
	 *
	 * @method toPayload
	 * @param {Array} args
	 * @return {Object}
	 */
	Method.prototype.toPayload = function (args) {
	    var call = this.getCall(args);
	    var callback = this.extractCallback(args);
	    var params = this.formatInput(args);
	    this.validateArgs(params);
	
	    return {
	        method: call,
	        params: params,
	        callback: callback
	    };
	};
	
	Method.prototype.attachToObject = function (obj) {
	    var func = this.buildCall();
	    func.call = this.call; // TODO!!! that's ugly. filter.js uses it
	    var name = this.name.split('.');
	    if (name.length > 1) {
	        obj[name[0]] = obj[name[0]] || {};
	        obj[name[0]][name[1]] = func;
	    } else {
	        obj[name[0]] = func; 
	    }
	};
	
	Method.prototype.buildCall = function() {
	    var method = this;
	    var send = function () {
	        var payload = method.toPayload(Array.prototype.slice.call(arguments));
	        if (payload.callback) {
	            return method.requestManager.sendAsync(payload, function (err, result) {
	                payload.callback(err, method.formatOutput(result));
	            });
	        }
	        return method.formatOutput(method.requestManager.send(payload));
	    };
	    send.request = this.request.bind(this);
	    return send;
	};
	
	/**
	 * Should be called to create pure JSONRPC request which can be used in batch request
	 *
	 * @method request
	 * @param {...} params
	 * @return {Object} jsonrpc request
	 */
	Method.prototype.request = function () {
	    var payload = this.toPayload(Array.prototype.slice.call(arguments));
	    payload.format = this.formatOutput.bind(this);
	    return payload;
	};
	
	module.exports = Method;
	


/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 44 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! bignumber.js v2.0.7 https://github.com/MikeMcl/bignumber.js/LICENCE */
	
	;(function (global) {
	    'use strict';
	
	    /*
	      bignumber.js v2.0.7
	      A JavaScript library for arbitrary-precision arithmetic.
	      https://github.com/MikeMcl/bignumber.js
	      Copyright (c) 2015 Michael Mclaughlin <M8ch88l@gmail.com>
	      MIT Expat Licence
	    */
	
	
	    var BigNumber, crypto, parseNumeric,
	        isNumeric = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
	        mathceil = Math.ceil,
	        mathfloor = Math.floor,
	        notBool = ' not a boolean or binary digit',
	        roundingMode = 'rounding mode',
	        tooManyDigits = 'number type has more than 15 significant digits',
	        ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',
	        BASE = 1e14,
	        LOG_BASE = 14,
	        MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
	        // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
	        POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
	        SQRT_BASE = 1e7,
	
	        /*
	         * The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
	         * the arguments to toExponential, toFixed, toFormat, and toPrecision, beyond which an
	         * exception is thrown (if ERRORS is true).
	         */
	        MAX = 1E9;                                   // 0 to MAX_INT32
	
	
	    /*
	     * Create and return a BigNumber constructor.
	     */
	    function another(configObj) {
	        var div,
	
	            // id tracks the caller function, so its name can be included in error messages.
	            id = 0,
	            P = BigNumber.prototype,
	            ONE = new BigNumber(1),
	
	
	            /********************************* EDITABLE DEFAULTS **********************************/
	
	
	            /*
	             * The default values below must be integers within the inclusive ranges stated.
	             * The values can also be changed at run-time using BigNumber.config.
	             */
	
	            // The maximum number of decimal places for operations involving division.
	            DECIMAL_PLACES = 20,                     // 0 to MAX
	
	            /*
	             * The rounding mode used when rounding to the above decimal places, and when using
	             * toExponential, toFixed, toFormat and toPrecision, and round (default value).
	             * UP         0 Away from zero.
	             * DOWN       1 Towards zero.
	             * CEIL       2 Towards +Infinity.
	             * FLOOR      3 Towards -Infinity.
	             * HALF_UP    4 Towards nearest neighbour. If equidistant, up.
	             * HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
	             * HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
	             * HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
	             * HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
	             */
	            ROUNDING_MODE = 4,                       // 0 to 8
	
	            // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]
	
	            // The exponent value at and beneath which toString returns exponential notation.
	            // Number type: -7
	            TO_EXP_NEG = -7,                         // 0 to -MAX
	
	            // The exponent value at and above which toString returns exponential notation.
	            // Number type: 21
	            TO_EXP_POS = 21,                         // 0 to MAX
	
	            // RANGE : [MIN_EXP, MAX_EXP]
	
	            // The minimum exponent value, beneath which underflow to zero occurs.
	            // Number type: -324  (5e-324)
	            MIN_EXP = -1e7,                          // -1 to -MAX
	
	            // The maximum exponent value, above which overflow to Infinity occurs.
	            // Number type:  308  (1.7976931348623157e+308)
	            // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
	            MAX_EXP = 1e7,                           // 1 to MAX
	
	            // Whether BigNumber Errors are ever thrown.
	            ERRORS = true,                           // true or false
	
	            // Change to intValidatorNoErrors if ERRORS is false.
	            isValidInt = intValidatorWithErrors,     // intValidatorWithErrors/intValidatorNoErrors
	
	            // Whether to use cryptographically-secure random number generation, if available.
	            CRYPTO = false,                          // true or false
	
	            /*
	             * The modulo mode used when calculating the modulus: a mod n.
	             * The quotient (q = a / n) is calculated according to the corresponding rounding mode.
	             * The remainder (r) is calculated as: r = a - n * q.
	             *
	             * UP        0 The remainder is positive if the dividend is negative, else is negative.
	             * DOWN      1 The remainder has the same sign as the dividend.
	             *             This modulo mode is commonly known as 'truncated division' and is
	             *             equivalent to (a % n) in JavaScript.
	             * FLOOR     3 The remainder has the same sign as the divisor (Python %).
	             * HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
	             * EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
	             *             The remainder is always positive.
	             *
	             * The truncated division, floored division, Euclidian division and IEEE 754 remainder
	             * modes are commonly used for the modulus operation.
	             * Although the other rounding modes can also be used, they may not give useful results.
	             */
	            MODULO_MODE = 1,                         // 0 to 9
	
	            // The maximum number of significant digits of the result of the toPower operation.
	            // If POW_PRECISION is 0, there will be unlimited significant digits.
	            POW_PRECISION = 100,                     // 0 to MAX
	
	            // The format specification used by the BigNumber.prototype.toFormat method.
	            FORMAT = {
	                decimalSeparator: '.',
	                groupSeparator: ',',
	                groupSize: 3,
	                secondaryGroupSize: 0,
	                fractionGroupSeparator: '\xA0',      // non-breaking space
	                fractionGroupSize: 0
	            };
	
	
	        /******************************************************************************************/
	
	
	        // CONSTRUCTOR
	
	
	        /*
	         * The BigNumber constructor and exported function.
	         * Create and return a new instance of a BigNumber object.
	         *
	         * n {number|string|BigNumber} A numeric value.
	         * [b] {number} The base of n. Integer, 2 to 64 inclusive.
	         */
	        function BigNumber( n, b ) {
	            var c, e, i, num, len, str,
	                x = this;
	
	            // Enable constructor usage without new.
	            if ( !( x instanceof BigNumber ) ) {
	
	                // 'BigNumber() constructor call without new: {n}'
	                if (ERRORS) raise( 26, 'constructor call without new', n );
	                return new BigNumber( n, b );
	            }
	
	            // 'new BigNumber() base not an integer: {b}'
	            // 'new BigNumber() base out of range: {b}'
	            if ( b == null || !isValidInt( b, 2, 64, id, 'base' ) ) {
	
	                // Duplicate.
	                if ( n instanceof BigNumber ) {
	                    x.s = n.s;
	                    x.e = n.e;
	                    x.c = ( n = n.c ) ? n.slice() : n;
	                    id = 0;
	                    return;
	                }
	
	                if ( ( num = typeof n == 'number' ) && n * 0 == 0 ) {
	                    x.s = 1 / n < 0 ? ( n = -n, -1 ) : 1;
	
	                    // Fast path for integers.
	                    if ( n === ~~n ) {
	                        for ( e = 0, i = n; i >= 10; i /= 10, e++ );
	                        x.e = e;
	                        x.c = [n];
	                        id = 0;
	                        return;
	                    }
	
	                    str = n + '';
	                } else {
	                    if ( !isNumeric.test( str = n + '' ) ) return parseNumeric( x, str, num );
	                    x.s = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;
	                }
	            } else {
	                b = b | 0;
	                str = n + '';
	
	                // Ensure return value is rounded to DECIMAL_PLACES as with other bases.
	                // Allow exponential notation to be used with base 10 argument.
	                if ( b == 10 ) {
	                    x = new BigNumber( n instanceof BigNumber ? n : str );
	                    return round( x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE );
	                }
	
	                // Avoid potential interpretation of Infinity and NaN as base 44+ values.
	                // Any number in exponential form will fail due to the [Ee][+-].
	                if ( ( num = typeof n == 'number' ) && n * 0 != 0 ||
	                  !( new RegExp( '^-?' + ( c = '[' + ALPHABET.slice( 0, b ) + ']+' ) +
	                    '(?:\\.' + c + ')?$',b < 37 ? 'i' : '' ) ).test(str) ) {
	                    return parseNumeric( x, str, num, b );
	                }
	
	                if (num) {
	                    x.s = 1 / n < 0 ? ( str = str.slice(1), -1 ) : 1;
	
	                    if ( ERRORS && str.replace( /^0\.0*|\./, '' ).length > 15 ) {
	
	                        // 'new BigNumber() number type has more than 15 significant digits: {n}'
	                        raise( id, tooManyDigits, n );
	                    }
	
	                    // Prevent later check for length on converted number.
	                    num = false;
	                } else {
	                    x.s = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;
	                }
	
	                str = convertBase( str, 10, b, x.s );
	            }
	
	            // Decimal point?
	            if ( ( e = str.indexOf('.') ) > -1 ) str = str.replace( '.', '' );
	
	            // Exponential form?
	            if ( ( i = str.search( /e/i ) ) > 0 ) {
	
	                // Determine exponent.
	                if ( e < 0 ) e = i;
	                e += +str.slice( i + 1 );
	                str = str.substring( 0, i );
	            } else if ( e < 0 ) {
	
	                // Integer.
	                e = str.length;
	            }
	
	            // Determine leading zeros.
	            for ( i = 0; str.charCodeAt(i) === 48; i++ );
	
	            // Determine trailing zeros.
	            for ( len = str.length; str.charCodeAt(--len) === 48; );
	            str = str.slice( i, len + 1 );
	
	            if (str) {
	                len = str.length;
	
	                // Disallow numbers with over 15 significant digits if number type.
	                // 'new BigNumber() number type has more than 15 significant digits: {n}'
	                if ( num && ERRORS && len > 15 ) raise( id, tooManyDigits, x.s * n );
	
	                e = e - i - 1;
	
	                 // Overflow?
	                if ( e > MAX_EXP ) {
	
	                    // Infinity.
	                    x.c = x.e = null;
	
	                // Underflow?
	                } else if ( e < MIN_EXP ) {
	
	                    // Zero.
	                    x.c = [ x.e = 0 ];
	                } else {
	                    x.e = e;
	                    x.c = [];
	
	                    // Transform base
	
	                    // e is the base 10 exponent.
	                    // i is where to slice str to get the first element of the coefficient array.
	                    i = ( e + 1 ) % LOG_BASE;
	                    if ( e < 0 ) i += LOG_BASE;
	
	                    if ( i < len ) {
	                        if (i) x.c.push( +str.slice( 0, i ) );
	
	                        for ( len -= LOG_BASE; i < len; ) {
	                            x.c.push( +str.slice( i, i += LOG_BASE ) );
	                        }
	
	                        str = str.slice(i);
	                        i = LOG_BASE - str.length;
	                    } else {
	                        i -= len;
	                    }
	
	                    for ( ; i--; str += '0' );
	                    x.c.push( +str );
	                }
	            } else {
	
	                // Zero.
	                x.c = [ x.e = 0 ];
	            }
	
	            id = 0;
	        }
	
	
	        // CONSTRUCTOR PROPERTIES
	
	
	        BigNumber.another = another;
	
	        BigNumber.ROUND_UP = 0;
	        BigNumber.ROUND_DOWN = 1;
	        BigNumber.ROUND_CEIL = 2;
	        BigNumber.ROUND_FLOOR = 3;
	        BigNumber.ROUND_HALF_UP = 4;
	        BigNumber.ROUND_HALF_DOWN = 5;
	        BigNumber.ROUND_HALF_EVEN = 6;
	        BigNumber.ROUND_HALF_CEIL = 7;
	        BigNumber.ROUND_HALF_FLOOR = 8;
	        BigNumber.EUCLID = 9;
	
	
	        /*
	         * Configure infrequently-changing library-wide settings.
	         *
	         * Accept an object or an argument list, with one or many of the following properties or
	         * parameters respectively:
	         *
	         *   DECIMAL_PLACES  {number}  Integer, 0 to MAX inclusive
	         *   ROUNDING_MODE   {number}  Integer, 0 to 8 inclusive
	         *   EXPONENTIAL_AT  {number|number[]}  Integer, -MAX to MAX inclusive or
	         *                                      [integer -MAX to 0 incl., 0 to MAX incl.]
	         *   RANGE           {number|number[]}  Non-zero integer, -MAX to MAX inclusive or
	         *                                      [integer -MAX to -1 incl., integer 1 to MAX incl.]
	         *   ERRORS          {boolean|number}   true, false, 1 or 0
	         *   CRYPTO          {boolean|number}   true, false, 1 or 0
	         *   MODULO_MODE     {number}           0 to 9 inclusive
	         *   POW_PRECISION   {number}           0 to MAX inclusive
	         *   FORMAT          {object}           See BigNumber.prototype.toFormat
	         *      decimalSeparator       {string}
	         *      groupSeparator         {string}
	         *      groupSize              {number}
	         *      secondaryGroupSize     {number}
	         *      fractionGroupSeparator {string}
	         *      fractionGroupSize      {number}
	         *
	         * (The values assigned to the above FORMAT object properties are not checked for validity.)
	         *
	         * E.g.
	         * BigNumber.config(20, 4) is equivalent to
	         * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
	         *
	         * Ignore properties/parameters set to null or undefined.
	         * Return an object with the properties current values.
	         */
	        BigNumber.config = function () {
	            var v, p,
	                i = 0,
	                r = {},
	                a = arguments,
	                o = a[0],
	                has = o && typeof o == 'object'
	                  ? function () { if ( o.hasOwnProperty(p) ) return ( v = o[p] ) != null; }
	                  : function () { if ( a.length > i ) return ( v = a[i++] ) != null; };
	
	            // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
	            // 'config() DECIMAL_PLACES not an integer: {v}'
	            // 'config() DECIMAL_PLACES out of range: {v}'
	            if ( has( p = 'DECIMAL_PLACES' ) && isValidInt( v, 0, MAX, 2, p ) ) {
	                DECIMAL_PLACES = v | 0;
	            }
	            r[p] = DECIMAL_PLACES;
	
	            // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
	            // 'config() ROUNDING_MODE not an integer: {v}'
	            // 'config() ROUNDING_MODE out of range: {v}'
	            if ( has( p = 'ROUNDING_MODE' ) && isValidInt( v, 0, 8, 2, p ) ) {
	                ROUNDING_MODE = v | 0;
	            }
	            r[p] = ROUNDING_MODE;
	
	            // EXPONENTIAL_AT {number|number[]}
	            // Integer, -MAX to MAX inclusive or [integer -MAX to 0 inclusive, 0 to MAX inclusive].
	            // 'config() EXPONENTIAL_AT not an integer: {v}'
	            // 'config() EXPONENTIAL_AT out of range: {v}'
	            if ( has( p = 'EXPONENTIAL_AT' ) ) {
	
	                if ( isArray(v) ) {
	                    if ( isValidInt( v[0], -MAX, 0, 2, p ) && isValidInt( v[1], 0, MAX, 2, p ) ) {
	                        TO_EXP_NEG = v[0] | 0;
	                        TO_EXP_POS = v[1] | 0;
	                    }
	                } else if ( isValidInt( v, -MAX, MAX, 2, p ) ) {
	                    TO_EXP_NEG = -( TO_EXP_POS = ( v < 0 ? -v : v ) | 0 );
	                }
	            }
	            r[p] = [ TO_EXP_NEG, TO_EXP_POS ];
	
	            // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
	            // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
	            // 'config() RANGE not an integer: {v}'
	            // 'config() RANGE cannot be zero: {v}'
	            // 'config() RANGE out of range: {v}'
	            if ( has( p = 'RANGE' ) ) {
	
	                if ( isArray(v) ) {
	                    if ( isValidInt( v[0], -MAX, -1, 2, p ) && isValidInt( v[1], 1, MAX, 2, p ) ) {
	                        MIN_EXP = v[0] | 0;
	                        MAX_EXP = v[1] | 0;
	                    }
	                } else if ( isValidInt( v, -MAX, MAX, 2, p ) ) {
	                    if ( v | 0 ) MIN_EXP = -( MAX_EXP = ( v < 0 ? -v : v ) | 0 );
	                    else if (ERRORS) raise( 2, p + ' cannot be zero', v );
	                }
	            }
	            r[p] = [ MIN_EXP, MAX_EXP ];
	
	            // ERRORS {boolean|number} true, false, 1 or 0.
	            // 'config() ERRORS not a boolean or binary digit: {v}'
	            if ( has( p = 'ERRORS' ) ) {
	
	                if ( v === !!v || v === 1 || v === 0 ) {
	                    id = 0;
	                    isValidInt = ( ERRORS = !!v ) ? intValidatorWithErrors : intValidatorNoErrors;
	                } else if (ERRORS) {
	                    raise( 2, p + notBool, v );
	                }
	            }
	            r[p] = ERRORS;
	
	            // CRYPTO {boolean|number} true, false, 1 or 0.
	            // 'config() CRYPTO not a boolean or binary digit: {v}'
	            // 'config() crypto unavailable: {crypto}'
	            if ( has( p = 'CRYPTO' ) ) {
	
	                if ( v === !!v || v === 1 || v === 0 ) {
	                    CRYPTO = !!( v && crypto && typeof crypto == 'object' );
	                    if ( v && !CRYPTO && ERRORS ) raise( 2, 'crypto unavailable', crypto );
	                } else if (ERRORS) {
	                    raise( 2, p + notBool, v );
	                }
	            }
	            r[p] = CRYPTO;
	
	            // MODULO_MODE {number} Integer, 0 to 9 inclusive.
	            // 'config() MODULO_MODE not an integer: {v}'
	            // 'config() MODULO_MODE out of range: {v}'
	            if ( has( p = 'MODULO_MODE' ) && isValidInt( v, 0, 9, 2, p ) ) {
	                MODULO_MODE = v | 0;
	            }
	            r[p] = MODULO_MODE;
	
	            // POW_PRECISION {number} Integer, 0 to MAX inclusive.
	            // 'config() POW_PRECISION not an integer: {v}'
	            // 'config() POW_PRECISION out of range: {v}'
	            if ( has( p = 'POW_PRECISION' ) && isValidInt( v, 0, MAX, 2, p ) ) {
	                POW_PRECISION = v | 0;
	            }
	            r[p] = POW_PRECISION;
	
	            // FORMAT {object}
	            // 'config() FORMAT not an object: {v}'
	            if ( has( p = 'FORMAT' ) ) {
	
	                if ( typeof v == 'object' ) {
	                    FORMAT = v;
	                } else if (ERRORS) {
	                    raise( 2, p + ' not an object', v );
	                }
	            }
	            r[p] = FORMAT;
	
	            return r;
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the maximum of the arguments.
	         *
	         * arguments {number|string|BigNumber}
	         */
	        BigNumber.max = function () { return maxOrMin( arguments, P.lt ); };
	
	
	        /*
	         * Return a new BigNumber whose value is the minimum of the arguments.
	         *
	         * arguments {number|string|BigNumber}
	         */
	        BigNumber.min = function () { return maxOrMin( arguments, P.gt ); };
	
	
	        /*
	         * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
	         * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
	         * zeros are produced).
	         *
	         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	         *
	         * 'random() decimal places not an integer: {dp}'
	         * 'random() decimal places out of range: {dp}'
	         * 'random() crypto unavailable: {crypto}'
	         */
	        BigNumber.random = (function () {
	            var pow2_53 = 0x20000000000000;
	
	            // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
	            // Check if Math.random() produces more than 32 bits of randomness.
	            // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
	            // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
	            var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
	              ? function () { return mathfloor( Math.random() * pow2_53 ); }
	              : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
	                  (Math.random() * 0x800000 | 0); };
	
	            return function (dp) {
	                var a, b, e, k, v,
	                    i = 0,
	                    c = [],
	                    rand = new BigNumber(ONE);
	
	                dp = dp == null || !isValidInt( dp, 0, MAX, 14 ) ? DECIMAL_PLACES : dp | 0;
	                k = mathceil( dp / LOG_BASE );
	
	                if (CRYPTO) {
	
	                    // Browsers supporting crypto.getRandomValues.
	                    if ( crypto && crypto.getRandomValues ) {
	
	                        a = crypto.getRandomValues( new Uint32Array( k *= 2 ) );
	
	                        for ( ; i < k; ) {
	
	                            // 53 bits:
	                            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
	                            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
	                            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
	                            //                                     11111 11111111 11111111
	                            // 0x20000 is 2^21.
	                            v = a[i] * 0x20000 + (a[i + 1] >>> 11);
	
	                            // Rejection sampling:
	                            // 0 <= v < 9007199254740992
	                            // Probability that v >= 9e15, is
	                            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
	                            if ( v >= 9e15 ) {
	                                b = crypto.getRandomValues( new Uint32Array(2) );
	                                a[i] = b[0];
	                                a[i + 1] = b[1];
	                            } else {
	
	                                // 0 <= v <= 8999999999999999
	                                // 0 <= (v % 1e14) <= 99999999999999
	                                c.push( v % 1e14 );
	                                i += 2;
	                            }
	                        }
	                        i = k / 2;
	
	                    // Node.js supporting crypto.randomBytes.
	                    } else if ( crypto && crypto.randomBytes ) {
	
	                        // buffer
	                        a = crypto.randomBytes( k *= 7 );
	
	                        for ( ; i < k; ) {
	
	                            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
	                            // 0x100000000 is 2^32, 0x1000000 is 2^24
	                            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
	                            // 0 <= v < 9007199254740992
	                            v = ( ( a[i] & 31 ) * 0x1000000000000 ) + ( a[i + 1] * 0x10000000000 ) +
	                                  ( a[i + 2] * 0x100000000 ) + ( a[i + 3] * 0x1000000 ) +
	                                  ( a[i + 4] << 16 ) + ( a[i + 5] << 8 ) + a[i + 6];
	
	                            if ( v >= 9e15 ) {
	                                crypto.randomBytes(7).copy( a, i );
	                            } else {
	
	                                // 0 <= (v % 1e14) <= 99999999999999
	                                c.push( v % 1e14 );
	                                i += 7;
	                            }
	                        }
	                        i = k / 7;
	                    } else if (ERRORS) {
	                        raise( 14, 'crypto unavailable', crypto );
	                    }
	                }
	
	                // Use Math.random: CRYPTO is false or crypto is unavailable and ERRORS is false.
	                if (!i) {
	
	                    for ( ; i < k; ) {
	                        v = random53bitInt();
	                        if ( v < 9e15 ) c[i++] = v % 1e14;
	                    }
	                }
	
	                k = c[--i];
	                dp %= LOG_BASE;
	
	                // Convert trailing digits to zeros according to dp.
	                if ( k && dp ) {
	                    v = POWS_TEN[LOG_BASE - dp];
	                    c[i] = mathfloor( k / v ) * v;
	                }
	
	                // Remove trailing elements which are zero.
	                for ( ; c[i] === 0; c.pop(), i-- );
	
	                // Zero?
	                if ( i < 0 ) {
	                    c = [ e = 0 ];
	                } else {
	
	                    // Remove leading elements which are zero and adjust exponent accordingly.
	                    for ( e = -1 ; c[0] === 0; c.shift(), e -= LOG_BASE);
	
	                    // Count the digits of the first element of c to determine leading zeros, and...
	                    for ( i = 1, v = c[0]; v >= 10; v /= 10, i++);
	
	                    // adjust the exponent accordingly.
	                    if ( i < LOG_BASE ) e -= LOG_BASE - i;
	                }
	
	                rand.e = e;
	                rand.c = c;
	                return rand;
	            };
	        })();
	
	
	        // PRIVATE FUNCTIONS
	
	
	        // Convert a numeric string of baseIn to a numeric string of baseOut.
	        function convertBase( str, baseOut, baseIn, sign ) {
	            var d, e, k, r, x, xc, y,
	                i = str.indexOf( '.' ),
	                dp = DECIMAL_PLACES,
	                rm = ROUNDING_MODE;
	
	            if ( baseIn < 37 ) str = str.toLowerCase();
	
	            // Non-integer.
	            if ( i >= 0 ) {
	                k = POW_PRECISION;
	
	                // Unlimited precision.
	                POW_PRECISION = 0;
	                str = str.replace( '.', '' );
	                y = new BigNumber(baseIn);
	                x = y.pow( str.length - i );
	                POW_PRECISION = k;
	
	                // Convert str as if an integer, then restore the fraction part by dividing the
	                // result by its base raised to a power.
	                y.c = toBaseOut( toFixedPoint( coeffToString( x.c ), x.e ), 10, baseOut );
	                y.e = y.c.length;
	            }
	
	            // Convert the number as integer.
	            xc = toBaseOut( str, baseIn, baseOut );
	            e = k = xc.length;
	
	            // Remove trailing zeros.
	            for ( ; xc[--k] == 0; xc.pop() );
	            if ( !xc[0] ) return '0';
	
	            if ( i < 0 ) {
	                --e;
	            } else {
	                x.c = xc;
	                x.e = e;
	
	                // sign is needed for correct rounding.
	                x.s = sign;
	                x = div( x, y, dp, rm, baseOut );
	                xc = x.c;
	                r = x.r;
	                e = x.e;
	            }
	
	            d = e + dp + 1;
	
	            // The rounding digit, i.e. the digit to the right of the digit that may be rounded up.
	            i = xc[d];
	            k = baseOut / 2;
	            r = r || d < 0 || xc[d + 1] != null;
	
	            r = rm < 4 ? ( i != null || r ) && ( rm == 0 || rm == ( x.s < 0 ? 3 : 2 ) )
	                       : i > k || i == k &&( rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
	                         rm == ( x.s < 0 ? 8 : 7 ) );
	
	            if ( d < 1 || !xc[0] ) {
	
	                // 1^-dp or 0.
	                str = r ? toFixedPoint( '1', -dp ) : '0';
	            } else {
	                xc.length = d;
	
	                if (r) {
	
	                    // Rounding up may mean the previous digit has to be rounded up and so on.
	                    for ( --baseOut; ++xc[--d] > baseOut; ) {
	                        xc[d] = 0;
	
	                        if ( !d ) {
	                            ++e;
	                            xc.unshift(1);
	                        }
	                    }
	                }
	
	                // Determine trailing zeros.
	                for ( k = xc.length; !xc[--k]; );
	
	                // E.g. [4, 11, 15] becomes 4bf.
	                for ( i = 0, str = ''; i <= k; str += ALPHABET.charAt( xc[i++] ) );
	                str = toFixedPoint( str, e );
	            }
	
	            // The caller will add the sign.
	            return str;
	        }
	
	
	        // Perform division in the specified base. Called by div and convertBase.
	        div = (function () {
	
	            // Assume non-zero x and k.
	            function multiply( x, k, base ) {
	                var m, temp, xlo, xhi,
	                    carry = 0,
	                    i = x.length,
	                    klo = k % SQRT_BASE,
	                    khi = k / SQRT_BASE | 0;
	
	                for ( x = x.slice(); i--; ) {
	                    xlo = x[i] % SQRT_BASE;
	                    xhi = x[i] / SQRT_BASE | 0;
	                    m = khi * xlo + xhi * klo;
	                    temp = klo * xlo + ( ( m % SQRT_BASE ) * SQRT_BASE ) + carry;
	                    carry = ( temp / base | 0 ) + ( m / SQRT_BASE | 0 ) + khi * xhi;
	                    x[i] = temp % base;
	                }
	
	                if (carry) x.unshift(carry);
	
	                return x;
	            }
	
	            function compare( a, b, aL, bL ) {
	                var i, cmp;
	
	                if ( aL != bL ) {
	                    cmp = aL > bL ? 1 : -1;
	                } else {
	
	                    for ( i = cmp = 0; i < aL; i++ ) {
	
	                        if ( a[i] != b[i] ) {
	                            cmp = a[i] > b[i] ? 1 : -1;
	                            break;
	                        }
	                    }
	                }
	                return cmp;
	            }
	
	            function subtract( a, b, aL, base ) {
	                var i = 0;
	
	                // Subtract b from a.
	                for ( ; aL--; ) {
	                    a[aL] -= i;
	                    i = a[aL] < b[aL] ? 1 : 0;
	                    a[aL] = i * base + a[aL] - b[aL];
	                }
	
	                // Remove leading zeros.
	                for ( ; !a[0] && a.length > 1; a.shift() );
	            }
	
	            // x: dividend, y: divisor.
	            return function ( x, y, dp, rm, base ) {
	                var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
	                    yL, yz,
	                    s = x.s == y.s ? 1 : -1,
	                    xc = x.c,
	                    yc = y.c;
	
	                // Either NaN, Infinity or 0?
	                if ( !xc || !xc[0] || !yc || !yc[0] ) {
	
	                    return new BigNumber(
	
	                      // Return NaN if either NaN, or both Infinity or 0.
	                      !x.s || !y.s || ( xc ? yc && xc[0] == yc[0] : !yc ) ? NaN :
	
	                        // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
	                        xc && xc[0] == 0 || !yc ? s * 0 : s / 0
	                    );
	                }
	
	                q = new BigNumber(s);
	                qc = q.c = [];
	                e = x.e - y.e;
	                s = dp + e + 1;
	
	                if ( !base ) {
	                    base = BASE;
	                    e = bitFloor( x.e / LOG_BASE ) - bitFloor( y.e / LOG_BASE );
	                    s = s / LOG_BASE | 0;
	                }
	
	                // Result exponent may be one less then the current value of e.
	                // The coefficients of the BigNumbers from convertBase may have trailing zeros.
	                for ( i = 0; yc[i] == ( xc[i] || 0 ); i++ );
	                if ( yc[i] > ( xc[i] || 0 ) ) e--;
	
	                if ( s < 0 ) {
	                    qc.push(1);
	                    more = true;
	                } else {
	                    xL = xc.length;
	                    yL = yc.length;
	                    i = 0;
	                    s += 2;
	
	                    // Normalise xc and yc so highest order digit of yc is >= base / 2.
	
	                    n = mathfloor( base / ( yc[0] + 1 ) );
	
	                    // Not necessary, but to handle odd bases where yc[0] == ( base / 2 ) - 1.
	                    // if ( n > 1 || n++ == 1 && yc[0] < base / 2 ) {
	                    if ( n > 1 ) {
	                        yc = multiply( yc, n, base );
	                        xc = multiply( xc, n, base );
	                        yL = yc.length;
	                        xL = xc.length;
	                    }
	
	                    xi = yL;
	                    rem = xc.slice( 0, yL );
	                    remL = rem.length;
	
	                    // Add zeros to make remainder as long as divisor.
	                    for ( ; remL < yL; rem[remL++] = 0 );
	                    yz = yc.slice();
	                    yz.unshift(0);
	                    yc0 = yc[0];
	                    if ( yc[1] >= base / 2 ) yc0++;
	                    // Not necessary, but to prevent trial digit n > base, when using base 3.
	                    // else if ( base == 3 && yc0 == 1 ) yc0 = 1 + 1e-15;
	
	                    do {
	                        n = 0;
	
	                        // Compare divisor and remainder.
	                        cmp = compare( yc, rem, yL, remL );
	
	                        // If divisor < remainder.
	                        if ( cmp < 0 ) {
	
	                            // Calculate trial digit, n.
	
	                            rem0 = rem[0];
	                            if ( yL != remL ) rem0 = rem0 * base + ( rem[1] || 0 );
	
	                            // n is how many times the divisor goes into the current remainder.
	                            n = mathfloor( rem0 / yc0 );
	
	                            //  Algorithm:
	                            //  1. product = divisor * trial digit (n)
	                            //  2. if product > remainder: product -= divisor, n--
	                            //  3. remainder -= product
	                            //  4. if product was < remainder at 2:
	                            //    5. compare new remainder and divisor
	                            //    6. If remainder > divisor: remainder -= divisor, n++
	
	                            if ( n > 1 ) {
	
	                                // n may be > base only when base is 3.
	                                if (n >= base) n = base - 1;
	
	                                // product = divisor * trial digit.
	                                prod = multiply( yc, n, base );
	                                prodL = prod.length;
	                                remL = rem.length;
	
	                                // Compare product and remainder.
	                                // If product > remainder.
	                                // Trial digit n too high.
	                                // n is 1 too high about 5% of the time, and is not known to have
	                                // ever been more than 1 too high.
	                                while ( compare( prod, rem, prodL, remL ) == 1 ) {
	                                    n--;
	
	                                    // Subtract divisor from product.
	                                    subtract( prod, yL < prodL ? yz : yc, prodL, base );
	                                    prodL = prod.length;
	                                    cmp = 1;
	                                }
	                            } else {
	
	                                // n is 0 or 1, cmp is -1.
	                                // If n is 0, there is no need to compare yc and rem again below,
	                                // so change cmp to 1 to avoid it.
	                                // If n is 1, leave cmp as -1, so yc and rem are compared again.
	                                if ( n == 0 ) {
	
	                                    // divisor < remainder, so n must be at least 1.
	                                    cmp = n = 1;
	                                }
	
	                                // product = divisor
	                                prod = yc.slice();
	                                prodL = prod.length;
	                            }
	
	                            if ( prodL < remL ) prod.unshift(0);
	
	                            // Subtract product from remainder.
	                            subtract( rem, prod, remL, base );
	                            remL = rem.length;
	
	                             // If product was < remainder.
	                            if ( cmp == -1 ) {
	
	                                // Compare divisor and new remainder.
	                                // If divisor < new remainder, subtract divisor from remainder.
	                                // Trial digit n too low.
	                                // n is 1 too low about 5% of the time, and very rarely 2 too low.
	                                while ( compare( yc, rem, yL, remL ) < 1 ) {
	                                    n++;
	
	                                    // Subtract divisor from remainder.
	                                    subtract( rem, yL < remL ? yz : yc, remL, base );
	                                    remL = rem.length;
	                                }
	                            }
	                        } else if ( cmp === 0 ) {
	                            n++;
	                            rem = [0];
	                        } // else cmp === 1 and n will be 0
	
	                        // Add the next digit, n, to the result array.
	                        qc[i++] = n;
	
	                        // Update the remainder.
	                        if ( rem[0] ) {
	                            rem[remL++] = xc[xi] || 0;
	                        } else {
	                            rem = [ xc[xi] ];
	                            remL = 1;
	                        }
	                    } while ( ( xi++ < xL || rem[0] != null ) && s-- );
	
	                    more = rem[0] != null;
	
	                    // Leading zero?
	                    if ( !qc[0] ) qc.shift();
	                }
	
	                if ( base == BASE ) {
	
	                    // To calculate q.e, first get the number of digits of qc[0].
	                    for ( i = 1, s = qc[0]; s >= 10; s /= 10, i++ );
	                    round( q, dp + ( q.e = i + e * LOG_BASE - 1 ) + 1, rm, more );
	
	                // Caller is convertBase.
	                } else {
	                    q.e = e;
	                    q.r = +more;
	                }
	
	                return q;
	            };
	        })();
	
	
	        /*
	         * Return a string representing the value of BigNumber n in fixed-point or exponential
	         * notation rounded to the specified decimal places or significant digits.
	         *
	         * n is a BigNumber.
	         * i is the index of the last digit required (i.e. the digit that may be rounded up).
	         * rm is the rounding mode.
	         * caller is caller id: toExponential 19, toFixed 20, toFormat 21, toPrecision 24.
	         */
	        function format( n, i, rm, caller ) {
	            var c0, e, ne, len, str;
	
	            rm = rm != null && isValidInt( rm, 0, 8, caller, roundingMode )
	              ? rm | 0 : ROUNDING_MODE;
	
	            if ( !n.c ) return n.toString();
	            c0 = n.c[0];
	            ne = n.e;
	
	            if ( i == null ) {
	                str = coeffToString( n.c );
	                str = caller == 19 || caller == 24 && ne <= TO_EXP_NEG
	                  ? toExponential( str, ne )
	                  : toFixedPoint( str, ne );
	            } else {
	                n = round( new BigNumber(n), i, rm );
	
	                // n.e may have changed if the value was rounded up.
	                e = n.e;
	
	                str = coeffToString( n.c );
	                len = str.length;
	
	                // toPrecision returns exponential notation if the number of significant digits
	                // specified is less than the number of digits necessary to represent the integer
	                // part of the value in fixed-point notation.
	
	                // Exponential notation.
	                if ( caller == 19 || caller == 24 && ( i <= e || e <= TO_EXP_NEG ) ) {
	
	                    // Append zeros?
	                    for ( ; len < i; str += '0', len++ );
	                    str = toExponential( str, e );
	
	                // Fixed-point notation.
	                } else {
	                    i -= ne;
	                    str = toFixedPoint( str, e );
	
	                    // Append zeros?
	                    if ( e + 1 > len ) {
	                        if ( --i > 0 ) for ( str += '.'; i--; str += '0' );
	                    } else {
	                        i += e - len;
	                        if ( i > 0 ) {
	                            if ( e + 1 == len ) str += '.';
	                            for ( ; i--; str += '0' );
	                        }
	                    }
	                }
	            }
	
	            return n.s < 0 && c0 ? '-' + str : str;
	        }
	
	
	        // Handle BigNumber.max and BigNumber.min.
	        function maxOrMin( args, method ) {
	            var m, n,
	                i = 0;
	
	            if ( isArray( args[0] ) ) args = args[0];
	            m = new BigNumber( args[0] );
	
	            for ( ; ++i < args.length; ) {
	                n = new BigNumber( args[i] );
	
	                // If any number is NaN, return NaN.
	                if ( !n.s ) {
	                    m = n;
	                    break;
	                } else if ( method.call( m, n ) ) {
	                    m = n;
	                }
	            }
	
	            return m;
	        }
	
	
	        /*
	         * Return true if n is an integer in range, otherwise throw.
	         * Use for argument validation when ERRORS is true.
	         */
	        function intValidatorWithErrors( n, min, max, caller, name ) {
	            if ( n < min || n > max || n != truncate(n) ) {
	                raise( caller, ( name || 'decimal places' ) +
	                  ( n < min || n > max ? ' out of range' : ' not an integer' ), n );
	            }
	
	            return true;
	        }
	
	
	        /*
	         * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
	         * Called by minus, plus and times.
	         */
	        function normalise( n, c, e ) {
	            var i = 1,
	                j = c.length;
	
	             // Remove trailing zeros.
	            for ( ; !c[--j]; c.pop() );
	
	            // Calculate the base 10 exponent. First get the number of digits of c[0].
	            for ( j = c[0]; j >= 10; j /= 10, i++ );
	
	            // Overflow?
	            if ( ( e = i + e * LOG_BASE - 1 ) > MAX_EXP ) {
	
	                // Infinity.
	                n.c = n.e = null;
	
	            // Underflow?
	            } else if ( e < MIN_EXP ) {
	
	                // Zero.
	                n.c = [ n.e = 0 ];
	            } else {
	                n.e = e;
	                n.c = c;
	            }
	
	            return n;
	        }
	
	
	        // Handle values that fail the validity test in BigNumber.
	        parseNumeric = (function () {
	            var basePrefix = /^(-?)0([xbo])/i,
	                dotAfter = /^([^.]+)\.$/,
	                dotBefore = /^\.([^.]+)$/,
	                isInfinityOrNaN = /^-?(Infinity|NaN)$/,
	                whitespaceOrPlus = /^\s*\+|^\s+|\s+$/g;
	
	            return function ( x, str, num, b ) {
	                var base,
	                    s = num ? str : str.replace( whitespaceOrPlus, '' );
	
	                // No exception on ±Infinity or NaN.
	                if ( isInfinityOrNaN.test(s) ) {
	                    x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
	                } else {
	                    if ( !num ) {
	
	                        // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
	                        s = s.replace( basePrefix, function ( m, p1, p2 ) {
	                            base = ( p2 = p2.toLowerCase() ) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
	                            return !b || b == base ? p1 : m;
	                        });
	
	                        if (b) {
	                            base = b;
	
	                            // E.g. '1.' to '1', '.1' to '0.1'
	                            s = s.replace( dotAfter, '$1' ).replace( dotBefore, '0.$1' );
	                        }
	
	                        if ( str != s ) return new BigNumber( s, base );
	                    }
	
	                    // 'new BigNumber() not a number: {n}'
	                    // 'new BigNumber() not a base {b} number: {n}'
	                    if (ERRORS) raise( id, 'not a' + ( b ? ' base ' + b : '' ) + ' number', str );
	                    x.s = null;
	                }
	
	                x.c = x.e = null;
	                id = 0;
	            }
	        })();
	
	
	        // Throw a BigNumber Error.
	        function raise( caller, msg, val ) {
	            var error = new Error( [
	                'new BigNumber',     // 0
	                'cmp',               // 1
	                'config',            // 2
	                'div',               // 3
	                'divToInt',          // 4
	                'eq',                // 5
	                'gt',                // 6
	                'gte',               // 7
	                'lt',                // 8
	                'lte',               // 9
	                'minus',             // 10
	                'mod',               // 11
	                'plus',              // 12
	                'precision',         // 13
	                'random',            // 14
	                'round',             // 15
	                'shift',             // 16
	                'times',             // 17
	                'toDigits',          // 18
	                'toExponential',     // 19
	                'toFixed',           // 20
	                'toFormat',          // 21
	                'toFraction',        // 22
	                'pow',               // 23
	                'toPrecision',       // 24
	                'toString',          // 25
	                'BigNumber'          // 26
	            ][caller] + '() ' + msg + ': ' + val );
	
	            error.name = 'BigNumber Error';
	            id = 0;
	            throw error;
	        }
	
	
	        /*
	         * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
	         * If r is truthy, it is known that there are more digits after the rounding digit.
	         */
	        function round( x, sd, rm, r ) {
	            var d, i, j, k, n, ni, rd,
	                xc = x.c,
	                pows10 = POWS_TEN;
	
	            // if x is not Infinity or NaN...
	            if (xc) {
	
	                // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
	                // n is a base 1e14 number, the value of the element of array x.c containing rd.
	                // ni is the index of n within x.c.
	                // d is the number of digits of n.
	                // i is the index of rd within n including leading zeros.
	                // j is the actual index of rd within n (if < 0, rd is a leading zero).
	                out: {
	
	                    // Get the number of digits of the first element of xc.
	                    for ( d = 1, k = xc[0]; k >= 10; k /= 10, d++ );
	                    i = sd - d;
	
	                    // If the rounding digit is in the first element of xc...
	                    if ( i < 0 ) {
	                        i += LOG_BASE;
	                        j = sd;
	                        n = xc[ ni = 0 ];
	
	                        // Get the rounding digit at index j of n.
	                        rd = n / pows10[ d - j - 1 ] % 10 | 0;
	                    } else {
	                        ni = mathceil( ( i + 1 ) / LOG_BASE );
	
	                        if ( ni >= xc.length ) {
	
	                            if (r) {
	
	                                // Needed by sqrt.
	                                for ( ; xc.length <= ni; xc.push(0) );
	                                n = rd = 0;
	                                d = 1;
	                                i %= LOG_BASE;
	                                j = i - LOG_BASE + 1;
	                            } else {
	                                break out;
	                            }
	                        } else {
	                            n = k = xc[ni];
	
	                            // Get the number of digits of n.
	                            for ( d = 1; k >= 10; k /= 10, d++ );
	
	                            // Get the index of rd within n.
	                            i %= LOG_BASE;
	
	                            // Get the index of rd within n, adjusted for leading zeros.
	                            // The number of leading zeros of n is given by LOG_BASE - d.
	                            j = i - LOG_BASE + d;
	
	                            // Get the rounding digit at index j of n.
	                            rd = j < 0 ? 0 : n / pows10[ d - j - 1 ] % 10 | 0;
	                        }
	                    }
	
	                    r = r || sd < 0 ||
	
	                    // Are there any non-zero digits after the rounding digit?
	                    // The expression  n % pows10[ d - j - 1 ]  returns all digits of n to the right
	                    // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
	                      xc[ni + 1] != null || ( j < 0 ? n : n % pows10[ d - j - 1 ] );
	
	                    r = rm < 4
	                      ? ( rd || r ) && ( rm == 0 || rm == ( x.s < 0 ? 3 : 2 ) )
	                      : rd > 5 || rd == 5 && ( rm == 4 || r || rm == 6 &&
	
	                        // Check whether the digit to the left of the rounding digit is odd.
	                        ( ( i > 0 ? j > 0 ? n / pows10[ d - j ] : 0 : xc[ni - 1] ) % 10 ) & 1 ||
	                          rm == ( x.s < 0 ? 8 : 7 ) );
	
	                    if ( sd < 1 || !xc[0] ) {
	                        xc.length = 0;
	
	                        if (r) {
	
	                            // Convert sd to decimal places.
	                            sd -= x.e + 1;
	
	                            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
	                            xc[0] = pows10[ sd % LOG_BASE ];
	                            x.e = -sd || 0;
	                        } else {
	
	                            // Zero.
	                            xc[0] = x.e = 0;
	                        }
	
	                        return x;
	                    }
	
	                    // Remove excess digits.
	                    if ( i == 0 ) {
	                        xc.length = ni;
	                        k = 1;
	                        ni--;
	                    } else {
	                        xc.length = ni + 1;
	                        k = pows10[ LOG_BASE - i ];
	
	                        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
	                        // j > 0 means i > number of leading zeros of n.
	                        xc[ni] = j > 0 ? mathfloor( n / pows10[ d - j ] % pows10[j] ) * k : 0;
	                    }
	
	                    // Round up?
	                    if (r) {
	
	                        for ( ; ; ) {
	
	                            // If the digit to be rounded up is in the first element of xc...
	                            if ( ni == 0 ) {
	
	                                // i will be the length of xc[0] before k is added.
	                                for ( i = 1, j = xc[0]; j >= 10; j /= 10, i++ );
	                                j = xc[0] += k;
	                                for ( k = 1; j >= 10; j /= 10, k++ );
	
	                                // if i != k the length has increased.
	                                if ( i != k ) {
	                                    x.e++;
	                                    if ( xc[0] == BASE ) xc[0] = 1;
	                                }
	
	                                break;
	                            } else {
	                                xc[ni] += k;
	                                if ( xc[ni] != BASE ) break;
	                                xc[ni--] = 0;
	                                k = 1;
	                            }
	                        }
	                    }
	
	                    // Remove trailing zeros.
	                    for ( i = xc.length; xc[--i] === 0; xc.pop() );
	                }
	
	                // Overflow? Infinity.
	                if ( x.e > MAX_EXP ) {
	                    x.c = x.e = null;
	
	                // Underflow? Zero.
	                } else if ( x.e < MIN_EXP ) {
	                    x.c = [ x.e = 0 ];
	                }
	            }
	
	            return x;
	        }
	
	
	        // PROTOTYPE/INSTANCE METHODS
	
	
	        /*
	         * Return a new BigNumber whose value is the absolute value of this BigNumber.
	         */
	        P.absoluteValue = P.abs = function () {
	            var x = new BigNumber(this);
	            if ( x.s < 0 ) x.s = 1;
	            return x;
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole
	         * number in the direction of Infinity.
	         */
	        P.ceil = function () {
	            return round( new BigNumber(this), this.e + 1, 2 );
	        };
	
	
	        /*
	         * Return
	         * 1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
	         * -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
	         * 0 if they have the same value,
	         * or null if the value of either is NaN.
	         */
	        P.comparedTo = P.cmp = function ( y, b ) {
	            id = 1;
	            return compare( this, new BigNumber( y, b ) );
	        };
	
	
	        /*
	         * Return the number of decimal places of the value of this BigNumber, or null if the value
	         * of this BigNumber is ±Infinity or NaN.
	         */
	        P.decimalPlaces = P.dp = function () {
	            var n, v,
	                c = this.c;
	
	            if ( !c ) return null;
	            n = ( ( v = c.length - 1 ) - bitFloor( this.e / LOG_BASE ) ) * LOG_BASE;
	
	            // Subtract the number of trailing zeros of the last number.
	            if ( v = c[v] ) for ( ; v % 10 == 0; v /= 10, n-- );
	            if ( n < 0 ) n = 0;
	
	            return n;
	        };
	
	
	        /*
	         *  n / 0 = I
	         *  n / N = N
	         *  n / I = 0
	         *  0 / n = 0
	         *  0 / 0 = N
	         *  0 / N = N
	         *  0 / I = 0
	         *  N / n = N
	         *  N / 0 = N
	         *  N / N = N
	         *  N / I = N
	         *  I / n = I
	         *  I / 0 = I
	         *  I / N = N
	         *  I / I = N
	         *
	         * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
	         * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
	         */
	        P.dividedBy = P.div = function ( y, b ) {
	            id = 3;
	            return div( this, new BigNumber( y, b ), DECIMAL_PLACES, ROUNDING_MODE );
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the integer part of dividing the value of this
	         * BigNumber by the value of BigNumber(y, b).
	         */
	        P.dividedToIntegerBy = P.divToInt = function ( y, b ) {
	            id = 4;
	            return div( this, new BigNumber( y, b ), 0, 1 );
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
	         * otherwise returns false.
	         */
	        P.equals = P.eq = function ( y, b ) {
	            id = 5;
	            return compare( this, new BigNumber( y, b ) ) === 0;
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole
	         * number in the direction of -Infinity.
	         */
	        P.floor = function () {
	            return round( new BigNumber(this), this.e + 1, 3 );
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
	         * otherwise returns false.
	         */
	        P.greaterThan = P.gt = function ( y, b ) {
	            id = 6;
	            return compare( this, new BigNumber( y, b ) ) > 0;
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is greater than or equal to the value of
	         * BigNumber(y, b), otherwise returns false.
	         */
	        P.greaterThanOrEqualTo = P.gte = function ( y, b ) {
	            id = 7;
	            return ( b = compare( this, new BigNumber( y, b ) ) ) === 1 || b === 0;
	
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is a finite number, otherwise returns false.
	         */
	        P.isFinite = function () {
	            return !!this.c;
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is an integer, otherwise return false.
	         */
	        P.isInteger = P.isInt = function () {
	            return !!this.c && bitFloor( this.e / LOG_BASE ) > this.c.length - 2;
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is NaN, otherwise returns false.
	         */
	        P.isNaN = function () {
	            return !this.s;
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is negative, otherwise returns false.
	         */
	        P.isNegative = P.isNeg = function () {
	            return this.s < 0;
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is 0 or -0, otherwise returns false.
	         */
	        P.isZero = function () {
	            return !!this.c && this.c[0] == 0;
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
	         * otherwise returns false.
	         */
	        P.lessThan = P.lt = function ( y, b ) {
	            id = 8;
	            return compare( this, new BigNumber( y, b ) ) < 0;
	        };
	
	
	        /*
	         * Return true if the value of this BigNumber is less than or equal to the value of
	         * BigNumber(y, b), otherwise returns false.
	         */
	        P.lessThanOrEqualTo = P.lte = function ( y, b ) {
	            id = 9;
	            return ( b = compare( this, new BigNumber( y, b ) ) ) === -1 || b === 0;
	        };
	
	
	        /*
	         *  n - 0 = n
	         *  n - N = N
	         *  n - I = -I
	         *  0 - n = -n
	         *  0 - 0 = 0
	         *  0 - N = N
	         *  0 - I = -I
	         *  N - n = N
	         *  N - 0 = N
	         *  N - N = N
	         *  N - I = N
	         *  I - n = I
	         *  I - 0 = I
	         *  I - N = N
	         *  I - I = N
	         *
	         * Return a new BigNumber whose value is the value of this BigNumber minus the value of
	         * BigNumber(y, b).
	         */
	        P.minus = P.sub = function ( y, b ) {
	            var i, j, t, xLTy,
	                x = this,
	                a = x.s;
	
	            id = 10;
	            y = new BigNumber( y, b );
	            b = y.s;
	
	            // Either NaN?
	            if ( !a || !b ) return new BigNumber(NaN);
	
	            // Signs differ?
	            if ( a != b ) {
	                y.s = -b;
	                return x.plus(y);
	            }
	
	            var xe = x.e / LOG_BASE,
	                ye = y.e / LOG_BASE,
	                xc = x.c,
	                yc = y.c;
	
	            if ( !xe || !ye ) {
	
	                // Either Infinity?
	                if ( !xc || !yc ) return xc ? ( y.s = -b, y ) : new BigNumber( yc ? x : NaN );
	
	                // Either zero?
	                if ( !xc[0] || !yc[0] ) {
	
	                    // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
	                    return yc[0] ? ( y.s = -b, y ) : new BigNumber( xc[0] ? x :
	
	                      // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
	                      ROUNDING_MODE == 3 ? -0 : 0 );
	                }
	            }
	
	            xe = bitFloor(xe);
	            ye = bitFloor(ye);
	            xc = xc.slice();
	
	            // Determine which is the bigger number.
	            if ( a = xe - ye ) {
	
	                if ( xLTy = a < 0 ) {
	                    a = -a;
	                    t = xc;
	                } else {
	                    ye = xe;
	                    t = yc;
	                }
	
	                t.reverse();
	
	                // Prepend zeros to equalise exponents.
	                for ( b = a; b--; t.push(0) );
	                t.reverse();
	            } else {
	
	                // Exponents equal. Check digit by digit.
	                j = ( xLTy = ( a = xc.length ) < ( b = yc.length ) ) ? a : b;
	
	                for ( a = b = 0; b < j; b++ ) {
	
	                    if ( xc[b] != yc[b] ) {
	                        xLTy = xc[b] < yc[b];
	                        break;
	                    }
	                }
	            }
	
	            // x < y? Point xc to the array of the bigger number.
	            if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;
	
	            b = ( j = yc.length ) - ( i = xc.length );
	
	            // Append zeros to xc if shorter.
	            // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
	            if ( b > 0 ) for ( ; b--; xc[i++] = 0 );
	            b = BASE - 1;
	
	            // Subtract yc from xc.
	            for ( ; j > a; ) {
	
	                if ( xc[--j] < yc[j] ) {
	                    for ( i = j; i && !xc[--i]; xc[i] = b );
	                    --xc[i];
	                    xc[j] += BASE;
	                }
	
	                xc[j] -= yc[j];
	            }
	
	            // Remove leading zeros and adjust exponent accordingly.
	            for ( ; xc[0] == 0; xc.shift(), --ye );
	
	            // Zero?
	            if ( !xc[0] ) {
	
	                // Following IEEE 754 (2008) 6.3,
	                // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
	                y.s = ROUNDING_MODE == 3 ? -1 : 1;
	                y.c = [ y.e = 0 ];
	                return y;
	            }
	
	            // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
	            // for finite x and y.
	            return normalise( y, xc, ye );
	        };
	
	
	        /*
	         *   n % 0 =  N
	         *   n % N =  N
	         *   n % I =  n
	         *   0 % n =  0
	         *  -0 % n = -0
	         *   0 % 0 =  N
	         *   0 % N =  N
	         *   0 % I =  0
	         *   N % n =  N
	         *   N % 0 =  N
	         *   N % N =  N
	         *   N % I =  N
	         *   I % n =  N
	         *   I % 0 =  N
	         *   I % N =  N
	         *   I % I =  N
	         *
	         * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
	         * BigNumber(y, b). The result depends on the value of MODULO_MODE.
	         */
	        P.modulo = P.mod = function ( y, b ) {
	            var q, s,
	                x = this;
	
	            id = 11;
	            y = new BigNumber( y, b );
	
	            // Return NaN if x is Infinity or NaN, or y is NaN or zero.
	            if ( !x.c || !y.s || y.c && !y.c[0] ) {
	                return new BigNumber(NaN);
	
	            // Return x if y is Infinity or x is zero.
	            } else if ( !y.c || x.c && !x.c[0] ) {
	                return new BigNumber(x);
	            }
	
	            if ( MODULO_MODE == 9 ) {
	
	                // Euclidian division: q = sign(y) * floor(x / abs(y))
	                // r = x - qy    where  0 <= r < abs(y)
	                s = y.s;
	                y.s = 1;
	                q = div( x, y, 0, 3 );
	                y.s = s;
	                q.s *= s;
	            } else {
	                q = div( x, y, 0, MODULO_MODE );
	            }
	
	            return x.minus( q.times(y) );
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the value of this BigNumber negated,
	         * i.e. multiplied by -1.
	         */
	        P.negated = P.neg = function () {
	            var x = new BigNumber(this);
	            x.s = -x.s || null;
	            return x;
	        };
	
	
	        /*
	         *  n + 0 = n
	         *  n + N = N
	         *  n + I = I
	         *  0 + n = n
	         *  0 + 0 = 0
	         *  0 + N = N
	         *  0 + I = I
	         *  N + n = N
	         *  N + 0 = N
	         *  N + N = N
	         *  N + I = N
	         *  I + n = I
	         *  I + 0 = I
	         *  I + N = N
	         *  I + I = I
	         *
	         * Return a new BigNumber whose value is the value of this BigNumber plus the value of
	         * BigNumber(y, b).
	         */
	        P.plus = P.add = function ( y, b ) {
	            var t,
	                x = this,
	                a = x.s;
	
	            id = 12;
	            y = new BigNumber( y, b );
	            b = y.s;
	
	            // Either NaN?
	            if ( !a || !b ) return new BigNumber(NaN);
	
	            // Signs differ?
	             if ( a != b ) {
	                y.s = -b;
	                return x.minus(y);
	            }
	
	            var xe = x.e / LOG_BASE,
	                ye = y.e / LOG_BASE,
	                xc = x.c,
	                yc = y.c;
	
	            if ( !xe || !ye ) {
	
	                // Return ±Infinity if either ±Infinity.
	                if ( !xc || !yc ) return new BigNumber( a / 0 );
	
	                // Either zero?
	                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
	                if ( !xc[0] || !yc[0] ) return yc[0] ? y : new BigNumber( xc[0] ? x : a * 0 );
	            }
	
	            xe = bitFloor(xe);
	            ye = bitFloor(ye);
	            xc = xc.slice();
	
	            // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
	            if ( a = xe - ye ) {
	                if ( a > 0 ) {
	                    ye = xe;
	                    t = yc;
	                } else {
	                    a = -a;
	                    t = xc;
	                }
	
	                t.reverse();
	                for ( ; a--; t.push(0) );
	                t.reverse();
	            }
	
	            a = xc.length;
	            b = yc.length;
	
	            // Point xc to the longer array, and b to the shorter length.
	            if ( a - b < 0 ) t = yc, yc = xc, xc = t, b = a;
	
	            // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
	            for ( a = 0; b; ) {
	                a = ( xc[--b] = xc[b] + yc[b] + a ) / BASE | 0;
	                xc[b] %= BASE;
	            }
	
	            if (a) {
	                xc.unshift(a);
	                ++ye;
	            }
	
	            // No need to check for zero, as +x + +y != 0 && -x + -y != 0
	            // ye = MAX_EXP + 1 possible
	            return normalise( y, xc, ye );
	        };
	
	
	        /*
	         * Return the number of significant digits of the value of this BigNumber.
	         *
	         * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
	         */
	        P.precision = P.sd = function (z) {
	            var n, v,
	                x = this,
	                c = x.c;
	
	            // 'precision() argument not a boolean or binary digit: {z}'
	            if ( z != null && z !== !!z && z !== 1 && z !== 0 ) {
	                if (ERRORS) raise( 13, 'argument' + notBool, z );
	                if ( z != !!z ) z = null;
	            }
	
	            if ( !c ) return null;
	            v = c.length - 1;
	            n = v * LOG_BASE + 1;
	
	            if ( v = c[v] ) {
	
	                // Subtract the number of trailing zeros of the last element.
	                for ( ; v % 10 == 0; v /= 10, n-- );
	
	                // Add the number of digits of the first element.
	                for ( v = c[0]; v >= 10; v /= 10, n++ );
	            }
	
	            if ( z && x.e + 1 > n ) n = x.e + 1;
	
	            return n;
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of
	         * dp decimal places using rounding mode rm, or to 0 and ROUNDING_MODE respectively if
	         * omitted.
	         *
	         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	         *
	         * 'round() decimal places out of range: {dp}'
	         * 'round() decimal places not an integer: {dp}'
	         * 'round() rounding mode not an integer: {rm}'
	         * 'round() rounding mode out of range: {rm}'
	         */
	        P.round = function ( dp, rm ) {
	            var n = new BigNumber(this);
	
	            if ( dp == null || isValidInt( dp, 0, MAX, 15 ) ) {
	                round( n, ~~dp + this.e + 1, rm == null ||
	                  !isValidInt( rm, 0, 8, 15, roundingMode ) ? ROUNDING_MODE : rm | 0 );
	            }
	
	            return n;
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
	         * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
	         *
	         * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
	         *
	         * If k is out of range and ERRORS is false, the result will be ±0 if k < 0, or ±Infinity
	         * otherwise.
	         *
	         * 'shift() argument not an integer: {k}'
	         * 'shift() argument out of range: {k}'
	         */
	        P.shift = function (k) {
	            var n = this;
	            return isValidInt( k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER, 16, 'argument' )
	
	              // k < 1e+21, or truncate(k) will produce exponential notation.
	              ? n.times( '1e' + truncate(k) )
	              : new BigNumber( n.c && n.c[0] && ( k < -MAX_SAFE_INTEGER || k > MAX_SAFE_INTEGER )
	                ? n.s * ( k < 0 ? 0 : 1 / 0 )
	                : n );
	        };
	
	
	        /*
	         *  sqrt(-n) =  N
	         *  sqrt( N) =  N
	         *  sqrt(-I) =  N
	         *  sqrt( I) =  I
	         *  sqrt( 0) =  0
	         *  sqrt(-0) = -0
	         *
	         * Return a new BigNumber whose value is the square root of the value of this BigNumber,
	         * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
	         */
	        P.squareRoot = P.sqrt = function () {
	            var m, n, r, rep, t,
	                x = this,
	                c = x.c,
	                s = x.s,
	                e = x.e,
	                dp = DECIMAL_PLACES + 4,
	                half = new BigNumber('0.5');
	
	            // Negative/NaN/Infinity/zero?
	            if ( s !== 1 || !c || !c[0] ) {
	                return new BigNumber( !s || s < 0 && ( !c || c[0] ) ? NaN : c ? x : 1 / 0 );
	            }
	
	            // Initial estimate.
	            s = Math.sqrt( +x );
	
	            // Math.sqrt underflow/overflow?
	            // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
	            if ( s == 0 || s == 1 / 0 ) {
	                n = coeffToString(c);
	                if ( ( n.length + e ) % 2 == 0 ) n += '0';
	                s = Math.sqrt(n);
	                e = bitFloor( ( e + 1 ) / 2 ) - ( e < 0 || e % 2 );
	
	                if ( s == 1 / 0 ) {
	                    n = '1e' + e;
	                } else {
	                    n = s.toExponential();
	                    n = n.slice( 0, n.indexOf('e') + 1 ) + e;
	                }
	
	                r = new BigNumber(n);
	            } else {
	                r = new BigNumber( s + '' );
	            }
	
	            // Check for zero.
	            // r could be zero if MIN_EXP is changed after the this value was created.
	            // This would cause a division by zero (x/t) and hence Infinity below, which would cause
	            // coeffToString to throw.
	            if ( r.c[0] ) {
	                e = r.e;
	                s = e + dp;
	                if ( s < 3 ) s = 0;
	
	                // Newton-Raphson iteration.
	                for ( ; ; ) {
	                    t = r;
	                    r = half.times( t.plus( div( x, t, dp, 1 ) ) );
	
	                    if ( coeffToString( t.c   ).slice( 0, s ) === ( n =
	                         coeffToString( r.c ) ).slice( 0, s ) ) {
	
	                        // The exponent of r may here be one less than the final result exponent,
	                        // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
	                        // are indexed correctly.
	                        if ( r.e < e ) --s;
	                        n = n.slice( s - 3, s + 1 );
	
	                        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
	                        // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
	                        // iteration.
	                        if ( n == '9999' || !rep && n == '4999' ) {
	
	                            // On the first iteration only, check to see if rounding up gives the
	                            // exact result as the nines may infinitely repeat.
	                            if ( !rep ) {
	                                round( t, t.e + DECIMAL_PLACES + 2, 0 );
	
	                                if ( t.times(t).eq(x) ) {
	                                    r = t;
	                                    break;
	                                }
	                            }
	
	                            dp += 4;
	                            s += 4;
	                            rep = 1;
	                        } else {
	
	                            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
	                            // result. If not, then there are further digits and m will be truthy.
	                            if ( !+n || !+n.slice(1) && n.charAt(0) == '5' ) {
	
	                                // Truncate to the first rounding digit.
	                                round( r, r.e + DECIMAL_PLACES + 2, 1 );
	                                m = !r.times(r).eq(x);
	                            }
	
	                            break;
	                        }
	                    }
	                }
	            }
	
	            return round( r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m );
	        };
	
	
	        /*
	         *  n * 0 = 0
	         *  n * N = N
	         *  n * I = I
	         *  0 * n = 0
	         *  0 * 0 = 0
	         *  0 * N = N
	         *  0 * I = N
	         *  N * n = N
	         *  N * 0 = N
	         *  N * N = N
	         *  N * I = N
	         *  I * n = I
	         *  I * 0 = N
	         *  I * N = N
	         *  I * I = I
	         *
	         * Return a new BigNumber whose value is the value of this BigNumber times the value of
	         * BigNumber(y, b).
	         */
	        P.times = P.mul = function ( y, b ) {
	            var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
	                base, sqrtBase,
	                x = this,
	                xc = x.c,
	                yc = ( id = 17, y = new BigNumber( y, b ) ).c;
	
	            // Either NaN, ±Infinity or ±0?
	            if ( !xc || !yc || !xc[0] || !yc[0] ) {
	
	                // Return NaN if either is NaN, or one is 0 and the other is Infinity.
	                if ( !x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc ) {
	                    y.c = y.e = y.s = null;
	                } else {
	                    y.s *= x.s;
	
	                    // Return ±Infinity if either is ±Infinity.
	                    if ( !xc || !yc ) {
	                        y.c = y.e = null;
	
	                    // Return ±0 if either is ±0.
	                    } else {
	                        y.c = [0];
	                        y.e = 0;
	                    }
	                }
	
	                return y;
	            }
	
	            e = bitFloor( x.e / LOG_BASE ) + bitFloor( y.e / LOG_BASE );
	            y.s *= x.s;
	            xcL = xc.length;
	            ycL = yc.length;
	
	            // Ensure xc points to longer array and xcL to its length.
	            if ( xcL < ycL ) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;
	
	            // Initialise the result array with zeros.
	            for ( i = xcL + ycL, zc = []; i--; zc.push(0) );
	
	            base = BASE;
	            sqrtBase = SQRT_BASE;
	
	            for ( i = ycL; --i >= 0; ) {
	                c = 0;
	                ylo = yc[i] % sqrtBase;
	                yhi = yc[i] / sqrtBase | 0;
	
	                for ( k = xcL, j = i + k; j > i; ) {
	                    xlo = xc[--k] % sqrtBase;
	                    xhi = xc[k] / sqrtBase | 0;
	                    m = yhi * xlo + xhi * ylo;
	                    xlo = ylo * xlo + ( ( m % sqrtBase ) * sqrtBase ) + zc[j] + c;
	                    c = ( xlo / base | 0 ) + ( m / sqrtBase | 0 ) + yhi * xhi;
	                    zc[j--] = xlo % base;
	                }
	
	                zc[j] = c;
	            }
	
	            if (c) {
	                ++e;
	            } else {
	                zc.shift();
	            }
	
	            return normalise( y, zc, e );
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of
	         * sd significant digits using rounding mode rm, or ROUNDING_MODE if rm is omitted.
	         *
	         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
	         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	         *
	         * 'toDigits() precision out of range: {sd}'
	         * 'toDigits() precision not an integer: {sd}'
	         * 'toDigits() rounding mode not an integer: {rm}'
	         * 'toDigits() rounding mode out of range: {rm}'
	         */
	        P.toDigits = function ( sd, rm ) {
	            var n = new BigNumber(this);
	            sd = sd == null || !isValidInt( sd, 1, MAX, 18, 'precision' ) ? null : sd | 0;
	            rm = rm == null || !isValidInt( rm, 0, 8, 18, roundingMode ) ? ROUNDING_MODE : rm | 0;
	            return sd ? round( n, sd, rm ) : n;
	        };
	
	
	        /*
	         * Return a string representing the value of this BigNumber in exponential notation and
	         * rounded using ROUNDING_MODE to dp fixed decimal places.
	         *
	         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	         *
	         * 'toExponential() decimal places not an integer: {dp}'
	         * 'toExponential() decimal places out of range: {dp}'
	         * 'toExponential() rounding mode not an integer: {rm}'
	         * 'toExponential() rounding mode out of range: {rm}'
	         */
	        P.toExponential = function ( dp, rm ) {
	            return format( this,
	              dp != null && isValidInt( dp, 0, MAX, 19 ) ? ~~dp + 1 : null, rm, 19 );
	        };
	
	
	        /*
	         * Return a string representing the value of this BigNumber in fixed-point notation rounding
	         * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
	         *
	         * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
	         * but e.g. (-0.00001).toFixed(0) is '-0'.
	         *
	         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	         *
	         * 'toFixed() decimal places not an integer: {dp}'
	         * 'toFixed() decimal places out of range: {dp}'
	         * 'toFixed() rounding mode not an integer: {rm}'
	         * 'toFixed() rounding mode out of range: {rm}'
	         */
	        P.toFixed = function ( dp, rm ) {
	            return format( this, dp != null && isValidInt( dp, 0, MAX, 20 )
	              ? ~~dp + this.e + 1 : null, rm, 20 );
	        };
	
	
	        /*
	         * Return a string representing the value of this BigNumber in fixed-point notation rounded
	         * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
	         * of the FORMAT object (see BigNumber.config).
	         *
	         * FORMAT = {
	         *      decimalSeparator : '.',
	         *      groupSeparator : ',',
	         *      groupSize : 3,
	         *      secondaryGroupSize : 0,
	         *      fractionGroupSeparator : '\xA0',    // non-breaking space
	         *      fractionGroupSize : 0
	         * };
	         *
	         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	         *
	         * 'toFormat() decimal places not an integer: {dp}'
	         * 'toFormat() decimal places out of range: {dp}'
	         * 'toFormat() rounding mode not an integer: {rm}'
	         * 'toFormat() rounding mode out of range: {rm}'
	         */
	        P.toFormat = function ( dp, rm ) {
	            var str = format( this, dp != null && isValidInt( dp, 0, MAX, 21 )
	              ? ~~dp + this.e + 1 : null, rm, 21 );
	
	            if ( this.c ) {
	                var i,
	                    arr = str.split('.'),
	                    g1 = +FORMAT.groupSize,
	                    g2 = +FORMAT.secondaryGroupSize,
	                    groupSeparator = FORMAT.groupSeparator,
	                    intPart = arr[0],
	                    fractionPart = arr[1],
	                    isNeg = this.s < 0,
	                    intDigits = isNeg ? intPart.slice(1) : intPart,
	                    len = intDigits.length;
	
	                if (g2) i = g1, g1 = g2, g2 = i, len -= i;
	
	                if ( g1 > 0 && len > 0 ) {
	                    i = len % g1 || g1;
	                    intPart = intDigits.substr( 0, i );
	
	                    for ( ; i < len; i += g1 ) {
	                        intPart += groupSeparator + intDigits.substr( i, g1 );
	                    }
	
	                    if ( g2 > 0 ) intPart += groupSeparator + intDigits.slice(i);
	                    if (isNeg) intPart = '-' + intPart;
	                }
	
	                str = fractionPart
	                  ? intPart + FORMAT.decimalSeparator + ( ( g2 = +FORMAT.fractionGroupSize )
	                    ? fractionPart.replace( new RegExp( '\\d{' + g2 + '}\\B', 'g' ),
	                      '$&' + FORMAT.fractionGroupSeparator )
	                    : fractionPart )
	                  : intPart;
	            }
	
	            return str;
	        };
	
	
	        /*
	         * Return a string array representing the value of this BigNumber as a simple fraction with
	         * an integer numerator and an integer denominator. The denominator will be a positive
	         * non-zero value less than or equal to the specified maximum denominator. If a maximum
	         * denominator is not specified, the denominator will be the lowest value necessary to
	         * represent the number exactly.
	         *
	         * [md] {number|string|BigNumber} Integer >= 1 and < Infinity. The maximum denominator.
	         *
	         * 'toFraction() max denominator not an integer: {md}'
	         * 'toFraction() max denominator out of range: {md}'
	         */
	        P.toFraction = function (md) {
	            var arr, d0, d2, e, exp, n, n0, q, s,
	                k = ERRORS,
	                x = this,
	                xc = x.c,
	                d = new BigNumber(ONE),
	                n1 = d0 = new BigNumber(ONE),
	                d1 = n0 = new BigNumber(ONE);
	
	            if ( md != null ) {
	                ERRORS = false;
	                n = new BigNumber(md);
	                ERRORS = k;
	
	                if ( !( k = n.isInt() ) || n.lt(ONE) ) {
	
	                    if (ERRORS) {
	                        raise( 22,
	                          'max denominator ' + ( k ? 'out of range' : 'not an integer' ), md );
	                    }
	
	                    // ERRORS is false:
	                    // If md is a finite non-integer >= 1, round it to an integer and use it.
	                    md = !k && n.c && round( n, n.e + 1, 1 ).gte(ONE) ? n : null;
	                }
	            }
	
	            if ( !xc ) return x.toString();
	            s = coeffToString(xc);
	
	            // Determine initial denominator.
	            // d is a power of 10 and the minimum max denominator that specifies the value exactly.
	            e = d.e = s.length - x.e - 1;
	            d.c[0] = POWS_TEN[ ( exp = e % LOG_BASE ) < 0 ? LOG_BASE + exp : exp ];
	            md = !md || n.cmp(d) > 0 ? ( e > 0 ? d : n1 ) : n;
	
	            exp = MAX_EXP;
	            MAX_EXP = 1 / 0;
	            n = new BigNumber(s);
	
	            // n0 = d1 = 0
	            n0.c[0] = 0;
	
	            for ( ; ; )  {
	                q = div( n, d, 0, 1 );
	                d2 = d0.plus( q.times(d1) );
	                if ( d2.cmp(md) == 1 ) break;
	                d0 = d1;
	                d1 = d2;
	                n1 = n0.plus( q.times( d2 = n1 ) );
	                n0 = d2;
	                d = n.minus( q.times( d2 = d ) );
	                n = d2;
	            }
	
	            d2 = div( md.minus(d0), d1, 0, 1 );
	            n0 = n0.plus( d2.times(n1) );
	            d0 = d0.plus( d2.times(d1) );
	            n0.s = n1.s = x.s;
	            e *= 2;
	
	            // Determine which fraction is closer to x, n0/d0 or n1/d1
	            arr = div( n1, d1, e, ROUNDING_MODE ).minus(x).abs().cmp(
	                  div( n0, d0, e, ROUNDING_MODE ).minus(x).abs() ) < 1
	                    ? [ n1.toString(), d1.toString() ]
	                    : [ n0.toString(), d0.toString() ];
	
	            MAX_EXP = exp;
	            return arr;
	        };
	
	
	        /*
	         * Return the value of this BigNumber converted to a number primitive.
	         */
	        P.toNumber = function () {
	            var x = this;
	
	            // Ensure zero has correct sign.
	            return +x || ( x.s ? x.s * 0 : NaN );
	        };
	
	
	        /*
	         * Return a BigNumber whose value is the value of this BigNumber raised to the power n.
	         * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
	         * If POW_PRECISION is not 0, round to POW_PRECISION using ROUNDING_MODE.
	         *
	         * n {number} Integer, -9007199254740992 to 9007199254740992 inclusive.
	         * (Performs 54 loop iterations for n of 9007199254740992.)
	         *
	         * 'pow() exponent not an integer: {n}'
	         * 'pow() exponent out of range: {n}'
	         */
	        P.toPower = P.pow = function (n) {
	            var k, y,
	                i = mathfloor( n < 0 ? -n : +n ),
	                x = this;
	
	            // Pass ±Infinity to Math.pow if exponent is out of range.
	            if ( !isValidInt( n, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER, 23, 'exponent' ) &&
	              ( !isFinite(n) || i > MAX_SAFE_INTEGER && ( n /= 0 ) ||
	                parseFloat(n) != n && !( n = NaN ) ) ) {
	                return new BigNumber( Math.pow( +x, n ) );
	            }
	
	            // Truncating each coefficient array to a length of k after each multiplication equates
	            // to truncating significant digits to POW_PRECISION + [28, 41], i.e. there will be a
	            // minimum of 28 guard digits retained. (Using + 1.5 would give [9, 21] guard digits.)
	            k = POW_PRECISION ? mathceil( POW_PRECISION / LOG_BASE + 2 ) : 0;
	            y = new BigNumber(ONE);
	
	            for ( ; ; ) {
	
	                if ( i % 2 ) {
	                    y = y.times(x);
	                    if ( !y.c ) break;
	                    if ( k && y.c.length > k ) y.c.length = k;
	                }
	
	                i = mathfloor( i / 2 );
	                if ( !i ) break;
	
	                x = x.times(x);
	                if ( k && x.c && x.c.length > k ) x.c.length = k;
	            }
	
	            if ( n < 0 ) y = ONE.div(y);
	            return k ? round( y, POW_PRECISION, ROUNDING_MODE ) : y;
	        };
	
	
	        /*
	         * Return a string representing the value of this BigNumber rounded to sd significant digits
	         * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
	         * necessary to represent the integer part of the value in fixed-point notation, then use
	         * exponential notation.
	         *
	         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
	         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	         *
	         * 'toPrecision() precision not an integer: {sd}'
	         * 'toPrecision() precision out of range: {sd}'
	         * 'toPrecision() rounding mode not an integer: {rm}'
	         * 'toPrecision() rounding mode out of range: {rm}'
	         */
	        P.toPrecision = function ( sd, rm ) {
	            return format( this, sd != null && isValidInt( sd, 1, MAX, 24, 'precision' )
	              ? sd | 0 : null, rm, 24 );
	        };
	
	
	        /*
	         * Return a string representing the value of this BigNumber in base b, or base 10 if b is
	         * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
	         * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
	         * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
	         * TO_EXP_NEG, return exponential notation.
	         *
	         * [b] {number} Integer, 2 to 64 inclusive.
	         *
	         * 'toString() base not an integer: {b}'
	         * 'toString() base out of range: {b}'
	         */
	        P.toString = function (b) {
	            var str,
	                n = this,
	                s = n.s,
	                e = n.e;
	
	            // Infinity or NaN?
	            if ( e === null ) {
	
	                if (s) {
	                    str = 'Infinity';
	                    if ( s < 0 ) str = '-' + str;
	                } else {
	                    str = 'NaN';
	                }
	            } else {
	                str = coeffToString( n.c );
	
	                if ( b == null || !isValidInt( b, 2, 64, 25, 'base' ) ) {
	                    str = e <= TO_EXP_NEG || e >= TO_EXP_POS
	                      ? toExponential( str, e )
	                      : toFixedPoint( str, e );
	                } else {
	                    str = convertBase( toFixedPoint( str, e ), b | 0, 10, s );
	                }
	
	                if ( s < 0 && n.c[0] ) str = '-' + str;
	            }
	
	            return str;
	        };
	
	
	        /*
	         * Return a new BigNumber whose value is the value of this BigNumber truncated to a whole
	         * number.
	         */
	        P.truncated = P.trunc = function () {
	            return round( new BigNumber(this), this.e + 1, 1 );
	        };
	
	
	
	        /*
	         * Return as toString, but do not accept a base argument.
	         */
	        P.valueOf = P.toJSON = function () {
	            return this.toString();
	        };
	
	
	        // Aliases for BigDecimal methods.
	        //P.add = P.plus;         // P.add included above
	        //P.subtract = P.minus;   // P.sub included above
	        //P.multiply = P.times;   // P.mul included above
	        //P.divide = P.div;
	        //P.remainder = P.mod;
	        //P.compareTo = P.cmp;
	        //P.negate = P.neg;
	
	
	        if ( configObj != null ) BigNumber.config(configObj);
	
	        return BigNumber;
	    }
	
	
	    // PRIVATE HELPER FUNCTIONS
	
	
	    function bitFloor(n) {
	        var i = n | 0;
	        return n > 0 || n === i ? i : i - 1;
	    }
	
	
	    // Return a coefficient array as a string of base 10 digits.
	    function coeffToString(a) {
	        var s, z,
	            i = 1,
	            j = a.length,
	            r = a[0] + '';
	
	        for ( ; i < j; ) {
	            s = a[i++] + '';
	            z = LOG_BASE - s.length;
	            for ( ; z--; s = '0' + s );
	            r += s;
	        }
	
	        // Determine trailing zeros.
	        for ( j = r.length; r.charCodeAt(--j) === 48; );
	        return r.slice( 0, j + 1 || 1 );
	    }
	
	
	    // Compare the value of BigNumbers x and y.
	    function compare( x, y ) {
	        var a, b,
	            xc = x.c,
	            yc = y.c,
	            i = x.s,
	            j = y.s,
	            k = x.e,
	            l = y.e;
	
	        // Either NaN?
	        if ( !i || !j ) return null;
	
	        a = xc && !xc[0];
	        b = yc && !yc[0];
	
	        // Either zero?
	        if ( a || b ) return a ? b ? 0 : -j : i;
	
	        // Signs differ?
	        if ( i != j ) return i;
	
	        a = i < 0;
	        b = k == l;
	
	        // Either Infinity?
	        if ( !xc || !yc ) return b ? 0 : !xc ^ a ? 1 : -1;
	
	        // Compare exponents.
	        if ( !b ) return k > l ^ a ? 1 : -1;
	
	        j = ( k = xc.length ) < ( l = yc.length ) ? k : l;
	
	        // Compare digit by digit.
	        for ( i = 0; i < j; i++ ) if ( xc[i] != yc[i] ) return xc[i] > yc[i] ^ a ? 1 : -1;
	
	        // Compare lengths.
	        return k == l ? 0 : k > l ^ a ? 1 : -1;
	    }
	
	
	    /*
	     * Return true if n is a valid number in range, otherwise false.
	     * Use for argument validation when ERRORS is false.
	     * Note: parseInt('1e+1') == 1 but parseFloat('1e+1') == 10.
	     */
	    function intValidatorNoErrors( n, min, max ) {
	        return ( n = truncate(n) ) >= min && n <= max;
	    }
	
	
	    function isArray(obj) {
	        return Object.prototype.toString.call(obj) == '[object Array]';
	    }
	
	
	    /*
	     * Convert string of baseIn to an array of numbers of baseOut.
	     * Eg. convertBase('255', 10, 16) returns [15, 15].
	     * Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
	     */
	    function toBaseOut( str, baseIn, baseOut ) {
	        var j,
	            arr = [0],
	            arrL,
	            i = 0,
	            len = str.length;
	
	        for ( ; i < len; ) {
	            for ( arrL = arr.length; arrL--; arr[arrL] *= baseIn );
	            arr[ j = 0 ] += ALPHABET.indexOf( str.charAt( i++ ) );
	
	            for ( ; j < arr.length; j++ ) {
	
	                if ( arr[j] > baseOut - 1 ) {
	                    if ( arr[j + 1] == null ) arr[j + 1] = 0;
	                    arr[j + 1] += arr[j] / baseOut | 0;
	                    arr[j] %= baseOut;
	                }
	            }
	        }
	
	        return arr.reverse();
	    }
	
	
	    function toExponential( str, e ) {
	        return ( str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str ) +
	          ( e < 0 ? 'e' : 'e+' ) + e;
	    }
	
	
	    function toFixedPoint( str, e ) {
	        var len, z;
	
	        // Negative exponent?
	        if ( e < 0 ) {
	
	            // Prepend zeros.
	            for ( z = '0.'; ++e; z += '0' );
	            str = z + str;
	
	        // Positive exponent
	        } else {
	            len = str.length;
	
	            // Append zeros.
	            if ( ++e > len ) {
	                for ( z = '0', e -= len; --e; z += '0' );
	                str += z;
	            } else if ( e < len ) {
	                str = str.slice( 0, e ) + '.' + str.slice(e);
	            }
	        }
	
	        return str;
	    }
	
	
	    function truncate(n) {
	        n = parseFloat(n);
	        return n < 0 ? mathceil(n) : mathfloor(n);
	    }
	
	
	    // EXPORT
	
	
	    BigNumber = another();
	
	    // AMD.
	    if ( true ) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () { return BigNumber; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	    // Node and other environments that support module.exports.
	    } else if ( typeof module != 'undefined' && module.exports ) {
	        module.exports = BigNumber;
	        if ( !crypto ) try { crypto = require('crypto'); } catch (e) {}
	
	    // Browser.
	    } else {
	        global.BigNumber = BigNumber;
	    }
	})(this);


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (undefined) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var X32WordArray = C_lib.WordArray;
	
		    /**
		     * x64 namespace.
		     */
		    var C_x64 = C.x64 = {};
	
		    /**
		     * A 64-bit word.
		     */
		    var X64Word = C_x64.Word = Base.extend({
		        /**
		         * Initializes a newly created 64-bit word.
		         *
		         * @param {number} high The high 32 bits.
		         * @param {number} low The low 32 bits.
		         *
		         * @example
		         *
		         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
		         */
		        init: function (high, low) {
		            this.high = high;
		            this.low = low;
		        }
	
		        /**
		         * Bitwise NOTs this word.
		         *
		         * @return {X64Word} A new x64-Word object after negating.
		         *
		         * @example
		         *
		         *     var negated = x64Word.not();
		         */
		        // not: function () {
		            // var high = ~this.high;
		            // var low = ~this.low;
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Bitwise ANDs this word with the passed word.
		         *
		         * @param {X64Word} word The x64-Word to AND with this word.
		         *
		         * @return {X64Word} A new x64-Word object after ANDing.
		         *
		         * @example
		         *
		         *     var anded = x64Word.and(anotherX64Word);
		         */
		        // and: function (word) {
		            // var high = this.high & word.high;
		            // var low = this.low & word.low;
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Bitwise ORs this word with the passed word.
		         *
		         * @param {X64Word} word The x64-Word to OR with this word.
		         *
		         * @return {X64Word} A new x64-Word object after ORing.
		         *
		         * @example
		         *
		         *     var ored = x64Word.or(anotherX64Word);
		         */
		        // or: function (word) {
		            // var high = this.high | word.high;
		            // var low = this.low | word.low;
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Bitwise XORs this word with the passed word.
		         *
		         * @param {X64Word} word The x64-Word to XOR with this word.
		         *
		         * @return {X64Word} A new x64-Word object after XORing.
		         *
		         * @example
		         *
		         *     var xored = x64Word.xor(anotherX64Word);
		         */
		        // xor: function (word) {
		            // var high = this.high ^ word.high;
		            // var low = this.low ^ word.low;
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Shifts this word n bits to the left.
		         *
		         * @param {number} n The number of bits to shift.
		         *
		         * @return {X64Word} A new x64-Word object after shifting.
		         *
		         * @example
		         *
		         *     var shifted = x64Word.shiftL(25);
		         */
		        // shiftL: function (n) {
		            // if (n < 32) {
		                // var high = (this.high << n) | (this.low >>> (32 - n));
		                // var low = this.low << n;
		            // } else {
		                // var high = this.low << (n - 32);
		                // var low = 0;
		            // }
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Shifts this word n bits to the right.
		         *
		         * @param {number} n The number of bits to shift.
		         *
		         * @return {X64Word} A new x64-Word object after shifting.
		         *
		         * @example
		         *
		         *     var shifted = x64Word.shiftR(7);
		         */
		        // shiftR: function (n) {
		            // if (n < 32) {
		                // var low = (this.low >>> n) | (this.high << (32 - n));
		                // var high = this.high >>> n;
		            // } else {
		                // var low = this.high >>> (n - 32);
		                // var high = 0;
		            // }
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Rotates this word n bits to the left.
		         *
		         * @param {number} n The number of bits to rotate.
		         *
		         * @return {X64Word} A new x64-Word object after rotating.
		         *
		         * @example
		         *
		         *     var rotated = x64Word.rotL(25);
		         */
		        // rotL: function (n) {
		            // return this.shiftL(n).or(this.shiftR(64 - n));
		        // },
	
		        /**
		         * Rotates this word n bits to the right.
		         *
		         * @param {number} n The number of bits to rotate.
		         *
		         * @return {X64Word} A new x64-Word object after rotating.
		         *
		         * @example
		         *
		         *     var rotated = x64Word.rotR(7);
		         */
		        // rotR: function (n) {
		            // return this.shiftR(n).or(this.shiftL(64 - n));
		        // },
	
		        /**
		         * Adds this word with the passed word.
		         *
		         * @param {X64Word} word The x64-Word to add with this word.
		         *
		         * @return {X64Word} A new x64-Word object after adding.
		         *
		         * @example
		         *
		         *     var added = x64Word.add(anotherX64Word);
		         */
		        // add: function (word) {
		            // var low = (this.low + word.low) | 0;
		            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
		            // var high = (this.high + word.high + carry) | 0;
	
		            // return X64Word.create(high, low);
		        // }
		    });
	
		    /**
		     * An array of 64-bit words.
		     *
		     * @property {Array} words The array of CryptoJS.x64.Word objects.
		     * @property {number} sigBytes The number of significant bytes in this word array.
		     */
		    var X64WordArray = C_x64.WordArray = Base.extend({
		        /**
		         * Initializes a newly created word array.
		         *
		         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
		         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.x64.WordArray.create();
		         *
		         *     var wordArray = CryptoJS.x64.WordArray.create([
		         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
		         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
		         *     ]);
		         *
		         *     var wordArray = CryptoJS.x64.WordArray.create([
		         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
		         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
		         *     ], 10);
		         */
		        init: function (words, sigBytes) {
		            words = this.words = words || [];
	
		            if (sigBytes != undefined) {
		                this.sigBytes = sigBytes;
		            } else {
		                this.sigBytes = words.length * 8;
		            }
		        },
	
		        /**
		         * Converts this 64-bit word array to a 32-bit word array.
		         *
		         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
		         *
		         * @example
		         *
		         *     var x32WordArray = x64WordArray.toX32();
		         */
		        toX32: function () {
		            // Shortcuts
		            var x64Words = this.words;
		            var x64WordsLength = x64Words.length;
	
		            // Convert
		            var x32Words = [];
		            for (var i = 0; i < x64WordsLength; i++) {
		                var x64Word = x64Words[i];
		                x32Words.push(x64Word.high);
		                x32Words.push(x64Word.low);
		            }
	
		            return X32WordArray.create(x32Words, this.sigBytes);
		        },
	
		        /**
		         * Creates a copy of this word array.
		         *
		         * @return {X64WordArray} The clone.
		         *
		         * @example
		         *
		         *     var clone = x64WordArray.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
	
		            // Clone "words" array
		            var words = clone.words = this.words.slice(0);
	
		            // Clone each X64Word object
		            var wordsLength = words.length;
		            for (var i = 0; i < wordsLength; i++) {
		                words[i] = words[i].clone();
		            }
	
		            return clone;
		        }
		    });
		}());
	
	
		return CryptoJS;
	
	}));

/***/ },
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file config.js
	 * @authors:
	 *   Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	/**
	 * Utils
	 * 
	 * @module utils
	 */
	
	/**
	 * Utility functions
	 * 
	 * @class [utils] config
	 * @constructor
	 */
	
	
	/// required to define ETH_BIGNUMBER_ROUNDING_MODE
	var BigNumber = __webpack_require__(45);
	
	var ETH_UNITS = [
	    'wei',
	    'kwei',
	    'Mwei',
	    'Gwei',
	    'szabo',
	    'finney',
	    'femtoether',
	    'picoether',
	    'nanoether',
	    'microether',
	    'milliether',
	    'nano',
	    'micro',
	    'milli',
	    'ether',
	    'grand',
	    'Mether',
	    'Gether',
	    'Tether',
	    'Pether',
	    'Eether',
	    'Zether',
	    'Yether',
	    'Nether',
	    'Dether',
	    'Vether',
	    'Uether'
	];
	
	module.exports = {
	    ETH_PADDING: 32,
	    ETH_SIGNATURE_LENGTH: 4,
	    ETH_UNITS: ETH_UNITS,
	    ETH_BIGNUMBER_ROUNDING_MODE: { ROUNDING_MODE: BigNumber.ROUND_DOWN },
	    ETH_POLLING_TIMEOUT: 1000/2,
	    defaultBlock: 'latest',
	    defaultAccount: undefined
	};
	


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file sha3.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var CryptoJS = __webpack_require__(189);
	var sha3 = __webpack_require__(101);
	
	module.exports = function (value, options) {
	    if (options && options.encoding === 'hex') {
	        if (value.length > 2 && value.substr(0, 2) === '0x') {
	            value = value.substr(2);
	        }
	        value = CryptoJS.enc.Hex.parse(value);
	    }
	
	    return sha3(value, {
	        outputLength: 256
	    }).toString();
	};
	


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file filter.js
	 * @authors:
	 *   Jeffrey Wilcke <jeff@ethdev.com>
	 *   Marek Kotewicz <marek@ethdev.com>
	 *   Marian Oancea <marian@ethdev.com>
	 *   Fabian Vogelsteller <fabian@ethdev.com>
	 *   Gav Wood <g@ethdev.com>
	 * @date 2014
	 */
	
	var formatters = __webpack_require__(22);
	var utils = __webpack_require__(8);
	
	/**
	* Converts a given topic to a hex string, but also allows null values.
	*
	* @param {Mixed} value
	* @return {String}
	*/
	var toTopic = function(value){
	
	    if(value === null || typeof value === 'undefined')
	        return null;
	
	    value = String(value);
	
	    if(value.indexOf('0x') === 0)
	        return value;
	    else
	        return utils.fromUtf8(value);
	};
	
	/// This method should be called on options object, to verify deprecated properties && lazy load dynamic ones
	/// @param should be string or object
	/// @returns options string or object
	var getOptions = function (options) {
	
	    if (utils.isString(options)) {
	        return options;
	    } 
	
	    options = options || {};
	
	    // make sure topics, get converted to hex
	    options.topics = options.topics || [];
	    options.topics = options.topics.map(function(topic){
	        return (utils.isArray(topic)) ? topic.map(toTopic) : toTopic(topic);
	    });
	
	    // lazy load
	    return {
	        topics: options.topics,
	        to: options.to,
	        address: options.address,
	        fromBlock: formatters.inputBlockNumberFormatter(options.fromBlock),
	        toBlock: formatters.inputBlockNumberFormatter(options.toBlock) 
	    }; 
	};
	
	/**
	Adds the callback and sets up the methods, to iterate over the results.
	
	@method getLogsAtStart
	@param {Object} self
	@param {funciton} 
	*/
	var getLogsAtStart = function(self, callback){
	    // call getFilterLogs for the first watch callback start
	    if (!utils.isString(self.options)) {
	        self.get(function (err, messages) {
	            // don't send all the responses to all the watches again... just to self one
	            if (err) {
	                callback(err);
	            }
	
	            if(utils.isArray(messages)) {
	                messages.forEach(function (message) {
	                    callback(null, message);
	                });
	            }
	        });
	    }
	};
	
	/**
	Adds the callback and sets up the methods, to iterate over the results.
	
	@method pollFilter
	@param {Object} self
	*/
	var pollFilter = function(self) {
	
	    var onMessage = function (error, messages) {
	        if (error) {
	            return self.callbacks.forEach(function (callback) {
	                callback(error);
	            });
	        }
	
	        if(utils.isArray(messages)) {
	            messages.forEach(function (message) {
	                message = self.formatter ? self.formatter(message) : message;
	                self.callbacks.forEach(function (callback) {
	                    callback(null, message);
	                });
	            });
	        }
	    };
	
	    self.requestManager.startPolling({
	        method: self.implementation.poll.call,
	        params: [self.filterId],
	    }, self.filterId, onMessage, self.stopWatching.bind(self));
	
	};
	
	var Filter = function (requestManager, options, methods, formatter, callback) {
	    var self = this;
	    var implementation = {};
	    methods.forEach(function (method) {
	        method.setRequestManager(requestManager);
	        method.attachToObject(implementation);
	    });
	    this.requestManager = requestManager;
	    this.options = getOptions(options);
	    this.implementation = implementation;
	    this.filterId = null;
	    this.callbacks = [];
	    this.getLogsCallbacks = [];
	    this.pollFilters = [];
	    this.formatter = formatter;
	    this.implementation.newFilter(this.options, function(error, id){
	        if(error) {
	            self.callbacks.forEach(function(cb){
	                cb(error);
	            });
	        } else {
	            self.filterId = id;
	
	            // check if there are get pending callbacks as a consequence
	            // of calling get() with filterId unassigned.
	            self.getLogsCallbacks.forEach(function (cb){
	                self.get(cb);
	            });
	            self.getLogsCallbacks = [];
	
	            // get filter logs for the already existing watch calls
	            self.callbacks.forEach(function(cb){
	                getLogsAtStart(self, cb);
	            });
	            if(self.callbacks.length > 0)
	                pollFilter(self);
	
	            // start to watch immediately
	            if(callback) {
	                return self.watch(callback);
	            }
	        }
	    });
	
	    return this;
	};
	
	Filter.prototype.watch = function (callback) {
	    this.callbacks.push(callback);
	
	    if(this.filterId) {
	        getLogsAtStart(this, callback);
	        pollFilter(this);
	    }
	
	    return this;
	};
	
	Filter.prototype.stopWatching = function () {
	    this.requestManager.stopPolling(this.filterId);
	    // remove filter async
	    this.implementation.uninstallFilter(this.filterId, function(){});
	    this.callbacks = [];
	};
	
	Filter.prototype.get = function (callback) {
	    var self = this;
	    if (utils.isFunction(callback)) {
	        if (this.filterId === null) {
	            // If filterId is not set yet, call it back
	            // when newFilter() assigns it.
	            this.getLogsCallbacks.push(callback);
	        } else {
	            this.implementation.getLogs(this.filterId, function(err, res){
	                if (err) {
	                    callback(err);
	                } else {
	                    callback(null, res.map(function (log) {
	                        return self.formatter ? self.formatter(log) : log;
	                    }));
	                }
	            });
	        }
	    } else {
	        if (this.filterId === null) {
	            throw new Error('Filter ID Error: filter().get() can\'t be chained synchronous, please provide a callback for the get() method.');
	        }
	        var logs = this.implementation.getLogs(this.filterId);
	        return logs.map(function (log) {
	            return self.formatter ? self.formatter(log) : log;
	        });
	    }
	
	    return this;
	};
	
	module.exports = Filter;
	


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file iban.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var BigNumber = __webpack_require__(45);
	
	var padLeft = function (string, bytes) {
	    var result = string;
	    while (result.length < bytes * 2) {
	        result = '00' + result;
	    }
	    return result;
	};
	
	/**
	 * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
	 * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
	 *
	 * @method iso13616Prepare
	 * @param {String} iban the IBAN
	 * @returns {String} the prepared IBAN
	 */
	var iso13616Prepare = function (iban) {
	    var A = 'A'.charCodeAt(0);
	    var Z = 'Z'.charCodeAt(0);
	
	    iban = iban.toUpperCase();
	    iban = iban.substr(4) + iban.substr(0,4);
	
	    return iban.split('').map(function(n){
	        var code = n.charCodeAt(0);
	        if (code >= A && code <= Z){
	            // A = 10, B = 11, ... Z = 35
	            return code - A + 10;
	        } else {
	            return n;
	        }
	    }).join('');
	};
	
	/**
	 * Calculates the MOD 97 10 of the passed IBAN as specified in ISO7064.
	 *
	 * @method mod9710
	 * @param {String} iban
	 * @returns {Number}
	 */
	var mod9710 = function (iban) {
	    var remainder = iban,
	        block;
	
	    while (remainder.length > 2){
	        block = remainder.slice(0, 9);
	        remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
	    }
	
	    return parseInt(remainder, 10) % 97;
	};
	
	/**
	 * This prototype should be used to create iban object from iban correct string
	 *
	 * @param {String} iban
	 */
	var Iban = function (iban) {
	    this._iban = iban;
	};
	
	/**
	 * This method should be used to create iban object from ethereum address
	 *
	 * @method fromAddress
	 * @param {String} address
	 * @return {Iban} the IBAN object
	 */
	Iban.fromAddress = function (address) {
	    var asBn = new BigNumber(address, 16);
	    var base36 = asBn.toString(36);
	    var padded = padLeft(base36, 15);
	    return Iban.fromBban(padded.toUpperCase());
	};
	
	/**
	 * Convert the passed BBAN to an IBAN for this country specification.
	 * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
	 * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
	 *
	 * @method fromBban
	 * @param {String} bban the BBAN to convert to IBAN
	 * @returns {Iban} the IBAN object
	 */
	Iban.fromBban = function (bban) {
	    var countryCode = 'XE';
	
	    var remainder = mod9710(iso13616Prepare(countryCode + '00' + bban));
	    var checkDigit = ('0' + (98 - remainder)).slice(-2);
	
	    return new Iban(countryCode + checkDigit + bban);
	};
	
	/**
	 * Should be used to create IBAN object for given institution and identifier
	 *
	 * @method createIndirect
	 * @param {Object} options, required options are "institution" and "identifier"
	 * @return {Iban} the IBAN object
	 */
	Iban.createIndirect = function (options) {
	    return Iban.fromBban('ETH' + options.institution + options.identifier);
	};
	
	/**
	 * Thos method should be used to check if given string is valid iban object
	 *
	 * @method isValid
	 * @param {String} iban string
	 * @return {Boolean} true if it is valid IBAN
	 */
	Iban.isValid = function (iban) {
	    var i = new Iban(iban);
	    return i.isValid();
	};
	
	/**
	 * Should be called to check if iban is correct
	 *
	 * @method isValid
	 * @returns {Boolean} true if it is, otherwise false
	 */
	Iban.prototype.isValid = function () {
	    return /^XE[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30,31})$/.test(this._iban) &&
	        mod9710(iso13616Prepare(this._iban)) === 1;
	};
	
	/**
	 * Should be called to check if iban number is direct
	 *
	 * @method isDirect
	 * @returns {Boolean} true if it is, otherwise false
	 */
	Iban.prototype.isDirect = function () {
	    return this._iban.length === 34 || this._iban.length === 35;
	};
	
	/**
	 * Should be called to check if iban number if indirect
	 *
	 * @method isIndirect
	 * @returns {Boolean} true if it is, otherwise false
	 */
	Iban.prototype.isIndirect = function () {
	    return this._iban.length === 20;
	};
	
	/**
	 * Should be called to get iban checksum
	 * Uses the mod-97-10 checksumming protocol (ISO/IEC 7064:2003)
	 *
	 * @method checksum
	 * @returns {String} checksum
	 */
	Iban.prototype.checksum = function () {
	    return this._iban.substr(2, 2);
	};
	
	/**
	 * Should be called to get institution identifier
	 * eg. XREG
	 *
	 * @method institution
	 * @returns {String} institution identifier
	 */
	Iban.prototype.institution = function () {
	    return this.isIndirect() ? this._iban.substr(7, 4) : '';
	};
	
	/**
	 * Should be called to get client identifier within institution
	 * eg. GAVOFYORK
	 *
	 * @method client
	 * @returns {String} client identifier
	 */
	Iban.prototype.client = function () {
	    return this.isIndirect() ? this._iban.substr(11) : '';
	};
	
	/**
	 * Should be called to get client direct address
	 *
	 * @method address
	 * @returns {String} client direct address
	 */
	Iban.prototype.address = function () {
	    if (this.isDirect()) {
	        var base36 = this._iban.substr(4);
	        var asBn = new BigNumber(base36, 36);
	        return padLeft(asBn.toString(16), 20);
	    } 
	
	    return '';
	};
	
	Iban.prototype.toString = function () {
	    return this._iban;
	};
	
	module.exports = Iban;
	


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file watches.js
	 * @authors:
	 *   Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var Method = __webpack_require__(42);
	
	/// @returns an array of objects describing web3.eth.filter api methods
	var eth = function () {
	    var newFilterCall = function (args) {
	        var type = args[0];
	
	        switch(type) {
	            case 'latest':
	                args.shift();
	                this.params = 0;
	                return 'eth_newBlockFilter';
	            case 'pending':
	                args.shift();
	                this.params = 0;
	                return 'eth_newPendingTransactionFilter';
	            default:
	                return 'eth_newFilter';
	        }
	    };
	
	    var newFilter = new Method({
	        name: 'newFilter',
	        call: newFilterCall,
	        params: 1
	    });
	
	    var uninstallFilter = new Method({
	        name: 'uninstallFilter',
	        call: 'eth_uninstallFilter',
	        params: 1
	    });
	
	    var getLogs = new Method({
	        name: 'getLogs',
	        call: 'eth_getFilterLogs',
	        params: 1
	    });
	
	    var poll = new Method({
	        name: 'poll',
	        call: 'eth_getFilterChanges',
	        params: 1
	    });
	
	    return [
	        newFilter,
	        uninstallFilter,
	        getLogs,
	        poll
	    ];
	};
	
	/// @returns an array of objects describing web3.shh.watch api methods
	var shh = function () {
	    var newFilter = new Method({
	        name: 'newFilter',
	        call: 'shh_newFilter',
	        params: 1
	    });
	
	    var uninstallFilter = new Method({
	        name: 'uninstallFilter',
	        call: 'shh_uninstallFilter',
	        params: 1
	    });
	
	    var getLogs = new Method({
	        name: 'getLogs',
	        call: 'shh_getMessages',
	        params: 1
	    });
	
	    var poll = new Method({
	        name: 'poll',
	        call: 'shh_getFilterChanges',
	        params: 1
	    });
	
	    return [
	        newFilter,
	        uninstallFilter,
	        getLogs,
	        poll
	    ];
	};
	
	module.exports = {
	    eth: eth,
	    shh: shh
	};
	


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/**
	 * @file property.js
	 * @author Fabian Vogelsteller <fabian@frozeman.de>
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var utils = __webpack_require__(8);
	
	var Property = function (options) {
	    this.name = options.name;
	    this.getter = options.getter;
	    this.setter = options.setter;
	    this.outputFormatter = options.outputFormatter;
	    this.inputFormatter = options.inputFormatter;
	    this.requestManager = null;
	};
	
	Property.prototype.setRequestManager = function (rm) {
	    this.requestManager = rm;
	};
	
	/**
	 * Should be called to format input args of method
	 * 
	 * @method formatInput
	 * @param {Array}
	 * @return {Array}
	 */
	Property.prototype.formatInput = function (arg) {
	    return this.inputFormatter ? this.inputFormatter(arg) : arg;
	};
	
	/**
	 * Should be called to format output(result) of method
	 *
	 * @method formatOutput
	 * @param {Object}
	 * @return {Object}
	 */
	Property.prototype.formatOutput = function (result) {
	    return this.outputFormatter && result !== null ? this.outputFormatter(result) : result;
	};
	
	/**
	 * Should be used to extract callback from array of arguments. Modifies input param
	 *
	 * @method extractCallback
	 * @param {Array} arguments
	 * @return {Function|Null} callback, if exists
	 */
	Property.prototype.extractCallback = function (args) {
	    if (utils.isFunction(args[args.length - 1])) {
	        return args.pop(); // modify the args array!
	    }
	};
	
	
	/**
	 * Should attach function to method
	 * 
	 * @method attachToObject
	 * @param {Object}
	 * @param {Function}
	 */
	Property.prototype.attachToObject = function (obj) {
	    var proto = {
	        get: this.buildGet() 
	    };
	
	    var names = this.name.split('.');
	    var name = names[0];
	    if (names.length > 1) {
	        obj[names[0]] = obj[names[0]] || {};
	        obj = obj[names[0]];
	        name = names[1];
	    }
	
	    Object.defineProperty(obj, name, proto);
	    obj[asyncGetterName(name)] = this.buildAsyncGet();
	};
	
	var asyncGetterName = function (name) {
	    return 'get' + name.charAt(0).toUpperCase() + name.slice(1);
	};
	
	Property.prototype.buildGet = function () {
	    var property = this;
	    return function get() {
	        return property.formatOutput(property.requestManager.send({
	            method: property.getter
	        })); 
	    };
	};
	
	Property.prototype.buildAsyncGet = function () {
	    var property = this;
	    var get = function (callback) {
	        property.requestManager.sendAsync({
	            method: property.getter
	        }, function (err, result) {
	            callback(err, property.formatOutput(result));
	        });
	    };
	    get.request = this.request.bind(this);
	    return get;
	};
	
	/**
	 * Should be called to create pure JSONRPC request which can be used in batch request
	 *
	 * @method request
	 * @param {...} params
	 * @return {Object} jsonrpc request
	 */
	Property.prototype.request = function () {
	    var payload = {
	        method: this.getter,
	        params: [],
	        callback: this.extractCallback(Array.prototype.slice.call(arguments))
	    };
	    payload.format = this.formatOutput.bind(this);
	    return payload;
	};
	
	module.exports = Property;
	


/***/ },
/* 65 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(167)["default"];
	
	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	
	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();
	
	exports.__esModule = true;

/***/ },
/* 67 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var C_enc = C.enc;
		    var Utf8 = C_enc.Utf8;
		    var C_algo = C.algo;
	
		    /**
		     * HMAC algorithm.
		     */
		    var HMAC = C_algo.HMAC = Base.extend({
		        /**
		         * Initializes a newly created HMAC.
		         *
		         * @param {Hasher} hasher The hash algorithm to use.
		         * @param {WordArray|string} key The secret key.
		         *
		         * @example
		         *
		         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
		         */
		        init: function (hasher, key) {
		            // Init hasher
		            hasher = this._hasher = new hasher.init();
	
		            // Convert string to WordArray, else assume WordArray already
		            if (typeof key == 'string') {
		                key = Utf8.parse(key);
		            }
	
		            // Shortcuts
		            var hasherBlockSize = hasher.blockSize;
		            var hasherBlockSizeBytes = hasherBlockSize * 4;
	
		            // Allow arbitrary length keys
		            if (key.sigBytes > hasherBlockSizeBytes) {
		                key = hasher.finalize(key);
		            }
	
		            // Clamp excess bits
		            key.clamp();
	
		            // Clone key for inner and outer pads
		            var oKey = this._oKey = key.clone();
		            var iKey = this._iKey = key.clone();
	
		            // Shortcuts
		            var oKeyWords = oKey.words;
		            var iKeyWords = iKey.words;
	
		            // XOR keys with pad constants
		            for (var i = 0; i < hasherBlockSize; i++) {
		                oKeyWords[i] ^= 0x5c5c5c5c;
		                iKeyWords[i] ^= 0x36363636;
		            }
		            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this HMAC to its initial state.
		         *
		         * @example
		         *
		         *     hmacHasher.reset();
		         */
		        reset: function () {
		            // Shortcut
		            var hasher = this._hasher;
	
		            // Reset
		            hasher.reset();
		            hasher.update(this._iKey);
		        },
	
		        /**
		         * Updates this HMAC with a message.
		         *
		         * @param {WordArray|string} messageUpdate The message to append.
		         *
		         * @return {HMAC} This HMAC instance.
		         *
		         * @example
		         *
		         *     hmacHasher.update('message');
		         *     hmacHasher.update(wordArray);
		         */
		        update: function (messageUpdate) {
		            this._hasher.update(messageUpdate);
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Finalizes the HMAC computation.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
		         *
		         * @return {WordArray} The HMAC.
		         *
		         * @example
		         *
		         *     var hmac = hmacHasher.finalize();
		         *     var hmac = hmacHasher.finalize('message');
		         *     var hmac = hmacHasher.finalize(wordArray);
		         */
		        finalize: function (messageUpdate) {
		            // Shortcut
		            var hasher = this._hasher;
	
		            // Compute HMAC
		            var innerHash = hasher.finalize(messageUpdate);
		            hasher.reset();
		            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
	
		            return hmac;
		        }
		    });
		}());
	
	
	}));

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Reusable object
		    var W = [];
	
		    /**
		     * SHA-1 hash algorithm.
		     */
		    var SHA1 = C_algo.SHA1 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init([
		                0x67452301, 0xefcdab89,
		                0x98badcfe, 0x10325476,
		                0xc3d2e1f0
		            ]);
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var H = this._hash.words;
	
		            // Working variables
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
		            var e = H[4];
	
		            // Computation
		            for (var i = 0; i < 80; i++) {
		                if (i < 16) {
		                    W[i] = M[offset + i] | 0;
		                } else {
		                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
		                    W[i] = (n << 1) | (n >>> 31);
		                }
	
		                var t = ((a << 5) | (a >>> 27)) + e + W[i];
		                if (i < 20) {
		                    t += ((b & c) | (~b & d)) + 0x5a827999;
		                } else if (i < 40) {
		                    t += (b ^ c ^ d) + 0x6ed9eba1;
		                } else if (i < 60) {
		                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
		                } else /* if (i < 80) */ {
		                    t += (b ^ c ^ d) - 0x359d3e2a;
		                }
	
		                e = d;
		                d = c;
		                c = (b << 30) | (b >>> 2);
		                b = a;
		                a = t;
		            }
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		            H[4] = (H[4] + e) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Return final computed hash
		            return this._hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA1('message');
		     *     var hash = CryptoJS.SHA1(wordArray);
		     */
		    C.SHA1 = Hasher._createHelper(SHA1);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA1(message, key);
		     */
		    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
		}());
	
	
		return CryptoJS.SHA1;
	
	}));

/***/ },
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file coder.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var f = __webpack_require__(13);
	
	var SolidityTypeAddress = __webpack_require__(351);
	var SolidityTypeBool = __webpack_require__(352);
	var SolidityTypeInt = __webpack_require__(355);
	var SolidityTypeUInt = __webpack_require__(358);
	var SolidityTypeDynamicBytes = __webpack_require__(354);
	var SolidityTypeString = __webpack_require__(357);
	var SolidityTypeReal = __webpack_require__(356);
	var SolidityTypeUReal = __webpack_require__(359);
	var SolidityTypeBytes = __webpack_require__(353);
	
	/**
	 * SolidityCoder prototype should be used to encode/decode solidity params of any type
	 */
	var SolidityCoder = function (types) {
	    this._types = types;
	};
	
	/**
	 * This method should be used to transform type to SolidityType
	 *
	 * @method _requireType
	 * @param {String} type
	 * @returns {SolidityType} 
	 * @throws {Error} throws if no matching type is found
	 */
	SolidityCoder.prototype._requireType = function (type) {
	    var solidityType = this._types.filter(function (t) {
	        return t.isType(type);
	    })[0];
	
	    if (!solidityType) {
	        throw Error('invalid solidity type!: ' + type);
	    }
	
	    return solidityType;
	};
	
	/**
	 * Should be used to encode plain param
	 *
	 * @method encodeParam
	 * @param {String} type
	 * @param {Object} plain param
	 * @return {String} encoded plain param
	 */
	SolidityCoder.prototype.encodeParam = function (type, param) {
	    return this.encodeParams([type], [param]);
	};
	
	/**
	 * Should be used to encode list of params
	 *
	 * @method encodeParams
	 * @param {Array} types
	 * @param {Array} params
	 * @return {String} encoded list of params
	 */
	SolidityCoder.prototype.encodeParams = function (types, params) {
	    var solidityTypes = this.getSolidityTypes(types);
	
	    var encodeds = solidityTypes.map(function (solidityType, index) {
	        return solidityType.encode(params[index], types[index]);
	    });
	
	    var dynamicOffset = solidityTypes.reduce(function (acc, solidityType, index) {
	        var staticPartLength = solidityType.staticPartLength(types[index]);
	        var roundedStaticPartLength = Math.floor((staticPartLength + 31) / 32) * 32;
	        return acc + roundedStaticPartLength;
	    }, 0);
	
	    var result = this.encodeMultiWithOffset(types, solidityTypes, encodeds, dynamicOffset); 
	
	    return result;
	};
	
	SolidityCoder.prototype.encodeMultiWithOffset = function (types, solidityTypes, encodeds, dynamicOffset) {
	    var result = "";
	    var self = this;
	
	    var isDynamic = function (i) {
	       return solidityTypes[i].isDynamicArray(types[i]) || solidityTypes[i].isDynamicType(types[i]);
	    };
	
	    types.forEach(function (type, i) {
	        if (isDynamic(i)) {
	            result += f.formatInputInt(dynamicOffset).encode();
	            var e = self.encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset);
	            dynamicOffset += e.length / 2;
	        } else {
	            // don't add length to dynamicOffset. it's already counted
	            result += self.encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset);
	        }
	
	        // TODO: figure out nested arrays
	    });
	    
	    types.forEach(function (type, i) {
	        if (isDynamic(i)) {
	            var e = self.encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset);
	            dynamicOffset += e.length / 2;
	            result += e;
	        }
	    });
	    return result;
	};
	
	// TODO: refactor whole encoding!
	SolidityCoder.prototype.encodeWithOffset = function (type, solidityType, encoded, offset) {
	    var self = this;
	    if (solidityType.isDynamicArray(type)) {
	        return (function () {
	            // offset was already set
	            var nestedName = solidityType.nestedName(type);
	            var nestedStaticPartLength = solidityType.staticPartLength(nestedName);
	            var result = encoded[0];
	            
	            (function () {
	                var previousLength = 2; // in int
	                if (solidityType.isDynamicArray(nestedName)) {
	                    for (var i = 1; i < encoded.length; i++) {
	                        previousLength += +(encoded[i - 1])[0] || 0;
	                        result += f.formatInputInt(offset + i * nestedStaticPartLength + previousLength * 32).encode();
	                    }
	                }
	            })();
	            
	            // first element is length, skip it
	            (function () {
	                for (var i = 0; i < encoded.length - 1; i++) {
	                    var additionalOffset = result / 2;
	                    result += self.encodeWithOffset(nestedName, solidityType, encoded[i + 1], offset +  additionalOffset);
	                }
	            })();
	
	            return result;
	        })();
	       
	    } else if (solidityType.isStaticArray(type)) {
	        return (function () {
	            var nestedName = solidityType.nestedName(type);
	            var nestedStaticPartLength = solidityType.staticPartLength(nestedName);
	            var result = "";
	
	
	            if (solidityType.isDynamicArray(nestedName)) {
	                (function () {
	                    var previousLength = 0; // in int
	                    for (var i = 0; i < encoded.length; i++) {
	                        // calculate length of previous item
	                        previousLength += +(encoded[i - 1] || [])[0] || 0; 
	                        result += f.formatInputInt(offset + i * nestedStaticPartLength + previousLength * 32).encode();
	                    }
	                })();
	            }
	
	            (function () {
	                for (var i = 0; i < encoded.length; i++) {
	                    var additionalOffset = result / 2;
	                    result += self.encodeWithOffset(nestedName, solidityType, encoded[i], offset + additionalOffset);
	                }
	            })();
	
	            return result;
	        })();
	    }
	
	    return encoded;
	};
	
	/**
	 * Should be used to decode bytes to plain param
	 *
	 * @method decodeParam
	 * @param {String} type
	 * @param {String} bytes
	 * @return {Object} plain param
	 */
	SolidityCoder.prototype.decodeParam = function (type, bytes) {
	    return this.decodeParams([type], bytes)[0];
	};
	
	/**
	 * Should be used to decode list of params
	 *
	 * @method decodeParam
	 * @param {Array} types
	 * @param {String} bytes
	 * @return {Array} array of plain params
	 */
	SolidityCoder.prototype.decodeParams = function (types, bytes) {
	    var solidityTypes = this.getSolidityTypes(types);
	    var offsets = this.getOffsets(types, solidityTypes);
	        
	    return solidityTypes.map(function (solidityType, index) {
	        return solidityType.decode(bytes, offsets[index],  types[index], index);
	    });
	};
	
	SolidityCoder.prototype.getOffsets = function (types, solidityTypes) {
	    var lengths =  solidityTypes.map(function (solidityType, index) {
	        return solidityType.staticPartLength(types[index]);
	    });
	    
	    for (var i = 1; i < lengths.length; i++) {
	         // sum with length of previous element
	        lengths[i] += lengths[i - 1]; 
	    }
	
	    return lengths.map(function (length, index) {
	        // remove the current length, so the length is sum of previous elements
	        var staticPartLength = solidityTypes[index].staticPartLength(types[index]);
	        return length - staticPartLength; 
	    });
	};
	
	SolidityCoder.prototype.getSolidityTypes = function (types) {
	    var self = this;
	    return types.map(function (type) {
	        return self._requireType(type);
	    });
	};
	
	var coder = new SolidityCoder([
	    new SolidityTypeAddress(),
	    new SolidityTypeBool(),
	    new SolidityTypeInt(),
	    new SolidityTypeUInt(),
	    new SolidityTypeDynamicBytes(),
	    new SolidityTypeBytes(),
	    new SolidityTypeString(),
	    new SolidityTypeReal(),
	    new SolidityTypeUReal()
	]);
	
	module.exports = coder;
	


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$getOwnPropertyDescriptor = __webpack_require__(168)["default"];
	
	exports["default"] = function get(_x, _x2, _x3) {
	  var _again = true;
	
	  _function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;
	    _again = false;
	    if (object === null) object = Function.prototype;
	
	    var desc = _Object$getOwnPropertyDescriptor(object, property);
	
	    if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);
	
	      if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;
	        _x2 = property;
	        _x3 = receiver;
	        _again = true;
	        desc = parent = undefined;
	        continue _function;
	      }
	    } else if ("value" in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;
	
	      if (getter === undefined) {
	        return undefined;
	      }
	
	      return getter.call(receiver);
	    }
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$create = __webpack_require__(166)["default"];
	
	var _Object$setPrototypeOf = __webpack_require__(169)["default"];
	
	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }
	
	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};
	
	exports.__esModule = true;

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(174);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(179)
	  , core      = __webpack_require__(67)
	  , ctx       = __webpack_require__(97)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Initialization and round constants tables
		    var H = [];
		    var K = [];
	
		    // Compute constants
		    (function () {
		        function isPrime(n) {
		            var sqrtN = Math.sqrt(n);
		            for (var factor = 2; factor <= sqrtN; factor++) {
		                if (!(n % factor)) {
		                    return false;
		                }
		            }
	
		            return true;
		        }
	
		        function getFractionalBits(n) {
		            return ((n - (n | 0)) * 0x100000000) | 0;
		        }
	
		        var n = 2;
		        var nPrime = 0;
		        while (nPrime < 64) {
		            if (isPrime(n)) {
		                if (nPrime < 8) {
		                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
		                }
		                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
	
		                nPrime++;
		            }
	
		            n++;
		        }
		    }());
	
		    // Reusable object
		    var W = [];
	
		    /**
		     * SHA-256 hash algorithm.
		     */
		    var SHA256 = C_algo.SHA256 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init(H.slice(0));
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var H = this._hash.words;
	
		            // Working variables
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
		            var e = H[4];
		            var f = H[5];
		            var g = H[6];
		            var h = H[7];
	
		            // Computation
		            for (var i = 0; i < 64; i++) {
		                if (i < 16) {
		                    W[i] = M[offset + i] | 0;
		                } else {
		                    var gamma0x = W[i - 15];
		                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
		                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
		                                   (gamma0x >>> 3);
	
		                    var gamma1x = W[i - 2];
		                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
		                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
		                                   (gamma1x >>> 10);
	
		                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
		                }
	
		                var ch  = (e & f) ^ (~e & g);
		                var maj = (a & b) ^ (a & c) ^ (b & c);
	
		                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
		                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));
	
		                var t1 = h + sigma1 + ch + K[i] + W[i];
		                var t2 = sigma0 + maj;
	
		                h = g;
		                g = f;
		                f = e;
		                e = (d + t1) | 0;
		                d = c;
		                c = b;
		                b = a;
		                a = (t1 + t2) | 0;
		            }
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		            H[4] = (H[4] + e) | 0;
		            H[5] = (H[5] + f) | 0;
		            H[6] = (H[6] + g) | 0;
		            H[7] = (H[7] + h) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Return final computed hash
		            return this._hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA256('message');
		     *     var hash = CryptoJS.SHA256(wordArray);
		     */
		    C.SHA256 = Hasher._createHelper(SHA256);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA256(message, key);
		     */
		    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
		}(Math));
	
	
		return CryptoJS.SHA256;
	
	}));

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(46));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./x64-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_x64 = C.x64;
		    var X64Word = C_x64.Word;
		    var C_algo = C.algo;
	
		    // Constants tables
		    var RHO_OFFSETS = [];
		    var PI_INDEXES  = [];
		    var ROUND_CONSTANTS = [];
	
		    // Compute Constants
		    (function () {
		        // Compute rho offset constants
		        var x = 1, y = 0;
		        for (var t = 0; t < 24; t++) {
		            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;
	
		            var newX = y % 5;
		            var newY = (2 * x + 3 * y) % 5;
		            x = newX;
		            y = newY;
		        }
	
		        // Compute pi index constants
		        for (var x = 0; x < 5; x++) {
		            for (var y = 0; y < 5; y++) {
		                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
		            }
		        }
	
		        // Compute round constants
		        var LFSR = 0x01;
		        for (var i = 0; i < 24; i++) {
		            var roundConstantMsw = 0;
		            var roundConstantLsw = 0;
	
		            for (var j = 0; j < 7; j++) {
		                if (LFSR & 0x01) {
		                    var bitPosition = (1 << j) - 1;
		                    if (bitPosition < 32) {
		                        roundConstantLsw ^= 1 << bitPosition;
		                    } else /* if (bitPosition >= 32) */ {
		                        roundConstantMsw ^= 1 << (bitPosition - 32);
		                    }
		                }
	
		                // Compute next LFSR
		                if (LFSR & 0x80) {
		                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
		                    LFSR = (LFSR << 1) ^ 0x71;
		                } else {
		                    LFSR <<= 1;
		                }
		            }
	
		            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
		        }
		    }());
	
		    // Reusable objects for temporary values
		    var T = [];
		    (function () {
		        for (var i = 0; i < 25; i++) {
		            T[i] = X64Word.create();
		        }
		    }());
	
		    /**
		     * SHA-3 hash algorithm.
		     */
		    var SHA3 = C_algo.SHA3 = Hasher.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {number} outputLength
		         *   The desired number of bits in the output hash.
		         *   Only values permitted are: 224, 256, 384, 512.
		         *   Default: 512
		         */
		        cfg: Hasher.cfg.extend({
		            outputLength: 512
		        }),
	
		        _doReset: function () {
		            var state = this._state = []
		            for (var i = 0; i < 25; i++) {
		                state[i] = new X64Word.init();
		            }
	
		            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcuts
		            var state = this._state;
		            var nBlockSizeLanes = this.blockSize / 2;
	
		            // Absorb
		            for (var i = 0; i < nBlockSizeLanes; i++) {
		                // Shortcuts
		                var M2i  = M[offset + 2 * i];
		                var M2i1 = M[offset + 2 * i + 1];
	
		                // Swap endian
		                M2i = (
		                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
		                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
		                );
		                M2i1 = (
		                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
		                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
		                );
	
		                // Absorb message into state
		                var lane = state[i];
		                lane.high ^= M2i1;
		                lane.low  ^= M2i;
		            }
	
		            // Rounds
		            for (var round = 0; round < 24; round++) {
		                // Theta
		                for (var x = 0; x < 5; x++) {
		                    // Mix column lanes
		                    var tMsw = 0, tLsw = 0;
		                    for (var y = 0; y < 5; y++) {
		                        var lane = state[x + 5 * y];
		                        tMsw ^= lane.high;
		                        tLsw ^= lane.low;
		                    }
	
		                    // Temporary values
		                    var Tx = T[x];
		                    Tx.high = tMsw;
		                    Tx.low  = tLsw;
		                }
		                for (var x = 0; x < 5; x++) {
		                    // Shortcuts
		                    var Tx4 = T[(x + 4) % 5];
		                    var Tx1 = T[(x + 1) % 5];
		                    var Tx1Msw = Tx1.high;
		                    var Tx1Lsw = Tx1.low;
	
		                    // Mix surrounding columns
		                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
		                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
		                    for (var y = 0; y < 5; y++) {
		                        var lane = state[x + 5 * y];
		                        lane.high ^= tMsw;
		                        lane.low  ^= tLsw;
		                    }
		                }
	
		                // Rho Pi
		                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
		                    // Shortcuts
		                    var lane = state[laneIndex];
		                    var laneMsw = lane.high;
		                    var laneLsw = lane.low;
		                    var rhoOffset = RHO_OFFSETS[laneIndex];
	
		                    // Rotate lanes
		                    if (rhoOffset < 32) {
		                        var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
		                        var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
		                    } else /* if (rhoOffset >= 32) */ {
		                        var tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
		                        var tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
		                    }
	
		                    // Transpose lanes
		                    var TPiLane = T[PI_INDEXES[laneIndex]];
		                    TPiLane.high = tMsw;
		                    TPiLane.low  = tLsw;
		                }
	
		                // Rho pi at x = y = 0
		                var T0 = T[0];
		                var state0 = state[0];
		                T0.high = state0.high;
		                T0.low  = state0.low;
	
		                // Chi
		                for (var x = 0; x < 5; x++) {
		                    for (var y = 0; y < 5; y++) {
		                        // Shortcuts
		                        var laneIndex = x + 5 * y;
		                        var lane = state[laneIndex];
		                        var TLane = T[laneIndex];
		                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
		                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];
	
		                        // Mix rows
		                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
		                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
		                    }
		                }
	
		                // Iota
		                var lane = state[0];
		                var roundConstant = ROUND_CONSTANTS[round];
		                lane.high ^= roundConstant.high;
		                lane.low  ^= roundConstant.low;;
		            }
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
		            var blockSizeBits = this.blockSize * 32;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
		            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Shortcuts
		            var state = this._state;
		            var outputLengthBytes = this.cfg.outputLength / 8;
		            var outputLengthLanes = outputLengthBytes / 8;
	
		            // Squeeze
		            var hashWords = [];
		            for (var i = 0; i < outputLengthLanes; i++) {
		                // Shortcuts
		                var lane = state[i];
		                var laneMsw = lane.high;
		                var laneLsw = lane.low;
	
		                // Swap endian
		                laneMsw = (
		                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
		                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
		                );
		                laneLsw = (
		                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
		                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
		                );
	
		                // Squeeze state to retrieve hash
		                hashWords.push(laneLsw);
		                hashWords.push(laneMsw);
		            }
	
		            // Return final computed hash
		            return new WordArray.init(hashWords, outputLengthBytes);
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
	
		            var state = clone._state = this._state.slice(0);
		            for (var i = 0; i < 25; i++) {
		                state[i] = state[i].clone();
		            }
	
		            return clone;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA3('message');
		     *     var hash = CryptoJS.SHA3(wordArray);
		     */
		    C.SHA3 = Hasher._createHelper(SHA3);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA3(message, key);
		     */
		    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
		}(Math));
	
	
		return CryptoJS.SHA3;
	
	}));

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(46));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./x64-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Hasher = C_lib.Hasher;
		    var C_x64 = C.x64;
		    var X64Word = C_x64.Word;
		    var X64WordArray = C_x64.WordArray;
		    var C_algo = C.algo;
	
		    function X64Word_create() {
		        return X64Word.create.apply(X64Word, arguments);
		    }
	
		    // Constants
		    var K = [
		        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
		        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
		        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
		        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
		        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
		        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
		        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
		        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
		        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
		        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
		        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
		        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
		        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
		        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
		        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
		        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
		        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
		        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
		        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
		        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
		        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
		        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
		        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
		        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
		        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
		        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
		        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
		        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
		        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
		        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
		        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
		        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
		        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
		        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
		        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
		        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
		        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
		        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
		        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
		        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
		    ];
	
		    // Reusable objects
		    var W = [];
		    (function () {
		        for (var i = 0; i < 80; i++) {
		            W[i] = X64Word_create();
		        }
		    }());
	
		    /**
		     * SHA-512 hash algorithm.
		     */
		    var SHA512 = C_algo.SHA512 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new X64WordArray.init([
		                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
		                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
		                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
		                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
		            ]);
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcuts
		            var H = this._hash.words;
	
		            var H0 = H[0];
		            var H1 = H[1];
		            var H2 = H[2];
		            var H3 = H[3];
		            var H4 = H[4];
		            var H5 = H[5];
		            var H6 = H[6];
		            var H7 = H[7];
	
		            var H0h = H0.high;
		            var H0l = H0.low;
		            var H1h = H1.high;
		            var H1l = H1.low;
		            var H2h = H2.high;
		            var H2l = H2.low;
		            var H3h = H3.high;
		            var H3l = H3.low;
		            var H4h = H4.high;
		            var H4l = H4.low;
		            var H5h = H5.high;
		            var H5l = H5.low;
		            var H6h = H6.high;
		            var H6l = H6.low;
		            var H7h = H7.high;
		            var H7l = H7.low;
	
		            // Working variables
		            var ah = H0h;
		            var al = H0l;
		            var bh = H1h;
		            var bl = H1l;
		            var ch = H2h;
		            var cl = H2l;
		            var dh = H3h;
		            var dl = H3l;
		            var eh = H4h;
		            var el = H4l;
		            var fh = H5h;
		            var fl = H5l;
		            var gh = H6h;
		            var gl = H6l;
		            var hh = H7h;
		            var hl = H7l;
	
		            // Rounds
		            for (var i = 0; i < 80; i++) {
		                // Shortcut
		                var Wi = W[i];
	
		                // Extend message
		                if (i < 16) {
		                    var Wih = Wi.high = M[offset + i * 2]     | 0;
		                    var Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
		                } else {
		                    // Gamma0
		                    var gamma0x  = W[i - 15];
		                    var gamma0xh = gamma0x.high;
		                    var gamma0xl = gamma0x.low;
		                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
		                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));
	
		                    // Gamma1
		                    var gamma1x  = W[i - 2];
		                    var gamma1xh = gamma1x.high;
		                    var gamma1xl = gamma1x.low;
		                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
		                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));
	
		                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
		                    var Wi7  = W[i - 7];
		                    var Wi7h = Wi7.high;
		                    var Wi7l = Wi7.low;
	
		                    var Wi16  = W[i - 16];
		                    var Wi16h = Wi16.high;
		                    var Wi16l = Wi16.low;
	
		                    var Wil = gamma0l + Wi7l;
		                    var Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
		                    var Wil = Wil + gamma1l;
		                    var Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
		                    var Wil = Wil + Wi16l;
		                    var Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);
	
		                    Wi.high = Wih;
		                    Wi.low  = Wil;
		                }
	
		                var chh  = (eh & fh) ^ (~eh & gh);
		                var chl  = (el & fl) ^ (~el & gl);
		                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
		                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);
	
		                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
		                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
		                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
		                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));
	
		                // t1 = h + sigma1 + ch + K[i] + W[i]
		                var Ki  = K[i];
		                var Kih = Ki.high;
		                var Kil = Ki.low;
	
		                var t1l = hl + sigma1l;
		                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
		                var t1l = t1l + chl;
		                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
		                var t1l = t1l + Kil;
		                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
		                var t1l = t1l + Wil;
		                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);
	
		                // t2 = sigma0 + maj
		                var t2l = sigma0l + majl;
		                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);
	
		                // Update working variables
		                hh = gh;
		                hl = gl;
		                gh = fh;
		                gl = fl;
		                fh = eh;
		                fl = el;
		                el = (dl + t1l) | 0;
		                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
		                dh = ch;
		                dl = cl;
		                ch = bh;
		                cl = bl;
		                bh = ah;
		                bl = al;
		                al = (t1l + t2l) | 0;
		                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
		            }
	
		            // Intermediate hash value
		            H0l = H0.low  = (H0l + al);
		            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
		            H1l = H1.low  = (H1l + bl);
		            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
		            H2l = H2.low  = (H2l + cl);
		            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
		            H3l = H3.low  = (H3l + dl);
		            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
		            H4l = H4.low  = (H4l + el);
		            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
		            H5l = H5.low  = (H5l + fl);
		            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
		            H6l = H6.low  = (H6l + gl);
		            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
		            H7l = H7.low  = (H7l + hl);
		            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
		            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Convert hash to 32-bit word array before returning
		            var hash = this._hash.toX32();
	
		            // Return final computed hash
		            return hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        },
	
		        blockSize: 1024/32
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA512('message');
		     *     var hash = CryptoJS.SHA512(wordArray);
		     */
		    C.SHA512 = Hasher._createHelper(SHA512);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA512(message, key);
		     */
		    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
		}());
	
	
		return CryptoJS.SHA512;
	
	}));

/***/ },
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = catchErrors;
	
	function catchErrors(_ref) {
	  var filename = _ref.filename;
	  var components = _ref.components;
	  var imports = _ref.imports;
	
	  var _imports = _slicedToArray(imports, 3);
	
	  var React = _imports[0];
	  var ErrorReporter = _imports[1];
	  var reporterOptions = _imports[2];
	
	  if (!React || !React.Component) {
	    throw new Error('imports[0] for react-transform-catch-errors does not look like React.');
	  }
	  if (typeof ErrorReporter !== 'function') {
	    throw new Error('imports[1] for react-transform-catch-errors does not look like a React component.');
	  }
	
	  return function wrapToCatchErrors(ReactClass, componentId) {
	    var originalRender = ReactClass.prototype.render;
	
	    ReactClass.prototype.render = function tryRender() {
	      try {
	        return originalRender.apply(this, arguments);
	      } catch (err) {
	        if (console.reportErrorsAsExceptions) {
	          // Stop react-native from triggering its own error handler
	          console.reportErrorsAsExceptions = false;
	          console.error(err);
	          // Reactivate it so other errors are still handled
	          console.reportErrorsAsExceptions = true;
	        } else {
	          console.error(err);
	        }
	
	        return React.createElement(ErrorReporter, _extends({
	          error: err,
	          filename: filename
	        }, reporterOptions));
	      }
	    };
	
	    return ReactClass;
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(5);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styleJs = __webpack_require__(338);
	
	var _styleJs2 = _interopRequireDefault(_styleJs);
	
	var _errorStackParser = __webpack_require__(339);
	
	var _errorStackParser2 = _interopRequireDefault(_errorStackParser);
	
	var _objectAssign = __webpack_require__(341);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _lib = __webpack_require__(337);
	
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var React = _react2['default'];
	var Component = _react.Component;
	var PropTypes = _react.PropTypes;
	
	__$Getters__['React'] = function () {
	  return React;
	};
	
	__$Setters__['React'] = function (value) {
	  React = value;
	};
	
	__$Resetters__['React'] = function () {
	  React = _react2['default'];
	};
	
	__$Getters__['Component'] = function () {
	  return Component;
	};
	
	__$Setters__['Component'] = function (value) {
	  Component = value;
	};
	
	__$Resetters__['Component'] = function () {
	  Component = _react.Component;
	};
	
	__$Getters__['PropTypes'] = function () {
	  return PropTypes;
	};
	
	__$Setters__['PropTypes'] = function (value) {
	  PropTypes = value;
	};
	
	__$Resetters__['PropTypes'] = function () {
	  PropTypes = _react.PropTypes;
	};
	
	var style = _styleJs2['default'];
	
	__$Getters__['style'] = function () {
	  return style;
	};
	
	__$Setters__['style'] = function (value) {
	  style = value;
	};
	
	__$Resetters__['style'] = function () {
	  style = _styleJs2['default'];
	};
	
	var ErrorStackParser = _errorStackParser2['default'];
	
	__$Getters__['ErrorStackParser'] = function () {
	  return ErrorStackParser;
	};
	
	__$Setters__['ErrorStackParser'] = function (value) {
	  ErrorStackParser = value;
	};
	
	__$Resetters__['ErrorStackParser'] = function () {
	  ErrorStackParser = _errorStackParser2['default'];
	};
	
	var assign = _objectAssign2['default'];
	
	__$Getters__['assign'] = function () {
	  return assign;
	};
	
	__$Setters__['assign'] = function (value) {
	  assign = value;
	};
	
	__$Resetters__['assign'] = function () {
	  assign = _objectAssign2['default'];
	};
	
	var isFilenameAbsolute = _lib.isFilenameAbsolute;
	var makeUrl = _lib.makeUrl;
	var makeLinkText = _lib.makeLinkText;
	
	__$Getters__['isFilenameAbsolute'] = function () {
	  return isFilenameAbsolute;
	};
	
	__$Setters__['isFilenameAbsolute'] = function (value) {
	  isFilenameAbsolute = value;
	};
	
	__$Resetters__['isFilenameAbsolute'] = function () {
	  isFilenameAbsolute = _lib.isFilenameAbsolute;
	};
	
	__$Getters__['makeUrl'] = function () {
	  return makeUrl;
	};
	
	__$Setters__['makeUrl'] = function (value) {
	  makeUrl = value;
	};
	
	__$Resetters__['makeUrl'] = function () {
	  makeUrl = _lib.makeUrl;
	};
	
	__$Getters__['makeLinkText'] = function () {
	  return makeLinkText;
	};
	
	__$Setters__['makeLinkText'] = function (value) {
	  makeLinkText = value;
	};
	
	__$Resetters__['makeLinkText'] = function () {
	  makeLinkText = _lib.makeLinkText;
	};
	
	var RedBox = (function (_Component) {
	  _inherits(RedBox, _Component);
	
	  function RedBox() {
	    _classCallCheck(this, RedBox);
	
	    _Component.apply(this, arguments);
	  }
	
	  RedBox.prototype.render = function render() {
	    var _props = this.props;
	    var error = _props.error;
	    var filename = _props.filename;
	    var editorScheme = _props.editorScheme;
	    var useLines = _props.useLines;
	    var useColumns = _props.useColumns;
	
	    var _assign = assign({}, style, this.props.style);
	
	    var redbox = _assign.redbox;
	    var message = _assign.message;
	    var stack = _assign.stack;
	    var frame = _assign.frame;
	    var file = _assign.file;
	    var linkToFile = _assign.linkToFile;
	
	    var frames = ErrorStackParser.parse(error).map(function (f, index) {
	      var text = undefined;
	      var url = undefined;
	
	      if (index === 0 && filename && !isFilenameAbsolute(f.fileName)) {
	        url = makeUrl(filename, editorScheme);
	        text = makeLinkText(filename);
	      } else {
	        var lines = useLines ? f.lineNumber : null;
	        var columns = useColumns ? f.columnNumber : null;
	        url = makeUrl(f.fileName, editorScheme, lines, columns);
	        text = makeLinkText(f.fileName, lines, columns);
	      }
	
	      return React.createElement(
	        'div',
	        { style: frame, key: index },
	        React.createElement(
	          'div',
	          null,
	          f.functionName
	        ),
	        React.createElement(
	          'div',
	          { style: file },
	          React.createElement(
	            'a',
	            { href: url, style: linkToFile },
	            text
	          )
	        )
	      );
	    });
	    return React.createElement(
	      'div',
	      { style: redbox },
	      React.createElement(
	        'div',
	        { style: message },
	        error.name,
	        ': ',
	        error.message
	      ),
	      React.createElement(
	        'div',
	        { style: stack },
	        frames
	      )
	    );
	  };
	
	  _createClass(RedBox, null, [{
	    key: 'propTypes',
	    value: {
	      error: PropTypes.instanceOf(Error).isRequired,
	      filename: PropTypes.string,
	      editorScheme: PropTypes.string,
	      useLines: PropTypes.bool,
	      useColumns: PropTypes.bool
	    },
	    enumerable: true
	  }, {
	    key: 'displayName',
	    value: 'RedBox',
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      useLines: true,
	      useColumns: true
	    },
	    enumerable: true
	  }]);
	
	  return RedBox;
	})(Component);
	
	var _defaultExport = RedBox;
	
	if (typeof _defaultExport === 'object' || typeof _defaultExport === 'function') {
	  Object.defineProperty(_defaultExport, '__Rewire__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__set__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__ResetDependency__', {
	    'value': __ResetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__GetDependency__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__get__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__RewireAPI__', {
	    'value': __RewireAPI__,
	    'enumberable': false
	  });
	}
	
	exports['default'] = _defaultExport;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	module.exports = exports['default'];

/***/ },
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file param.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var utils = __webpack_require__(8);
	
	/**
	 * SolidityParam object prototype.
	 * Should be used when encoding, decoding solidity bytes
	 */
	var SolidityParam = function (value, offset) {
	    this.value = value || '';
	    this.offset = offset; // offset in bytes
	};
	
	/**
	 * This method should be used to get length of params's dynamic part
	 * 
	 * @method dynamicPartLength
	 * @returns {Number} length of dynamic part (in bytes)
	 */
	SolidityParam.prototype.dynamicPartLength = function () {
	    return this.dynamicPart().length / 2;
	};
	
	/**
	 * This method should be used to create copy of solidity param with different offset
	 *
	 * @method withOffset
	 * @param {Number} offset length in bytes
	 * @returns {SolidityParam} new solidity param with applied offset
	 */
	SolidityParam.prototype.withOffset = function (offset) {
	    return new SolidityParam(this.value, offset);
	};
	
	/**
	 * This method should be used to combine solidity params together
	 * eg. when appending an array
	 *
	 * @method combine
	 * @param {SolidityParam} param with which we should combine
	 * @param {SolidityParam} result of combination
	 */
	SolidityParam.prototype.combine = function (param) {
	    return new SolidityParam(this.value + param.value); 
	};
	
	/**
	 * This method should be called to check if param has dynamic size.
	 * If it has, it returns true, otherwise false
	 *
	 * @method isDynamic
	 * @returns {Boolean}
	 */
	SolidityParam.prototype.isDynamic = function () {
	    return this.offset !== undefined;
	};
	
	/**
	 * This method should be called to transform offset to bytes
	 *
	 * @method offsetAsBytes
	 * @returns {String} bytes representation of offset
	 */
	SolidityParam.prototype.offsetAsBytes = function () {
	    return !this.isDynamic() ? '' : utils.padLeft(utils.toTwosComplement(this.offset).toString(16), 64);
	};
	
	/**
	 * This method should be called to get static part of param
	 *
	 * @method staticPart
	 * @returns {String} offset if it is a dynamic param, otherwise value
	 */
	SolidityParam.prototype.staticPart = function () {
	    if (!this.isDynamic()) {
	        return this.value; 
	    } 
	    return this.offsetAsBytes();
	};
	
	/**
	 * This method should be called to get dynamic part of param
	 *
	 * @method dynamicPart
	 * @returns {String} returns a value if it is a dynamic param, otherwise empty string
	 */
	SolidityParam.prototype.dynamicPart = function () {
	    return this.isDynamic() ? this.value : '';
	};
	
	/**
	 * This method should be called to encode param
	 *
	 * @method encode
	 * @returns {String}
	 */
	SolidityParam.prototype.encode = function () {
	    return this.staticPart() + this.dynamicPart();
	};
	
	/**
	 * This method should be called to encode array of params
	 *
	 * @method encodeList
	 * @param {Array[SolidityParam]} params
	 * @returns {String}
	 */
	SolidityParam.encodeList = function (params) {
	    
	    // updating offsets
	    var totalOffset = params.length * 32;
	    var offsetParams = params.map(function (param) {
	        if (!param.isDynamic()) {
	            return param;
	        }
	        var offset = totalOffset;
	        totalOffset += param.dynamicPartLength();
	        return param.withOffset(offset);
	    });
	
	    // encode everything!
	    return offsetParams.reduce(function (result, param) {
	        return result + param.dynamicPart();
	    }, offsetParams.reduce(function (result, param) {
	        return result + param.staticPart();
	    }, ''));
	};
	
	
	
	module.exports = SolidityParam;
	


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file event.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2014
	 */
	
	var utils = __webpack_require__(8);
	var coder = __webpack_require__(94);
	var formatters = __webpack_require__(22);
	var sha3 = __webpack_require__(60);
	var Filter = __webpack_require__(61);
	var watches = __webpack_require__(63);
	
	/**
	 * This prototype should be used to create event filters
	 */
	var SolidityEvent = function (requestManager, json, address) {
	    this._requestManager = requestManager;
	    this._params = json.inputs;
	    this._name = utils.transformToFullName(json);
	    this._address = address;
	    this._anonymous = json.anonymous;
	};
	
	/**
	 * Should be used to get filtered param types
	 *
	 * @method types
	 * @param {Bool} decide if returned typed should be indexed
	 * @return {Array} array of types
	 */
	SolidityEvent.prototype.types = function (indexed) {
	    return this._params.filter(function (i) {
	        return i.indexed === indexed;
	    }).map(function (i) {
	        return i.type;
	    });
	};
	
	/**
	 * Should be used to get event display name
	 *
	 * @method displayName
	 * @return {String} event display name
	 */
	SolidityEvent.prototype.displayName = function () {
	    return utils.extractDisplayName(this._name);
	};
	
	/**
	 * Should be used to get event type name
	 *
	 * @method typeName
	 * @return {String} event type name
	 */
	SolidityEvent.prototype.typeName = function () {
	    return utils.extractTypeName(this._name);
	};
	
	/**
	 * Should be used to get event signature
	 *
	 * @method signature
	 * @return {String} event signature
	 */
	SolidityEvent.prototype.signature = function () {
	    return sha3(this._name);
	};
	
	/**
	 * Should be used to encode indexed params and options to one final object
	 * 
	 * @method encode
	 * @param {Object} indexed
	 * @param {Object} options
	 * @return {Object} everything combined together and encoded
	 */
	SolidityEvent.prototype.encode = function (indexed, options) {
	    indexed = indexed || {};
	    options = options || {};
	    var result = {};
	
	    ['fromBlock', 'toBlock'].filter(function (f) {
	        return options[f] !== undefined;
	    }).forEach(function (f) {
	        result[f] = formatters.inputBlockNumberFormatter(options[f]);
	    });
	
	    result.topics = [];
	
	    result.address = this._address;
	    if (!this._anonymous) {
	        result.topics.push('0x' + this.signature());
	    }
	
	    var indexedTopics = this._params.filter(function (i) {
	        return i.indexed === true;
	    }).map(function (i) {
	        var value = indexed[i.name];
	        if (value === undefined || value === null) {
	            return null;
	        }
	        
	        if (utils.isArray(value)) {
	            return value.map(function (v) {
	                return '0x' + coder.encodeParam(i.type, v);
	            });
	        }
	        return '0x' + coder.encodeParam(i.type, value);
	    });
	
	    result.topics = result.topics.concat(indexedTopics);
	
	    return result;
	};
	
	/**
	 * Should be used to decode indexed params and options
	 *
	 * @method decode
	 * @param {Object} data
	 * @return {Object} result object with decoded indexed && not indexed params
	 */
	SolidityEvent.prototype.decode = function (data) {
	 
	    data.data = data.data || '';
	    data.topics = data.topics || [];
	
	    var argTopics = this._anonymous ? data.topics : data.topics.slice(1);
	    var indexedData = argTopics.map(function (topics) { return topics.slice(2); }).join("");
	    var indexedParams = coder.decodeParams(this.types(true), indexedData); 
	
	    var notIndexedData = data.data.slice(2);
	    var notIndexedParams = coder.decodeParams(this.types(false), notIndexedData);
	    
	    var result = formatters.outputLogFormatter(data);
	    result.event = this.displayName();
	    result.address = data.address;
	
	    result.args = this._params.reduce(function (acc, current) {
	        acc[current.name] = current.indexed ? indexedParams.shift() : notIndexedParams.shift();
	        return acc;
	    }, {});
	
	    delete result.data;
	    delete result.topics;
	
	    return result;
	};
	
	/**
	 * Should be used to create new filter object from event
	 *
	 * @method execute
	 * @param {Object} indexed
	 * @param {Object} options
	 * @return {Object} filter object
	 */
	SolidityEvent.prototype.execute = function (indexed, options, callback) {
	
	    if (utils.isFunction(arguments[arguments.length - 1])) {
	        callback = arguments[arguments.length - 1];
	        if(arguments.length === 2)
	            options = null;
	        if(arguments.length === 1) {
	            options = null;
	            indexed = {};
	        }
	    }
	    
	    var o = this.encode(indexed, options);
	    var formatter = this.decode.bind(this);
	    return new Filter(this._requestManager, o, watches.eth(), formatter, callback);
	};
	
	/**
	 * Should be used to attach event to contract object
	 *
	 * @method attachToContract
	 * @param {Contract}
	 */
	SolidityEvent.prototype.attachToContract = function (contract) {
	    var execute = this.execute.bind(this);
	    var displayName = this.displayName();
	    if (!contract[displayName]) {
	        contract[displayName] = execute;
	    }
	    contract[displayName][this.typeName()] = this.execute.bind(this, contract);
	};
	
	module.exports = SolidityEvent;
	


/***/ },
/* 160 */
/***/ function(module, exports) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file jsonrpc.js
	 * @authors:
	 *   Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var Jsonrpc = function () {
	    // singleton pattern
	    if (arguments.callee._singletonInstance) {
	        return arguments.callee._singletonInstance;
	    }
	    arguments.callee._singletonInstance = this;
	
	    this.messageId = 1;
	};
	
	/**
	 * @return {Jsonrpc} singleton
	 */
	Jsonrpc.getInstance = function () {
	    var instance = new Jsonrpc();
	    return instance;
	};
	
	/**
	 * Should be called to valid json create payload object
	 *
	 * @method toPayload
	 * @param {Function} method of jsonrpc call, required
	 * @param {Array} params, an array of method params, optional
	 * @returns {Object} valid jsonrpc payload object
	 */
	Jsonrpc.prototype.toPayload = function (method, params) {
	    if (!method)
	        console.error('jsonrpc method should be specified!');
	
	    return {
	        jsonrpc: '2.0',
	        method: method,
	        params: params || [],
	        id: this.messageId++
	    };
	};
	
	/**
	 * Should be called to check if jsonrpc response is valid
	 *
	 * @method isValidResponse
	 * @param {Object}
	 * @returns {Boolean} true if response is valid, otherwise false
	 */
	Jsonrpc.prototype.isValidResponse = function (response) {
	    return !!response &&
	        !response.error &&
	        response.jsonrpc === '2.0' &&
	        typeof response.id === 'number' &&
	        response.result !== undefined; // only undefined is not valid json object
	};
	
	/**
	 * Should be called to create batch payload object
	 *
	 * @method toBatchPayload
	 * @param {Array} messages, an array of objects with method (required) and params (optional) fields
	 * @returns {Array} batch payload
	 */
	Jsonrpc.prototype.toBatchPayload = function (messages) {
	    var self = this;
	    return messages.map(function (message) {
	        return self.toPayload(message.method, message.params);
	    });
	};
	
	module.exports = Jsonrpc;
	


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(43)['default'];
	
	var _react = __webpack_require__(5);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(241);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _containersRoot = __webpack_require__(164);
	
	var _containersRoot2 = _interopRequireDefault(_containersRoot);
	
	var target = document.getElementById('root');
	
	var node = _react2['default'].createElement(_containersRoot2['default'], null);
	
	_reactDom2['default'].render(node, target);

/***/ },
/* 162 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	var babelABI = [{
	   "type": "function",
	   "outputs": [{
	      "type": "address",
	      "name": ""
	   }],
	   "name": "nameRegAddress",
	   "constant": false,
	   "inputs": []
	}, {
	   "type": "function",
	   "outputs": [{
	      "name": "",
	      "type": "uint256"
	   }],
	   "name": "count",
	   "constant": true,
	   "inputs": []
	}, {
	   "inputs": [],
	   "name": "disable",
	   "constant": false,
	   "outputs": [],
	   "type": "function"
	}, {
	   "outputs": [{
	      "name": "",
	      "type": "int32"
	   }],
	   "type": "function",
	   "inputs": [],
	   "name": "stablizer",
	   "constant": true
	}, {
	   "outputs": [],
	   "type": "function",
	   "inputs": [],
	   "name": "top18",
	   "constant": false
	}, {
	   "type": "function",
	   "outputs": [],
	   "constant": false,
	   "name": "kill",
	   "inputs": []
	}, {
	   "type": "function",
	   "outputs": [{
	      "type": "uint",
	      "name": "height"
	   }],
	   "name": "getHeight",
	   "constant": true,
	   "inputs": []
	}, {
	   "type": "function",
	   "outputs": [{
	      "type": "uint[512]",
	      "name": "ids"
	   }],
	   "name": "getIds",
	   "constant": true,
	   "inputs": []
	}, {
	   "type": "function",
	   "outputs": [{
	      "type": "address[512]",
	      "name": "addresses"
	   }],
	   "name": "getFroms",
	   "constant": true,
	   "inputs": []
	}, {
	   "type": "function",
	   "outputs": [{
	      "type": "uint[512]",
	      "name": "values"
	   }],
	   "name": "getValues",
	   "constant": true,
	   "inputs": []
	}, {
	   "type": "function",
	   "outputs": [{
	      "type": "int32[512]",
	      "name": "offset"
	   }],
	   "name": "getOffsets",
	   "constant": true,
	   "inputs": []
	}, {
	   "name": "bricks",
	   "constant": true,
	   "inputs": [{
	      "name": "",
	      "type": "uint256"
	   }],
	   "type": "function",
	   "outputs": [{
	      "name": "id",
	      "type": "uint256"
	   }, {
	      "type": "address",
	      "name": "from"
	   }, {
	      "name": "value",
	      "type": "uint256"
	   }, {
	      "type": "int32",
	      "name": "offset"
	   }, {
	      "name": "message",
	      "type": "string"
	   }]
	}, {
	   "name": "brickV",
	   "constant": true,
	   "inputs": [],
	   "type": "function",
	   "outputs": [{
	      "type": "uint256",
	      "name": ""
	   }]
	}, {
	   "outputs": [],
	   "type": "function",
	   "inputs": [{
	      "name": "m",
	      "type": "string"
	   }],
	   "constant": false,
	   "name": "addBrick"
	}, {
	   "constant": true,
	   "name": "accumCount",
	   "inputs": [],
	   "type": "function",
	   "outputs": [{
	      "name": "",
	      "type": "uint256"
	   }]
	}, {
	   "outputs": [{
	      "name": "",
	      "type": "address"
	   }],
	   "type": "function",
	   "inputs": [{
	      "name": "name",
	      "type": "bytes32"
	   }],
	   "name": "named",
	   "constant": false
	}, {
	   "outputs": [],
	   "type": "function",
	   "inputs": [{
	      "type": "address",
	      "name": "newOwner"
	   }],
	   "name": "changeOwner",
	   "constant": false
	}, {
	   "outputs": [{
	      "name": "",
	      "type": "int32"
	   }],
	   "type": "function",
	   "inputs": [],
	   "name": "brickD",
	   "constant": true
	}, {
	   "constant": false,
	   "name": "addBrick",
	   "inputs": [],
	   "type": "function",
	   "outputs": []
	}, {
	   "type": "function",
	   "outputs": [{
	      "type": "uint256",
	      "name": ""
	   }],
	   "name": "clearThreshold",
	   "constant": true,
	   "inputs": []
	}, {
	   "inputs": [],
	   "type": "constructor"
	}, {
	   "type": "event",
	   "anonymous": false,
	   "name": "AddBrick",
	   "inputs": [{
	      "type": "uint256",
	      "indexed": true,
	      "name": "id"
	   }, {
	      "type": "address",
	      "indexed": true,
	      "name": "from"
	   }, {
	      "type": "uint256",
	      "indexed": true,
	      "name": "height"
	   }, {
	      "type": "int32",
	      "indexed": false,
	      "name": "offset"
	   }, {
	      "name": "message",
	      "indexed": false,
	      "type": "string"
	   }]
	}, {
	   "anonymous": false,
	   "type": "event",
	   "name": "Collapse",
	   "inputs": [{
	      "indexed": true,
	      "type": "uint256",
	      "name": "id"
	   }, {
	      "type": "uint256",
	      "indexed": true,
	      "name": "collapsedAt"
	   }, {
	      "type": "address",
	      "indexed": true,
	      "name": "account"
	   }, {
	      "indexed": false,
	      "type": "uint256",
	      "name": "amount"
	   }, {
	      "indexed": false,
	      "type": "uint256",
	      "name": "height"
	   }]
	}, {
	   "type": "event",
	   "anonymous": false,
	   "name": "Accumulate",
	   "inputs": [{
	      "name": "count",
	      "type": "uint256",
	      "indexed": true
	   }]
	}, {
	   "name": "Clearing",
	   "inputs": [{
	      "indexed": true,
	      "type": "uint256",
	      "name": "id"
	   }, {
	      "indexed": true,
	      "type": "address",
	      "name": "receiver"
	   }, {
	      "name": "amount",
	      "indexed": true,
	      "type": "uint256"
	   }],
	   "anonymous": false,
	   "type": "event"
	}, {
	   "inputs": [{
	      "name": "receiver",
	      "indexed": true,
	      "type": "address"
	   }, {
	      "name": "amount",
	      "type": "uint256",
	      "indexed": true
	   }],
	   "name": "Withdraw",
	   "type": "event",
	   "anonymous": false
	}, {
	   "anonymous": false,
	   "type": "event",
	   "inputs": [{
	      "name": "values",
	      "type": "uint256[18]",
	      "indexed": false
	   }],
	   "name": "Top18"
	}];
	
	exports["default"] = babelABI;
	module.exports = exports["default"];

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _reactTransformCatchErrors2 = __webpack_require__(117);
	
	var _interopRequireDefault = __webpack_require__(43)['default'];
	
	var _reactTransformCatchErrors3 = _interopRequireDefault(_reactTransformCatchErrors2);
	
	var _react = __webpack_require__(5);
	
	var _redboxReact = __webpack_require__(152);
	
	var _get = __webpack_require__(95)['default'];
	
	var _inherits = __webpack_require__(96)['default'];
	
	var _createClass = __webpack_require__(66)['default'];
	
	var _classCallCheck = __webpack_require__(65)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react2 = _interopRequireDefault(_react);
	
	var _matterJs = __webpack_require__(240);
	
	var _matterJs2 = _interopRequireDefault(_matterJs);
	
	var _storeBabelStore = __webpack_require__(165);
	
	var _storeBabelStore2 = _interopRequireDefault(_storeBabelStore);
	
	__webpack_require__(348);
	
	var _imagesStyle1Png = __webpack_require__(218);
	
	var _imagesStyle1Png2 = _interopRequireDefault(_imagesStyle1Png);
	
	var _imagesStyle2Png = __webpack_require__(219);
	
	var _imagesStyle2Png2 = _interopRequireDefault(_imagesStyle2Png);
	
	var _imagesStyle3Png = __webpack_require__(220);
	
	var _imagesStyle3Png2 = _interopRequireDefault(_imagesStyle3Png);
	
	var _imagesStyle4Png = __webpack_require__(221);
	
	var _imagesStyle4Png2 = _interopRequireDefault(_imagesStyle4Png);
	
	var _imagesStyle5Png = __webpack_require__(222);
	
	var _imagesStyle5Png2 = _interopRequireDefault(_imagesStyle5Png);
	
	var _imagesLoaderGif = __webpack_require__(216);
	
	var _imagesLoaderGif2 = _interopRequireDefault(_imagesLoaderGif);
	
	var _soundsAddBrickWav = __webpack_require__(211);
	
	var _soundsAddBrickWav2 = _interopRequireDefault(_soundsAddBrickWav);
	
	var _soundsCollapseWav = __webpack_require__(212);
	
	var _soundsCollapseWav2 = _interopRequireDefault(_soundsCollapseWav);
	
	var _soundsWinWav = __webpack_require__(213);
	
	var _soundsWinWav2 = _interopRequireDefault(_soundsWinWav);
	
	var _components = {
	  _$GameCanvas: {
	    displayName: 'GameCanvas'
	  }
	};
	
	var _reactComponentWrapper = (0, _reactTransformCatchErrors3['default'])({
	  filename: '/Users/Ben/Projects/dapplab/etherbabel/dapp/app/src/containers/GameCanvas.js',
	  components: _components,
	  locals: [],
	  imports: [_react, _redboxReact]
	});
	
	function _wrapComponent(uniqueId) {
	  return function (ReactClass) {
	    return _reactComponentWrapper(ReactClass, uniqueId);
	  };
	}
	
	function playSound(soundNO) {
	  switch (soundNO) {
	    case 0:
	      var audio = new Audio(_soundsAddBrickWav2['default']);
	      audio.play();
	      break;
	    case 1:
	      var audio1 = new Audio(_soundsCollapseWav2['default']);
	      audio1.play();
	      break;
	    case 2:
	      var audio2 = new Audio(_soundsWinWav2['default']);
	      audio2.play();
	      break;
	  }
	}
	
	// game sizes
	
	var canvasWidth = 750;
	var canvasHeight = window.innerHeight;
	var brickWidth = 100;
	var brickHeight = 20;
	var brickBorder = 1;
	var brickFullHeight = brickHeight + brickBorder * 2;
	var brickHalfWidth = brickWidth / 2;
	var brickD = 1001; //1073741824;
	var brickR = brickD / 2;
	var centralBrickLeft = canvasWidth / 2 - brickWidth / 2;
	
	var Engine = _matterJs2['default'].Engine,
	    World = _matterJs2['default'].World,
	    Bodies = _matterJs2['default'].Bodies,
	    Body = _matterJs2['default'].Body,
	    Common = _matterJs2['default'].Common,
	    Constraint = _matterJs2['default'].Constraint,
	    Events = _matterJs2['default'].Events,
	    Composites = _matterJs2['default'].Composites,
	    babelLevel = 0,
	    isDropping = false;
	
	// create a Matter.js engine
	var engine = Engine.create(document.getElementById('canvas-container'));
	var renderOptions = engine.render.options;
	renderOptions.wireframes = false;
	engine.render.canvas.width = canvasWidth;
	engine.render.canvas.height = canvasHeight;
	var ground = Bodies.rectangle(canvasWidth / 2, canvasHeight + 10, canvasHeight + 10, 80, { isStatic: true, render: { visible: false } });
	
	World.add(engine.world, [ground]);
	Engine.run(engine);
	
	var GameCanvas = (function (_React$Component) {
	  _inherits(GameCanvas, _React$Component);
	
	  function GameCanvas() {
	    _classCallCheck(this, _GameCanvas);
	
	    _get(Object.getPrototypeOf(_GameCanvas.prototype), 'constructor', this).call(this);
	
	    this.babelStore = new _storeBabelStore2['default']();
	    this.babel = this.babelStore.babel;
	    this.state = { action: null, bricks: [], addedBrick: null, celebrate: false, loading: false, showLoader: true };
	
	    this.setupFilters(this.babel);
	  }
	
	  // for debug
	
	  _createClass(GameCanvas, [{
	    key: 'collapse',
	    value: function collapse(obj) {
	      var bricks = this.state.bricks.slice(0, obj.collapsedAt + 1);
	      this.setState({ bricks: bricks, action: 'collapse', from: obj.collapsedAt, win: obj, collapsedAmount: obj.amount, celebrate: this.babelStore.donatedByU(obj.account), loading: false });
	      console.log("Collapsed!", this.babelStore.donatedByU(obj.account), obj);
	      this.setState({ action: null });
	    }
	  }, {
	    key: 'addBrick',
	    value: function addBrick(brick) {
	      var bricks = this.state.bricks;
	      bricks.push(brick);
	      this.setState({ action: 'addBrick', addedBrick: brick, bricks: bricks, loading: false });
	      console.log("AddBrick", brick);
	      this.setState({ addedBrick: null, action: null });
	    }
	  }, {
	    key: 'addBrickCallback',
	    value: function addBrickCallback(err, result) {
	      if (err) {
	        console.log(err);
	      } else {
	        var obj = this.babelStore.formatBrick(result.args);
	        this.addBrick(obj);
	      }
	    }
	  }, {
	    key: 'collapseCallback',
	    value: function collapseCallback(err, result) {
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
	        this.collapse(obj);
	      }
	    }
	  }, {
	    key: 'setupFilters',
	    value: function setupFilters(babel) {
	      babel.AddBrick('latest', this.addBrickCallback.bind(this));
	      babel.Collapse('latest', this.collapseCallback.bind(this));
	    }
	  }, {
	    key: 'handleClick',
	    value: function handleClick(e) {
	      playSound(0);
	      var ele = e.target;
	      ele.disabled = true;
	      setTimeout(function () {
	        ele.disabled = false;
	      }, 1000);
	
	      this.setState({ loading: true, action: null });
	      this.babel.addBrick('', {
	        from: this.babelStore.gamerAddress,
	        value: this.babelStore.brickPrice
	      });
	    }
	  }, {
	    key: 'collapseBricks',
	    value: function collapseBricks(from) {
	      playSound(1);
	      var bricks = engine.world.bodies;
	      var collapsedAt = from + 1;
	      var collapseBrick = bricks[collapsedAt];
	
	      if (!collapseBrick) return;
	
	      for (var j = from + 1; j < bricks.length; j++) {
	        Body.setInertia(bricks[j], 0.1);
	        Body.setPosition(bricks[j], { x: collapseBrick.position.x + Common.choose([200, -200]), y: canvasHeight - collapsedAt * 20 });
	      }
	
	      //clear collapesed bricks
	      setTimeout(function () {
	        World.remove(engine.world, bricks.slice(collapsedAt));
	      }, 2000);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this = this;
	
	      setTimeout(function () {
	        var bricks = _this.babelStore.getBricksFromOffsets();
	        _this.initBricks(bricks);
	        _this.setState({ bricks: bricks, showLoader: false });
	      }, 1000);
	    }
	  }, {
	    key: 'initBricks',
	    value: function initBricks(bricks) {
	      var bodies = [];
	      for (var i = 0; i < bricks.length; i++) {
	        bodies.push(this.createBrickRectangle(bricks[i], canvasHeight - 40 - brickHeight * i));
	      }
	
	      console.log(bodies);
	      World.add(engine.world, bodies);
	    }
	  }, {
	    key: 'createBrickRectangle',
	    value: function createBrickRectangle(brick) {
	      var y = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];
	
	      var offset = centralBrickLeft + brickHalfWidth * brick.offset / brickR;
	      var texture = Common.choose([_imagesStyle4Png2['default'], _imagesStyle5Png2['default'], _imagesStyle3Png2['default'], _imagesStyle1Png2['default'], _imagesStyle2Png2['default']]);
	      console.log(offset, y);
	      return Bodies.rectangle(offset, y, brickWidth, brickHeight, { label: brick.id, inertia: Infinity, density: 10000,
	        render: { sprite: { texture: texture } } });
	    }
	  }, {
	    key: 'renderBrickList',
	    value: function renderBrickList() {
	      switch (this.state.action) {
	        case 'addBrick':
	          var brick = this.state.addedBrick;
	          if (brick !== null) {
	            var newBody = this.createBrickRectangle(brick);
	            World.add(engine.world, newBody);
	          }
	        case 'collapse':
	          this.collapseBricks(this.state.from);
	      }
	    }
	  }, {
	    key: 'renderLoading',
	    value: function renderLoading(loading) {
	      if (loading) {
	        return _react2['default'].createElement(
	          'div',
	          { className: 'loading animated infinite zoomOutRight' },
	          ' '
	        );
	      } else {
	        return '';
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      this.renderBrickList();
	
	      var win = '';
	      if (this.state.celebrate) {
	        playSound(2);
	        win = _react2['default'].createElement(
	          'div',
	          { className: 'win animated infinite swing' },
	          _react2['default'].createElement(
	            'p',
	            null,
	            'You just won ',
	            _react2['default'].createElement(
	              'b',
	              null,
	              (Number(this.state.collapsedAmount) / 1000000000000000000).toLocaleString()
	            ),
	            ' coins. '
	          )
	        );
	        setTimeout(function () {
	          _this2.setState({ celebrate: false });
	        }, 40000);
	      }
	
	      var loader = '';
	      if (this.state.loader) {
	        loader = _react2['default'].createElement(
	          'div',
	          { className: 'loader' },
	          _react2['default'].createElement('img', { src: _imagesLoaderGif2['default'] })
	        );
	      }
	
	      return _react2['default'].createElement(
	        'div',
	        { id: 'game-canvas' },
	        _react2['default'].createElement(
	          'div',
	          { className: 'game-spec' },
	          _react2['default'].createElement(
	            'h2',
	            null,
	            'Babel the Tower'
	          ),
	          _react2['default'].createElement(
	            'p',
	            null,
	            'Insert 1 eth coin, drop a Christmas gift and win rewards. lol'
	          ),
	          _react2['default'].createElement(
	            'p',
	            null,
	            'Enjoy and have fun :)'
	          ),
	          _react2['default'].createElement(
	            'p',
	            null,
	            _react2['default'].createElement(
	              'a',
	              { target: '_blank', href: 'https://github.com/dapplab/etherbabel' },
	              'Github'
	            ),
	            '     ',
	            _react2['default'].createElement(
	              'a',
	              { target: '_blank', href: 'https://github.com/dapplab/etherbabel' },
	              'Help'
	            )
	          ),
	          _react2['default'].createElement(
	            'button',
	            { className: 'btn btn-primary insert-coin', onClick: function (e) {
	                return _this2.handleClick(e);
	              } },
	            'Insert Coin'
	          )
	        ),
	        this.renderLoading(this.state.loading),
	        win,
	        loader
	      );
	    }
	  }]);
	
	  var _GameCanvas = GameCanvas;
	  GameCanvas = _wrapComponent('_$GameCanvas')(GameCanvas) || GameCanvas;
	  return GameCanvas;
	})(_react2['default'].Component);
	
	exports['default'] = GameCanvas;
	window.bricks = engine.world.bodies;
	module.exports = exports['default'];

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _reactTransformCatchErrors2 = __webpack_require__(117);
	
	var _interopRequireDefault = __webpack_require__(43)['default'];
	
	var _reactTransformCatchErrors3 = _interopRequireDefault(_reactTransformCatchErrors2);
	
	var _react = __webpack_require__(5);
	
	var _redboxReact = __webpack_require__(152);
	
	var _get = __webpack_require__(95)['default'];
	
	var _inherits = __webpack_require__(96)['default'];
	
	var _createClass = __webpack_require__(66)['default'];
	
	var _classCallCheck = __webpack_require__(65)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react2 = _interopRequireDefault(_react);
	
	var _GameCanvas = __webpack_require__(163);
	
	var _GameCanvas2 = _interopRequireDefault(_GameCanvas);
	
	__webpack_require__(224);
	
	var _components = {
	  _$Root: {
	    displayName: 'Root'
	  }
	};
	
	var _reactComponentWrapper = (0, _reactTransformCatchErrors3['default'])({
	  filename: '/Users/Ben/Projects/dapplab/etherbabel/dapp/app/src/containers/Root.js',
	  components: _components,
	  locals: [],
	  imports: [_react, _redboxReact]
	});
	
	function _wrapComponent(uniqueId) {
	  return function (ReactClass) {
	    return _reactComponentWrapper(ReactClass, uniqueId);
	  };
	}
	
	var Root = (function (_React$Component) {
	  _inherits(Root, _React$Component);
	
	  function Root() {
	    _classCallCheck(this, _Root);
	
	    _get(Object.getPrototypeOf(_Root.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(Root, [{
	    key: 'render',
	    value: function render() {
	      return _react2['default'].createElement(
	        'div',
	        null,
	        _react2['default'].createElement(_GameCanvas2['default'], null)
	      );
	    }
	  }]);
	
	  var _Root = Root;
	  Root = _wrapComponent('_$Root')(Root) || Root;
	  return Root;
	})(_react2['default'].Component);
	
	exports['default'] = Root;
	module.exports = exports['default'];

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = __webpack_require__(66)['default'];
	
	var _classCallCheck = __webpack_require__(65)['default'];
	
	var _interopRequireDefault = __webpack_require__(43)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _web3 = __webpack_require__(350);
	
	var _web32 = _interopRequireDefault(_web3);
	
	var _babelAbi = __webpack_require__(162);
	
	var _babelAbi2 = _interopRequireDefault(_babelAbi);
	
	var BabelConfig = {
	  sandboxId: "0cfb76d328306826abb50f48b20e43b0b5a2550d",
	  babelAddress: '0x17956ba5f4291844bc25aedb27e69bc11b5bda39',
	  gamerAddress: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
	  providerUrl: 'http://babel.on.ether.camp:8555/sandbox/'
	};
	
	var BabelStore = (function () {
	  function BabelStore(props) {
	    _classCallCheck(this, BabelStore);
	
	    var web3 = this.setupWeb3();
	    var babel = this.setupBabel(web3);
	
	    this.web3 = web3;
	    this.babel = babel;
	    this.brickPrice = web3.toWei('1', 'ether');
	    this.coinbase = web3.eth.coinbase;
	    this.gamerAddress = BabelConfig.gamerAddress;
	  }
	
	  // class end
	
	  _createClass(BabelStore, [{
	    key: 'setupWeb3',
	    value: function setupWeb3() {
	      var web3 = new _web32['default']();
	      web3.setProvider(new web3.providers.HttpProvider(BabelConfig.providerUrl + BabelConfig.sandboxId));
	
	      return web3;
	    }
	  }, {
	    key: 'setupBabel',
	    value: function setupBabel(web3) {
	      var Babel = web3.eth.contract(_babelAbi2['default']);
	      var babel = Babel.at(BabelConfig.babelAddress);
	      console.log("babel initalized.", babel);
	
	      return babel;
	    }
	  }, {
	    key: 'getBricksFromOffsets',
	    value: function getBricksFromOffsets() {
	      var bricks = [];
	
	      var length = this.babel.getHeight({ from: BabelConfig.gamerAddress }).toNumber();
	      console.log("loading bricks ...");
	      var ids = this.babel.getIds({ from: BabelConfig.gamerAddress });
	      var froms = this.babel.getFroms({ from: BabelConfig.gamerAddress });
	      var values = this.babel.getValues({ from: BabelConfig.gamerAddress });
	      var offsets = this.babel.getOffsets({ from: BabelConfig.gamerAddress });
	      for (var i = 0; i < length; i++) {
	        bricks.push({
	          id: ids[i].toString(),
	          from: froms[i],
	          value: values[i].toString(),
	          offset: offsets[i],
	          donated: this.donatedByU(froms[i])
	        });
	      }
	      console.log(length + " bricks loaded.");
	
	      //if (callback && typeof(callback) === "function") {
	      //callback.call(this, bricks);
	      //}
	
	      return bricks;
	    }
	  }, {
	    key: 'getBricks',
	    value: function getBricks(callback) {
	
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
	      while (true) {
	        var brick = this.formatBrick(this.babel.bricks(i, { from: BabelConfig.gamerAddress }));
	
	        if (brick.from === '0x') {
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
	  }, {
	    key: 'formatBrick',
	    value: function formatBrick(brick) {
	      if (Array.isArray(brick)) {
	        // Init
	        return {
	          id: brick[0].toString(),
	          from: brick[1],
	          value: brick[2].toString(),
	          offset: brick[3],
	          donated: this.donatedByU(brick[1])
	        };
	      } else {
	        // Event
	        return {
	          id: brick.id.toString(),
	          from: brick.from,
	          height: brick.height.toString(),
	          offset: brick.offset,
	          donated: this.donatedByU(brick.from)
	        };
	      }
	    }
	  }, {
	    key: 'donatedByU',
	    value: function donatedByU(brickFrom) {
	      return brickFrom === BabelConfig.gamerAddress;
	    }
	  }]);
	
	  return BabelStore;
	})();
	
	exports['default'] = BabelStore;
	module.exports = exports['default'];

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(170), __esModule: true };

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(171), __esModule: true };

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(172), __esModule: true };

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(173), __esModule: true };

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(44);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(44);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(44);
	__webpack_require__(184);
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $.getDesc(it, key);
	};

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(185);
	module.exports = __webpack_require__(67).Object.setPrototypeOf;

/***/ },
/* 174 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(99);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 176 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 177 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 178 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 179 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(176);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(98)
	  , core    = __webpack_require__(67)
	  , fails   = __webpack_require__(178);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(44).getDesc
	  , isObject = __webpack_require__(99)
	  , anObject = __webpack_require__(175);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(97)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(180)
	  , defined = __webpack_require__(177);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(183);
	
	__webpack_require__(181)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(98);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(182).set});

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(28), __webpack_require__(30), __webpack_require__(29), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var BlockCipher = C_lib.BlockCipher;
		    var C_algo = C.algo;
	
		    // Lookup tables
		    var SBOX = [];
		    var INV_SBOX = [];
		    var SUB_MIX_0 = [];
		    var SUB_MIX_1 = [];
		    var SUB_MIX_2 = [];
		    var SUB_MIX_3 = [];
		    var INV_SUB_MIX_0 = [];
		    var INV_SUB_MIX_1 = [];
		    var INV_SUB_MIX_2 = [];
		    var INV_SUB_MIX_3 = [];
	
		    // Compute lookup tables
		    (function () {
		        // Compute double table
		        var d = [];
		        for (var i = 0; i < 256; i++) {
		            if (i < 128) {
		                d[i] = i << 1;
		            } else {
		                d[i] = (i << 1) ^ 0x11b;
		            }
		        }
	
		        // Walk GF(2^8)
		        var x = 0;
		        var xi = 0;
		        for (var i = 0; i < 256; i++) {
		            // Compute sbox
		            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
		            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
		            SBOX[x] = sx;
		            INV_SBOX[sx] = x;
	
		            // Compute multiplication
		            var x2 = d[x];
		            var x4 = d[x2];
		            var x8 = d[x4];
	
		            // Compute sub bytes, mix columns tables
		            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
		            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
		            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
		            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
		            SUB_MIX_3[x] = t;
	
		            // Compute inv sub bytes, inv mix columns tables
		            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
		            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
		            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
		            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
		            INV_SUB_MIX_3[sx] = t;
	
		            // Compute next counter
		            if (!x) {
		                x = xi = 1;
		            } else {
		                x = x2 ^ d[d[d[x8 ^ x2]]];
		                xi ^= d[d[xi]];
		            }
		        }
		    }());
	
		    // Precomputed Rcon lookup
		    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
	
		    /**
		     * AES block cipher algorithm.
		     */
		    var AES = C_algo.AES = BlockCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var key = this._key;
		            var keyWords = key.words;
		            var keySize = key.sigBytes / 4;
	
		            // Compute number of rounds
		            var nRounds = this._nRounds = keySize + 6
	
		            // Compute number of key schedule rows
		            var ksRows = (nRounds + 1) * 4;
	
		            // Compute key schedule
		            var keySchedule = this._keySchedule = [];
		            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
		                if (ksRow < keySize) {
		                    keySchedule[ksRow] = keyWords[ksRow];
		                } else {
		                    var t = keySchedule[ksRow - 1];
	
		                    if (!(ksRow % keySize)) {
		                        // Rot word
		                        t = (t << 8) | (t >>> 24);
	
		                        // Sub word
		                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
	
		                        // Mix Rcon
		                        t ^= RCON[(ksRow / keySize) | 0] << 24;
		                    } else if (keySize > 6 && ksRow % keySize == 4) {
		                        // Sub word
		                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
		                    }
	
		                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
		                }
		            }
	
		            // Compute inv key schedule
		            var invKeySchedule = this._invKeySchedule = [];
		            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
		                var ksRow = ksRows - invKsRow;
	
		                if (invKsRow % 4) {
		                    var t = keySchedule[ksRow];
		                } else {
		                    var t = keySchedule[ksRow - 4];
		                }
	
		                if (invKsRow < 4 || ksRow <= 4) {
		                    invKeySchedule[invKsRow] = t;
		                } else {
		                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
		                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
		                }
		            }
		        },
	
		        encryptBlock: function (M, offset) {
		            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
		        },
	
		        decryptBlock: function (M, offset) {
		            // Swap 2nd and 4th rows
		            var t = M[offset + 1];
		            M[offset + 1] = M[offset + 3];
		            M[offset + 3] = t;
	
		            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
	
		            // Inv swap 2nd and 4th rows
		            var t = M[offset + 1];
		            M[offset + 1] = M[offset + 3];
		            M[offset + 3] = t;
		        },
	
		        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
		            // Shortcut
		            var nRounds = this._nRounds;
	
		            // Get input, add round key
		            var s0 = M[offset]     ^ keySchedule[0];
		            var s1 = M[offset + 1] ^ keySchedule[1];
		            var s2 = M[offset + 2] ^ keySchedule[2];
		            var s3 = M[offset + 3] ^ keySchedule[3];
	
		            // Key schedule row counter
		            var ksRow = 4;
	
		            // Rounds
		            for (var round = 1; round < nRounds; round++) {
		                // Shift rows, sub bytes, mix columns, add round key
		                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
		                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
		                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
		                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];
	
		                // Update state
		                s0 = t0;
		                s1 = t1;
		                s2 = t2;
		                s3 = t3;
		            }
	
		            // Shift rows, sub bytes, add round key
		            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
		            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
		            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
		            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];
	
		            // Set output
		            M[offset]     = t0;
		            M[offset + 1] = t1;
		            M[offset + 2] = t2;
		            M[offset + 3] = t3;
		        },
	
		        keySize: 256/32
		    });
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
		     */
		    C.AES = BlockCipher._createHelper(AES);
		}());
	
	
		return CryptoJS.AES;
	
	}));

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var C_enc = C.enc;
	
		    /**
		     * UTF-16 BE encoding strategy.
		     */
		    var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
		        /**
		         * Converts a word array to a UTF-16 BE string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-16 BE string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var utf16Chars = [];
		            for (var i = 0; i < sigBytes; i += 2) {
		                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
		                utf16Chars.push(String.fromCharCode(codePoint));
		            }
	
		            return utf16Chars.join('');
		        },
	
		        /**
		         * Converts a UTF-16 BE string to a word array.
		         *
		         * @param {string} utf16Str The UTF-16 BE string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
		         */
		        parse: function (utf16Str) {
		            // Shortcut
		            var utf16StrLength = utf16Str.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < utf16StrLength; i++) {
		                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
		            }
	
		            return WordArray.create(words, utf16StrLength * 2);
		        }
		    };
	
		    /**
		     * UTF-16 LE encoding strategy.
		     */
		    C_enc.Utf16LE = {
		        /**
		         * Converts a word array to a UTF-16 LE string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-16 LE string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var utf16Chars = [];
		            for (var i = 0; i < sigBytes; i += 2) {
		                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
		                utf16Chars.push(String.fromCharCode(codePoint));
		            }
	
		            return utf16Chars.join('');
		        },
	
		        /**
		         * Converts a UTF-16 LE string to a word array.
		         *
		         * @param {string} utf16Str The UTF-16 LE string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
		         */
		        parse: function (utf16Str) {
		            // Shortcut
		            var utf16StrLength = utf16Str.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < utf16StrLength; i++) {
		                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
		            }
	
		            return WordArray.create(words, utf16StrLength * 2);
		        }
		    };
	
		    function swapEndian(word) {
		        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
		    }
		}());
	
	
		return CryptoJS.enc.Utf16;
	
	}));

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (undefined) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var CipherParams = C_lib.CipherParams;
		    var C_enc = C.enc;
		    var Hex = C_enc.Hex;
		    var C_format = C.format;
	
		    var HexFormatter = C_format.Hex = {
		        /**
		         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
		         *
		         * @param {CipherParams} cipherParams The cipher params object.
		         *
		         * @return {string} The hexadecimally encoded string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
		         */
		        stringify: function (cipherParams) {
		            return cipherParams.ciphertext.toString(Hex);
		        },
	
		        /**
		         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
		         *
		         * @param {string} input The hexadecimally encoded string.
		         *
		         * @return {CipherParams} The cipher params object.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
		         */
		        parse: function (input) {
		            var ciphertext = Hex.parse(input);
		            return CipherParams.create({ ciphertext: ciphertext });
		        }
		    };
		}());
	
	
		return CryptoJS.format.Hex;
	
	}));

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(46), __webpack_require__(190), __webpack_require__(187), __webpack_require__(28), __webpack_require__(30), __webpack_require__(69), __webpack_require__(100), __webpack_require__(206), __webpack_require__(102), __webpack_require__(207), __webpack_require__(101), __webpack_require__(205), __webpack_require__(68), __webpack_require__(201), __webpack_require__(29), __webpack_require__(6), __webpack_require__(191), __webpack_require__(193), __webpack_require__(192), __webpack_require__(195), __webpack_require__(194), __webpack_require__(196), __webpack_require__(197), __webpack_require__(198), __webpack_require__(200), __webpack_require__(199), __webpack_require__(188), __webpack_require__(186), __webpack_require__(208), __webpack_require__(204), __webpack_require__(203), __webpack_require__(202));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy"], factory);
		}
		else {
			// Global (browser)
			root.CryptoJS = factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		return CryptoJS;
	
	}));

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Check if typed arrays are supported
		    if (typeof ArrayBuffer != 'function') {
		        return;
		    }
	
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
	
		    // Reference original init
		    var superInit = WordArray.init;
	
		    // Augment WordArray.init to handle typed arrays
		    var subInit = WordArray.init = function (typedArray) {
		        // Convert buffers to uint8
		        if (typedArray instanceof ArrayBuffer) {
		            typedArray = new Uint8Array(typedArray);
		        }
	
		        // Convert other array views to uint8
		        if (
		            typedArray instanceof Int8Array ||
		            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
		            typedArray instanceof Int16Array ||
		            typedArray instanceof Uint16Array ||
		            typedArray instanceof Int32Array ||
		            typedArray instanceof Uint32Array ||
		            typedArray instanceof Float32Array ||
		            typedArray instanceof Float64Array
		        ) {
		            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
		        }
	
		        // Handle Uint8Array
		        if (typedArray instanceof Uint8Array) {
		            // Shortcut
		            var typedArrayByteLength = typedArray.byteLength;
	
		            // Extract bytes
		            var words = [];
		            for (var i = 0; i < typedArrayByteLength; i++) {
		                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
		            }
	
		            // Initialize this word array
		            superInit.call(this, words, typedArrayByteLength);
		        } else {
		            // Else call normal init
		            superInit.apply(this, arguments);
		        }
		    };
	
		    subInit.prototype = WordArray;
		}());
	
	
		return CryptoJS.lib.WordArray;
	
	}));

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Cipher Feedback block mode.
		 */
		CryptoJS.mode.CFB = (function () {
		    var CFB = CryptoJS.lib.BlockCipherMode.extend();
	
		    CFB.Encryptor = CFB.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher;
		            var blockSize = cipher.blockSize;
	
		            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
	
		            // Remember this block to use with next block
		            this._prevBlock = words.slice(offset, offset + blockSize);
		        }
		    });
	
		    CFB.Decryptor = CFB.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher;
		            var blockSize = cipher.blockSize;
	
		            // Remember this block to use with next block
		            var thisBlock = words.slice(offset, offset + blockSize);
	
		            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
	
		            // This block becomes the previous block
		            this._prevBlock = thisBlock;
		        }
		    });
	
		    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
		        // Shortcut
		        var iv = this._iv;
	
		        // Generate keystream
		        if (iv) {
		            var keystream = iv.slice(0);
	
		            // Remove IV for subsequent blocks
		            this._iv = undefined;
		        } else {
		            var keystream = this._prevBlock;
		        }
		        cipher.encryptBlock(keystream, 0);
	
		        // Encrypt
		        for (var i = 0; i < blockSize; i++) {
		            words[offset + i] ^= keystream[i];
		        }
		    }
	
		    return CFB;
		}());
	
	
		return CryptoJS.mode.CFB;
	
	}));

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/** @preserve
		 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
		 * derived from CryptoJS.mode.CTR
		 * Jan Hruby jhruby.web@gmail.com
		 */
		CryptoJS.mode.CTRGladman = (function () {
		    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
	
			function incWord(word)
			{
				if (((word >> 24) & 0xff) === 0xff) { //overflow
				var b1 = (word >> 16)&0xff;
				var b2 = (word >> 8)&0xff;
				var b3 = word & 0xff;
	
				if (b1 === 0xff) // overflow b1
				{
				b1 = 0;
				if (b2 === 0xff)
				{
					b2 = 0;
					if (b3 === 0xff)
					{
						b3 = 0;
					}
					else
					{
						++b3;
					}
				}
				else
				{
					++b2;
				}
				}
				else
				{
				++b1;
				}
	
				word = 0;
				word += (b1 << 16);
				word += (b2 << 8);
				word += b3;
				}
				else
				{
				word += (0x01 << 24);
				}
				return word;
			}
	
			function incCounter(counter)
			{
				if ((counter[0] = incWord(counter[0])) === 0)
				{
					// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
					counter[1] = incWord(counter[1]);
				}
				return counter;
			}
	
		    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher
		            var blockSize = cipher.blockSize;
		            var iv = this._iv;
		            var counter = this._counter;
	
		            // Generate keystream
		            if (iv) {
		                counter = this._counter = iv.slice(0);
	
		                // Remove IV for subsequent blocks
		                this._iv = undefined;
		            }
	
					incCounter(counter);
	
					var keystream = counter.slice(0);
		            cipher.encryptBlock(keystream, 0);
	
		            // Encrypt
		            for (var i = 0; i < blockSize; i++) {
		                words[offset + i] ^= keystream[i];
		            }
		        }
		    });
	
		    CTRGladman.Decryptor = Encryptor;
	
		    return CTRGladman;
		}());
	
	
	
	
		return CryptoJS.mode.CTRGladman;
	
	}));

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Counter block mode.
		 */
		CryptoJS.mode.CTR = (function () {
		    var CTR = CryptoJS.lib.BlockCipherMode.extend();
	
		    var Encryptor = CTR.Encryptor = CTR.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher
		            var blockSize = cipher.blockSize;
		            var iv = this._iv;
		            var counter = this._counter;
	
		            // Generate keystream
		            if (iv) {
		                counter = this._counter = iv.slice(0);
	
		                // Remove IV for subsequent blocks
		                this._iv = undefined;
		            }
		            var keystream = counter.slice(0);
		            cipher.encryptBlock(keystream, 0);
	
		            // Increment counter
		            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0
	
		            // Encrypt
		            for (var i = 0; i < blockSize; i++) {
		                words[offset + i] ^= keystream[i];
		            }
		        }
		    });
	
		    CTR.Decryptor = Encryptor;
	
		    return CTR;
		}());
	
	
		return CryptoJS.mode.CTR;
	
	}));

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Electronic Codebook block mode.
		 */
		CryptoJS.mode.ECB = (function () {
		    var ECB = CryptoJS.lib.BlockCipherMode.extend();
	
		    ECB.Encryptor = ECB.extend({
		        processBlock: function (words, offset) {
		            this._cipher.encryptBlock(words, offset);
		        }
		    });
	
		    ECB.Decryptor = ECB.extend({
		        processBlock: function (words, offset) {
		            this._cipher.decryptBlock(words, offset);
		        }
		    });
	
		    return ECB;
		}());
	
	
		return CryptoJS.mode.ECB;
	
	}));

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Output Feedback block mode.
		 */
		CryptoJS.mode.OFB = (function () {
		    var OFB = CryptoJS.lib.BlockCipherMode.extend();
	
		    var Encryptor = OFB.Encryptor = OFB.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher
		            var blockSize = cipher.blockSize;
		            var iv = this._iv;
		            var keystream = this._keystream;
	
		            // Generate keystream
		            if (iv) {
		                keystream = this._keystream = iv.slice(0);
	
		                // Remove IV for subsequent blocks
		                this._iv = undefined;
		            }
		            cipher.encryptBlock(keystream, 0);
	
		            // Encrypt
		            for (var i = 0; i < blockSize; i++) {
		                words[offset + i] ^= keystream[i];
		            }
		        }
		    });
	
		    OFB.Decryptor = Encryptor;
	
		    return OFB;
		}());
	
	
		return CryptoJS.mode.OFB;
	
	}));

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * ANSI X.923 padding strategy.
		 */
		CryptoJS.pad.AnsiX923 = {
		    pad: function (data, blockSize) {
		        // Shortcuts
		        var dataSigBytes = data.sigBytes;
		        var blockSizeBytes = blockSize * 4;
	
		        // Count padding bytes
		        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
	
		        // Compute last byte position
		        var lastBytePos = dataSigBytes + nPaddingBytes - 1;
	
		        // Pad
		        data.clamp();
		        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
		        data.sigBytes += nPaddingBytes;
		    },
	
		    unpad: function (data) {
		        // Get number of padding bytes from last byte
		        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
	
		        // Remove padding
		        data.sigBytes -= nPaddingBytes;
		    }
		};
	
	
		return CryptoJS.pad.Ansix923;
	
	}));

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * ISO 10126 padding strategy.
		 */
		CryptoJS.pad.Iso10126 = {
		    pad: function (data, blockSize) {
		        // Shortcut
		        var blockSizeBytes = blockSize * 4;
	
		        // Count padding bytes
		        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
	
		        // Pad
		        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
		             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
		    },
	
		    unpad: function (data) {
		        // Get number of padding bytes from last byte
		        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
	
		        // Remove padding
		        data.sigBytes -= nPaddingBytes;
		    }
		};
	
	
		return CryptoJS.pad.Iso10126;
	
	}));

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * ISO/IEC 9797-1 Padding Method 2.
		 */
		CryptoJS.pad.Iso97971 = {
		    pad: function (data, blockSize) {
		        // Add 0x80 byte
		        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));
	
		        // Zero pad the rest
		        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
		    },
	
		    unpad: function (data) {
		        // Remove zero padding
		        CryptoJS.pad.ZeroPadding.unpad(data);
	
		        // Remove one more byte -- the 0x80 byte
		        data.sigBytes--;
		    }
		};
	
	
		return CryptoJS.pad.Iso97971;
	
	}));

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * A noop padding strategy.
		 */
		CryptoJS.pad.NoPadding = {
		    pad: function () {
		    },
	
		    unpad: function () {
		    }
		};
	
	
		return CryptoJS.pad.NoPadding;
	
	}));

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Zero padding strategy.
		 */
		CryptoJS.pad.ZeroPadding = {
		    pad: function (data, blockSize) {
		        // Shortcut
		        var blockSizeBytes = blockSize * 4;
	
		        // Pad
		        data.clamp();
		        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
		    },
	
		    unpad: function (data) {
		        // Shortcut
		        var dataWords = data.words;
	
		        // Unpad
		        var i = data.sigBytes - 1;
		        while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
		            i--;
		        }
		        data.sigBytes = i + 1;
		    }
		};
	
	
		return CryptoJS.pad.ZeroPadding;
	
	}));

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(69), __webpack_require__(68));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./sha1", "./hmac"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var WordArray = C_lib.WordArray;
		    var C_algo = C.algo;
		    var SHA1 = C_algo.SHA1;
		    var HMAC = C_algo.HMAC;
	
		    /**
		     * Password-Based Key Derivation Function 2 algorithm.
		     */
		    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
		         * @property {Hasher} hasher The hasher to use. Default: SHA1
		         * @property {number} iterations The number of iterations to perform. Default: 1
		         */
		        cfg: Base.extend({
		            keySize: 128/32,
		            hasher: SHA1,
		            iterations: 1
		        }),
	
		        /**
		         * Initializes a newly created key derivation function.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
		         *
		         * @example
		         *
		         *     var kdf = CryptoJS.algo.PBKDF2.create();
		         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
		         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
		         */
		        init: function (cfg) {
		            this.cfg = this.cfg.extend(cfg);
		        },
	
		        /**
		         * Computes the Password-Based Key Derivation Function 2.
		         *
		         * @param {WordArray|string} password The password.
		         * @param {WordArray|string} salt A salt.
		         *
		         * @return {WordArray} The derived key.
		         *
		         * @example
		         *
		         *     var key = kdf.compute(password, salt);
		         */
		        compute: function (password, salt) {
		            // Shortcut
		            var cfg = this.cfg;
	
		            // Init HMAC
		            var hmac = HMAC.create(cfg.hasher, password);
	
		            // Initial values
		            var derivedKey = WordArray.create();
		            var blockIndex = WordArray.create([0x00000001]);
	
		            // Shortcuts
		            var derivedKeyWords = derivedKey.words;
		            var blockIndexWords = blockIndex.words;
		            var keySize = cfg.keySize;
		            var iterations = cfg.iterations;
	
		            // Generate key
		            while (derivedKeyWords.length < keySize) {
		                var block = hmac.update(salt).finalize(blockIndex);
		                hmac.reset();
	
		                // Shortcuts
		                var blockWords = block.words;
		                var blockWordsLength = blockWords.length;
	
		                // Iterations
		                var intermediate = block;
		                for (var i = 1; i < iterations; i++) {
		                    intermediate = hmac.finalize(intermediate);
		                    hmac.reset();
	
		                    // Shortcut
		                    var intermediateWords = intermediate.words;
	
		                    // XOR intermediate with block
		                    for (var j = 0; j < blockWordsLength; j++) {
		                        blockWords[j] ^= intermediateWords[j];
		                    }
		                }
	
		                derivedKey.concat(block);
		                blockIndexWords[0]++;
		            }
		            derivedKey.sigBytes = keySize * 4;
	
		            return derivedKey;
		        }
		    });
	
		    /**
		     * Computes the Password-Based Key Derivation Function 2.
		     *
		     * @param {WordArray|string} password The password.
		     * @param {WordArray|string} salt A salt.
		     * @param {Object} cfg (Optional) The configuration options to use for this computation.
		     *
		     * @return {WordArray} The derived key.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var key = CryptoJS.PBKDF2(password, salt);
		     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
		     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
		     */
		    C.PBKDF2 = function (password, salt, cfg) {
		        return PBKDF2.create(cfg).compute(password, salt);
		    };
		}());
	
	
		return CryptoJS.PBKDF2;
	
	}));

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(28), __webpack_require__(30), __webpack_require__(29), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var StreamCipher = C_lib.StreamCipher;
		    var C_algo = C.algo;
	
		    // Reusable objects
		    var S  = [];
		    var C_ = [];
		    var G  = [];
	
		    /**
		     * Rabbit stream cipher algorithm.
		     *
		     * This is a legacy version that neglected to convert the key to little-endian.
		     * This error doesn't affect the cipher's security,
		     * but it does affect its compatibility with other implementations.
		     */
		    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var K = this._key.words;
		            var iv = this.cfg.iv;
	
		            // Generate initial state values
		            var X = this._X = [
		                K[0], (K[3] << 16) | (K[2] >>> 16),
		                K[1], (K[0] << 16) | (K[3] >>> 16),
		                K[2], (K[1] << 16) | (K[0] >>> 16),
		                K[3], (K[2] << 16) | (K[1] >>> 16)
		            ];
	
		            // Generate initial counter values
		            var C = this._C = [
		                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
		                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
		                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
		                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
		            ];
	
		            // Carry bit
		            this._b = 0;
	
		            // Iterate the system four times
		            for (var i = 0; i < 4; i++) {
		                nextState.call(this);
		            }
	
		            // Modify the counters
		            for (var i = 0; i < 8; i++) {
		                C[i] ^= X[(i + 4) & 7];
		            }
	
		            // IV setup
		            if (iv) {
		                // Shortcuts
		                var IV = iv.words;
		                var IV_0 = IV[0];
		                var IV_1 = IV[1];
	
		                // Generate four subvectors
		                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
		                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
		                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
		                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);
	
		                // Modify counter values
		                C[0] ^= i0;
		                C[1] ^= i1;
		                C[2] ^= i2;
		                C[3] ^= i3;
		                C[4] ^= i0;
		                C[5] ^= i1;
		                C[6] ^= i2;
		                C[7] ^= i3;
	
		                // Iterate the system four times
		                for (var i = 0; i < 4; i++) {
		                    nextState.call(this);
		                }
		            }
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var X = this._X;
	
		            // Iterate the system
		            nextState.call(this);
	
		            // Generate four keystream words
		            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
		            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
		            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
		            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);
	
		            for (var i = 0; i < 4; i++) {
		                // Swap endian
		                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
		                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);
	
		                // Encrypt
		                M[offset + i] ^= S[i];
		            }
		        },
	
		        blockSize: 128/32,
	
		        ivSize: 64/32
		    });
	
		    function nextState() {
		        // Shortcuts
		        var X = this._X;
		        var C = this._C;
	
		        // Save old counter values
		        for (var i = 0; i < 8; i++) {
		            C_[i] = C[i];
		        }
	
		        // Calculate new counter values
		        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
		        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
		        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
		        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
		        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
		        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
		        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
		        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
		        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;
	
		        // Calculate the g-values
		        for (var i = 0; i < 8; i++) {
		            var gx = X[i] + C[i];
	
		            // Construct high and low argument for squaring
		            var ga = gx & 0xffff;
		            var gb = gx >>> 16;
	
		            // Calculate high and low result of squaring
		            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
		            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);
	
		            // High XOR low
		            G[i] = gh ^ gl;
		        }
	
		        // Calculate new state values
		        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
		        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
		        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
		        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
		        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
		        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
		        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
		        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
		    }
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
		     */
		    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
		}());
	
	
		return CryptoJS.RabbitLegacy;
	
	}));

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(28), __webpack_require__(30), __webpack_require__(29), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var StreamCipher = C_lib.StreamCipher;
		    var C_algo = C.algo;
	
		    // Reusable objects
		    var S  = [];
		    var C_ = [];
		    var G  = [];
	
		    /**
		     * Rabbit stream cipher algorithm
		     */
		    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var K = this._key.words;
		            var iv = this.cfg.iv;
	
		            // Swap endian
		            for (var i = 0; i < 4; i++) {
		                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
		                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
		            }
	
		            // Generate initial state values
		            var X = this._X = [
		                K[0], (K[3] << 16) | (K[2] >>> 16),
		                K[1], (K[0] << 16) | (K[3] >>> 16),
		                K[2], (K[1] << 16) | (K[0] >>> 16),
		                K[3], (K[2] << 16) | (K[1] >>> 16)
		            ];
	
		            // Generate initial counter values
		            var C = this._C = [
		                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
		                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
		                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
		                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
		            ];
	
		            // Carry bit
		            this._b = 0;
	
		            // Iterate the system four times
		            for (var i = 0; i < 4; i++) {
		                nextState.call(this);
		            }
	
		            // Modify the counters
		            for (var i = 0; i < 8; i++) {
		                C[i] ^= X[(i + 4) & 7];
		            }
	
		            // IV setup
		            if (iv) {
		                // Shortcuts
		                var IV = iv.words;
		                var IV_0 = IV[0];
		                var IV_1 = IV[1];
	
		                // Generate four subvectors
		                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
		                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
		                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
		                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);
	
		                // Modify counter values
		                C[0] ^= i0;
		                C[1] ^= i1;
		                C[2] ^= i2;
		                C[3] ^= i3;
		                C[4] ^= i0;
		                C[5] ^= i1;
		                C[6] ^= i2;
		                C[7] ^= i3;
	
		                // Iterate the system four times
		                for (var i = 0; i < 4; i++) {
		                    nextState.call(this);
		                }
		            }
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var X = this._X;
	
		            // Iterate the system
		            nextState.call(this);
	
		            // Generate four keystream words
		            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
		            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
		            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
		            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);
	
		            for (var i = 0; i < 4; i++) {
		                // Swap endian
		                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
		                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);
	
		                // Encrypt
		                M[offset + i] ^= S[i];
		            }
		        },
	
		        blockSize: 128/32,
	
		        ivSize: 64/32
		    });
	
		    function nextState() {
		        // Shortcuts
		        var X = this._X;
		        var C = this._C;
	
		        // Save old counter values
		        for (var i = 0; i < 8; i++) {
		            C_[i] = C[i];
		        }
	
		        // Calculate new counter values
		        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
		        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
		        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
		        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
		        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
		        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
		        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
		        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
		        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;
	
		        // Calculate the g-values
		        for (var i = 0; i < 8; i++) {
		            var gx = X[i] + C[i];
	
		            // Construct high and low argument for squaring
		            var ga = gx & 0xffff;
		            var gb = gx >>> 16;
	
		            // Calculate high and low result of squaring
		            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
		            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);
	
		            // High XOR low
		            G[i] = gh ^ gl;
		        }
	
		        // Calculate new state values
		        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
		        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
		        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
		        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
		        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
		        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
		        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
		        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
		    }
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
		     */
		    C.Rabbit = StreamCipher._createHelper(Rabbit);
		}());
	
	
		return CryptoJS.Rabbit;
	
	}));

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(28), __webpack_require__(30), __webpack_require__(29), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var StreamCipher = C_lib.StreamCipher;
		    var C_algo = C.algo;
	
		    /**
		     * RC4 stream cipher algorithm.
		     */
		    var RC4 = C_algo.RC4 = StreamCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var key = this._key;
		            var keyWords = key.words;
		            var keySigBytes = key.sigBytes;
	
		            // Init sbox
		            var S = this._S = [];
		            for (var i = 0; i < 256; i++) {
		                S[i] = i;
		            }
	
		            // Key setup
		            for (var i = 0, j = 0; i < 256; i++) {
		                var keyByteIndex = i % keySigBytes;
		                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;
	
		                j = (j + S[i] + keyByte) % 256;
	
		                // Swap
		                var t = S[i];
		                S[i] = S[j];
		                S[j] = t;
		            }
	
		            // Counters
		            this._i = this._j = 0;
		        },
	
		        _doProcessBlock: function (M, offset) {
		            M[offset] ^= generateKeystreamWord.call(this);
		        },
	
		        keySize: 256/32,
	
		        ivSize: 0
		    });
	
		    function generateKeystreamWord() {
		        // Shortcuts
		        var S = this._S;
		        var i = this._i;
		        var j = this._j;
	
		        // Generate keystream word
		        var keystreamWord = 0;
		        for (var n = 0; n < 4; n++) {
		            i = (i + 1) % 256;
		            j = (j + S[i]) % 256;
	
		            // Swap
		            var t = S[i];
		            S[i] = S[j];
		            S[j] = t;
	
		            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
		        }
	
		        // Update counters
		        this._i = i;
		        this._j = j;
	
		        return keystreamWord;
		    }
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
		     */
		    C.RC4 = StreamCipher._createHelper(RC4);
	
		    /**
		     * Modified RC4 stream cipher algorithm.
		     */
		    var RC4Drop = C_algo.RC4Drop = RC4.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {number} drop The number of keystream words to drop. Default 192
		         */
		        cfg: RC4.cfg.extend({
		            drop: 192
		        }),
	
		        _doReset: function () {
		            RC4._doReset.call(this);
	
		            // Drop
		            for (var i = this.cfg.drop; i > 0; i--) {
		                generateKeystreamWord.call(this);
		            }
		        }
		    });
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
		     */
		    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
		}());
	
	
		return CryptoJS.RC4;
	
	}));

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/** @preserve
		(c) 2012 by Cédric Mesnil. All rights reserved.
	
		Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
	
		    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
		    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	
		THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		*/
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Constants table
		    var _zl = WordArray.create([
		        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
		        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
		        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
		        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
		        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
		    var _zr = WordArray.create([
		        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
		        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
		        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
		        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
		        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
		    var _sl = WordArray.create([
		         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
		        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
		        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
		          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
		        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
		    var _sr = WordArray.create([
		        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
		        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
		        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
		        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
		        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);
	
		    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
		    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);
	
		    /**
		     * RIPEMD160 hash algorithm.
		     */
		    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
		        _doReset: function () {
		            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
		        },
	
		        _doProcessBlock: function (M, offset) {
	
		            // Swap endian
		            for (var i = 0; i < 16; i++) {
		                // Shortcuts
		                var offset_i = offset + i;
		                var M_offset_i = M[offset_i];
	
		                // Swap
		                M[offset_i] = (
		                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
		                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
		                );
		            }
		            // Shortcut
		            var H  = this._hash.words;
		            var hl = _hl.words;
		            var hr = _hr.words;
		            var zl = _zl.words;
		            var zr = _zr.words;
		            var sl = _sl.words;
		            var sr = _sr.words;
	
		            // Working variables
		            var al, bl, cl, dl, el;
		            var ar, br, cr, dr, er;
	
		            ar = al = H[0];
		            br = bl = H[1];
		            cr = cl = H[2];
		            dr = dl = H[3];
		            er = el = H[4];
		            // Computation
		            var t;
		            for (var i = 0; i < 80; i += 1) {
		                t = (al +  M[offset+zl[i]])|0;
		                if (i<16){
			            t +=  f1(bl,cl,dl) + hl[0];
		                } else if (i<32) {
			            t +=  f2(bl,cl,dl) + hl[1];
		                } else if (i<48) {
			            t +=  f3(bl,cl,dl) + hl[2];
		                } else if (i<64) {
			            t +=  f4(bl,cl,dl) + hl[3];
		                } else {// if (i<80) {
			            t +=  f5(bl,cl,dl) + hl[4];
		                }
		                t = t|0;
		                t =  rotl(t,sl[i]);
		                t = (t+el)|0;
		                al = el;
		                el = dl;
		                dl = rotl(cl, 10);
		                cl = bl;
		                bl = t;
	
		                t = (ar + M[offset+zr[i]])|0;
		                if (i<16){
			            t +=  f5(br,cr,dr) + hr[0];
		                } else if (i<32) {
			            t +=  f4(br,cr,dr) + hr[1];
		                } else if (i<48) {
			            t +=  f3(br,cr,dr) + hr[2];
		                } else if (i<64) {
			            t +=  f2(br,cr,dr) + hr[3];
		                } else {// if (i<80) {
			            t +=  f1(br,cr,dr) + hr[4];
		                }
		                t = t|0;
		                t =  rotl(t,sr[i]) ;
		                t = (t+er)|0;
		                ar = er;
		                er = dr;
		                dr = rotl(cr, 10);
		                cr = br;
		                br = t;
		            }
		            // Intermediate hash value
		            t    = (H[1] + cl + dr)|0;
		            H[1] = (H[2] + dl + er)|0;
		            H[2] = (H[3] + el + ar)|0;
		            H[3] = (H[4] + al + br)|0;
		            H[4] = (H[0] + bl + cr)|0;
		            H[0] =  t;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
		                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
		            );
		            data.sigBytes = (dataWords.length + 1) * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Shortcuts
		            var hash = this._hash;
		            var H = hash.words;
	
		            // Swap endian
		            for (var i = 0; i < 5; i++) {
		                // Shortcut
		                var H_i = H[i];
	
		                // Swap
		                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
		                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
		            }
	
		            // Return final computed hash
		            return hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
	
		    function f1(x, y, z) {
		        return ((x) ^ (y) ^ (z));
	
		    }
	
		    function f2(x, y, z) {
		        return (((x)&(y)) | ((~x)&(z)));
		    }
	
		    function f3(x, y, z) {
		        return (((x) | (~(y))) ^ (z));
		    }
	
		    function f4(x, y, z) {
		        return (((x) & (z)) | ((y)&(~(z))));
		    }
	
		    function f5(x, y, z) {
		        return ((x) ^ ((y) |(~(z))));
	
		    }
	
		    function rotl(x,n) {
		        return (x<<n) | (x>>>(32-n));
		    }
	
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.RIPEMD160('message');
		     *     var hash = CryptoJS.RIPEMD160(wordArray);
		     */
		    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
		     */
		    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
		}(Math));
	
	
		return CryptoJS.RIPEMD160;
	
	}));

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(100));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./sha256"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var C_algo = C.algo;
		    var SHA256 = C_algo.SHA256;
	
		    /**
		     * SHA-224 hash algorithm.
		     */
		    var SHA224 = C_algo.SHA224 = SHA256.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init([
		                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
		                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
		            ]);
		        },
	
		        _doFinalize: function () {
		            var hash = SHA256._doFinalize.call(this);
	
		            hash.sigBytes -= 4;
	
		            return hash;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA224('message');
		     *     var hash = CryptoJS.SHA224(wordArray);
		     */
		    C.SHA224 = SHA256._createHelper(SHA224);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA224(message, key);
		     */
		    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
		}());
	
	
		return CryptoJS.SHA224;
	
	}));

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(46), __webpack_require__(102));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./x64-core", "./sha512"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_x64 = C.x64;
		    var X64Word = C_x64.Word;
		    var X64WordArray = C_x64.WordArray;
		    var C_algo = C.algo;
		    var SHA512 = C_algo.SHA512;
	
		    /**
		     * SHA-384 hash algorithm.
		     */
		    var SHA384 = C_algo.SHA384 = SHA512.extend({
		        _doReset: function () {
		            this._hash = new X64WordArray.init([
		                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
		                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
		                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
		                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
		            ]);
		        },
	
		        _doFinalize: function () {
		            var hash = SHA512._doFinalize.call(this);
	
		            hash.sigBytes -= 16;
	
		            return hash;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA384('message');
		     *     var hash = CryptoJS.SHA384(wordArray);
		     */
		    C.SHA384 = SHA512._createHelper(SHA384);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA384(message, key);
		     */
		    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
		}());
	
	
		return CryptoJS.SHA384;
	
	}));

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(2), __webpack_require__(28), __webpack_require__(30), __webpack_require__(29), __webpack_require__(6));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var BlockCipher = C_lib.BlockCipher;
		    var C_algo = C.algo;
	
		    // Permuted Choice 1 constants
		    var PC1 = [
		        57, 49, 41, 33, 25, 17, 9,  1,
		        58, 50, 42, 34, 26, 18, 10, 2,
		        59, 51, 43, 35, 27, 19, 11, 3,
		        60, 52, 44, 36, 63, 55, 47, 39,
		        31, 23, 15, 7,  62, 54, 46, 38,
		        30, 22, 14, 6,  61, 53, 45, 37,
		        29, 21, 13, 5,  28, 20, 12, 4
		    ];
	
		    // Permuted Choice 2 constants
		    var PC2 = [
		        14, 17, 11, 24, 1,  5,
		        3,  28, 15, 6,  21, 10,
		        23, 19, 12, 4,  26, 8,
		        16, 7,  27, 20, 13, 2,
		        41, 52, 31, 37, 47, 55,
		        30, 40, 51, 45, 33, 48,
		        44, 49, 39, 56, 34, 53,
		        46, 42, 50, 36, 29, 32
		    ];
	
		    // Cumulative bit shift constants
		    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
	
		    // SBOXes and round permutation constants
		    var SBOX_P = [
		        {
		            0x0: 0x808200,
		            0x10000000: 0x8000,
		            0x20000000: 0x808002,
		            0x30000000: 0x2,
		            0x40000000: 0x200,
		            0x50000000: 0x808202,
		            0x60000000: 0x800202,
		            0x70000000: 0x800000,
		            0x80000000: 0x202,
		            0x90000000: 0x800200,
		            0xa0000000: 0x8200,
		            0xb0000000: 0x808000,
		            0xc0000000: 0x8002,
		            0xd0000000: 0x800002,
		            0xe0000000: 0x0,
		            0xf0000000: 0x8202,
		            0x8000000: 0x0,
		            0x18000000: 0x808202,
		            0x28000000: 0x8202,
		            0x38000000: 0x8000,
		            0x48000000: 0x808200,
		            0x58000000: 0x200,
		            0x68000000: 0x808002,
		            0x78000000: 0x2,
		            0x88000000: 0x800200,
		            0x98000000: 0x8200,
		            0xa8000000: 0x808000,
		            0xb8000000: 0x800202,
		            0xc8000000: 0x800002,
		            0xd8000000: 0x8002,
		            0xe8000000: 0x202,
		            0xf8000000: 0x800000,
		            0x1: 0x8000,
		            0x10000001: 0x2,
		            0x20000001: 0x808200,
		            0x30000001: 0x800000,
		            0x40000001: 0x808002,
		            0x50000001: 0x8200,
		            0x60000001: 0x200,
		            0x70000001: 0x800202,
		            0x80000001: 0x808202,
		            0x90000001: 0x808000,
		            0xa0000001: 0x800002,
		            0xb0000001: 0x8202,
		            0xc0000001: 0x202,
		            0xd0000001: 0x800200,
		            0xe0000001: 0x8002,
		            0xf0000001: 0x0,
		            0x8000001: 0x808202,
		            0x18000001: 0x808000,
		            0x28000001: 0x800000,
		            0x38000001: 0x200,
		            0x48000001: 0x8000,
		            0x58000001: 0x800002,
		            0x68000001: 0x2,
		            0x78000001: 0x8202,
		            0x88000001: 0x8002,
		            0x98000001: 0x800202,
		            0xa8000001: 0x202,
		            0xb8000001: 0x808200,
		            0xc8000001: 0x800200,
		            0xd8000001: 0x0,
		            0xe8000001: 0x8200,
		            0xf8000001: 0x808002
		        },
		        {
		            0x0: 0x40084010,
		            0x1000000: 0x4000,
		            0x2000000: 0x80000,
		            0x3000000: 0x40080010,
		            0x4000000: 0x40000010,
		            0x5000000: 0x40084000,
		            0x6000000: 0x40004000,
		            0x7000000: 0x10,
		            0x8000000: 0x84000,
		            0x9000000: 0x40004010,
		            0xa000000: 0x40000000,
		            0xb000000: 0x84010,
		            0xc000000: 0x80010,
		            0xd000000: 0x0,
		            0xe000000: 0x4010,
		            0xf000000: 0x40080000,
		            0x800000: 0x40004000,
		            0x1800000: 0x84010,
		            0x2800000: 0x10,
		            0x3800000: 0x40004010,
		            0x4800000: 0x40084010,
		            0x5800000: 0x40000000,
		            0x6800000: 0x80000,
		            0x7800000: 0x40080010,
		            0x8800000: 0x80010,
		            0x9800000: 0x0,
		            0xa800000: 0x4000,
		            0xb800000: 0x40080000,
		            0xc800000: 0x40000010,
		            0xd800000: 0x84000,
		            0xe800000: 0x40084000,
		            0xf800000: 0x4010,
		            0x10000000: 0x0,
		            0x11000000: 0x40080010,
		            0x12000000: 0x40004010,
		            0x13000000: 0x40084000,
		            0x14000000: 0x40080000,
		            0x15000000: 0x10,
		            0x16000000: 0x84010,
		            0x17000000: 0x4000,
		            0x18000000: 0x4010,
		            0x19000000: 0x80000,
		            0x1a000000: 0x80010,
		            0x1b000000: 0x40000010,
		            0x1c000000: 0x84000,
		            0x1d000000: 0x40004000,
		            0x1e000000: 0x40000000,
		            0x1f000000: 0x40084010,
		            0x10800000: 0x84010,
		            0x11800000: 0x80000,
		            0x12800000: 0x40080000,
		            0x13800000: 0x4000,
		            0x14800000: 0x40004000,
		            0x15800000: 0x40084010,
		            0x16800000: 0x10,
		            0x17800000: 0x40000000,
		            0x18800000: 0x40084000,
		            0x19800000: 0x40000010,
		            0x1a800000: 0x40004010,
		            0x1b800000: 0x80010,
		            0x1c800000: 0x0,
		            0x1d800000: 0x4010,
		            0x1e800000: 0x40080010,
		            0x1f800000: 0x84000
		        },
		        {
		            0x0: 0x104,
		            0x100000: 0x0,
		            0x200000: 0x4000100,
		            0x300000: 0x10104,
		            0x400000: 0x10004,
		            0x500000: 0x4000004,
		            0x600000: 0x4010104,
		            0x700000: 0x4010000,
		            0x800000: 0x4000000,
		            0x900000: 0x4010100,
		            0xa00000: 0x10100,
		            0xb00000: 0x4010004,
		            0xc00000: 0x4000104,
		            0xd00000: 0x10000,
		            0xe00000: 0x4,
		            0xf00000: 0x100,
		            0x80000: 0x4010100,
		            0x180000: 0x4010004,
		            0x280000: 0x0,
		            0x380000: 0x4000100,
		            0x480000: 0x4000004,
		            0x580000: 0x10000,
		            0x680000: 0x10004,
		            0x780000: 0x104,
		            0x880000: 0x4,
		            0x980000: 0x100,
		            0xa80000: 0x4010000,
		            0xb80000: 0x10104,
		            0xc80000: 0x10100,
		            0xd80000: 0x4000104,
		            0xe80000: 0x4010104,
		            0xf80000: 0x4000000,
		            0x1000000: 0x4010100,
		            0x1100000: 0x10004,
		            0x1200000: 0x10000,
		            0x1300000: 0x4000100,
		            0x1400000: 0x100,
		            0x1500000: 0x4010104,
		            0x1600000: 0x4000004,
		            0x1700000: 0x0,
		            0x1800000: 0x4000104,
		            0x1900000: 0x4000000,
		            0x1a00000: 0x4,
		            0x1b00000: 0x10100,
		            0x1c00000: 0x4010000,
		            0x1d00000: 0x104,
		            0x1e00000: 0x10104,
		            0x1f00000: 0x4010004,
		            0x1080000: 0x4000000,
		            0x1180000: 0x104,
		            0x1280000: 0x4010100,
		            0x1380000: 0x0,
		            0x1480000: 0x10004,
		            0x1580000: 0x4000100,
		            0x1680000: 0x100,
		            0x1780000: 0x4010004,
		            0x1880000: 0x10000,
		            0x1980000: 0x4010104,
		            0x1a80000: 0x10104,
		            0x1b80000: 0x4000004,
		            0x1c80000: 0x4000104,
		            0x1d80000: 0x4010000,
		            0x1e80000: 0x4,
		            0x1f80000: 0x10100
		        },
		        {
		            0x0: 0x80401000,
		            0x10000: 0x80001040,
		            0x20000: 0x401040,
		            0x30000: 0x80400000,
		            0x40000: 0x0,
		            0x50000: 0x401000,
		            0x60000: 0x80000040,
		            0x70000: 0x400040,
		            0x80000: 0x80000000,
		            0x90000: 0x400000,
		            0xa0000: 0x40,
		            0xb0000: 0x80001000,
		            0xc0000: 0x80400040,
		            0xd0000: 0x1040,
		            0xe0000: 0x1000,
		            0xf0000: 0x80401040,
		            0x8000: 0x80001040,
		            0x18000: 0x40,
		            0x28000: 0x80400040,
		            0x38000: 0x80001000,
		            0x48000: 0x401000,
		            0x58000: 0x80401040,
		            0x68000: 0x0,
		            0x78000: 0x80400000,
		            0x88000: 0x1000,
		            0x98000: 0x80401000,
		            0xa8000: 0x400000,
		            0xb8000: 0x1040,
		            0xc8000: 0x80000000,
		            0xd8000: 0x400040,
		            0xe8000: 0x401040,
		            0xf8000: 0x80000040,
		            0x100000: 0x400040,
		            0x110000: 0x401000,
		            0x120000: 0x80000040,
		            0x130000: 0x0,
		            0x140000: 0x1040,
		            0x150000: 0x80400040,
		            0x160000: 0x80401000,
		            0x170000: 0x80001040,
		            0x180000: 0x80401040,
		            0x190000: 0x80000000,
		            0x1a0000: 0x80400000,
		            0x1b0000: 0x401040,
		            0x1c0000: 0x80001000,
		            0x1d0000: 0x400000,
		            0x1e0000: 0x40,
		            0x1f0000: 0x1000,
		            0x108000: 0x80400000,
		            0x118000: 0x80401040,
		            0x128000: 0x0,
		            0x138000: 0x401000,
		            0x148000: 0x400040,
		            0x158000: 0x80000000,
		            0x168000: 0x80001040,
		            0x178000: 0x40,
		            0x188000: 0x80000040,
		            0x198000: 0x1000,
		            0x1a8000: 0x80001000,
		            0x1b8000: 0x80400040,
		            0x1c8000: 0x1040,
		            0x1d8000: 0x80401000,
		            0x1e8000: 0x400000,
		            0x1f8000: 0x401040
		        },
		        {
		            0x0: 0x80,
		            0x1000: 0x1040000,
		            0x2000: 0x40000,
		            0x3000: 0x20000000,
		            0x4000: 0x20040080,
		            0x5000: 0x1000080,
		            0x6000: 0x21000080,
		            0x7000: 0x40080,
		            0x8000: 0x1000000,
		            0x9000: 0x20040000,
		            0xa000: 0x20000080,
		            0xb000: 0x21040080,
		            0xc000: 0x21040000,
		            0xd000: 0x0,
		            0xe000: 0x1040080,
		            0xf000: 0x21000000,
		            0x800: 0x1040080,
		            0x1800: 0x21000080,
		            0x2800: 0x80,
		            0x3800: 0x1040000,
		            0x4800: 0x40000,
		            0x5800: 0x20040080,
		            0x6800: 0x21040000,
		            0x7800: 0x20000000,
		            0x8800: 0x20040000,
		            0x9800: 0x0,
		            0xa800: 0x21040080,
		            0xb800: 0x1000080,
		            0xc800: 0x20000080,
		            0xd800: 0x21000000,
		            0xe800: 0x1000000,
		            0xf800: 0x40080,
		            0x10000: 0x40000,
		            0x11000: 0x80,
		            0x12000: 0x20000000,
		            0x13000: 0x21000080,
		            0x14000: 0x1000080,
		            0x15000: 0x21040000,
		            0x16000: 0x20040080,
		            0x17000: 0x1000000,
		            0x18000: 0x21040080,
		            0x19000: 0x21000000,
		            0x1a000: 0x1040000,
		            0x1b000: 0x20040000,
		            0x1c000: 0x40080,
		            0x1d000: 0x20000080,
		            0x1e000: 0x0,
		            0x1f000: 0x1040080,
		            0x10800: 0x21000080,
		            0x11800: 0x1000000,
		            0x12800: 0x1040000,
		            0x13800: 0x20040080,
		            0x14800: 0x20000000,
		            0x15800: 0x1040080,
		            0x16800: 0x80,
		            0x17800: 0x21040000,
		            0x18800: 0x40080,
		            0x19800: 0x21040080,
		            0x1a800: 0x0,
		            0x1b800: 0x21000000,
		            0x1c800: 0x1000080,
		            0x1d800: 0x40000,
		            0x1e800: 0x20040000,
		            0x1f800: 0x20000080
		        },
		        {
		            0x0: 0x10000008,
		            0x100: 0x2000,
		            0x200: 0x10200000,
		            0x300: 0x10202008,
		            0x400: 0x10002000,
		            0x500: 0x200000,
		            0x600: 0x200008,
		            0x700: 0x10000000,
		            0x800: 0x0,
		            0x900: 0x10002008,
		            0xa00: 0x202000,
		            0xb00: 0x8,
		            0xc00: 0x10200008,
		            0xd00: 0x202008,
		            0xe00: 0x2008,
		            0xf00: 0x10202000,
		            0x80: 0x10200000,
		            0x180: 0x10202008,
		            0x280: 0x8,
		            0x380: 0x200000,
		            0x480: 0x202008,
		            0x580: 0x10000008,
		            0x680: 0x10002000,
		            0x780: 0x2008,
		            0x880: 0x200008,
		            0x980: 0x2000,
		            0xa80: 0x10002008,
		            0xb80: 0x10200008,
		            0xc80: 0x0,
		            0xd80: 0x10202000,
		            0xe80: 0x202000,
		            0xf80: 0x10000000,
		            0x1000: 0x10002000,
		            0x1100: 0x10200008,
		            0x1200: 0x10202008,
		            0x1300: 0x2008,
		            0x1400: 0x200000,
		            0x1500: 0x10000000,
		            0x1600: 0x10000008,
		            0x1700: 0x202000,
		            0x1800: 0x202008,
		            0x1900: 0x0,
		            0x1a00: 0x8,
		            0x1b00: 0x10200000,
		            0x1c00: 0x2000,
		            0x1d00: 0x10002008,
		            0x1e00: 0x10202000,
		            0x1f00: 0x200008,
		            0x1080: 0x8,
		            0x1180: 0x202000,
		            0x1280: 0x200000,
		            0x1380: 0x10000008,
		            0x1480: 0x10002000,
		            0x1580: 0x2008,
		            0x1680: 0x10202008,
		            0x1780: 0x10200000,
		            0x1880: 0x10202000,
		            0x1980: 0x10200008,
		            0x1a80: 0x2000,
		            0x1b80: 0x202008,
		            0x1c80: 0x200008,
		            0x1d80: 0x0,
		            0x1e80: 0x10000000,
		            0x1f80: 0x10002008
		        },
		        {
		            0x0: 0x100000,
		            0x10: 0x2000401,
		            0x20: 0x400,
		            0x30: 0x100401,
		            0x40: 0x2100401,
		            0x50: 0x0,
		            0x60: 0x1,
		            0x70: 0x2100001,
		            0x80: 0x2000400,
		            0x90: 0x100001,
		            0xa0: 0x2000001,
		            0xb0: 0x2100400,
		            0xc0: 0x2100000,
		            0xd0: 0x401,
		            0xe0: 0x100400,
		            0xf0: 0x2000000,
		            0x8: 0x2100001,
		            0x18: 0x0,
		            0x28: 0x2000401,
		            0x38: 0x2100400,
		            0x48: 0x100000,
		            0x58: 0x2000001,
		            0x68: 0x2000000,
		            0x78: 0x401,
		            0x88: 0x100401,
		            0x98: 0x2000400,
		            0xa8: 0x2100000,
		            0xb8: 0x100001,
		            0xc8: 0x400,
		            0xd8: 0x2100401,
		            0xe8: 0x1,
		            0xf8: 0x100400,
		            0x100: 0x2000000,
		            0x110: 0x100000,
		            0x120: 0x2000401,
		            0x130: 0x2100001,
		            0x140: 0x100001,
		            0x150: 0x2000400,
		            0x160: 0x2100400,
		            0x170: 0x100401,
		            0x180: 0x401,
		            0x190: 0x2100401,
		            0x1a0: 0x100400,
		            0x1b0: 0x1,
		            0x1c0: 0x0,
		            0x1d0: 0x2100000,
		            0x1e0: 0x2000001,
		            0x1f0: 0x400,
		            0x108: 0x100400,
		            0x118: 0x2000401,
		            0x128: 0x2100001,
		            0x138: 0x1,
		            0x148: 0x2000000,
		            0x158: 0x100000,
		            0x168: 0x401,
		            0x178: 0x2100400,
		            0x188: 0x2000001,
		            0x198: 0x2100000,
		            0x1a8: 0x0,
		            0x1b8: 0x2100401,
		            0x1c8: 0x100401,
		            0x1d8: 0x400,
		            0x1e8: 0x2000400,
		            0x1f8: 0x100001
		        },
		        {
		            0x0: 0x8000820,
		            0x1: 0x20000,
		            0x2: 0x8000000,
		            0x3: 0x20,
		            0x4: 0x20020,
		            0x5: 0x8020820,
		            0x6: 0x8020800,
		            0x7: 0x800,
		            0x8: 0x8020000,
		            0x9: 0x8000800,
		            0xa: 0x20800,
		            0xb: 0x8020020,
		            0xc: 0x820,
		            0xd: 0x0,
		            0xe: 0x8000020,
		            0xf: 0x20820,
		            0x80000000: 0x800,
		            0x80000001: 0x8020820,
		            0x80000002: 0x8000820,
		            0x80000003: 0x8000000,
		            0x80000004: 0x8020000,
		            0x80000005: 0x20800,
		            0x80000006: 0x20820,
		            0x80000007: 0x20,
		            0x80000008: 0x8000020,
		            0x80000009: 0x820,
		            0x8000000a: 0x20020,
		            0x8000000b: 0x8020800,
		            0x8000000c: 0x0,
		            0x8000000d: 0x8020020,
		            0x8000000e: 0x8000800,
		            0x8000000f: 0x20000,
		            0x10: 0x20820,
		            0x11: 0x8020800,
		            0x12: 0x20,
		            0x13: 0x800,
		            0x14: 0x8000800,
		            0x15: 0x8000020,
		            0x16: 0x8020020,
		            0x17: 0x20000,
		            0x18: 0x0,
		            0x19: 0x20020,
		            0x1a: 0x8020000,
		            0x1b: 0x8000820,
		            0x1c: 0x8020820,
		            0x1d: 0x20800,
		            0x1e: 0x820,
		            0x1f: 0x8000000,
		            0x80000010: 0x20000,
		            0x80000011: 0x800,
		            0x80000012: 0x8020020,
		            0x80000013: 0x20820,
		            0x80000014: 0x20,
		            0x80000015: 0x8020000,
		            0x80000016: 0x8000000,
		            0x80000017: 0x8000820,
		            0x80000018: 0x8020820,
		            0x80000019: 0x8000020,
		            0x8000001a: 0x8000800,
		            0x8000001b: 0x0,
		            0x8000001c: 0x20800,
		            0x8000001d: 0x820,
		            0x8000001e: 0x20020,
		            0x8000001f: 0x8020800
		        }
		    ];
	
		    // Masks that select the SBOX input
		    var SBOX_MASK = [
		        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
		        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
		    ];
	
		    /**
		     * DES block cipher algorithm.
		     */
		    var DES = C_algo.DES = BlockCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var key = this._key;
		            var keyWords = key.words;
	
		            // Select 56 bits according to PC1
		            var keyBits = [];
		            for (var i = 0; i < 56; i++) {
		                var keyBitPos = PC1[i] - 1;
		                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
		            }
	
		            // Assemble 16 subkeys
		            var subKeys = this._subKeys = [];
		            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
		                // Create subkey
		                var subKey = subKeys[nSubKey] = [];
	
		                // Shortcut
		                var bitShift = BIT_SHIFTS[nSubKey];
	
		                // Select 48 bits according to PC2
		                for (var i = 0; i < 24; i++) {
		                    // Select from the left 28 key bits
		                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);
	
		                    // Select from the right 28 key bits
		                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
		                }
	
		                // Since each subkey is applied to an expanded 32-bit input,
		                // the subkey can be broken into 8 values scaled to 32-bits,
		                // which allows the key to be used without expansion
		                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
		                for (var i = 1; i < 7; i++) {
		                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
		                }
		                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
		            }
	
		            // Compute inverse subkeys
		            var invSubKeys = this._invSubKeys = [];
		            for (var i = 0; i < 16; i++) {
		                invSubKeys[i] = subKeys[15 - i];
		            }
		        },
	
		        encryptBlock: function (M, offset) {
		            this._doCryptBlock(M, offset, this._subKeys);
		        },
	
		        decryptBlock: function (M, offset) {
		            this._doCryptBlock(M, offset, this._invSubKeys);
		        },
	
		        _doCryptBlock: function (M, offset, subKeys) {
		            // Get input
		            this._lBlock = M[offset];
		            this._rBlock = M[offset + 1];
	
		            // Initial permutation
		            exchangeLR.call(this, 4,  0x0f0f0f0f);
		            exchangeLR.call(this, 16, 0x0000ffff);
		            exchangeRL.call(this, 2,  0x33333333);
		            exchangeRL.call(this, 8,  0x00ff00ff);
		            exchangeLR.call(this, 1,  0x55555555);
	
		            // Rounds
		            for (var round = 0; round < 16; round++) {
		                // Shortcuts
		                var subKey = subKeys[round];
		                var lBlock = this._lBlock;
		                var rBlock = this._rBlock;
	
		                // Feistel function
		                var f = 0;
		                for (var i = 0; i < 8; i++) {
		                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
		                }
		                this._lBlock = rBlock;
		                this._rBlock = lBlock ^ f;
		            }
	
		            // Undo swap from last round
		            var t = this._lBlock;
		            this._lBlock = this._rBlock;
		            this._rBlock = t;
	
		            // Final permutation
		            exchangeLR.call(this, 1,  0x55555555);
		            exchangeRL.call(this, 8,  0x00ff00ff);
		            exchangeRL.call(this, 2,  0x33333333);
		            exchangeLR.call(this, 16, 0x0000ffff);
		            exchangeLR.call(this, 4,  0x0f0f0f0f);
	
		            // Set output
		            M[offset] = this._lBlock;
		            M[offset + 1] = this._rBlock;
		        },
	
		        keySize: 64/32,
	
		        ivSize: 64/32,
	
		        blockSize: 64/32
		    });
	
		    // Swap bits across the left and right words
		    function exchangeLR(offset, mask) {
		        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
		        this._rBlock ^= t;
		        this._lBlock ^= t << offset;
		    }
	
		    function exchangeRL(offset, mask) {
		        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
		        this._lBlock ^= t;
		        this._rBlock ^= t << offset;
		    }
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
		     */
		    C.DES = BlockCipher._createHelper(DES);
	
		    /**
		     * Triple-DES block cipher algorithm.
		     */
		    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var key = this._key;
		            var keyWords = key.words;
	
		            // Create DES instances
		            this._des1 = DES.createEncryptor(WordArray.create(keyWords.slice(0, 2)));
		            this._des2 = DES.createEncryptor(WordArray.create(keyWords.slice(2, 4)));
		            this._des3 = DES.createEncryptor(WordArray.create(keyWords.slice(4, 6)));
		        },
	
		        encryptBlock: function (M, offset) {
		            this._des1.encryptBlock(M, offset);
		            this._des2.decryptBlock(M, offset);
		            this._des3.encryptBlock(M, offset);
		        },
	
		        decryptBlock: function (M, offset) {
		            this._des3.decryptBlock(M, offset);
		            this._des2.encryptBlock(M, offset);
		            this._des1.decryptBlock(M, offset);
		        },
	
		        keySize: 192/32,
	
		        ivSize: 64/32,
	
		        blockSize: 64/32
		    });
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
		     */
		    C.TripleDES = BlockCipher._createHelper(TripleDES);
		}());
	
	
		return CryptoJS.TripleDES;
	
	}));

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(210)();
	// imports
	
	
	// module
	exports.push([module.id, "/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\nhtml {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/**\n * Remove default margin.\n */\nbody {\n  margin: 0; }\n\n/* HTML5 display definitions\n   ========================================================================== */\n/**\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\n * and Firefox.\n * Correct `block` display not defined for `main` in IE 11.\n */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/**\n * 1. Correct `inline-block` display not defined in IE 8/9.\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */ }\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/**\n * Address `[hidden]` styling not present in IE 8/9/10.\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\n */\n[hidden],\ntemplate {\n  display: none; }\n\n/* Links\n   ========================================================================== */\n/**\n * Remove the gray background color from active links in IE 10.\n */\na {\n  background-color: transparent; }\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\na:active,\na:hover {\n  outline: 0; }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n */\nabbr[title] {\n  border-bottom: 1px dotted; }\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n */\nb,\nstrong {\n  font-weight: bold; }\n\n/**\n * Address styling not present in Safari and Chrome.\n */\ndfn {\n  font-style: italic; }\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari, and Chrome.\n */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/**\n * Address styling not present in IE 8/9.\n */\nmark {\n  background: #ff0;\n  color: #000; }\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove border when inside `a` element in IE 8/9/10.\n */\nimg {\n  border: 0; }\n\n/**\n * Correct overflow not hidden in IE 9/10/11.\n */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * Address margin not present in IE 8/9 and Safari.\n */\nfigure {\n  margin: 1em 40px; }\n\n/**\n * Address differences between Firefox and other browsers.\n */\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\n/**\n * Contain overflow in all browsers.\n */\npre {\n  overflow: auto; }\n\n/**\n * Address odd `em`-unit font size rendering in all browsers.\n */\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* Forms\n   ========================================================================== */\n/**\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\n * styling of `select`, unless a `border` property is set.\n */\n/**\n * 1. Correct color not being inherited.\n *    Known issue: affects color of disabled elements.\n * 2. Correct font properties not being inherited.\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */ }\n\n/**\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\n */\nbutton {\n  overflow: visible; }\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n * Correct `select` style inheritance in Firefox.\n */\nbutton,\nselect {\n  text-transform: none; }\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */ }\n\n/**\n * Re-set default cursor for disabled elements.\n */\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\ninput {\n  line-height: normal; }\n\n/**\n * It's recommended that you don't attempt to style these elements.\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\n *\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n * `font-size` values of the `input`, it causes the cursor style of the\n * decrement button to change from `default` to `text`.\n */\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\n *    (include `-moz` to future-proof).\n */\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  /* 2 */\n  box-sizing: content-box; }\n\n/**\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n * Safari (but not Chrome) clips the cancel button when the search input has\n * padding (and `textfield` appearance).\n */\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * Define consistent border, margin, and padding.\n */\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Remove default vertical scrollbar in IE 8/9/10/11.\n */\ntextarea {\n  overflow: auto; }\n\n/**\n * Don't inherit the `font-weight` (applied by a rule above).\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n */\noptgroup {\n  font-weight: bold; }\n\n/* Tables\n   ========================================================================== */\n/**\n * Remove most spacing between table cells.\n */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n/*!\nAnimate.css - http://daneden.me/animate\nVersion - 3.4.0\nLicensed under the MIT license - http://opensource.org/licenses/MIT\n\nCopyright (c) 2015 Daniel Eden\n*/\n.animated {\n  -webkit-animation-duration: 4s;\n  animation-duration: 4s;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both; }\n\n.animated.infinite {\n  -webkit-animation-iteration-count: infinite;\n  animation-iteration-count: infinite; }\n\n.animated.hinge {\n  -webkit-animation-duration: 2s;\n  animation-duration: 2s; }\n\n.animated.bounceIn,\n.animated.bounceOut {\n  -webkit-animation-duration: .75s;\n  animation-duration: .75s; }\n\n.animated.flipOutX,\n.animated.flipOutY {\n  -webkit-animation-duration: .75s;\n  animation-duration: .75s; }\n\n@-webkit-keyframes bounce {\n  from, 20%, 53%, 80%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  40%, 43% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    -webkit-transform: translate3d(0, -30px, 0);\n    transform: translate3d(0, -30px, 0); }\n  70% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    -webkit-transform: translate3d(0, -15px, 0);\n    transform: translate3d(0, -15px, 0); }\n  90% {\n    -webkit-transform: translate3d(0, -4px, 0);\n    transform: translate3d(0, -4px, 0); } }\n\n@keyframes bounce {\n  from, 20%, 53%, 80%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  40%, 43% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    -webkit-transform: translate3d(0, -30px, 0);\n    transform: translate3d(0, -30px, 0); }\n  70% {\n    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n    -webkit-transform: translate3d(0, -15px, 0);\n    transform: translate3d(0, -15px, 0); }\n  90% {\n    -webkit-transform: translate3d(0, -4px, 0);\n    transform: translate3d(0, -4px, 0); } }\n\n.bounce {\n  -webkit-animation-name: bounce;\n  animation-name: bounce;\n  -webkit-transform-origin: center bottom;\n  transform-origin: center bottom; }\n\n@-webkit-keyframes flash {\n  from, 50%, to {\n    opacity: 1; }\n  25%, 75% {\n    opacity: 0; } }\n\n@keyframes flash {\n  from, 50%, to {\n    opacity: 1; }\n  25%, 75% {\n    opacity: 0; } }\n\n.flash {\n  -webkit-animation-name: flash;\n  animation-name: flash; }\n\n/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */\n@-webkit-keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); }\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n    transform: scale3d(1.05, 1.05, 1.05); }\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes pulse {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); }\n  50% {\n    -webkit-transform: scale3d(1.05, 1.05, 1.05);\n    transform: scale3d(1.05, 1.05, 1.05); }\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); } }\n\n.pulse {\n  -webkit-animation-name: pulse;\n  animation-name: pulse; }\n\n@-webkit-keyframes rubberBand {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); }\n  30% {\n    -webkit-transform: scale3d(1.25, 0.75, 1);\n    transform: scale3d(1.25, 0.75, 1); }\n  40% {\n    -webkit-transform: scale3d(0.75, 1.25, 1);\n    transform: scale3d(0.75, 1.25, 1); }\n  50% {\n    -webkit-transform: scale3d(1.15, 0.85, 1);\n    transform: scale3d(1.15, 0.85, 1); }\n  65% {\n    -webkit-transform: scale3d(0.95, 1.05, 1);\n    transform: scale3d(0.95, 1.05, 1); }\n  75% {\n    -webkit-transform: scale3d(1.05, 0.95, 1);\n    transform: scale3d(1.05, 0.95, 1); }\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes rubberBand {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); }\n  30% {\n    -webkit-transform: scale3d(1.25, 0.75, 1);\n    transform: scale3d(1.25, 0.75, 1); }\n  40% {\n    -webkit-transform: scale3d(0.75, 1.25, 1);\n    transform: scale3d(0.75, 1.25, 1); }\n  50% {\n    -webkit-transform: scale3d(1.15, 0.85, 1);\n    transform: scale3d(1.15, 0.85, 1); }\n  65% {\n    -webkit-transform: scale3d(0.95, 1.05, 1);\n    transform: scale3d(0.95, 1.05, 1); }\n  75% {\n    -webkit-transform: scale3d(1.05, 0.95, 1);\n    transform: scale3d(1.05, 0.95, 1); }\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); } }\n\n.rubberBand {\n  -webkit-animation-name: rubberBand;\n  animation-name: rubberBand; }\n\n@-webkit-keyframes shake {\n  from, to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  10%, 30%, 50%, 70%, 90% {\n    -webkit-transform: translate3d(-10px, 0, 0);\n    transform: translate3d(-10px, 0, 0); }\n  20%, 40%, 60%, 80% {\n    -webkit-transform: translate3d(10px, 0, 0);\n    transform: translate3d(10px, 0, 0); } }\n\n@keyframes shake {\n  from, to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  10%, 30%, 50%, 70%, 90% {\n    -webkit-transform: translate3d(-10px, 0, 0);\n    transform: translate3d(-10px, 0, 0); }\n  20%, 40%, 60%, 80% {\n    -webkit-transform: translate3d(10px, 0, 0);\n    transform: translate3d(10px, 0, 0); } }\n\n.shake {\n  -webkit-animation-name: shake;\n  animation-name: shake; }\n\n@-webkit-keyframes swing {\n  20% {\n    -webkit-transform: rotate3d(0, 0, 1, 15deg);\n    transform: rotate3d(0, 0, 1, 15deg); }\n  40% {\n    -webkit-transform: rotate3d(0, 0, 1, -10deg);\n    transform: rotate3d(0, 0, 1, -10deg); }\n  60% {\n    -webkit-transform: rotate3d(0, 0, 1, 5deg);\n    transform: rotate3d(0, 0, 1, 5deg); }\n  80% {\n    -webkit-transform: rotate3d(0, 0, 1, -5deg);\n    transform: rotate3d(0, 0, 1, -5deg); }\n  to {\n    -webkit-transform: rotate3d(0, 0, 1, 0deg);\n    transform: rotate3d(0, 0, 1, 0deg); } }\n\n@keyframes swing {\n  20% {\n    -webkit-transform: rotate3d(0, 0, 1, 15deg);\n    transform: rotate3d(0, 0, 1, 15deg); }\n  40% {\n    -webkit-transform: rotate3d(0, 0, 1, -10deg);\n    transform: rotate3d(0, 0, 1, -10deg); }\n  60% {\n    -webkit-transform: rotate3d(0, 0, 1, 5deg);\n    transform: rotate3d(0, 0, 1, 5deg); }\n  80% {\n    -webkit-transform: rotate3d(0, 0, 1, -5deg);\n    transform: rotate3d(0, 0, 1, -5deg); }\n  to {\n    -webkit-transform: rotate3d(0, 0, 1, 0deg);\n    transform: rotate3d(0, 0, 1, 0deg); } }\n\n.swing {\n  -webkit-transform-origin: top center;\n  transform-origin: top center;\n  -webkit-animation-name: swing;\n  animation-name: swing; }\n\n@-webkit-keyframes tada {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); }\n  10%, 20% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);\n    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg); }\n  30%, 50%, 70%, 90% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg); }\n  40%, 60%, 80% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg); }\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes tada {\n  from {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); }\n  10%, 20% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);\n    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg); }\n  30%, 50%, 70%, 90% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg); }\n  40%, 60%, 80% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);\n    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg); }\n  to {\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); } }\n\n.tada {\n  -webkit-animation-name: tada;\n  animation-name: tada; }\n\n/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */\n@-webkit-keyframes wobble {\n  from {\n    -webkit-transform: none;\n    transform: none; }\n  15% {\n    -webkit-transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);\n    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg); }\n  30% {\n    -webkit-transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);\n    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg); }\n  45% {\n    -webkit-transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);\n    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg); }\n  60% {\n    -webkit-transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);\n    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg); }\n  75% {\n    -webkit-transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);\n    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg); }\n  to {\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes wobble {\n  from {\n    -webkit-transform: none;\n    transform: none; }\n  15% {\n    -webkit-transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);\n    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg); }\n  30% {\n    -webkit-transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);\n    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg); }\n  45% {\n    -webkit-transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);\n    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg); }\n  60% {\n    -webkit-transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);\n    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg); }\n  75% {\n    -webkit-transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);\n    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg); }\n  to {\n    -webkit-transform: none;\n    transform: none; } }\n\n.wobble {\n  -webkit-animation-name: wobble;\n  animation-name: wobble; }\n\n@-webkit-keyframes jello {\n  from, 11.1%, to {\n    -webkit-transform: none;\n    transform: none; }\n  22.2% {\n    -webkit-transform: skewX(-12.5deg) skewY(-12.5deg);\n    transform: skewX(-12.5deg) skewY(-12.5deg); }\n  33.3% {\n    -webkit-transform: skewX(6.25deg) skewY(6.25deg);\n    transform: skewX(6.25deg) skewY(6.25deg); }\n  44.4% {\n    -webkit-transform: skewX(-3.125deg) skewY(-3.125deg);\n    transform: skewX(-3.125deg) skewY(-3.125deg); }\n  55.5% {\n    -webkit-transform: skewX(1.5625deg) skewY(1.5625deg);\n    transform: skewX(1.5625deg) skewY(1.5625deg); }\n  66.6% {\n    -webkit-transform: skewX(-0.78125deg) skewY(-0.78125deg);\n    transform: skewX(-0.78125deg) skewY(-0.78125deg); }\n  77.7% {\n    -webkit-transform: skewX(0.39062deg) skewY(0.39062deg);\n    transform: skewX(0.39062deg) skewY(0.39062deg); }\n  88.8% {\n    -webkit-transform: skewX(-0.19531deg) skewY(-0.19531deg);\n    transform: skewX(-0.19531deg) skewY(-0.19531deg); } }\n\n@keyframes jello {\n  from, 11.1%, to {\n    -webkit-transform: none;\n    transform: none; }\n  22.2% {\n    -webkit-transform: skewX(-12.5deg) skewY(-12.5deg);\n    transform: skewX(-12.5deg) skewY(-12.5deg); }\n  33.3% {\n    -webkit-transform: skewX(6.25deg) skewY(6.25deg);\n    transform: skewX(6.25deg) skewY(6.25deg); }\n  44.4% {\n    -webkit-transform: skewX(-3.125deg) skewY(-3.125deg);\n    transform: skewX(-3.125deg) skewY(-3.125deg); }\n  55.5% {\n    -webkit-transform: skewX(1.5625deg) skewY(1.5625deg);\n    transform: skewX(1.5625deg) skewY(1.5625deg); }\n  66.6% {\n    -webkit-transform: skewX(-0.78125deg) skewY(-0.78125deg);\n    transform: skewX(-0.78125deg) skewY(-0.78125deg); }\n  77.7% {\n    -webkit-transform: skewX(0.39062deg) skewY(0.39062deg);\n    transform: skewX(0.39062deg) skewY(0.39062deg); }\n  88.8% {\n    -webkit-transform: skewX(-0.19531deg) skewY(-0.19531deg);\n    transform: skewX(-0.19531deg) skewY(-0.19531deg); } }\n\n.jello {\n  -webkit-animation-name: jello;\n  animation-name: jello;\n  -webkit-transform-origin: center;\n  transform-origin: center; }\n\n@-webkit-keyframes bounceIn {\n  from, 20%, 40%, 60%, 80%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3); }\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1); }\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n    transform: scale3d(0.9, 0.9, 0.9); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n    transform: scale3d(1.03, 1.03, 1.03); }\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n    transform: scale3d(0.97, 0.97, 0.97); }\n  to {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); } }\n\n@keyframes bounceIn {\n  from, 20%, 40%, 60%, 80%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3); }\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1); }\n  40% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n    transform: scale3d(0.9, 0.9, 0.9); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n    transform: scale3d(1.03, 1.03, 1.03); }\n  80% {\n    -webkit-transform: scale3d(0.97, 0.97, 0.97);\n    transform: scale3d(0.97, 0.97, 0.97); }\n  to {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1); } }\n\n.bounceIn {\n  -webkit-animation-name: bounceIn;\n  animation-name: bounceIn; }\n\n@-webkit-keyframes bounceInDown {\n  from, 60%, 75%, 90%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n    transform: translate3d(0, -3000px, 0); }\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n    transform: translate3d(0, 25px, 0); }\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0); }\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n    transform: translate3d(0, 5px, 0); }\n  to {\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes bounceInDown {\n  from, 60%, 75%, 90%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n    transform: translate3d(0, -3000px, 0); }\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n    transform: translate3d(0, 25px, 0); }\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0); }\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n    transform: translate3d(0, 5px, 0); }\n  to {\n    -webkit-transform: none;\n    transform: none; } }\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n  animation-name: bounceInDown; }\n\n@-webkit-keyframes bounceInLeft {\n  from, 60%, 75%, 90%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(-3000px, 0, 0);\n    transform: translate3d(-3000px, 0, 0); }\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(25px, 0, 0);\n    transform: translate3d(25px, 0, 0); }\n  75% {\n    -webkit-transform: translate3d(-10px, 0, 0);\n    transform: translate3d(-10px, 0, 0); }\n  90% {\n    -webkit-transform: translate3d(5px, 0, 0);\n    transform: translate3d(5px, 0, 0); }\n  to {\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes bounceInLeft {\n  from, 60%, 75%, 90%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(-3000px, 0, 0);\n    transform: translate3d(-3000px, 0, 0); }\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(25px, 0, 0);\n    transform: translate3d(25px, 0, 0); }\n  75% {\n    -webkit-transform: translate3d(-10px, 0, 0);\n    transform: translate3d(-10px, 0, 0); }\n  90% {\n    -webkit-transform: translate3d(5px, 0, 0);\n    transform: translate3d(5px, 0, 0); }\n  to {\n    -webkit-transform: none;\n    transform: none; } }\n\n.bounceInLeft {\n  -webkit-animation-name: bounceInLeft;\n  animation-name: bounceInLeft; }\n\n@-webkit-keyframes bounceInRight {\n  from, 60%, 75%, 90%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(3000px, 0, 0);\n    transform: translate3d(3000px, 0, 0); }\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(-25px, 0, 0);\n    transform: translate3d(-25px, 0, 0); }\n  75% {\n    -webkit-transform: translate3d(10px, 0, 0);\n    transform: translate3d(10px, 0, 0); }\n  90% {\n    -webkit-transform: translate3d(-5px, 0, 0);\n    transform: translate3d(-5px, 0, 0); }\n  to {\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes bounceInRight {\n  from, 60%, 75%, 90%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(3000px, 0, 0);\n    transform: translate3d(3000px, 0, 0); }\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(-25px, 0, 0);\n    transform: translate3d(-25px, 0, 0); }\n  75% {\n    -webkit-transform: translate3d(10px, 0, 0);\n    transform: translate3d(10px, 0, 0); }\n  90% {\n    -webkit-transform: translate3d(-5px, 0, 0);\n    transform: translate3d(-5px, 0, 0); }\n  to {\n    -webkit-transform: none;\n    transform: none; } }\n\n.bounceInRight {\n  -webkit-animation-name: bounceInRight;\n  animation-name: bounceInRight; }\n\n@-webkit-keyframes bounceInUp {\n  from, 60%, 75%, 90%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 3000px, 0);\n    transform: translate3d(0, 3000px, 0); }\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, -20px, 0);\n    transform: translate3d(0, -20px, 0); }\n  75% {\n    -webkit-transform: translate3d(0, 10px, 0);\n    transform: translate3d(0, 10px, 0); }\n  90% {\n    -webkit-transform: translate3d(0, -5px, 0);\n    transform: translate3d(0, -5px, 0); }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes bounceInUp {\n  from, 60%, 75%, 90%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 3000px, 0);\n    transform: translate3d(0, 3000px, 0); }\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, -20px, 0);\n    transform: translate3d(0, -20px, 0); }\n  75% {\n    -webkit-transform: translate3d(0, 10px, 0);\n    transform: translate3d(0, 10px, 0); }\n  90% {\n    -webkit-transform: translate3d(0, -5px, 0);\n    transform: translate3d(0, -5px, 0); }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n.bounceInUp {\n  -webkit-animation-name: bounceInUp;\n  animation-name: bounceInUp; }\n\n@-webkit-keyframes bounceOut {\n  20% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n    transform: scale3d(0.9, 0.9, 0.9); }\n  50%, 55% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3); } }\n\n@keyframes bounceOut {\n  20% {\n    -webkit-transform: scale3d(0.9, 0.9, 0.9);\n    transform: scale3d(0.9, 0.9, 0.9); }\n  50%, 55% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3); } }\n\n.bounceOut {\n  -webkit-animation-name: bounceOut;\n  animation-name: bounceOut; }\n\n@-webkit-keyframes bounceOutDown {\n  20% {\n    -webkit-transform: translate3d(0, 10px, 0);\n    transform: translate3d(0, 10px, 0); }\n  40%, 45% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, -20px, 0);\n    transform: translate3d(0, -20px, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0); } }\n\n@keyframes bounceOutDown {\n  20% {\n    -webkit-transform: translate3d(0, 10px, 0);\n    transform: translate3d(0, 10px, 0); }\n  40%, 45% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, -20px, 0);\n    transform: translate3d(0, -20px, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0); } }\n\n.bounceOutDown {\n  -webkit-animation-name: bounceOutDown;\n  animation-name: bounceOutDown; }\n\n@-webkit-keyframes bounceOutLeft {\n  20% {\n    opacity: 1;\n    -webkit-transform: translate3d(20px, 0, 0);\n    transform: translate3d(20px, 0, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0); } }\n\n@keyframes bounceOutLeft {\n  20% {\n    opacity: 1;\n    -webkit-transform: translate3d(20px, 0, 0);\n    transform: translate3d(20px, 0, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0); } }\n\n.bounceOutLeft {\n  -webkit-animation-name: bounceOutLeft;\n  animation-name: bounceOutLeft; }\n\n@-webkit-keyframes bounceOutRight {\n  20% {\n    opacity: 1;\n    -webkit-transform: translate3d(-20px, 0, 0);\n    transform: translate3d(-20px, 0, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0); } }\n\n@keyframes bounceOutRight {\n  20% {\n    opacity: 1;\n    -webkit-transform: translate3d(-20px, 0, 0);\n    transform: translate3d(-20px, 0, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0); } }\n\n.bounceOutRight {\n  -webkit-animation-name: bounceOutRight;\n  animation-name: bounceOutRight; }\n\n@-webkit-keyframes bounceOutUp {\n  20% {\n    -webkit-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0); }\n  40%, 45% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 20px, 0);\n    transform: translate3d(0, 20px, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0); } }\n\n@keyframes bounceOutUp {\n  20% {\n    -webkit-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0); }\n  40%, 45% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 20px, 0);\n    transform: translate3d(0, 20px, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0); } }\n\n.bounceOutUp {\n  -webkit-animation-name: bounceOutUp;\n  animation-name: bounceOutUp; }\n\n@-webkit-keyframes fadeIn {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n@keyframes fadeIn {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n.fadeIn {\n  -webkit-animation-name: fadeIn;\n  animation-name: fadeIn; }\n\n@-webkit-keyframes fadeInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.fadeInDown {\n  -webkit-animation-name: fadeInDown;\n  animation-name: fadeInDown; }\n\n@-webkit-keyframes fadeInDownBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInDownBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.fadeInDownBig {\n  -webkit-animation-name: fadeInDownBig;\n  animation-name: fadeInDownBig; }\n\n@-webkit-keyframes fadeInLeft {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInLeft {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.fadeInLeft {\n  -webkit-animation-name: fadeInLeft;\n  animation-name: fadeInLeft; }\n\n@-webkit-keyframes fadeInLeftBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInLeftBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.fadeInLeftBig {\n  -webkit-animation-name: fadeInLeftBig;\n  animation-name: fadeInLeftBig; }\n\n@-webkit-keyframes fadeInRight {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInRight {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.fadeInRight {\n  -webkit-animation-name: fadeInRight;\n  animation-name: fadeInRight; }\n\n@-webkit-keyframes fadeInRightBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInRightBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.fadeInRightBig {\n  -webkit-animation-name: fadeInRightBig;\n  animation-name: fadeInRightBig; }\n\n@-webkit-keyframes fadeInUp {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.fadeInUp {\n  -webkit-animation-name: fadeInUp;\n  animation-name: fadeInUp; }\n\n@-webkit-keyframes fadeInUpBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInUpBig {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.fadeInUpBig {\n  -webkit-animation-name: fadeInUpBig;\n  animation-name: fadeInUpBig; }\n\n@-webkit-keyframes fadeOut {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0; } }\n\n@keyframes fadeOut {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0; } }\n\n.fadeOut {\n  -webkit-animation-name: fadeOut;\n  animation-name: fadeOut; }\n\n@-webkit-keyframes fadeOutDown {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0); } }\n\n@keyframes fadeOutDown {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0); } }\n\n.fadeOutDown {\n  -webkit-animation-name: fadeOutDown;\n  animation-name: fadeOutDown; }\n\n@-webkit-keyframes fadeOutDownBig {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0); } }\n\n@keyframes fadeOutDownBig {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 2000px, 0);\n    transform: translate3d(0, 2000px, 0); } }\n\n.fadeOutDownBig {\n  -webkit-animation-name: fadeOutDownBig;\n  animation-name: fadeOutDownBig; }\n\n@-webkit-keyframes fadeOutLeft {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0); } }\n\n@keyframes fadeOutLeft {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0); } }\n\n.fadeOutLeft {\n  -webkit-animation-name: fadeOutLeft;\n  animation-name: fadeOutLeft; }\n\n@-webkit-keyframes fadeOutLeftBig {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0); } }\n\n@keyframes fadeOutLeftBig {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(-2000px, 0, 0);\n    transform: translate3d(-2000px, 0, 0); } }\n\n.fadeOutLeftBig {\n  -webkit-animation-name: fadeOutLeftBig;\n  animation-name: fadeOutLeftBig; }\n\n@-webkit-keyframes fadeOutRight {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); } }\n\n@keyframes fadeOutRight {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); } }\n\n.fadeOutRight {\n  -webkit-animation-name: fadeOutRight;\n  animation-name: fadeOutRight; }\n\n@-webkit-keyframes fadeOutRightBig {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0); } }\n\n@keyframes fadeOutRightBig {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(2000px, 0, 0);\n    transform: translate3d(2000px, 0, 0); } }\n\n.fadeOutRightBig {\n  -webkit-animation-name: fadeOutRightBig;\n  animation-name: fadeOutRightBig; }\n\n@-webkit-keyframes fadeOutUp {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0); } }\n\n@keyframes fadeOutUp {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0); } }\n\n.fadeOutUp {\n  -webkit-animation-name: fadeOutUp;\n  animation-name: fadeOutUp; }\n\n@-webkit-keyframes fadeOutUpBig {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0); } }\n\n@keyframes fadeOutUpBig {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -2000px, 0);\n    transform: translate3d(0, -2000px, 0); } }\n\n.fadeOutUpBig {\n  -webkit-animation-name: fadeOutUpBig;\n  animation-name: fadeOutUpBig; }\n\n@-webkit-keyframes flip {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out; }\n  40% {\n    -webkit-transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n    transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out; }\n  50% {\n    -webkit-transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n    transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; }\n  80% {\n    -webkit-transform: perspective(400px) scale3d(0.95, 0.95, 0.95);\n    transform: perspective(400px) scale3d(0.95, 0.95, 0.95);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; }\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; } }\n\n@keyframes flip {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -360deg);\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out; }\n  40% {\n    -webkit-transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n    transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);\n    -webkit-animation-timing-function: ease-out;\n    animation-timing-function: ease-out; }\n  50% {\n    -webkit-transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n    transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; }\n  80% {\n    -webkit-transform: perspective(400px) scale3d(0.95, 0.95, 0.95);\n    transform: perspective(400px) scale3d(0.95, 0.95, 0.95);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; }\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; } }\n\n.animated.flip {\n  -webkit-backface-visibility: visible;\n  backface-visibility: visible;\n  -webkit-animation-name: flip;\n  animation-name: flip; }\n\n@-webkit-keyframes flipInX {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    opacity: 0; }\n  40% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; }\n  60% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    opacity: 1; }\n  80% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -5deg); }\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px); } }\n\n@keyframes flipInX {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    opacity: 0; }\n  40% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; }\n  60% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    opacity: 1; }\n  80% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -5deg); }\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px); } }\n\n.flipInX {\n  -webkit-backface-visibility: visible !important;\n  backface-visibility: visible !important;\n  -webkit-animation-name: flipInX;\n  animation-name: flipInX; }\n\n@-webkit-keyframes flipInY {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    opacity: 0; }\n  40% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; }\n  60% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);\n    opacity: 1; }\n  80% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -5deg); }\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px); } }\n\n@keyframes flipInY {\n  from {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in;\n    opacity: 0; }\n  40% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);\n    -webkit-animation-timing-function: ease-in;\n    animation-timing-function: ease-in; }\n  60% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);\n    opacity: 1; }\n  80% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -5deg); }\n  to {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px); } }\n\n.flipInY {\n  -webkit-backface-visibility: visible !important;\n  backface-visibility: visible !important;\n  -webkit-animation-name: flipInY;\n  animation-name: flipInY; }\n\n@-webkit-keyframes flipOutX {\n  from {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px); }\n  30% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    opacity: 0; } }\n\n@keyframes flipOutX {\n  from {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px); }\n  30% {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    opacity: 0; } }\n\n.flipOutX {\n  -webkit-animation-name: flipOutX;\n  animation-name: flipOutX;\n  -webkit-backface-visibility: visible !important;\n  backface-visibility: visible !important; }\n\n@-webkit-keyframes flipOutY {\n  from {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px); }\n  30% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -15deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -15deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    opacity: 0; } }\n\n@keyframes flipOutY {\n  from {\n    -webkit-transform: perspective(400px);\n    transform: perspective(400px); }\n  30% {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -15deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, -15deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);\n    opacity: 0; } }\n\n.flipOutY {\n  -webkit-backface-visibility: visible !important;\n  backface-visibility: visible !important;\n  -webkit-animation-name: flipOutY;\n  animation-name: flipOutY; }\n\n@-webkit-keyframes lightSpeedIn {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0) skewX(-30deg);\n    transform: translate3d(100%, 0, 0) skewX(-30deg);\n    opacity: 0; }\n  60% {\n    -webkit-transform: skewX(20deg);\n    transform: skewX(20deg);\n    opacity: 1; }\n  80% {\n    -webkit-transform: skewX(-5deg);\n    transform: skewX(-5deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n@keyframes lightSpeedIn {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0) skewX(-30deg);\n    transform: translate3d(100%, 0, 0) skewX(-30deg);\n    opacity: 0; }\n  60% {\n    -webkit-transform: skewX(20deg);\n    transform: skewX(20deg);\n    opacity: 1; }\n  80% {\n    -webkit-transform: skewX(-5deg);\n    transform: skewX(-5deg);\n    opacity: 1; }\n  to {\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n.lightSpeedIn {\n  -webkit-animation-name: lightSpeedIn;\n  animation-name: lightSpeedIn;\n  -webkit-animation-timing-function: ease-out;\n  animation-timing-function: ease-out; }\n\n@-webkit-keyframes lightSpeedOut {\n  from {\n    opacity: 1; }\n  to {\n    -webkit-transform: translate3d(100%, 0, 0) skewX(30deg);\n    transform: translate3d(100%, 0, 0) skewX(30deg);\n    opacity: 0; } }\n\n@keyframes lightSpeedOut {\n  from {\n    opacity: 1; }\n  to {\n    -webkit-transform: translate3d(100%, 0, 0) skewX(30deg);\n    transform: translate3d(100%, 0, 0) skewX(30deg);\n    opacity: 0; } }\n\n.lightSpeedOut {\n  -webkit-animation-name: lightSpeedOut;\n  animation-name: lightSpeedOut;\n  -webkit-animation-timing-function: ease-in;\n  animation-timing-function: ease-in; }\n\n@-webkit-keyframes rotateIn {\n  from {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: rotate3d(0, 0, 1, -200deg);\n    transform: rotate3d(0, 0, 1, -200deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n@keyframes rotateIn {\n  from {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: rotate3d(0, 0, 1, -200deg);\n    transform: rotate3d(0, 0, 1, -200deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n.rotateIn {\n  -webkit-animation-name: rotateIn;\n  animation-name: rotateIn; }\n\n@-webkit-keyframes rotateInDownLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n@keyframes rotateInDownLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n.rotateInDownLeft {\n  -webkit-animation-name: rotateInDownLeft;\n  animation-name: rotateInDownLeft; }\n\n@-webkit-keyframes rotateInDownRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n@keyframes rotateInDownRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n.rotateInDownRight {\n  -webkit-animation-name: rotateInDownRight;\n  animation-name: rotateInDownRight; }\n\n@-webkit-keyframes rotateInUpLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n@keyframes rotateInUpLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n.rotateInUpLeft {\n  -webkit-animation-name: rotateInUpLeft;\n  animation-name: rotateInUpLeft; }\n\n@-webkit-keyframes rotateInUpRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -90deg);\n    transform: rotate3d(0, 0, 1, -90deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n@keyframes rotateInUpRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -90deg);\n    transform: rotate3d(0, 0, 1, -90deg);\n    opacity: 0; }\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: none;\n    transform: none;\n    opacity: 1; } }\n\n.rotateInUpRight {\n  -webkit-animation-name: rotateInUpRight;\n  animation-name: rotateInUpRight; }\n\n@-webkit-keyframes rotateOut {\n  from {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: rotate3d(0, 0, 1, 200deg);\n    transform: rotate3d(0, 0, 1, 200deg);\n    opacity: 0; } }\n\n@keyframes rotateOut {\n  from {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: center;\n    transform-origin: center;\n    -webkit-transform: rotate3d(0, 0, 1, 200deg);\n    transform: rotate3d(0, 0, 1, 200deg);\n    opacity: 0; } }\n\n.rotateOut {\n  -webkit-animation-name: rotateOut;\n  animation-name: rotateOut; }\n\n@-webkit-keyframes rotateOutDownLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0; } }\n\n@keyframes rotateOutDownLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 45deg);\n    transform: rotate3d(0, 0, 1, 45deg);\n    opacity: 0; } }\n\n.rotateOutDownLeft {\n  -webkit-animation-name: rotateOutDownLeft;\n  animation-name: rotateOutDownLeft; }\n\n@-webkit-keyframes rotateOutDownRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0; } }\n\n@keyframes rotateOutDownRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0; } }\n\n.rotateOutDownRight {\n  -webkit-animation-name: rotateOutDownRight;\n  animation-name: rotateOutDownRight; }\n\n@-webkit-keyframes rotateOutUpLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0; } }\n\n@keyframes rotateOutUpLeft {\n  from {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: left bottom;\n    transform-origin: left bottom;\n    -webkit-transform: rotate3d(0, 0, 1, -45deg);\n    transform: rotate3d(0, 0, 1, -45deg);\n    opacity: 0; } }\n\n.rotateOutUpLeft {\n  -webkit-animation-name: rotateOutUpLeft;\n  animation-name: rotateOutUpLeft; }\n\n@-webkit-keyframes rotateOutUpRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 90deg);\n    transform: rotate3d(0, 0, 1, 90deg);\n    opacity: 0; } }\n\n@keyframes rotateOutUpRight {\n  from {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    opacity: 1; }\n  to {\n    -webkit-transform-origin: right bottom;\n    transform-origin: right bottom;\n    -webkit-transform: rotate3d(0, 0, 1, 90deg);\n    transform: rotate3d(0, 0, 1, 90deg);\n    opacity: 0; } }\n\n.rotateOutUpRight {\n  -webkit-animation-name: rotateOutUpRight;\n  animation-name: rotateOutUpRight; }\n\n@-webkit-keyframes hinge {\n  0% {\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out; }\n  20%, 60% {\n    -webkit-transform: rotate3d(0, 0, 1, 80deg);\n    transform: rotate3d(0, 0, 1, 80deg);\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out; }\n  40%, 80% {\n    -webkit-transform: rotate3d(0, 0, 1, 60deg);\n    transform: rotate3d(0, 0, 1, 60deg);\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out;\n    opacity: 1; }\n  to {\n    -webkit-transform: translate3d(0, 700px, 0);\n    transform: translate3d(0, 700px, 0);\n    opacity: 0; } }\n\n@keyframes hinge {\n  0% {\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out; }\n  20%, 60% {\n    -webkit-transform: rotate3d(0, 0, 1, 80deg);\n    transform: rotate3d(0, 0, 1, 80deg);\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out; }\n  40%, 80% {\n    -webkit-transform: rotate3d(0, 0, 1, 60deg);\n    transform: rotate3d(0, 0, 1, 60deg);\n    -webkit-transform-origin: top left;\n    transform-origin: top left;\n    -webkit-animation-timing-function: ease-in-out;\n    animation-timing-function: ease-in-out;\n    opacity: 1; }\n  to {\n    -webkit-transform: translate3d(0, 700px, 0);\n    transform: translate3d(0, 700px, 0);\n    opacity: 0; } }\n\n.hinge {\n  -webkit-animation-name: hinge;\n  animation-name: hinge; }\n\n/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */\n@-webkit-keyframes rollIn {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);\n    transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes rollIn {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);\n    transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg); }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n.rollIn {\n  -webkit-animation-name: rollIn;\n  animation-name: rollIn; }\n\n/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */\n@-webkit-keyframes rollOut {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);\n    transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg); } }\n\n@keyframes rollOut {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);\n    transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg); } }\n\n.rollOut {\n  -webkit-animation-name: rollOut;\n  animation-name: rollOut; }\n\n@-webkit-keyframes zoomIn {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3); }\n  50% {\n    opacity: 1; } }\n\n@keyframes zoomIn {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3); }\n  50% {\n    opacity: 1; } }\n\n.zoomIn {\n  -webkit-animation-name: zoomIn;\n  animation-name: zoomIn; }\n\n@-webkit-keyframes zoomInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n@keyframes zoomInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n.zoomInDown {\n  -webkit-animation-name: zoomInDown;\n  animation-name: zoomInDown; }\n\n@-webkit-keyframes zoomInLeft {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n@keyframes zoomInLeft {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n.zoomInLeft {\n  -webkit-animation-name: zoomInLeft;\n  animation-name: zoomInLeft; }\n\n@-webkit-keyframes zoomInRight {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n@keyframes zoomInRight {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n.zoomInRight {\n  -webkit-animation-name: zoomInRight;\n  animation-name: zoomInRight; }\n\n@-webkit-keyframes zoomInUp {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n@keyframes zoomInUp {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n.zoomInUp {\n  -webkit-animation-name: zoomInUp;\n  animation-name: zoomInUp; }\n\n@-webkit-keyframes zoomOut {\n  from {\n    opacity: 1; }\n  50% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3); }\n  to {\n    opacity: 0; } }\n\n@keyframes zoomOut {\n  from {\n    opacity: 1; }\n  50% {\n    opacity: 0;\n    -webkit-transform: scale3d(0.3, 0.3, 0.3);\n    transform: scale3d(0.3, 0.3, 0.3); }\n  to {\n    opacity: 0; } }\n\n.zoomOut {\n  -webkit-animation-name: zoomOut;\n  animation-name: zoomOut; }\n\n@-webkit-keyframes zoomOutDown {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n@keyframes zoomOutDown {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n.zoomOutDown {\n  -webkit-animation-name: zoomOutDown;\n  animation-name: zoomOutDown; }\n\n@-webkit-keyframes zoomOutLeft {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale(0.1) translate3d(-2000px, 0, 0);\n    transform: scale(0.1) translate3d(-2000px, 0, 0);\n    -webkit-transform-origin: left center;\n    transform-origin: left center; } }\n\n@keyframes zoomOutLeft {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale(0.1) translate3d(-2000px, 0, 0);\n    transform: scale(0.1) translate3d(-2000px, 0, 0);\n    -webkit-transform-origin: left center;\n    transform-origin: left center; } }\n\n.zoomOutLeft {\n  -webkit-animation-name: zoomOutLeft;\n  animation-name: zoomOutLeft; }\n\n@-webkit-keyframes zoomOutRight {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale(0.1) translate3d(2000px, 0, 0);\n    transform: scale(0.1) translate3d(2000px, 0, 0);\n    -webkit-transform-origin: right center;\n    transform-origin: right center; } }\n\n@keyframes zoomOutRight {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale(0.1) translate3d(2000px, 0, 0);\n    transform: scale(0.1) translate3d(2000px, 0, 0);\n    -webkit-transform-origin: right center;\n    transform-origin: right center; } }\n\n.zoomOutRight {\n  -webkit-animation-name: zoomOutRight;\n  animation-name: zoomOutRight; }\n\n@-webkit-keyframes zoomOutUp {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n@keyframes zoomOutUp {\n  40% {\n    opacity: 1;\n    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);\n    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }\n  to {\n    opacity: 0;\n    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);\n    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);\n    -webkit-transform-origin: center bottom;\n    transform-origin: center bottom;\n    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);\n    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1); } }\n\n.zoomOutUp {\n  -webkit-animation-name: zoomOutUp;\n  animation-name: zoomOutUp; }\n\n@-webkit-keyframes slideInDown {\n  from {\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n    visibility: visible; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideInDown {\n  from {\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n    visibility: visible; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n.slideInDown {\n  -webkit-animation-name: slideInDown;\n  animation-name: slideInDown; }\n\n@-webkit-keyframes slideInLeft {\n  from {\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n    visibility: visible; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideInLeft {\n  from {\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0);\n    visibility: visible; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n.slideInLeft {\n  -webkit-animation-name: slideInLeft;\n  animation-name: slideInLeft; }\n\n@-webkit-keyframes slideInRight {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n    visibility: visible; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideInRight {\n  from {\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0);\n    visibility: visible; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n.slideInRight {\n  -webkit-animation-name: slideInRight;\n  animation-name: slideInRight; }\n\n@-webkit-keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n.slideInUp {\n  -webkit-animation-name: slideInUp;\n  animation-name: slideInUp; }\n\n@-webkit-keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0); } }\n\n@keyframes slideOutDown {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0); } }\n\n.slideOutDown {\n  -webkit-animation-name: slideOutDown;\n  animation-name: slideOutDown; }\n\n@-webkit-keyframes slideOutLeft {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0); } }\n\n@keyframes slideOutLeft {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(-100%, 0, 0);\n    transform: translate3d(-100%, 0, 0); } }\n\n.slideOutLeft {\n  -webkit-animation-name: slideOutLeft;\n  animation-name: slideOutLeft; }\n\n@-webkit-keyframes slideOutRight {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); } }\n\n@keyframes slideOutRight {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); } }\n\n.slideOutRight {\n  -webkit-animation-name: slideOutRight;\n  animation-name: slideOutRight; }\n\n@-webkit-keyframes slideOutUp {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0); } }\n\n@keyframes slideOutUp {\n  from {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  to {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0); } }\n\n.slideOutUp {\n  -webkit-animation-name: slideOutUp;\n  animation-name: slideOutUp; }\n\nbody {\n  color: #222; }\n\n#canvas-container {\n  max-height: 100%;\n  max-width: 750px;\n  overflow: auto;\n  margin: 0 auto;\n  box-shadow: 0 1px 15px 1px rgba(0, 0, 0, 0.5); }\n  #canvas-container canvas {\n    background: url(" + __webpack_require__(215) + ") center bottom no-repeat, url(" + __webpack_require__(214) + ") 0 0 repeat !important; }\n\n.loading {\n  background: url(" + __webpack_require__(217) + ") center 10px no-repeat;\n  height: 230px;\n  width: 80%;\n  position: absolute; }\n\n.game-spec {\n  width: 200px;\n  position: fixed;\n  right: 0;\n  background: #F0F0F1;\n  height: 100%;\n  padding: 15px; }\n  .game-spec h2 {\n    font-size: 28px; }\n  .game-spec h3 {\n    font-size: 18px; }\n  .game-spec p {\n    font-size: 14px;\n    color: #555; }\n  .game-spec .btn {\n    border: 0;\n    color: #fff;\n    background: #12975E;\n    padding: 8px 20px;\n    margin: 1em 0;\n    border-radius: 5px; }\n    .game-spec .btn:disabled {\n      background: #aaa; }\n\n.win {\n  background: url(" + __webpack_require__(223) + ") center 20px no-repeat;\n  height: 230px;\n  width: 100%;\n  position: absolute; }\n  .win p {\n    color: #fff;\n    font-size: 18px;\n    text-align: center;\n    padding-top: 220px; }\n    .win p b {\n      color: #FCE233;\n      font-size: 24px; }\n\n.loader {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin-top: -32px;\n  margin-left: -32px; }\n", ""]);
	
	// exports


/***/ },
/* 210 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "068cc6c334869fbf1a5b43222a51b6a3.wav";

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ae8ab35f2a85f476abaa6f2e1441da0e.wav";

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e59ebb4a1551f1a206e62da05e61dd6c.wav";

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "9fd03d57a7dba0f0f25078349995903a.png";

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "acb39b9f5a14669cf1d504fd7fea5a14.png";

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "5add32b4976240bbb0e12bb7caabc821.gif";

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d1d3f1322dbccb44d0a0160c8a18e934.png";

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "7153c471c509e8640633603a52d69c9c.png";

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "cc80120c9a5145243d0de0106ff95cb7.png";

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ca3fbed27d062b76647a13b622e43334.png";

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "66cb440b2e775e7d183d31b8631637ff.png";

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "4b84b41a0e25886e03ee7f1e65db994c.png";

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a53ed7620991e051712732cf04a4febb.png";

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "favicon.ico";

/***/ },
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */
/***/ function(module, exports) {

	module.exports = [
		{
			"constant": true,
			"inputs": [
				{
					"name": "_owner",
					"type": "address"
				}
			],
			"name": "name",
			"outputs": [
				{
					"name": "o_name",
					"type": "bytes32"
				}
			],
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "owner",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "content",
			"outputs": [
				{
					"name": "",
					"type": "bytes32"
				}
			],
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "addr",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "reserve",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "subRegistrar",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				},
				{
					"name": "_newOwner",
					"type": "address"
				}
			],
			"name": "transfer",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				},
				{
					"name": "_registrar",
					"type": "address"
				}
			],
			"name": "setSubRegistrar",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "Registrar",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				},
				{
					"name": "_a",
					"type": "address"
				},
				{
					"name": "_primary",
					"type": "bool"
				}
			],
			"name": "setAddress",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				},
				{
					"name": "_content",
					"type": "bytes32"
				}
			],
			"name": "setContent",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "disown",
			"outputs": [],
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "_name",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"name": "_winner",
					"type": "address"
				}
			],
			"name": "AuctionEnded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "_name",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"name": "_bidder",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "_value",
					"type": "uint256"
				}
			],
			"name": "NewBid",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "name",
					"type": "bytes32"
				}
			],
			"name": "Changed",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "name",
					"type": "bytes32"
				},
				{
					"indexed": true,
					"name": "addr",
					"type": "address"
				}
			],
			"name": "PrimaryChanged",
			"type": "event"
		}
	];

/***/ },
/* 237 */
/***/ function(module, exports) {

	module.exports = [
		{
			"constant": true,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "owner",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				},
				{
					"name": "_refund",
					"type": "address"
				}
			],
			"name": "disown",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "addr",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				}
			],
			"name": "reserve",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				},
				{
					"name": "_newOwner",
					"type": "address"
				}
			],
			"name": "transfer",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_name",
					"type": "bytes32"
				},
				{
					"name": "_a",
					"type": "address"
				}
			],
			"name": "setAddr",
			"outputs": [],
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "name",
					"type": "bytes32"
				}
			],
			"name": "Changed",
			"type": "event"
		}
	];

/***/ },
/* 238 */
/***/ function(module, exports) {

	module.exports = [
		{
			"constant": false,
			"inputs": [
				{
					"name": "from",
					"type": "bytes32"
				},
				{
					"name": "to",
					"type": "address"
				},
				{
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "transfer",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "from",
					"type": "bytes32"
				},
				{
					"name": "to",
					"type": "address"
				},
				{
					"name": "indirectId",
					"type": "bytes32"
				},
				{
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "icapTransfer",
			"outputs": [],
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "to",
					"type": "bytes32"
				}
			],
			"name": "deposit",
			"outputs": [],
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "from",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "AnonymousDeposit",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "from",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "to",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "Deposit",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "from",
					"type": "bytes32"
				},
				{
					"indexed": true,
					"name": "to",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "Transfer",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "from",
					"type": "bytes32"
				},
				{
					"indexed": true,
					"name": "to",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "indirectId",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "IcapTransfer",
			"type": "event"
		}
	];

/***/ },
/* 239 */
/***/ function(module, exports) {

	module.exports = {
		"version": "0.15.1"
	};

/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;/**
	* matter-js master by @liabru 2015-12-05
	* http://brm.io/matter-js/
	* License MIT
	*/
	
	/**
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2014 Liam Brummitt
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
	
	(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Matter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	/**
	* The `Matter.Body` module contains methods for creating and manipulating body models.
	* A `Matter.Body` is a rigid body that can be simulated by a `Matter.Engine`.
	* Factories for commonly used body configurations (such as rectangles, circles and other polygons) can be found in the module `Matter.Bodies`.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	
	* @class Body
	*/
	
	var Body = {};
	
	module.exports = Body;
	
	var Vertices = require('../geometry/Vertices');
	var Vector = require('../geometry/Vector');
	var Sleeping = require('../core/Sleeping');
	var Render = require('../render/Render');
	var Common = require('../core/Common');
	var Bounds = require('../geometry/Bounds');
	var Axes = require('../geometry/Axes');
	
	(function() {
	
	    Body._inertiaScale = 4;
	
	    var _nextCollidingGroupId = 1,
	        _nextNonCollidingGroupId = -1,
	        _nextCategory = 0x0001;
	
	    /**
	     * Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properties section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {} options
	     * @return {body} body
	     */
	    Body.create = function(options) {
	        var defaults = {
	            id: Common.nextId(),
	            type: 'body',
	            label: 'Body',
	            parts: [],
	            angle: 0,
	            vertices: Vertices.fromPath('L 0 0 L 40 0 L 40 40 L 0 40'),
	            position: { x: 0, y: 0 },
	            force: { x: 0, y: 0 },
	            torque: 0,
	            positionImpulse: { x: 0, y: 0 },
	            constraintImpulse: { x: 0, y: 0, angle: 0 },
	            totalContacts: 0,
	            speed: 0,
	            angularSpeed: 0,
	            velocity: { x: 0, y: 0 },
	            angularVelocity: 0,
	            isStatic: false,
	            isSleeping: false,
	            motion: 0,
	            sleepThreshold: 60,
	            density: 0.001,
	            restitution: 0,
	            friction: 0.1,
	            frictionStatic: 0.5,
	            frictionAir: 0.01,
	            collisionFilter: {
	                category: 0x0001,
	                mask: 0xFFFFFFFF,
	                group: 0
	            },
	            slop: 0.05,
	            timeScale: 1,
	            render: {
	                visible: true,
	                sprite: {
	                    xScale: 1,
	                    yScale: 1
	                },
	                lineWidth: 1.5
	            }
	        };
	
	        var body = Common.extend(defaults, options);
	
	        _initProperties(body, options);
	
	        return body;
	    };
	
	    /**
	     * Returns the next unique group index for which bodies will collide.
	     * If `isNonColliding` is `true`, returns the next unique group index for which bodies will _not_ collide.
	     * See `body.collisionFilter` for more information.
	     * @method nextGroup
	     * @param {bool} [isNonColliding=false]
	     * @return {Number} Unique group index
	     */
	    Body.nextGroup = function(isNonColliding) {
	        if (isNonColliding)
	            return _nextNonCollidingGroupId--;
	
	        return _nextCollidingGroupId++;
	    };
	
	    /**
	     * Returns the next unique category bitfield (starting after the initial default category `0x0001`).
	     * There are 32 available. See `body.collisionFilter` for more information.
	     * @method nextCategory
	     * @return {Number} Unique category bitfield
	     */
	    Body.nextCategory = function() {
	        _nextCategory = _nextCategory << 1;
	        return _nextCategory;
	    };
	
	    /**
	     * Initialises body properties.
	     * @method _initProperties
	     * @private
	     * @param {body} body
	     * @param {} options
	     */
	    var _initProperties = function(body, options) {
	        // init required properties (order is important)
	        Body.set(body, {
	            bounds: body.bounds || Bounds.create(body.vertices),
	            positionPrev: body.positionPrev || Vector.clone(body.position),
	            anglePrev: body.anglePrev || body.angle,
	            vertices: body.vertices,
	            parts: body.parts || [body],
	            isStatic: body.isStatic,
	            isSleeping: body.isSleeping,
	            parent: body.parent || body
	        });
	
	        Vertices.rotate(body.vertices, body.angle, body.position);
	        Axes.rotate(body.axes, body.angle);
	        Bounds.update(body.bounds, body.vertices, body.velocity);
	
	        // allow options to override the automatically calculated properties
	        Body.set(body, {
	            axes: options.axes || body.axes,
	            area: options.area || body.area,
	            mass: options.mass || body.mass,
	            inertia: options.inertia || body.inertia
	        });
	
	        // render properties
	        var defaultFillStyle = (body.isStatic ? '#eeeeee' : Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'])),
	            defaultStrokeStyle = Common.shadeColor(defaultFillStyle, -20);
	        body.render.fillStyle = body.render.fillStyle || defaultFillStyle;
	        body.render.strokeStyle = body.render.strokeStyle || defaultStrokeStyle;
	    };
	
	    /**
	     * Given a property and a value (or map of), sets the property(s) on the body, using the appropriate setter functions if they exist.
	     * Prefer to use the actual setter functions in performance critical situations.
	     * @method set
	     * @param {body} body
	     * @param {} settings A property name (or map of properties and values) to set on the body.
	     * @param {} value The value to set if `settings` is a single property name.
	     */
	    Body.set = function(body, settings, value) {
	        var property;
	
	        if (typeof settings === 'string') {
	            property = settings;
	            settings = {};
	            settings[property] = value;
	        }
	
	        for (property in settings) {
	            value = settings[property];
	
	            if (!settings.hasOwnProperty(property))
	                continue;
	
	            switch (property) {
	
	            case 'isStatic':
	                Body.setStatic(body, value);
	                break;
	            case 'isSleeping':
	                Sleeping.set(body, value);
	                break;
	            case 'mass':
	                Body.setMass(body, value);
	                break;
	            case 'density':
	                Body.setDensity(body, value);
	                break;
	            case 'inertia':
	                Body.setInertia(body, value);
	                break;
	            case 'vertices':
	                Body.setVertices(body, value);
	                break;
	            case 'position':
	                Body.setPosition(body, value);
	                break;
	            case 'angle':
	                Body.setAngle(body, value);
	                break;
	            case 'velocity':
	                Body.setVelocity(body, value);
	                break;
	            case 'angularVelocity':
	                Body.setAngularVelocity(body, value);
	                break;
	            case 'parts':
	                Body.setParts(body, value);
	                break;
	            default:
	                body[property] = value;
	
	            }
	        }
	    };
	
	    /**
	     * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
	     * @method setStatic
	     * @param {body} body
	     * @param {bool} isStatic
	     */
	    Body.setStatic = function(body, isStatic) {
	        for (var i = 0; i < body.parts.length; i++) {
	            var part = body.parts[i];
	            part.isStatic = isStatic;
	
	            if (isStatic) {
	                part.restitution = 0;
	                part.friction = 1;
	                part.mass = part.inertia = part.density = Infinity;
	                part.inverseMass = part.inverseInertia = 0;
	
	                part.positionPrev.x = part.position.x;
	                part.positionPrev.y = part.position.y;
	                part.anglePrev = part.angle;
	                part.angularVelocity = 0;
	                part.speed = 0;
	                part.angularSpeed = 0;
	                part.motion = 0;
	            }
	        }
	    };
	
	    /**
	     * Sets the mass of the body. Inverse mass and density are automatically updated to reflect the change.
	     * @method setMass
	     * @param {body} body
	     * @param {number} mass
	     */
	    Body.setMass = function(body, mass) {
	        body.mass = mass;
	        body.inverseMass = 1 / body.mass;
	        body.density = body.mass / body.area;
	    };
	
	    /**
	     * Sets the density of the body. Mass is automatically updated to reflect the change.
	     * @method setDensity
	     * @param {body} body
	     * @param {number} density
	     */
	    Body.setDensity = function(body, density) {
	        Body.setMass(body, density * body.area);
	        body.density = density;
	    };
	
	    /**
	     * Sets the moment of inertia (i.e. second moment of area) of the body of the body. 
	     * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
	     * @method setInertia
	     * @param {body} body
	     * @param {number} inertia
	     */
	    Body.setInertia = function(body, inertia) {
	        body.inertia = inertia;
	        body.inverseInertia = 1 / body.inertia;
	    };
	
	    /**
	     * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
	     * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
	     * They are then automatically translated to world space based on `body.position`.
	     *
	     * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
	     * Vertices must form a convex hull, concave hulls are not supported.
	     *
	     * @method setVertices
	     * @param {body} body
	     * @param {vector[]} vertices
	     */
	    Body.setVertices = function(body, vertices) {
	        // change vertices
	        if (vertices[0].body === body) {
	            body.vertices = vertices;
	        } else {
	            body.vertices = Vertices.create(vertices, body);
	        }
	
	        // update properties
	        body.axes = Axes.fromVertices(body.vertices);
	        body.area = Vertices.area(body.vertices);
	        Body.setMass(body, body.density * body.area);
	
	        // orient vertices around the centre of mass at origin (0, 0)
	        var centre = Vertices.centre(body.vertices);
	        Vertices.translate(body.vertices, centre, -1);
	
	        // update inertia while vertices are at origin (0, 0)
	        Body.setInertia(body, Body._inertiaScale * Vertices.inertia(body.vertices, body.mass));
	
	        // update geometry
	        Vertices.translate(body.vertices, body.position);
	        Bounds.update(body.bounds, body.vertices, body.velocity);
	    };
	
	    /**
	     * Sets the parts of the `body` and updates mass, inertia and centroid.
	     * Each part will have its parent set to `body`.
	     * By default the convex hull will be automatically computed and set on `body`, unless `autoHull` is set to `false.`
	     * Note that this method will ensure that the first part in `body.parts` will always be the `body`.
	     * @method setParts
	     * @param {body} body
	     * @param [body] parts
	     * @param {bool} [autoHull=true]
	     */
	    Body.setParts = function(body, parts, autoHull) {
	        var i;
	
	        // add all the parts, ensuring that the first part is always the parent body
	        parts = parts.slice(0);
	        body.parts.length = 0;
	        body.parts.push(body);
	        body.parent = body;
	
	        for (i = 0; i < parts.length; i++) {
	            var part = parts[i];
	            if (part !== body) {
	                part.parent = body;
	                body.parts.push(part);
	            }
	        }
	
	        if (body.parts.length === 1)
	            return;
	
	        autoHull = typeof autoHull !== 'undefined' ? autoHull : true;
	
	        // find the convex hull of all parts to set on the parent body
	        if (autoHull) {
	            var vertices = [];
	            for (i = 0; i < parts.length; i++) {
	                vertices = vertices.concat(parts[i].vertices);
	            }
	
	            Vertices.clockwiseSort(vertices);
	
	            var hull = Vertices.hull(vertices),
	                hullCentre = Vertices.centre(hull);
	
	            Body.setVertices(body, hull);
	            Vertices.translate(body.vertices, hullCentre);
	        }
	
	        // sum the properties of all compound parts of the parent body
	        var total = _totalProperties(body);
	
	        body.area = total.area;
	        body.parent = body;
	        body.position.x = total.centre.x;
	        body.position.y = total.centre.y;
	        body.positionPrev.x = total.centre.x;
	        body.positionPrev.y = total.centre.y;
	
	        Body.setMass(body, total.mass);
	        Body.setInertia(body, total.inertia);
	        Body.setPosition(body, total.centre);
	    };
	
	    /**
	     * Sets the position of the body instantly. Velocity, angle, force etc. are unchanged.
	     * @method setPosition
	     * @param {body} body
	     * @param {vector} position
	     */
	    Body.setPosition = function(body, position) {
	        var delta = Vector.sub(position, body.position);
	        body.positionPrev.x += delta.x;
	        body.positionPrev.y += delta.y;
	
	        for (var i = 0; i < body.parts.length; i++) {
	            var part = body.parts[i];
	            part.position.x += delta.x;
	            part.position.y += delta.y;
	            Vertices.translate(part.vertices, delta);
	            Bounds.update(part.bounds, part.vertices, body.velocity);
	        }
	    };
	
	    /**
	     * Sets the angle of the body instantly. Angular velocity, position, force etc. are unchanged.
	     * @method setAngle
	     * @param {body} body
	     * @param {number} angle
	     */
	    Body.setAngle = function(body, angle) {
	        var delta = angle - body.angle;
	        body.anglePrev += delta;
	
	        for (var i = 0; i < body.parts.length; i++) {
	            var part = body.parts[i];
	            part.angle += delta;
	            Vertices.rotate(part.vertices, delta, body.position);
	            Axes.rotate(part.axes, delta);
	            Bounds.update(part.bounds, part.vertices, body.velocity);
	            if (i > 0) {
	                Vector.rotateAbout(part.position, delta, body.position, part.position);
	            }
	        }
	    };
	
	    /**
	     * Sets the linear velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
	     * @method setVelocity
	     * @param {body} body
	     * @param {vector} velocity
	     */
	    Body.setVelocity = function(body, velocity) {
	        body.positionPrev.x = body.position.x - velocity.x;
	        body.positionPrev.y = body.position.y - velocity.y;
	        body.velocity.x = velocity.x;
	        body.velocity.y = velocity.y;
	        body.speed = Vector.magnitude(body.velocity);
	    };
	
	    /**
	     * Sets the angular velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
	     * @method setAngularVelocity
	     * @param {body} body
	     * @param {number} velocity
	     */
	    Body.setAngularVelocity = function(body, velocity) {
	        body.anglePrev = body.angle - velocity;
	        body.angularVelocity = velocity;
	        body.angularSpeed = Math.abs(body.angularVelocity);
	    };
	
	    /**
	     * Moves a body by a given vector relative to its current position, without imparting any velocity.
	     * @method translate
	     * @param {body} body
	     * @param {vector} translation
	     */
	    Body.translate = function(body, translation) {
	        Body.setPosition(body, Vector.add(body.position, translation));
	    };
	
	    /**
	     * Rotates a body by a given angle relative to its current angle, without imparting any angular velocity.
	     * @method rotate
	     * @param {body} body
	     * @param {number} rotation
	     */
	    Body.rotate = function(body, rotation) {
	        Body.setAngle(body, body.angle + rotation);
	    };
	
	    /**
	     * Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
	     * @method scale
	     * @param {body} body
	     * @param {number} scaleX
	     * @param {number} scaleY
	     * @param {vector} [point]
	     */
	    Body.scale = function(body, scaleX, scaleY, point) {
	        for (var i = 0; i < body.parts.length; i++) {
	            var part = body.parts[i];
	
	            // scale vertices
	            Vertices.scale(part.vertices, scaleX, scaleY, body.position);
	
	            // update properties
	            part.axes = Axes.fromVertices(part.vertices);
	
	            if (!body.isStatic) {
	                part.area = Vertices.area(part.vertices);
	                Body.setMass(part, body.density * part.area);
	
	                // update inertia (requires vertices to be at origin)
	                Vertices.translate(part.vertices, { x: -part.position.x, y: -part.position.y });
	                Body.setInertia(part, Vertices.inertia(part.vertices, part.mass));
	                Vertices.translate(part.vertices, { x: part.position.x, y: part.position.y });
	            }
	
	            // update bounds
	            Bounds.update(part.bounds, part.vertices, body.velocity);
	        }
	
	        if (!body.isStatic) {
	            var total = _totalProperties(body);
	            body.area = total.area;
	            Body.setMass(body, total.mass);
	            Body.setInertia(body, total.inertia);
	        }
	    };
	
	    /**
	     * Performs a simulation step for the given `body`, including updating position and angle using Verlet integration.
	     * @method update
	     * @param {body} body
	     * @param {number} deltaTime
	     * @param {number} timeScale
	     * @param {number} correction
	     */
	    Body.update = function(body, deltaTime, timeScale, correction) {
	        var deltaTimeSquared = Math.pow(deltaTime * timeScale * body.timeScale, 2);
	
	        // from the previous step
	        var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale,
	            velocityPrevX = body.position.x - body.positionPrev.x,
	            velocityPrevY = body.position.y - body.positionPrev.y;
	
	        // update velocity with Verlet integration
	        body.velocity.x = (velocityPrevX * frictionAir * correction) + (body.force.x / body.mass) * deltaTimeSquared;
	        body.velocity.y = (velocityPrevY * frictionAir * correction) + (body.force.y / body.mass) * deltaTimeSquared;
	
	        body.positionPrev.x = body.position.x;
	        body.positionPrev.y = body.position.y;
	        body.position.x += body.velocity.x;
	        body.position.y += body.velocity.y;
	
	        // update angular velocity with Verlet integration
	        body.angularVelocity = ((body.angle - body.anglePrev) * frictionAir * correction) + (body.torque / body.inertia) * deltaTimeSquared;
	        body.anglePrev = body.angle;
	        body.angle += body.angularVelocity;
	
	        // track speed and acceleration
	        body.speed = Vector.magnitude(body.velocity);
	        body.angularSpeed = Math.abs(body.angularVelocity);
	
	        // transform the body geometry
	        for (var i = 0; i < body.parts.length; i++) {
	            var part = body.parts[i];
	
	            Vertices.translate(part.vertices, body.velocity);
	            
	            if (i > 0) {
	                part.position.x += body.velocity.x;
	                part.position.y += body.velocity.y;
	            }
	
	            if (body.angularVelocity !== 0) {
	                Vertices.rotate(part.vertices, body.angularVelocity, body.position);
	                Axes.rotate(part.axes, body.angularVelocity);
	                if (i > 0) {
	                    Vector.rotateAbout(part.position, body.angularVelocity, body.position, part.position);
	                }
	            }
	
	            Bounds.update(part.bounds, part.vertices, body.velocity);
	        }
	    };
	
	    /**
	     * Applies a force to a body from a given world-space position, including resulting torque.
	     * @method applyForce
	     * @param {body} body
	     * @param {vector} position
	     * @param {vector} force
	     */
	    Body.applyForce = function(body, position, force) {
	        body.force.x += force.x;
	        body.force.y += force.y;
	        var offset = { x: position.x - body.position.x, y: position.y - body.position.y };
	        body.torque += (offset.x * force.y - offset.y * force.x) * body.inverseInertia;
	    };
	
	    /**
	     * Returns the sums of the properties of all compound parts of the parent body.
	     * @method _totalProperties
	     * @private
	     * @param {body} body
	     * @return {}
	     */
	    var _totalProperties = function(body) {
	        // https://ecourses.ou.edu/cgi-bin/ebook.cgi?doc=&topic=st&chap_sec=07.2&page=theory
	        // http://output.to/sideway/default.asp?qno=121100087
	
	        var properties = {
	            mass: 0,
	            area: 0,
	            inertia: 0,
	            centre: { x: 0, y: 0 }
	        };
	
	        // sum the properties of all compound parts of the parent body
	        for (var i = body.parts.length === 1 ? 0 : 1; i < body.parts.length; i++) {
	            var part = body.parts[i];
	            properties.mass += part.mass;
	            properties.area += part.area;
	            properties.inertia += part.inertia;
	            properties.centre = Vector.add(properties.centre, 
	                                           Vector.mult(part.position, part.mass !== Infinity ? part.mass : 1));
	        }
	
	        properties.centre = Vector.div(properties.centre, 
	                                       properties.mass !== Infinity ? properties.mass : body.parts.length);
	
	        return properties;
	    };
	
	    /*
	    *
	    *  Events Documentation
	    *
	    */
	
	    /**
	    * Fired when a body starts sleeping (where `this` is the body).
	    *
	    * @event sleepStart
	    * @this {body} The body that has started sleeping
	    * @param {} event An event object
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when a body ends sleeping (where `this` is the body).
	    *
	    * @event sleepEnd
	    * @this {body} The body that has ended sleeping
	    * @param {} event An event object
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * An integer `Number` uniquely identifying number generated in `Body.create` by `Common.nextId`.
	     *
	     * @property id
	     * @type number
	     */
	
	    /**
	     * A `String` denoting the type of object.
	     *
	     * @property type
	     * @type string
	     * @default "body"
	     */
	
	    /**
	     * An arbitrary `String` name to help the user identify and manage bodies.
	     *
	     * @property label
	     * @type string
	     * @default "Body"
	     */
	
	    /**
	     * An array of bodies that make up this body. 
	     * The first body in the array must always be a self reference to the current body instance.
	     * All bodies in the `parts` array together form a single rigid compound body.
	     * Parts are allowed to overlap, have gaps or holes or even form concave bodies.
	     * Parts themselves should never be added to a `World`, only the parent body should be.
	     * Use `Body.setParts` when setting parts to ensure correct updates of all properties.
	     *
	     * @property parts
	     * @type body[]
	     */
	
	    /**
	     * A self reference if the body is _not_ a part of another body.
	     * Otherwise this is a reference to the body that this is a part of.
	     * See `body.parts`.
	     *
	     * @property parent
	     * @type body
	     */
	
	    /**
	     * A `Number` specifying the angle of the body, in radians.
	     *
	     * @property angle
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * An array of `Vector` objects that specify the convex hull of the rigid body.
	     * These should be provided about the origin `(0, 0)`. E.g.
	     *
	     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
	     *
	     * When passed via `Body.create`, the vertices are translated relative to `body.position` (i.e. world-space, and constantly updated by `Body.update` during simulation).
	     * The `Vector` objects are also augmented with additional properties required for efficient collision detection. 
	     *
	     * Other properties such as `inertia` and `bounds` are automatically calculated from the passed vertices (unless provided via `options`).
	     * Concave hulls are not currently supported. The module `Matter.Vertices` contains useful methods for working with vertices.
	     *
	     * @property vertices
	     * @type vector[]
	     */
	
	    /**
	     * A `Vector` that specifies the current world-space position of the body.
	     *
	     * @property position
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Vector` that specifies the force to apply in the current step. It is zeroed after every `Body.update`. See also `Body.applyForce`.
	     *
	     * @property force
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Number` that specifies the torque (turning force) to apply in the current step. It is zeroed after every `Body.update`.
	     *
	     * @property torque
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Number` that _measures_ the current speed of the body after the last `Body.update`. It is read-only and always positive (it's the magnitude of `body.velocity`).
	     *
	     * @readOnly
	     * @property speed
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Number` that _measures_ the current angular speed of the body after the last `Body.update`. It is read-only and always positive (it's the magnitude of `body.angularVelocity`).
	     *
	     * @readOnly
	     * @property angularSpeed
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Vector` that _measures_ the current velocity of the body after the last `Body.update`. It is read-only. 
	     * If you need to modify a body's velocity directly, you should either apply a force or simply change the body's `position` (as the engine uses position-Verlet integration).
	     *
	     * @readOnly
	     * @property velocity
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Number` that _measures_ the current angular velocity of the body after the last `Body.update`. It is read-only. 
	     * If you need to modify a body's angular velocity directly, you should apply a torque or simply change the body's `angle` (as the engine uses position-Verlet integration).
	     *
	     * @readOnly
	     * @property angularVelocity
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
	     * If you need to set a body as static after its creation, you should use `Body.setStatic` as this requires more than just setting this flag.
	     *
	     * @property isStatic
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * A flag that indicates whether the body is considered sleeping. A sleeping body acts similar to a static body, except it is only temporary and can be awoken.
	     * If you need to set a body as sleeping, you should use `Sleeping.set` as this requires more than just setting this flag.
	     *
	     * @property isSleeping
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * A `Number` that _measures_ the amount of movement a body currently has (a combination of `speed` and `angularSpeed`). It is read-only and always positive.
	     * It is used and updated by the `Matter.Sleeping` module during simulation to decide if a body has come to rest.
	     *
	     * @readOnly
	     * @property motion
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Number` that defines the number of updates in which this body must have near-zero velocity before it is set as sleeping by the `Matter.Sleeping` module (if sleeping is enabled by the engine).
	     *
	     * @property sleepThreshold
	     * @type number
	     * @default 60
	     */
	
	    /**
	     * A `Number` that defines the density of the body, that is its mass per unit area.
	     * If you pass the density via `Body.create` the `mass` property is automatically calculated for you based on the size (area) of the object.
	     * This is generally preferable to simply setting mass and allows for more intuitive definition of materials (e.g. rock has a higher density than wood).
	     *
	     * @property density
	     * @type number
	     * @default 0.001
	     */
	
	    /**
	     * A `Number` that defines the mass of the body, although it may be more appropriate to specify the `density` property instead.
	     * If you modify this value, you must also modify the `body.inverseMass` property (`1 / mass`).
	     *
	     * @property mass
	     * @type number
	     */
	
	    /**
	     * A `Number` that defines the inverse mass of the body (`1 / mass`).
	     * If you modify this value, you must also modify the `body.mass` property.
	     *
	     * @property inverseMass
	     * @type number
	     */
	
	    /**
	     * A `Number` that defines the moment of inertia (i.e. second moment of area) of the body.
	     * It is automatically calculated from the given convex hull (`vertices` array) and density in `Body.create`.
	     * If you modify this value, you must also modify the `body.inverseInertia` property (`1 / inertia`).
	     *
	     * @property inertia
	     * @type number
	     */
	
	    /**
	     * A `Number` that defines the inverse moment of inertia of the body (`1 / inertia`).
	     * If you modify this value, you must also modify the `body.inertia` property.
	     *
	     * @property inverseInertia
	     * @type number
	     */
	
	    /**
	     * A `Number` that defines the restitution (elasticity) of the body. The value is always positive and is in the range `(0, 1)`.
	     * A value of `0` means collisions may be perfectly inelastic and no bouncing may occur. 
	     * A value of `0.8` means the body may bounce back with approximately 80% of its kinetic energy.
	     * Note that collision response is based on _pairs_ of bodies, and that `restitution` values are _combined_ with the following formula:
	     *
	     *     Math.max(bodyA.restitution, bodyB.restitution)
	     *
	     * @property restitution
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * A `Number` that defines the friction of the body. The value is always positive and is in the range `(0, 1)`.
	     * A value of `0` means that the body may slide indefinitely.
	     * A value of `1` means the body may come to a stop almost instantly after a force is applied.
	     *
	     * The effects of the value may be non-linear. 
	     * High values may be unstable depending on the body.
	     * The engine uses a Coulomb friction model including static and kinetic friction.
	     * Note that collision response is based on _pairs_ of bodies, and that `friction` values are _combined_ with the following formula:
	     *
	     *     Math.min(bodyA.friction, bodyB.friction)
	     *
	     * @property friction
	     * @type number
	     * @default 0.1
	     */
	
	    /**
	     * A `Number` that defines the static friction of the body (in the Coulomb friction model). 
	     * A value of `0` means the body will never 'stick' when it is nearly stationary and only dynamic `friction` is used.
	     * The higher the value (e.g. `10`), the more force it will take to initially get the body moving when nearly stationary.
	     * This value is multiplied with the `friction` property to make it easier to change `friction` and maintain an appropriate amount of static friction.
	     *
	     * @property frictionStatic
	     * @type number
	     * @default 0.5
	     */
	
	    /**
	     * A `Number` that defines the air friction of the body (air resistance). 
	     * A value of `0` means the body will never slow as it moves through space.
	     * The higher the value, the faster a body slows when moving through space.
	     * The effects of the value are non-linear. 
	     *
	     * @property frictionAir
	     * @type number
	     * @default 0.01
	     */
	
	    /**
	     * An `Object` that specifies the collision filtering properties of this body.
	     *
	     * Collisions between two bodies will obey the following rules:
	     * - If the two bodies have the same non-zero value of `collisionFilter.group`,
	     *   they will always collide if the value is positive, and they will never collide
	     *   if the value is negative.
	     * - If the two bodies have different values of `collisionFilter.group` or if one
	     *   (or both) of the bodies has a value of 0, then the category/mask rules apply as follows:
	     *
	     * Each body belongs to a collision category, given by `collisionFilter.category`. This
	     * value is used as a bit field and the category should have only one bit set, meaning that
	     * the value of this property is a power of two in the range [1, 2^31]. Thus, there are 32
	     * different collision categories available.
	     *
	     * Each body also defines a collision bitmask, given by `collisionFilter.mask` which specifies
	     * the categories it collides with (the value is the bitwise AND value of all these categories).
	     *
	     * Using the category/mask rules, two bodies `A` and `B` collide if each includes the other's
	     * category in its mask, i.e. `(categoryA & maskB) !== 0` and `(categoryB & maskA) !== 0`
	     * are both true.
	     *
	     * @property collisionFilter
	     * @type object
	     */
	
	    /**
	     * An Integer `Number`, that specifies the collision group this body belongs to.
	     * See `body.collisionFilter` for more information.
	     *
	     * @property collisionFilter.group
	     * @type object
	     * @default 0
	     */
	
	    /**
	     * A bit field that specifies the collision category this body belongs to.
	     * The category value should have only one bit set, for example `0x0001`.
	     * This means there are up to 32 unique collision categories available.
	     * See `body.collisionFilter` for more information.
	     *
	     * @property collisionFilter.category
	     * @type object
	     * @default 1
	     */
	
	    /**
	     * A bit mask that specifies the collision categories this body may collide with.
	     * See `body.collisionFilter` for more information.
	     *
	     * @property collisionFilter.mask
	     * @type object
	     * @default -1
	     */
	
	    /**
	     * A `Number` that specifies a tolerance on how far a body is allowed to 'sink' or rotate into other bodies.
	     * Avoid changing this value unless you understand the purpose of `slop` in physics engines.
	     * The default should generally suffice, although very large bodies may require larger values for stable stacking.
	     *
	     * @property slop
	     * @type number
	     * @default 0.05
	     */
	
	    /**
	     * A `Number` that allows per-body time scaling, e.g. a force-field where bodies inside are in slow-motion, while others are at full speed.
	     *
	     * @property timeScale
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
	     *
	     * @property render
	     * @type object
	     */
	
	    /**
	     * A flag that indicates if the body should be rendered.
	     *
	     * @property render.visible
	     * @type boolean
	     * @default true
	     */
	
	    /**
	     * An `Object` that defines the sprite properties to use when rendering, if any.
	     *
	     * @property render.sprite
	     * @type object
	     */
	
	    /**
	     * An `String` that defines the path to the image to use as the sprite texture, if any.
	     *
	     * @property render.sprite.texture
	     * @type string
	     */
	     
	    /**
	     * A `Number` that defines the scaling in the x-axis for the sprite, if any.
	     *
	     * @property render.sprite.xScale
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * A `Number` that defines the scaling in the y-axis for the sprite, if any.
	     *
	     * @property render.sprite.yScale
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * A `Number` that defines the line width to use when rendering the body outline (if a sprite is not defined).
	     * A value of `0` means no outline will be rendered.
	     *
	     * @property render.lineWidth
	     * @type number
	     * @default 1.5
	     */
	
	    /**
	     * A `String` that defines the fill style to use when rendering the body (if a sprite is not defined).
	     * It is the same as when using a canvas, so it accepts CSS style property values.
	     *
	     * @property render.fillStyle
	     * @type string
	     * @default a random colour
	     */
	
	    /**
	     * A `String` that defines the stroke style to use when rendering the body outline (if a sprite is not defined).
	     * It is the same as when using a canvas, so it accepts CSS style property values.
	     *
	     * @property render.strokeStyle
	     * @type string
	     * @default a random colour
	     */
	
	    /**
	     * An array of unique axis vectors (edge normals) used for collision detection.
	     * These are automatically calculated from the given convex hull (`vertices` array) in `Body.create`.
	     * They are constantly updated by `Body.update` during the simulation.
	     *
	     * @property axes
	     * @type vector[]
	     */
	     
	    /**
	     * A `Number` that _measures_ the area of the body's convex hull, calculated at creation by `Body.create`.
	     *
	     * @property area
	     * @type string
	     * @default 
	     */
	
	    /**
	     * A `Bounds` object that defines the AABB region for the body.
	     * It is automatically calculated from the given convex hull (`vertices` array) in `Body.create` and constantly updated by `Body.update` during simulation.
	     *
	     * @property bounds
	     * @type bounds
	     */
	
	})();
	
	},{"../core/Common":14,"../core/Sleeping":20,"../geometry/Axes":23,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27,"../render/Render":29}],2:[function(require,module,exports){
	/**
	* The `Matter.Composite` module contains methods for creating and manipulating composite bodies.
	* A composite body is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite`, therefore composites form a tree structure.
	* It is important to use the functions in this module to modify composites, rather than directly modifying their properties.
	* Note that the `Matter.World` object is also a type of `Matter.Composite` and as such all composite methods here can also operate on a `Matter.World`.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Composite
	*/
	
	var Composite = {};
	
	module.exports = Composite;
	
	var Events = require('../core/Events');
	var Common = require('../core/Common');
	var Body = require('./Body');
	
	(function() {
	
	    /**
	     * Creates a new composite. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properites section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {} [options]
	     * @return {composite} A new composite
	     */
	    Composite.create = function(options) {
	        return Common.extend({ 
	            id: Common.nextId(),
	            type: 'composite',
	            parent: null,
	            isModified: false,
	            bodies: [], 
	            constraints: [], 
	            composites: [],
	            label: 'Composite'
	        }, options);
	    };
	
	    /**
	     * Sets the composite's `isModified` flag. 
	     * If `updateParents` is true, all parents will be set (default: false).
	     * If `updateChildren` is true, all children will be set (default: false).
	     * @method setModified
	     * @param {composite} composite
	     * @param {boolean} isModified
	     * @param {boolean} [updateParents=false]
	     * @param {boolean} [updateChildren=false]
	     */
	    Composite.setModified = function(composite, isModified, updateParents, updateChildren) {
	        composite.isModified = isModified;
	
	        if (updateParents && composite.parent) {
	            Composite.setModified(composite.parent, isModified, updateParents, updateChildren);
	        }
	
	        if (updateChildren) {
	            for(var i = 0; i < composite.composites.length; i++) {
	                var childComposite = composite.composites[i];
	                Composite.setModified(childComposite, isModified, updateParents, updateChildren);
	            }
	        }
	    };
	
	    /**
	     * Generic add function. Adds one or many body(s), constraint(s) or a composite(s) to the given composite.
	     * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
	     * @method add
	     * @param {composite} composite
	     * @param {} object
	     * @return {composite} The original composite with the objects added
	     */
	    Composite.add = function(composite, object) {
	        var objects = [].concat(object);
	
	        Events.trigger(composite, 'beforeAdd', { object: object });
	
	        for (var i = 0; i < objects.length; i++) {
	            var obj = objects[i];
	
	            switch (obj.type) {
	
	            case 'body':
	                // skip adding compound parts
	                if (obj.parent !== obj) {
	                    Common.log('Composite.add: skipped adding a compound body part (you must add its parent instead)', 'warn');
	                    break;
	                }
	
	                Composite.addBody(composite, obj);
	                break;
	            case 'constraint':
	                Composite.addConstraint(composite, obj);
	                break;
	            case 'composite':
	                Composite.addComposite(composite, obj);
	                break;
	            case 'mouseConstraint':
	                Composite.addConstraint(composite, obj.constraint);
	                break;
	
	            }
	        }
	
	        Events.trigger(composite, 'afterAdd', { object: object });
	
	        return composite;
	    };
	
	    /**
	     * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
	     * Optionally searching its children recursively.
	     * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
	     * @method remove
	     * @param {composite} composite
	     * @param {} object
	     * @param {boolean} [deep=false]
	     * @return {composite} The original composite with the objects removed
	     */
	    Composite.remove = function(composite, object, deep) {
	        var objects = [].concat(object);
	
	        Events.trigger(composite, 'beforeRemove', { object: object });
	
	        for (var i = 0; i < objects.length; i++) {
	            var obj = objects[i];
	
	            switch (obj.type) {
	
	            case 'body':
	                Composite.removeBody(composite, obj, deep);
	                break;
	            case 'constraint':
	                Composite.removeConstraint(composite, obj, deep);
	                break;
	            case 'composite':
	                Composite.removeComposite(composite, obj, deep);
	                break;
	            case 'mouseConstraint':
	                Composite.removeConstraint(composite, obj.constraint);
	                break;
	
	            }
	        }
	
	        Events.trigger(composite, 'afterRemove', { object: object });
	
	        return composite;
	    };
	
	    /**
	     * Adds a composite to the given composite
	     * @private
	     * @method addComposite
	     * @param {composite} compositeA
	     * @param {composite} compositeB
	     * @return {composite} The original compositeA with the objects from compositeB added
	     */
	    Composite.addComposite = function(compositeA, compositeB) {
	        compositeA.composites.push(compositeB);
	        compositeB.parent = compositeA;
	        Composite.setModified(compositeA, true, true, false);
	        return compositeA;
	    };
	
	    /**
	     * Removes a composite from the given composite, and optionally searching its children recursively
	     * @private
	     * @method removeComposite
	     * @param {composite} compositeA
	     * @param {composite} compositeB
	     * @param {boolean} [deep=false]
	     * @return {composite} The original compositeA with the composite removed
	     */
	    Composite.removeComposite = function(compositeA, compositeB, deep) {
	        var position = Common.indexOf(compositeA.composites, compositeB);
	        if (position !== -1) {
	            Composite.removeCompositeAt(compositeA, position);
	            Composite.setModified(compositeA, true, true, false);
	        }
	
	        if (deep) {
	            for (var i = 0; i < compositeA.composites.length; i++){
	                Composite.removeComposite(compositeA.composites[i], compositeB, true);
	            }
	        }
	
	        return compositeA;
	    };
	
	    /**
	     * Removes a composite from the given composite
	     * @private
	     * @method removeCompositeAt
	     * @param {composite} composite
	     * @param {number} position
	     * @return {composite} The original composite with the composite removed
	     */
	    Composite.removeCompositeAt = function(composite, position) {
	        composite.composites.splice(position, 1);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Adds a body to the given composite
	     * @private
	     * @method addBody
	     * @param {composite} composite
	     * @param {body} body
	     * @return {composite} The original composite with the body added
	     */
	    Composite.addBody = function(composite, body) {
	        composite.bodies.push(body);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Removes a body from the given composite, and optionally searching its children recursively
	     * @private
	     * @method removeBody
	     * @param {composite} composite
	     * @param {body} body
	     * @param {boolean} [deep=false]
	     * @return {composite} The original composite with the body removed
	     */
	    Composite.removeBody = function(composite, body, deep) {
	        var position = Common.indexOf(composite.bodies, body);
	        if (position !== -1) {
	            Composite.removeBodyAt(composite, position);
	            Composite.setModified(composite, true, true, false);
	        }
	
	        if (deep) {
	            for (var i = 0; i < composite.composites.length; i++){
	                Composite.removeBody(composite.composites[i], body, true);
	            }
	        }
	
	        return composite;
	    };
	
	    /**
	     * Removes a body from the given composite
	     * @private
	     * @method removeBodyAt
	     * @param {composite} composite
	     * @param {number} position
	     * @return {composite} The original composite with the body removed
	     */
	    Composite.removeBodyAt = function(composite, position) {
	        composite.bodies.splice(position, 1);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Adds a constraint to the given composite
	     * @private
	     * @method addConstraint
	     * @param {composite} composite
	     * @param {constraint} constraint
	     * @return {composite} The original composite with the constraint added
	     */
	    Composite.addConstraint = function(composite, constraint) {
	        composite.constraints.push(constraint);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Removes a constraint from the given composite, and optionally searching its children recursively
	     * @private
	     * @method removeConstraint
	     * @param {composite} composite
	     * @param {constraint} constraint
	     * @param {boolean} [deep=false]
	     * @return {composite} The original composite with the constraint removed
	     */
	    Composite.removeConstraint = function(composite, constraint, deep) {
	        var position = Common.indexOf(composite.constraints, constraint);
	        if (position !== -1) {
	            Composite.removeConstraintAt(composite, position);
	        }
	
	        if (deep) {
	            for (var i = 0; i < composite.composites.length; i++){
	                Composite.removeConstraint(composite.composites[i], constraint, true);
	            }
	        }
	
	        return composite;
	    };
	
	    /**
	     * Removes a body from the given composite
	     * @private
	     * @method removeConstraintAt
	     * @param {composite} composite
	     * @param {number} position
	     * @return {composite} The original composite with the constraint removed
	     */
	    Composite.removeConstraintAt = function(composite, position) {
	        composite.constraints.splice(position, 1);
	        Composite.setModified(composite, true, true, false);
	        return composite;
	    };
	
	    /**
	     * Removes all bodies, constraints and composites from the given composite
	     * Optionally clearing its children recursively
	     * @method clear
	     * @param {composite} composite
	     * @param {boolean} keepStatic
	     * @param {boolean} [deep=false]
	     */
	    Composite.clear = function(composite, keepStatic, deep) {
	        if (deep) {
	            for (var i = 0; i < composite.composites.length; i++){
	                Composite.clear(composite.composites[i], keepStatic, true);
	            }
	        }
	        
	        if (keepStatic) {
	            composite.bodies = composite.bodies.filter(function(body) { return body.isStatic; });
	        } else {
	            composite.bodies.length = 0;
	        }
	
	        composite.constraints.length = 0;
	        composite.composites.length = 0;
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /**
	     * Returns all bodies in the given composite, including all bodies in its children, recursively
	     * @method allBodies
	     * @param {composite} composite
	     * @return {body[]} All the bodies
	     */
	    Composite.allBodies = function(composite) {
	        var bodies = [].concat(composite.bodies);
	
	        for (var i = 0; i < composite.composites.length; i++)
	            bodies = bodies.concat(Composite.allBodies(composite.composites[i]));
	
	        return bodies;
	    };
	
	    /**
	     * Returns all constraints in the given composite, including all constraints in its children, recursively
	     * @method allConstraints
	     * @param {composite} composite
	     * @return {constraint[]} All the constraints
	     */
	    Composite.allConstraints = function(composite) {
	        var constraints = [].concat(composite.constraints);
	
	        for (var i = 0; i < composite.composites.length; i++)
	            constraints = constraints.concat(Composite.allConstraints(composite.composites[i]));
	
	        return constraints;
	    };
	
	    /**
	     * Returns all composites in the given composite, including all composites in its children, recursively
	     * @method allComposites
	     * @param {composite} composite
	     * @return {composite[]} All the composites
	     */
	    Composite.allComposites = function(composite) {
	        var composites = [].concat(composite.composites);
	
	        for (var i = 0; i < composite.composites.length; i++)
	            composites = composites.concat(Composite.allComposites(composite.composites[i]));
	
	        return composites;
	    };
	
	    /**
	     * Searches the composite recursively for an object matching the type and id supplied, null if not found
	     * @method get
	     * @param {composite} composite
	     * @param {number} id
	     * @param {string} type
	     * @return {object} The requested object, if found
	     */
	    Composite.get = function(composite, id, type) {
	        var objects,
	            object;
	
	        switch (type) {
	        case 'body':
	            objects = Composite.allBodies(composite);
	            break;
	        case 'constraint':
	            objects = Composite.allConstraints(composite);
	            break;
	        case 'composite':
	            objects = Composite.allComposites(composite).concat(composite);
	            break;
	        }
	
	        if (!objects)
	            return null;
	
	        object = objects.filter(function(object) { 
	            return object.id.toString() === id.toString(); 
	        });
	
	        return object.length === 0 ? null : object[0];
	    };
	
	    /**
	     * Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add)
	     * @method move
	     * @param {compositeA} compositeA
	     * @param {object[]} objects
	     * @param {compositeB} compositeB
	     * @return {composite} Returns compositeA
	     */
	    Composite.move = function(compositeA, objects, compositeB) {
	        Composite.remove(compositeA, objects);
	        Composite.add(compositeB, objects);
	        return compositeA;
	    };
	
	    /**
	     * Assigns new ids for all objects in the composite, recursively
	     * @method rebase
	     * @param {composite} composite
	     * @return {composite} Returns composite
	     */
	    Composite.rebase = function(composite) {
	        var objects = Composite.allBodies(composite)
	                        .concat(Composite.allConstraints(composite))
	                        .concat(Composite.allComposites(composite));
	
	        for (var i = 0; i < objects.length; i++) {
	            objects[i].id = Common.nextId();
	        }
	
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /**
	     * Translates all children in the composite by a given vector relative to their current positions, 
	     * without imparting any velocity.
	     * @method translate
	     * @param {composite} composite
	     * @param {vector} translation
	     * @param {bool} [recursive=true]
	     */
	    Composite.translate = function(composite, translation, recursive) {
	        var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
	
	        for (var i = 0; i < bodies.length; i++) {
	            Body.translate(bodies[i], translation);
	        }
	
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /**
	     * Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
	     * @method rotate
	     * @param {composite} composite
	     * @param {number} rotation
	     * @param {vector} point
	     * @param {bool} [recursive=true]
	     */
	    Composite.rotate = function(composite, rotation, point, recursive) {
	        var cos = Math.cos(rotation),
	            sin = Math.sin(rotation),
	            bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                dx = body.position.x - point.x,
	                dy = body.position.y - point.y;
	                
	            Body.setPosition(body, {
	                x: point.x + (dx * cos - dy * sin),
	                y: point.y + (dx * sin + dy * cos)
	            });
	
	            Body.rotate(body, rotation);
	        }
	
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /**
	     * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
	     * @method scale
	     * @param {composite} composite
	     * @param {number} scaleX
	     * @param {number} scaleY
	     * @param {vector} point
	     * @param {bool} [recursive=true]
	     */
	    Composite.scale = function(composite, scaleX, scaleY, point, recursive) {
	        var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                dx = body.position.x - point.x,
	                dy = body.position.y - point.y;
	                
	            Body.setPosition(body, {
	                x: point.x + dx * scaleX,
	                y: point.y + dy * scaleY
	            });
	
	            Body.scale(body, scaleX, scaleY);
	        }
	
	        Composite.setModified(composite, true, true, false);
	
	        return composite;
	    };
	
	    /*
	    *
	    *  Events Documentation
	    *
	    */
	
	    /**
	    * Fired when a call to `Composite.add` is made, before objects have been added.
	    *
	    * @event beforeAdd
	    * @param {} event An event object
	    * @param {} event.object The object(s) to be added (may be a single body, constraint, composite or a mixed array of these)
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when a call to `Composite.add` is made, after objects have been added.
	    *
	    * @event afterAdd
	    * @param {} event An event object
	    * @param {} event.object The object(s) that have been added (may be a single body, constraint, composite or a mixed array of these)
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when a call to `Composite.remove` is made, before objects have been removed.
	    *
	    * @event beforeRemove
	    * @param {} event An event object
	    * @param {} event.object The object(s) to be removed (may be a single body, constraint, composite or a mixed array of these)
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when a call to `Composite.remove` is made, after objects have been removed.
	    *
	    * @event afterRemove
	    * @param {} event An event object
	    * @param {} event.object The object(s) that have been removed (may be a single body, constraint, composite or a mixed array of these)
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
	     *
	     * @property id
	     * @type number
	     */
	
	    /**
	     * A `String` denoting the type of object.
	     *
	     * @property type
	     * @type string
	     * @default "composite"
	     */
	
	    /**
	     * An arbitrary `String` name to help the user identify and manage composites.
	     *
	     * @property label
	     * @type string
	     * @default "Composite"
	     */
	
	    /**
	     * A flag that specifies whether the composite has been modified during the current step.
	     * Most `Matter.Composite` methods will automatically set this flag to `true` to inform the engine of changes to be handled.
	     * If you need to change it manually, you should use the `Composite.setModified` method.
	     *
	     * @property isModified
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * The `Composite` that is the parent of this composite. It is automatically managed by the `Matter.Composite` methods.
	     *
	     * @property parent
	     * @type composite
	     * @default null
	     */
	
	    /**
	     * An array of `Body` that are _direct_ children of this composite.
	     * To add or remove bodies you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
	     * If you wish to recursively find all descendants, you should use the `Composite.allBodies` method.
	     *
	     * @property bodies
	     * @type body[]
	     * @default []
	     */
	
	    /**
	     * An array of `Constraint` that are _direct_ children of this composite.
	     * To add or remove constraints you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
	     * If you wish to recursively find all descendants, you should use the `Composite.allConstraints` method.
	     *
	     * @property constraints
	     * @type constraint[]
	     * @default []
	     */
	
	    /**
	     * An array of `Composite` that are _direct_ children of this composite.
	     * To add or remove composites you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
	     * If you wish to recursively find all descendants, you should use the `Composite.allComposites` method.
	     *
	     * @property composites
	     * @type composite[]
	     * @default []
	     */
	
	})();
	
	},{"../core/Common":14,"../core/Events":16,"./Body":1}],3:[function(require,module,exports){
	/**
	* The `Matter.World` module contains methods for creating and manipulating the world composite.
	* A `Matter.World` is a `Matter.Composite` body, which is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite`.
	* A `Matter.World` has a few additional properties including `gravity` and `bounds`.
	* It is important to use the functions in the `Matter.Composite` module to modify the world composite, rather than directly modifying its properties.
	* There are also a few methods here that alias those in `Matter.Composite` for easier readability.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class World
	* @extends Composite
	*/
	
	var World = {};
	
	module.exports = World;
	
	var Composite = require('./Composite');
	var Constraint = require('../constraint/Constraint');
	var Common = require('../core/Common');
	
	(function() {
	
	    /**
	     * Creates a new world composite. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @constructor
	     * @param {} options
	     * @return {world} A new world
	     */
	    World.create = function(options) {
	        var composite = Composite.create();
	
	        var defaults = {
	            label: 'World',
	            gravity: { x: 0, y: 1 },
	            bounds: { 
	                min: { x: -Infinity, y: -Infinity }, 
	                max: { x: Infinity, y: Infinity } 
	            }
	        };
	        
	        return Common.extend(composite, defaults, options);
	    };
	
	    // World is a Composite body
	    // see src/module/Outro.js for these aliases:
	    
	    /**
	     * An alias for Composite.clear since World is also a Composite
	     * @method clear
	     * @param {world} world
	     * @param {boolean} keepStatic
	     */
	
	    /**
	     * An alias for Composite.add since World is also a Composite
	     * @method addComposite
	     * @param {world} world
	     * @param {composite} composite
	     * @return {world} The original world with the objects from composite added
	     */
	    
	     /**
	      * An alias for Composite.addBody since World is also a Composite
	      * @method addBody
	      * @param {world} world
	      * @param {body} body
	      * @return {world} The original world with the body added
	      */
	
	     /**
	      * An alias for Composite.addConstraint since World is also a Composite
	      * @method addConstraint
	      * @param {world} world
	      * @param {constraint} constraint
	      * @return {world} The original world with the constraint added
	      */
	
	})();
	
	},{"../constraint/Constraint":12,"../core/Common":14,"./Composite":2}],4:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Contact
	*/
	
	var Contact = {};
	
	module.exports = Contact;
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @param {vertex} vertex
	     * @return {contact} A new contact
	     */
	    Contact.create = function(vertex) {
	        return {
	            id: Contact.id(vertex),
	            vertex: vertex,
	            normalImpulse: 0,
	            tangentImpulse: 0
	        };
	    };
	    
	    /**
	     * Description
	     * @method id
	     * @param {vertex} vertex
	     * @return {string} Unique contactID
	     */
	    Contact.id = function(vertex) {
	        return vertex.body.id + '_' + vertex.index;
	    };
	
	})();
	
	},{}],5:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Detector
	*/
	
	// TODO: speculative contacts
	
	var Detector = {};
	
	module.exports = Detector;
	
	var SAT = require('./SAT');
	var Pair = require('./Pair');
	var Bounds = require('../geometry/Bounds');
	
	(function() {
	
	    /**
	     * Description
	     * @method collisions
	     * @param {pair[]} broadphasePairs
	     * @param {engine} engine
	     * @return {array} collisions
	     */
	    Detector.collisions = function(broadphasePairs, engine) {
	        var collisions = [],
	            pairsTable = engine.pairs.table;
	
	        
	        for (var i = 0; i < broadphasePairs.length; i++) {
	            var bodyA = broadphasePairs[i][0], 
	                bodyB = broadphasePairs[i][1];
	
	            if ((bodyA.isStatic || bodyA.isSleeping) && (bodyB.isStatic || bodyB.isSleeping))
	                continue;
	            
	            if (!Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter))
	                continue;
	
	
	            // mid phase
	            if (Bounds.overlaps(bodyA.bounds, bodyB.bounds)) {
	                for (var j = bodyA.parts.length > 1 ? 1 : 0; j < bodyA.parts.length; j++) {
	                    var partA = bodyA.parts[j];
	
	                    for (var k = bodyB.parts.length > 1 ? 1 : 0; k < bodyB.parts.length; k++) {
	                        var partB = bodyB.parts[k];
	
	                        if ((partA === bodyA && partB === bodyB) || Bounds.overlaps(partA.bounds, partB.bounds)) {
	                            // find a previous collision we could reuse
	                            var pairId = Pair.id(partA, partB),
	                                pair = pairsTable[pairId],
	                                previousCollision;
	
	                            if (pair && pair.isActive) {
	                                previousCollision = pair.collision;
	                            } else {
	                                previousCollision = null;
	                            }
	
	                            // narrow phase
	                            var collision = SAT.collides(partA, partB, previousCollision);
	
	
	                            if (collision.collided) {
	                                collisions.push(collision);
	                            }
	                        }
	                    }
	                }
	            }
	        }
	
	        return collisions;
	    };
	
	    /**
	     * Description
	     * @method bruteForce
	     * @param {body[]} bodies
	     * @param {engine} engine
	     * @return {array} collisions
	     */
	    Detector.bruteForce = function(bodies, engine) {
	        var collisions = [],
	            pairsTable = engine.pairs.table;
	
	
	        for (var i = 0; i < bodies.length; i++) {
	            for (var j = i + 1; j < bodies.length; j++) {
	                var bodyA = bodies[i], 
	                    bodyB = bodies[j];
	
	                // NOTE: could share a function for the below, but may drop performance?
	
	                if ((bodyA.isStatic || bodyA.isSleeping) && (bodyB.isStatic || bodyB.isSleeping))
	                    continue;
	                
	                if (!Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter))
	                    continue;
	
	
	                // mid phase
	                if (Bounds.overlaps(bodyA.bounds, bodyB.bounds)) {
	
	                    // find a previous collision we could reuse
	                    var pairId = Pair.id(bodyA, bodyB),
	                        pair = pairsTable[pairId],
	                        previousCollision;
	
	                    if (pair && pair.isActive) {
	                        previousCollision = pair.collision;
	                    } else {
	                        previousCollision = null;
	                    }
	
	                    // narrow phase
	                    var collision = SAT.collides(bodyA, bodyB, previousCollision);
	
	
	                    if (collision.collided) {
	                        collisions.push(collision);
	                    }
	                }
	            }
	        }
	
	        return collisions;
	    };
	
	    /**
	     * Returns `true` if both supplied collision filters will allow a collision to occur.
	     * See `body.collisionFilter` for more information.
	     * @method canCollide
	     * @param {} filterA
	     * @param {} filterB
	     * @return {bool} `true` if collision can occur
	     */
	    Detector.canCollide = function(filterA, filterB) {
	        if (filterA.group === filterB.group && filterA.group !== 0)
	            return filterA.group > 0;
	
	        return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
	    };
	
	})();
	
	},{"../geometry/Bounds":24,"./Pair":7,"./SAT":11}],6:[function(require,module,exports){
	/**
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Grid
	*/
	
	var Grid = {};
	
	module.exports = Grid;
	
	var Pair = require('./Pair');
	var Detector = require('./Detector');
	var Common = require('../core/Common');
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @param {} options
	     * @return {grid} A new grid
	     */
	    Grid.create = function(options) {
	        var defaults = {
	            controller: Grid,
	            detector: Detector.collisions,
	            buckets: {},
	            pairs: {},
	            pairsList: [],
	            bucketWidth: 48,
	            bucketHeight: 48
	        };
	
	        return Common.extend(defaults, options);
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {grid} grid
	     * @param {body[]} bodies
	     * @param {engine} engine
	     * @param {boolean} forceUpdate
	     */
	    Grid.update = function(grid, bodies, engine, forceUpdate) {
	        var i, col, row,
	            world = engine.world,
	            buckets = grid.buckets,
	            bucket,
	            bucketId,
	            gridChanged = false;
	
	
	        for (i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.isSleeping && !forceUpdate)
	                continue;
	
	            // don't update out of world bodies
	            if (body.bounds.max.x < 0 || body.bounds.min.x > world.bounds.width
	                || body.bounds.max.y < 0 || body.bounds.min.y > world.bounds.height)
	                continue;
	
	            var newRegion = _getRegion(grid, body);
	
	            // if the body has changed grid region
	            if (!body.region || newRegion.id !== body.region.id || forceUpdate) {
	
	
	                if (!body.region || forceUpdate)
	                    body.region = newRegion;
	
	                var union = _regionUnion(newRegion, body.region);
	
	                // update grid buckets affected by region change
	                // iterate over the union of both regions
	                for (col = union.startCol; col <= union.endCol; col++) {
	                    for (row = union.startRow; row <= union.endRow; row++) {
	                        bucketId = _getBucketId(col, row);
	                        bucket = buckets[bucketId];
	
	                        var isInsideNewRegion = (col >= newRegion.startCol && col <= newRegion.endCol
	                                                && row >= newRegion.startRow && row <= newRegion.endRow);
	
	                        var isInsideOldRegion = (col >= body.region.startCol && col <= body.region.endCol
	                                                && row >= body.region.startRow && row <= body.region.endRow);
	
	                        // remove from old region buckets
	                        if (!isInsideNewRegion && isInsideOldRegion) {
	                            if (isInsideOldRegion) {
	                                if (bucket)
	                                    _bucketRemoveBody(grid, bucket, body);
	                            }
	                        }
	
	                        // add to new region buckets
	                        if (body.region === newRegion || (isInsideNewRegion && !isInsideOldRegion) || forceUpdate) {
	                            if (!bucket)
	                                bucket = _createBucket(buckets, bucketId);
	                            _bucketAddBody(grid, bucket, body);
	                        }
	                    }
	                }
	
	                // set the new region
	                body.region = newRegion;
	
	                // flag changes so we can update pairs
	                gridChanged = true;
	            }
	        }
	
	        // update pairs list only if pairs changed (i.e. a body changed region)
	        if (gridChanged)
	            grid.pairsList = _createActivePairsList(grid);
	    };
	
	    /**
	     * Description
	     * @method clear
	     * @param {grid} grid
	     */
	    Grid.clear = function(grid) {
	        grid.buckets = {};
	        grid.pairs = {};
	        grid.pairsList = [];
	    };
	
	    /**
	     * Description
	     * @method _regionUnion
	     * @private
	     * @param {} regionA
	     * @param {} regionB
	     * @return CallExpression
	     */
	    var _regionUnion = function(regionA, regionB) {
	        var startCol = Math.min(regionA.startCol, regionB.startCol),
	            endCol = Math.max(regionA.endCol, regionB.endCol),
	            startRow = Math.min(regionA.startRow, regionB.startRow),
	            endRow = Math.max(regionA.endRow, regionB.endRow);
	
	        return _createRegion(startCol, endCol, startRow, endRow);
	    };
	
	    /**
	     * Description
	     * @method _getRegion
	     * @private
	     * @param {} grid
	     * @param {} body
	     * @return CallExpression
	     */
	    var _getRegion = function(grid, body) {
	        var bounds = body.bounds,
	            startCol = Math.floor(bounds.min.x / grid.bucketWidth),
	            endCol = Math.floor(bounds.max.x / grid.bucketWidth),
	            startRow = Math.floor(bounds.min.y / grid.bucketHeight),
	            endRow = Math.floor(bounds.max.y / grid.bucketHeight);
	
	        return _createRegion(startCol, endCol, startRow, endRow);
	    };
	
	    /**
	     * Description
	     * @method _createRegion
	     * @private
	     * @param {} startCol
	     * @param {} endCol
	     * @param {} startRow
	     * @param {} endRow
	     * @return ObjectExpression
	     */
	    var _createRegion = function(startCol, endCol, startRow, endRow) {
	        return { 
	            id: startCol + ',' + endCol + ',' + startRow + ',' + endRow,
	            startCol: startCol, 
	            endCol: endCol, 
	            startRow: startRow, 
	            endRow: endRow 
	        };
	    };
	
	    /**
	     * Description
	     * @method _getBucketId
	     * @private
	     * @param {} column
	     * @param {} row
	     * @return BinaryExpression
	     */
	    var _getBucketId = function(column, row) {
	        return column + ',' + row;
	    };
	
	    /**
	     * Description
	     * @method _createBucket
	     * @private
	     * @param {} buckets
	     * @param {} bucketId
	     * @return bucket
	     */
	    var _createBucket = function(buckets, bucketId) {
	        var bucket = buckets[bucketId] = [];
	        return bucket;
	    };
	
	    /**
	     * Description
	     * @method _bucketAddBody
	     * @private
	     * @param {} grid
	     * @param {} bucket
	     * @param {} body
	     */
	    var _bucketAddBody = function(grid, bucket, body) {
	        // add new pairs
	        for (var i = 0; i < bucket.length; i++) {
	            var bodyB = bucket[i];
	
	            if (body.id === bodyB.id || (body.isStatic && bodyB.isStatic))
	                continue;
	
	            // keep track of the number of buckets the pair exists in
	            // important for Grid.update to work
	            var pairId = Pair.id(body, bodyB),
	                pair = grid.pairs[pairId];
	
	            if (pair) {
	                pair[2] += 1;
	            } else {
	                grid.pairs[pairId] = [body, bodyB, 1];
	            }
	        }
	
	        // add to bodies (after pairs, otherwise pairs with self)
	        bucket.push(body);
	    };
	
	    /**
	     * Description
	     * @method _bucketRemoveBody
	     * @private
	     * @param {} grid
	     * @param {} bucket
	     * @param {} body
	     */
	    var _bucketRemoveBody = function(grid, bucket, body) {
	        // remove from bucket
	        bucket.splice(Common.indexOf(bucket, body), 1);
	
	        // update pair counts
	        for (var i = 0; i < bucket.length; i++) {
	            // keep track of the number of buckets the pair exists in
	            // important for _createActivePairsList to work
	            var bodyB = bucket[i],
	                pairId = Pair.id(body, bodyB),
	                pair = grid.pairs[pairId];
	
	            if (pair)
	                pair[2] -= 1;
	        }
	    };
	
	    /**
	     * Description
	     * @method _createActivePairsList
	     * @private
	     * @param {} grid
	     * @return pairs
	     */
	    var _createActivePairsList = function(grid) {
	        var pairKeys,
	            pair,
	            pairs = [];
	
	        // grid.pairs is used as a hashmap
	        pairKeys = Common.keys(grid.pairs);
	
	        // iterate over grid.pairs
	        for (var k = 0; k < pairKeys.length; k++) {
	            pair = grid.pairs[pairKeys[k]];
	
	            // if pair exists in at least one bucket
	            // it is a pair that needs further collision testing so push it
	            if (pair[2] > 0) {
	                pairs.push(pair);
	            } else {
	                delete grid.pairs[pairKeys[k]];
	            }
	        }
	
	        return pairs;
	    };
	    
	})();
	},{"../core/Common":14,"./Detector":5,"./Pair":7}],7:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Pair
	*/
	
	var Pair = {};
	
	module.exports = Pair;
	
	var Contact = require('./Contact');
	
	(function() {
	    
	    /**
	     * Description
	     * @method create
	     * @param {collision} collision
	     * @param {number} timestamp
	     * @return {pair} A new pair
	     */
	    Pair.create = function(collision, timestamp) {
	        var bodyA = collision.bodyA,
	            bodyB = collision.bodyB,
	            parentA = collision.parentA,
	            parentB = collision.parentB;
	
	        var pair = {
	            id: Pair.id(bodyA, bodyB),
	            bodyA: bodyA,
	            bodyB: bodyB,
	            contacts: {},
	            activeContacts: [],
	            separation: 0,
	            isActive: true,
	            timeCreated: timestamp,
	            timeUpdated: timestamp,
	            inverseMass: parentA.inverseMass + parentB.inverseMass,
	            friction: Math.min(parentA.friction, parentB.friction),
	            frictionStatic: Math.max(parentA.frictionStatic, parentB.frictionStatic),
	            restitution: Math.max(parentA.restitution, parentB.restitution),
	            slop: Math.max(parentA.slop, parentB.slop)
	        };
	
	        Pair.update(pair, collision, timestamp);
	
	        return pair;
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {pair} pair
	     * @param {collision} collision
	     * @param {number} timestamp
	     */
	    Pair.update = function(pair, collision, timestamp) {
	        var contacts = pair.contacts,
	            supports = collision.supports,
	            activeContacts = pair.activeContacts,
	            parentA = collision.parentA,
	            parentB = collision.parentB;
	        
	        pair.collision = collision;
	        pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
	        pair.friction = Math.min(parentA.friction, parentB.friction);
	        pair.frictionStatic = Math.max(parentA.frictionStatic, parentB.frictionStatic);
	        pair.restitution = Math.max(parentA.restitution, parentB.restitution);
	        pair.slop = Math.max(parentA.slop, parentB.slop);
	        activeContacts.length = 0;
	        
	        if (collision.collided) {
	            for (var i = 0; i < supports.length; i++) {
	                var support = supports[i],
	                    contactId = Contact.id(support),
	                    contact = contacts[contactId];
	
	                if (contact) {
	                    activeContacts.push(contact);
	                } else {
	                    activeContacts.push(contacts[contactId] = Contact.create(support));
	                }
	            }
	
	            pair.separation = collision.depth;
	            Pair.setActive(pair, true, timestamp);
	        } else {
	            if (pair.isActive === true)
	                Pair.setActive(pair, false, timestamp);
	        }
	    };
	    
	    /**
	     * Description
	     * @method setActive
	     * @param {pair} pair
	     * @param {bool} isActive
	     * @param {number} timestamp
	     */
	    Pair.setActive = function(pair, isActive, timestamp) {
	        if (isActive) {
	            pair.isActive = true;
	            pair.timeUpdated = timestamp;
	        } else {
	            pair.isActive = false;
	            pair.activeContacts.length = 0;
	        }
	    };
	
	    /**
	     * Description
	     * @method id
	     * @param {body} bodyA
	     * @param {body} bodyB
	     * @return {string} Unique pairId
	     */
	    Pair.id = function(bodyA, bodyB) {
	        if (bodyA.id < bodyB.id) {
	            return bodyA.id + '_' + bodyB.id;
	        } else {
	            return bodyB.id + '_' + bodyA.id;
	        }
	    };
	
	})();
	
	},{"./Contact":4}],8:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Pairs
	*/
	
	var Pairs = {};
	
	module.exports = Pairs;
	
	var Pair = require('./Pair');
	var Common = require('../core/Common');
	
	(function() {
	    
	    var _pairMaxIdleLife = 1000;
	
	    /**
	     * Creates a new pairs structure
	     * @method create
	     * @param {object} options
	     * @return {pairs} A new pairs structure
	     */
	    Pairs.create = function(options) {
	        return Common.extend({ 
	            table: {},
	            list: [],
	            collisionStart: [],
	            collisionActive: [],
	            collisionEnd: []
	        }, options);
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {object} pairs
	     * @param {collision[]} collisions
	     * @param {number} timestamp
	     */
	    Pairs.update = function(pairs, collisions, timestamp) {
	        var pairsList = pairs.list,
	            pairsTable = pairs.table,
	            collisionStart = pairs.collisionStart,
	            collisionEnd = pairs.collisionEnd,
	            collisionActive = pairs.collisionActive,
	            activePairIds = [],
	            collision,
	            pairId,
	            pair,
	            i;
	
	        // clear collision state arrays, but maintain old reference
	        collisionStart.length = 0;
	        collisionEnd.length = 0;
	        collisionActive.length = 0;
	
	        for (i = 0; i < collisions.length; i++) {
	            collision = collisions[i];
	
	            if (collision.collided) {
	                pairId = Pair.id(collision.bodyA, collision.bodyB);
	                activePairIds.push(pairId);
	
	                pair = pairsTable[pairId];
	                
	                if (pair) {
	                    // pair already exists (but may or may not be active)
	                    if (pair.isActive) {
	                        // pair exists and is active
	                        collisionActive.push(pair);
	                    } else {
	                        // pair exists but was inactive, so a collision has just started again
	                        collisionStart.push(pair);
	                    }
	
	                    // update the pair
	                    Pair.update(pair, collision, timestamp);
	                } else {
	                    // pair did not exist, create a new pair
	                    pair = Pair.create(collision, timestamp);
	                    pairsTable[pairId] = pair;
	
	                    // push the new pair
	                    collisionStart.push(pair);
	                    pairsList.push(pair);
	                }
	            }
	        }
	
	        // deactivate previously active pairs that are now inactive
	        for (i = 0; i < pairsList.length; i++) {
	            pair = pairsList[i];
	            if (pair.isActive && Common.indexOf(activePairIds, pair.id) === -1) {
	                Pair.setActive(pair, false, timestamp);
	                collisionEnd.push(pair);
	            }
	        }
	    };
	    
	    /**
	     * Description
	     * @method removeOld
	     * @param {object} pairs
	     * @param {number} timestamp
	     */
	    Pairs.removeOld = function(pairs, timestamp) {
	        var pairsList = pairs.list,
	            pairsTable = pairs.table,
	            indexesToRemove = [],
	            pair,
	            collision,
	            pairIndex,
	            i;
	
	        for (i = 0; i < pairsList.length; i++) {
	            pair = pairsList[i];
	            collision = pair.collision;
	            
	            // never remove sleeping pairs
	            if (collision.bodyA.isSleeping || collision.bodyB.isSleeping) {
	                pair.timeUpdated = timestamp;
	                continue;
	            }
	
	            // if pair is inactive for too long, mark it to be removed
	            if (timestamp - pair.timeUpdated > _pairMaxIdleLife) {
	                indexesToRemove.push(i);
	            }
	        }
	
	        // remove marked pairs
	        for (i = 0; i < indexesToRemove.length; i++) {
	            pairIndex = indexesToRemove[i] - i;
	            pair = pairsList[pairIndex];
	            delete pairsTable[pair.id];
	            pairsList.splice(pairIndex, 1);
	        }
	    };
	
	    /**
	     * Clears the given pairs structure
	     * @method clear
	     * @param {pairs} pairs
	     * @return {pairs} pairs
	     */
	    Pairs.clear = function(pairs) {
	        pairs.table = {};
	        pairs.list.length = 0;
	        pairs.collisionStart.length = 0;
	        pairs.collisionActive.length = 0;
	        pairs.collisionEnd.length = 0;
	        return pairs;
	    };
	
	})();
	
	},{"../core/Common":14,"./Pair":7}],9:[function(require,module,exports){
	/**
	* The `Matter.Query` module contains methods for performing collision queries.
	*
	* @class Query
	*/
	
	var Query = {};
	
	module.exports = Query;
	
	var Vector = require('../geometry/Vector');
	var SAT = require('./SAT');
	var Bounds = require('../geometry/Bounds');
	var Bodies = require('../factory/Bodies');
	var Vertices = require('../geometry/Vertices');
	
	(function() {
	
	    /**
	     * Casts a ray segment against a set of bodies and returns all collisions, ray width is optional. Intersection points are not provided.
	     * @method ray
	     * @param {body[]} bodies
	     * @param {vector} startPoint
	     * @param {vector} endPoint
	     * @param {number} [rayWidth]
	     * @return {object[]} Collisions
	     */
	    Query.ray = function(bodies, startPoint, endPoint, rayWidth) {
	        rayWidth = rayWidth || 1e-100;
	
	        var rayAngle = Vector.angle(startPoint, endPoint),
	            rayLength = Vector.magnitude(Vector.sub(startPoint, endPoint)),
	            rayX = (endPoint.x + startPoint.x) * 0.5,
	            rayY = (endPoint.y + startPoint.y) * 0.5,
	            ray = Bodies.rectangle(rayX, rayY, rayLength, rayWidth, { angle: rayAngle }),
	            collisions = [];
	
	        for (var i = 0; i < bodies.length; i++) {
	            var bodyA = bodies[i];
	            
	            if (Bounds.overlaps(bodyA.bounds, ray.bounds)) {
	                for (var j = bodyA.parts.length === 1 ? 0 : 1; j < bodyA.parts.length; j++) {
	                    var part = bodyA.parts[j];
	
	                    if (Bounds.overlaps(part.bounds, ray.bounds)) {
	                        var collision = SAT.collides(part, ray);
	                        if (collision.collided) {
	                            collision.body = collision.bodyA = collision.bodyB = bodyA;
	                            collisions.push(collision);
	                            break;
	                        }
	                    }
	                }
	            }
	        }
	
	        return collisions;
	    };
	
	    /**
	     * Returns all bodies whose bounds are inside (or outside if set) the given set of bounds, from the given set of bodies.
	     * @method region
	     * @param {body[]} bodies
	     * @param {bounds} bounds
	     * @param {bool} [outside=false]
	     * @return {body[]} The bodies matching the query
	     */
	    Query.region = function(bodies, bounds, outside) {
	        var result = [];
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                overlaps = Bounds.overlaps(body.bounds, bounds);
	            if ((overlaps && !outside) || (!overlaps && outside))
	                result.push(body);
	        }
	
	        return result;
	    };
	
	    /**
	     * Returns all bodies whose vertices contain the given point, from the given set of bodies.
	     * @method point
	     * @param {body[]} bodies
	     * @param {vector} point
	     * @return {body[]} The bodies matching the query
	     */
	    Query.point = function(bodies, point) {
	        var result = [];
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	            
	            if (Bounds.contains(body.bounds, point)) {
	                for (var j = body.parts.length === 1 ? 0 : 1; j < body.parts.length; j++) {
	                    var part = body.parts[j];
	
	                    if (Bounds.contains(part.bounds, point)
	                        && Vertices.contains(part.vertices, point)) {
	                        result.push(body);
	                        break;
	                    }
	                }
	            }
	        }
	
	        return result;
	    };
	
	})();
	},{"../factory/Bodies":21,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27,"./SAT":11}],10:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Resolver
	*/
	
	var Resolver = {};
	
	module.exports = Resolver;
	
	var Vertices = require('../geometry/Vertices');
	var Vector = require('../geometry/Vector');
	var Common = require('../core/Common');
	var Bounds = require('../geometry/Bounds');
	
	(function() {
	
	    Resolver._restingThresh = 4;
	    Resolver._positionDampen = 0.9;
	    Resolver._positionWarming = 0.8;
	    Resolver._frictionNormalMultiplier = 5;
	
	    /**
	     * Description
	     * @method preSolvePosition
	     * @param {pair[]} pairs
	     */
	    Resolver.preSolvePosition = function(pairs) {
	        var i,
	            pair,
	            activeCount;
	
	        // find total contacts on each body
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	            
	            if (!pair.isActive)
	                continue;
	            
	            activeCount = pair.activeContacts.length;
	            pair.collision.parentA.totalContacts += activeCount;
	            pair.collision.parentB.totalContacts += activeCount;
	        }
	    };
	
	    /**
	     * Description
	     * @method solvePosition
	     * @param {pair[]} pairs
	     * @param {number} timeScale
	     */
	    Resolver.solvePosition = function(pairs, timeScale) {
	        var i,
	            pair,
	            collision,
	            bodyA,
	            bodyB,
	            normal,
	            bodyBtoA,
	            contactShare,
	            positionImpulse,
	            contactCount = {},
	            tempA = Vector._temp[0],
	            tempB = Vector._temp[1],
	            tempC = Vector._temp[2],
	            tempD = Vector._temp[3];
	
	        // find impulses required to resolve penetration
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	            
	            if (!pair.isActive)
	                continue;
	            
	            collision = pair.collision;
	            bodyA = collision.parentA;
	            bodyB = collision.parentB;
	            normal = collision.normal;
	
	            // get current separation between body edges involved in collision
	            bodyBtoA = Vector.sub(Vector.add(bodyB.positionImpulse, bodyB.position, tempA), 
	                                    Vector.add(bodyA.positionImpulse, 
	                                        Vector.sub(bodyB.position, collision.penetration, tempB), tempC), tempD);
	
	            pair.separation = Vector.dot(normal, bodyBtoA);
	        }
	        
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	
	            if (!pair.isActive || pair.separation < 0)
	                continue;
	            
	            collision = pair.collision;
	            bodyA = collision.parentA;
	            bodyB = collision.parentB;
	            normal = collision.normal;
	            positionImpulse = (pair.separation - pair.slop) * timeScale;
	        
	            if (bodyA.isStatic || bodyB.isStatic)
	                positionImpulse *= 2;
	            
	            if (!(bodyA.isStatic || bodyA.isSleeping)) {
	                contactShare = Resolver._positionDampen / bodyA.totalContacts;
	                bodyA.positionImpulse.x += normal.x * positionImpulse * contactShare;
	                bodyA.positionImpulse.y += normal.y * positionImpulse * contactShare;
	            }
	
	            if (!(bodyB.isStatic || bodyB.isSleeping)) {
	                contactShare = Resolver._positionDampen / bodyB.totalContacts;
	                bodyB.positionImpulse.x -= normal.x * positionImpulse * contactShare;
	                bodyB.positionImpulse.y -= normal.y * positionImpulse * contactShare;
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method postSolvePosition
	     * @param {body[]} bodies
	     */
	    Resolver.postSolvePosition = function(bodies) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            // reset contact count
	            body.totalContacts = 0;
	
	            if (body.positionImpulse.x !== 0 || body.positionImpulse.y !== 0) {
	                // update body geometry
	                for (var j = 0; j < body.parts.length; j++) {
	                    var part = body.parts[j];
	                    Vertices.translate(part.vertices, body.positionImpulse);
	                    Bounds.update(part.bounds, part.vertices, body.velocity);
	                    part.position.x += body.positionImpulse.x;
	                    part.position.y += body.positionImpulse.y;
	                }
	
	                // move the body without changing velocity
	                body.positionPrev.x += body.positionImpulse.x;
	                body.positionPrev.y += body.positionImpulse.y;
	
	                if (Vector.dot(body.positionImpulse, body.velocity) < 0) {
	                    // reset cached impulse if the body has velocity along it
	                    body.positionImpulse.x = 0;
	                    body.positionImpulse.y = 0;
	                } else {
	                    // warm the next iteration
	                    body.positionImpulse.x *= Resolver._positionWarming;
	                    body.positionImpulse.y *= Resolver._positionWarming;
	                }
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method preSolveVelocity
	     * @param {pair[]} pairs
	     */
	    Resolver.preSolveVelocity = function(pairs) {
	        var i,
	            j,
	            pair,
	            contacts,
	            collision,
	            bodyA,
	            bodyB,
	            normal,
	            tangent,
	            contact,
	            contactVertex,
	            normalImpulse,
	            tangentImpulse,
	            offset,
	            impulse = Vector._temp[0],
	            tempA = Vector._temp[1];
	        
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	            
	            if (!pair.isActive)
	                continue;
	            
	            contacts = pair.activeContacts;
	            collision = pair.collision;
	            bodyA = collision.parentA;
	            bodyB = collision.parentB;
	            normal = collision.normal;
	            tangent = collision.tangent;
	                
	            // resolve each contact
	            for (j = 0; j < contacts.length; j++) {
	                contact = contacts[j];
	                contactVertex = contact.vertex;
	                normalImpulse = contact.normalImpulse;
	                tangentImpulse = contact.tangentImpulse;
	
	                if (normalImpulse !== 0 || tangentImpulse !== 0) {
	                    // total impulse from contact
	                    impulse.x = (normal.x * normalImpulse) + (tangent.x * tangentImpulse);
	                    impulse.y = (normal.y * normalImpulse) + (tangent.y * tangentImpulse);
	                    
	                    // apply impulse from contact
	                    if (!(bodyA.isStatic || bodyA.isSleeping)) {
	                        offset = Vector.sub(contactVertex, bodyA.position, tempA);
	                        bodyA.positionPrev.x += impulse.x * bodyA.inverseMass;
	                        bodyA.positionPrev.y += impulse.y * bodyA.inverseMass;
	                        bodyA.anglePrev += Vector.cross(offset, impulse) * bodyA.inverseInertia;
	                    }
	
	                    if (!(bodyB.isStatic || bodyB.isSleeping)) {
	                        offset = Vector.sub(contactVertex, bodyB.position, tempA);
	                        bodyB.positionPrev.x -= impulse.x * bodyB.inverseMass;
	                        bodyB.positionPrev.y -= impulse.y * bodyB.inverseMass;
	                        bodyB.anglePrev -= Vector.cross(offset, impulse) * bodyB.inverseInertia;
	                    }
	                }
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method solveVelocity
	     * @param {pair[]} pairs
	     * @param {number} timeScale
	     */
	    Resolver.solveVelocity = function(pairs, timeScale) {
	        var timeScaleSquared = timeScale * timeScale,
	            impulse = Vector._temp[0],
	            tempA = Vector._temp[1],
	            tempB = Vector._temp[2],
	            tempC = Vector._temp[3],
	            tempD = Vector._temp[4],
	            tempE = Vector._temp[5];
	        
	        for (var i = 0; i < pairs.length; i++) {
	            var pair = pairs[i];
	            
	            if (!pair.isActive)
	                continue;
	            
	            var collision = pair.collision,
	                bodyA = collision.parentA,
	                bodyB = collision.parentB,
	                normal = collision.normal,
	                tangent = collision.tangent,
	                contacts = pair.activeContacts,
	                contactShare = 1 / contacts.length;
	
	            // update body velocities
	            bodyA.velocity.x = bodyA.position.x - bodyA.positionPrev.x;
	            bodyA.velocity.y = bodyA.position.y - bodyA.positionPrev.y;
	            bodyB.velocity.x = bodyB.position.x - bodyB.positionPrev.x;
	            bodyB.velocity.y = bodyB.position.y - bodyB.positionPrev.y;
	            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
	            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
	
	            // resolve each contact
	            for (var j = 0; j < contacts.length; j++) {
	                var contact = contacts[j],
	                    contactVertex = contact.vertex,
	                    offsetA = Vector.sub(contactVertex, bodyA.position, tempA),
	                    offsetB = Vector.sub(contactVertex, bodyB.position, tempB),
	                    velocityPointA = Vector.add(bodyA.velocity, Vector.mult(Vector.perp(offsetA), bodyA.angularVelocity), tempC),
	                    velocityPointB = Vector.add(bodyB.velocity, Vector.mult(Vector.perp(offsetB), bodyB.angularVelocity), tempD), 
	                    relativeVelocity = Vector.sub(velocityPointA, velocityPointB, tempE),
	                    normalVelocity = Vector.dot(normal, relativeVelocity);
	
	                var tangentVelocity = Vector.dot(tangent, relativeVelocity),
	                    tangentSpeed = Math.abs(tangentVelocity),
	                    tangentVelocityDirection = Common.sign(tangentVelocity);
	
	                // raw impulses
	                var normalImpulse = (1 + pair.restitution) * normalVelocity,
	                    normalForce = Common.clamp(pair.separation + normalVelocity, 0, 1) * Resolver._frictionNormalMultiplier;
	
	                // coulomb friction
	                var tangentImpulse = tangentVelocity,
	                    maxFriction = Infinity;
	
	                if (tangentSpeed > pair.friction * pair.frictionStatic * normalForce * timeScaleSquared) {
	                    tangentImpulse = pair.friction * tangentVelocityDirection * timeScaleSquared;
	                    maxFriction = tangentSpeed;
	                }
	
	                // modify impulses accounting for mass, inertia and offset
	                var oAcN = Vector.cross(offsetA, normal),
	                    oBcN = Vector.cross(offsetB, normal),
	                    denom = bodyA.inverseMass + bodyB.inverseMass + bodyA.inverseInertia * oAcN * oAcN  + bodyB.inverseInertia * oBcN * oBcN;
	
	                normalImpulse *= contactShare / denom;
	                tangentImpulse *= contactShare / (1 + denom);
	
	                // handle high velocity and resting collisions separately
	                if (normalVelocity < 0 && normalVelocity * normalVelocity > Resolver._restingThresh * timeScaleSquared) {
	                    // high velocity so clear cached contact impulse
	                    contact.normalImpulse = 0;
	                    contact.tangentImpulse = 0;
	                } else {
	                    // solve resting collision constraints using Erin Catto's method (GDC08)
	
	                    // impulse constraint, tends to 0
	                    var contactNormalImpulse = contact.normalImpulse;
	                    contact.normalImpulse = Math.min(contact.normalImpulse + normalImpulse, 0);
	                    normalImpulse = contact.normalImpulse - contactNormalImpulse;
	                    
	                    // tangent impulse, tends to -maxFriction or maxFriction
	                    var contactTangentImpulse = contact.tangentImpulse;
	                    contact.tangentImpulse = Common.clamp(contact.tangentImpulse + tangentImpulse, -maxFriction, maxFriction);
	                    tangentImpulse = contact.tangentImpulse - contactTangentImpulse;
	                }
	                
	                // total impulse from contact
	                impulse.x = (normal.x * normalImpulse) + (tangent.x * tangentImpulse);
	                impulse.y = (normal.y * normalImpulse) + (tangent.y * tangentImpulse);
	                
	                // apply impulse from contact
	                if (!(bodyA.isStatic || bodyA.isSleeping)) {
	                    bodyA.positionPrev.x += impulse.x * bodyA.inverseMass;
	                    bodyA.positionPrev.y += impulse.y * bodyA.inverseMass;
	                    bodyA.anglePrev += Vector.cross(offsetA, impulse) * bodyA.inverseInertia;
	                }
	
	                if (!(bodyB.isStatic || bodyB.isSleeping)) {
	                    bodyB.positionPrev.x -= impulse.x * bodyB.inverseMass;
	                    bodyB.positionPrev.y -= impulse.y * bodyB.inverseMass;
	                    bodyB.anglePrev -= Vector.cross(offsetB, impulse) * bodyB.inverseInertia;
	                }
	            }
	        }
	    };
	
	})();
	
	},{"../core/Common":14,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27}],11:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class SAT
	*/
	
	// TODO: true circles and curves
	
	var SAT = {};
	
	module.exports = SAT;
	
	var Vertices = require('../geometry/Vertices');
	var Vector = require('../geometry/Vector');
	
	(function() {
	
	    /**
	     * Description
	     * @method collides
	     * @param {body} bodyA
	     * @param {body} bodyB
	     * @param {collision} previousCollision
	     * @return {collision} collision
	     */
	    SAT.collides = function(bodyA, bodyB, previousCollision) {
	        var overlapAB,
	            overlapBA, 
	            minOverlap,
	            collision,
	            prevCol = previousCollision,
	            canReusePrevCol = false;
	
	        if (prevCol) {
	            // estimate total motion
	            var parentA = bodyA.parent,
	                parentB = bodyB.parent,
	                motion = parentA.speed * parentA.speed + parentA.angularSpeed * parentA.angularSpeed
	                       + parentB.speed * parentB.speed + parentB.angularSpeed * parentB.angularSpeed;
	
	            // we may be able to (partially) reuse collision result 
	            // but only safe if collision was resting
	            canReusePrevCol = prevCol && prevCol.collided && motion < 0.2;
	
	            // reuse collision object
	            collision = prevCol;
	        } else {
	            collision = { collided: false, bodyA: bodyA, bodyB: bodyB };
	        }
	
	        if (prevCol && canReusePrevCol) {
	            // if we can reuse the collision result
	            // we only need to test the previously found axis
	            var axisBodyA = collision.axisBody,
	                axisBodyB = axisBodyA === bodyA ? bodyB : bodyA,
	                axes = [axisBodyA.axes[prevCol.axisNumber]];
	
	            minOverlap = _overlapAxes(axisBodyA.vertices, axisBodyB.vertices, axes);
	            collision.reused = true;
	
	            if (minOverlap.overlap <= 0) {
	                collision.collided = false;
	                return collision;
	            }
	        } else {
	            // if we can't reuse a result, perform a full SAT test
	
	            overlapAB = _overlapAxes(bodyA.vertices, bodyB.vertices, bodyA.axes);
	
	            if (overlapAB.overlap <= 0) {
	                collision.collided = false;
	                return collision;
	            }
	
	            overlapBA = _overlapAxes(bodyB.vertices, bodyA.vertices, bodyB.axes);
	
	            if (overlapBA.overlap <= 0) {
	                collision.collided = false;
	                return collision;
	            }
	
	            if (overlapAB.overlap < overlapBA.overlap) {
	                minOverlap = overlapAB;
	                collision.axisBody = bodyA;
	            } else {
	                minOverlap = overlapBA;
	                collision.axisBody = bodyB;
	            }
	
	            // important for reuse later
	            collision.axisNumber = minOverlap.axisNumber;
	        }
	
	        collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB;
	        collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA;
	        collision.collided = true;
	        collision.normal = minOverlap.axis;
	        collision.depth = minOverlap.overlap;
	        collision.parentA = collision.bodyA.parent;
	        collision.parentB = collision.bodyB.parent;
	        
	        bodyA = collision.bodyA;
	        bodyB = collision.bodyB;
	
	        // ensure normal is facing away from bodyA
	        if (Vector.dot(collision.normal, Vector.sub(bodyB.position, bodyA.position)) > 0) 
	            collision.normal = Vector.neg(collision.normal);
	
	        collision.tangent = Vector.perp(collision.normal);
	
	        collision.penetration = { 
	            x: collision.normal.x * collision.depth, 
	            y: collision.normal.y * collision.depth 
	        };
	
	        // find support points, there is always either exactly one or two
	        var verticesB = _findSupports(bodyA, bodyB, collision.normal),
	            supports = collision.supports || [];
	        supports.length = 0;
	
	        // find the supports from bodyB that are inside bodyA
	        if (Vertices.contains(bodyA.vertices, verticesB[0]))
	            supports.push(verticesB[0]);
	
	        if (Vertices.contains(bodyA.vertices, verticesB[1]))
	            supports.push(verticesB[1]);
	
	        // find the supports from bodyA that are inside bodyB
	        if (supports.length < 2) {
	            var verticesA = _findSupports(bodyB, bodyA, Vector.neg(collision.normal));
	                
	            if (Vertices.contains(bodyB.vertices, verticesA[0]))
	                supports.push(verticesA[0]);
	
	            if (supports.length < 2 && Vertices.contains(bodyB.vertices, verticesA[1]))
	                supports.push(verticesA[1]);
	        }
	
	        // account for the edge case of overlapping but no vertex containment
	        if (supports.length < 1)
	            supports = [verticesB[0]];
	        
	        collision.supports = supports;
	
	        return collision;
	    };
	
	    /**
	     * Description
	     * @method _overlapAxes
	     * @private
	     * @param {} verticesA
	     * @param {} verticesB
	     * @param {} axes
	     * @return result
	     */
	    var _overlapAxes = function(verticesA, verticesB, axes) {
	        var projectionA = Vector._temp[0], 
	            projectionB = Vector._temp[1],
	            result = { overlap: Number.MAX_VALUE },
	            overlap,
	            axis;
	
	        for (var i = 0; i < axes.length; i++) {
	            axis = axes[i];
	
	            _projectToAxis(projectionA, verticesA, axis);
	            _projectToAxis(projectionB, verticesB, axis);
	
	            overlap = Math.min(projectionA.max - projectionB.min, projectionB.max - projectionA.min);
	
	            if (overlap <= 0) {
	                result.overlap = overlap;
	                return result;
	            }
	
	            if (overlap < result.overlap) {
	                result.overlap = overlap;
	                result.axis = axis;
	                result.axisNumber = i;
	            }
	        }
	
	        return result;
	    };
	
	    /**
	     * Description
	     * @method _projectToAxis
	     * @private
	     * @param {} projection
	     * @param {} vertices
	     * @param {} axis
	     */
	    var _projectToAxis = function(projection, vertices, axis) {
	        var min = Vector.dot(vertices[0], axis),
	            max = min;
	
	        for (var i = 1; i < vertices.length; i += 1) {
	            var dot = Vector.dot(vertices[i], axis);
	
	            if (dot > max) { 
	                max = dot; 
	            } else if (dot < min) { 
	                min = dot; 
	            }
	        }
	
	        projection.min = min;
	        projection.max = max;
	    };
	    
	    /**
	     * Description
	     * @method _findSupports
	     * @private
	     * @param {} bodyA
	     * @param {} bodyB
	     * @param {} normal
	     * @return ArrayExpression
	     */
	    var _findSupports = function(bodyA, bodyB, normal) {
	        var nearestDistance = Number.MAX_VALUE,
	            vertexToBody = Vector._temp[0],
	            vertices = bodyB.vertices,
	            bodyAPosition = bodyA.position,
	            distance,
	            vertex,
	            vertexA,
	            vertexB;
	
	        // find closest vertex on bodyB
	        for (var i = 0; i < vertices.length; i++) {
	            vertex = vertices[i];
	            vertexToBody.x = vertex.x - bodyAPosition.x;
	            vertexToBody.y = vertex.y - bodyAPosition.y;
	            distance = -Vector.dot(normal, vertexToBody);
	
	            if (distance < nearestDistance) {
	                nearestDistance = distance;
	                vertexA = vertex;
	            }
	        }
	
	        // find next closest vertex using the two connected to it
	        var prevIndex = vertexA.index - 1 >= 0 ? vertexA.index - 1 : vertices.length - 1;
	        vertex = vertices[prevIndex];
	        vertexToBody.x = vertex.x - bodyAPosition.x;
	        vertexToBody.y = vertex.y - bodyAPosition.y;
	        nearestDistance = -Vector.dot(normal, vertexToBody);
	        vertexB = vertex;
	
	        var nextIndex = (vertexA.index + 1) % vertices.length;
	        vertex = vertices[nextIndex];
	        vertexToBody.x = vertex.x - bodyAPosition.x;
	        vertexToBody.y = vertex.y - bodyAPosition.y;
	        distance = -Vector.dot(normal, vertexToBody);
	        if (distance < nearestDistance) {
	            vertexB = vertex;
	        }
	
	        return [vertexA, vertexB];
	    };
	
	})();
	
	},{"../geometry/Vector":26,"../geometry/Vertices":27}],12:[function(require,module,exports){
	/**
	* The `Matter.Constraint` module contains methods for creating and manipulating constraints.
	* Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
	* The stiffness of constraints can be modified to create springs or elastic.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Constraint
	*/
	
	// TODO: fix instability issues with torque
	// TODO: linked constraints
	// TODO: breakable constraints
	// TODO: collision constraints
	// TODO: allow constrained bodies to sleep
	// TODO: handle 0 length constraints properly
	// TODO: impulse caching and warming
	
	var Constraint = {};
	
	module.exports = Constraint;
	
	var Vertices = require('../geometry/Vertices');
	var Vector = require('../geometry/Vector');
	var Sleeping = require('../core/Sleeping');
	var Bounds = require('../geometry/Bounds');
	var Axes = require('../geometry/Axes');
	var Common = require('../core/Common');
	
	(function() {
	
	    var _minLength = 0.000001,
	        _minDifference = 0.001;
	
	    /**
	     * Creates a new constraint.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properties section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {} options
	     * @return {constraint} constraint
	     */
	    Constraint.create = function(options) {
	        var constraint = options;
	
	        // if bodies defined but no points, use body centre
	        if (constraint.bodyA && !constraint.pointA)
	            constraint.pointA = { x: 0, y: 0 };
	        if (constraint.bodyB && !constraint.pointB)
	            constraint.pointB = { x: 0, y: 0 };
	
	        // calculate static length using initial world space points
	        var initialPointA = constraint.bodyA ? Vector.add(constraint.bodyA.position, constraint.pointA) : constraint.pointA,
	            initialPointB = constraint.bodyB ? Vector.add(constraint.bodyB.position, constraint.pointB) : constraint.pointB,
	            length = Vector.magnitude(Vector.sub(initialPointA, initialPointB));
	    
	        constraint.length = constraint.length || length || _minLength;
	
	        // render
	        var render = {
	            visible: true,
	            lineWidth: 2,
	            strokeStyle: '#666'
	        };
	        
	        constraint.render = Common.extend(render, constraint.render);
	
	        // option defaults
	        constraint.id = constraint.id || Common.nextId();
	        constraint.label = constraint.label || 'Constraint';
	        constraint.type = 'constraint';
	        constraint.stiffness = constraint.stiffness || 1;
	        constraint.angularStiffness = constraint.angularStiffness || 0;
	        constraint.angleA = constraint.bodyA ? constraint.bodyA.angle : constraint.angleA;
	        constraint.angleB = constraint.bodyB ? constraint.bodyB.angle : constraint.angleB;
	
	        return constraint;
	    };
	
	    /**
	     * Description
	     * @private
	     * @method solveAll
	     * @param {constraint[]} constraints
	     * @param {number} timeScale
	     */
	    Constraint.solveAll = function(constraints, timeScale) {
	        for (var i = 0; i < constraints.length; i++) {
	            Constraint.solve(constraints[i], timeScale);
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method solve
	     * @param {constraint} constraint
	     * @param {number} timeScale
	     */
	    Constraint.solve = function(constraint, timeScale) {
	        var bodyA = constraint.bodyA,
	            bodyB = constraint.bodyB,
	            pointA = constraint.pointA,
	            pointB = constraint.pointB;
	
	        // update reference angle
	        if (bodyA && !bodyA.isStatic) {
	            constraint.pointA = Vector.rotate(pointA, bodyA.angle - constraint.angleA);
	            constraint.angleA = bodyA.angle;
	        }
	        
	        // update reference angle
	        if (bodyB && !bodyB.isStatic) {
	            constraint.pointB = Vector.rotate(pointB, bodyB.angle - constraint.angleB);
	            constraint.angleB = bodyB.angle;
	        }
	
	        var pointAWorld = pointA,
	            pointBWorld = pointB;
	
	        if (bodyA) pointAWorld = Vector.add(bodyA.position, pointA);
	        if (bodyB) pointBWorld = Vector.add(bodyB.position, pointB);
	
	        if (!pointAWorld || !pointBWorld)
	            return;
	
	        var delta = Vector.sub(pointAWorld, pointBWorld),
	            currentLength = Vector.magnitude(delta);
	
	        // prevent singularity
	        if (currentLength === 0)
	            currentLength = _minLength;
	
	        // solve distance constraint with Gauss-Siedel method
	        var difference = (currentLength - constraint.length) / currentLength,
	            normal = Vector.div(delta, currentLength),
	            force = Vector.mult(delta, difference * 0.5 * constraint.stiffness * timeScale * timeScale);
	        
	        // if difference is very small, we can skip
	        if (Math.abs(1 - (currentLength / constraint.length)) < _minDifference * timeScale)
	            return;
	
	        var velocityPointA,
	            velocityPointB,
	            offsetA,
	            offsetB,
	            oAn,
	            oBn,
	            bodyADenom,
	            bodyBDenom;
	    
	        if (bodyA && !bodyA.isStatic) {
	            // point body offset
	            offsetA = { 
	                x: pointAWorld.x - bodyA.position.x + force.x, 
	                y: pointAWorld.y - bodyA.position.y + force.y
	            };
	            
	            // update velocity
	            bodyA.velocity.x = bodyA.position.x - bodyA.positionPrev.x;
	            bodyA.velocity.y = bodyA.position.y - bodyA.positionPrev.y;
	            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
	            
	            // find point velocity and body mass
	            velocityPointA = Vector.add(bodyA.velocity, Vector.mult(Vector.perp(offsetA), bodyA.angularVelocity));
	            oAn = Vector.dot(offsetA, normal);
	            bodyADenom = bodyA.inverseMass + bodyA.inverseInertia * oAn * oAn;
	        } else {
	            velocityPointA = { x: 0, y: 0 };
	            bodyADenom = bodyA ? bodyA.inverseMass : 0;
	        }
	            
	        if (bodyB && !bodyB.isStatic) {
	            // point body offset
	            offsetB = { 
	                x: pointBWorld.x - bodyB.position.x - force.x, 
	                y: pointBWorld.y - bodyB.position.y - force.y 
	            };
	            
	            // update velocity
	            bodyB.velocity.x = bodyB.position.x - bodyB.positionPrev.x;
	            bodyB.velocity.y = bodyB.position.y - bodyB.positionPrev.y;
	            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
	
	            // find point velocity and body mass
	            velocityPointB = Vector.add(bodyB.velocity, Vector.mult(Vector.perp(offsetB), bodyB.angularVelocity));
	            oBn = Vector.dot(offsetB, normal);
	            bodyBDenom = bodyB.inverseMass + bodyB.inverseInertia * oBn * oBn;
	        } else {
	            velocityPointB = { x: 0, y: 0 };
	            bodyBDenom = bodyB ? bodyB.inverseMass : 0;
	        }
	        
	        var relativeVelocity = Vector.sub(velocityPointB, velocityPointA),
	            normalImpulse = Vector.dot(normal, relativeVelocity) / (bodyADenom + bodyBDenom);
	    
	        if (normalImpulse > 0) normalImpulse = 0;
	    
	        var normalVelocity = {
	            x: normal.x * normalImpulse, 
	            y: normal.y * normalImpulse
	        };
	
	        var torque;
	 
	        if (bodyA && !bodyA.isStatic) {
	            torque = Vector.cross(offsetA, normalVelocity) * bodyA.inverseInertia * (1 - constraint.angularStiffness);
	
	            Sleeping.set(bodyA, false);
	            
	            // clamp to prevent instability
	            // TODO: solve this properly
	            torque = Common.clamp(torque, -0.01, 0.01);
	
	            // keep track of applied impulses for post solving
	            bodyA.constraintImpulse.x -= force.x;
	            bodyA.constraintImpulse.y -= force.y;
	            bodyA.constraintImpulse.angle += torque;
	
	            // apply forces
	            bodyA.position.x -= force.x;
	            bodyA.position.y -= force.y;
	            bodyA.angle += torque;
	        }
	
	        if (bodyB && !bodyB.isStatic) {
	            torque = Vector.cross(offsetB, normalVelocity) * bodyB.inverseInertia * (1 - constraint.angularStiffness);
	
	            Sleeping.set(bodyB, false);
	            
	            // clamp to prevent instability
	            // TODO: solve this properly
	            torque = Common.clamp(torque, -0.01, 0.01);
	
	            // keep track of applied impulses for post solving
	            bodyB.constraintImpulse.x += force.x;
	            bodyB.constraintImpulse.y += force.y;
	            bodyB.constraintImpulse.angle -= torque;
	            
	            // apply forces
	            bodyB.position.x += force.x;
	            bodyB.position.y += force.y;
	            bodyB.angle -= torque;
	        }
	
	    };
	
	    /**
	     * Performs body updates required after solving constraints
	     * @private
	     * @method postSolveAll
	     * @param {body[]} bodies
	     */
	    Constraint.postSolveAll = function(bodies) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                impulse = body.constraintImpulse;
	
	            if (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0) {
	                continue;
	            }
	
	            // update geometry and reset
	            for (var j = 0; j < body.parts.length; j++) {
	                var part = body.parts[j];
	                
	                Vertices.translate(part.vertices, impulse);
	
	                if (j > 0) {
	                    part.position.x += impulse.x;
	                    part.position.y += impulse.y;
	                }
	
	                if (impulse.angle !== 0) {
	                    Vertices.rotate(part.vertices, impulse.angle, body.position);
	                    Axes.rotate(part.axes, impulse.angle);
	                    if (j > 0) {
	                        Vector.rotateAbout(part.position, impulse.angle, body.position, part.position);
	                    }
	                }
	
	                Bounds.update(part.bounds, part.vertices, body.velocity);
	            }
	
	            impulse.angle = 0;
	            impulse.x = 0;
	            impulse.y = 0;
	        }
	    };
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
	     *
	     * @property id
	     * @type number
	     */
	
	    /**
	     * A `String` denoting the type of object.
	     *
	     * @property type
	     * @type string
	     * @default "constraint"
	     */
	
	    /**
	     * An arbitrary `String` name to help the user identify and manage bodies.
	     *
	     * @property label
	     * @type string
	     * @default "Constraint"
	     */
	
	    /**
	     * An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
	     *
	     * @property render
	     * @type object
	     */
	
	    /**
	     * A flag that indicates if the constraint should be rendered.
	     *
	     * @property render.visible
	     * @type boolean
	     * @default true
	     */
	
	    /**
	     * A `Number` that defines the line width to use when rendering the constraint outline.
	     * A value of `0` means no outline will be rendered.
	     *
	     * @property render.lineWidth
	     * @type number
	     * @default 2
	     */
	
	    /**
	     * A `String` that defines the stroke style to use when rendering the constraint outline.
	     * It is the same as when using a canvas, so it accepts CSS style property values.
	     *
	     * @property render.strokeStyle
	     * @type string
	     * @default a random colour
	     */
	
	    /**
	     * The first possible `Body` that this constraint is attached to.
	     *
	     * @property bodyA
	     * @type body
	     * @default null
	     */
	
	    /**
	     * The second possible `Body` that this constraint is attached to.
	     *
	     * @property bodyB
	     * @type body
	     * @default null
	     */
	
	    /**
	     * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
	     *
	     * @property pointA
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
	     *
	     * @property pointB
	     * @type vector
	     * @default { x: 0, y: 0 }
	     */
	
	    /**
	     * A `Number` that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`.
	     * A value of `1` means the constraint should be very stiff.
	     * A value of `0.2` means the constraint acts like a soft spring.
	     *
	     * @property stiffness
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * A `Number` that specifies the target resting length of the constraint. 
	     * It is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
	     *
	     * @property length
	     * @type number
	     */
	
	})();
	
	},{"../core/Common":14,"../core/Sleeping":20,"../geometry/Axes":23,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27}],13:[function(require,module,exports){
	/**
	* The `Matter.MouseConstraint` module contains methods for creating mouse constraints.
	* Mouse constraints are used for allowing user interaction, providing the ability to move bodies via the mouse or touch.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class MouseConstraint
	*/
	
	var MouseConstraint = {};
	
	module.exports = MouseConstraint;
	
	var Vertices = require('../geometry/Vertices');
	var Sleeping = require('../core/Sleeping');
	var Mouse = require('../core/Mouse');
	var Events = require('../core/Events');
	var Detector = require('../collision/Detector');
	var Constraint = require('./Constraint');
	var Composite = require('../body/Composite');
	var Common = require('../core/Common');
	var Bounds = require('../geometry/Bounds');
	
	(function() {
	
	    /**
	     * Creates a new mouse constraint.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properties section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {engine} engine
	     * @param {} options
	     * @return {MouseConstraint} A new MouseConstraint
	     */
	    MouseConstraint.create = function(engine, options) {
	        var mouse = (engine ? engine.mouse : null) || (options ? options.mouse : null);
	
	        if (!mouse && engine && engine.render && engine.render.canvas) {
	            mouse = Mouse.create(engine.render.canvas);
	        } else {
	            mouse = Mouse.create();
	            Common.log('MouseConstraint.create: options.mouse was undefined, engine.render.canvas was undefined, may not function as expected', 'warn');
	        }
	
	        var constraint = Constraint.create({ 
	            label: 'Mouse Constraint',
	            pointA: mouse.position,
	            pointB: { x: 0, y: 0 },
	            length: 0.01, 
	            stiffness: 0.1,
	            angularStiffness: 1,
	            render: {
	                strokeStyle: '#90EE90',
	                lineWidth: 3
	            }
	        });
	
	        var defaults = {
	            type: 'mouseConstraint',
	            mouse: mouse,
	            body: null,
	            constraint: constraint,
	            collisionFilter: {
	                category: 0x0001,
	                mask: 0xFFFFFFFF,
	                group: 0
	            }
	        };
	
	        var mouseConstraint = Common.extend(defaults, options);
	
	        Events.on(engine, 'tick', function() {
	            var allBodies = Composite.allBodies(engine.world);
	            MouseConstraint.update(mouseConstraint, allBodies);
	            _triggerEvents(mouseConstraint);
	        });
	
	        return mouseConstraint;
	    };
	
	    /**
	     * Updates the given mouse constraint.
	     * @private
	     * @method update
	     * @param {MouseConstraint} mouseConstraint
	     * @param {body[]} bodies
	     */
	    MouseConstraint.update = function(mouseConstraint, bodies) {
	        var mouse = mouseConstraint.mouse,
	            constraint = mouseConstraint.constraint,
	            body = mouseConstraint.body;
	
	        if (mouse.button === 0) {
	            if (!constraint.bodyB) {
	                for (var i = 0; i < bodies.length; i++) {
	                    body = bodies[i];
	                    if (Bounds.contains(body.bounds, mouse.position) 
	                            && Detector.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) {
	                        for (var j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
	                            var part = body.parts[j];
	                            if (Vertices.contains(part.vertices, mouse.position)) {
	                                constraint.pointA = mouse.position;
	                                constraint.bodyB = mouseConstraint.body = body;
	                                constraint.pointB = { x: mouse.position.x - body.position.x, y: mouse.position.y - body.position.y };
	                                constraint.angleB = body.angle;
	
	                                Sleeping.set(body, false);
	                                Events.trigger(mouseConstraint, 'startdrag', { mouse: mouse, body: body });
	
	                                break;
	                            }
	                        }
	                    }
	                }
	            } else {
	                Sleeping.set(constraint.bodyB, false);
	                constraint.pointA = mouse.position;
	            }
	        } else {
	            constraint.bodyB = mouseConstraint.body = null;
	            constraint.pointB = null;
	
	            if (body)
	                Events.trigger(mouseConstraint, 'enddrag', { mouse: mouse, body: body });
	        }
	    };
	
	    /**
	     * Triggers mouse constraint events
	     * @method _triggerEvents
	     * @private
	     * @param {mouse} mouseConstraint
	     */
	    var _triggerEvents = function(mouseConstraint) {
	        var mouse = mouseConstraint.mouse,
	            mouseEvents = mouse.sourceEvents;
	
	        if (mouseEvents.mousemove)
	            Events.trigger(mouseConstraint, 'mousemove', { mouse: mouse });
	
	        if (mouseEvents.mousedown)
	            Events.trigger(mouseConstraint, 'mousedown', { mouse: mouse });
	
	        if (mouseEvents.mouseup)
	            Events.trigger(mouseConstraint, 'mouseup', { mouse: mouse });
	
	        // reset the mouse state ready for the next step
	        Mouse.clearSourceEvents(mouse);
	    };
	
	    /*
	    *
	    *  Events Documentation
	    *
	    */
	
	    /**
	    * Fired when the mouse has moved (or a touch moves) during the last step
	    *
	    * @event mousemove
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when the mouse is down (or a touch has started) during the last step
	    *
	    * @event mousedown
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when the mouse is up (or a touch has ended) during the last step
	    *
	    * @event mouseup
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when the user starts dragging a body
	    *
	    * @event startdrag
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {body} event.body The body being dragged
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired when the user ends dragging a body
	    *
	    * @event enddrag
	    * @param {} event An event object
	    * @param {mouse} event.mouse The engine's mouse instance
	    * @param {body} event.body The body that has stopped being dragged
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * A `String` denoting the type of object.
	     *
	     * @property type
	     * @type string
	     * @default "constraint"
	     */
	
	    /**
	     * The `Mouse` instance in use. If not supplied in `MouseConstraint.create`, one will be created.
	     *
	     * @property mouse
	     * @type mouse
	     * @default mouse
	     */
	
	    /**
	     * The `Body` that is currently being moved by the user, or `null` if no body.
	     *
	     * @property body
	     * @type body
	     * @default null
	     */
	
	    /**
	     * The `Constraint` object that is used to move the body during interaction.
	     *
	     * @property constraint
	     * @type constraint
	     */
	
	    /**
	     * An `Object` that specifies the collision filter properties.
	     * The collision filter allows the user to define which types of body this mouse constraint can interact with.
	     * See `body.collisionFilter` for more information.
	     *
	     * @property collisionFilter
	     * @type object
	     */
	
	})();
	
	},{"../body/Composite":2,"../collision/Detector":5,"../core/Common":14,"../core/Events":16,"../core/Mouse":18,"../core/Sleeping":20,"../geometry/Bounds":24,"../geometry/Vertices":27,"./Constraint":12}],14:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Common
	*/
	
	var Common = {};
	
	module.exports = Common;
	
	(function() {
	
	    Common._nextId = 0;
	    Common._seed = 0;
	
	    /**
	     * Description
	     * @method extend
	     * @param {} obj
	     * @param {boolean} deep
	     * @return {} obj extended
	     */
	    Common.extend = function(obj, deep) {
	        var argsStart,
	            args,
	            deepClone;
	
	        if (typeof deep === 'boolean') {
	            argsStart = 2;
	            deepClone = deep;
	        } else {
	            argsStart = 1;
	            deepClone = true;
	        }
	
	        args = Array.prototype.slice.call(arguments, argsStart);
	
	        for (var i = 0; i < args.length; i++) {
	            var source = args[i];
	
	            if (source) {
	                for (var prop in source) {
	                    if (deepClone && source[prop] && source[prop].constructor === Object) {
	                        if (!obj[prop] || obj[prop].constructor === Object) {
	                            obj[prop] = obj[prop] || {};
	                            Common.extend(obj[prop], deepClone, source[prop]);
	                        } else {
	                            obj[prop] = source[prop];
	                        }
	                    } else {
	                        obj[prop] = source[prop];
	                    }
	                }
	            }
	        }
	        
	        return obj;
	    };
	
	    /**
	     * Creates a new clone of the object, if deep is true references will also be cloned
	     * @method clone
	     * @param {} obj
	     * @param {bool} deep
	     * @return {} obj cloned
	     */
	    Common.clone = function(obj, deep) {
	        return Common.extend({}, deep, obj);
	    };
	
	    /**
	     * Description
	     * @method keys
	     * @param {} obj
	     * @return {string[]} keys
	     */
	    Common.keys = function(obj) {
	        if (Object.keys)
	            return Object.keys(obj);
	
	        // avoid hasOwnProperty for performance
	        var keys = [];
	        for (var key in obj)
	            keys.push(key);
	        return keys;
	    };
	
	    /**
	     * Description
	     * @method values
	     * @param {} obj
	     * @return {array} Array of the objects property values
	     */
	    Common.values = function(obj) {
	        var values = [];
	        
	        if (Object.keys) {
	            var keys = Object.keys(obj);
	            for (var i = 0; i < keys.length; i++) {
	                values.push(obj[keys[i]]);
	            }
	            return values;
	        }
	        
	        // avoid hasOwnProperty for performance
	        for (var key in obj)
	            values.push(obj[key]);
	        return values;
	    };
	
	    /**
	     * Description
	     * @method shadeColor
	     * @param {string} color
	     * @param {number} percent
	     * @return {string} A hex colour string made by lightening or darkening color by percent
	     */
	    Common.shadeColor = function(color, percent) {   
	        // http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color
	        var colorInteger = parseInt(color.slice(1),16), 
	            amount = Math.round(2.55 * percent), 
	            R = (colorInteger >> 16) + amount, 
	            B = (colorInteger >> 8 & 0x00FF) + amount, 
	            G = (colorInteger & 0x0000FF) + amount;
	        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R :255) * 0x10000 
	                + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 
	                + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
	    };
	
	    /**
	     * Description
	     * @method shuffle
	     * @param {array} array
	     * @return {array} array shuffled randomly
	     */
	    Common.shuffle = function(array) {
	        for (var i = array.length - 1; i > 0; i--) {
	            var j = Math.floor(Common.random() * (i + 1));
	            var temp = array[i];
	            array[i] = array[j];
	            array[j] = temp;
	        }
	        return array;
	    };
	
	    /**
	     * Description
	     * @method choose
	     * @param {array} choices
	     * @return {object} A random choice object from the array
	     */
	    Common.choose = function(choices) {
	        return choices[Math.floor(Common.random() * choices.length)];
	    };
	
	    /**
	     * Description
	     * @method isElement
	     * @param {object} obj
	     * @return {boolean} True if the object is a HTMLElement, otherwise false
	     */
	    Common.isElement = function(obj) {
	        // http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
	        try {
	            return obj instanceof HTMLElement;
	        }
	        catch(e){
	            return (typeof obj==="object") &&
	              (obj.nodeType===1) && (typeof obj.style === "object") &&
	              (typeof obj.ownerDocument ==="object");
	        }
	    };
	
	    /**
	     * Description
	     * @method isArray
	     * @param {object} obj
	     * @return {boolean} True if the object is an array, otherwise false
	     */
	    Common.isArray = function(obj) {
	        return Object.prototype.toString.call(obj) === '[object Array]';
	    };
	    
	    /**
	     * Description
	     * @method clamp
	     * @param {number} value
	     * @param {number} min
	     * @param {number} max
	     * @return {number} The value clamped between min and max inclusive
	     */
	    Common.clamp = function(value, min, max) {
	        if (value < min)
	            return min;
	        if (value > max)
	            return max;
	        return value;
	    };
	    
	    /**
	     * Description
	     * @method sign
	     * @param {number} value
	     * @return {number} -1 if negative, +1 if 0 or positive
	     */
	    Common.sign = function(value) {
	        return value < 0 ? -1 : 1;
	    };
	    
	    /**
	     * Description
	     * @method now
	     * @return {number} the current timestamp (high-res if available)
	     */
	    Common.now = function() {
	        // http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
	        // https://gist.github.com/davidwaterston/2982531
	
	        var performance = window.performance || {};
	
	        performance.now = (function() {
	            return performance.now    ||
	            performance.webkitNow     ||
	            performance.msNow         ||
	            performance.oNow          ||
	            performance.mozNow        ||
	            function() { return +(new Date()); };
	        })();
	              
	        return performance.now();
	    };
	
	    
	    /**
	     * Description
	     * @method random
	     * @param {number} min
	     * @param {number} max
	     * @return {number} A random number between min and max inclusive
	     */
	    Common.random = function(min, max) {
	        min = (typeof min !== "undefined") ? min : 0;
	        max = (typeof max !== "undefined") ? max : 1;
	        return min + _seededRandom() * (max - min);
	    };
	
	    /**
	     * Converts a CSS hex colour string into an integer
	     * @method colorToNumber
	     * @param {string} colorString
	     * @return {number} An integer representing the CSS hex string
	     */
	    Common.colorToNumber = function(colorString) {
	        colorString = colorString.replace('#','');
	
	        if (colorString.length == 3) {
	            colorString = colorString.charAt(0) + colorString.charAt(0)
	                        + colorString.charAt(1) + colorString.charAt(1)
	                        + colorString.charAt(2) + colorString.charAt(2);
	        }
	
	        return parseInt(colorString, 16);
	    };
	
	    /**
	     * A wrapper for console.log, for providing errors and warnings
	     * @method log
	     * @param {string} message
	     * @param {string} type
	     */
	    Common.log = function(message, type) {
	        if (!console || !console.log || !console.warn)
	            return;
	
	        switch (type) {
	
	        case 'warn':
	            console.warn('Matter.js:', message);
	            break;
	        case 'error':
	            console.log('Matter.js:', message);
	            break;
	
	        }
	    };
	
	    /**
	     * Returns the next unique sequential ID
	     * @method nextId
	     * @return {Number} Unique sequential ID
	     */
	    Common.nextId = function() {
	        return Common._nextId++;
	    };
	
	    /**
	     * A cross browser compatible indexOf implementation
	     * @method indexOf
	     * @param {array} haystack
	     * @param {object} needle
	     */
	    Common.indexOf = function(haystack, needle) {
	        if (haystack.indexOf)
	            return haystack.indexOf(needle);
	
	        for (var i = 0; i < haystack.length; i++) {
	            if (haystack[i] === needle)
	                return i;
	        }
	
	        return -1;
	    };
	
	    var _seededRandom = function() {
	        // https://gist.github.com/ngryman/3830489
	        Common._seed = (Common._seed * 9301 + 49297) % 233280;
	        return Common._seed / 233280;
	    };
	
	})();
	
	},{}],15:[function(require,module,exports){
	/**
	* The `Matter.Engine` module contains methods for creating and manipulating engines.
	* An engine is a controller that manages updating the simulation of the world.
	* See `Matter.Runner` for an optional game loop utility.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Engine
	*/
	
	var Engine = {};
	
	module.exports = Engine;
	
	var World = require('../body/World');
	var Sleeping = require('./Sleeping');
	var Resolver = require('../collision/Resolver');
	var Render = require('../render/Render');
	var Pairs = require('../collision/Pairs');
	var Metrics = require('./Metrics');
	var Grid = require('../collision/Grid');
	var Events = require('./Events');
	var Composite = require('../body/Composite');
	var Constraint = require('../constraint/Constraint');
	var Common = require('./Common');
	var Body = require('../body/Body');
	
	(function() {
	
	    /**
	     * Creates a new engine. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properties section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {HTMLElement} element
	     * @param {object} [options]
	     * @return {engine} engine
	     */
	    Engine.create = function(element, options) {
	
	        // options may be passed as the first (and only) argument
	        options = Common.isElement(element) ? options : element;
	        element = Common.isElement(element) ? element : null;
	
	        var defaults = {
	            positionIterations: 6,
	            velocityIterations: 4,
	            constraintIterations: 2,
	            enableSleeping: false,
	            events: [],
	            timing: {
	                timestamp: 0,
	                timeScale: 1
	            },
	            broadphase: {
	                controller: Grid
	            }
	        };
	
	        var engine = Common.extend(defaults, options);
	
	        if (element || engine.render) {
	            var renderDefaults = {
	                element: element,
	                controller: Render
	            };
	            
	            engine.render = Common.extend(renderDefaults, engine.render);
	        }
	
	        if (engine.render && engine.render.controller) {
	            engine.render = engine.render.controller.create(engine.render);
	        }
	
	        engine.world = World.create(engine.world);
	        engine.pairs = Pairs.create();
	        engine.broadphase = engine.broadphase.controller.create(engine.broadphase);
	        engine.metrics = engine.metrics || { extended: false };
	
	
	        return engine;
	    };
	
	    /**
	     * Moves the simulation forward in time by `delta` ms.
	     * The `correction` argument is an optional `Number` that specifies the time correction factor to apply to the update.
	     * This can help improve the accuracy of the simulation in cases where `delta` is changing between updates.
	     * The value of `correction` is defined as `delta / lastDelta`, i.e. the percentage change of `delta` over the last step.
	     * Therefore the value is always `1` (no correction) when `delta` constant (or when no correction is desired, which is the default).
	     * See the paper on <a href="http://lonesock.net/article/verlet.html">Time Corrected Verlet</a> for more information.
	     *
	     * Triggers `beforeUpdate` and `afterUpdate` events.
	     * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
	     * @method update
	     * @param {engine} engine
	     * @param {number} delta
	     * @param {number} [correction]
	     */
	    Engine.update = function(engine, delta, correction) {
	        correction = (typeof correction !== 'undefined') ? correction : 1;
	
	        var world = engine.world,
	            timing = engine.timing,
	            broadphase = engine.broadphase,
	            broadphasePairs = [],
	            i;
	
	        // increment timestamp
	        timing.timestamp += delta * timing.timeScale;
	
	        // create an event object
	        var event = {
	            timestamp: timing.timestamp
	        };
	
	        Events.trigger(engine, 'beforeUpdate', event);
	
	        // get lists of all bodies and constraints, no matter what composites they are in
	        var allBodies = Composite.allBodies(world),
	            allConstraints = Composite.allConstraints(world);
	
	
	        // if sleeping enabled, call the sleeping controller
	        if (engine.enableSleeping)
	            Sleeping.update(allBodies, timing.timeScale);
	
	        // applies gravity to all bodies
	        _bodiesApplyGravity(allBodies, world.gravity);
	
	        // update all body position and rotation by integration
	        _bodiesUpdate(allBodies, delta, timing.timeScale, correction, world.bounds);
	
	        // update all constraints
	        for (i = 0; i < engine.constraintIterations; i++) {
	            Constraint.solveAll(allConstraints, timing.timeScale);
	        }
	        Constraint.postSolveAll(allBodies);
	
	        // broadphase pass: find potential collision pairs
	        if (broadphase.controller) {
	
	            // if world is dirty, we must flush the whole grid
	            if (world.isModified)
	                broadphase.controller.clear(broadphase);
	
	            // update the grid buckets based on current bodies
	            broadphase.controller.update(broadphase, allBodies, engine, world.isModified);
	            broadphasePairs = broadphase.pairsList;
	        } else {
	
	            // if no broadphase set, we just pass all bodies
	            broadphasePairs = allBodies;
	        }
	
	        // narrowphase pass: find actual collisions, then create or update collision pairs
	        var collisions = broadphase.detector(broadphasePairs, engine);
	
	        // update collision pairs
	        var pairs = engine.pairs,
	            timestamp = timing.timestamp;
	        Pairs.update(pairs, collisions, timestamp);
	        Pairs.removeOld(pairs, timestamp);
	
	        // wake up bodies involved in collisions
	        if (engine.enableSleeping)
	            Sleeping.afterCollisions(pairs.list, timing.timeScale);
	
	        // trigger collision events
	        if (pairs.collisionStart.length > 0)
	            Events.trigger(engine, 'collisionStart', { pairs: pairs.collisionStart });
	
	        // iteratively resolve position between collisions
	        Resolver.preSolvePosition(pairs.list);
	        for (i = 0; i < engine.positionIterations; i++) {
	            Resolver.solvePosition(pairs.list, timing.timeScale);
	        }
	        Resolver.postSolvePosition(allBodies);
	
	        // iteratively resolve velocity between collisions
	        Resolver.preSolveVelocity(pairs.list);
	        for (i = 0; i < engine.velocityIterations; i++) {
	            Resolver.solveVelocity(pairs.list, timing.timeScale);
	        }
	
	        // trigger collision events
	        if (pairs.collisionActive.length > 0)
	            Events.trigger(engine, 'collisionActive', { pairs: pairs.collisionActive });
	
	        if (pairs.collisionEnd.length > 0)
	            Events.trigger(engine, 'collisionEnd', { pairs: pairs.collisionEnd });
	
	
	        // clear force buffers
	        _bodiesClearForces(allBodies);
	
	        // clear all composite modified flags
	        if (world.isModified)
	            Composite.setModified(world, false, false, true);
	
	        Events.trigger(engine, 'afterUpdate', event);
	
	        return engine;
	    };
	    
	    /**
	     * Merges two engines by keeping the configuration of `engineA` but replacing the world with the one from `engineB`.
	     * @method merge
	     * @param {engine} engineA
	     * @param {engine} engineB
	     */
	    Engine.merge = function(engineA, engineB) {
	        Common.extend(engineA, engineB);
	        
	        if (engineB.world) {
	            engineA.world = engineB.world;
	
	            Engine.clear(engineA);
	
	            var bodies = Composite.allBodies(engineA.world);
	
	            for (var i = 0; i < bodies.length; i++) {
	                var body = bodies[i];
	                Sleeping.set(body, false);
	                body.id = Common.nextId();
	            }
	        }
	    };
	
	    /**
	     * Clears the engine including the world, pairs and broadphase.
	     * @method clear
	     * @param {engine} engine
	     */
	    Engine.clear = function(engine) {
	        var world = engine.world;
	        
	        Pairs.clear(engine.pairs);
	
	        var broadphase = engine.broadphase;
	        if (broadphase.controller) {
	            var bodies = Composite.allBodies(world);
	            broadphase.controller.clear(broadphase);
	            broadphase.controller.update(broadphase, bodies, engine, true);
	        }
	    };
	
	    /**
	     * Zeroes the `body.force` and `body.torque` force buffers.
	     * @method bodiesClearForces
	     * @private
	     * @param {body[]} bodies
	     */
	    var _bodiesClearForces = function(bodies) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            // reset force buffers
	            body.force.x = 0;
	            body.force.y = 0;
	            body.torque = 0;
	        }
	    };
	
	    /**
	     * Applys a mass dependant force to all given bodies.
	     * @method bodiesApplyGravity
	     * @private
	     * @param {body[]} bodies
	     * @param {vector} gravity
	     */
	    var _bodiesApplyGravity = function(bodies, gravity) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.isStatic || body.isSleeping)
	                continue;
	
	            // apply gravity
	            body.force.y += body.mass * gravity.y * 0.001;
	            body.force.x += body.mass * gravity.x * 0.001;
	        }
	    };
	
	    /**
	     * Applys `Body.update` to all given `bodies`.
	     * @method updateAll
	     * @private
	     * @param {body[]} bodies
	     * @param {number} deltaTime 
	     * The amount of time elapsed between updates
	     * @param {number} timeScale
	     * @param {number} correction 
	     * The Verlet correction factor (deltaTime / lastDeltaTime)
	     * @param {bounds} worldBounds
	     */
	    var _bodiesUpdate = function(bodies, deltaTime, timeScale, correction, worldBounds) {
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.isStatic || body.isSleeping)
	                continue;
	
	            Body.update(body, deltaTime, timeScale, correction);
	        }
	    };
	
	    /**
	     * An alias for `Runner.run`, see `Matter.Runner` for more information.
	     * @method run
	     * @param {engine} engine
	     */
	
	    /**
	    * Fired just before an update
	    *
	    * @event beforeUpdate
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update and all collision events
	    *
	    * @event afterUpdate
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update, provides a list of all pairs that have started to collide in the current tick (if any)
	    *
	    * @event collisionStart
	    * @param {} event An event object
	    * @param {} event.pairs List of affected pairs
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update, provides a list of all pairs that are colliding in the current tick (if any)
	    *
	    * @event collisionActive
	    * @param {} event An event object
	    * @param {} event.pairs List of affected pairs
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine update, provides a list of all pairs that have ended collision in the current tick (if any)
	    *
	    * @event collisionEnd
	    * @param {} event An event object
	    * @param {} event.pairs List of affected pairs
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * An integer `Number` that specifies the number of position iterations to perform each update.
	     * The higher the value, the higher quality the simulation will be at the expense of performance.
	     *
	     * @property positionIterations
	     * @type number
	     * @default 6
	     */
	
	    /**
	     * An integer `Number` that specifies the number of velocity iterations to perform each update.
	     * The higher the value, the higher quality the simulation will be at the expense of performance.
	     *
	     * @property velocityIterations
	     * @type number
	     * @default 4
	     */
	
	    /**
	     * An integer `Number` that specifies the number of constraint iterations to perform each update.
	     * The higher the value, the higher quality the simulation will be at the expense of performance.
	     * The default value of `2` is usually very adequate.
	     *
	     * @property constraintIterations
	     * @type number
	     * @default 2
	     */
	
	    /**
	     * A flag that specifies whether the engine should allow sleeping via the `Matter.Sleeping` module.
	     * Sleeping can improve stability and performance, but often at the expense of accuracy.
	     *
	     * @property enableSleeping
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * An `Object` containing properties regarding the timing systems of the engine. 
	     *
	     * @property timing
	     * @type object
	     */
	
	    /**
	     * A `Number` that specifies the global scaling factor of time for all bodies.
	     * A value of `0` freezes the simulation.
	     * A value of `0.1` gives a slow-motion effect.
	     * A value of `1.2` gives a speed-up effect.
	     *
	     * @property timing.timeScale
	     * @type number
	     * @default 1
	     */
	
	    /**
	     * A `Number` that specifies the current simulation-time in milliseconds starting from `0`. 
	     * It is incremented on every `Engine.update` by the given `delta` argument. 
	     *
	     * @property timing.timestamp
	     * @type number
	     * @default 0
	     */
	
	    /**
	     * An instance of a `Render` controller. The default value is a `Matter.Render` instance created by `Engine.create`.
	     * One may also develop a custom renderer module based on `Matter.Render` and pass an instance of it to `Engine.create` via `options.render`.
	     *
	     * A minimal custom renderer object must define at least three functions: `create`, `clear` and `world` (see `Matter.Render`).
	     * It is also possible to instead pass the _module_ reference via `options.render.controller` and `Engine.create` will instantiate one for you.
	     *
	     * @property render
	     * @type render
	     * @default a Matter.Render instance
	     */
	
	    /**
	     * An instance of a broadphase controller. The default value is a `Matter.Grid` instance created by `Engine.create`.
	     *
	     * @property broadphase
	     * @type grid
	     * @default a Matter.Grid instance
	     */
	
	    /**
	     * A `World` composite object that will contain all simulated bodies and constraints.
	     *
	     * @property world
	     * @type world
	     * @default a Matter.World instance
	     */
	
	})();
	
	},{"../body/Body":1,"../body/Composite":2,"../body/World":3,"../collision/Grid":6,"../collision/Pairs":8,"../collision/Resolver":10,"../constraint/Constraint":12,"../render/Render":29,"./Common":14,"./Events":16,"./Metrics":17,"./Sleeping":20}],16:[function(require,module,exports){
	/**
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Events
	*/
	
	var Events = {};
	
	module.exports = Events;
	
	var Common = require('./Common');
	
	(function() {
	
	    /**
	     * Subscribes a callback function to the given object's `eventName`.
	     * @method on
	     * @param {} object
	     * @param {string} eventNames
	     * @param {function} callback
	     */
	    Events.on = function(object, eventNames, callback) {
	        var names = eventNames.split(' '),
	            name;
	
	        for (var i = 0; i < names.length; i++) {
	            name = names[i];
	            object.events = object.events || {};
	            object.events[name] = object.events[name] || [];
	            object.events[name].push(callback);
	        }
	
	        return callback;
	    };
	
	    /**
	     * Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all events.
	     * @method off
	     * @param {} object
	     * @param {string} eventNames
	     * @param {function} callback
	     */
	    Events.off = function(object, eventNames, callback) {
	        if (!eventNames) {
	            object.events = {};
	            return;
	        }
	
	        // handle Events.off(object, callback)
	        if (typeof eventNames === 'function') {
	            callback = eventNames;
	            eventNames = Common.keys(object.events).join(' ');
	        }
	
	        var names = eventNames.split(' ');
	
	        for (var i = 0; i < names.length; i++) {
	            var callbacks = object.events[names[i]],
	                newCallbacks = [];
	
	            if (callback && callbacks) {
	                for (var j = 0; j < callbacks.length; j++) {
	                    if (callbacks[j] !== callback)
	                        newCallbacks.push(callbacks[j]);
	                }
	            }
	
	            object.events[names[i]] = newCallbacks;
	        }
	    };
	
	    /**
	     * Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
	     * @method trigger
	     * @param {} object
	     * @param {string} eventNames
	     * @param {} event
	     */
	    Events.trigger = function(object, eventNames, event) {
	        var names,
	            name,
	            callbacks,
	            eventClone;
	
	        if (object.events) {
	            if (!event)
	                event = {};
	
	            names = eventNames.split(' ');
	
	            for (var i = 0; i < names.length; i++) {
	                name = names[i];
	                callbacks = object.events[name];
	
	                if (callbacks) {
	                    eventClone = Common.clone(event, false);
	                    eventClone.name = name;
	                    eventClone.source = object;
	
	                    for (var j = 0; j < callbacks.length; j++) {
	                        callbacks[j].apply(object, [eventClone]);
	                    }
	                }
	            }
	        }
	    };
	
	})();
	},{"./Common":14}],17:[function(require,module,exports){
	},{"../body/Composite":2,"./Common":14}],18:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Mouse
	*/
	
	var Mouse = {};
	
	module.exports = Mouse;
	
	var Common = require('../core/Common');
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @param {HTMLElement} element
	     * @return {mouse} A new mouse
	     */
	    Mouse.create = function(element) {
	        var mouse = {};
	
	        if (!element) {
	            Common.log('Mouse.create: element was undefined, defaulting to document.body', 'warn');
	        }
	        
	        mouse.element = element || document.body;
	        mouse.absolute = { x: 0, y: 0 };
	        mouse.position = { x: 0, y: 0 };
	        mouse.mousedownPosition = { x: 0, y: 0 };
	        mouse.mouseupPosition = { x: 0, y: 0 };
	        mouse.offset = { x: 0, y: 0 };
	        mouse.scale = { x: 1, y: 1 };
	        mouse.wheelDelta = 0;
	        mouse.button = -1;
	        mouse.pixelRatio = mouse.element.getAttribute('data-pixel-ratio') || 1;
	
	        mouse.sourceEvents = {
	            mousemove: null,
	            mousedown: null,
	            mouseup: null,
	            mousewheel: null
	        };
	        
	        mouse.mousemove = function(event) { 
	            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
	                touches = event.changedTouches;
	
	            if (touches) {
	                mouse.button = 0;
	                event.preventDefault();
	            }
	
	            mouse.absolute.x = position.x;
	            mouse.absolute.y = position.y;
	            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	            mouse.sourceEvents.mousemove = event;
	        };
	        
	        mouse.mousedown = function(event) {
	            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
	                touches = event.changedTouches;
	
	            if (touches) {
	                mouse.button = 0;
	                event.preventDefault();
	            } else {
	                mouse.button = event.button;
	            }
	
	            mouse.absolute.x = position.x;
	            mouse.absolute.y = position.y;
	            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	            mouse.mousedownPosition.x = mouse.position.x;
	            mouse.mousedownPosition.y = mouse.position.y;
	            mouse.sourceEvents.mousedown = event;
	        };
	        
	        mouse.mouseup = function(event) {
	            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio),
	                touches = event.changedTouches;
	
	            if (touches) {
	                event.preventDefault();
	            }
	            
	            mouse.button = -1;
	            mouse.absolute.x = position.x;
	            mouse.absolute.y = position.y;
	            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	            mouse.mouseupPosition.x = mouse.position.x;
	            mouse.mouseupPosition.y = mouse.position.y;
	            mouse.sourceEvents.mouseup = event;
	        };
	
	        mouse.mousewheel = function(event) {
	            mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
	            event.preventDefault();
	        };
	
	        Mouse.setElement(mouse, mouse.element);
	
	        return mouse;
	    };
	
	    /**
	     * Sets the element the mouse is bound to (and relative to)
	     * @method setElement
	     * @param {mouse} mouse
	     * @param {HTMLElement} element
	     */
	    Mouse.setElement = function(mouse, element) {
	        mouse.element = element;
	
	        element.addEventListener('mousemove', mouse.mousemove);
	        element.addEventListener('mousedown', mouse.mousedown);
	        element.addEventListener('mouseup', mouse.mouseup);
	        
	        element.addEventListener("mousewheel", mouse.mousewheel);
	        element.addEventListener("DOMMouseScroll", mouse.mousewheel);
	
	        element.addEventListener('touchmove', mouse.mousemove);
	        element.addEventListener('touchstart', mouse.mousedown);
	        element.addEventListener('touchend', mouse.mouseup);
	    };
	
	    /**
	     * Clears all captured source events
	     * @method clearSourceEvents
	     * @param {mouse} mouse
	     */
	    Mouse.clearSourceEvents = function(mouse) {
	        mouse.sourceEvents.mousemove = null;
	        mouse.sourceEvents.mousedown = null;
	        mouse.sourceEvents.mouseup = null;
	        mouse.sourceEvents.mousewheel = null;
	        mouse.wheelDelta = 0;
	    };
	
	    /**
	     * Sets the offset
	     * @method setOffset
	     * @param {mouse} mouse
	     * @param {vector} offset
	     */
	    Mouse.setOffset = function(mouse, offset) {
	        mouse.offset.x = offset.x;
	        mouse.offset.y = offset.y;
	        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	    };
	
	    /**
	     * Sets the scale
	     * @method setScale
	     * @param {mouse} mouse
	     * @param {vector} scale
	     */
	    Mouse.setScale = function(mouse, scale) {
	        mouse.scale.x = scale.x;
	        mouse.scale.y = scale.y;
	        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
	        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
	    };
	    
	    /**
	     * Description
	     * @method _getRelativeMousePosition
	     * @private
	     * @param {} event
	     * @param {} element
	     * @param {number} pixelRatio
	     * @return {}
	     */
	    var _getRelativeMousePosition = function(event, element, pixelRatio) {
	        var elementBounds = element.getBoundingClientRect(),
	            rootNode = (document.documentElement || document.body.parentNode || document.body),
	            scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : rootNode.scrollLeft,
	            scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : rootNode.scrollTop,
	            touches = event.changedTouches,
	            x, y;
	        
	        if (touches) {
	            x = touches[0].pageX - elementBounds.left - scrollX;
	            y = touches[0].pageY - elementBounds.top - scrollY;
	        } else {
	            x = event.pageX - elementBounds.left - scrollX;
	            y = event.pageY - elementBounds.top - scrollY;
	        }
	
	        return { 
	            x: x / (element.clientWidth / element.width * pixelRatio),
	            y: y / (element.clientHeight / element.height * pixelRatio)
	        };
	    };
	
	})();
	
	},{"../core/Common":14}],19:[function(require,module,exports){
	/**
	* The `Matter.Runner` module is an optional utility which provides a game loop, 
	* that handles updating and rendering a `Matter.Engine` for you within a browser.
	* It is intended for demo and testing purposes, but may be adequate for simple games.
	* If you are using your own game loop instead, then you do not need the `Matter.Runner` module.
	* Instead just call `Engine.update(engine, delta)` in your own loop.
	* Note that the method `Engine.run` is an alias for `Runner.run`.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Runner
	*/
	
	var Runner = {};
	
	module.exports = Runner;
	
	var Events = require('./Events');
	var Engine = require('./Engine');
	var Common = require('./Common');
	
	(function() {
	
	    var _requestAnimationFrame,
	        _cancelAnimationFrame;
	
	    if (typeof window !== 'undefined') {
	        _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
	                                      || window.mozRequestAnimationFrame || window.msRequestAnimationFrame 
	                                      || function(callback){ window.setTimeout(function() { callback(Common.now()); }, 1000 / 60); };
	   
	        _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame 
	                                      || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
	    }
	
	    /**
	     * Creates a new Runner. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * @method create
	     * @param {} options
	     */
	    Runner.create = function(options) {
	        var defaults = {
	            fps: 60,
	            correction: 1,
	            deltaSampleSize: 60,
	            counterTimestamp: 0,
	            frameCounter: 0,
	            deltaHistory: [],
	            timePrev: null,
	            timeScalePrev: 1,
	            frameRequestId: null,
	            isFixed: false,
	            enabled: true
	        };
	
	        var runner = Common.extend(defaults, options);
	
	        runner.delta = runner.delta || 1000 / runner.fps;
	        runner.deltaMin = runner.deltaMin || 1000 / runner.fps;
	        runner.deltaMax = runner.deltaMax || 1000 / (runner.fps * 0.5);
	        runner.fps = 1000 / runner.delta;
	
	        return runner;
	    };
	
	    /**
	     * Continuously ticks a `Matter.Engine` by calling `Runner.tick` on the `requestAnimationFrame` event.
	     * @method run
	     * @param {engine} engine
	     */
	    Runner.run = function(runner, engine) {
	        // create runner if engine is first argument
	        if (typeof runner.positionIterations !== 'undefined') {
	            engine = runner;
	            runner = Runner.create();
	        }
	
	        (function render(time){
	            runner.frameRequestId = _requestAnimationFrame(render);
	
	            if (time && runner.enabled) {
	                Runner.tick(runner, engine, time);
	            }
	        })();
	
	        return runner;
	    };
	
	    /**
	     * A game loop utility that updates the engine and renderer by one step (a 'tick').
	     * Features delta smoothing, time correction and fixed or dynamic timing.
	     * Triggers `beforeTick`, `tick` and `afterTick` events on the engine.
	     * Consider just `Engine.update(engine, delta)` if you're using your own loop.
	     * @method tick
	     * @param {runner} runner
	     * @param {engine} engine
	     * @param {number} time
	     */
	    Runner.tick = function(runner, engine, time) {
	        var timing = engine.timing,
	            correction = 1,
	            delta;
	
	        // create an event object
	        var event = {
	            timestamp: timing.timestamp
	        };
	
	        Events.trigger(runner, 'beforeTick', event);
	        Events.trigger(engine, 'beforeTick', event); // @deprecated
	
	        if (runner.isFixed) {
	            // fixed timestep
	            delta = runner.delta;
	        } else {
	            // dynamic timestep based on wall clock between calls
	            delta = (time - runner.timePrev) || runner.delta;
	            runner.timePrev = time;
	
	            // optimistically filter delta over a few frames, to improve stability
	            runner.deltaHistory.push(delta);
	            runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize);
	            delta = Math.min.apply(null, runner.deltaHistory);
	            
	            // limit delta
	            delta = delta < runner.deltaMin ? runner.deltaMin : delta;
	            delta = delta > runner.deltaMax ? runner.deltaMax : delta;
	
	            // correction for delta
	            correction = delta / runner.delta;
	
	            // update engine timing object
	            runner.delta = delta;
	        }
	
	        // time correction for time scaling
	        if (runner.timeScalePrev !== 0)
	            correction *= timing.timeScale / runner.timeScalePrev;
	
	        if (timing.timeScale === 0)
	            correction = 0;
	
	        runner.timeScalePrev = timing.timeScale;
	        runner.correction = correction;
	
	        // fps counter
	        runner.frameCounter += 1;
	        if (time - runner.counterTimestamp >= 1000) {
	            runner.fps = runner.frameCounter * ((time - runner.counterTimestamp) / 1000);
	            runner.counterTimestamp = time;
	            runner.frameCounter = 0;
	        }
	
	        Events.trigger(runner, 'tick', event);
	        Events.trigger(engine, 'tick', event); // @deprecated
	
	        // if world has been modified, clear the render scene graph
	        if (engine.world.isModified 
	            && engine.render
	            && engine.render.controller
	            && engine.render.controller.clear) {
	            engine.render.controller.clear(engine.render);
	        }
	
	        // update
	        Events.trigger(runner, 'beforeUpdate', event);
	        Engine.update(engine, delta, correction);
	        Events.trigger(runner, 'afterUpdate', event);
	
	        // render
	        if (engine.render && engine.render.controller) {
	            Events.trigger(runner, 'beforeRender', event);
	            Events.trigger(engine, 'beforeRender', event); // @deprecated
	
	            engine.render.controller.world(engine);
	
	            Events.trigger(runner, 'afterRender', event);
	            Events.trigger(engine, 'afterRender', event); // @deprecated
	        }
	
	        Events.trigger(runner, 'afterTick', event);
	        Events.trigger(engine, 'afterTick', event); // @deprecated
	    };
	
	    /**
	     * Ends execution of `Runner.run` on the given `runner`, by canceling the animation frame request event loop.
	     * If you wish to only temporarily pause the engine, see `engine.enabled` instead.
	     * @method stop
	     * @param {runner} runner
	     */
	    Runner.stop = function(runner) {
	        _cancelAnimationFrame(runner.frameRequestId);
	    };
	
	    /*
	    *
	    *  Events Documentation
	    *
	    */
	
	    /**
	    * Fired at the start of a tick, before any updates to the engine or timing
	    *
	    * @event beforeTick
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after engine timing updated, but just before update
	    *
	    * @event tick
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired at the end of a tick, after engine update and after rendering
	    *
	    * @event afterTick
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired before update
	    *
	    * @event beforeUpdate
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after update
	    *
	    * @event afterUpdate
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired before rendering
	    *
	    * @event beforeRender
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after rendering
	    *
	    * @event afterRender
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * A flag that specifies whether the runner is running or not.
	     *
	     * @property enabled
	     * @type boolean
	     * @default true
	     */
	
	    /**
	     * A `Boolean` that specifies if the runner should use a fixed timestep (otherwise it is variable).
	     * If timing is fixed, then the apparent simulation speed will change depending on the frame rate (but behaviour will be deterministic).
	     * If the timing is variable, then the apparent simulation speed will be constant (approximately, but at the cost of determininism).
	     *
	     * @property isFixed
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * A `Number` that specifies the time step between updates in milliseconds.
	     * If `engine.timing.isFixed` is set to `true`, then `delta` is fixed.
	     * If it is `false`, then `delta` can dynamically change to maintain the correct apparent simulation speed.
	     *
	     * @property delta
	     * @type number
	     * @default 1000 / 60
	     */
	
	})();
	
	},{"./Common":14,"./Engine":15,"./Events":16}],20:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Sleeping
	*/
	
	var Sleeping = {};
	
	module.exports = Sleeping;
	
	var Events = require('./Events');
	
	(function() {
	
	    Sleeping._motionWakeThreshold = 0.18;
	    Sleeping._motionSleepThreshold = 0.08;
	    Sleeping._minBias = 0.9;
	
	    /**
	     * Puts bodies to sleep or wakes them up depending on their motion.
	     * @method update
	     * @param {body[]} bodies
	     * @param {number} timeScale
	     */
	    Sleeping.update = function(bodies, timeScale) {
	        var timeFactor = timeScale * timeScale * timeScale;
	
	        // update bodies sleeping status
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                motion = body.speed * body.speed + body.angularSpeed * body.angularSpeed;
	
	            // wake up bodies if they have a force applied
	            if (body.force.x !== 0 || body.force.y !== 0) {
	                Sleeping.set(body, false);
	                continue;
	            }
	
	            var minMotion = Math.min(body.motion, motion),
	                maxMotion = Math.max(body.motion, motion);
	        
	            // biased average motion estimation between frames
	            body.motion = Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;
	            
	            if (body.sleepThreshold > 0 && body.motion < Sleeping._motionSleepThreshold * timeFactor) {
	                body.sleepCounter += 1;
	                
	                if (body.sleepCounter >= body.sleepThreshold)
	                    Sleeping.set(body, true);
	            } else if (body.sleepCounter > 0) {
	                body.sleepCounter -= 1;
	            }
	        }
	    };
	
	    /**
	     * Given a set of colliding pairs, wakes the sleeping bodies involved.
	     * @method afterCollisions
	     * @param {pair[]} pairs
	     * @param {number} timeScale
	     */
	    Sleeping.afterCollisions = function(pairs, timeScale) {
	        var timeFactor = timeScale * timeScale * timeScale;
	
	        // wake up bodies involved in collisions
	        for (var i = 0; i < pairs.length; i++) {
	            var pair = pairs[i];
	            
	            // don't wake inactive pairs
	            if (!pair.isActive)
	                continue;
	
	            var collision = pair.collision,
	                bodyA = collision.bodyA.parent, 
	                bodyB = collision.bodyB.parent;
	        
	            // don't wake if at least one body is static
	            if ((bodyA.isSleeping && bodyB.isSleeping) || bodyA.isStatic || bodyB.isStatic)
	                continue;
	        
	            if (bodyA.isSleeping || bodyB.isSleeping) {
	                var sleepingBody = (bodyA.isSleeping && !bodyA.isStatic) ? bodyA : bodyB,
	                    movingBody = sleepingBody === bodyA ? bodyB : bodyA;
	
	                if (!sleepingBody.isStatic && movingBody.motion > Sleeping._motionWakeThreshold * timeFactor) {
	                    Sleeping.set(sleepingBody, false);
	                }
	            }
	        }
	    };
	  
	    /**
	     * Description
	     * @method set
	     * @param {body} body
	     * @param {boolean} isSleeping
	     */
	    Sleeping.set = function(body, isSleeping) {
	        var wasSleeping = body.isSleeping;
	
	        if (isSleeping) {
	            body.isSleeping = true;
	            body.sleepCounter = body.sleepThreshold;
	
	            body.positionImpulse.x = 0;
	            body.positionImpulse.y = 0;
	
	            body.positionPrev.x = body.position.x;
	            body.positionPrev.y = body.position.y;
	
	            body.anglePrev = body.angle;
	            body.speed = 0;
	            body.angularSpeed = 0;
	            body.motion = 0;
	
	            if (!wasSleeping) {
	                Events.trigger(body, 'sleepStart');
	            }
	        } else {
	            body.isSleeping = false;
	            body.sleepCounter = 0;
	
	            if (wasSleeping) {
	                Events.trigger(body, 'sleepEnd');
	            }
	        }
	    };
	
	})();
	},{"./Events":16}],21:[function(require,module,exports){
	/**
	* The `Matter.Bodies` module contains factory methods for creating rigid body models 
	* with commonly used body configurations (such as rectangles, circles and other polygons).
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Bodies
	*/
	
	// TODO: true circle bodies
	
	var Bodies = {};
	
	module.exports = Bodies;
	
	var Vertices = require('../geometry/Vertices');
	var Common = require('../core/Common');
	var Body = require('../body/Body');
	var Bounds = require('../geometry/Bounds');
	var Vector = require('../geometry/Vector');
	
	(function() {
	
	    /**
	     * Creates a new rigid body model with a rectangle hull. 
	     * The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method rectangle
	     * @param {number} x
	     * @param {number} y
	     * @param {number} width
	     * @param {number} height
	     * @param {object} [options]
	     * @return {body} A new rectangle body
	     */
	    Bodies.rectangle = function(x, y, width, height, options) {
	        options = options || {};
	
	        var rectangle = { 
	            label: 'Rectangle Body',
	            position: { x: x, y: y },
	            vertices: Vertices.fromPath('L 0 0 L ' + width + ' 0 L ' + width + ' ' + height + ' L 0 ' + height)
	        };
	
	        if (options.chamfer) {
	            var chamfer = options.chamfer;
	            rectangle.vertices = Vertices.chamfer(rectangle.vertices, chamfer.radius, 
	                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
	            delete options.chamfer;
	        }
	
	        return Body.create(Common.extend({}, rectangle, options));
	    };
	    
	    /**
	     * Creates a new rigid body model with a trapezoid hull. 
	     * The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method trapezoid
	     * @param {number} x
	     * @param {number} y
	     * @param {number} width
	     * @param {number} height
	     * @param {number} slope
	     * @param {object} [options]
	     * @return {body} A new trapezoid body
	     */
	    Bodies.trapezoid = function(x, y, width, height, slope, options) {
	        options = options || {};
	
	        slope *= 0.5;
	        var roof = (1 - (slope * 2)) * width;
	        
	        var x1 = width * slope,
	            x2 = x1 + roof,
	            x3 = x2 + x1;
	
	        var trapezoid = { 
	            label: 'Trapezoid Body',
	            position: { x: x, y: y },
	            vertices: Vertices.fromPath('L 0 0 L ' + x1 + ' ' + (-height) + ' L ' + x2 + ' ' + (-height) + ' L ' + x3 + ' 0')
	        };
	
	        if (options.chamfer) {
	            var chamfer = options.chamfer;
	            trapezoid.vertices = Vertices.chamfer(trapezoid.vertices, chamfer.radius, 
	                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
	            delete options.chamfer;
	        }
	
	        return Body.create(Common.extend({}, trapezoid, options));
	    };
	
	    /**
	     * Creates a new rigid body model with a circle hull. 
	     * The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method circle
	     * @param {number} x
	     * @param {number} y
	     * @param {number} radius
	     * @param {object} [options]
	     * @param {number} [maxSides]
	     * @return {body} A new circle body
	     */
	    Bodies.circle = function(x, y, radius, options, maxSides) {
	        options = options || {};
	        options.label = 'Circle Body';
	        
	        // approximate circles with polygons until true circles implemented in SAT
	
	        maxSides = maxSides || 25;
	        var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));
	
	        // optimisation: always use even number of sides (half the number of unique axes)
	        if (sides % 2 === 1)
	            sides += 1;
	
	        // flag for better rendering
	        options.circleRadius = radius;
	
	        return Bodies.polygon(x, y, sides, radius, options);
	    };
	
	    /**
	     * Creates a new rigid body model with a regular polygon hull with the given number of sides. 
	     * The options parameter is an object that specifies any properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method polygon
	     * @param {number} x
	     * @param {number} y
	     * @param {number} sides
	     * @param {number} radius
	     * @param {object} [options]
	     * @return {body} A new regular polygon body
	     */
	    Bodies.polygon = function(x, y, sides, radius, options) {
	        options = options || {};
	
	        if (sides < 3)
	            return Bodies.circle(x, y, radius, options);
	
	        var theta = 2 * Math.PI / sides,
	            path = '',
	            offset = theta * 0.5;
	
	        for (var i = 0; i < sides; i += 1) {
	            var angle = offset + (i * theta),
	                xx = Math.cos(angle) * radius,
	                yy = Math.sin(angle) * radius;
	
	            path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
	        }
	
	        var polygon = { 
	            label: 'Polygon Body',
	            position: { x: x, y: y },
	            vertices: Vertices.fromPath(path)
	        };
	
	        if (options.chamfer) {
	            var chamfer = options.chamfer;
	            polygon.vertices = Vertices.chamfer(polygon.vertices, chamfer.radius, 
	                                    chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
	            delete options.chamfer;
	        }
	
	        return Body.create(Common.extend({}, polygon, options));
	    };
	
	    /**
	     * Creates a body using the supplied vertices (or an array containing multiple sets of vertices).
	     * If the vertices are convex, they will pass through as supplied.
	     * Otherwise if the vertices are concave, they will be decomposed if [poly-decomp.js](https://github.com/schteppe/poly-decomp.js) is available.
	     * Note that this process is not guaranteed to support complex sets of vertices (e.g. those with holes may fail).
	     * By default the decomposition will discard collinear edges (to improve performance).
	     * It can also optionally discard any parts that have an area less than `minimumArea`.
	     * If the vertices can not be decomposed, the result will fall back to using the convex hull.
	     * The options parameter is an object that specifies any `Matter.Body` properties you wish to override the defaults.
	     * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
	     * @method fromVertices
	     * @param {number} x
	     * @param {number} y
	     * @param [[vector]] vertexSets
	     * @param {object} [options]
	     * @param {bool} [flagInternal=false]
	     * @param {number} [removeCollinear=0.01]
	     * @param {number} [minimumArea=10]
	     * @return {body}
	     */
	    Bodies.fromVertices = function(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea) {
	        var body,
	            parts,
	            isConvex,
	            vertices,
	            i,
	            j,
	            k,
	            v,
	            z;
	
	        options = options || {};
	        parts = [];
	
	        flagInternal = typeof flagInternal !== 'undefined' ? flagInternal : false;
	        removeCollinear = typeof removeCollinear !== 'undefined' ? removeCollinear : 0.01;
	        minimumArea = typeof minimumArea !== 'undefined' ? minimumArea : 10;
	
	        if (!window.decomp) {
	            Common.log('Bodies.fromVertices: poly-decomp.js required. Could not decompose vertices. Fallback to convex hull.', 'warn');
	        }
	
	        // ensure vertexSets is an array of arrays
	        if (!Common.isArray(vertexSets[0])) {
	            vertexSets = [vertexSets];
	        }
	
	        for (v = 0; v < vertexSets.length; v += 1) {
	            vertices = vertexSets[v];
	            isConvex = Vertices.isConvex(vertices);
	
	            if (isConvex || !window.decomp) {
	                if (isConvex) {
	                    vertices = Vertices.clockwiseSort(vertices);
	                } else {
	                    // fallback to convex hull when decomposition is not possible
	                    vertices = Vertices.hull(vertices);
	                }
	
	                parts.push({
	                    position: { x: x, y: y },
	                    vertices: vertices
	                });
	            } else {
	                // initialise a decomposition
	                var concave = new decomp.Polygon();
	                for (i = 0; i < vertices.length; i++) {
	                    concave.vertices.push([vertices[i].x, vertices[i].y]);
	                }
	
	                // vertices are concave and simple, we can decompose into parts
	                concave.makeCCW();
	                if (removeCollinear !== false)
	                    concave.removeCollinearPoints(removeCollinear);
	
	                // use the quick decomposition algorithm (Bayazit)
	                var decomposed = concave.quickDecomp();
	
	                // for each decomposed chunk
	                for (i = 0; i < decomposed.length; i++) {
	                    var chunk = decomposed[i],
	                        chunkVertices = [];
	
	                    // convert vertices into the correct structure
	                    for (j = 0; j < chunk.vertices.length; j++) {
	                        chunkVertices.push({ x: chunk.vertices[j][0], y: chunk.vertices[j][1] });
	                    }
	
	                    // skip small chunks
	                    if (minimumArea > 0 && Vertices.area(chunkVertices) < minimumArea)
	                        continue;
	
	                    // create a compound part
	                    parts.push({
	                        position: Vertices.centre(chunkVertices),
	                        vertices: chunkVertices
	                    });
	                }
	            }
	        }
	
	        // create body parts
	        for (i = 0; i < parts.length; i++) {
	            parts[i] = Body.create(Common.extend(parts[i], options));
	        }
	
	        // flag internal edges (coincident part edges)
	        if (flagInternal) {
	            var coincident_max_dist = 5;
	
	            for (i = 0; i < parts.length; i++) {
	                var partA = parts[i];
	
	                for (j = i + 1; j < parts.length; j++) {
	                    var partB = parts[j];
	
	                    if (Bounds.overlaps(partA.bounds, partB.bounds)) {
	                        var pav = partA.vertices,
	                            pbv = partB.vertices;
	
	                        // iterate vertices of both parts
	                        for (k = 0; k < partA.vertices.length; k++) {
	                            for (z = 0; z < partB.vertices.length; z++) {
	                                // find distances between the vertices
	                                var da = Vector.magnitudeSquared(Vector.sub(pav[(k + 1) % pav.length], pbv[z])),
	                                    db = Vector.magnitudeSquared(Vector.sub(pav[k], pbv[(z + 1) % pbv.length]));
	
	                                // if both vertices are very close, consider the edge concident (internal)
	                                if (da < coincident_max_dist && db < coincident_max_dist) {
	                                    pav[k].isInternal = true;
	                                    pbv[z].isInternal = true;
	                                }
	                            }
	                        }
	
	                    }
	                }
	            }
	        }
	
	        if (parts.length > 1) {
	            // create the parent body to be returned, that contains generated compound parts
	            body = Body.create(Common.extend({ parts: parts.slice(0) }, options));
	            Body.setPosition(body, { x: x, y: y });
	
	            return body;
	        } else {
	            return parts[0];
	        }
	    };
	
	})();
	},{"../body/Body":1,"../core/Common":14,"../geometry/Bounds":24,"../geometry/Vector":26,"../geometry/Vertices":27}],22:[function(require,module,exports){
	/**
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Composites
	*/
	
	var Composites = {};
	
	module.exports = Composites;
	
	var Composite = require('../body/Composite');
	var Constraint = require('../constraint/Constraint');
	var Common = require('../core/Common');
	var Body = require('../body/Body');
	var Bodies = require('./Bodies');
	
	(function() {
	
	    /**
	     * Description
	     * @method stack
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} columns
	     * @param {number} rows
	     * @param {number} columnGap
	     * @param {number} rowGap
	     * @param {function} callback
	     * @return {composite} A new composite containing objects created in the callback
	     */
	    Composites.stack = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
	        var stack = Composite.create({ label: 'Stack' }),
	            x = xx,
	            y = yy,
	            lastBody,
	            i = 0;
	
	        for (var row = 0; row < rows; row++) {
	            var maxHeight = 0;
	            
	            for (var column = 0; column < columns; column++) {
	                var body = callback(x, y, column, row, lastBody, i);
	                    
	                if (body) {
	                    var bodyHeight = body.bounds.max.y - body.bounds.min.y,
	                        bodyWidth = body.bounds.max.x - body.bounds.min.x; 
	
	                    if (bodyHeight > maxHeight)
	                        maxHeight = bodyHeight;
	                    
	                    Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });
	
	                    x = body.bounds.max.x + columnGap;
	
	                    Composite.addBody(stack, body);
	                    
	                    lastBody = body;
	                    i += 1;
	                } else {
	                    x += columnGap;
	                }
	            }
	            
	            y += maxHeight + rowGap;
	            x = xx;
	        }
	
	        return stack;
	    };
	    
	    /**
	     * Description
	     * @method chain
	     * @param {composite} composite
	     * @param {number} xOffsetA
	     * @param {number} yOffsetA
	     * @param {number} xOffsetB
	     * @param {number} yOffsetB
	     * @param {object} options
	     * @return {composite} A new composite containing objects chained together with constraints
	     */
	    Composites.chain = function(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) {
	        var bodies = composite.bodies;
	        
	        for (var i = 1; i < bodies.length; i++) {
	            var bodyA = bodies[i - 1],
	                bodyB = bodies[i],
	                bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y,
	                bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x, 
	                bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y,
	                bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;
	        
	            var defaults = {
	                bodyA: bodyA,
	                pointA: { x: bodyAWidth * xOffsetA, y: bodyAHeight * yOffsetA },
	                bodyB: bodyB,
	                pointB: { x: bodyBWidth * xOffsetB, y: bodyBHeight * yOffsetB }
	            };
	            
	            var constraint = Common.extend(defaults, options);
	        
	            Composite.addConstraint(composite, Constraint.create(constraint));
	        }
	
	        composite.label += ' Chain';
	        
	        return composite;
	    };
	
	    /**
	     * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces
	     * @method mesh
	     * @param {composite} composite
	     * @param {number} columns
	     * @param {number} rows
	     * @param {boolean} crossBrace
	     * @param {object} options
	     * @return {composite} The composite containing objects meshed together with constraints
	     */
	    Composites.mesh = function(composite, columns, rows, crossBrace, options) {
	        var bodies = composite.bodies,
	            row,
	            col,
	            bodyA,
	            bodyB,
	            bodyC;
	        
	        for (row = 0; row < rows; row++) {
	            for (col = 1; col < columns; col++) {
	                bodyA = bodies[(col - 1) + (row * columns)];
	                bodyB = bodies[col + (row * columns)];
	                Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
	            }
	
	            if (row > 0) {
	                for (col = 0; col < columns; col++) {
	                    bodyA = bodies[col + ((row - 1) * columns)];
	                    bodyB = bodies[col + (row * columns)];
	                    Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
	
	                    if (crossBrace && col > 0) {
	                        bodyC = bodies[(col - 1) + ((row - 1) * columns)];
	                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
	                    }
	
	                    if (crossBrace && col < columns - 1) {
	                        bodyC = bodies[(col + 1) + ((row - 1) * columns)];
	                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
	                    }
	                }
	            }
	        }
	
	        composite.label += ' Mesh';
	        
	        return composite;
	    };
	    
	    /**
	     * Description
	     * @method pyramid
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} columns
	     * @param {number} rows
	     * @param {number} columnGap
	     * @param {number} rowGap
	     * @param {function} callback
	     * @return {composite} A new composite containing objects created in the callback
	     */
	    Composites.pyramid = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
	        return Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y, column, row, lastBody, i) {
	            var actualRows = Math.min(rows, Math.ceil(columns / 2)),
	                lastBodyWidth = lastBody ? lastBody.bounds.max.x - lastBody.bounds.min.x : 0;
	            
	            if (row > actualRows)
	                return;
	            
	            // reverse row order
	            row = actualRows - row;
	            
	            var start = row,
	                end = columns - 1 - row;
	
	            if (column < start || column > end)
	                return;
	            
	            // retroactively fix the first body's position, since width was unknown
	            if (i === 1) {
	                Body.translate(lastBody, { x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth, y: 0 });
	            }
	
	            var xOffset = lastBody ? column * lastBodyWidth : 0;
	            
	            return callback(xx + xOffset + column * columnGap, y, column, row, lastBody, i);
	        });
	    };
	
	    /**
	     * Description
	     * @method newtonsCradle
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} number
	     * @param {number} size
	     * @param {number} length
	     * @return {composite} A new composite newtonsCradle body
	     */
	    Composites.newtonsCradle = function(xx, yy, number, size, length) {
	        var newtonsCradle = Composite.create({ label: 'Newtons Cradle' });
	
	        for (var i = 0; i < number; i++) {
	            var separation = 1.9,
	                circle = Bodies.circle(xx + i * (size * separation), yy + length, size, 
	                            { inertia: 99999, restitution: 1, friction: 0, frictionAir: 0.0001, slop: 0.01 }),
	                constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle });
	
	            Composite.addBody(newtonsCradle, circle);
	            Composite.addConstraint(newtonsCradle, constraint);
	        }
	
	        return newtonsCradle;
	    };
	    
	    /**
	     * Description
	     * @method car
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} width
	     * @param {number} height
	     * @param {number} wheelSize
	     * @return {composite} A new composite car body
	     */
	    Composites.car = function(xx, yy, width, height, wheelSize) {
	        var group = Body.nextGroup(true),
	            wheelBase = -20,
	            wheelAOffset = -width * 0.5 + wheelBase,
	            wheelBOffset = width * 0.5 - wheelBase,
	            wheelYOffset = 0;
	    
	        var car = Composite.create({ label: 'Car' }),
	            body = Bodies.trapezoid(xx, yy, width, height, 0.3, { 
	                collisionFilter: {
	                    group: group
	                },
	                friction: 0.01,
	                chamfer: {
	                    radius: 10
	                }
	            });
	    
	        var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, { 
	            collisionFilter: {
	                group: group
	            },
	            restitution: 0.5, 
	            friction: 0.9,
	            frictionStatic: 10,
	            slop: 0.5,
	            density: 0.01
	        });
	                    
	        var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, { 
	            collisionFilter: {
	                group: group
	            },
	            restitution: 0.5, 
	            friction: 0.9,
	            frictionStatic: 10,
	            slop: 0.5,
	            density: 0.01
	        });
	                    
	        var axelA = Constraint.create({
	            bodyA: body,
	            pointA: { x: wheelAOffset, y: wheelYOffset },
	            bodyB: wheelA,
	            stiffness: 0.5
	        });
	                        
	        var axelB = Constraint.create({
	            bodyA: body,
	            pointA: { x: wheelBOffset, y: wheelYOffset },
	            bodyB: wheelB,
	            stiffness: 0.5
	        });
	        
	        Composite.addBody(car, body);
	        Composite.addBody(car, wheelA);
	        Composite.addBody(car, wheelB);
	        Composite.addConstraint(car, axelA);
	        Composite.addConstraint(car, axelB);
	
	        return car;
	    };
	
	    /**
	     * Creates a simple soft body like object
	     * @method softBody
	     * @param {number} xx
	     * @param {number} yy
	     * @param {number} columns
	     * @param {number} rows
	     * @param {number} columnGap
	     * @param {number} rowGap
	     * @param {boolean} crossBrace
	     * @param {number} particleRadius
	     * @param {} particleOptions
	     * @param {} constraintOptions
	     * @return {composite} A new composite softBody
	     */
	    Composites.softBody = function(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
	        particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
	        constraintOptions = Common.extend({ stiffness: 0.4 }, constraintOptions);
	
	        var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
	            return Bodies.circle(x, y, particleRadius, particleOptions);
	        });
	
	        Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
	
	        softBody.label = 'Soft Body';
	
	        return softBody;
	    };
	
	})();
	
	},{"../body/Body":1,"../body/Composite":2,"../constraint/Constraint":12,"../core/Common":14,"./Bodies":21}],23:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Axes
	*/
	
	var Axes = {};
	
	module.exports = Axes;
	
	var Vector = require('../geometry/Vector');
	var Common = require('../core/Common');
	
	(function() {
	
	    /**
	     * Description
	     * @method fromVertices
	     * @param {vertices} vertices
	     * @return {axes} A new axes from the given vertices
	     */
	    Axes.fromVertices = function(vertices) {
	        var axes = {};
	
	        // find the unique axes, using edge normal gradients
	        for (var i = 0; i < vertices.length; i++) {
	            var j = (i + 1) % vertices.length, 
	                normal = Vector.normalise({ 
	                    x: vertices[j].y - vertices[i].y, 
	                    y: vertices[i].x - vertices[j].x
	                }),
	                gradient = (normal.y === 0) ? Infinity : (normal.x / normal.y);
	            
	            // limit precision
	            gradient = gradient.toFixed(3).toString();
	            axes[gradient] = normal;
	        }
	
	        return Common.values(axes);
	    };
	
	    /**
	     * Description
	     * @method rotate
	     * @param {axes} axes
	     * @param {number} angle
	     */
	    Axes.rotate = function(axes, angle) {
	        if (angle === 0)
	            return;
	        
	        var cos = Math.cos(angle),
	            sin = Math.sin(angle);
	
	        for (var i = 0; i < axes.length; i++) {
	            var axis = axes[i],
	                xx;
	            xx = axis.x * cos - axis.y * sin;
	            axis.y = axis.x * sin + axis.y * cos;
	            axis.x = xx;
	        }
	    };
	
	})();
	},{"../core/Common":14,"../geometry/Vector":26}],24:[function(require,module,exports){
	/**
	* _Internal Class_, not generally used outside of the engine's internals.
	*
	* @class Bounds
	*/
	
	var Bounds = {};
	
	module.exports = Bounds;
	
	(function() {
	
	    /**
	     * Description
	     * @method create
	     * @param {vertices} vertices
	     * @return {bounds} A new bounds object
	     */
	    Bounds.create = function(vertices) {
	        var bounds = { 
	            min: { x: 0, y: 0 }, 
	            max: { x: 0, y: 0 }
	        };
	
	        if (vertices)
	            Bounds.update(bounds, vertices);
	        
	        return bounds;
	    };
	
	    /**
	     * Description
	     * @method update
	     * @param {bounds} bounds
	     * @param {vertices} vertices
	     * @param {vector} velocity
	     */
	    Bounds.update = function(bounds, vertices, velocity) {
	        bounds.min.x = Number.MAX_VALUE;
	        bounds.max.x = Number.MIN_VALUE;
	        bounds.min.y = Number.MAX_VALUE;
	        bounds.max.y = Number.MIN_VALUE;
	
	        for (var i = 0; i < vertices.length; i++) {
	            var vertex = vertices[i];
	            if (vertex.x > bounds.max.x) bounds.max.x = vertex.x;
	            if (vertex.x < bounds.min.x) bounds.min.x = vertex.x;
	            if (vertex.y > bounds.max.y) bounds.max.y = vertex.y;
	            if (vertex.y < bounds.min.y) bounds.min.y = vertex.y;
	        }
	        
	        if (velocity) {
	            if (velocity.x > 0) {
	                bounds.max.x += velocity.x;
	            } else {
	                bounds.min.x += velocity.x;
	            }
	            
	            if (velocity.y > 0) {
	                bounds.max.y += velocity.y;
	            } else {
	                bounds.min.y += velocity.y;
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @method contains
	     * @param {bounds} bounds
	     * @param {vector} point
	     * @return {boolean} True if the bounds contain the point, otherwise false
	     */
	    Bounds.contains = function(bounds, point) {
	        return point.x >= bounds.min.x && point.x <= bounds.max.x 
	               && point.y >= bounds.min.y && point.y <= bounds.max.y;
	    };
	
	    /**
	     * Description
	     * @method overlaps
	     * @param {bounds} boundsA
	     * @param {bounds} boundsB
	     * @return {boolean} True if the bounds overlap, otherwise false
	     */
	    Bounds.overlaps = function(boundsA, boundsB) {
	        return (boundsA.min.x <= boundsB.max.x && boundsA.max.x >= boundsB.min.x
	                && boundsA.max.y >= boundsB.min.y && boundsA.min.y <= boundsB.max.y);
	    };
	
	    /**
	     * Translates the bounds by the given vector
	     * @method translate
	     * @param {bounds} bounds
	     * @param {vector} vector
	     */
	    Bounds.translate = function(bounds, vector) {
	        bounds.min.x += vector.x;
	        bounds.max.x += vector.x;
	        bounds.min.y += vector.y;
	        bounds.max.y += vector.y;
	    };
	
	    /**
	     * Shifts the bounds to the given position
	     * @method shift
	     * @param {bounds} bounds
	     * @param {vector} position
	     */
	    Bounds.shift = function(bounds, position) {
	        var deltaX = bounds.max.x - bounds.min.x,
	            deltaY = bounds.max.y - bounds.min.y;
	            
	        bounds.min.x = position.x;
	        bounds.max.x = position.x + deltaX;
	        bounds.min.y = position.y;
	        bounds.max.y = position.y + deltaY;
	    };
	    
	})();
	},{}],25:[function(require,module,exports){
	/**
	* The `Matter.Svg` module contains methods for converting SVG images into an array of vector points.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Svg
	*/
	
	var Svg = {};
	
	module.exports = Svg;
	
	var Bounds = require('../geometry/Bounds');
	
	(function() {
	
	    /**
	     * Converts an SVG path into an array of vector points.
	     * If the input path forms a concave shape, you must decompose the result into convex parts before use.
	     * See `Bodies.fromVertices` which provides support for this.
	     * Note that this function is not guaranteed to support complex paths (such as those with holes).
	     * @method pathToVertices
	     * @param {SVGPathElement} path
	     * @param {Number} [sampleLength=15]
	     * @return {Vector[]} points
	     */
	    Svg.pathToVertices = function(path, sampleLength) {
	        // https://github.com/wout/svg.topoly.js/blob/master/svg.topoly.js
	        var i, il, total, point, segment, segments, 
	            segmentsQueue, lastSegment, 
	            lastPoint, segmentIndex, points = [],
	            lx, ly, length = 0, x = 0, y = 0;
	
	        sampleLength = sampleLength || 15;
	
	        var addPoint = function(px, py, pathSegType) {
	            // all odd-numbered path types are relative except PATHSEG_CLOSEPATH (1)
	            var isRelative = pathSegType % 2 === 1 && pathSegType > 1;
	
	            // when the last point doesn't equal the current point add the current point
	            if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
	                if (lastPoint && isRelative) {
	                    lx = lastPoint.x;
	                    ly = lastPoint.y;
	                } else {
	                    lx = 0;
	                    ly = 0;
	                }
	
	                var point = {
	                    x: lx + px,
	                    y: ly + py
	                };
	
	                // set last point
	                if (isRelative || !lastPoint) {
	                    lastPoint = point;
	                }
	
	                points.push(point);
	
	                x = lx + px;
	                y = ly + py;
	            }
	        };
	
	        var addSegmentPoint = function(segment) {
	            var segType = segment.pathSegTypeAsLetter.toUpperCase();
	
	            // skip path ends
	            if (segType === 'Z') 
	                return;
	
	            // map segment to x and y
	            switch (segType) {
	
	            case 'M':
	            case 'L':
	            case 'T':
	            case 'C':
	            case 'S':
	            case 'Q':
	                x = segment.x;
	                y = segment.y;
	                break;
	            case 'H':
	                x = segment.x;
	                break;
	            case 'V':
	                y = segment.y;
	                break;
	            }
	
	            addPoint(x, y, segment.pathSegType);
	        };
	
	        // ensure path is absolute
	        _svgPathToAbsolute(path);
	
	        // get total length
	        total = path.getTotalLength();
	
	        // queue segments
	        segments = [];
	        for (i = 0; i < path.pathSegList.numberOfItems; i += 1)
	            segments.push(path.pathSegList.getItem(i));
	
	        segmentsQueue = segments.concat();
	
	        // sample through path
	        while (length < total) {
	            // get segment at position
	            segmentIndex = path.getPathSegAtLength(length);
	            segment = segments[segmentIndex];
	
	            // new segment
	            if (segment != lastSegment) {
	                while (segmentsQueue.length && segmentsQueue[0] != segment)
	                    addSegmentPoint(segmentsQueue.shift());
	
	                lastSegment = segment;
	            }
	
	            // add points in between when curving
	            // TODO: adaptive sampling
	            switch (segment.pathSegTypeAsLetter.toUpperCase()) {
	
	            case 'C':
	            case 'T':
	            case 'S':
	            case 'Q':
	            case 'A':
	                point = path.getPointAtLength(length);
	                addPoint(point.x, point.y, 0);
	                break;
	
	            }
	
	            // increment by sample value
	            length += sampleLength;
	        }
	
	        // add remaining segments not passed by sampling
	        for (i = 0, il = segmentsQueue.length; i < il; ++i)
	            addSegmentPoint(segmentsQueue[i]);
	
	        return points;
	    };
	
	    var _svgPathToAbsolute = function(path) {
	        // http://phrogz.net/convert-svg-path-to-all-absolute-commands
	        var x0, y0, x1, y1, x2, y2, segs = path.pathSegList,
	            x = 0, y = 0, len = segs.numberOfItems;
	
	        for (var i = 0; i < len; ++i) {
	            var seg = segs.getItem(i),
	                segType = seg.pathSegTypeAsLetter;
	
	            if (/[MLHVCSQTA]/.test(segType)) {
	                if ('x' in seg) x = seg.x;
	                if ('y' in seg) y = seg.y;
	            } else {
	                if ('x1' in seg) x1 = x + seg.x1;
	                if ('x2' in seg) x2 = x + seg.x2;
	                if ('y1' in seg) y1 = y + seg.y1;
	                if ('y2' in seg) y2 = y + seg.y2;
	                if ('x' in seg) x += seg.x;
	                if ('y' in seg) y += seg.y;
	
	                switch (segType) {
	
	                case 'm':
	                    segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
	                    break;
	                case 'l':
	                    segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
	                    break;
	                case 'h':
	                    segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
	                    break;
	                case 'v':
	                    segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
	                    break;
	                case 'c':
	                    segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
	                    break;
	                case 's':
	                    segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
	                    break;
	                case 'q':
	                    segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
	                    break;
	                case 't':
	                    segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
	                    break;
	                case 'a':
	                    segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
	                    break;
	                case 'z':
	                case 'Z':
	                    x = x0;
	                    y = y0;
	                    break;
	
	                }
	            }
	
	            if (segType == 'M' || segType == 'm') {
	                x0 = x;
	                y0 = y;
	            }
	        }
	    };
	
	})();
	},{"../geometry/Bounds":24}],26:[function(require,module,exports){
	/**
	* The `Matter.Vector` module contains methods for creating and manipulating vectors.
	* Vectors are the basis of all the geometry related operations in the engine.
	* A `Matter.Vector` object is of the form `{ x: 0, y: 0 }`.
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Vector
	*/
	
	// TODO: consider params for reusing vector objects
	
	var Vector = {};
	
	module.exports = Vector;
	
	(function() {
	
	    /**
	     * Creates a new vector.
	     * @method create
	     * @param {number} x
	     * @param {number} y
	     * @return {vector} A new vector
	     */
	    Vector.create = function(x, y) {
	        return { x: x || 0, y: y || 0 };
	    };
	
	    /**
	     * Returns a new vector with `x` and `y` copied from the given `vector`.
	     * @method clone
	     * @param {vector} vector
	     * @return {vector} A new cloned vector
	     */
	    Vector.clone = function(vector) {
	        return { x: vector.x, y: vector.y };
	    };
	
	    /**
	     * Returns the magnitude (length) of a vector.
	     * @method magnitude
	     * @param {vector} vector
	     * @return {number} The magnitude of the vector
	     */
	    Vector.magnitude = function(vector) {
	        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
	    };
	
	    /**
	     * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
	     * @method magnitudeSquared
	     * @param {vector} vector
	     * @return {number} The squared magnitude of the vector
	     */
	    Vector.magnitudeSquared = function(vector) {
	        return (vector.x * vector.x) + (vector.y * vector.y);
	    };
	
	    /**
	     * Rotates the vector about (0, 0) by specified angle.
	     * @method rotate
	     * @param {vector} vector
	     * @param {number} angle
	     * @return {vector} A new vector rotated about (0, 0)
	     */
	    Vector.rotate = function(vector, angle) {
	        var cos = Math.cos(angle), sin = Math.sin(angle);
	        return {
	            x: vector.x * cos - vector.y * sin,
	            y: vector.x * sin + vector.y * cos
	        };
	    };
	
	    /**
	     * Rotates the vector about a specified point by specified angle.
	     * @method rotateAbout
	     * @param {vector} vector
	     * @param {number} angle
	     * @param {vector} point
	     * @param {vector} [output]
	     * @return {vector} A new vector rotated about the point
	     */
	    Vector.rotateAbout = function(vector, angle, point, output) {
	        var cos = Math.cos(angle), sin = Math.sin(angle);
	        if (!output) output = {};
	        var x = point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin);
	        output.y = point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos);
	        output.x = x;
	        return output;
	    };
	
	    /**
	     * Normalises a vector (such that its magnitude is `1`).
	     * @method normalise
	     * @param {vector} vector
	     * @return {vector} A new vector normalised
	     */
	    Vector.normalise = function(vector) {
	        var magnitude = Vector.magnitude(vector);
	        if (magnitude === 0)
	            return { x: 0, y: 0 };
	        return { x: vector.x / magnitude, y: vector.y / magnitude };
	    };
	
	    /**
	     * Returns the dot-product of two vectors.
	     * @method dot
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @return {number} The dot product of the two vectors
	     */
	    Vector.dot = function(vectorA, vectorB) {
	        return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
	    };
	
	    /**
	     * Returns the cross-product of two vectors.
	     * @method cross
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @return {number} The cross product of the two vectors
	     */
	    Vector.cross = function(vectorA, vectorB) {
	        return (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x);
	    };
	
	    /**
	     * Returns the cross-product of three vectors.
	     * @method cross3
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @param {vector} vectorC
	     * @return {number} The cross product of the three vectors
	     */
	    Vector.cross3 = function(vectorA, vectorB, vectorC) {
	        return (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) - (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x);
	    };
	
	    /**
	     * Adds the two vectors.
	     * @method add
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @param {vector} [output]
	     * @return {vector} A new vector of vectorA and vectorB added
	     */
	    Vector.add = function(vectorA, vectorB, output) {
	        if (!output) output = {};
	        output.x = vectorA.x + vectorB.x;
	        output.y = vectorA.y + vectorB.y;
	        return output;
	    };
	
	    /**
	     * Subtracts the two vectors.
	     * @method sub
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @param {vector} [output]
	     * @return {vector} A new vector of vectorA and vectorB subtracted
	     */
	    Vector.sub = function(vectorA, vectorB, output) {
	        if (!output) output = {};
	        output.x = vectorA.x - vectorB.x;
	        output.y = vectorA.y - vectorB.y;
	        return output;
	    };
	
	    /**
	     * Multiplies a vector and a scalar.
	     * @method mult
	     * @param {vector} vector
	     * @param {number} scalar
	     * @return {vector} A new vector multiplied by scalar
	     */
	    Vector.mult = function(vector, scalar) {
	        return { x: vector.x * scalar, y: vector.y * scalar };
	    };
	
	    /**
	     * Divides a vector and a scalar.
	     * @method div
	     * @param {vector} vector
	     * @param {number} scalar
	     * @return {vector} A new vector divided by scalar
	     */
	    Vector.div = function(vector, scalar) {
	        return { x: vector.x / scalar, y: vector.y / scalar };
	    };
	
	    /**
	     * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
	     * @method perp
	     * @param {vector} vector
	     * @param {bool} [negate=false]
	     * @return {vector} The perpendicular vector
	     */
	    Vector.perp = function(vector, negate) {
	        negate = negate === true ? -1 : 1;
	        return { x: negate * -vector.y, y: negate * vector.x };
	    };
	
	    /**
	     * Negates both components of a vector such that it points in the opposite direction.
	     * @method neg
	     * @param {vector} vector
	     * @return {vector} The negated vector
	     */
	    Vector.neg = function(vector) {
	        return { x: -vector.x, y: -vector.y };
	    };
	
	    /**
	     * Returns the angle in radians between the two vectors relative to the x-axis.
	     * @method angle
	     * @param {vector} vectorA
	     * @param {vector} vectorB
	     * @return {number} The angle in radians
	     */
	    Vector.angle = function(vectorA, vectorB) {
	        return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
	    };
	
	    /**
	     * Temporary vector pool (not thread-safe).
	     * @property _temp
	     * @type {vector[]}
	     * @private
	     */
	    Vector._temp = [Vector.create(), Vector.create(), 
	                    Vector.create(), Vector.create(), 
	                    Vector.create(), Vector.create()];
	
	})();
	},{}],27:[function(require,module,exports){
	/**
	* The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
	* A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
	* A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
	*
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class Vertices
	*/
	
	var Vertices = {};
	
	module.exports = Vertices;
	
	var Vector = require('../geometry/Vector');
	var Common = require('../core/Common');
	
	(function() {
	
	    /**
	     * Creates a new set of `Matter.Body` compatible vertices.
	     * The `points` argument accepts an array of `Matter.Vector` points orientated around the origin `(0, 0)`, for example:
	     *
	     *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
	     *
	     * The `Vertices.create` method returns a new array of vertices, which are similar to Matter.Vector objects,
	     * but with some additional references required for efficient collision detection routines.
	     *
	     * Note that the `body` argument is not optional, a `Matter.Body` reference must be provided.
	     *
	     * @method create
	     * @param {vector[]} points
	     * @param {body} body
	     */
	    Vertices.create = function(points, body) {
	        var vertices = [];
	
	        for (var i = 0; i < points.length; i++) {
	            var point = points[i],
	                vertex = {
	                    x: point.x,
	                    y: point.y,
	                    index: i,
	                    body: body,
	                    isInternal: false
	                };
	
	            vertices.push(vertex);
	        }
	
	        return vertices;
	    };
	
	    /**
	     * Parses a string containing ordered x y pairs separated by spaces (and optionally commas), 
	     * into a `Matter.Vertices` object for the given `Matter.Body`.
	     * For parsing SVG paths, see `Svg.pathToVertices`.
	     * @method fromPath
	     * @param {string} path
	     * @param {body} body
	     * @return {vertices} vertices
	     */
	    Vertices.fromPath = function(path, body) {
	        var pathPattern = /L?\s*([\-\d\.e]+)[\s,]*([\-\d\.e]+)*/ig,
	            points = [];
	
	        path.replace(pathPattern, function(match, x, y) {
	            points.push({ x: parseFloat(x), y: parseFloat(y) });
	        });
	
	        return Vertices.create(points, body);
	    };
	
	    /**
	     * Returns the centre (centroid) of the set of vertices.
	     * @method centre
	     * @param {vertices} vertices
	     * @return {vector} The centre point
	     */
	    Vertices.centre = function(vertices) {
	        var area = Vertices.area(vertices, true),
	            centre = { x: 0, y: 0 },
	            cross,
	            temp,
	            j;
	
	        for (var i = 0; i < vertices.length; i++) {
	            j = (i + 1) % vertices.length;
	            cross = Vector.cross(vertices[i], vertices[j]);
	            temp = Vector.mult(Vector.add(vertices[i], vertices[j]), cross);
	            centre = Vector.add(centre, temp);
	        }
	
	        return Vector.div(centre, 6 * area);
	    };
	
	    /**
	     * Returns the average (mean) of the set of vertices.
	     * @method mean
	     * @param {vertices} vertices
	     * @return {vector} The average point
	     */
	    Vertices.mean = function(vertices) {
	        var average = { x: 0, y: 0 };
	
	        for (var i = 0; i < vertices.length; i++) {
	            average.x += vertices[i].x;
	            average.y += vertices[i].y;
	        }
	
	        return Vector.div(average, vertices.length);
	    };
	
	    /**
	     * Returns the area of the set of vertices.
	     * @method area
	     * @param {vertices} vertices
	     * @param {bool} signed
	     * @return {number} The area
	     */
	    Vertices.area = function(vertices, signed) {
	        var area = 0,
	            j = vertices.length - 1;
	
	        for (var i = 0; i < vertices.length; i++) {
	            area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
	            j = i;
	        }
	
	        if (signed)
	            return area / 2;
	
	        return Math.abs(area) / 2;
	    };
	
	    /**
	     * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
	     * @method inertia
	     * @param {vertices} vertices
	     * @param {number} mass
	     * @return {number} The polygon's moment of inertia
	     */
	    Vertices.inertia = function(vertices, mass) {
	        var numerator = 0,
	            denominator = 0,
	            v = vertices,
	            cross,
	            j;
	
	        // find the polygon's moment of inertia, using second moment of area
	        // http://www.physicsforums.com/showthread.php?t=25293
	        for (var n = 0; n < v.length; n++) {
	            j = (n + 1) % v.length;
	            cross = Math.abs(Vector.cross(v[j], v[n]));
	            numerator += cross * (Vector.dot(v[j], v[j]) + Vector.dot(v[j], v[n]) + Vector.dot(v[n], v[n]));
	            denominator += cross;
	        }
	
	        return (mass / 6) * (numerator / denominator);
	    };
	
	    /**
	     * Translates the set of vertices in-place.
	     * @method translate
	     * @param {vertices} vertices
	     * @param {vector} vector
	     * @param {number} scalar
	     */
	    Vertices.translate = function(vertices, vector, scalar) {
	        var i;
	        if (scalar) {
	            for (i = 0; i < vertices.length; i++) {
	                vertices[i].x += vector.x * scalar;
	                vertices[i].y += vector.y * scalar;
	            }
	        } else {
	            for (i = 0; i < vertices.length; i++) {
	                vertices[i].x += vector.x;
	                vertices[i].y += vector.y;
	            }
	        }
	
	        return vertices;
	    };
	
	    /**
	     * Rotates the set of vertices in-place.
	     * @method rotate
	     * @param {vertices} vertices
	     * @param {number} angle
	     * @param {vector} point
	     */
	    Vertices.rotate = function(vertices, angle, point) {
	        if (angle === 0)
	            return;
	
	        var cos = Math.cos(angle),
	            sin = Math.sin(angle);
	
	        for (var i = 0; i < vertices.length; i++) {
	            var vertice = vertices[i],
	                dx = vertice.x - point.x,
	                dy = vertice.y - point.y;
	                
	            vertice.x = point.x + (dx * cos - dy * sin);
	            vertice.y = point.y + (dx * sin + dy * cos);
	        }
	
	        return vertices;
	    };
	
	    /**
	     * Returns `true` if the `point` is inside the set of `vertices`.
	     * @method contains
	     * @param {vertices} vertices
	     * @param {vector} point
	     * @return {boolean} True if the vertices contains point, otherwise false
	     */
	    Vertices.contains = function(vertices, point) {
	        for (var i = 0; i < vertices.length; i++) {
	            var vertice = vertices[i],
	                nextVertice = vertices[(i + 1) % vertices.length];
	            if ((point.x - vertice.x) * (nextVertice.y - vertice.y) + (point.y - vertice.y) * (vertice.x - nextVertice.x) > 0) {
	                return false;
	            }
	        }
	
	        return true;
	    };
	
	    /**
	     * Scales the vertices from a point (default is centre) in-place.
	     * @method scale
	     * @param {vertices} vertices
	     * @param {number} scaleX
	     * @param {number} scaleY
	     * @param {vector} point
	     */
	    Vertices.scale = function(vertices, scaleX, scaleY, point) {
	        if (scaleX === 1 && scaleY === 1)
	            return vertices;
	
	        point = point || Vertices.centre(vertices);
	
	        var vertex,
	            delta;
	
	        for (var i = 0; i < vertices.length; i++) {
	            vertex = vertices[i];
	            delta = Vector.sub(vertex, point);
	            vertices[i].x = point.x + delta.x * scaleX;
	            vertices[i].y = point.y + delta.y * scaleY;
	        }
	
	        return vertices;
	    };
	
	    /**
	     * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
	     * The radius parameter is a single number or an array to specify the radius for each vertex.
	     * @method chamfer
	     * @param {vertices} vertices
	     * @param {number[]} radius
	     * @param {number} quality
	     * @param {number} qualityMin
	     * @param {number} qualityMax
	     */
	    Vertices.chamfer = function(vertices, radius, quality, qualityMin, qualityMax) {
	        radius = radius || [8];
	
	        if (!radius.length)
	            radius = [radius];
	
	        // quality defaults to -1, which is auto
	        quality = (typeof quality !== 'undefined') ? quality : -1;
	        qualityMin = qualityMin || 2;
	        qualityMax = qualityMax || 14;
	
	        var newVertices = [];
	
	        for (var i = 0; i < vertices.length; i++) {
	            var prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1],
	                vertex = vertices[i],
	                nextVertex = vertices[(i + 1) % vertices.length],
	                currentRadius = radius[i < radius.length ? i : radius.length - 1];
	
	            if (currentRadius === 0) {
	                newVertices.push(vertex);
	                continue;
	            }
	
	            var prevNormal = Vector.normalise({ 
	                x: vertex.y - prevVertex.y, 
	                y: prevVertex.x - vertex.x
	            });
	
	            var nextNormal = Vector.normalise({ 
	                x: nextVertex.y - vertex.y, 
	                y: vertex.x - nextVertex.x
	            });
	
	            var diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2)),
	                radiusVector = Vector.mult(Common.clone(prevNormal), currentRadius),
	                midNormal = Vector.normalise(Vector.mult(Vector.add(prevNormal, nextNormal), 0.5)),
	                scaledVertex = Vector.sub(vertex, Vector.mult(midNormal, diagonalRadius));
	
	            var precision = quality;
	
	            if (quality === -1) {
	                // automatically decide precision
	                precision = Math.pow(currentRadius, 0.32) * 1.75;
	            }
	
	            precision = Common.clamp(precision, qualityMin, qualityMax);
	
	            // use an even value for precision, more likely to reduce axes by using symmetry
	            if (precision % 2 === 1)
	                precision += 1;
	
	            var alpha = Math.acos(Vector.dot(prevNormal, nextNormal)),
	                theta = alpha / precision;
	
	            for (var j = 0; j < precision; j++) {
	                newVertices.push(Vector.add(Vector.rotate(radiusVector, theta * j), scaledVertex));
	            }
	        }
	
	        return newVertices;
	    };
	
	    /**
	     * Sorts the input vertices into clockwise order in place.
	     * @method clockwiseSort
	     * @param {vertices} vertices
	     * @return {vertices} vertices
	     */
	    Vertices.clockwiseSort = function(vertices) {
	        var centre = Vertices.mean(vertices);
	
	        vertices.sort(function(vertexA, vertexB) {
	            return Vector.angle(centre, vertexA) - Vector.angle(centre, vertexB);
	        });
	
	        return vertices;
	    };
	
	    /**
	     * Returns true if the vertices form a convex shape (vertices must be in clockwise order).
	     * @method isConvex
	     * @param {vertices} vertices
	     * @return {bool} `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
	     */
	    Vertices.isConvex = function(vertices) {
	        // http://paulbourke.net/geometry/polygonmesh/
	
	        var flag = 0,
	            n = vertices.length,
	            i,
	            j,
	            k,
	            z;
	
	        if (n < 3)
	            return null;
	
	        for (i = 0; i < n; i++) {
	            j = (i + 1) % n;
	            k = (i + 2) % n;
	            z = (vertices[j].x - vertices[i].x) * (vertices[k].y - vertices[j].y);
	            z -= (vertices[j].y - vertices[i].y) * (vertices[k].x - vertices[j].x);
	
	            if (z < 0) {
	                flag |= 1;
	            } else if (z > 0) {
	                flag |= 2;
	            }
	
	            if (flag === 3) {
	                return false;
	            }
	        }
	
	        if (flag !== 0){
	            return true;
	        } else {
	            return null;
	        }
	    };
	
	    /**
	     * Returns the convex hull of the input vertices as a new array of points.
	     * @method hull
	     * @param {vertices} vertices
	     * @return [vertex] vertices
	     */
	    Vertices.hull = function(vertices) {
	        // http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain
	
	        var upper = [],
	            lower = [], 
	            vertex,
	            i;
	
	        // sort vertices on x-axis (y-axis for ties)
	        vertices = vertices.slice(0);
	        vertices.sort(function(vertexA, vertexB) {
	            var dx = vertexA.x - vertexB.x;
	            return dx !== 0 ? dx : vertexA.y - vertexB.y;
	        });
	
	        // build lower hull
	        for (i = 0; i < vertices.length; i++) {
	            vertex = vertices[i];
	
	            while (lower.length >= 2 
	                   && Vector.cross3(lower[lower.length - 2], lower[lower.length - 1], vertex) <= 0) {
	                lower.pop();
	            }
	
	            lower.push(vertex);
	        }
	
	        // build upper hull
	        for (i = vertices.length - 1; i >= 0; i--) {
	            vertex = vertices[i];
	
	            while (upper.length >= 2 
	                   && Vector.cross3(upper[upper.length - 2], upper[upper.length - 1], vertex) <= 0) {
	                upper.pop();
	            }
	
	            upper.push(vertex);
	        }
	
	        // concatenation of the lower and upper hulls gives the convex hull
	        // omit last points because they are repeated at the beginning of the other list
	        upper.pop();
	        lower.pop();
	
	        return upper.concat(lower);
	    };
	
	})();
	
	},{"../core/Common":14,"../geometry/Vector":26}],28:[function(require,module,exports){
	var Matter = module.exports = {};
	Matter.version = 'master';
	
	Matter.Body = require('../body/Body');
	Matter.Composite = require('../body/Composite');
	Matter.World = require('../body/World');
	
	Matter.Contact = require('../collision/Contact');
	Matter.Detector = require('../collision/Detector');
	Matter.Grid = require('../collision/Grid');
	Matter.Pairs = require('../collision/Pairs');
	Matter.Pair = require('../collision/Pair');
	Matter.Query = require('../collision/Query');
	Matter.Resolver = require('../collision/Resolver');
	Matter.SAT = require('../collision/SAT');
	
	Matter.Constraint = require('../constraint/Constraint');
	Matter.MouseConstraint = require('../constraint/MouseConstraint');
	
	Matter.Common = require('../core/Common');
	Matter.Engine = require('../core/Engine');
	Matter.Events = require('../core/Events');
	Matter.Mouse = require('../core/Mouse');
	Matter.Runner = require('../core/Runner');
	Matter.Sleeping = require('../core/Sleeping');
	
	
	Matter.Bodies = require('../factory/Bodies');
	Matter.Composites = require('../factory/Composites');
	
	Matter.Axes = require('../geometry/Axes');
	Matter.Bounds = require('../geometry/Bounds');
	Matter.Svg = require('../geometry/Svg');
	Matter.Vector = require('../geometry/Vector');
	Matter.Vertices = require('../geometry/Vertices');
	
	Matter.Render = require('../render/Render');
	Matter.RenderPixi = require('../render/RenderPixi');
	
	// aliases
	
	Matter.World.add = Matter.Composite.add;
	Matter.World.remove = Matter.Composite.remove;
	Matter.World.addComposite = Matter.Composite.addComposite;
	Matter.World.addBody = Matter.Composite.addBody;
	Matter.World.addConstraint = Matter.Composite.addConstraint;
	Matter.World.clear = Matter.Composite.clear;
	Matter.Engine.run = Matter.Runner.run;
	
	},{"../body/Body":1,"../body/Composite":2,"../body/World":3,"../collision/Contact":4,"../collision/Detector":5,"../collision/Grid":6,"../collision/Pair":7,"../collision/Pairs":8,"../collision/Query":9,"../collision/Resolver":10,"../collision/SAT":11,"../constraint/Constraint":12,"../constraint/MouseConstraint":13,"../core/Common":14,"../core/Engine":15,"../core/Events":16,"../core/Metrics":17,"../core/Mouse":18,"../core/Runner":19,"../core/Sleeping":20,"../factory/Bodies":21,"../factory/Composites":22,"../geometry/Axes":23,"../geometry/Bounds":24,"../geometry/Svg":25,"../geometry/Vector":26,"../geometry/Vertices":27,"../render/Render":29,"../render/RenderPixi":30}],29:[function(require,module,exports){
	/**
	* The `Matter.Render` module is the default `render.controller` used by a `Matter.Engine`.
	* This renderer is HTML5 canvas based and supports a number of drawing options including sprites and viewports.
	*
	* It is possible develop a custom renderer module based on `Matter.Render` and pass an instance of it to `Engine.create` via `options.render`.
	* A minimal custom renderer object must define at least three functions: `create`, `clear` and `world` (see `Matter.Render`).
	*
	* See also `Matter.RenderPixi` for an alternate WebGL, scene-graph based renderer.
	*
	* @class Render
	*/
	
	var Render = {};
	
	module.exports = Render;
	
	var Common = require('../core/Common');
	var Composite = require('../body/Composite');
	var Bounds = require('../geometry/Bounds');
	var Events = require('../core/Events');
	var Grid = require('../collision/Grid');
	var Vector = require('../geometry/Vector');
	
	(function() {
	    
	    /**
	     * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
	     * All properties have default values, and many are pre-calculated automatically based on other properties.
	     * See the properties section below for detailed information on what you can pass via the `options` object.
	     * @method create
	     * @param {object} [options]
	     * @return {render} A new renderer
	     */
	    Render.create = function(options) {
	        var defaults = {
	            controller: Render,
	            element: null,
	            canvas: null,
	            mouse: null,
	            options: {
	                width: 800,
	                height: 600,
	                pixelRatio: 1,
	                background: '#fafafa',
	                wireframeBackground: '#222',
	                hasBounds: false,
	                enabled: true,
	                wireframes: true,
	                showSleeping: true,
	                showDebug: false,
	                showBroadphase: false,
	                showBounds: false,
	                showVelocity: false,
	                showCollisions: false,
	                showSeparations: false,
	                showAxes: false,
	                showPositions: false,
	                showAngleIndicator: false,
	                showIds: false,
	                showShadows: false,
	                showVertexNumbers: false,
	                showConvexHulls: false,
	                showInternalEdges: false,
	                showMousePosition: false
	            }
	        };
	
	        var render = Common.extend(defaults, options);
	
	        render.canvas = render.canvas || _createCanvas(render.options.width, render.options.height);
	        render.context = render.canvas.getContext('2d');
	        render.textures = {};
	
	        render.bounds = render.bounds || { 
	            min: { 
	                x: 0,
	                y: 0
	            }, 
	            max: { 
	                x: render.options.width,
	                y: render.options.height
	            }
	        };
	
	        if (render.options.pixelRatio !== 1) {
	            Render.setPixelRatio(render, render.options.pixelRatio);
	        }
	
	        if (Common.isElement(render.element)) {
	            render.element.appendChild(render.canvas);
	        } else {
	            Common.log('Render.create: options.element was undefined, render.canvas was created but not appended', 'warn');
	        }
	
	        return render;
	    };
	
	    /**
	     * Sets the pixel ratio of the renderer and updates the canvas.
	     * To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`.
	     * @method setPixelRatio
	     * @param {render} render
	     * @param {number} pixelRatio
	     */
	    Render.setPixelRatio = function(render, pixelRatio) {
	        var options = render.options,
	            canvas = render.canvas;
	
	        if (pixelRatio === 'auto') {
	            pixelRatio = _getPixelRatio(canvas);
	        }
	
	        options.pixelRatio = pixelRatio;
	        canvas.setAttribute('data-pixel-ratio', pixelRatio);
	        canvas.width = options.width * pixelRatio;
	        canvas.height = options.height * pixelRatio;
	        canvas.style.width = options.width + 'px';
	        canvas.style.height = options.height + 'px';
	        render.context.scale(pixelRatio, pixelRatio);
	    };
	
	    /**
	     * Renders the given `engine`'s `Matter.World` object.
	     * This is the entry point for all rendering and should be called every time the scene changes.
	     * @method world
	     * @param {engine} engine
	     */
	    Render.world = function(engine) {
	        var render = engine.render,
	            world = engine.world,
	            canvas = render.canvas,
	            context = render.context,
	            options = render.options,
	            allBodies = Composite.allBodies(world),
	            allConstraints = Composite.allConstraints(world),
	            background = options.wireframes ? options.wireframeBackground : options.background,
	            bodies = [],
	            constraints = [],
	            i;
	
	        var event = {
	            timestamp: engine.timing.timestamp
	        };
	
	        Events.trigger(render, 'beforeRender', event);
	
	        // apply background if it has changed
	        if (render.currentBackground !== background)
	            _applyBackground(render, background);
	
	        // clear the canvas with a transparent fill, to allow the canvas background to show
	        context.globalCompositeOperation = 'source-in';
	        context.fillStyle = "transparent";
	        context.fillRect(0, 0, canvas.width, canvas.height);
	        context.globalCompositeOperation = 'source-over';
	
	        // handle bounds
	        if (options.hasBounds) {
	            var boundsWidth = render.bounds.max.x - render.bounds.min.x,
	                boundsHeight = render.bounds.max.y - render.bounds.min.y,
	                boundsScaleX = boundsWidth / options.width,
	                boundsScaleY = boundsHeight / options.height;
	
	            // filter out bodies that are not in view
	            for (i = 0; i < allBodies.length; i++) {
	                var body = allBodies[i];
	                if (Bounds.overlaps(body.bounds, render.bounds))
	                    bodies.push(body);
	            }
	
	            // filter out constraints that are not in view
	            for (i = 0; i < allConstraints.length; i++) {
	                var constraint = allConstraints[i],
	                    bodyA = constraint.bodyA,
	                    bodyB = constraint.bodyB,
	                    pointAWorld = constraint.pointA,
	                    pointBWorld = constraint.pointB;
	
	                if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
	                if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);
	
	                if (!pointAWorld || !pointBWorld)
	                    continue;
	
	                if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
	                    constraints.push(constraint);
	            }
	
	            // transform the view
	            context.scale(1 / boundsScaleX, 1 / boundsScaleY);
	            context.translate(-render.bounds.min.x, -render.bounds.min.y);
	        } else {
	            constraints = allConstraints;
	            bodies = allBodies;
	        }
	
	        if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
	            // fully featured rendering of bodies
	            Render.bodies(engine, bodies, context);
	        } else {
	            if (options.showConvexHulls)
	                Render.bodyConvexHulls(engine, bodies, context);
	
	            // optimised method for wireframes only
	            Render.bodyWireframes(engine, bodies, context);
	        }
	
	        if (options.showBounds)
	            Render.bodyBounds(engine, bodies, context);
	
	        if (options.showAxes || options.showAngleIndicator)
	            Render.bodyAxes(engine, bodies, context);
	        
	        if (options.showPositions)
	            Render.bodyPositions(engine, bodies, context);
	
	        if (options.showVelocity)
	            Render.bodyVelocity(engine, bodies, context);
	
	        if (options.showIds)
	            Render.bodyIds(engine, bodies, context);
	
	        if (options.showSeparations)
	            Render.separations(engine, engine.pairs.list, context);
	
	        if (options.showCollisions)
	            Render.collisions(engine, engine.pairs.list, context);
	
	        if (options.showVertexNumbers)
	            Render.vertexNumbers(engine, bodies, context);
	
	        if (options.showMousePosition)
	            Render.mousePosition(engine, render.mouse, context);
	
	        Render.constraints(constraints, context);
	
	        if (options.showBroadphase && engine.broadphase.controller === Grid)
	            Render.grid(engine, engine.broadphase, context);
	
	        if (options.showDebug)
	            Render.debug(engine, context);
	
	        if (options.hasBounds) {
	            // revert view transforms
	            context.setTransform(options.pixelRatio, 0, 0, options.pixelRatio, 0, 0);
	        }
	
	        Events.trigger(render, 'afterRender', event);
	    };
	
	    /**
	     * Description
	     * @private
	     * @method debug
	     * @param {engine} engine
	     * @param {RenderingContext} context
	     */
	    Render.debug = function(engine, context) {
	        var c = context,
	            world = engine.world,
	            render = engine.render,
	            metrics = engine.metrics,
	            options = render.options,
	            bodies = Composite.allBodies(world),
	            space = "    ";
	
	        if (engine.timing.timestamp - (render.debugTimestamp || 0) >= 500) {
	            var text = "";
	            text += "fps: " + Math.round(metrics.timing.fps) + space;
	
	
	            render.debugString = text;
	            render.debugTimestamp = engine.timing.timestamp;
	        }
	
	        if (render.debugString) {
	            c.font = "12px Arial";
	
	            if (options.wireframes) {
	                c.fillStyle = 'rgba(255,255,255,0.5)';
	            } else {
	                c.fillStyle = 'rgba(0,0,0,0.5)';
	            }
	
	            var split = render.debugString.split('\n');
	
	            for (var i = 0; i < split.length; i++) {
	                c.fillText(split[i], 50, 50 + i * 18);
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method constraints
	     * @param {constraint[]} constraints
	     * @param {RenderingContext} context
	     */
	    Render.constraints = function(constraints, context) {
	        var c = context;
	
	        for (var i = 0; i < constraints.length; i++) {
	            var constraint = constraints[i];
	
	            if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
	                continue;
	
	            var bodyA = constraint.bodyA,
	                bodyB = constraint.bodyB;
	
	            if (bodyA) {
	                c.beginPath();
	                c.moveTo(bodyA.position.x + constraint.pointA.x, bodyA.position.y + constraint.pointA.y);
	            } else {
	                c.beginPath();
	                c.moveTo(constraint.pointA.x, constraint.pointA.y);
	            }
	
	            if (bodyB) {
	                c.lineTo(bodyB.position.x + constraint.pointB.x, bodyB.position.y + constraint.pointB.y);
	            } else {
	                c.lineTo(constraint.pointB.x, constraint.pointB.y);
	            }
	
	            c.lineWidth = constraint.render.lineWidth;
	            c.strokeStyle = constraint.render.strokeStyle;
	            c.stroke();
	        }
	    };
	    
	    /**
	     * Description
	     * @private
	     * @method bodyShadows
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyShadows = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render;
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            if (body.circleRadius) {
	                c.beginPath();
	                c.arc(body.position.x, body.position.y, body.circleRadius, 0, 2 * Math.PI);
	                c.closePath();
	            } else {
	                c.beginPath();
	                c.moveTo(body.vertices[0].x, body.vertices[0].y);
	                for (var j = 1; j < body.vertices.length; j++) {
	                    c.lineTo(body.vertices[j].x, body.vertices[j].y);
	                }
	                c.closePath();
	            }
	
	            var distanceX = body.position.x - render.options.width * 0.5,
	                distanceY = body.position.y - render.options.height * 0.2,
	                distance = Math.abs(distanceX) + Math.abs(distanceY);
	
	            c.shadowColor = 'rgba(0,0,0,0.15)';
	            c.shadowOffsetX = 0.05 * distanceX;
	            c.shadowOffsetY = 0.05 * distanceY;
	            c.shadowBlur = 1 + 12 * Math.min(1, distance / 1000);
	
	            c.fill();
	
	            c.shadowColor = null;
	            c.shadowOffsetX = null;
	            c.shadowOffsetY = null;
	            c.shadowBlur = null;
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method bodies
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodies = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render,
	            options = render.options,
	            body,
	            part,
	            i,
	            k;
	
	        for (i = 0; i < bodies.length; i++) {
	            body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            // handle compound parts
	            for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
	                part = body.parts[k];
	
	                if (part.render.sprite && part.render.sprite.texture && !options.wireframes) {
	                    // part sprite
	                    var sprite = part.render.sprite,
	                        texture = _getTexture(render, sprite.texture);
	
	                    if (options.showSleeping && body.isSleeping) 
	                        c.globalAlpha = 0.5;
	
	                    c.translate(part.position.x, part.position.y); 
	                    c.rotate(part.angle);
	
	                    c.drawImage(texture, texture.width * -0.5 * sprite.xScale, texture.height * -0.5 * sprite.yScale, 
	                                texture.width * sprite.xScale, texture.height * sprite.yScale);
	
	                    // revert translation, hopefully faster than save / restore
	                    c.rotate(-part.angle);
	                    c.translate(-part.position.x, -part.position.y); 
	
	                    if (options.showSleeping && body.isSleeping) 
	                        c.globalAlpha = 1;
	                } else {
	                    // part polygon
	                    if (part.circleRadius) {
	                        c.beginPath();
	                        c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
	                    } else {
	                        c.beginPath();
	                        c.moveTo(part.vertices[0].x, part.vertices[0].y);
	                        for (var j = 1; j < part.vertices.length; j++) {
	                            c.lineTo(part.vertices[j].x, part.vertices[j].y);
	                        }
	                        c.closePath();
	                    }
	
	                    if (!options.wireframes) {
	                        if (options.showSleeping && body.isSleeping) {
	                            c.fillStyle = Common.shadeColor(part.render.fillStyle, 50);
	                        } else {
	                            c.fillStyle = part.render.fillStyle;
	                        }
	
	                        c.lineWidth = part.render.lineWidth;
	                        c.strokeStyle = part.render.strokeStyle;
	                        c.fill();
	                        c.stroke();
	                    } else {
	                        c.lineWidth = 1;
	                        c.strokeStyle = '#bbb';
	                        if (options.showSleeping && body.isSleeping)
	                            c.strokeStyle = 'rgba(255,255,255,0.2)';
	                        c.stroke();
	                    }
	                }
	            }
	        }
	    };
	
	    /**
	     * Optimised method for drawing body wireframes in one pass
	     * @private
	     * @method bodyWireframes
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyWireframes = function(engine, bodies, context) {
	        var c = context,
	            showInternalEdges = engine.render.options.showInternalEdges,
	            body,
	            part,
	            i,
	            j,
	            k;
	
	        c.beginPath();
	
	        // render all bodies
	        for (i = 0; i < bodies.length; i++) {
	            body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            // handle compound parts
	            for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
	                part = body.parts[k];
	
	                c.moveTo(part.vertices[0].x, part.vertices[0].y);
	
	                for (j = 1; j < part.vertices.length; j++) {
	                    if (!part.vertices[j - 1].isInternal || showInternalEdges) {
	                        c.lineTo(part.vertices[j].x, part.vertices[j].y);
	                    } else {
	                        c.moveTo(part.vertices[j].x, part.vertices[j].y);
	                    }
	
	                    if (part.vertices[j].isInternal && !showInternalEdges) {
	                        c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
	                    }
	                }
	                
	                c.lineTo(part.vertices[0].x, part.vertices[0].y);
	            }
	        }
	
	        c.lineWidth = 1;
	        c.strokeStyle = '#bbb';
	        c.stroke();
	    };
	
	    /**
	     * Optimised method for drawing body convex hull wireframes in one pass
	     * @private
	     * @method bodyConvexHulls
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyConvexHulls = function(engine, bodies, context) {
	        var c = context,
	            body,
	            part,
	            i,
	            j,
	            k;
	
	        c.beginPath();
	
	        // render convex hulls
	        for (i = 0; i < bodies.length; i++) {
	            body = bodies[i];
	
	            if (!body.render.visible || body.parts.length === 1)
	                continue;
	
	            c.moveTo(body.vertices[0].x, body.vertices[0].y);
	
	            for (j = 1; j < body.vertices.length; j++) {
	                c.lineTo(body.vertices[j].x, body.vertices[j].y);
	            }
	            
	            c.lineTo(body.vertices[0].x, body.vertices[0].y);
	        }
	
	        c.lineWidth = 1;
	        c.strokeStyle = 'rgba(255,255,255,0.2)';
	        c.stroke();
	    };
	
	    /**
	     * Renders body vertex numbers.
	     * @private
	     * @method vertexNumbers
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.vertexNumbers = function(engine, bodies, context) {
	        var c = context,
	            i,
	            j,
	            k;
	
	        for (i = 0; i < bodies.length; i++) {
	            var parts = bodies[i].parts;
	            for (k = parts.length > 1 ? 1 : 0; k < parts.length; k++) {
	                var part = parts[k];
	                for (j = 0; j < part.vertices.length; j++) {
	                    c.fillStyle = 'rgba(255,255,255,0.2)';
	                    c.fillText(i + '_' + j, part.position.x + (part.vertices[j].x - part.position.x) * 0.8, part.position.y + (part.vertices[j].y - part.position.y) * 0.8);
	                }
	            }
	        }
	    };
	
	    /**
	     * Renders mouse position.
	     * @private
	     * @method mousePosition
	     * @param {engine} engine
	     * @param {mouse} mouse
	     * @param {RenderingContext} context
	     */
	    Render.mousePosition = function(engine, mouse, context) {
	        var c = context;
	        c.fillStyle = 'rgba(255,255,255,0.8)';
	        c.fillText(mouse.position.x + '  ' + mouse.position.y, mouse.position.x + 5, mouse.position.y - 5);
	    };
	
	    /**
	     * Draws body bounds
	     * @private
	     * @method bodyBounds
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyBounds = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render,
	            options = render.options;
	
	        c.beginPath();
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (body.render.visible) {
	                var parts = bodies[i].parts;
	                for (var j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
	                    var part = parts[j];
	                    c.rect(part.bounds.min.x, part.bounds.min.y, part.bounds.max.x - part.bounds.min.x, part.bounds.max.y - part.bounds.min.y);
	                }
	            }
	        }
	
	        if (options.wireframes) {
	            c.strokeStyle = 'rgba(255,255,255,0.08)';
	        } else {
	            c.strokeStyle = 'rgba(0,0,0,0.1)';
	        }
	
	        c.lineWidth = 1;
	        c.stroke();
	    };
	
	    /**
	     * Draws body angle indicators and axes
	     * @private
	     * @method bodyAxes
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyAxes = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render,
	            options = render.options,
	            part,
	            i,
	            j,
	            k;
	
	        c.beginPath();
	
	        for (i = 0; i < bodies.length; i++) {
	            var body = bodies[i],
	                parts = body.parts;
	
	            if (!body.render.visible)
	                continue;
	
	            if (options.showAxes) {
	                // render all axes
	                for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
	                    part = parts[j];
	                    for (k = 0; k < part.axes.length; k++) {
	                        var axis = part.axes[k];
	                        c.moveTo(part.position.x, part.position.y);
	                        c.lineTo(part.position.x + axis.x * 20, part.position.y + axis.y * 20);
	                    }
	                }
	            } else {
	                for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
	                    part = parts[j];
	                    for (k = 0; k < part.axes.length; k++) {
	                        // render a single axis indicator
	                        c.moveTo(part.position.x, part.position.y);
	                        c.lineTo((part.vertices[0].x + part.vertices[part.vertices.length-1].x) / 2, 
	                                 (part.vertices[0].y + part.vertices[part.vertices.length-1].y) / 2);
	                    }
	                }
	            }
	        }
	
	        if (options.wireframes) {
	            c.strokeStyle = 'indianred';
	        } else {
	            c.strokeStyle = 'rgba(0,0,0,0.3)';
	        }
	
	        c.lineWidth = 1;
	        c.stroke();
	    };
	
	    /**
	     * Draws body positions
	     * @private
	     * @method bodyPositions
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyPositions = function(engine, bodies, context) {
	        var c = context,
	            render = engine.render,
	            options = render.options,
	            body,
	            part,
	            i,
	            k;
	
	        c.beginPath();
	
	        // render current positions
	        for (i = 0; i < bodies.length; i++) {
	            body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            // handle compound parts
	            for (k = 0; k < body.parts.length; k++) {
	                part = body.parts[k];
	                c.arc(part.position.x, part.position.y, 3, 0, 2 * Math.PI, false);
	                c.closePath();
	            }
	        }
	
	        if (options.wireframes) {
	            c.fillStyle = 'indianred';
	        } else {
	            c.fillStyle = 'rgba(0,0,0,0.5)';
	        }
	        c.fill();
	
	        c.beginPath();
	
	        // render previous positions
	        for (i = 0; i < bodies.length; i++) {
	            body = bodies[i];
	            if (body.render.visible) {
	                c.arc(body.positionPrev.x, body.positionPrev.y, 2, 0, 2 * Math.PI, false);
	                c.closePath();
	            }
	        }
	
	        c.fillStyle = 'rgba(255,165,0,0.8)';
	        c.fill();
	    };
	
	    /**
	     * Draws body velocity
	     * @private
	     * @method bodyVelocity
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyVelocity = function(engine, bodies, context) {
	        var c = context;
	
	        c.beginPath();
	
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	
	            if (!body.render.visible)
	                continue;
	
	            c.moveTo(body.position.x, body.position.y);
	            c.lineTo(body.position.x + (body.position.x - body.positionPrev.x) * 2, body.position.y + (body.position.y - body.positionPrev.y) * 2);
	        }
	
	        c.lineWidth = 3;
	        c.strokeStyle = 'cornflowerblue';
	        c.stroke();
	    };
	
	    /**
	     * Draws body ids
	     * @private
	     * @method bodyIds
	     * @param {engine} engine
	     * @param {body[]} bodies
	     * @param {RenderingContext} context
	     */
	    Render.bodyIds = function(engine, bodies, context) {
	        var c = context,
	            i,
	            j;
	
	        for (i = 0; i < bodies.length; i++) {
	            if (!bodies[i].render.visible)
	                continue;
	
	            var parts = bodies[i].parts;
	            for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
	                var part = parts[j];
	                c.font = "12px Arial";
	                c.fillStyle = 'rgba(255,255,255,0.5)';
	                c.fillText(part.id, part.position.x + 10, part.position.y - 10);
	            }
	        }
	    };
	
	    /**
	     * Description
	     * @private
	     * @method collisions
	     * @param {engine} engine
	     * @param {pair[]} pairs
	     * @param {RenderingContext} context
	     */
	    Render.collisions = function(engine, pairs, context) {
	        var c = context,
	            options = engine.render.options,
	            pair,
	            collision,
	            corrected,
	            bodyA,
	            bodyB,
	            i,
	            j;
	
	        c.beginPath();
	
	        // render collision positions
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	
	            if (!pair.isActive)
	                continue;
	
	            collision = pair.collision;
	            for (j = 0; j < pair.activeContacts.length; j++) {
	                var contact = pair.activeContacts[j],
	                    vertex = contact.vertex;
	                c.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5);
	            }
	        }
	
	        if (options.wireframes) {
	            c.fillStyle = 'rgba(255,255,255,0.7)';
	        } else {
	            c.fillStyle = 'orange';
	        }
	        c.fill();
	
	        c.beginPath();
	            
	        // render collision normals
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	
	            if (!pair.isActive)
	                continue;
	
	            collision = pair.collision;
	
	            if (pair.activeContacts.length > 0) {
	                var normalPosX = pair.activeContacts[0].vertex.x,
	                    normalPosY = pair.activeContacts[0].vertex.y;
	
	                if (pair.activeContacts.length === 2) {
	                    normalPosX = (pair.activeContacts[0].vertex.x + pair.activeContacts[1].vertex.x) / 2;
	                    normalPosY = (pair.activeContacts[0].vertex.y + pair.activeContacts[1].vertex.y) / 2;
	                }
	                
	                if (collision.bodyB === collision.supports[0].body || collision.bodyA.isStatic === true) {
	                    c.moveTo(normalPosX - collision.normal.x * 8, normalPosY - collision.normal.y * 8);
	                } else {
	                    c.moveTo(normalPosX + collision.normal.x * 8, normalPosY + collision.normal.y * 8);
	                }
	
	                c.lineTo(normalPosX, normalPosY);
	            }
	        }
	
	        if (options.wireframes) {
	            c.strokeStyle = 'rgba(255,165,0,0.7)';
	        } else {
	            c.strokeStyle = 'orange';
	        }
	
	        c.lineWidth = 1;
	        c.stroke();
	    };
	
	    /**
	     * Description
	     * @private
	     * @method separations
	     * @param {engine} engine
	     * @param {pair[]} pairs
	     * @param {RenderingContext} context
	     */
	    Render.separations = function(engine, pairs, context) {
	        var c = context,
	            options = engine.render.options,
	            pair,
	            collision,
	            corrected,
	            bodyA,
	            bodyB,
	            i,
	            j;
	
	        c.beginPath();
	
	        // render separations
	        for (i = 0; i < pairs.length; i++) {
	            pair = pairs[i];
	
	            if (!pair.isActive)
	                continue;
	
	            collision = pair.collision;
	            bodyA = collision.bodyA;
	            bodyB = collision.bodyB;
	
	            var k = 1;
	
	            if (!bodyB.isStatic && !bodyA.isStatic) k = 0.5;
	            if (bodyB.isStatic) k = 0;
	
	            c.moveTo(bodyB.position.x, bodyB.position.y);
	            c.lineTo(bodyB.position.x - collision.penetration.x * k, bodyB.position.y - collision.penetration.y * k);
	
	            k = 1;
	
	            if (!bodyB.isStatic && !bodyA.isStatic) k = 0.5;
	            if (bodyA.isStatic) k = 0;
	
	            c.moveTo(bodyA.position.x, bodyA.position.y);
	            c.lineTo(bodyA.position.x + collision.penetration.x * k, bodyA.position.y + collision.penetration.y * k);
	        }
	
	        if (options.wireframes) {
	            c.strokeStyle = 'rgba(255,165,0,0.5)';
	        } else {
	            c.strokeStyle = 'orange';
	        }
	        c.stroke();
	    };
	
	    /**
	     * Description
	     * @private
	     * @method grid
	     * @param {engine} engine
	     * @param {grid} grid
	     * @param {RenderingContext} context
	     */
	    Render.grid = function(engine, grid, context) {
	        var c = context,
	            options = engine.render.options;
	
	        if (options.wireframes) {
	            c.strokeStyle = 'rgba(255,180,0,0.1)';
	        } else {
	            c.strokeStyle = 'rgba(255,180,0,0.5)';
	        }
	
	        c.beginPath();
	
	        var bucketKeys = Common.keys(grid.buckets);
	
	        for (var i = 0; i < bucketKeys.length; i++) {
	            var bucketId = bucketKeys[i];
	
	            if (grid.buckets[bucketId].length < 2)
	                continue;
	
	            var region = bucketId.split(',');
	            c.rect(0.5 + parseInt(region[0], 10) * grid.bucketWidth, 
	                    0.5 + parseInt(region[1], 10) * grid.bucketHeight, 
	                    grid.bucketWidth, 
	                    grid.bucketHeight);
	        }
	
	        c.lineWidth = 1;
	        c.stroke();
	    };
	
	    /**
	     * Description
	     * @private
	     * @method inspector
	     * @param {inspector} inspector
	     * @param {RenderingContext} context
	     */
	    Render.inspector = function(inspector, context) {
	        var engine = inspector.engine,
	            selected = inspector.selected,
	            render = engine.render,
	            options = render.options,
	            bounds;
	
	        if (options.hasBounds) {
	            var boundsWidth = render.bounds.max.x - render.bounds.min.x,
	                boundsHeight = render.bounds.max.y - render.bounds.min.y,
	                boundsScaleX = boundsWidth / render.options.width,
	                boundsScaleY = boundsHeight / render.options.height;
	            
	            context.scale(1 / boundsScaleX, 1 / boundsScaleY);
	            context.translate(-render.bounds.min.x, -render.bounds.min.y);
	        }
	
	        for (var i = 0; i < selected.length; i++) {
	            var item = selected[i].data;
	
	            context.translate(0.5, 0.5);
	            context.lineWidth = 1;
	            context.strokeStyle = 'rgba(255,165,0,0.9)';
	            context.setLineDash([1,2]);
	
	            switch (item.type) {
	
	            case 'body':
	
	                // render body selections
	                bounds = item.bounds;
	                context.beginPath();
	                context.rect(Math.floor(bounds.min.x - 3), Math.floor(bounds.min.y - 3), 
	                             Math.floor(bounds.max.x - bounds.min.x + 6), Math.floor(bounds.max.y - bounds.min.y + 6));
	                context.closePath();
	                context.stroke();
	
	                break;
	
	            case 'constraint':
	
	                // render constraint selections
	                var point = item.pointA;
	                if (item.bodyA)
	                    point = item.pointB;
	                context.beginPath();
	                context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
	                context.closePath();
	                context.stroke();
	
	                break;
	
	            }
	
	            context.setLineDash([]);
	            context.translate(-0.5, -0.5);
	        }
	
	        // render selection region
	        if (inspector.selectStart !== null) {
	            context.translate(0.5, 0.5);
	            context.lineWidth = 1;
	            context.strokeStyle = 'rgba(255,165,0,0.6)';
	            context.fillStyle = 'rgba(255,165,0,0.1)';
	            bounds = inspector.selectBounds;
	            context.beginPath();
	            context.rect(Math.floor(bounds.min.x), Math.floor(bounds.min.y), 
	                         Math.floor(bounds.max.x - bounds.min.x), Math.floor(bounds.max.y - bounds.min.y));
	            context.closePath();
	            context.stroke();
	            context.fill();
	            context.translate(-0.5, -0.5);
	        }
	
	        if (options.hasBounds)
	            context.setTransform(1, 0, 0, 1, 0, 0);
	    };
	
	    /**
	     * Description
	     * @method _createCanvas
	     * @private
	     * @param {} width
	     * @param {} height
	     * @return canvas
	     */
	    var _createCanvas = function(width, height) {
	        var canvas = document.createElement('canvas');
	        canvas.width = width;
	        canvas.height = height;
	        canvas.oncontextmenu = function() { return false; };
	        canvas.onselectstart = function() { return false; };
	        return canvas;
	    };
	
	    /**
	     * Gets the pixel ratio of the canvas.
	     * @method _getPixelRatio
	     * @private
	     * @param {HTMLElement} canvas
	     * @return {Number} pixel ratio
	     */
	    var _getPixelRatio = function(canvas) {
	        var context = canvas.getContext('2d'),
	            devicePixelRatio = window.devicePixelRatio || 1,
	            backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio
	                                      || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio
	                                      || context.backingStorePixelRatio || 1;
	
	        return devicePixelRatio / backingStorePixelRatio;
	    };
	
	    /**
	     * Gets the requested texture (an Image) via its path
	     * @method _getTexture
	     * @private
	     * @param {render} render
	     * @param {string} imagePath
	     * @return {Image} texture
	     */
	    var _getTexture = function(render, imagePath) {
	        var image = render.textures[imagePath];
	
	        if (image)
	            return image;
	
	        image = render.textures[imagePath] = new Image();
	        image.src = imagePath;
	
	        return image;
	    };
	
	    /**
	     * Applies the background to the canvas using CSS.
	     * @method applyBackground
	     * @private
	     * @param {render} render
	     * @param {string} background
	     */
	    var _applyBackground = function(render, background) {
	        var cssBackground = background;
	
	        if (/(jpg|gif|png)$/.test(background))
	            cssBackground = 'url(' + background + ')';
	
	        render.canvas.style.background = cssBackground;
	        render.canvas.style.backgroundSize = "contain";
	        render.currentBackground = background;
	    };
	
	    /*
	    *
	    *  Events Documentation
	    *
	    */
	
	    /**
	    * Fired before rendering
	    *
	    * @event beforeRender
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /**
	    * Fired after rendering
	    *
	    * @event afterRender
	    * @param {} event An event object
	    * @param {number} event.timestamp The engine.timing.timestamp of the event
	    * @param {} event.source The source object of the event
	    * @param {} event.name The name of the event
	    */
	
	    /*
	    *
	    *  Properties Documentation
	    *
	    */
	
	    /**
	     * A back-reference to the `Matter.Render` module.
	     *
	     * @property controller
	     * @type render
	     */
	
	    /**
	     * A reference to the element where the canvas is to be inserted (if `render.canvas` has not been specified)
	     *
	     * @property element
	     * @type HTMLElement
	     * @default null
	     */
	
	    /**
	     * The canvas element to render to. If not specified, one will be created if `render.element` has been specified.
	     *
	     * @property canvas
	     * @type HTMLCanvasElement
	     * @default null
	     */
	
	    /**
	     * The configuration options of the renderer.
	     *
	     * @property options
	     * @type {}
	     */
	
	    /**
	     * The target width in pixels of the `render.canvas` to be created.
	     *
	     * @property options.width
	     * @type number
	     * @default 800
	     */
	
	    /**
	     * The target height in pixels of the `render.canvas` to be created.
	     *
	     * @property options.height
	     * @type number
	     * @default 600
	     */
	
	    /**
	     * A flag that specifies if `render.bounds` should be used when rendering.
	     *
	     * @property options.hasBounds
	     * @type boolean
	     * @default false
	     */
	
	    /**
	     * A `Bounds` object that specifies the drawing view region. 
	     * Rendering will be automatically transformed and scaled to fit within the canvas size (`render.options.width` and `render.options.height`).
	     * This allows for creating views that can pan or zoom around the scene.
	     * You must also set `render.options.hasBounds` to `true` to enable bounded rendering.
	     *
	     * @property bounds
	     * @type bounds
	     */
	
	    /**
	     * The 2d rendering context from the `render.canvas` element.
	     *
	     * @property context
	     * @type CanvasRenderingContext2D
	     */
	
	    /**
	     * The sprite texture cache.
	     *
	     * @property textures
	     * @type {}
	     */
	
	})();
	
	},{"../body/Composite":2,"../collision/Grid":6,"../core/Common":14,"../core/Events":16,"../geometry/Bounds":24,"../geometry/Vector":26}],30:[function(require,module,exports){
	/**
	* See [Demo.js](https://github.com/liabru/matter-js/blob/master/demo/js/Demo.js) 
	* and [DemoMobile.js](https://github.com/liabru/matter-js/blob/master/demo/js/DemoMobile.js) for usage examples.
	*
	* @class RenderPixi
	*/
	
	var RenderPixi = {};
	
	module.exports = RenderPixi;
	
	var Composite = require('../body/Composite');
	var Common = require('../core/Common');
	
	(function() {
	    
	    /**
	     * Creates a new Pixi.js WebGL renderer
	     * @method create
	     * @param {object} options
	     * @return {RenderPixi} A new renderer
	     */
	    RenderPixi.create = function(options) {
	        var defaults = {
	            controller: RenderPixi,
	            element: null,
	            canvas: null,
	            options: {
	                width: 800,
	                height: 600,
	                background: '#fafafa',
	                wireframeBackground: '#222',
	                hasBounds: false,
	                enabled: true,
	                wireframes: true,
	                showSleeping: true,
	                showDebug: false,
	                showBroadphase: false,
	                showBounds: false,
	                showVelocity: false,
	                showCollisions: false,
	                showAxes: false,
	                showPositions: false,
	                showAngleIndicator: false,
	                showIds: false,
	                showShadows: false
	            }
	        };
	
	        var render = Common.extend(defaults, options),
	            transparent = !render.options.wireframes && render.options.background === 'transparent';
	
	        // init pixi
	        render.context = new PIXI.WebGLRenderer(render.options.width, render.options.height, {
	            view: render.canvas,
	            transparent: transparent,
	            antialias: true,
	            backgroundColor: options.background
	        });
	        
	        render.canvas = render.context.view;
	        render.container = new PIXI.Container();
	        render.bounds = render.bounds || { 
	            min: { 
	                x: 0,
	                y: 0
	            }, 
	            max: { 
	                x: render.options.width,
	                y: render.options.height
	            }
	        };
	
	        // caches
	        render.textures = {};
	        render.sprites = {};
	        render.primitives = {};
	
	        // use a sprite batch for performance
	        render.spriteContainer = new PIXI.Container();
	        render.container.addChild(render.spriteContainer);
	
	        // insert canvas
	        if (Common.isElement(render.element)) {
	            render.element.appendChild(render.canvas);
	        } else {
	            Common.log('No "render.element" passed, "render.canvas" was not inserted into document.', 'warn');
	        }
	
	        // prevent menus on canvas
	        render.canvas.oncontextmenu = function() { return false; };
	        render.canvas.onselectstart = function() { return false; };
	
	        return render;
	    };
	
	    /**
	     * Clears the scene graph
	     * @method clear
	     * @param {RenderPixi} render
	     */
	    RenderPixi.clear = function(render) {
	        var container = render.container,
	            spriteContainer = render.spriteContainer;
	
	        // clear stage container
	        while (container.children[0]) { 
	            container.removeChild(container.children[0]); 
	        }
	
	        // clear sprite batch
	        while (spriteContainer.children[0]) { 
	            spriteContainer.removeChild(spriteContainer.children[0]); 
	        }
	
	        var bgSprite = render.sprites['bg-0'];
	
	        // clear caches
	        render.textures = {};
	        render.sprites = {};
	        render.primitives = {};
	
	        // set background sprite
	        render.sprites['bg-0'] = bgSprite;
	        if (bgSprite)
	            container.addChildAt(bgSprite, 0);
	
	        // add sprite batch back into container
	        render.container.addChild(render.spriteContainer);
	
	        // reset background state
	        render.currentBackground = null;
	
	        // reset bounds transforms
	        container.scale.set(1, 1);
	        container.position.set(0, 0);
	    };
	
	    /**
	     * Sets the background of the canvas 
	     * @method setBackground
	     * @param {RenderPixi} render
	     * @param {string} background
	     */
	    RenderPixi.setBackground = function(render, background) {
	        if (render.currentBackground !== background) {
	            var isColor = background.indexOf && background.indexOf('#') !== -1,
	                bgSprite = render.sprites['bg-0'];
	
	            if (isColor) {
	                // if solid background color
	                var color = Common.colorToNumber(background);
	                render.context.backgroundColor = color;
	
	                // remove background sprite if existing
	                if (bgSprite)
	                    render.container.removeChild(bgSprite); 
	            } else {
	                // initialise background sprite if needed
	                if (!bgSprite) {
	                    var texture = _getTexture(render, background);
	
	                    bgSprite = render.sprites['bg-0'] = new PIXI.Sprite(texture);
	                    bgSprite.position.x = 0;
	                    bgSprite.position.y = 0;
	                    render.container.addChildAt(bgSprite, 0);
	                }
	            }
	
	            render.currentBackground = background;
	        }
	    };
	
	    /**
	     * Description
	     * @method world
	     * @param {engine} engine
	     */
	    RenderPixi.world = function(engine) {
	        var render = engine.render,
	            world = engine.world,
	            context = render.context,
	            container = render.container,
	            options = render.options,
	            bodies = Composite.allBodies(world),
	            allConstraints = Composite.allConstraints(world),
	            constraints = [],
	            i;
	
	        if (options.wireframes) {
	            RenderPixi.setBackground(render, options.wireframeBackground);
	        } else {
	            RenderPixi.setBackground(render, options.background);
	        }
	
	        // handle bounds
	        var boundsWidth = render.bounds.max.x - render.bounds.min.x,
	            boundsHeight = render.bounds.max.y - render.bounds.min.y,
	            boundsScaleX = boundsWidth / render.options.width,
	            boundsScaleY = boundsHeight / render.options.height;
	
	        if (options.hasBounds) {
	            // Hide bodies that are not in view
	            for (i = 0; i < bodies.length; i++) {
	                var body = bodies[i];
	                body.render.sprite.visible = Bounds.overlaps(body.bounds, render.bounds);
	            }
	
	            // filter out constraints that are not in view
	            for (i = 0; i < allConstraints.length; i++) {
	                var constraint = allConstraints[i],
	                    bodyA = constraint.bodyA,
	                    bodyB = constraint.bodyB,
	                    pointAWorld = constraint.pointA,
	                    pointBWorld = constraint.pointB;
	
	                if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
	                if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);
	
	                if (!pointAWorld || !pointBWorld)
	                    continue;
	
	                if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
	                    constraints.push(constraint);
	            }
	
	            // transform the view
	            container.scale.set(1 / boundsScaleX, 1 / boundsScaleY);
	            container.position.set(-render.bounds.min.x * (1 / boundsScaleX), -render.bounds.min.y * (1 / boundsScaleY));
	        } else {
	            constraints = allConstraints;
	        }
	
	        for (i = 0; i < bodies.length; i++)
	            RenderPixi.body(engine, bodies[i]);
	
	        for (i = 0; i < constraints.length; i++)
	            RenderPixi.constraint(engine, constraints[i]);
	
	        context.render(container);
	    };
	
	
	    /**
	     * Description
	     * @method constraint
	     * @param {engine} engine
	     * @param {constraint} constraint
	     */
	    RenderPixi.constraint = function(engine, constraint) {
	        var render = engine.render,
	            bodyA = constraint.bodyA,
	            bodyB = constraint.bodyB,
	            pointA = constraint.pointA,
	            pointB = constraint.pointB,
	            container = render.container,
	            constraintRender = constraint.render,
	            primitiveId = 'c-' + constraint.id,
	            primitive = render.primitives[primitiveId];
	
	        // initialise constraint primitive if not existing
	        if (!primitive)
	            primitive = render.primitives[primitiveId] = new PIXI.Graphics();
	
	        // don't render if constraint does not have two end points
	        if (!constraintRender.visible || !constraint.pointA || !constraint.pointB) {
	            primitive.clear();
	            return;
	        }
	
	        // add to scene graph if not already there
	        if (Common.indexOf(container.children, primitive) === -1)
	            container.addChild(primitive);
	
	        // render the constraint on every update, since they can change dynamically
	        primitive.clear();
	        primitive.beginFill(0, 0);
	        primitive.lineStyle(constraintRender.lineWidth, Common.colorToNumber(constraintRender.strokeStyle), 1);
	        
	        if (bodyA) {
	            primitive.moveTo(bodyA.position.x + pointA.x, bodyA.position.y + pointA.y);
	        } else {
	            primitive.moveTo(pointA.x, pointA.y);
	        }
	
	        if (bodyB) {
	            primitive.lineTo(bodyB.position.x + pointB.x, bodyB.position.y + pointB.y);
	        } else {
	            primitive.lineTo(pointB.x, pointB.y);
	        }
	
	        primitive.endFill();
	    };
	    
	    /**
	     * Description
	     * @method body
	     * @param {engine} engine
	     * @param {body} body
	     */
	    RenderPixi.body = function(engine, body) {
	        var render = engine.render,
	            bodyRender = body.render;
	
	        if (!bodyRender.visible)
	            return;
	
	        if (bodyRender.sprite && bodyRender.sprite.texture) {
	            var spriteId = 'b-' + body.id,
	                sprite = render.sprites[spriteId],
	                spriteContainer = render.spriteContainer;
	
	            // initialise body sprite if not existing
	            if (!sprite)
	                sprite = render.sprites[spriteId] = _createBodySprite(render, body);
	
	            // add to scene graph if not already there
	            if (Common.indexOf(spriteContainer.children, sprite) === -1)
	                spriteContainer.addChild(sprite);
	
	            // update body sprite
	            sprite.position.x = body.position.x;
	            sprite.position.y = body.position.y;
	            sprite.rotation = body.angle;
	            sprite.scale.x = bodyRender.sprite.xScale || 1;
	            sprite.scale.y = bodyRender.sprite.yScale || 1;
	        } else {
	            var primitiveId = 'b-' + body.id,
	                primitive = render.primitives[primitiveId],
	                container = render.container;
	
	            // initialise body primitive if not existing
	            if (!primitive) {
	                primitive = render.primitives[primitiveId] = _createBodyPrimitive(render, body);
	                primitive.initialAngle = body.angle;
	            }
	
	            // add to scene graph if not already there
	            if (Common.indexOf(container.children, primitive) === -1)
	                container.addChild(primitive);
	
	            // update body primitive
	            primitive.position.x = body.position.x;
	            primitive.position.y = body.position.y;
	            primitive.rotation = body.angle - primitive.initialAngle;
	        }
	    };
	
	    /**
	     * Creates a body sprite
	     * @method _createBodySprite
	     * @private
	     * @param {RenderPixi} render
	     * @param {body} body
	     * @return {PIXI.Sprite} sprite
	     */
	    var _createBodySprite = function(render, body) {
	        var bodyRender = body.render,
	            texturePath = bodyRender.sprite.texture,
	            texture = _getTexture(render, texturePath),
	            sprite = new PIXI.Sprite(texture);
	
	        sprite.anchor.x = 0.5;
	        sprite.anchor.y = 0.5;
	
	        return sprite;
	    };
	
	    /**
	     * Creates a body primitive
	     * @method _createBodyPrimitive
	     * @private
	     * @param {RenderPixi} render
	     * @param {body} body
	     * @return {PIXI.Graphics} graphics
	     */
	    var _createBodyPrimitive = function(render, body) {
	        var bodyRender = body.render,
	            options = render.options,
	            primitive = new PIXI.Graphics(),
	            fillStyle = Common.colorToNumber(bodyRender.fillStyle),
	            strokeStyle = Common.colorToNumber(bodyRender.strokeStyle),
	            strokeStyleIndicator = Common.colorToNumber(bodyRender.strokeStyle),
	            strokeStyleWireframe = Common.colorToNumber('#bbb'),
	            strokeStyleWireframeIndicator = Common.colorToNumber('#CD5C5C'),
	            part;
	
	        primitive.clear();
	
	        // handle compound parts
	        for (var k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
	            part = body.parts[k];
	
	            if (!options.wireframes) {
	                primitive.beginFill(fillStyle, 1);
	                primitive.lineStyle(bodyRender.lineWidth, strokeStyle, 1);
	            } else {
	                primitive.beginFill(0, 0);
	                primitive.lineStyle(1, strokeStyleWireframe, 1);
	            }
	
	            primitive.moveTo(part.vertices[0].x - body.position.x, part.vertices[0].y - body.position.y);
	
	            for (var j = 1; j < part.vertices.length; j++) {
	                primitive.lineTo(part.vertices[j].x - body.position.x, part.vertices[j].y - body.position.y);
	            }
	
	            primitive.lineTo(part.vertices[0].x - body.position.x, part.vertices[0].y - body.position.y);
	
	            primitive.endFill();
	
	            // angle indicator
	            if (options.showAngleIndicator || options.showAxes) {
	                primitive.beginFill(0, 0);
	
	                if (options.wireframes) {
	                    primitive.lineStyle(1, strokeStyleWireframeIndicator, 1);
	                } else {
	                    primitive.lineStyle(1, strokeStyleIndicator);
	                }
	
	                primitive.moveTo(part.position.x - body.position.x, part.position.y - body.position.y);
	                primitive.lineTo(((part.vertices[0].x + part.vertices[part.vertices.length-1].x) / 2 - body.position.x), 
	                                 ((part.vertices[0].y + part.vertices[part.vertices.length-1].y) / 2 - body.position.y));
	
	                primitive.endFill();
	            }
	        }
	
	        return primitive;
	    };
	
	    /**
	     * Gets the requested texture (a PIXI.Texture) via its path
	     * @method _getTexture
	     * @private
	     * @param {RenderPixi} render
	     * @param {string} imagePath
	     * @return {PIXI.Texture} texture
	     */
	    var _getTexture = function(render, imagePath) {
	        var texture = render.textures[imagePath];
	
	        if (!texture)
	            texture = render.textures[imagePath] = PIXI.Texture.fromImage(imagePath);
	
	        return texture;
	    };
	
	})();
	
	},{"../body/Composite":2,"../core/Common":14}]},{},[28])(28)
	});

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(124);


/***/ },
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var filenameWithoutLoaders = function filenameWithoutLoaders(filename) {
	  var index = filename.lastIndexOf('!');
	
	  return index < 0 ? filename : filename.substr(index + 1);
	};
	
	var _filenameWithoutLoaders = filenameWithoutLoaders;
	
	__$Getters__['filenameWithoutLoaders'] = function () {
	  return filenameWithoutLoaders;
	};
	
	__$Setters__['filenameWithoutLoaders'] = function (value) {
	  exports.filenameWithoutLoaders = filenameWithoutLoaders = value;
	};
	
	__$Resetters__['filenameWithoutLoaders'] = function () {
	  exports.filenameWithoutLoaders = filenameWithoutLoaders = _filenameWithoutLoaders;
	};
	
	exports.filenameWithoutLoaders = _filenameWithoutLoaders;
	var filenameHasLoaders = function filenameHasLoaders(filename) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  return actualFilename !== filename;
	};
	
	var _filenameHasLoaders = filenameHasLoaders;
	
	__$Getters__['filenameHasLoaders'] = function () {
	  return filenameHasLoaders;
	};
	
	__$Setters__['filenameHasLoaders'] = function (value) {
	  exports.filenameHasLoaders = filenameHasLoaders = value;
	};
	
	__$Resetters__['filenameHasLoaders'] = function () {
	  exports.filenameHasLoaders = filenameHasLoaders = _filenameHasLoaders;
	};
	
	exports.filenameHasLoaders = _filenameHasLoaders;
	var filenameHasSchema = function filenameHasSchema(filename) {
	  return /^[\w]+\:/.test(filename);
	};
	
	var _filenameHasSchema = filenameHasSchema;
	
	__$Getters__['filenameHasSchema'] = function () {
	  return filenameHasSchema;
	};
	
	__$Setters__['filenameHasSchema'] = function (value) {
	  exports.filenameHasSchema = filenameHasSchema = value;
	};
	
	__$Resetters__['filenameHasSchema'] = function () {
	  exports.filenameHasSchema = filenameHasSchema = _filenameHasSchema;
	};
	
	exports.filenameHasSchema = _filenameHasSchema;
	var isFilenameAbsolute = function isFilenameAbsolute(filename) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  if (actualFilename.indexOf('/') === 0) {
	    return true;
	  }
	
	  return false;
	};
	
	var _isFilenameAbsolute = isFilenameAbsolute;
	
	__$Getters__['isFilenameAbsolute'] = function () {
	  return isFilenameAbsolute;
	};
	
	__$Setters__['isFilenameAbsolute'] = function (value) {
	  exports.isFilenameAbsolute = isFilenameAbsolute = value;
	};
	
	__$Resetters__['isFilenameAbsolute'] = function () {
	  exports.isFilenameAbsolute = isFilenameAbsolute = _isFilenameAbsolute;
	};
	
	exports.isFilenameAbsolute = _isFilenameAbsolute;
	var makeUrl = function makeUrl(filename, scheme, line, column) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  if (filenameHasSchema(filename)) {
	    return actualFilename;
	  }
	
	  var url = 'file://' + actualFilename;
	
	  if (scheme) {
	    url = scheme + '://open?url=' + url;
	
	    if (line && actualFilename === filename) {
	      url = url + '&line=' + line;
	
	      if (column) {
	        url = url + '&column=' + column;
	      }
	    }
	  }
	
	  return url;
	};
	
	var _makeUrl = makeUrl;
	
	__$Getters__['makeUrl'] = function () {
	  return makeUrl;
	};
	
	__$Setters__['makeUrl'] = function (value) {
	  exports.makeUrl = makeUrl = value;
	};
	
	__$Resetters__['makeUrl'] = function () {
	  exports.makeUrl = makeUrl = _makeUrl;
	};
	
	exports.makeUrl = _makeUrl;
	var makeLinkText = function makeLinkText(filename, line, column) {
	  var text = filenameWithoutLoaders(filename);
	
	  if (line && text === filename) {
	    text = text + ':' + line;
	
	    if (column) {
	      text = text + ':' + column;
	    }
	  }
	
	  return text;
	};
	var _makeLinkText = makeLinkText;
	
	__$Getters__['makeLinkText'] = function () {
	  return makeLinkText;
	};
	
	__$Setters__['makeLinkText'] = function (value) {
	  exports.makeLinkText = makeLinkText = value;
	};
	
	__$Resetters__['makeLinkText'] = function () {
	  exports.makeLinkText = makeLinkText = _makeLinkText;
	};
	
	exports.makeLinkText = _makeLinkText;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	exports['default'] = __RewireAPI__;

/***/ },
/* 338 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var _defaultExport = {
	  redbox: {
	    boxSizing: 'border-box',
	    fontFamily: 'sans-serif',
	    position: 'fixed',
	    padding: 10,
	    top: 0,
	    left: 0,
	    bottom: 0,
	    right: 0,
	    width: '100%',
	    background: 'rgb(204, 0, 0)',
	    color: 'white',
	    zIndex: 9999,
	    textAlign: 'left',
	    fontSize: '16px',
	    lineHeight: 1.2
	  },
	  message: {
	    fontWeight: 'bold'
	  },
	  stack: {
	    fontFamily: 'monospace',
	    marginTop: '2em'
	  },
	  frame: {
	    marginTop: '1em'
	  },
	  file: {
	    fontSize: '0.8em',
	    color: 'rgba(255, 255, 255, 0.7)'
	  },
	  linkToFile: {
	    textDecoration: 'none',
	    color: 'rgba(255, 255, 255, 0.7)'
	  }
	};
	
	if (typeof _defaultExport === 'object' || typeof _defaultExport === 'function') {
	  Object.defineProperty(_defaultExport, '__Rewire__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__set__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__ResetDependency__', {
	    'value': __ResetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__GetDependency__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__get__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__RewireAPI__', {
	    'value': __RewireAPI__,
	    'enumberable': false
	  });
	}
	
	exports['default'] = _defaultExport;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	module.exports = exports['default'];

/***/ },
/* 339 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    'use strict';
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
	
	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(340)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('stackframe'));
	    } else {
	        root.ErrorStackParser = factory(root.StackFrame);
	    }
	}(this, function ErrorStackParser(StackFrame) {
	    'use strict';
	
	    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
	    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
	    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;
	
	    return {
	        /**
	         * Given an Error object, extract the most information from it.
	         * @param error {Error}
	         * @return Array[StackFrame]
	         */
	        parse: function ErrorStackParser$$parse(error) {
	            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
	                return this.parseOpera(error);
	            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
	                return this.parseV8OrIE(error);
	            } else if (error.stack && error.stack.match(FIREFOX_SAFARI_STACK_REGEXP)) {
	                return this.parseFFOrSafari(error);
	            } else {
	                throw new Error('Cannot parse given Error object');
	            }
	        },
	
	        /**
	         * Separate line and column numbers from a URL-like string.
	         * @param urlLike String
	         * @return Array[String]
	         */
	        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
	            // Fail-fast but return locations like "(native)"
	            if (urlLike.indexOf(':') === -1) {
	                return [urlLike];
	            }
	
	            var locationParts = urlLike.replace(/[\(\)\s]/g, '').split(':');
	            var lastNumber = locationParts.pop();
	            var possibleNumber = locationParts[locationParts.length - 1];
	            if (!isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber)) {
	                var lineNumber = locationParts.pop();
	                return [locationParts.join(':'), lineNumber, lastNumber];
	            } else {
	                return [locationParts.join(':'), lastNumber, undefined];
	            }
	        },
	
	        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !!line.match(CHROME_IE_STACK_REGEXP);
	            }, this).map(function (line) {
	                if (line.indexOf('(eval ') > -1) {
	                    // Throw away eval information until we implement stacktrace.js/stackframe#8
	                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
	                }
	                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionName = tokens.join(' ') || undefined;
	                var fileName = locationParts[0] === 'eval' ? undefined : locationParts[0];
	
	                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
	            }, this);
	        },
	
	        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
	            }, this).map(function (line) {
	                // Throw away eval information until we implement stacktrace.js/stackframe#8
	                if (line.indexOf(' > eval') > -1) {
	                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
	                }
	
	                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
	                    // Safari eval frames only have function names and nothing else
	                    return new StackFrame(line);
	                } else {
	                    var tokens = line.split('@');
	                    var locationParts = this.extractLocation(tokens.pop());
	                    var functionName = tokens.shift() || undefined;
	                    return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2], line);
	                }
	            }, this);
	        },
	
	        parseOpera: function ErrorStackParser$$parseOpera(e) {
	            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
	                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
	                return this.parseOpera9(e);
	            } else if (!e.stack) {
	                return this.parseOpera10(e);
	            } else {
	                return this.parseOpera11(e);
	            }
	        },
	
	        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
	            var lines = e.message.split('\n');
	            var result = [];
	
	            for (var i = 2, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
	                }
	            }
	
	            return result;
	        },
	
	        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
	            var lines = e.stacktrace.split('\n');
	            var result = [];
	
	            for (var i = 0, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame(match[3] || undefined, undefined, match[2], match[1], undefined, lines[i]));
	                }
	            }
	
	            return result;
	        },
	
	        // Opera 10.65+ Error.stack very similar to FF/Safari
	        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) &&
	                    !line.match(/^Error created at/);
	            }, this).map(function (line) {
	                var tokens = line.split('@');
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionCall = (tokens.shift() || '');
	                var functionName = functionCall
	                        .replace(/<anonymous function(: (\w+))?>/, '$2')
	                        .replace(/\([^\)]*\)/g, '') || undefined;
	                var argsRaw;
	                if (functionCall.match(/\(([^\)]*)\)/)) {
	                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
	                }
	                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ? undefined : argsRaw.split(',');
	                return new StackFrame(functionName, args, locationParts[0], locationParts[1], locationParts[2], line);
	            }, this);
	        }
	    };
	}));
	


/***/ },
/* 340 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    'use strict';
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
	
	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory();
	    } else {
	        root.StackFrame = factory();
	    }
	}(this, function () {
	    'use strict';
	    function _isNumber(n) {
	        return !isNaN(parseFloat(n)) && isFinite(n);
	    }
	
	    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
	        if (functionName !== undefined) {
	            this.setFunctionName(functionName);
	        }
	        if (args !== undefined) {
	            this.setArgs(args);
	        }
	        if (fileName !== undefined) {
	            this.setFileName(fileName);
	        }
	        if (lineNumber !== undefined) {
	            this.setLineNumber(lineNumber);
	        }
	        if (columnNumber !== undefined) {
	            this.setColumnNumber(columnNumber);
	        }
	        if (source !== undefined) {
	            this.setSource(source);
	        }
	    }
	
	    StackFrame.prototype = {
	        getFunctionName: function () {
	            return this.functionName;
	        },
	        setFunctionName: function (v) {
	            this.functionName = String(v);
	        },
	
	        getArgs: function () {
	            return this.args;
	        },
	        setArgs: function (v) {
	            if (Object.prototype.toString.call(v) !== '[object Array]') {
	                throw new TypeError('Args must be an Array');
	            }
	            this.args = v;
	        },
	
	        // NOTE: Property name may be misleading as it includes the path,
	        // but it somewhat mirrors V8's JavaScriptStackTraceApi
	        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
	        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
	        getFileName: function () {
	            return this.fileName;
	        },
	        setFileName: function (v) {
	            this.fileName = String(v);
	        },
	
	        getLineNumber: function () {
	            return this.lineNumber;
	        },
	        setLineNumber: function (v) {
	            if (!_isNumber(v)) {
	                throw new TypeError('Line Number must be a Number');
	            }
	            this.lineNumber = Number(v);
	        },
	
	        getColumnNumber: function () {
	            return this.columnNumber;
	        },
	        setColumnNumber: function (v) {
	            if (!_isNumber(v)) {
	                throw new TypeError('Column Number must be a Number');
	            }
	            this.columnNumber = Number(v);
	        },
	
	        getSource: function () {
	            return this.source;
	        },
	        setSource: function (v) {
	            this.source = String(v);
	        },
	
	        toString: function() {
	            var functionName = this.getFunctionName() || '{anonymous}';
	            var args = '(' + (this.getArgs() || []).join(',') + ')';
	            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
	            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
	            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
	            return functionName + args + fileName + lineNumber + columnNumber;
	        }
	    };
	
	    return StackFrame;
	}));


/***/ },
/* 341 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 348 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(209);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(347)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./core.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./core.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 349 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/utf8js v2.0.0 by @mathias */
	;(function(root) {
	
		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;
	
		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;
	
		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}
	
		/*--------------------------------------------------------------------------*/
	
		var stringFromCharCode = String.fromCharCode;
	
		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}
	
		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
		}
		/*--------------------------------------------------------------------------*/
	
		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}
	
		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}
	
		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}
	
		/*--------------------------------------------------------------------------*/
	
		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}
	
			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}
	
			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}
	
		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;
	
			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}
	
			if (byteIndex == byteCount) {
				return false;
			}
	
			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}
	
			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				var byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}
	
			throw Error('Invalid UTF-8 detected');
		}
	
		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}
	
		/*--------------------------------------------------------------------------*/
	
		var utf8 = {
			'version': '2.0.0',
			'encode': utf8encode,
			'decode': utf8decode
		};
	
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(378)(module), (function() { return this; }())))

/***/ },
/* 350 */
/***/ function(module, exports, __webpack_require__) {

	var Web3 = __webpack_require__(361);
	
	// dont override global variable
	if (typeof window !== 'undefined' && typeof window.Web3 === 'undefined') {
	    window.Web3 = Web3;
	}
	
	module.exports = Web3;


/***/ },
/* 351 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	/**
	 * SolidityTypeAddress is a prootype that represents address type
	 * It matches:
	 * address
	 * address[]
	 * address[4]
	 * address[][]
	 * address[3][]
	 * address[][6][], ...
	 */
	var SolidityTypeAddress = function () {
	    this._inputFormatter = f.formatInputInt;
	    this._outputFormatter = f.formatOutputAddress;
	};
	
	SolidityTypeAddress.prototype = new SolidityType({});
	SolidityTypeAddress.prototype.constructor = SolidityTypeAddress;
	
	SolidityTypeAddress.prototype.isType = function (name) {
	    return !!name.match(/address(\[([0-9]*)\])?/);
	};
	
	SolidityTypeAddress.prototype.staticPartLength = function (name) {
	    return 32 * this.staticArrayLength(name);
	};
	
	module.exports = SolidityTypeAddress;
	


/***/ },
/* 352 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	/**
	 * SolidityTypeBool is a prootype that represents bool type
	 * It matches:
	 * bool
	 * bool[]
	 * bool[4]
	 * bool[][]
	 * bool[3][]
	 * bool[][6][], ...
	 */
	var SolidityTypeBool = function () {
	    this._inputFormatter = f.formatInputBool;
	    this._outputFormatter = f.formatOutputBool;
	};
	
	SolidityTypeBool.prototype = new SolidityType({});
	SolidityTypeBool.prototype.constructor = SolidityTypeBool;
	
	SolidityTypeBool.prototype.isType = function (name) {
	    return !!name.match(/^bool(\[([0-9]*)\])*$/);
	};
	
	SolidityTypeBool.prototype.staticPartLength = function (name) {
	    return 32 * this.staticArrayLength(name);
	};
	
	module.exports = SolidityTypeBool;


/***/ },
/* 353 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	/**
	 * SolidityTypeBytes is a prootype that represents bytes type
	 * It matches:
	 * bytes
	 * bytes[]
	 * bytes[4]
	 * bytes[][]
	 * bytes[3][]
	 * bytes[][6][], ...
	 * bytes32
	 * bytes64[]
	 * bytes8[4]
	 * bytes256[][]
	 * bytes[3][]
	 * bytes64[][6][], ...
	 */
	var SolidityTypeBytes = function () {
	    this._inputFormatter = f.formatInputBytes;
	    this._outputFormatter = f.formatOutputBytes;
	};
	
	SolidityTypeBytes.prototype = new SolidityType({});
	SolidityTypeBytes.prototype.constructor = SolidityTypeBytes;
	
	SolidityTypeBytes.prototype.isType = function (name) {
	    return !!name.match(/^bytes([0-9]{1,})(\[([0-9]*)\])*$/);
	};
	
	SolidityTypeBytes.prototype.staticPartLength = function (name) {
	    var matches = name.match(/^bytes([0-9]*)/);
	    var size = parseInt(matches[1]);
	    return size * this.staticArrayLength(name);
	};
	
	module.exports = SolidityTypeBytes;


/***/ },
/* 354 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	var SolidityTypeDynamicBytes = function () {
	    this._inputFormatter = f.formatInputDynamicBytes;
	    this._outputFormatter = f.formatOutputDynamicBytes;
	};
	
	SolidityTypeDynamicBytes.prototype = new SolidityType({});
	SolidityTypeDynamicBytes.prototype.constructor = SolidityTypeDynamicBytes;
	
	SolidityTypeDynamicBytes.prototype.isType = function (name) {
	    return !!name.match(/^bytes(\[([0-9]*)\])*$/);
	};
	
	SolidityTypeDynamicBytes.prototype.staticPartLength = function (name) {
	    return 32 * this.staticArrayLength(name);
	};
	
	SolidityTypeDynamicBytes.prototype.isDynamicType = function () {
	    return true;
	};
	
	module.exports = SolidityTypeDynamicBytes;
	


/***/ },
/* 355 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	/**
	 * SolidityTypeInt is a prootype that represents int type
	 * It matches:
	 * int
	 * int[]
	 * int[4]
	 * int[][]
	 * int[3][]
	 * int[][6][], ...
	 * int32
	 * int64[]
	 * int8[4]
	 * int256[][]
	 * int[3][]
	 * int64[][6][], ...
	 */
	var SolidityTypeInt = function () {
	    this._inputFormatter = f.formatInputInt;
	    this._outputFormatter = f.formatOutputInt;
	};
	
	SolidityTypeInt.prototype = new SolidityType({});
	SolidityTypeInt.prototype.constructor = SolidityTypeInt;
	
	SolidityTypeInt.prototype.isType = function (name) {
	    return !!name.match(/^int([0-9]*)?(\[([0-9]*)\])*$/);
	};
	
	SolidityTypeInt.prototype.staticPartLength = function (name) {
	    return 32 * this.staticArrayLength(name);
	};
	
	module.exports = SolidityTypeInt;


/***/ },
/* 356 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	/**
	 * SolidityTypeReal is a prootype that represents real type
	 * It matches:
	 * real
	 * real[]
	 * real[4]
	 * real[][]
	 * real[3][]
	 * real[][6][], ...
	 * real32
	 * real64[]
	 * real8[4]
	 * real256[][]
	 * real[3][]
	 * real64[][6][], ...
	 */
	var SolidityTypeReal = function () {
	    this._inputFormatter = f.formatInputReal;
	    this._outputFormatter = f.formatOutputReal;
	};
	
	SolidityTypeReal.prototype = new SolidityType({});
	SolidityTypeReal.prototype.constructor = SolidityTypeReal;
	
	SolidityTypeReal.prototype.isType = function (name) {
	    return !!name.match(/real([0-9]*)?(\[([0-9]*)\])?/);
	};
	
	SolidityTypeReal.prototype.staticPartLength = function (name) {
	    return 32 * this.staticArrayLength(name);
	};
	
	module.exports = SolidityTypeReal;


/***/ },
/* 357 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	var SolidityTypeString = function () {
	    this._inputFormatter = f.formatInputString;
	    this._outputFormatter = f.formatOutputString;
	};
	
	SolidityTypeString.prototype = new SolidityType({});
	SolidityTypeString.prototype.constructor = SolidityTypeString;
	
	SolidityTypeString.prototype.isType = function (name) {
	    return !!name.match(/^string(\[([0-9]*)\])*$/);
	};
	
	SolidityTypeString.prototype.staticPartLength = function (name) {
	    return 32 * this.staticArrayLength(name);
	};
	
	SolidityTypeString.prototype.isDynamicType = function () {
	    return true;
	};
	
	module.exports = SolidityTypeString;
	


/***/ },
/* 358 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	/**
	 * SolidityTypeUInt is a prootype that represents uint type
	 * It matches:
	 * uint
	 * uint[]
	 * uint[4]
	 * uint[][]
	 * uint[3][]
	 * uint[][6][], ...
	 * uint32
	 * uint64[]
	 * uint8[4]
	 * uint256[][]
	 * uint[3][]
	 * uint64[][6][], ...
	 */
	var SolidityTypeUInt = function () {
	    this._inputFormatter = f.formatInputInt;
	    this._outputFormatter = f.formatOutputUInt;
	};
	
	SolidityTypeUInt.prototype = new SolidityType({});
	SolidityTypeUInt.prototype.constructor = SolidityTypeUInt;
	
	SolidityTypeUInt.prototype.isType = function (name) {
	    return !!name.match(/^uint([0-9]*)?(\[([0-9]*)\])*$/);
	};
	
	SolidityTypeUInt.prototype.staticPartLength = function (name) {
	    return 32 * this.staticArrayLength(name);
	};
	
	module.exports = SolidityTypeUInt;


/***/ },
/* 359 */
/***/ function(module, exports, __webpack_require__) {

	var f = __webpack_require__(13);
	var SolidityType = __webpack_require__(17);
	
	/**
	 * SolidityTypeUReal is a prootype that represents ureal type
	 * It matches:
	 * ureal
	 * ureal[]
	 * ureal[4]
	 * ureal[][]
	 * ureal[3][]
	 * ureal[][6][], ...
	 * ureal32
	 * ureal64[]
	 * ureal8[4]
	 * ureal256[][]
	 * ureal[3][]
	 * ureal64[][6][], ...
	 */
	var SolidityTypeUReal = function () {
	    this._inputFormatter = f.formatInputReal;
	    this._outputFormatter = f.formatOutputUReal;
	};
	
	SolidityTypeUReal.prototype = new SolidityType({});
	SolidityTypeUReal.prototype.constructor = SolidityTypeUReal;
	
	SolidityTypeUReal.prototype.isType = function (name) {
	    return !!name.match(/^ureal([0-9]*)?(\[([0-9]*)\])*$/);
	};
	
	SolidityTypeUReal.prototype.staticPartLength = function (name) {
	    return 32 * this.staticArrayLength(name);
	};
	
	module.exports = SolidityTypeUReal;


/***/ },
/* 360 */
/***/ function(module, exports) {

	'use strict';
	
	// go env doesn't have and need XMLHttpRequest
	if (typeof XMLHttpRequest === 'undefined') {
	    exports.XMLHttpRequest = {};
	} else {
	    exports.XMLHttpRequest = XMLHttpRequest; // jshint ignore:line
	}
	


/***/ },
/* 361 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file web3.js
	 * @authors:
	 *   Jeffrey Wilcke <jeff@ethdev.com>
	 *   Marek Kotewicz <marek@ethdev.com>
	 *   Marian Oancea <marian@ethdev.com>
	 *   Fabian Vogelsteller <fabian@ethdev.com>
	 *   Gav Wood <g@ethdev.com>
	 * @date 2014
	 */
	
	var RequestManager = __webpack_require__(374);
	var Iban = __webpack_require__(62);
	var Eth = __webpack_require__(370);
	var DB = __webpack_require__(369);
	var Shh = __webpack_require__(372);
	var Net = __webpack_require__(371);
	var Settings = __webpack_require__(375);
	var version = __webpack_require__(239);
	var utils = __webpack_require__(8);
	var sha3 = __webpack_require__(60);
	var extend = __webpack_require__(365);
	var Batch = __webpack_require__(363);
	var Property = __webpack_require__(64);
	var HttpProvider = __webpack_require__(367);
	var IpcProvider = __webpack_require__(368);
	
	
	
	function Web3 (provider) {
	    this._requestManager = new RequestManager(provider);
	    this.currentProvider = provider;
	    this.eth = new Eth(this);
	    this.db = new DB(this);
	    this.shh = new Shh(this);
	    this.net = new Net(this);
	    this.settings = new Settings();
	    this.version = {
	        api: version.version
	    };
	    this.providers = {
	        HttpProvider: HttpProvider,
	        IpcProvider: IpcProvider
	    };
	    this._extend = extend(this);
	    this._extend({
	        properties: properties()
	    });
	}
	
	// expose providers on the class
	Web3.providers = {
	    HttpProvider: HttpProvider,
	    IpcProvider: IpcProvider
	};
	
	Web3.prototype.setProvider = function (provider) {
	    this._requestManager.setProvider(provider);
	    this.currentProvider = provider;
	};
	
	Web3.prototype.reset = function (keepIsSyncing) {
	    this._requestManager.reset(keepIsSyncing);
	    this.settings = new Settings();
	};
	
	Web3.prototype.toHex = utils.toHex;
	Web3.prototype.toAscii = utils.toAscii;
	Web3.prototype.toUtf8 = utils.toUtf8;
	Web3.prototype.fromAscii = utils.fromAscii;
	Web3.prototype.fromUtf8 = utils.fromUtf8;
	Web3.prototype.toDecimal = utils.toDecimal;
	Web3.prototype.fromDecimal = utils.fromDecimal;
	Web3.prototype.toBigNumber = utils.toBigNumber;
	Web3.prototype.toWei = utils.toWei;
	Web3.prototype.fromWei = utils.fromWei;
	Web3.prototype.isAddress = utils.isAddress;
	Web3.prototype.isIBAN = utils.isIBAN;
	Web3.prototype.sha3 = sha3;
	
	/**
	 * Transforms direct icap to address
	 */
	Web3.prototype.fromICAP = function (icap) {
	    var iban = new Iban(icap);
	    return iban.address();
	};
	
	var properties = function () {
	    return [
	        new Property({
	            name: 'version.node',
	            getter: 'web3_clientVersion'
	        }),
	        new Property({
	            name: 'version.network',
	            getter: 'net_version',
	            inputFormatter: utils.toDecimal
	        }),
	        new Property({
	            name: 'version.ethereum',
	            getter: 'eth_protocolVersion',
	            inputFormatter: utils.toDecimal
	        }),
	        new Property({
	            name: 'version.whisper',
	            getter: 'shh_version',
	            inputFormatter: utils.toDecimal
	        })
	    ];
	};
	
	Web3.prototype.isConnected = function(){
	    return (this.currentProvider && this.currentProvider.isConnected());
	};
	
	Web3.prototype.createBatch = function () {
	    return new Batch(this);
	};
	
	module.exports = Web3;
	


/***/ },
/* 362 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file allevents.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2014
	 */
	
	var sha3 = __webpack_require__(60);
	var SolidityEvent = __webpack_require__(159);
	var formatters = __webpack_require__(22);
	var utils = __webpack_require__(8);
	var Filter = __webpack_require__(61);
	var watches = __webpack_require__(63);
	
	var AllSolidityEvents = function (requestManager, json, address) {
	    this._requestManager = requestManager;
	    this._json = json;
	    this._address = address;
	};
	
	AllSolidityEvents.prototype.encode = function (options) {
	    options = options || {};
	    var result = {};
	
	    ['fromBlock', 'toBlock'].filter(function (f) {
	        return options[f] !== undefined;
	    }).forEach(function (f) {
	        result[f] = formatters.inputBlockNumberFormatter(options[f]);
	    });
	
	    result.address = this._address;
	
	    return result;
	};
	
	AllSolidityEvents.prototype.decode = function (data) {
	    data.data = data.data || '';
	    data.topics = data.topics || [];
	
	    var eventTopic = data.topics[0].slice(2);
	    var match = this._json.filter(function (j) {
	        return eventTopic === sha3(utils.transformToFullName(j));
	    })[0];
	
	    if (!match) { // cannot find matching event?
	        console.warn('cannot find event for log');
	        return data;
	    }
	
	    var event = new SolidityEvent(this._requestManager, match, this._address);
	    return event.decode(data);
	};
	
	AllSolidityEvents.prototype.execute = function (options, callback) {
	
	    if (utils.isFunction(arguments[arguments.length - 1])) {
	        callback = arguments[arguments.length - 1];
	        if(arguments.length === 1)
	            options = null;
	    }
	
	    var o = this.encode(options);
	    var formatter = this.decode.bind(this);
	    return new Filter(this._requestManager, o, watches.eth(), formatter, callback);
	};
	
	AllSolidityEvents.prototype.attachToContract = function (contract) {
	    var execute = this.execute.bind(this);
	    contract.allEvents = execute;
	};
	
	module.exports = AllSolidityEvents;
	


/***/ },
/* 363 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file batch.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var Jsonrpc = __webpack_require__(160);
	var errors = __webpack_require__(41);
	
	var Batch = function (web3) {
	    this.requestManager = web3._requestManager;
	    this.requests = [];
	};
	
	/**
	 * Should be called to add create new request to batch request
	 *
	 * @method add
	 * @param {Object} jsonrpc requet object
	 */
	Batch.prototype.add = function (request) {
	    this.requests.push(request);
	};
	
	/**
	 * Should be called to execute batch request
	 *
	 * @method execute
	 */
	Batch.prototype.execute = function () {
	    var requests = this.requests;
	    this.requestManager.sendBatch(requests, function (err, results) {
	        results = results || [];
	        requests.map(function (request, index) {
	            return results[index] || {};
	        }).forEach(function (result, index) {
	            if (requests[index].callback) {
	
	                if (!Jsonrpc.getInstance().isValidResponse(result)) {
	                    return requests[index].callback(errors.InvalidResponse(result));
	                }
	
	                requests[index].callback(null, (requests[index].format ? requests[index].format(result.result) : result.result));
	            }
	        });
	    }); 
	};
	
	module.exports = Batch;
	


/***/ },
/* 364 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file contract.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2014
	 */
	
	var utils = __webpack_require__(8);
	var coder = __webpack_require__(94);
	var SolidityEvent = __webpack_require__(159);
	var SolidityFunction = __webpack_require__(366);
	var AllEvents = __webpack_require__(362);
	
	/**
	 * Should be called to encode constructor params
	 *
	 * @method encodeConstructorParams
	 * @param {Array} abi
	 * @param {Array} constructor params
	 */
	var encodeConstructorParams = function (abi, params) {
	    return abi.filter(function (json) {
	        return json.type === 'constructor' && json.inputs.length === params.length;
	    }).map(function (json) {
	        return json.inputs.map(function (input) {
	            return input.type;
	        });
	    }).map(function (types) {
	        return coder.encodeParams(types, params);
	    })[0] || '';
	};
	
	/**
	 * Should be called to add functions to contract object
	 *
	 * @method addFunctionsToContract
	 * @param {Contract} contract
	 * @param {Array} abi
	 */
	var addFunctionsToContract = function (contract) {
	    contract.abi.filter(function (json) {
	        return json.type === 'function';
	    }).map(function (json) {
	        return new SolidityFunction(contract._eth, json, contract.address);
	    }).forEach(function (f) {
	        f.attachToContract(contract);
	    });
	};
	
	/**
	 * Should be called to add events to contract object
	 *
	 * @method addEventsToContract
	 * @param {Contract} contract
	 * @param {Array} abi
	 */
	var addEventsToContract = function (contract) {
	    var events = contract.abi.filter(function (json) {
	        return json.type === 'event';
	    });
	
	    var All = new AllEvents(contract._eth._requestManager, events, contract.address);
	    All.attachToContract(contract);
	    
	    events.map(function (json) {
	        return new SolidityEvent(contract._eth._requestManager, json, contract.address);
	    }).forEach(function (e) {
	        e.attachToContract(contract);
	    });
	};
	
	
	/**
	 * Should be called to check if the contract gets properly deployed on the blockchain.
	 *
	 * @method checkForContractAddress
	 * @param {Object} contract
	 * @param {Function} callback
	 * @returns {Undefined}
	 */
	var checkForContractAddress = function(contract, callback){
	    var count = 0,
	        callbackFired = false;
	
	    // wait for receipt
	    var filter = contract._eth.filter('latest', function(e){
	        if (!e && !callbackFired) {
	            count++;
	
	            // stop watching after 50 blocks (timeout)
	            if (count > 50) {
	                
	                filter.stopWatching();
	                callbackFired = true;
	
	                if (callback)
	                    callback(new Error('Contract transaction couldn\'t be found after 50 blocks'));
	                else
	                    throw new Error('Contract transaction couldn\'t be found after 50 blocks');
	
	
	            } else {
	
	                contract._eth.getTransactionReceipt(contract.transactionHash, function(e, receipt){
	                    if(receipt && !callbackFired) {
	
	                        contract._eth.getCode(receipt.contractAddress, function(e, code){
	                            /*jshint maxcomplexity: 6 */
	
	                            if(callbackFired || !code)
	                                return;
	                            
	                            filter.stopWatching();
	                            callbackFired = true;
	
	                            if(code.length > 2) {
	
	                                // console.log('Contract code deployed!');
	
	                                contract.address = receipt.contractAddress;
	
	                                // attach events and methods again after we have
	                                addFunctionsToContract(contract);
	                                addEventsToContract(contract);
	
	                                // call callback for the second time
	                                if(callback)
	                                    callback(null, contract);
	
	                            } else {
	                                if(callback)
	                                    callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));
	                                else
	                                    throw new Error('The contract code couldn\'t be stored, please check your gas amount.');
	                            }
	                        });
	                    }
	                });
	            }
	        }
	    });
	};
	
	/**
	 * Should be called to create new ContractFactory instance
	 *
	 * @method ContractFactory
	 * @param {Array} abi
	 */
	var ContractFactory = function (eth, abi) {
	    this.eth = eth;
	    this.abi = abi;
	
	    this.new.getData = this.getData.bind(this);
	};
	
	/**
	 * Should be called to create new ContractFactory
	 *
	 * @method contract
	 * @param {Array} abi
	 * @returns {ContractFactory} new contract factory
	 */
	//var contract = function (abi) {
	    //return new ContractFactory(abi);
	//};
	
	/**
	 * Should be called to create new contract on a blockchain
	 * 
	 * @method new
	 * @param {Any} contract constructor param1 (optional)
	 * @param {Any} contract constructor param2 (optional)
	 * @param {Object} contract transaction object (required)
	 * @param {Function} callback
	 * @returns {Contract} returns contract instance
	 */
	ContractFactory.prototype.new = function () {
	    var contract = new Contract(this.eth, this.abi);
	
	    // parse arguments
	    var options = {}; // required!
	    var callback;
	
	    var args = Array.prototype.slice.call(arguments);
	    if (utils.isFunction(args[args.length - 1])) {
	        callback = args.pop();
	    }
	
	    var last = args[args.length - 1];
	    if (utils.isObject(last) && !utils.isArray(last)) {
	        options = args.pop();
	    }
	
	    var bytes = encodeConstructorParams(this.abi, args);
	    options.data += bytes;
	
	    if (callback) {
	
	        // wait for the contract address adn check if the code was deployed
	        this.eth.sendTransaction(options, function (err, hash) {
	            if (err) {
	                callback(err);
	            } else {
	                // add the transaction hash
	                contract.transactionHash = hash;
	
	                // call callback for the first time
	                callback(null, contract);
	
	                checkForContractAddress(contract, callback);
	            }
	        });
	    } else {
	        var hash = this.eth.sendTransaction(options);
	        // add the transaction hash
	        contract.transactionHash = hash;
	        checkForContractAddress(contract);
	    }
	
	    return contract;
	};
	
	/**
	 * Should be called to get access to existing contract on a blockchain
	 *
	 * @method at
	 * @param {Address} contract address (required)
	 * @param {Function} callback {optional)
	 * @returns {Contract} returns contract if no callback was passed,
	 * otherwise calls callback function (err, contract)
	 */
	ContractFactory.prototype.at = function (address, callback) {
	    var contract = new Contract(this.eth, this.abi, address);
	
	    // this functions are not part of prototype, 
	    // because we dont want to spoil the interface
	    addFunctionsToContract(contract);
	    addEventsToContract(contract);
	    
	    if (callback) {
	        callback(null, contract);
	    } 
	    return contract;
	};
	
	/**
	 * Gets the data, which is data to deploy plus constructor params
	 *
	 * @method getData
	 */
	ContractFactory.prototype.getData = function () {
	    var options = {}; // required!
	    var args = Array.prototype.slice.call(arguments);
	
	    var last = args[args.length - 1];
	    if (utils.isObject(last) && !utils.isArray(last)) {
	        options = args.pop();
	    }
	
	    var bytes = encodeConstructorParams(this.abi, args);
	    options.data += bytes;
	
	    return options.data;
	};
	
	/**
	 * Should be called to create new contract instance
	 *
	 * @method Contract
	 * @param {Array} abi
	 * @param {Address} contract address
	 */
	var Contract = function (eth, abi, address) {
	    this._eth = eth;
	    this.transactionHash = null;
	    this.address = address;
	    this.abi = abi;
	};
	
	module.exports = ContractFactory;
	


/***/ },
/* 365 */
/***/ function(module, exports, __webpack_require__) {

	var formatters = __webpack_require__(22);
	var utils = __webpack_require__(8);
	var Method = __webpack_require__(42);
	var Property = __webpack_require__(64);
	
	// TODO: refactor, so the input params are not altered.
	// it's necessary to make same 'extension' work with multiple providers
	var extend = function (web3) {
	    /* jshint maxcomplexity:5 */
	    var ex = function (extension) {
	
	        var extendedObject;
	        if (extension.property) {
	            if (!web3[extension.property]) {
	                web3[extension.property] = {};
	            }
	            extendedObject = web3[extension.property];
	        } else {
	            extendedObject = web3;
	        }
	
	        if (extension.methods) {
	            extension.methods.forEach(function (method) {
	                method.attachToObject(extendedObject);
	                method.setRequestManager(web3._requestManager);
	            });
	        }
	
	        if (extension.properties) {
	            extension.properties.forEach(function (property) {
	                property.attachToObject(extendedObject);
	                property.setRequestManager(web3._requestManager);
	            });
	        }
	    };
	
	    ex.formatters = formatters; 
	    ex.utils = utils;
	    ex.Method = Method;
	    ex.Property = Property;
	
	    return ex;
	};
	
	
	
	module.exports = extend;
	


/***/ },
/* 366 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/**
	 * @file function.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var coder = __webpack_require__(94);
	var utils = __webpack_require__(8);
	var formatters = __webpack_require__(22);
	var sha3 = __webpack_require__(60);
	
	/**
	 * This prototype should be used to call/sendTransaction to solidity functions
	 */
	var SolidityFunction = function (eth, json, address) {
	    this._eth = eth;
	    this._inputTypes = json.inputs.map(function (i) {
	        return i.type;
	    });
	    this._outputTypes = json.outputs.map(function (i) {
	        return i.type;
	    });
	    this._constant = json.constant;
	    this._name = utils.transformToFullName(json);
	    this._address = address;
	};
	
	SolidityFunction.prototype.extractCallback = function (args) {
	    if (utils.isFunction(args[args.length - 1])) {
	        return args.pop(); // modify the args array!
	    }
	};
	
	SolidityFunction.prototype.extractDefaultBlock = function (args) {
	    if (args.length > this._inputTypes.length && !utils.isObject(args[args.length -1])) {
	        return formatters.inputDefaultBlockNumberFormatter(args.pop()); // modify the args array!
	    }
	};
	
	/**
	 * Should be used to create payload from arguments
	 *
	 * @method toPayload
	 * @param {Array} solidity function params
	 * @param {Object} optional payload options
	 */
	SolidityFunction.prototype.toPayload = function (args) {
	    var options = {};
	    if (args.length > this._inputTypes.length && utils.isObject(args[args.length -1])) {
	        options = args[args.length - 1];
	    }
	    options.to = this._address;
	    options.data = '0x' + this.signature() + coder.encodeParams(this._inputTypes, args);
	    return options;
	};
	
	/**
	 * Should be used to get function signature
	 *
	 * @method signature
	 * @return {String} function signature
	 */
	SolidityFunction.prototype.signature = function () {
	    return sha3(this._name).slice(0, 8);
	};
	
	
	SolidityFunction.prototype.unpackOutput = function (output) {
	    if (!output) {
	        return;
	    }
	
	    output = output.length >= 2 ? output.slice(2) : output;
	    var result = coder.decodeParams(this._outputTypes, output);
	    return result.length === 1 ? result[0] : result;
	};
	
	/**
	 * Calls a contract function.
	 *
	 * @method call
	 * @param {...Object} Contract function arguments
	 * @param {function} If the last argument is a function, the contract function
	 *   call will be asynchronous, and the callback will be passed the
	 *   error and result.
	 * @return {String} output bytes
	 */
	SolidityFunction.prototype.call = function () {
	    var args = Array.prototype.slice.call(arguments).filter(function (a) {return a !== undefined; });
	    var callback = this.extractCallback(args);
	    var defaultBlock = this.extractDefaultBlock(args);
	    var payload = this.toPayload(args);
	
	
	    if (!callback) {
	        var output = this._eth.call(payload, defaultBlock);
	        return this.unpackOutput(output);
	    } 
	        
	    var self = this;
	    this._eth.call(payload, defaultBlock, function (error, output) {
	        callback(error, self.unpackOutput(output));
	    });
	};
	
	/**
	 * Should be used to sendTransaction to solidity function
	 *
	 * @method sendTransaction
	 */
	SolidityFunction.prototype.sendTransaction = function () {
	    var args = Array.prototype.slice.call(arguments).filter(function (a) {return a !== undefined; });
	    var callback = this.extractCallback(args);
	    var payload = this.toPayload(args);
	
	    if (!callback) {
	        return this._eth.sendTransaction(payload);
	    }
	
	    this._eth.sendTransaction(payload, callback);
	};
	
	/**
	 * Should be used to estimateGas of solidity function
	 *
	 * @method estimateGas
	 */
	SolidityFunction.prototype.estimateGas = function () {
	    var args = Array.prototype.slice.call(arguments);
	    var callback = this.extractCallback(args);
	    var payload = this.toPayload(args);
	
	    if (!callback) {
	        return this._eth.estimateGas(payload);
	    }
	
	    this._eth.estimateGas(payload, callback);
	};
	
	/**
	 * Return the encoded data of the call
	 *
	 * @method getData
	 * @return {String} the encoded data
	 */
	SolidityFunction.prototype.getData = function () {
	    var args = Array.prototype.slice.call(arguments);
	    var payload = this.toPayload(args);
	
	    return payload.data;
	};
	
	/**
	 * Should be used to get function display name
	 *
	 * @method displayName
	 * @return {String} display name of the function
	 */
	SolidityFunction.prototype.displayName = function () {
	    return utils.extractDisplayName(this._name);
	};
	
	/**
	 * Should be used to get function type name
	 *
	 * @method typeName
	 * @return {String} type name of the function
	 */
	SolidityFunction.prototype.typeName = function () {
	    return utils.extractTypeName(this._name);
	};
	
	/**
	 * Should be called to get rpc requests from solidity function
	 *
	 * @method request
	 * @returns {Object}
	 */
	SolidityFunction.prototype.request = function () {
	    var args = Array.prototype.slice.call(arguments);
	    var callback = this.extractCallback(args);
	    var payload = this.toPayload(args);
	    var format = this.unpackOutput.bind(this);
	    
	    return {
	        method: this._constant ? 'eth_call' : 'eth_sendTransaction',
	        callback: callback,
	        params: [payload], 
	        format: format
	    };
	};
	
	/**
	 * Should be called to execute function
	 *
	 * @method execute
	 */
	SolidityFunction.prototype.execute = function () {
	    var transaction = !this._constant;
	
	    // send transaction
	    if (transaction) {
	        return this.sendTransaction.apply(this, Array.prototype.slice.call(arguments));
	    }
	
	    // call
	    return this.call.apply(this, Array.prototype.slice.call(arguments));
	};
	
	/**
	 * Should be called to attach function to contract
	 *
	 * @method attachToContract
	 * @param {Contract}
	 */
	SolidityFunction.prototype.attachToContract = function (contract) {
	    var execute = this.execute.bind(this);
	    execute.request = this.request.bind(this);
	    execute.call = this.call.bind(this);
	    execute.sendTransaction = this.sendTransaction.bind(this);
	    execute.estimateGas = this.estimateGas.bind(this);
	    execute.getData = this.getData.bind(this);
	    var displayName = this.displayName();
	    if (!contract[displayName]) {
	        contract[displayName] = execute;
	    }
	    contract[displayName][this.typeName()] = execute; // circular!!!!
	};
	
	module.exports = SolidityFunction;
	


/***/ },
/* 367 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file httpprovider.js
	 * @authors:
	 *   Marek Kotewicz <marek@ethdev.com>
	 *   Marian Oancea <marian@ethdev.com>
	 *   Fabian Vogelsteller <fabian@ethdev.com>
	 * @date 2015
	 */
	
	"use strict";
	
	var errors = __webpack_require__(41);
	
	// workaround to use httpprovider in different envs
	var XMLHttpRequest; // jshint ignore: line
	
	// meteor server environment
	if (typeof Meteor !== 'undefined' && Meteor.isServer) { // jshint ignore: line
	    XMLHttpRequest = Npm.require('xmlhttprequest').XMLHttpRequest; // jshint ignore: line
	
	// browser
	} else if (typeof window !== 'undefined' && window.XMLHttpRequest) {
	    XMLHttpRequest = window.XMLHttpRequest; // jshint ignore: line
	
	// node
	} else {
	    XMLHttpRequest = __webpack_require__(360).XMLHttpRequest; // jshint ignore: line
	}
	
	/**
	 * HttpProvider should be used to send rpc calls over http
	 */
	var HttpProvider = function (host) {
	    this.host = host || 'http://localhost:8545';
	};
	
	/**
	 * Should be called to prepare new XMLHttpRequest
	 *
	 * @method prepareRequest
	 * @param {Boolean} true if request should be async
	 * @return {XMLHttpRequest} object
	 */
	HttpProvider.prototype.prepareRequest = function (async) {
	    var request = new XMLHttpRequest();
	    request.open('POST', this.host, async);
	    request.setRequestHeader('Content-Type','application/json');
	    return request;
	};
	
	/**
	 * Should be called to make sync request
	 *
	 * @method send
	 * @param {Object} payload
	 * @return {Object} result
	 */
	HttpProvider.prototype.send = function (payload) {
	    var request = this.prepareRequest(false);
	
	    try {
	        request.send(JSON.stringify(payload));
	    } catch(error) {
	        throw errors.InvalidConnection(this.host);
	    }
	
	    var result = request.responseText;
	
	    try {
	        result = JSON.parse(result);
	    } catch(e) {
	        throw errors.InvalidResponse(request.responseText);                
	    }
	
	    return result;
	};
	
	/**
	 * Should be used to make async request
	 *
	 * @method sendAsync
	 * @param {Object} payload
	 * @param {Function} callback triggered on end with (err, result)
	 */
	HttpProvider.prototype.sendAsync = function (payload, callback) {
	    var request = this.prepareRequest(true); 
	
	    request.onreadystatechange = function() {
	        if (request.readyState === 4) {
	            var result = request.responseText;
	            var error = null;
	
	            try {
	                result = JSON.parse(result);
	            } catch(e) {
	                error = errors.InvalidResponse(request.responseText);                
	            }
	
	            callback(error, result);
	        }
	    };
	    
	    try {
	        request.send(JSON.stringify(payload));
	    } catch(error) {
	        callback(errors.InvalidConnection(this.host));
	    }
	};
	
	/**
	 * Synchronously tries to make Http request
	 *
	 * @method isConnected
	 * @return {Boolean} returns true if request haven't failed. Otherwise false
	 */
	HttpProvider.prototype.isConnected = function() {
	    try {
	        this.send({
	            id: 9999999999,
	            jsonrpc: '2.0',
	            method: 'net_listening',
	            params: []
	        });
	        return true;
	    } catch(e) {
	        return false;
	    }
	};
	
	module.exports = HttpProvider;
	


/***/ },
/* 368 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file ipcprovider.js
	 * @authors:
	 *   Fabian Vogelsteller <fabian@ethdev.com>
	 * @date 2015
	 */
	
	"use strict";
	
	var utils = __webpack_require__(8);
	var errors = __webpack_require__(41);
	
	
	var IpcProvider = function (path, net) {
	    var _this = this;
	    this.responseCallbacks = {};
	    this.path = path;
	    
	    this.connection = net.connect({path: this.path});
	
	    this.connection.on('error', function(e){
	        console.error('IPC Connection Error', e);
	        _this._timeout();
	    });
	
	    this.connection.on('end', function(){
	        _this._timeout();
	    }); 
	
	
	    // LISTEN FOR CONNECTION RESPONSES
	    this.connection.on('data', function(data) {
	        /*jshint maxcomplexity: 6 */
	
	        _this._parseResponse(data.toString()).forEach(function(result){
	
	            var id = null;
	
	            // get the id which matches the returned id
	            if(utils.isArray(result)) {
	                result.forEach(function(load){
	                    if(_this.responseCallbacks[load.id])
	                        id = load.id;
	                });
	            } else {
	                id = result.id;
	            }
	
	            // fire the callback
	            if(_this.responseCallbacks[id]) {
	                _this.responseCallbacks[id](null, result);
	                delete _this.responseCallbacks[id];
	            }
	        });
	    });
	};
	
	/**
	Will parse the response and make an array out of it.
	
	@method _parseResponse
	@param {String} data
	*/
	IpcProvider.prototype._parseResponse = function(data) {
	    var _this = this,
	        returnValues = [];
	    
	    // DE-CHUNKER
	    var dechunkedData = data
	        .replace(/\}\{/g,'}|--|{') // }{
	        .replace(/\}\]\[\{/g,'}]|--|[{') // }][{
	        .replace(/\}\[\{/g,'}|--|[{') // }[{
	        .replace(/\}\]\{/g,'}]|--|{') // }]{
	        .split('|--|');
	
	    dechunkedData.forEach(function(data){
	
	        // prepend the last chunk
	        if(_this.lastChunk)
	            data = _this.lastChunk + data;
	
	        var result = null;
	
	        try {
	            result = JSON.parse(data);
	
	        } catch(e) {
	
	            _this.lastChunk = data;
	
	            // start timeout to cancel all requests
	            clearTimeout(_this.lastChunkTimeout);
	            _this.lastChunkTimeout = setTimeout(function(){
	                _this.timeout();
	                throw errors.InvalidResponse(data);
	            }, 1000 * 15);
	
	            return;
	        }
	
	        // cancel timeout and set chunk to null
	        clearTimeout(_this.lastChunkTimeout);
	        _this.lastChunk = null;
	
	        if(result)
	            returnValues.push(result);
	    });
	
	    return returnValues;
	};
	
	
	/**
	Get the adds a callback to the responseCallbacks object,
	which will be called if a response matching the response Id will arrive.
	
	@method _addResponseCallback
	*/
	IpcProvider.prototype._addResponseCallback = function(payload, callback) {
	    var id = payload.id || payload[0].id;
	    var method = payload.method || payload[0].method;
	
	    this.responseCallbacks[id] = callback;
	    this.responseCallbacks[id].method = method;
	};
	
	/**
	Timeout all requests when the end/error event is fired
	
	@method _timeout
	*/
	IpcProvider.prototype._timeout = function() {
	    for(var key in this.responseCallbacks) {
	        if(this.responseCallbacks.hasOwnProperty(key)){
	            this.responseCallbacks[key](errors.InvalidConnection('on IPC'));
	            delete this.responseCallbacks[key];
	        }
	    }
	};
	
	
	/**
	Check if the current connection is still valid.
	
	@method isConnected
	*/
	IpcProvider.prototype.isConnected = function() {
	    var _this = this;
	
	    // try reconnect, when connection is gone
	    if(!_this.connection.writable)
	        _this.connection.connect({path: _this.path});
	
	    return !!this.connection.writable;
	};
	
	IpcProvider.prototype.send = function (payload) {
	
	    if(this.connection.writeSync) {
	        var result;
	
	        // try reconnect, when connection is gone
	        if(!this.connection.writable)
	            this.connection.connect({path: this.path});
	
	        var data = this.connection.writeSync(JSON.stringify(payload));
	
	        try {
	            result = JSON.parse(data);
	        } catch(e) {
	            throw errors.InvalidResponse(data);                
	        }
	
	        return result;
	
	    } else {
	        throw new Error('You tried to send "'+ payload.method +'" synchronously. Synchronous requests are not supported by the IPC provider.');
	    }
	};
	
	IpcProvider.prototype.sendAsync = function (payload, callback) {
	    // try reconnect, when connection is gone
	    if(!this.connection.writable)
	        this.connection.connect({path: this.path});
	
	
	    this.connection.write(JSON.stringify(payload));
	    this._addResponseCallback(payload, callback);
	};
	
	module.exports = IpcProvider;
	


/***/ },
/* 369 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file db.js
	 * @authors:
	 *   Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var Method = __webpack_require__(42);
	
	var DB = function (web3) {
	    this._requestManager = web3._requestManager;
	
	    var self = this;
	    
	    methods().forEach(function(method) { 
	        method.attachToObject(self);
	        method.setRequestManager(web3._requestManager);
	    });
	};
	
	var methods = function () {
	    var putString = new Method({
	        name: 'putString',
	        call: 'db_putString',
	        params: 3
	    });
	
	    var getString = new Method({
	        name: 'getString',
	        call: 'db_getString',
	        params: 2
	    });
	
	    var putHex = new Method({
	        name: 'putHex',
	        call: 'db_putHex',
	        params: 3
	    });
	
	    var getHex = new Method({
	        name: 'getHex',
	        call: 'db_getHex',
	        params: 2
	    });
	
	    return [
	        putString, getString, putHex, getHex
	    ];
	};
	
	module.exports = DB;


/***/ },
/* 370 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/**
	 * @file eth.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @author Fabian Vogelsteller <fabian@ethdev.com>
	 * @date 2015
	 */
	
	"use strict";
	
	var formatters = __webpack_require__(22);
	var utils = __webpack_require__(8);
	var Method = __webpack_require__(42);
	var Property = __webpack_require__(64);
	var c = __webpack_require__(59);
	var Contract = __webpack_require__(364);
	var watches = __webpack_require__(63);
	var Filter = __webpack_require__(61);
	var IsSyncing = __webpack_require__(376);
	var namereg = __webpack_require__(373);
	var Iban = __webpack_require__(62);
	var transfer = __webpack_require__(377);
	
	var blockCall = function (args) {
	    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "eth_getBlockByHash" : "eth_getBlockByNumber";
	};
	
	var transactionFromBlockCall = function (args) {
	    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex';
	};
	
	var uncleCall = function (args) {
	    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex';
	};
	
	var getBlockTransactionCountCall = function (args) {
	    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getBlockTransactionCountByHash' : 'eth_getBlockTransactionCountByNumber';
	};
	
	var uncleCountCall = function (args) {
	    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber';
	};
	
	function Eth(web3) {
	    this._requestManager = web3._requestManager;
	
	    var self = this;
	
	    methods().forEach(function(method) { 
	        method.attachToObject(self);
	        method.setRequestManager(self._requestManager);
	    });
	
	    properties().forEach(function(p) { 
	        p.attachToObject(self);
	        p.setRequestManager(self._requestManager);
	    });
	
	
	    this.iban = Iban;
	    this.sendIBANTransaction = transfer.bind(null, this);
	}
	
	Object.defineProperty(Eth.prototype, 'defaultBlock', {
	    get: function () {
	        return c.defaultBlock;
	    },
	    set: function (val) {
	        c.defaultBlock = val;
	        return val;
	    }
	});
	
	Object.defineProperty(Eth.prototype, 'defaultAccount', {
	    get: function () {
	        return c.defaultAccount;
	    },
	    set: function (val) {
	        c.defaultAccount = val;
	        return val;
	    }
	});
	
	var methods = function () {
	    var getBalance = new Method({
	        name: 'getBalance',
	        call: 'eth_getBalance',
	        params: 2,
	        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter],
	        outputFormatter: formatters.outputBigNumberFormatter
	    });
	
	    var getStorageAt = new Method({
	        name: 'getStorageAt',
	        call: 'eth_getStorageAt',
	        params: 3,
	        inputFormatter: [null, utils.toHex, formatters.inputDefaultBlockNumberFormatter]
	    });
	
	    var getCode = new Method({
	        name: 'getCode',
	        call: 'eth_getCode',
	        params: 2,
	        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter]
	    });
	
	    var getBlock = new Method({
	        name: 'getBlock',
	        call: blockCall,
	        params: 2,
	        inputFormatter: [formatters.inputBlockNumberFormatter, function (val) { return !!val; }],
	        outputFormatter: formatters.outputBlockFormatter
	    });
	
	    var getUncle = new Method({
	        name: 'getUncle',
	        call: uncleCall,
	        params: 2,
	        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
	        outputFormatter: formatters.outputBlockFormatter,
	
	    });
	
	    var getCompilers = new Method({
	        name: 'getCompilers',
	        call: 'eth_getCompilers',
	        params: 0
	    });
	
	    var getBlockTransactionCount = new Method({
	        name: 'getBlockTransactionCount',
	        call: getBlockTransactionCountCall,
	        params: 1,
	        inputFormatter: [formatters.inputBlockNumberFormatter],
	        outputFormatter: utils.toDecimal
	    });
	
	    var getBlockUncleCount = new Method({
	        name: 'getBlockUncleCount',
	        call: uncleCountCall,
	        params: 1,
	        inputFormatter: [formatters.inputBlockNumberFormatter],
	        outputFormatter: utils.toDecimal
	    });
	
	    var getTransaction = new Method({
	        name: 'getTransaction',
	        call: 'eth_getTransactionByHash',
	        params: 1,
	        outputFormatter: formatters.outputTransactionFormatter
	    });
	
	    var getTransactionFromBlock = new Method({
	        name: 'getTransactionFromBlock',
	        call: transactionFromBlockCall,
	        params: 2,
	        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
	        outputFormatter: formatters.outputTransactionFormatter
	    });
	
	    var getTransactionReceipt = new Method({
	        name: 'getTransactionReceipt',
	        call: 'eth_getTransactionReceipt',
	        params: 1,
	        outputFormatter: formatters.outputTransactionReceiptFormatter
	    });
	
	    var getTransactionCount = new Method({
	        name: 'getTransactionCount',
	        call: 'eth_getTransactionCount',
	        params: 2,
	        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
	        outputFormatter: utils.toDecimal
	    });
	
	    var sendRawTransaction = new Method({
	        name: 'sendRawTransaction',
	        call: 'eth_sendRawTransaction',
	        params: 1,
	        inputFormatter: [null]
	    });
	
	    var sendTransaction = new Method({
	        name: 'sendTransaction',
	        call: 'eth_sendTransaction',
	        params: 1,
	        inputFormatter: [formatters.inputTransactionFormatter]
	    });
	
	    var call = new Method({
	        name: 'call',
	        call: 'eth_call',
	        params: 2,
	        inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter]
	    });
	
	    var estimateGas = new Method({
	        name: 'estimateGas',
	        call: 'eth_estimateGas',
	        params: 1,
	        inputFormatter: [formatters.inputCallFormatter],
	        outputFormatter: utils.toDecimal
	    });
	
	    var compileSolidity = new Method({
	        name: 'compile.solidity',
	        call: 'eth_compileSolidity',
	        params: 1
	    });
	
	    var compileLLL = new Method({
	        name: 'compile.lll',
	        call: 'eth_compileLLL',
	        params: 1
	    });
	
	    var compileSerpent = new Method({
	        name: 'compile.serpent',
	        call: 'eth_compileSerpent',
	        params: 1
	    });
	
	    var submitWork = new Method({
	        name: 'submitWork',
	        call: 'eth_submitWork',
	        params: 3
	    });
	
	    var getWork = new Method({
	        name: 'getWork',
	        call: 'eth_getWork',
	        params: 0
	    });
	
	    return [
	        getBalance,
	        getStorageAt,
	        getCode,
	        getBlock,
	        getUncle,
	        getCompilers,
	        getBlockTransactionCount,
	        getBlockUncleCount,
	        getTransaction,
	        getTransactionFromBlock,
	        getTransactionReceipt,
	        getTransactionCount,
	        call,
	        estimateGas,
	        sendRawTransaction,
	        sendTransaction,
	        compileSolidity,
	        compileLLL,
	        compileSerpent,
	        submitWork,
	        getWork
	    ];
	};
	
	
	var properties = function () {
	    return [
	        new Property({
	            name: 'coinbase',
	            getter: 'eth_coinbase'
	        }),
	        new Property({
	            name: 'mining',
	            getter: 'eth_mining'
	        }),
	        new Property({
	            name: 'hashrate',
	            getter: 'eth_hashrate',
	            outputFormatter: utils.toDecimal
	        }),
	        new Property({
	            name: 'syncing',
	            getter: 'eth_syncing',
	            outputFormatter: formatters.outputSyncingFormatter
	        }),
	        new Property({
	            name: 'gasPrice',
	            getter: 'eth_gasPrice',
	            outputFormatter: formatters.outputBigNumberFormatter
	        }),
	        new Property({
	            name: 'accounts',
	            getter: 'eth_accounts'
	        }),
	        new Property({
	            name: 'blockNumber',
	            getter: 'eth_blockNumber',
	            outputFormatter: utils.toDecimal
	        })
	    ];
	};
	
	Eth.prototype.contract = function (abi) {
	    var factory = new Contract(this, abi);
	    return factory;
	};
	
	Eth.prototype.filter = function (fil, callback) {
	    return new Filter(this._requestManager, fil, watches.eth(), formatters.outputLogFormatter, callback);
	};
	
	Eth.prototype.namereg = function () {
	    return this.contract(namereg.global.abi).at(namereg.global.address);
	};
	
	Eth.prototype.icapNamereg = function () {
	    return this.contract(namereg.icap.abi).at(namereg.icap.address);
	};
	
	Eth.prototype.isSyncing = function (callback) {
	    return new IsSyncing(this._requestManager, callback);
	};
	
	module.exports = Eth;
	


/***/ },
/* 371 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file eth.js
	 * @authors:
	 *   Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var utils = __webpack_require__(8);
	var Property = __webpack_require__(64);
	
	var Net = function (web3) {
	    this._requestManager = web3._requestManager;
	
	    var self = this;
	
	    properties().forEach(function(p) { 
	        p.attachToObject(self);
	        p.setRequestManager(web3._requestManager);
	    });
	};
	
	/// @returns an array of objects describing web3.eth api properties
	var properties = function () {
	    return [
	        new Property({
	            name: 'listening',
	            getter: 'net_listening'
	        }),
	        new Property({
	            name: 'peerCount',
	            getter: 'net_peerCount',
	            outputFormatter: utils.toDecimal
	        })
	    ];
	};
	
	module.exports = Net;


/***/ },
/* 372 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file shh.js
	 * @authors:
	 *   Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var Method = __webpack_require__(42);
	var formatters = __webpack_require__(22);
	var Filter = __webpack_require__(61);
	var watches = __webpack_require__(63);
	
	var Shh = function (web3) {
	    this._requestManager = web3._requestManager;
	
	    var self = this;
	
	    methods().forEach(function(method) { 
	        method.attachToObject(self);
	        method.setRequestManager(self._requestManager);
	    });
	};
	
	Shh.prototype.filter = function (fil, callback) {
	    return new Filter(this._requestManager, fil, watches.shh(), formatters.outputPostFormatter, callback);
	};
	
	var methods = function () { 
	
	    var post = new Method({
	        name: 'post', 
	        call: 'shh_post', 
	        params: 1,
	        inputFormatter: [formatters.inputPostFormatter]
	    });
	
	    var newIdentity = new Method({
	        name: 'newIdentity',
	        call: 'shh_newIdentity',
	        params: 0
	    });
	
	    var hasIdentity = new Method({
	        name: 'hasIdentity',
	        call: 'shh_hasIdentity',
	        params: 1
	    });
	
	    var newGroup = new Method({
	        name: 'newGroup',
	        call: 'shh_newGroup',
	        params: 0
	    });
	
	    var addToGroup = new Method({
	        name: 'addToGroup',
	        call: 'shh_addToGroup',
	        params: 0
	    });
	
	    return [
	        post,
	        newIdentity,
	        hasIdentity,
	        newGroup,
	        addToGroup
	    ];
	};
	
	module.exports = Shh;
	


/***/ },
/* 373 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file namereg.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var globalRegistrarAbi = __webpack_require__(236);
	var icapRegistrarAbi= __webpack_require__(237);
	
	var globalNameregAddress = '0xc6d9d2cd449a754c494264e1809c50e34d64562b';
	var icapNameregAddress = '0xa1a111bc074c9cfa781f0c38e63bd51c91b8af00';
	
	module.exports = {
	    global: {
	        abi: globalRegistrarAbi,
	        address: globalNameregAddress
	    },
	    icap: {
	        abi: icapRegistrarAbi,
	        address: icapNameregAddress
	    }
	};
	


/***/ },
/* 374 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file requestmanager.js
	 * @author Jeffrey Wilcke <jeff@ethdev.com>
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @author Marian Oancea <marian@ethdev.com>
	 * @author Fabian Vogelsteller <fabian@ethdev.com>
	 * @author Gav Wood <g@ethdev.com>
	 * @date 2014
	 */
	
	var Jsonrpc = __webpack_require__(160);
	var utils = __webpack_require__(8);
	var c = __webpack_require__(59);
	var errors = __webpack_require__(41);
	
	/**
	 * It's responsible for passing messages to providers
	 * It's also responsible for polling the ethereum node for incoming messages
	 * Default poll timeout is 1 second
	 * Singleton
	 */
	var RequestManager = function (provider) {
	    this.provider = provider;
	    this.polls = {};
	    this.timeout = null;
	};
	
	/**
	 * Should be used to synchronously send request
	 *
	 * @method send
	 * @param {Object} data
	 * @return {Object}
	 */
	RequestManager.prototype.send = function (data) {
	    if (!this.provider) {
	        console.error(errors.InvalidProvider());
	        return null;
	    }
	
	    var payload = Jsonrpc.getInstance().toPayload(data.method, data.params);
	    var result = this.provider.send(payload);
	
	    if (!Jsonrpc.getInstance().isValidResponse(result)) {
	        throw errors.InvalidResponse(result);
	    }
	
	    return result.result;
	};
	
	/**
	 * Should be used to asynchronously send request
	 *
	 * @method sendAsync
	 * @param {Object} data
	 * @param {Function} callback
	 */
	RequestManager.prototype.sendAsync = function (data, callback) {
	    if (!this.provider) {
	        return callback(errors.InvalidProvider());
	    }
	
	    var payload = Jsonrpc.getInstance().toPayload(data.method, data.params);
	    this.provider.sendAsync(payload, function (err, result) {
	        if (err) {
	            return callback(err);
	        }
	        
	        if (!Jsonrpc.getInstance().isValidResponse(result)) {
	            return callback(errors.InvalidResponse(result));
	        }
	
	        callback(null, result.result);
	    });
	};
	
	/**
	 * Should be called to asynchronously send batch request
	 *
	 * @method sendBatch
	 * @param {Array} batch data
	 * @param {Function} callback
	 */
	RequestManager.prototype.sendBatch = function (data, callback) {
	    if (!this.provider) {
	        return callback(errors.InvalidProvider());
	    }
	
	    var payload = Jsonrpc.getInstance().toBatchPayload(data);
	
	    this.provider.sendAsync(payload, function (err, results) {
	        if (err) {
	            return callback(err);
	        }
	
	        if (!utils.isArray(results)) {
	            return callback(errors.InvalidResponse(results));
	        }
	
	        callback(err, results);
	    }); 
	};
	
	/**
	 * Should be used to set provider of request manager
	 *
	 * @method setProvider
	 * @param {Object}
	 */
	RequestManager.prototype.setProvider = function (p) {
	    this.provider = p;
	};
	
	/**
	 * Should be used to start polling
	 *
	 * @method startPolling
	 * @param {Object} data
	 * @param {Number} pollId
	 * @param {Function} callback
	 * @param {Function} uninstall
	 *
	 * @todo cleanup number of params
	 */
	RequestManager.prototype.startPolling = function (data, pollId, callback, uninstall) {
	    this.polls[pollId] = {data: data, id: pollId, callback: callback, uninstall: uninstall};
	
	
	    // start polling
	    if (!this.timeout) {
	        this.poll();
	    }
	};
	
	/**
	 * Should be used to stop polling for filter with given id
	 *
	 * @method stopPolling
	 * @param {Number} pollId
	 */
	RequestManager.prototype.stopPolling = function (pollId) {
	    delete this.polls[pollId];
	
	    // stop polling
	    if(Object.keys(this.polls).length === 0 && this.timeout) {
	        clearTimeout(this.timeout);
	        this.timeout = null;
	    }
	};
	
	/**
	 * Should be called to reset the polling mechanism of the request manager
	 *
	 * @method reset
	 */
	RequestManager.prototype.reset = function (keepIsSyncing) {
	    /*jshint maxcomplexity:5 */
	
	    for (var key in this.polls) {
	        // remove all polls, except sync polls,
	        // they need to be removed manually by calling syncing.stopWatching()
	        if(!keepIsSyncing || key.indexOf('syncPoll_') === -1) {
	            this.polls[key].uninstall();
	            delete this.polls[key];
	        }
	    }
	
	    // stop polling
	    if(Object.keys(this.polls).length === 0 && this.timeout) {
	        clearTimeout(this.timeout);
	        this.timeout = null;
	    }
	};
	
	/**
	 * Should be called to poll for changes on filter with given id
	 *
	 * @method poll
	 */
	RequestManager.prototype.poll = function () {
	    /*jshint maxcomplexity: 6 */
	    this.timeout = setTimeout(this.poll.bind(this), c.ETH_POLLING_TIMEOUT);
	
	    if (Object.keys(this.polls).length === 0) {
	        return;
	    }
	
	    if (!this.provider) {
	        console.error(errors.InvalidProvider());
	        return;
	    }
	
	    var pollsData = [];
	    var pollsIds = [];
	    for (var key in this.polls) {
	        pollsData.push(this.polls[key].data);
	        pollsIds.push(key);
	    }
	
	    if (pollsData.length === 0) {
	        return;
	    }
	
	    var payload = Jsonrpc.getInstance().toBatchPayload(pollsData);
	    
	    // map the request id to they poll id
	    var pollsIdMap = {};
	    payload.forEach(function(load, index){
	        pollsIdMap[load.id] = pollsIds[index];
	    });
	
	
	    var self = this;
	    this.provider.sendAsync(payload, function (error, results) {
	
	
	        // TODO: console log?
	        if (error) {
	            return;
	        }
	
	        if (!utils.isArray(results)) {
	            throw errors.InvalidResponse(results);
	        }
	        results.map(function (result) {
	            var id = pollsIdMap[result.id];
	
	            // make sure the filter is still installed after arrival of the request
	            if (self.polls[id]) {
	                result.callback = self.polls[id].callback;
	                return result;
	            } else
	                return false;
	        }).filter(function (result) {
	            return !!result; 
	        }).filter(function (result) {
	            var valid = Jsonrpc.getInstance().isValidResponse(result);
	            if (!valid) {
	                result.callback(errors.InvalidResponse(result));
	            }
	            return valid;
	        }).forEach(function (result) {
	            result.callback(null, result.result);
	        });
	    });
	};
	
	module.exports = RequestManager;
	


/***/ },
/* 375 */
/***/ function(module, exports) {

	
	
	var Settings = function () {
	    this.defaultBlock = 'latest';
	    this.defaultAccount = undefined;
	};
	
	module.exports = Settings;
	


/***/ },
/* 376 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** @file syncing.js
	 * @authors:
	 *   Fabian Vogelsteller <fabian@ethdev.com>
	 * @date 2015
	 */
	
	var formatters = __webpack_require__(22);
	var utils = __webpack_require__(8);
	
	var count = 1;
	
	/**
	Adds the callback and sets up the methods, to iterate over the results.
	
	@method pollSyncing
	@param {Object} self
	*/
	var pollSyncing = function(self) {
	
	    var onMessage = function (error, sync) {
	        if (error) {
	            return self.callbacks.forEach(function (callback) {
	                callback(error);
	            });
	        }
	
	        if(utils.isObject(sync) && sync.startingBlock)
	            sync = formatters.outputSyncingFormatter(sync);
	
	        self.callbacks.forEach(function (callback) {
	            if (self.lastSyncState !== sync) {
	                
	                // call the callback with true first so the app can stop anything, before receiving the sync data
	                if(!self.lastSyncState && utils.isObject(sync))
	                    callback(null, true);
	                
	                // call on the next CPU cycle, so the actions of the sync stop can be processes first
	                setTimeout(function() {
	                    callback(null, sync);
	                }, 0);
	                
	                self.lastSyncState = sync;
	            }
	        });
	    };
	
	    self.requestManager.startPolling({
	        method: 'eth_syncing',
	        params: [],
	    }, self.pollId, onMessage, self.stopWatching.bind(self));
	
	};
	
	var IsSyncing = function (requestManager, callback) {
	    this.requestManager = requestManager;
	    this.pollId = 'syncPoll_'+ count++;
	    this.callbacks = [];
	    this.addCallback(callback);
	    this.lastSyncState = false;
	    pollSyncing(this);
	
	    return this;
	};
	
	IsSyncing.prototype.addCallback = function (callback) {
	    if(callback)
	        this.callbacks.push(callback);
	    return this;
	};
	
	IsSyncing.prototype.stopWatching = function () {
	    this.requestManager.stopPolling(this.pollId);
	    this.callbacks = [];
	};
	
	module.exports = IsSyncing;
	


/***/ },
/* 377 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    This file is part of web3.js.
	
	    web3.js is free software: you can redistribute it and/or modify
	    it under the terms of the GNU Lesser General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    web3.js is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU Lesser General Public License for more details.
	
	    You should have received a copy of the GNU Lesser General Public License
	    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
	*/
	/** 
	 * @file transfer.js
	 * @author Marek Kotewicz <marek@ethdev.com>
	 * @date 2015
	 */
	
	var Iban = __webpack_require__(62);
	var exchangeAbi = __webpack_require__(238);
	
	/**
	 * Should be used to make Iban transfer
	 *
	 * @method transfer
	 * @param {String} from
	 * @param {String} to iban
	 * @param {Value} value to be tranfered
	 * @param {Function} callback, callback
	 */
	var transfer = function (eth, from, to, value, callback) {
	    var iban = new Iban(to); 
	    if (!iban.isValid()) {
	        throw new Error('invalid iban address');
	    }
	
	    if (iban.isDirect()) {
	        return transferToAddress(eth, from, iban.address(), value, callback);
	    }
	    
	    if (!callback) {
	        var address = eth.icapNamereg().addr(iban.institution());
	        return deposit(eth, from, address, value, iban.client());
	    }
	
	    eth.icapNamereg().addr(iban.institution(), function (err, address) {
	        return deposit(eth, from, address, value, iban.client(), callback);
	    });
	    
	};
	
	/**
	 * Should be used to transfer funds to certain address
	 *
	 * @method transferToAddress
	 * @param {String} from
	 * @param {String} to
	 * @param {Value} value to be tranfered
	 * @param {Function} callback, callback
	 */
	var transferToAddress = function (eth, from, to, value, callback) {
	    return eth.sendTransaction({
	        address: to,
	        from: from,
	        value: value
	    }, callback);
	};
	
	/**
	 * Should be used to deposit funds to generic Exchange contract (must implement deposit(bytes32) method!)
	 *
	 * @method deposit
	 * @param {String} from
	 * @param {String} to
	 * @param {Value} value to be transfered
	 * @param {String} client unique identifier
	 * @param {Function} callback, callback
	 */
	var deposit = function (eth, from, to, value, client, callback) {
	    var abi = exchangeAbi;
	    return eth.contract(abi).at(to).deposit(client, {
	        from: from,
	        value: value
	    }, callback);
	};
	
	module.exports = transfer;
	


/***/ },
/* 378 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
]);
//# sourceMappingURL=app.10d999f20c0cb33ed68d.js.map