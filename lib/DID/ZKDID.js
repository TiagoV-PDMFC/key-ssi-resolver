'use strict';
const crypto = require("pskcrypto");
const base58 = require('bar').base58;
const DIDUrl = require('./DIDUrl');

function ZKDID(url, options) {
    if (typeof url === 'object') {
        options = url;
        url = undefined;
    }

    const KEY_LENGTH = 32;
    options = options || {};

    this.alias = options.alias;
    this.dlDomain = options.dlDomain;

    ////////////////////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////////////////////
    const restoreFromUrl = (url) => {
        const didUrl = new DIDUrl(url, {
            validator: {
                prefix: 'did',
                type: 'alias',
                segments: (segments) => {
                    if (segments.length !== 2) {
                        return false;
                    }

                    if (!segments[0].length || !segments[1].length) {
                        return false;
                    }

                    return true;
                }
            }
        });

        this.dlDomain = didUrl.getSegments().shift();
        this.alias = didUrl.getSegments().pop();
    }

    const generateAlias = () => {
        const v1 = Buffer.from(crypto.randomBytes(KEY_LENGTH));
        const v2 = Buffer.from(crypto.randomBytes(KEY_LENGTH));
        const v3 = Buffer.from(crypto.randomBytes(KEY_LENGTH));

        let alias = crypto.pskHash(crypto.pskHash(v1, 'hex'), 'hex');
        alias += ':' + crypto.pskHash(crypto.pskHash(v2, 'hex') + crypto.pskHash(v3, 'hex'), 'hex')
        alias = base58.encode(Buffer.from(alias, 'hex'));
        return alias;
    }

    const initialize = () => {
        if (url) {
            restoreFromUrl(url);
            return;
        }
        if (!this.alias) {
            this.alias = generateAlias();
        }

        if (!this.dlDomain) {
            throw new Error('Missing the DLDomain');
        }
    }

    initialize();
    ////////////////////////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////////////////////////
    this.getAlias = () => {
        return this.alias;
    }

    this.getDLDomain = () => {
        return this.dlDomain;
    }

    this.toUrl = () => {
        const urlParts = {
            type: 'alias',
            segments: [
                this.dlDomain,
                this.alias
            ]
        };

        const didUrl = new DIDUrl(urlParts);
        return didUrl.toString();
    }
}

module.exports = ZKDID;