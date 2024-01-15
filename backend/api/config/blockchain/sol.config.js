const { Connection } = require("@solana/web3.js"),
  { SOL_DEVNET_JSONRPC } = require("../env");

const connection = new Connection(SOL_DEVNET_JSONRPC, "confirmed", {
  skipPreflight: true,
});

const provider = {
  connection: connection,
  send: async (data, cb) => {
    const response = await connection.sendEncoded(data);

    if (response.error) return cb(response.error);

    return cb(null, response.result);
  },
};

module.exports = {
  provider,
};
