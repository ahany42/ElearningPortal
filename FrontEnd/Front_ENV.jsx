export const Front_Port = 7000;
export const Back_Port = 3008;
export const Front_Origin = `http://localhost:${Front_Port}`;
// export const Back_Origin = `http://localhost:${Back_Port}`;
export const Back_Origin = `https://e-learning-system-deployed.vercel.app`;
export const Secret_Key= '757f91aa77d116b94e89e8f04d82f611f6628458b2137a365f6fce8c0bdde985'

const Front_ENV = {
    Front_Port,
    Back_Port,
    Front_Origin,
    Back_Origin,
    Secret_Key
}

export default Front_ENV;