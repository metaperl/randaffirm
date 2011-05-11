$(document).ready(function() {

    var Model = function() {

        var items = [],
            load = function() {
                items = JSON.parse($.cookie("model") || "[]");
            };

        this.PRIORITY = {
            IMPORTANT: 2,
            NORMAL: 1,
            LOW: 0
        };
		
        this.save = function() {
            $.cookie("model", JSON.stringify(items), { expires: 365 });
        };

        this.create = function(text, priority) {
            var result = { "text": text, "priority": priority };

            items.push(result);
            this.save();

            return result;
        };

        this.remove = function(item) {
            items.splice($(items).index(item), 1);
            this.save();
        };

        this.clear = function() {
            items = [];
            this.save();
        };

        this.getItems = function() {
            var result = [];

            for (var index = 0, max = items.length; index != max; index++) {
                result.push(items[index])
            }

            return result;
        };

        load();
    };

    var model = new Model(),
        listHeaders = [];

    (function getListHeaders() {
        $("#todoList > li[data-priority]").each(function() {
            listHeaders[parseInt($(this).attr("data-priority"))] = $(this);
        });
    })();

    var renderItemElement = function(item) {
        return $.tmpl("<li data-icon=\"delete\" class=\"item\"><a>${text}</a></li>", item)
            .data("item", item)
            .insertAfter(listHeaders[item.priority]);
    };

    $("#createButton").click(function() {
        var priority = parseInt($("#todoUrgency").val()),
            item = model.create($("#todoDescription").val(), priority);

        renderItemElement(item);

        $("#todoList").listview("refresh");
        $("#todoUrgency").val(model.PRIORITY.NORMAL.toString()).trigger("change");
        $("#todoDescription").val("");        
    });

    $("#todoList").delegate("li.item", "click", function() {
        model.remove($(this).data("item"));
        $(this).slideUp(function() {
            $(this).remove();
        });
    });

    (function renderExistingItems() {
        $(model.getItems()).each(function() {
            renderItemElement(this);
        });

        $("#todoList").listview("refresh");
    })();    
});
