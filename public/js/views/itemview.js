function executeRequest(requestString)
{
	//%%This is so bad -- demo code
	$.get(requestString, function(data) {
	});
}
function hovering(elementName)
{
	$(elementName).find('div#album').css("opacity", 0.0);
	$(elementName).find('div#request').css("opacity", 0.0);	
	$(elementName).find('div#album').css("display", "inline"); 
	$(elementName).find('div#request').css("display", "inline"); 
	$(elementName).find('div#album').fadeTo(350, 1.0);
	$(elementName).find('div#request').fadeTo(350, 1.0);
}
function notHovering(elementName)
{
	$(elementName).find('div#album').css("display", "none");
	$(elementName).find('div#request').css("display", "none");
}
function ItemView(itemModel, element)//, badcode) 
{
	this.model = itemModel;
	this.elementName = '#big' + this.model.getId();
	this.element = element;
	this.elementId = 'big' + this.model.getId();
	this.onHoverStart = new Event(this);
	this.onHoverEnd = new Event(this);
	this.badcode = element;//"CD";
	//this.requestButtonClick = new Event(this);
	this.requestString = "http://djinfinity.cloudapp.net/request/" + this.badcode + "/" + this.model.getName() + "/" + this.model.getArtist(); //%%This is so bad -- demo code
	$(this.elementName).hover(
	function() { 
		this.onHoverStart.notify();
		}, function()
		{ 
		this.onHoverEnd.notify(); }
		);
	//$(this.elementName).hover(function() { this.hoverOn(); }, function() { this.hoverOff(); });
}
ItemView.prototype =
{
	attatchEvents : function ()
	{
		$(this.elementName).hover(
	function() { 
		this.onHoverStart.notify();
		}, function()
		{ 
		this.onHoverEnd.notify(); }
		);
	},
	
	getModel : function() 
	{
		return this.model;
	},
	getItemAsHTML : function ()
	{
		return '<div id="big' + this.model.getId() + '" class="col-xs-6 col-sm-2"><div class="song-widget" onmouseover="hovering(' + "'" + this.elementName + "'" +')" onmouseout="notHovering(' + "'" + this.elementName + "'" + ')"><img id="albimg" style="margin-top: 3px;" src = "' + this.model.getAlbumArt() + '"/><div id="marquee' + this.model.getId() + '" style="align: center; font-weight: bold;" class="mymarquee">' + this.model.getName() + '</div><div>' + this.model.getArtist() + '</div><div id="request" style="display:none;"><button onclick="executeRequest(' + "'" + this.requestString + "'" + ')" type="button" class="btn btn-primary btn-sm">Request</button></div></div></div>';
		//return '<div id="big' + this.model.getId() + '" class="col-xs-6 col-sm-2"><div class="stock-widget"><img src = "' + this.model.getAlbumArt() + '"><div style="align: center; font-weight: bold;">' + this.model.getName() + '</div><div>' + this.model.getArtist() + '</div><div id="album" style="display:none;">' + this.model.getAlbum() + '</div><div id="request" style="display:none;"><button type="button" class="btn btn-primary btn-sm">Request</button></div></div></div>'; //<div id="album" style="display:none;">' + this.model.getAlbum() + '</div>
		//return '<div class="col-xs-6 col-sm-2"><div class="stock-widget"><img id = "' + this.model.getId() + '" src = "' + this.model.getAlbumArt() + '"/><div style="align: center">' + this.model.getName() + '</div><div>' + this.model.getArtist() + '</div></div></div>';
	},
	render : function()
	{
		$(this.element).empty();
		$(this.element).append(this.getItemAsHTML());
		$('#marquee' + this.model.getId()).marquee();
	},
	completeAlbumArtLoad : function(data)
	{
		if(data == null || data == "" || data.indexOf('http') == -1)
		{
			this.model.albumArt = "invalid";
		} else {
			this.model.albumArt = data;
		}
		this.render();
	},
	//ERROR JSON : {"error":6,"message":"Artist not found","links":[]}
	beginAlbumArtLoad : function(view)
	{
		//self = this;
		$.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=5685fa22a34072f2f7e1001edf39e582&artist=" + this.model.getArtist() + "&album=" + this.model.getAlbum() + "&format=json",
		dataType: "jsonp",
		success: function(data) {
			if(data.hasOwnProperty('error') == false)
			{
				view.completeAlbumArtLoad(data['album']['image'][1]['#text']);
			} else {
				view.completeAlbumArtLoad(null);
			}
		},
		failure: function(data) {
			view.model.albumArt = "invalid";
		}
		});
	}
	/*render : function ()
	{
		this.model.loadAlbumArt();
		this.element.innerHTML += '<div class="col-xs-6 col-sm-2"><div class="stock-widget"><img id = "' + this.model.getId() + '" src = "' + this.model.getAlbumArt() + '"/><div style="align: center">' + this.model.getName() + '</div><div>' + this.model.getArtist() + '</div></div></div>';
	},*/
}