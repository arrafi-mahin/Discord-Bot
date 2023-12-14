const general = (data) => {
    console.log(data);
    if(data.includes('tell') && data.includes('you') || data.includes('yourself')){
        return("I'm Lazy a Panda. Im here to talk with you. Right Now My Development under process so i can't give you proper information. apologise for that.")
    }else{
        return "iuyoyi";
    }
}
module.exports = general;