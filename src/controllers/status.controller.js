
const getServerStatus = async (req = request, res = response) => {
  return res.send({status: 'OK'})
};

export { getServerStatus };
