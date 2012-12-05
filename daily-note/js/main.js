$(document).ready(function() {
	
	//--------------------------vars-------------------------------
	
	var state = true;
	var oldNoteTitle;
	var oldNoteBody;
	
	

	//--------------------------pointers-------------------------------
	
	//--- note
	var noteSave = $("#note-save");
	var noteDate = $("#note-date");
	var noteNewDate = $("#note-new-date");
	var noteThisDate = $("#note-this-date");
	var noteTitle = $("#note-title");
	var noteTitlePlaceholder = $("#note-title-placeholder");
	var noteBody = $("#note-body");
	var noteBodyPlaceholder = $("#note-body-placeholder");
	var noteContents = $("#note-body,#note-title,#note-this-date");
	
	//---- links
	var linkToday = $(".link-today");
	

	//-----------------------texts------------------------------------
	
	var textSave = "Save";
	var textSaving = "Saving...";
	var textSaved = "Saved";
	var textError = "Error";
	var textErrorDataNotSaved = "Error, Data not saved...";
	


	//-----------------------URLs------------------------------------

	var URLSavenote = '/savenote';
	var URLHome = '/';
	var URLToday = '/today';
	var URLModernBrowser = '/modernbrowser';
	var URLImageCalendar = 'images/calendar.gif';
	
	
	
	//--------------------------UI---------------------------------
	
	//---- datepicker
	noteNewDate.datepicker({
			buttonImage: URLImageCalendar,
			buttonImageOnly: true,
			changeMonth: true,
			changeYear: true,
			showOn: 'both',
			dateFormat: 'yy-mm-dd'
		 });
	noteDate.click(function() {
		noteNewDate.datepicker( "show" );
	});
	
	
	noteNewDate.change( function() {
		goToURL(getURL({"date": noteNewDate.val() }));		  
		
	});
	
	//---- placeholders
	
	function checkPlaceholders(){
		if(noteTitle.html().trim()==""){
			noteTitlePlaceholder.show();		
			noteTitle.hide();
		}		
		if(noteBody.html().trim()==""){
			noteBodyPlaceholder.show();		
			noteBody.hide();
		}		
	}
	checkPlaceholders();
	
	
	noteTitlePlaceholder.click(function(){
		noteTitlePlaceholder.hide();
		noteTitle.show();
		noteTitle.focus();
	});
	
	noteBodyPlaceholder.click(function(){
		noteBodyPlaceholder.hide();
		noteBody.show();
		noteBody.focus();
	});
	
	//--------------------------save-------------------------------------
	//----- ajax save call 
	noteSave.click(function() {
		saveAsync();
	});
	
	function saveSync(){
		$.ajax({
			  type: 'POST',
			  url: URLSavenote,
			  data: noteData(),
			  async:false,
			  beforeSend: function(){
				  noteSave.html(textSaving);
				},
			})
			.success(function() { state = true; noteSave.html(textSaved) })
		    .error(function() { state = false; noteSave.html(textError) });		
	}
	
	function saveAsync(){
		$.ajax({
			  type: 'POST',
			  url: URLSavenote,
			  data: noteData(),
			  async:true,
			  beforeSend: function(){
				  noteSave.html(textSaving);
				},
			})
			.success(function() { state = true; noteSave.html(textSaved) })
		    .error(function() { state = false; noteSave.html(textSave)});		
	}
	
	function noteData(){
		return { 
			note_date: noteThisDate.val(), 
			note_title: noteTitle.html(), 
			note_body: noteBody.html() 
			}		
	}
	
	//------ contenteditables changes
	/*noteContents.keypress(function() {
	    noteChanged();
	});*/
	/*
	 noteContents.blur(function() {
	    if(!state){
	    	saveAsync();
		}
	    checkPlaceholders();
	});
	
	  
	  
	 noteContents.keydown(function() {
	    noteChanged();
	});
	
	function noteChanged() {
	    state = false; 
	    noteSave.html(textSave); 
	};*/
	
	//todo:
	noteContents.focus(function() {
		setOldNoteContent();
	    state = false; 
		noteSave.html(textSave);
	});
		
	noteContents.blur(function() {
	    if(isNoteContentChanged()){
	    	saveAsync();
		}else{			
			noteSave.html(textSaved);
		    state = true; 
		}
	    checkPlaceholders();
	});
	
	    
	function setOldNoteContent() {
	    oldNoteTitle = noteTitle.html();
	    oldNoteBody= noteBody.html();
	};

	function isNoteContentChanged(){
		return (oldNoteTitle != noteTitle.html() || oldNoteBody != noteBody.html())?  true: false;		
	}
	
	
		
	//-----------------------URL Functions------------------------------------
	
	
	function getURL(extraParameters) {
	    var theUrl = location.protocol + '//' + location.host // + location.pathname;
	    var extraParametersEncoded = $.param(extraParameters);
	    var seperator = theUrl.indexOf('?') == -1 ? "?" : "&";
	    return(theUrl + seperator + extraParametersEncoded);
	}
	
	function goToURL(url){
		if(!state)saveSync();
		if(state){
			window.location.href = url	;
		}else{
			alert(textErrorDataNotSaved);			
		}
	}
	
	//-----------------------links actions------------------------------------	
	linkToday.click(function(){		
		goToURL(URLToday);		
		return false;
	});

 });
