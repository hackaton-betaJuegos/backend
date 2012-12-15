
// Modules
    var crypto = require('crypto');

// Export
    module.exports = function( word, secret ){
        
        var hmac = null;
        
        if(typeof secret === 'string' || typeof secret === 'number' ){
            hmac = crypto.createHmac( 'sha256', secret );
        }else{
            hmac = crypto.createHash('sha256');
        }
        
        return hmac.update( word ).digest('hex');
        
    };
    