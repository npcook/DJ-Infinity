var lfmCache = new LastFMCache();
var lastfm = new LastFM({
  apiKey    : '5685fa22a34072f2f7e1001edf39e582',
  apiSecret : 'c6c49c501c778f6c7299096a5e5a8a48',
  cache     : lfmCache
});
function ItemModel(id, name, artist, album)
{
	this.id = id;
	this.name = name;
	this.artist = artist;
	this.album = album;
	this.isLoaded = false;
	this.albumArt = "img/ajax-loader.gif";//"https://cdn3.iconfinder.com/data/icons/iconic-1/28/x-128.png";
	self = this;
	this.imageLoadEvent = new Event(this);
	//this.imageLoadEvent.attatch(function(data){
	//	this.onAlbumArtLoad = data;
	//});
	setAlbumArt = function(url){
		this.albumArt = url;
	}
	
	lastfm.album.getInfo({album: this.album, artist: this.artist}, {success: function(data){
	  html = data;
	  //jsonData = JSON.parse(data);
	  //self.albumArt = html['album']['image'][2]['#text'];
	 // self.imageLoadEvent.notify(html['album']['image'][2]['#text']);
	  //setAlbumArt(html['album']['image'][2]['#text']);
	  self.isLoaded = true;
	}, error: function(code, message){
	  this.albumArt = "invalid";
	}});
}
ItemModel.prototype = 
{
	getId : function() 
	{
		return this.id;
	},
	
	getName : function() 
	{
		return this.name;
	},
	
	getArtist : function()
	{
		return this.artist;
	},
	
	getAlbumArt : function()
	{
		return this.albumArt;
	},
	
	getAlbum : function()
	{
		return this.album;
	},
	
	getHTML : function ()
	{
		return this.html;
	},
	
	getIsLoaded : function ()
	{
		return this.isLoaded;
	},
	
	update : function()
	{
		document.getElementById(this.id).src = this.albumArt;
	},
	
	onAlbumArtLoad : function(data)
	{
		this.model.albumArt = data;
	},
	
	loadAlbumArt : function()
	{
		lastfm.album.getInfo({album: this.album, artist: this.artist}, {success: function(data){
		html = data;
		this.albumArt = html['album']['image'][2]['#text'];
		}, error: function(code, message){
			this.albumArt = "invalid";
		}});
	},
	
	contains : function(sequence)
	{
		if(this.name.indexOf(sequence) != -1 || this.artist.indexOf(sequence) != -1 || this.album.indexOf(sequence) != -1)
		{
			return true;
		}
		
		return false;
	}
}
	
	//this.lastFMObj = obj['album']['image'][2]['#text'];
	
	