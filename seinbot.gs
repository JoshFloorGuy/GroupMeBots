var botId = "insert Bot iD";
var botname = "seinbot";
//the below is in reference with the google doc
var bottype = "seinbot";
function sendText(text){
  UrlFetchApp.fetch("https://api.groupme.com/v3/bots/post", {"method":"post", "payload":'{"bot_id":"' + botId + '","text":"' + text + '"}'})
}

function sendImage(text, imageURL){
  UrlFetchApp.fetch("https://api.groupme.com/v3/bots/post", {"method":"post", "payload":'{"bot_id":"' + botId + '","text":"' + text + '","attachments":[{"type":"image","url":"' + imageURL + '"}]}'})
}

//respond to messages sent to the group. Recieved as POST 
function doPost(e){
  var post = JSON.parse(e.postData.getDataAsString());
  var text = post.text;
  var name = post.name;
  var user = post.user_id;
  var group = post.group_id;
  var ability = "";
  var bt = 0;
  var gt = 0;
  
  var library = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1oWHs7Qkl3iEiuHdx4dPFzCnzIRPqZ_59yEZzDdcBjss/edit#gid=0");
  
  var toggle = library.getSheets()[0].getDataRange().getValues();
  var botIds = library.getSheets()[1].getDataRange().getValues();
  var names = library.getSheets()[2].getDataRange().getValues();
  var tc = library.getSheets()[0];
  var bc = library.getSheets()[1];
  var nc = library.getSheets()[2];
  
  for (j=1; j < toggle[0].length; j++) {
    if(toggle[0][j] == group) {gt += j}
  }
  
  for (j=1; j < toggle.length; j++) {
    if(toggle[j][0] == bottype) {bt += j}
  }
  if(bt == 0) {
    bc.appendRow([bottype]);
    tc.appendRow([bottype]);
    nc.appendRow([bottype]);
    bt += toggle.length;
  }
  
  if(bt > 0 && gt > 0) {
    ability = toggle[bt][gt];
    botId = botIds[bt][gt];
  }
  
  if(text.toLowerCase().substring(0,9) == "!register") {
    var register = text.split(" ");
    if(gt == 0) {
      gt = toggle[0].length;
      tc.insertColumns(gt+1);
      bc.insertColumns(gt+1);
      nc.insertColumns(gt+1);
      tc.getRange(1,gt+1).setValue(group);
      bc.getRange(1,gt+1).setValue(group);
      nc.getRange(1,gt+1).setValue(group);
    }
    if(register[1] == bottype) {
      bc.getRange(bt+1,gt+1).setValue(register[2]);
      nc.getRange(bt+1,gt+1).setValue(text.substring(text.indexOf(register[3],text.indexOf(register[2]))));
      tc.getRange(bt+1,gt+1).setValue('x');
      botId = register[2];
      sendText(text.substring(text.indexOf(register[3],text.indexOf(register[2]))) + " successfully initialized");
    }
  }
  
  if(text.toLowerCase().substring(0,8) == "!toggle " && text.toLowerCase().substring(8) == bottype) {
    if(toggle[bt][gt] == "x") {tc.getRange(bt+1,gt+1).setValue(' ')} else {tc.getRange(bt+1,gt+1).setValue('x')}
    sendText("Toggled "+bottype);
  }
  
  botname = names[bt][gt];
  
  //check if server is running (diagnostics)
  if (name != botname && ability == "x" && gt != 0) {
    botId = botIds[bt][gt];
    //Here's where the actual code begins
    if(text.substring(0,6).toLowerCase() == "!jery "){
      sendText("What's the deal with " + text.substring(6) + "? I mean, come on!");
    }
    
    if(text.indexOf("changed name to") > -1 && post.user_id == 0) {
      if(text.indexOf(botname, text.indexOf("changed name to")) > -1) {sendText("WARNING: IF YOU HAVE THE SAME NAME AS ME, YOU WILL NOT TRIGGER ME, SO IF YOU DON'T WANT THAT, PLEASE CHANGE YOUR NAME")}
    }
  }
}
