function executeRequest(requestString)
{
	//%%This is so bad -- demo code
	$.get(requestString, function(data) {
	});
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
		return '<div id="big' + this.model.getId() + '" class="col-xs-6 col-sm-2"><div class="stock-widget"><img src = "' + this.model.getAlbumArt() + '"><div style="align: center; font-weight: bold;">' + this.model.getName() + '</div><div>' + this.model.getArtist() + '</div><div id="album">' + this.model.getAlbum() + '</div><div id="request"><button onclick="executeRequest(' + "'" + this.requestString + "'" + ')" type="button" class="btn btn-primary btn-sm">Request</button></div></div></div>';
		//return '<div id="big' + this.model.getId() + '" class="col-xs-6 col-sm-2"><div class="stock-widget"><img src = "' + this.model.getAlbumArt() + '"><div style="align: center; font-weight: bold;">' + this.model.getName() + '</div><div>' + this.model.getArtist() + '</div><div id="album" style="display:none;">' + this.model.getAlbum() + '</div><div id="request" style="display:none;"><button type="button" class="btn btn-primary btn-sm">Request</button></div></div></div>';
		//return '<div class="col-xs-6 col-sm-2"><div class="stock-widget"><img id = "' + this.model.getId() + '" src = "' + this.model.getAlbumArt() + '"/><div style="align: center">' + this.model.getName() + '</div><div>' + this.model.getArtist() + '</div></div></div>';
	},
	render : function ()
	{
		this.model.loadAlbumArt();
		this.element.innerHTML += '<div class="col-xs-6 col-sm-2"><div class="stock-widget"><img id = "' + this.model.getId() + '" src = "' + this.model.getAlbumArt() + '"/><div style="align: center">' + this.model.getName() + '</div><div>' + this.model.getArtist() + '</div></div></div>';
	},
}