var botId = "insert Bot ID";
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
  
  var list = SpreadsheetApp.openByUrl("spreadsheet app");
  var edit = list.getActiveSheet().getDataRange().getValues();
  
  //check if server is running (diagnostics)
  if(text.toLowerCase() == "!next"){
    sendText("The next INTERACT meeting is on " + edit[0][0] + "/"+ edit[0][1] + ". Make sure to be there!");
  }
}

function sendTimelyMessage(){
  var list = SpreadsheetApp.openByUrl("spreadsheet link");
  var edit = list.getActiveSheet().getDataRange().getValues();
  var d = new Date();
  var m = d.getMonth() + 1
  if(d.getDay() == 1 && m == edit[0][0] && d.getDate()== edit[0][1] && d.toLocaleTimeString("en-US").indexOf("PM") > -1) {
    if(d.toLocaleTimeString("en-US").substring(0,3) == "2:3") {
      sendText("Hey, there's an INTERACT meeting at 3:20 today! Try to make it!");
    }
    if(d.toLocaleTimeString("en-US").substring(0,3) == "3:1") {
      sendText("The INTERACT meeting starts in 10 minutes, make sure to be there!");
    }
    if(d.toLocaleTimeString("en-US").substring(0,3) == "3:3") {
      sendText("The INTERACT meeting is done for the day, the next meeting will be on "+edit[1][0]+"/"+edit[1][1]+". Plan ahead!");
      list.deleteRow(1);
    }
  }
}