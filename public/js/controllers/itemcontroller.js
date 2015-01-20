function ItemController(model, view)
{
	this.model = model;
	this.view = view;
	this.elementName = view.elementName;
	
	this.view.onHoverStart.attach(function(){
		this.hoverOn();
	});
	
	this.view.onHoverEnd.attach(function(){
		this.hoverOff();
	});
}

ItemController.prototype = 
{
	attatchEvents : function()
	{
		this.view.onHoverStart.attach(function(){
		this.hoverOn();
		});
	
		this.view.onHoverEnd.attach(function(){
			this.hoverOff();
		});
	},
	
	hoverOn : function()
	{
		$(this.elementName).find('div#album').css("opacity", 0.0);
		$(this.elementName).find('div#request').css("opacity", 0.0);	
		$(this.elementName).find('div#album').css("display", "inline"); 
		$(this.elementName).find('div#request').css("display", "inline"); 
		$(this.elementName).find('div#album').fadeTo(350, 1.0);
		$(this.elementName).find('div#request').fadeTo(350, 1.0);
	},
	
	hoverOff : function()
	{
		$(elementName).find('div#album').css("display", "none");
		$(elementName).find('div#request').css("display", "none");
	}
}