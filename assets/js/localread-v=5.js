// Copyright 2013 Data Design Group, Inc  All Rights Reserved
function ieReadLocalFile(that,callback,encoding) {
        //alert(that.value);
        if(!that.value)return;
        if(that.value.length<=0)return;
        var request;
        if (window.XMLHttpRequest && false) { // code for IE7+, Firefox, Chrome, Opera, Safari
           request=new XMLHttpRequest();
        }   
        else {// code for IE6, IE5
          request=new ActiveXObject("Msxml2.XMLHTTP"); // Microsoft.XMLHTTP
        }
        var fn=that.value;
        //fn="file:///"+that.value.replace("\\","/");
        request.open('get', fn, true);
        request.onreadystatechange = function() 
        {
          //alert(request.readystate+":"+request.status);
          if (request.readyState == 4 && (request.status == 200 || request.status==0)) {
              callback(request.responseText);
          }
        }
        request.send();
}
    
function readLocalFile(that,callback,encoding)
{   
    var reader = new FileReader();

    if(that.files && that.files[0]){
	     var reader = new FileReader();
	     reader.onload = function (e) {  
           //document.getElementById(txtTargetName).value=e.target.result;
           callback(e.target.result);
	     };//end onload()
       reader.readAsText(that.files[0],encoding);
    }//
} // readLocaFile

function readExcelFile(event,callback,fn,f,sheet) {
    //console.log(f.files[0].path)
    //console.log(event.target.files[0])
    var j=0;
    var opts="headers:false";
    if(sheet && sheet!="") {
        opts+=',sheetid:"' + sheet.toJson() + '"';
    }
    if(!fn)fn=document.getElementById('f1').value.split(/[\\\/]/)[document.getElementById('f1').value.split(/[\\\/]/).length-1];
    var ext="XLSX";
    if(fn.split('.').length>1) {
       ext=fn.split('.');
       ext=ext[ext.length-1].toUpperCase(); 
       if(ext==="XLS") ; else ext="XLSX";
    }
    //alert( 'SELECT * FROM ' + ext + '(?,{'+opts+'})');
    alasql('SELECT * FROM ' + ext + '(?,{'+opts+'})',[event.target.files[0].path],
         function(data){ 
             // data needs to be converted to CSV here.
             //data=JSON.parse(JSON.stringify(data,function(key,value){if(value===null||value===undefined)return "";return value;}));
             //alert(JSON.stringify(data,null,2));
             for(j=0;j<data.length;j++) {
                 if(_.isObject(data[j]) && _.isEmpty(data[j]))data.splice(j,1);          
             }
             alasql('SELECT * INTO CSV(null,{"utf8Bom":false}) FROM ?',[data], 
                      function(data){
                          //alert(data)
                          callback(data.replace(/"undefined"/g,''));
                      }
                   );
         });
}
function loadTextFile(f,callback,event)
{
    var fn=document.getElementById('f1').value.split(/[\\\/]/)[document.getElementById('f1').value.split(/[\\\/]/).length-1];
    var encoding=null;
    if(document && document.getElementById("txtEncoding")) { // add support for encoding
        encoding=document.getElementById("txtEncoding").value;
    }
    //alert(fn);alert((fn.endsWith(".xlsx")));
    if (fn.toLowerCase().endsWith(".xlsx")||fn.toLowerCase().endsWith(".xls")) { 
       if(document && document.getElementById("spanEncoding"))document.getElementById("spanEncoding").innerHTML="SheetName";
       readExcelFile(event,callback,fn,f,encoding);
    }
    else {
        if(document && document.getElementById("spanEncoding"))document.getElementById("spanEncoding").innerHTML="Encoding";
       (window.FileReader ? readLocalFile(f, callback, encoding) : ieReadLocalFile(f, callback, encoding));
       //(navigator.appName.search('Microsoft') > -1) ? ieReadLocalFile(f, callback, encoding) : readLocalFile(f, callback, encoding);

    }
}