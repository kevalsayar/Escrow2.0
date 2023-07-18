const { Connection } = require("@solana/web3.js");
const { RPCENDPOINT } = require("../env");

const connection = new Connection(RPCENDPOINT, "confirmed", {
  skipPreflight: true,
});

const provider = {
  connection: connection,
  send: async (data, cb) => {
    const response = await connection.sendEncoded(data);
    if (response.error) {
      return cb(response.error);
    }
    return cb(null, response.result);
  },
};

module.exports = {
  provider,
};
