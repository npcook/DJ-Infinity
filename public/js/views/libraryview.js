function SearchModel()
{
	this.searches = [];
}

SearchModel.prototype = 
{
	addSearch : function(search)
	{
		this.searches.push(search);
	},
	
	removeSearch : function()
	{
		this.searches.pop();
	},
	
	getPreviousSearch : function()
	{
		if(this.searches.length == 0)
		{
			return null;
		}
		return this.searches[this.searches.length - 1];
	},
	
	clear : function ()
	{
		this.searches = [];
	}
}

function LibraryView(LibraryModel, element)
{
	this.model = LibraryModel;
	this.searchModel = new SearchModel();
	this.element = element;
	this.elementsPerRow = 6;
	
	this.elementCount = 0;
	
	var numRows = 0;
}
LibraryView.prototype =
{
	getModel : function() 
	{
		return this.model;
	},
	
	render : function()
	{
		$(this.element).empty();
		this.numRows = Math.ceil(this.model.getLastId()/this.elementsPerRow);
		for(var i = 0; i < this.numRows; i++)
		{
			//element.innerHTML += '<div id="librow" + i + "></div>';
			$(this.element).append('<div id="librow' + i + '" class="row"></div>');
		}
		elementArray = this.model.getCurrentView();
		var currentRow = 0;
		for(var i = 0; i < elementArray.length; i++)
		{
			if(i != 0 && i % this.elementsPerRow == 0)
			{
				currentRow++;
			}
			$('#librow' + currentRow).append('<div id="musicParent' + i + '"></div>');
			elementArray[i].render();
			elementArray[i].beginAlbumArtLoad(elementArray[i]);
			//$('#librow' + currentRow).append(elementArray[i].getItemAsHTML());
		}
		/**
			Just to work
			*/
		
		this.elementCount += elementArray.length;
	},
	
	loadMore : function(amount)
	{	
		elementArray = this.model.pageForward(amount);
		var moreRows = Math.ceil(elementArray.length/this.elementsPerRow);
		for(var i = this.numRows; i < this.numRows + moreRows; i++)
		{
			$(this.element).append('<div id="librow' + i + '" class="row""></div>');
		}
		
		var currentRow = this.numRows - 1;
		//this.numRows += moreRows;
		
		for(var i = 0; i < elementArray.length; i++)
		{
			if( i + this.elementCount != 0 && (i + this.elementCount) % this.elementsPerRow == 0)
			{
				currentRow++;
			}
			$('#librow' + currentRow).append('<div id="musicParent' + elementArray[i].model.getId() + '"></div>');
			elementArray[i].render();
			elementArray[i].beginAlbumArtLoad(elementArray[i]);
			//$('#librow' + currentRow).append(elementArray[i].getItemAsHTML());
		}
		
		this.numRows += moreRows;
		this.elementCount += elementArray.length;
	},
	
	/*renderSearch : function(sequence)
	{
		elementArray = search(sequence);
		var rows = Math.ceil(elementArray.length/this.elementsPerRow);
		$(this.element).empty();
		for(var i = this.numRows; i < this.numRows + moreRows; i++)
		{
			$(this.element).append('<div id="librow' + i + '" class="row""></div>');
		}
		
		for(var i = 0; i < elementArray.length; i++)
		{
			$('#librow' + i).append(elementArray[i].getItemAsHTML());
		}
	},*/
	
	renderSearch : function(sequence, direction) //right is 1, left is -1
	{
		if(direction >= 1)
		{
			if(this.searchModel.getPreviousSearch() != null)
			{
				elementArray = this.model.searchArray(sequence, this.searchModel.getPreviousSearch());
			} else {
				elementArray = this.model.search(sequence);
			}
			this.searchModel.addSearch(elementArray);
		} else if(direction == 0) {
			elementArray = this.model.search(sequence);
			this.searchModel.addSearch(elementArray);
		} else {
			this.searchModel.removeSearch();
			if(this.searchModel.getPreviousSearch() == null)
			{
				this.render();
				return;
			}
			elementArray = this.model.searchArray(sequence, this.searchModel.getPreviousSearch());
		}
		
		$(this.element).empty();
		var rows = Math.ceil(elementArray.length/this.elementsPerRow);
		for(var i = 0; i < rows; i++)
		{
			$(this.element).append('<div id="librow' + i + '" class="row""></div>');
		}
		var currentRow = 0;
		for(var i = 0; i < elementArray.length; i++)
		{
			if( i != 0 && i % this.elementsPerRow == 0)
			{
				currentRow++;
			}
			$('#librow' + currentRow).append(elementArray[i].getItemAsHTML());
		}
		$('#search').removeAttr('disabled');
	},

	updateSearch : function(sequence, inArray)
	{
		elementArray = search(sequence);
		var rows = Math.ceil(elementArray.length/this.elementsPerRow);
		$(this.element).empty();
		for(var i = this.numRows; i < this.numRows + moreRows; i++)
		{
			$(this.element).append('<div id="librow' + i + '" class="row""></div>');
		}
		
		for(var i = 0; i < elementArray.length; i++)
		{
			$('#librow' + i).append(elementArray[i].getItemAsHTML());
		}
	}
}