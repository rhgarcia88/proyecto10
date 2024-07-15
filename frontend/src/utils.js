export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getBaseUrl = () => {
// return "http://localhost:3000";
return "https://proyecto10.vercel.app";
 
}