import qiniu from "qiniu";

const accessKey ="JuFVE_Fn9SQ3yEXk0rhDI_RaqbpYhvn4ydQOKivH"
const secretKey ="Q9nwdDXxmWIETPMO-RtGnf_nlbfXXEdYPXrdSF_O"

const bucket = 'freelike';
const domain = 'cdn.freelike.cn';

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var putPolicy = new qiniu.rs.PutPolicy({
    scope:bucket,
    callbackUrl:"http://192.168.31.86:3001/gallery",
    callbackBodyType: 'application/json'
});
var uploadToken=putPolicy.uploadToken(mac);