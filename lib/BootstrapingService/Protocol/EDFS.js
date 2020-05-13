'use strict';

// TODO: create a standalone protocol
require('edfs');
const EDFSBrickStorage = require('edfs-brick-storage');

function EDFS(options) {
    options = options || {};

    this.endpoint = options.endpoint;

    if (!this.endpoint) {
        throw new Error('EDFS endpoint is required');
    }

    this.edfsDriver = EDFSBrickStorage.create(this.endpoint);

    this.getBrick = (dlDomain, hash, callback) => {
        this.edfsDriver.getBrick(hash, callback);
    }

    this.putBrick = (dlDomain, brick, callback) => {
        this.edfsDriver.putBrick(brick, callback);
    }

    this.updateAlias = (alias, value, callback) => {
        this.edfsDriver.attachHashToAlias(alias, value, callback);
    }

    this.getAliasVersions = (alias, callback) => {
        this.edfsDriver.getHashForAlias(alias, callback);
    }
}

module.exports = EDFS;