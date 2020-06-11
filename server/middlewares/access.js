// ====================================================================================
// Permite acceso a las apps externas desde cualquier origen y método
// ====================================================================================
let CORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, HEAD');
    next();
};

module.exports = {
    CORS
};