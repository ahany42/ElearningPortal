const Front_Port = 5173;
const Back_Port = 3008;
const Front_Origin = `http://localhost:${Front_Port}`;
const Back_Origin = `http://localhost:${Back_Port}`;
const Secret_Key= '757f91aa77d116b94e89e8f04d82f611f6628458b2137a365f6fce8c0bdde985'
const Database_URI = "mongodb+srv://omaralaa927:CYVe9neEYQErTC79@e-learning-system.k5qg3." +
                            "mongodb.net/e-learning?retryWrites=true&w=majority&appName=e-learning-system";
process.env.BLOB_READ_WRITE_TOKEN="vercel_blob_rw_TTosywRxXNZ2DYnb_qcClOudOfLxBaF7shq2dGP2RJ3hNxT";
module.exports = {
    Front_Port,
    Back_Port,
    Front_Origin,
    Back_Origin,
    Database_URI,
    Secret_Key
}