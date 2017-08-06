function pad(n){return (n<10)?("0"+n):n;}

function Config() {
/* Stores all of the configuration settings in variables.
 * Calling load will populate the values from the config file. */
 
  this.latestNum = 0; // id of the latest article (0 means no articles)
  
  var parent = this;
  this.load = function(_callback){
  /* Populates Config() values from configuration file.
   * Accepts an optional callback to run after populating */

    var page = new XMLHttpRequest();

    page.open("GET", "articles/config.html", true); // Open the config file
    page.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {

        var confText = page.responseText.split(/\r|\n/);
        parent.latestNum = Number(confText[0]);
        
        // if we have a callback function, do it now (after loading all configs)
        if (typeof _callback === 'function') 
          _callback();
      }
    };
    
    page.send();
  };
  
}

function Article(setid=0) {
/* Prototype for an article type
 * Note: it is recommended to use this in a callback of conf when loading most recent */
 
  this.id = setid;
  this.content = "";
  this.title = "";
  this.date = {year:2000,month:1,day:1};
  
  var parent = this;
  this.load = function(_callback) {

    var page = new XMLHttpRequest();
    page.open("GET", "articles/" + this.id + ".html", true);
    page.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {

        var fullText = page.responseText;

        parent.title = fullText.slice(fullText.search("<!TITLE>")+8, fullText.search("<!/TITLE>"));
        
        var dateArray = fullText.slice(fullText.search("<!DATE>")+7, fullText.search("<!/DATE>")).split("/");
        parent.date.year = Number(dateArray[0]);
        parent.date.month = Number(dateArray[1]);
        parent.date.day = Number(dateArray[2]);

        parent.content = fullText.slice(fullText.search("<!CONTENT>")+10, fullText.search("<!/CONTENT>"));
        
        if (typeof _callback === 'function') {
          _callback();
        }
        
      }
    };

    page.send();
  };
  
  this.populate = function(elem_title, elem_date, elem_content) {
  
    if (typeof elem_title == "string"){
      document.getElementById(elem_title).innerHTML = parent.title;
    }
    if (typeof elem_date == "string"){
      document.getElementById(elem_date).innerHTML = parent.date.year + "/" + pad(parent.date.month) + "/" + pad(parent.date.day);
    }
    if (typeof elem_content == "string"){
      document.getElementById(elem_content).innerHTML = parent.content;
    }
  };
}
