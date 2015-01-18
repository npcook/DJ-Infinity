function LibraryModel(items, maxPerPage)
{
	this.items = items;
	this.currentSelection = -1;
	this.firstId = 0;
	this.lastId = maxPerPage;
	if(items.length < maxPerPage)
	{
		this.lastId = items.length;
	}
	this.maxPerPage = maxPerPage;
}
LibraryModel.prototype = 
{
	getItems : function()
	{
		return this.items;
	},
	
	getItemAtIndex : function(index)
	{
		return items[index];
	},
	
	addItem : function(item)
	{
		items.push(item);
	},
	
	getCurrentSelection : function()
	{
		return this.currentSelection;
	},
	
	getLastId : function()
	{
		return this.lastId;
	},
	
	maxPerPage : function()
	{
		return this.maxPerPage;
	},
	
	getCurrentView : function()
	{
		returnArray=[];
		for(var i= this.firstId; i < this.lastId; i++)
		{
			returnArray.push(this.items[i]);
		}
		
		return returnArray;
	},
	
	pageForward : function (numItems)
	{
		returnArray = [];
		var endId = this.lastId + numItems;
		if(this.lastId + numItems > this.items.length)
		{
			endId = this.items.length;
		}
		for(var i = this.lastId; i < endId; i++)
		{
			returnArray.push(this.items[i]);
		}
		this.lastId += numItems;
		
		return returnArray;
	},
	
	search : function(sequence)
	{
		returnArray = [];
		for(var i = 0; i < this.items.length; i++)
		{
			if(this.items[i].model.contains(sequence) == true)
			{
				returnArray.push(this.items[i]);
			}
		}
		
		return returnArray;
	},
	
	searchArray : function(sequence,inArray)
	{
		returnArray = [];
		for(var i = 0; i < inArray.length; i++)
		{
			if(inArray[i].model.contains(sequence) == true)
			{
				returnArray.push(inArray[i]);
			}
		}
		
		return returnArray;
	},
	
	greaterThanMaxItems : function(amount)
	{
		if(amount > this.items.length)
			return true;
		return true;
	}
}