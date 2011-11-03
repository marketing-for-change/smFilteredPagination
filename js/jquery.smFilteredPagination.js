/*
 * smFilteredPagination - jQuery pagination that also handles
 * dynamically filtered items
 * version: 0.6
 *
 * Copyright (c) 2011 Tyler Mulligan, SalterMitchell
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * More at http://www.github.com/saltermitchell
 * and http://www.saltermitchell.com
 * 
 */
;(function($) {
    $.smFilteredPagination = function(el, options) {

        var isNumber = new RegExp("^[0-9]+$");

        var defaults = {
            pagerItems: "div.item",             // item class
            pagerItemsWrapper: "div.results",   // item wrapping class or id
            pagerClass: "pagination",           // pager class
            pagerHeader: "pagerHeader",         // header pager id
            pagerFooter: "pagerFooter",         // footer pager id
            itemsPerPage: 6,                    // items per page
            itemsInPager: 6,                    // max items displayed in pager (didn't do this yet)
            itemsInPagerEdge: 2,                // max items displayed in pager edges (didn't do this yet)
            itemsInPagerContinued: "...",       // text to display when page numbers are hidden
            showPagerHeader: true,              // show header pager?
            showPagerFooter: true,              // show footer pager?
            showFirst: true,                    // show "first"
            showPrev: true,                     // show "prev"
            showNext: true,                     // show "next"
            showLast: true,                     // show "last"
            showOnZero: false,                  // show pagination on zero results
            showOnOne: false,                   // show pagination on one page of results
            textFirst: "First",                 // "first" text
            textPrev: "Previous",               // "prev" text
            textNext: "Next",                   // "next" text
            textLast: "Last",                   // "last" text
            hiddenClass: "hide",                // name of hidden class
            filteredClassList: ".filtered",     // comma separated list of filtered classes
            scrollToTopOnChange: false,         // Scroll to the top of the page on change.
            handleLocationHash: true,           // handle page numbers with the location hash, page.php#5
            locationHashHandler: function(pl) { // function to handle the page hash on page load
                var page = location.hash.split("#")[1];
                if (isNumber.test(page)) { pl.setCurrentPage(page); }
            },
            locationHashUpdate: function(page) { // function to handle the page hash on update
                location.hash = page;
            },
            insertPagerHeader: function(el) {   // insertPagerHeader function, automatically inserts pagerHeader if not found and show is true
                var pagerContents = '<div id="' + this.pagerHeader + '" class="' + this.pagerClass + '"></div>';
                if ($("#"+this.pagerHeader).length) { $("#"+this.pagerHeader).html(pagerContents); }
                else { $(el).prepend(pagerContents); }
            },
            insertPagerFooter: function(el) {   // insertPagerFooter function, automatically inserts pagerFooter if not found and show is true
                var pagerContents = '<div id="' + this.pagerFooter + '" class="' + this.pagerClass + '"></div>';
                if ($("#"+this.pagerFooter).length) { $("#"+this.pagerFooter).html(pagerContents); }
                else { $(el).append(pagerContents); }
            }
        };

        var plugin = this;
        
        plugin.settings = {};

        var init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.el = el;

            plugin.settings.currentPage = 1;
            plugin.settings.pageCount = 1;

            // setup ids and classes with their prefixes to keep the code below clean
            plugin.settings.tpagerClass   = "."+plugin.settings.pagerClass;
            plugin.settings.tpagerHeader  = "#"+plugin.settings.pagerHeader;
            plugin.settings.tpagerFooter  = "#"+plugin.settings.pagerFooter;

            plugin.rebuild();
    
            plugin.el.find(plugin.settings.tpagerClass+" li a").live("click",function(e) {
                e.preventDefault();
                plugin.settings.currentPage = (plugin.el.find(plugin.settings.tpagerClass+" li a.current").length) ? parseInt(plugin.el.find(plugin.settings.tpagerClass+" li a.current").attr("href").split("#")[1]) : 1;

                var clickedPage = $(this).attr("href").split("#")[1];

                plugin.setCurrentPage(clickedPage);

            }); /* end click action */

            if (plugin.settings.handleLocationHash) { // setup location hash handler
                if (location.hash!="#" && location.hash!="" && location.hash!=null) {
                    plugin.settings.locationHashHandler(plugin);
                }
            }
    
            return plugin.el;
        }; // init

        // Used to assist in pager overflow management
        var getInterval = function(pageCount,selectedPage)  {
            var halfItemsInPager = Math.ceil(plugin.settings.itemsInPager/2);
            var currentPage = parseInt(selectedPage);
            var upperLimit = pageCount-plugin.settings.itemsInPager;
            var start = (currentPage > halfItemsInPager) ? Math.max(Math.min(currentPage-halfItemsInPager, upperLimit), 1) : 1;
            var end = (currentPage > halfItemsInPager) ? Math.min(currentPage+halfItemsInPager, pageCount) : Math.min(plugin.settings.itemsInPager, pageCount);
            return [start,end];
        };

        var buildPager = function(pager,pageCount,selectedPage) {
            var list = '<ul>';
            if (pageCount > 0 || plugin.settings.showOnZero) {
                if (pageCount > 1 || plugin.settings.showOnOne) {
                    var interval = getInterval(pageCount,selectedPage);

                    if (plugin.settings.showFirst && pageCount > 1) { list += '<li><a href="#first" class="first">'+plugin.settings.textFirst+'</a></li>'; }
                    if (plugin.settings.showPrev && pageCount > 1) { list += '<li><a href="#prev" class="prev">'+plugin.settings.textPrev+'</a></li>'; }

                    // Generate starting points
                    if (interval[0] > 1 && plugin.settings.itemsInPagerEdge > 0) {
                        var end = Math.min(plugin.settings.itemsInPagerEdge, interval[0]);
                        for (var i=1; i < end; i++) {
                           list += '<li><a href="#'+i+'">'+i+'</a></li>';
                        }
                        if (plugin.settings.itemsInPagerEdge < interval[0] && plugin.settings.itemsInPagerContinued) {
                           list += "<span>"+plugin.settings.itemsInPagerContinued+"</span>";
                        }
                    }
                    // Generate interval links
                    for (var i=interval[0]; i <= interval[1]; i++) {
                        var classify = (i==selectedPage) ? ' class="current"' : '';
                        list += '<li><a href="#'+i+'"'+classify+'>'+i+'</a></li>';
                    }
                    // Generate ending points
                    if (interval[1] < pageCount && plugin.settings.itemsInPagerEdge > 0) {
                        if (pageCount-plugin.settings.itemsInPagerEdge > interval[1] && plugin.settings.itemsInPagerContinued) {
                           list += "<span>"+plugin.settings.itemsInPagerContinued+"</span>";
                        }
                        var begin = Math.max(pageCount-plugin.settings.itemsInPagerEdge, interval[1])+1;
                        for (var i=begin; i <= pageCount; i++) {
                           list += '<li><a href="#'+i+'">'+i+'</a></li>';
                        }
                    }
                    
                    if (plugin.settings.showNext && pageCount > 1) { list += '<li><a href="#next" class="next">'+plugin.settings.textNext+'</a></li>'; }
                    if (plugin.settings.showLast && pageCount > 1) { list += '<li><a href="#last" class="last">'+plugin.settings.textLast+'</a></li>'; }
                }
            }
            list += "</ul>";
            $(pager).html(list);
        };
        
        var setupPages = function(currentPage) {
            var currentPage = typeof(currentPage) != 'undefined' ? currentPage : 1;
            plugin.el.find(plugin.settings.pagerItems,plugin.settings.pagerItemsWrapper).filter(plugin.settings.filteredClassList).addClass("hide");
            plugin.el.find(plugin.settings.pagerItems,plugin.settings.pagerItemsWrapper).not(plugin.settings.filteredClassList).addClass(plugin.settings.hiddenClass).slice(currentPage-1,plugin.settings.itemsPerPage).removeClass(plugin.settings.hiddenClass);
        };

        plugin.setItemsPerPage = function(n) {
            plugin.settings.itemsPerPage = parseInt(n);
            plugin.rebuild();
        };

        plugin.setCurrentPage = function(clickedPage) {
            var currentPage = plugin.settings.currentPage;
            var pageCount = Math.ceil(plugin.el.find(plugin.settings.pagerItems,plugin.settings.pagerItemsWrapper).not(plugin.settings.filteredClassList).length/plugin.settings.itemsPerPage);

            plugin.el.find(plugin.settings.tpagerClass+" li a").removeClass("current");

            if (isNumber.test(clickedPage)) {
                clickedPage = parseInt(clickedPage);
                var selectedPage = (clickedPage > pageCount) ? pageCount : clickedPage;
                var start = (selectedPage-1)*plugin.settings.itemsPerPage;
                var end = ((selectedPage-1)*plugin.settings.itemsPerPage)+plugin.settings.itemsPerPage;
            } else {
                if (clickedPage == "first") {
                    var selectedPage = 1;
                    var start = 0;
                    var end = plugin.settings.itemsPerPage;
                } else if (clickedPage == "prev") {
                    var selectedPage = (currentPage<2) ? 1 : parseInt(currentPage)-1; // don't allow going past 1
                    var start = (selectedPage-1)*plugin.settings.itemsPerPage;
                    var end = ((selectedPage-1)*plugin.settings.itemsPerPage)+plugin.settings.itemsPerPage;
                } else if (clickedPage == "next") {
                    var selectedPage = (currentPage>=pageCount) ? pageCount : parseInt(currentPage)+1; // don't allow going past last
                    var start = (selectedPage-1)*plugin.settings.itemsPerPage;
                    var end = ((selectedPage-1)*plugin.settings.itemsPerPage)+plugin.settings.itemsPerPage;
                } else { // assume .last
                    var selectedPage = pageCount;
                    var start = (selectedPage-1)*plugin.settings.itemsPerPage;
                    var end = ((selectedPage-1)*plugin.settings.itemsPerPage)+plugin.settings.itemsPerPage;
                }
            }
            plugin.el.find(plugin.settings.pagerItems,plugin.settings.pagerItemsWrapper).not(plugin.settings.filteredClassList).addClass(plugin.settings.hiddenClass).slice(start,end).removeClass(plugin.settings.hiddenClass);
            if (plugin.settings.showPagerHeader) { buildPager(plugin.settings.tpagerHeader,pageCount,selectedPage); }
            if (plugin.settings.showPagerFooter) { buildPager(plugin.settings.tpagerFooter,pageCount,selectedPage); }
            
            if (plugin.settings.scrollToTopOnChange) {
                var pagingPosition = plugin.el.position();
                $("body,html,document").scrollTop(pagingPosition.top);
            }
            plugin.settings.currentPage = selectedPage;
            if (plugin.settings.handleLocationHash) { plugin.settings.locationHashUpdate(selectedPage); }
        }

        plugin.getItemsPerPage = function(n) {
            return plugin.settings.itemsPerPage;
        };

        plugin.getCurrentPage = function(n) {
            return plugin.settings.currentPage;
        };

        plugin.getPageCount = function() {
            return plugin.settings.pageCount;
        };

        plugin.addItems = function(page) {
            $.post(page, function(data) {
                plugin.el.children(plugin.settings.pagerItemsWrapper).append(data);
                plugin.rebuild();
            });
        };

        plugin.rebuild = function() {
            var pageCount = Math.ceil(plugin.el.find(plugin.settings.pagerItems,plugin.settings.pagerItemsWrapper).not(plugin.settings.filteredClassList).length/plugin.settings.itemsPerPage);
            plugin.settings.pageCount = pageCount;
            plugin.settings.currentPage = 1;
            if (plugin.settings.showPagerHeader) {
                plugin.settings.insertPagerHeader(plugin.el);
                buildPager(plugin.settings.tpagerHeader,pageCount,plugin.settings.currentPage);
            }
            if (plugin.settings.showPagerFooter) {
                plugin.settings.insertPagerFooter(plugin.el);
                buildPager(plugin.settings.tpagerFooter,pageCount,plugin.settings.currentPage);
            }
            setupPages(1);
        };
    
        init();

    } // $.smFilteredPagination
})(jQuery);
